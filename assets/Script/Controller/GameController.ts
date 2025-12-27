import { _decorator, Component, Node, AudioSource, find, Vec2 } from 'cc';
import GameModel from "../Model/GameModel";
import Toast from '../Utils/Toast';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    grid: Node | null = null;

    @property(Node)
    audioButton: Node | null = null;

    @property(AudioSource)
    audioSource: AudioSource | null = null;

    private gameModel: GameModel | null = null;

    onLoad() {
        let audioButton = this.node.parent!.getChildByName('audioButton');
        if (audioButton) {
            audioButton.on('click', this.callback, this);
        }
        
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        
        if (this.grid) {
            var gridScript = this.grid.getComponent("GridView");
            if (gridScript) {
                gridScript.setController(this);
                gridScript.initWithCellModels(this.gameModel.getCells());
            }
        }
        
        // Get audio source from GameScene
        const gameScene = find('Canvas/GameScene');
        if (gameScene) {
            this.audioSource = gameScene.getComponent(AudioSource);
        }
    }

    callback() {
        if (!this.audioSource) return;
        
        if (this.audioSource.playing) {
            this.audioSource.pause();
            Toast('关闭背景音乐🎵');
        } else {
            this.audioSource.play();
            Toast('打开背景音乐🎵');
        }
    }

    selectCell(pos: Vec2) {
        if (!this.gameModel) return [[], []];
        return this.gameModel.selectCell(pos);
    }

    cleanCmd() {
        if (this.gameModel) {
            this.gameModel.cleanCmd();
        }
    }
}
