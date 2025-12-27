import { _decorator, Component, Node, AudioSource, find } from 'cc';
const { ccclass, property } = _decorator;

import GameModel from "../Model/GameModel";
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

    onLoad(): void {
        console.log("GameController.onLoad: Starting initialization");
        
        if (this.node.parent) {
            let audioButton = this.node.parent.getChildByName('audioButton');
            if (audioButton) {
                audioButton.on('click', this.callback, this);
                console.log("GameController.onLoad: Audio button listener registered");
            }
        }
        
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        console.log("GameController.onLoad: GameModel initialized");
        
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
        
        console.log("GameController.onLoad: Initialization complete");
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
        
        const result = this.gameModel.selectCell(pos);
        console.log(`GameController.selectCell: Returning result with ${result[0].length} models`);
        return result;
    }

    cleanCmd(): void {
        if (this.gameModel) {
            this.gameModel.cleanCmd();
        }
    }

}
