// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        swap: {
            type: cc.AudioClip,
            default: null
        },
        click: {
            type: cc.AudioClip,
            default: null
        },
        eliminate:{
            type: [cc.AudioClip],
            default: [],
        },
        continuousMatch:{
            type: [cc.AudioClip],
            default: []
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {

    },
    playClick: function(){
        cc.audioEngine.play(this.click, false, 1);
    },
    playSwap: function(){
        cc.audioEngine.play(this.swap, false, 1);
    },
    playEliminate: function(step){
        step = Math.min(this.eliminate.length - 1, step);
        cc.audioEngine.play(this.eliminate[step], false, 1);
    },
    playContinuousMatch: function(step){
        console.log("step = ", step);
        step = Math.min(step, 11);
        if(step < 2){
            return 
        }
        cc.audioEngine.play(this.continuousMatch[Math.floor(step/2) - 1], false, 1);
    }

    // update (dt) {},
});
