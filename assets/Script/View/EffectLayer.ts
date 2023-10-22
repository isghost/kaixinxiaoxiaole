import {CELL_WIDTH} from '../Model/ConstValue';

import AudioUtils from "../Utils/AudioUtils";
import property = cc._decorator.property;
import ccclass = cc._decorator.ccclass;
import {EffectColBomb, EffectCrush, EffectOpt, EffectRowBomb} from "../Model/OptCmd";

@ccclass
export default class EffectLayer extends cc.Component{

    @property(cc.Prefab)
    bombWhite: cc.Prefab= null;

    @property(cc.Prefab)
    crushEffect: cc.Prefab = null;

    @property(AudioUtils)
    audioUtils:AudioUtils = null;


    // use this for initialization
    onLoad(){

    }
    playEffects(optList: EffectOpt[]){
        let self = this;
        if(!optList || optList.length <= 0){
            return ;
        }
        let soundMap = {}; //某一时刻，某一种声音是否播放过的标记，防止重复播放
        optList.forEach(function(cmd){
            let delayTime = cc.delayTime(cmd.playTime);
            let callFunc = cc.callFunc(function(){
                let instantEffect = null;
                let animation = null;
                if(cmd instanceof EffectCrush){
                    instantEffect = cc.instantiate(self.crushEffect);
                    animation  = instantEffect.getComponent(cc.Animation);
                    animation.play("effect");
                    !soundMap["crush" + cmd.playTime] && self.audioUtils.playEliminate(cmd.step);
                    soundMap["crush" + cmd.playTime] = true;
                }
                else if(cmd instanceof EffectRowBomb){
                    instantEffect = cc.instantiate(self.bombWhite);
                    animation  = instantEffect.getComponent(cc.Animation);
                    animation.play("effect_line");
                }
                else if(cmd instanceof EffectColBomb){
                    instantEffect = cc.instantiate(self.bombWhite);
                    animation  = instantEffect.getComponent(cc.Animation);
                    animation.play("effect_col");
                }

                instantEffect.x = CELL_WIDTH * (cmd.pos.x - 0.5);
                instantEffect.y = CELL_WIDTH * (cmd.pos.y - 0.5);
                instantEffect.parent = this.node;
                animation.on("finished",function(){
                    instantEffect.destroy();
                },this);
               
            },this);
            this.node.runAction(cc.sequence(delayTime, callFunc));
        },this);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
};