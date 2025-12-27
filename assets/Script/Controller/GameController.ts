import { _decorator, Component, Node, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

import GameModel from "../Model/GameModel";
import Toast from '../Utils/Toast';

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
    // let audioButton = this.node.parent.getChildByName('audioButton') 
    // audioButton.on('click', this.callback, this) 
    // this.gameModel = new GameModel(); 
    // this.gameModel.init(4); 
    // var gridScript = this.grid.getComponent("GridView"); 
    // gridScript.setController(this); 
    // gridScript.initWithCellModels(this.gameModel.getCells()); 
    // this.audioSource = find('Canvas/GameScene')?.getComponent(AudioSource) || null;
    }

    callback(): void {
    // let state = this.audioSource._state; 
    // state === 1 ? this.audioSource.pause() : this.audioSource.play() 
    // Toast(state === 1 ? '关闭背景音乐🎵' : '打开背景音乐🎵' ) 
    }

    selectCell(pos: any): any {
    // return this.gameModel.selectCell(pos); 
    }

    cleanCmd(): void {
    // this.gameModel.cleanCmd(); 
    }

}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import GameModel from "../Model/GameModel";
// import Toast from '../Utils/Toast';
// 
// cc.Class({
//   extends: cc.Component,
//   properties: {
//     grid: {
//       default: null,
//       type: cc.Node
//     },
//     audioButton: {
//       default: null,
//       type: cc.Node
//     },
//     audioSource: {
//       type: cc.AudioSource
//     }
//   },
//   // use this for initialization
//   onLoad: function () {
//     let audioButton = this.node.parent.getChildByName('audioButton')
//     audioButton.on('click', this.callback, this)
//     this.gameModel = new GameModel();
//     this.gameModel.init(4);
//     var gridScript = this.grid.getComponent("GridView");
//     gridScript.setController(this);
//     gridScript.initWithCellModels(this.gameModel.getCells());
//     this.audioSource = cc.find('Canvas/GameScene')._components[1].audio;
//   },
// 
//   callback: function () {
//     let state = this.audioSource._state;
//     state === 1 ? this.audioSource.pause() : this.audioSource.play()
//     Toast(state === 1 ? '关闭背景音乐🎵' : '打开背景音乐🎵' )
//   },
// 
//   selectCell: function (pos) {
//     return this.gameModel.selectCell(pos);
//   },
//   cleanCmd: function () {
//     this.gameModel.cleanCmd();
//   }
// });
