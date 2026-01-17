import { _decorator, Component, Node, AudioSource, find, Canvas, UITransform, Vec3, Label, Color, Graphics, director } from 'cc';
const { ccclass, property } = _decorator;

import GameModel from "../Model/GameModel";
import { LevelConfig, LevelConfigService } from "../Model/Level/LevelConfig";
import { LevelSession } from "../Model/Level/LevelSession";
import { LevelState } from "../Model/Level/LevelState";
import { evaluateStarFormula } from "../Model/Level/LevelFormula";
import { LevelProgress } from "../Model/Level/LevelProgress";
import Toast from '../Utils/Toast';
import { GridView } from '../View/GridView';
import { Vec2 } from 'cc';

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    public grid: Node | null = null;
    
    @property(Node)
    public audioButton: Node | null = null;
    
    @property(AudioSource)
    public audioSource: AudioSource | null = null;
    
    private gameModel: GameModel | null = null;
    private levelConfig: LevelConfig | null = null;
    private levelState: LevelState | null = null;
    private isLevelEnded: boolean = false;
    private hudNode: Node | null = null;
    private scoreLabel: Label | null = null;
    private limitLabel: Label | null = null;
    private resultPanel: Node | null = null;
    private resultLabel: Label | null = null;
    private resultStarsLabel: Label | null = null;

    onLoad(): void {
        console.log("GameController.onLoad: Starting initialization");
        
        if (this.node.parent) {
            let audioButton = this.node.parent.getChildByName('audioButton');
            if (audioButton) {
                audioButton.on('click', this.callback, this);
                console.log("GameController.onLoad: Audio button listener registered");
            }
        }
        
        const levelId = LevelSession.getSelectedLevelId(1);
        this.initLevel(levelId);
        
        // Find audio source from scene
        const gameSceneNode = find('Canvas/GameScene');
        if (gameSceneNode) {
            this.audioSource = gameSceneNode.getComponent(AudioSource);
            console.log(`GameController.onLoad: Audio source ${this.audioSource ? 'found' : 'not found'}`);
        }
        
        console.log("GameController.onLoad: Initialization complete");

        this.ensureBackButton();
        this.ensureHud();
    }

    private ensureBackButton(): void {
        const scene = director.getScene();
        if (!scene) return;
        const canvas = scene.getComponentInChildren(Canvas);
        if (!canvas) return;

        const canvasNode = canvas.node;
        let backNode = canvasNode.getChildByName('BackToLevel');
        if (!backNode) {
            backNode = new Node('BackToLevel');
            canvasNode.addChild(backNode);
            backNode.setPosition(new Vec3(-260, 560, 0));
            const uiTransform = backNode.addComponent(UITransform);
            uiTransform.setContentSize(140, 60);

            const graphics = backNode.addComponent(Graphics);
            graphics.fillColor = new Color(30, 30, 30, 220);
            graphics.roundRect(-70, -30, 140, 60, 12);
            graphics.fill();

            const labelNode = new Node('Label');
            backNode.addChild(labelNode);
            const label = labelNode.addComponent(Label);
            label.string = '返回';
            label.fontSize = 28;
            label.color = new Color(255, 255, 255, 255);
            labelNode.setPosition(new Vec3(0, -4, 0));
        }

        backNode.on(Node.EventType.TOUCH_END, () => {
            director.loadScene('Level', () => {
                const scene = director.getScene();
                if (!scene) return;
                let rootNode = scene.getChildByName('LevelRoot');
                if (!rootNode) {
                    rootNode = new Node('LevelRoot');
                    scene.addChild(rootNode);
                }
                if (!rootNode.getComponent('LevelSelectController')) {
                    rootNode.addComponent('LevelSelectController');
                }
            });
        });
    }

    private async initLevel(levelId: number): Promise<void> {
        try {
            const levelConfig = await LevelConfigService.getById(levelId);
            this.levelConfig = levelConfig || null;
            this.levelState = levelConfig ? new LevelState(levelConfig.data) : null;
            this.isLevelEnded = false;

            this.gameModel = new GameModel();
            this.gameModel.init(levelConfig, 4);
            console.log("GameController.onLoad: GameModel initialized");

            if (this.grid) {
                console.log("GameController.onLoad: Grid node found");
                var gridScript = this.grid.getComponent(GridView);
                if (gridScript) {
                    console.log("GameController.onLoad: GridView component found");
                    gridScript.setController(this);
                    gridScript.initWithCellModels(
                        this.gameModel.getCells(),
                        this.gameModel.getGridSize(),
                        this.gameModel.getMask()
                    );
                    console.log("GameController.onLoad: GridView initialized with models");
                } else {
                    console.error("GameController.onLoad: GridView component NOT found on grid node!");
                }
            } else {
                console.error("GameController.onLoad: Grid node is NULL!");
            }
        } catch (error) {
            console.error('Failed to init level:', error);
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
        if (this.isLevelEnded) {
            return [[], []];
        }
        
        const result = this.gameModel.selectCell(pos);
        if (result) {
            this.updateLevelState(result[0], result[1]);
        }
        console.log(`GameController.selectCell: Returning result with ${result[0].length} models`);
        return result;
    }

    cleanCmd(): void {
        if (this.gameModel) {
            this.gameModel.cleanCmd();
        }
    }

    update(dt: number): void {
        if (this.isLevelEnded || !this.levelState) return;
        this.levelState.tick(dt);
        this.checkLevelEnd();
        this.updateHud();
    }

    private updateLevelState(changeModels: any[], effectsQueue: any[]): void {
        if (!this.levelState) return;

        if (changeModels && changeModels.length > 0) {
            this.levelState.useMove();
        }

        const crushCount = effectsQueue
            ? effectsQueue.filter((cmd) => cmd.action === 'crush').length
            : 0;
        if (crushCount > 0) {
            this.levelState.addScore(crushCount * 10);
        }

        this.checkLevelEnd();
    }

    private checkLevelEnd(): void {
        if (!this.levelState || this.isLevelEnded) return;

        if (this.levelState.isWin()) {
            this.isLevelEnded = true;
            this.saveLevelProgress(true);
            console.log('Level success!');
            this.showResultPanel(true);
            return;
        }

        if (this.levelState.isLose()) {
            this.isLevelEnded = true;
            this.saveLevelProgress(false);
            console.log('Level failed.');
            this.showResultPanel(false);
        }
    }

    private saveLevelProgress(isWin: boolean): void {
        if (!isWin || !this.levelState || !this.levelConfig) return;

        const levelId = this.levelConfig.data.id;
        const stars = evaluateStarFormula(this.levelConfig.data.starFormula, {
            score: this.levelState.score,
            stepsLeft: this.levelState.stepsLeft,
            timeLeft: this.levelState.timeLeft,
            target: this.levelState.target
        });
        const progress = LevelProgress.load();
        progress.setStars(levelId, stars);
        console.log(`Level ${levelId} earned stars: ${stars}`);
    }

    private ensureHud(): void {
        const scene = director.getScene();
        if (!scene) return;
        const canvas = scene.getComponentInChildren(Canvas);
        if (!canvas) return;

        const canvasNode = canvas.node;
        if (!this.hudNode) {
            const hud = new Node('GameHUD');
            canvasNode.addChild(hud);
            hud.setPosition(new Vec3(60, 500, 0));
            const hudTransform = hud.addComponent(UITransform);
            hudTransform.setContentSize(520, 70);

            const bg = hud.addComponent(Graphics);
            bg.fillColor = new Color(0, 0, 0, 120);
            bg.roundRect(-260, -35, 520, 70, 12);
            bg.fill();

            const scoreNode = new Node('ScoreLabel');
            hud.addChild(scoreNode);
            scoreNode.setPosition(new Vec3(-180, -5, 0));
            const scoreLabel = scoreNode.addComponent(Label);
            scoreLabel.fontSize = 26;
            scoreLabel.color = new Color(255, 255, 255, 255);
            this.scoreLabel = scoreLabel;

            const limitNode = new Node('LimitLabel');
            hud.addChild(limitNode);
            limitNode.setPosition(new Vec3(120, -5, 0));
            const limitLabel = limitNode.addComponent(Label);
            limitLabel.fontSize = 24;
            limitLabel.color = new Color(255, 255, 255, 255);
            this.limitLabel = limitLabel;

            this.hudNode = hud;
        }
        this.updateHud();
    }

    private updateHud(): void {
        if (!this.levelState || !this.scoreLabel || !this.limitLabel) return;
        this.scoreLabel.string = `分数 ${this.levelState.score}`;
        if (this.levelState.mode === 'time') {
            this.limitLabel.string = `时间 ${Math.ceil(this.levelState.timeLeft)}s`;
        } else {
            this.limitLabel.string = `步数 ${this.levelState.stepsLeft}`;
        }
    }

    private showResultPanel(isWin: boolean): void {
        const scene = director.getScene();
        if (!scene) return;
        const canvas = scene.getComponentInChildren(Canvas);
        if (!canvas) return;

        const canvasNode = canvas.node;
        if (!this.resultPanel) {
            const panel = new Node('ResultPanel');
            canvasNode.addChild(panel);
            panel.setPosition(new Vec3(0, 0, 0));
            const panelTransform = panel.addComponent(UITransform);
            panelTransform.setContentSize(520, 320);
            const bg = panel.addComponent(Graphics);
            bg.fillColor = new Color(0, 0, 0, 200);
            bg.roundRect(-260, -160, 520, 320, 16);
            bg.fill();

            const titleNode = new Node('ResultTitle');
            panel.addChild(titleNode);
            titleNode.setPosition(new Vec3(0, 100, 0));
            const titleLabel = titleNode.addComponent(Label);
            titleLabel.fontSize = 36;
            titleLabel.color = new Color(255, 255, 255, 255);
            this.resultLabel = titleLabel;

            const starsNode = new Node('ResultStars');
            panel.addChild(starsNode);
            starsNode.setPosition(new Vec3(0, 40, 0));
            const starsLabel = starsNode.addComponent(Label);
            starsLabel.fontSize = 30;
            starsLabel.color = new Color(255, 215, 0, 255);
            this.resultStarsLabel = starsLabel;

            const backNode = new Node('ResultBack');
            panel.addChild(backNode);
            backNode.setPosition(new Vec3(-100, -90, 0));
            const backLabel = backNode.addComponent(Label);
            backLabel.string = '返回关卡';
            backLabel.fontSize = 28;
            backLabel.color = new Color(255, 255, 255, 255);
            backNode.on(Node.EventType.TOUCH_END, () => {
                director.loadScene('Level');
            });

            const nextNode = new Node('ResultNext');
            panel.addChild(nextNode);
            nextNode.setPosition(new Vec3(120, -90, 0));
            const nextLabel = nextNode.addComponent(Label);
            nextLabel.string = '下一关';
            nextLabel.fontSize = 26;
            nextLabel.color = new Color(255, 255, 255, 255);
            nextNode.on(Node.EventType.TOUCH_END, async () => {
                if (!this.levelConfig) {
                    director.loadScene('Level');
                    return;
                }
                const nextId = this.levelConfig.data.id + 1;
                const nextConfig = await LevelConfigService.getById(nextId);
                if (!nextConfig) {
                    director.loadScene('Level');
                    return;
                }
                LevelSession.setSelectedLevelId(nextId);
                director.loadScene('Game');
            });

            this.resultPanel = panel;
        }

        if (this.resultLabel) {
            this.resultLabel.string = isWin ? '通关成功' : '通关失败';
        }

        if (this.resultStarsLabel && this.levelConfig && this.levelState) {
            const stars = isWin
                ? evaluateStarFormula(this.levelConfig.data.starFormula, {
                    score: this.levelState.score,
                    stepsLeft: this.levelState.stepsLeft,
                    timeLeft: this.levelState.timeLeft,
                    target: this.levelState.target
                })
                : 0;
            this.resultStarsLabel.string = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        }

        if (this.resultPanel) {
            this.resultPanel.active = true;
        }
    }

}
