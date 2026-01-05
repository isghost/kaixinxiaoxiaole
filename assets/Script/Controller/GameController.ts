import { _decorator, Component, Node, AudioSource, find, Label } from 'cc';
const { ccclass, property } = _decorator;

import GameModel from "../Model/GameModel";
import Toast from '../Utils/Toast';
import { GridView } from '../View/GridView';
import { Vec2 } from 'cc';
import LevelManager from '../Model/LevelManager';
import { DEFAULT_LEVELS } from '../Model/LevelData';

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    public grid: Node | null = null;
    
    @property(Node)
    public audioButton: Node | null = null;
    
    @property(AudioSource)
    public audioSource: AudioSource | null = null;
    
    @property(Node)
    public levelInfoNode: Node | null = null;
    
    private gameModel: GameModel | null = null;
    private levelManager: LevelManager | null = null;
    private uiUpdateTimer: number = 0;

    onLoad(): void {
        console.log("GameController.onLoad: Starting initialization");
        
        if (this.node.parent) {
            let audioButton = this.node.parent.getChildByName('audioButton');
            if (audioButton) {
                audioButton.on('click', this.callback, this);
                console.log("GameController.onLoad: Audio button listener registered");
            }
        }
        
        // Initialize level manager and register levels
        this.levelManager = LevelManager.getInstance();
        this.levelManager.registerLevels(DEFAULT_LEVELS);
        console.log("GameController.onLoad: Level manager initialized with default levels");
        
        // Initialize game model with current level
        this.gameModel = new GameModel();
        const currentLevelConfig = this.levelManager.getCurrentLevelConfig();
        if (currentLevelConfig) {
            this.gameModel.initWithLevel(currentLevelConfig);
            console.log(`GameController.onLoad: GameModel initialized with Level ${currentLevelConfig.getLevel()}`);
        } else {
            this.gameModel.init(4);
            console.log("GameController.onLoad: GameModel initialized with default settings");
        }
        
        if (this.grid) {
            console.log("GameController.onLoad: Grid node found");
            var gridScript = this.grid.getComponent(GridView);
            if (gridScript) {
                console.log("GameController.onLoad: GridView component found");
                gridScript.setController(this);
                gridScript.initWithCellModels(this.gameModel.getCells());
                console.log("GameController.onLoad: GridView initialized with models");
            } else {
                console.error("GameController.onLoad: GridView component NOT found on grid node!");
            }
        } else {
            console.error("GameController.onLoad: Grid node is NULL!");
        }
        
        // Find audio source from scene
        const gameSceneNode = find('Canvas/GameScene');
        if (gameSceneNode) {
            this.audioSource = gameSceneNode.getComponent(AudioSource);
            console.log(`GameController.onLoad: Audio source ${this.audioSource ? 'found' : 'not found'}`);
        }
        
        // Update UI initially
        this.updateLevelUI();
        
        console.log("GameController.onLoad: Initialization complete");
    }

    update(dt: number): void {
        // Update UI periodically
        this.uiUpdateTimer += dt;
        if (this.uiUpdateTimer >= 0.1) { // Update every 100ms
            this.updateLevelUI();
            this.uiUpdateTimer = 0;
        }
    }

    callback(): void {
        if (!this.audioSource) return;
        
        // In Cocos 3.x, check if audio is playing
        const isPlaying = this.audioSource.playing;
        if (isPlaying) {
            this.audioSource.pause();
            Toast('关闭背景音乐🎵');
        } else {
            this.audioSource.play();
            Toast('打开背景音乐🎵');
        }
    }

    selectCell(pos: Vec2): any {
        console.log(`GameController.selectCell: Called with position (${pos.x}, ${pos.y})`);
        
        if (!this.gameModel) {
            console.error("GameController.selectCell: No game model!");
            return null;
        }
        
        // Check if game is over
        if (this.gameModel.isGameOver()) {
            this.handleGameOver();
            return null;
        }
        
        const result = this.gameModel.selectCell(pos);
        console.log(`GameController.selectCell: Returning result with ${result[0].length} models`);
        
        // Check win/lose conditions after move
        this.scheduleOnce(() => {
            this.checkGameState();
        }, 1.0);
        
        return result;
    }
    
    /**
     * Update level UI (score, moves, etc.)
     */
    private updateLevelUI(): void {
        if (!this.gameModel || !this.levelInfoNode) {
            return;
        }
        
        const levelConfig = this.gameModel.getLevelConfig();
        if (!levelConfig) {
            return;
        }
        
        // Try to find and update UI labels
        const levelLabel = this.levelInfoNode.getChildByName('LevelLabel');
        if (levelLabel) {
            const labelComp = levelLabel.getComponent(Label);
            if (labelComp) {
                labelComp.string = `关卡 ${levelConfig.getLevel()}`;
            }
        }
        
        const scoreLabel = this.levelInfoNode.getChildByName('ScoreLabel');
        if (scoreLabel) {
            const labelComp = scoreLabel.getComponent(Label);
            if (labelComp) {
                labelComp.string = `分数: ${this.gameModel.getScore()}`;
            }
        }
        
        const movesLabel = this.levelInfoNode.getChildByName('MovesLabel');
        if (movesLabel) {
            const labelComp = movesLabel.getComponent(Label);
            if (labelComp) {
                labelComp.string = `剩余步数: ${this.gameModel.getRemainingMoves()}`;
            }
        }
    }
    
    /**
     * Check game state and handle win/lose
     */
    private checkGameState(): void {
        if (!this.gameModel || !this.levelManager) {
            return;
        }
        
        if (this.gameModel.isGameOver()) {
            this.handleGameOver();
        }
    }
    
    /**
     * Handle game over
     */
    private handleGameOver(): void {
        if (!this.gameModel || !this.levelManager) {
            return;
        }
        
        const levelComplete = this.gameModel.checkLevelComplete();
        const score = this.gameModel.getScore();
        const stars = this.gameModel.getStarsEarned();
        const levelConfig = this.gameModel.getLevelConfig();
        
        if (levelComplete) {
            // Win!
            if (levelConfig) {
                this.levelManager.completeLevel(levelConfig.getLevel(), score, stars);
                Toast(`🎉 关卡完成！得分: ${score} ⭐ x ${stars}`);
            }
        } else {
            // Lose
            Toast(`😢 关卡失败！得分: ${score}`);
        }
    }
    
    /**
     * Restart current level
     */
    public restartLevel(): void {
        if (!this.levelManager || !this.gameModel) {
            return;
        }
        
        const currentLevelConfig = this.levelManager.getCurrentLevelConfig();
        if (currentLevelConfig) {
            this.gameModel.initWithLevel(currentLevelConfig);
            
            if (this.grid) {
                const gridScript = this.grid.getComponent(GridView);
                if (gridScript) {
                    gridScript.initWithCellModels(this.gameModel.getCells());
                }
            }
            
            Toast('重新开始');
        }
    }
    
    /**
     * Go to next level
     */
    public nextLevel(): void {
        if (!this.levelManager || !this.gameModel) {
            return;
        }
        
        if (this.levelManager.nextLevel()) {
            const nextLevelConfig = this.levelManager.getCurrentLevelConfig();
            if (nextLevelConfig) {
                this.gameModel.initWithLevel(nextLevelConfig);
                
                if (this.grid) {
                    const gridScript = this.grid.getComponent(GridView);
                    if (gridScript) {
                        gridScript.initWithCellModels(this.gameModel.getCells());
                    }
                }
                
                Toast(`进入关卡 ${nextLevelConfig.getLevel()}`);
            }
        } else {
            Toast('没有更多关卡了');
        }
    }

    cleanCmd(): void {
        if (this.gameModel) {
            this.gameModel.cleanCmd();
        }
    }

}
