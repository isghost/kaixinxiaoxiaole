// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import AudioUtils from "../Utils/AudioUtils";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        loadingBar: {
            type: cc.ProgressBar,
            default: null,
        },
        loginButton: {
            type: cc.Button,
            default: null,
        },
        worldSceneBGM:{
            type: cc.AudioClip,
            default: null,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1);
    },

    start () {

    },

    onLogin: function(){
        this.loadingBar.node.active = true;
        this.loginButton.node.active = false;
        this.loadingBar.progress = 0;
        let backup = cc.loader.onProgress;
        cc.loader.onProgress = function (count, amount) {
            this.loadingBar.progress = count / amount;
        }.bind(this);

        cc.director.preloadScene("Game", function () {
            cc.loader.onProgress = backup;
            this.loadingBar.node.active = false;
            this.loginButton.node.active = true;
            cc.director.loadScene("Game");
        }.bind(this));
    },

    onDestroy: function(){
        cc.audioEngine.stop(this.gameSceneBGMAudioId);
    }

    // update (dt) {},
});
