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
        if (this.node.parent) {
            let audioButton = this.node.parent.getChildByName('audioButton');
            if (audioButton) {
                audioButton.on('click', this.callback, this);
            }
        }
        
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        
        if (this.grid) {
            var gridScript = this.grid.getComponent(GridView);
            if (gridScript) {
                gridScript.setController(this);
                gridScript.initWithCellModels(this.gameModel.getCells());
            }
        }
        
        // Find audio source from scene
        const gameSceneNode = find('Canvas/GameScene');
        if (gameSceneNode) {
            this.audioSource = gameSceneNode.getComponent(AudioSource);
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
        if (!this.gameModel) return null;
        return this.gameModel.selectCell(pos);
    }

    cleanCmd(): void {
        if (this.gameModel) {
            this.gameModel.cleanCmd();
        }
    }

}
