// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;

@ccclass
export default class AudioUtils extends cc.Component{

    @property(cc.AudioClip)
    swap: cc.AudioClip = null;
    @property(cc.AudioClip)
    click:  cc.AudioClip = null ;
    @property([cc.AudioClip])
    eliminate: cc.AudioClip[] = [];
    @property([cc.AudioClip])
    continuousMatch:cc.AudioClip[] = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    start () {

    }
    playClick(){
        cc.audioEngine.play(this.click, false, 1);
    }
    playSwap(){
        cc.audioEngine.play(this.swap, false, 1);
    }
    playEliminate(step){
        step = Math.min(this.eliminate.length - 1, step);
        cc.audioEngine.play(this.eliminate[step], false, 1);
    }
    playContinuousMatch(step){
        console.log("step = ", step);
        step = Math.min(step, 11);
        if(step < 2){
            return 
        }
        cc.audioEngine.play(this.continuousMatch[Math.floor(step/2) - 1], false, 1);
    }

    // update (dt) {},
}
