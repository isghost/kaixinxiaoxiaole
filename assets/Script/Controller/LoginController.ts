import { _decorator, Component, ProgressBar, Button, AudioClip } from 'cc';
const { ccclass, property } = _decorator;

import AudioUtils from "../Utils/AudioUtils";
@ccclass('LoginController')
export class LoginController extends Component {
    @property(ProgressBar)
    public loadingBar = null;
    @property(Button)
    public loginButton = null;
    @property(AudioClip)
    public worldSceneBGM = null;

    onLoad () {
    // this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1); 
    }

    onLogin () {
    // this.last = 0; 
    // this.loadingBar.node.active = true; 
    // this.loginButton.node.active = false; 
    // this.loadingBar.progress = 0; 
    // this.loadingBar.barSprite.fillRange = 0; 
    // cc.loader.onProgress = (count, amount, item) => { 
      // let progress = (count / amount).toFixed(2); 
      // if (progress > this.loadingBar.barSprite.fillRange) { 
        // this.loadingBar.barSprite.fillRange = count / amount; 
      // } 
    // }; 
    // cc.director.preloadScene("Game", function () { 
      // this.loadingBar.node.active = false; 
      // this.loginButton.node.active = false; 
      // cc.director.loadScene("Game"); 
    // }.bind(this)); 
    }

    onDestroy () {
    // cc.audioEngine.stop(this.gameSceneBGMAudioId); 
    }

}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// import AudioUtils from "../Utils/AudioUtils";
// 
// cc.Class({
//   extends: cc.Component,
// 
//   properties: {
//     loadingBar: {
//       type: cc.ProgressBar,
//       default: null,
//     },
//     loginButton: {
//       type: cc.Button,
//       default: null,
//     },
//     worldSceneBGM: {
//       type: cc.AudioClip,
//       default: null,
//     }
//   },
// 
//   onLoad() {
//     this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1);
//   },
// 
//   onLogin: function () {
//     this.last = 0;
//     this.loadingBar.node.active = true;
//     this.loginButton.node.active = false;
//     this.loadingBar.progress = 0;
//     this.loadingBar.barSprite.fillRange = 0;
//     cc.loader.onProgress = (count, amount, item) => {
//       let progress = (count / amount).toFixed(2);
//       if (progress > this.loadingBar.barSprite.fillRange) {
//         this.loadingBar.barSprite.fillRange = count / amount;
//       }
//     };
//     cc.director.preloadScene("Game", function () {
//       this.loadingBar.node.active = false;
//       this.loginButton.node.active = false;
//       // cc.log("加载成功");
//       cc.director.loadScene("Game");
//     }.bind(this));
//   },
// 
//   onDestroy: function () {
//     cc.audioEngine.stop(this.gameSceneBGMAudioId);
//   }
// });
