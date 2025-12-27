import { _decorator, Component, Node, AudioSource, find, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

import GameModel, { EffectCommand } from "../Model/GameModel";
import Toast from '../Utils/Toast';
import { GridView } from '../View/GridView';
import type CellModel from '../Model/CellModel';
import { logDebug, logError } from '../Utils/Debug';

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    public grid: Node | null = null;
    
    @property(Node)
    public audioButton: Node | null = null;
    
    @property(AudioSource)
    public audioSource: AudioSource | null = null;
    
    private gameModel: GameModel | null = null;

    onLoad(): void {
        logDebug("GameController.onLoad: Starting initialization");
        
        if (this.node.parent) {
            let audioButton = this.node.parent.getChildByName('audioButton');
            if (audioButton) {
                audioButton.on('click', this.callback, this);
                logDebug("GameController.onLoad: Audio button listener registered");
            }
        }
        
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        logDebug("GameController.onLoad: GameModel initialized");
        
        if (this.grid) {
            logDebug("GameController.onLoad: Grid node found");
            var gridScript = this.grid.getComponent(GridView);
            if (gridScript) {
                logDebug("GameController.onLoad: GridView component found");
                gridScript.setController(this);
                gridScript.initWithCellModels(this.gameModel.getCells());
                logDebug("GameController.onLoad: GridView initialized with models");
            } else {
                logError("GameController.onLoad: GridView component NOT found on grid node!");
            }
        } else {
            logError("GameController.onLoad: Grid node is NULL!");
        }
        
        // Find audio source from scene
        const gameSceneNode = find('Canvas/GameScene');
        if (gameSceneNode) {
            this.audioSource = gameSceneNode.getComponent(AudioSource);
            logDebug(`GameController.onLoad: Audio source ${this.audioSource ? 'found' : 'not found'}`);
        }
        
        logDebug("GameController.onLoad: Initialization complete");
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

    selectCell(pos: Vec2): [CellModel[], EffectCommand[]] | null {
        logDebug(`GameController.selectCell: Called with position (${pos.x}, ${pos.y})`);
        
        if (!this.gameModel) {
            logError("GameController.selectCell: No game model!");
            return null;
        }
        
        const result = this.gameModel.selectCell(pos);
        logDebug(`GameController.selectCell: Returning result with ${result[0].length} models`);
        return result;
    }

    cleanCmd(): void {
        if (this.gameModel) {
            this.gameModel.cleanCmd();
        }
    }

}
