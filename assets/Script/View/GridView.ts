import {CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT, ANITIME} from '../Model/ConstValue';

import AudioUtils from "../Utils/AudioUtils";
import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import GameController from "../Controller/GameController";
import Opt, {CellCreate, CellOpt, EffectOpt} from "../Model/OptCmd";

@ccclass
export default class LoginController extends cc.Component{

    @property([cc.Prefab])
    aniPre: cc.Prefab[] = [];

    @property(cc.Node)
    effectLayer: cc.Node = null;

    @property(AudioUtils)
    audioUtils:AudioUtils = null;

    lastTouchPos: cc.Vec2 = cc.v2(-1, -1);
    isCanMove: boolean = true;
    isInPlayAni: boolean = false;

    controller: GameController = null;

    cellViews: cc.Node[][];

    // use this for initialization
    onLoad() {
    }
    setController(controller){
        this.controller = controller;
    }

    //显示opt的内容
    showOpt(opt: Opt){
        this.showCellOpt(opt.cellOptList);
    }
    //显示cell
    showCellOpt(optList: CellOpt[]){
        if(optList.length == 0) {
            return
        }
        for(let cellOpt of optList){
            for(let cmd of cellOpt.cmdList){
                if(cmd instanceof CellCreate){
                    this.showCellCreate(cellOpt, cmd);
                }
            }
        }
    }
    //显示effect
    showEffectOpt(opt: EffectOpt){

    }

    showCellCreate(cellOpt: CellOpt, cmd: CellCreate){
        const aniView = cc.instantiate(this.aniPre[cellOpt.type]);
        aniView.parent = this.node;
        aniView.name = "" + cellOpt.id;
        const cellViewScript = aniView.getComponent("CellView");
        cellViewScript.initWithModel(cellOpt);
    }

    // 移动格子
    updateView(changeModels){
        let newCellViewInfo = [];
        for(let i in changeModels){
            let model = changeModels[i];
            const viewInfo = this.findViewByModel(model);
            let view = null;
            // 如果原来的cell不存在，则新建
            if(!viewInfo){
                const type = model.type;
                const aniView = cc.instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                const cellViewScript = aniView.getComponent("CellView");
                cellViewScript.initWithModel(model);
                view = aniView;
            }
            // 如果已经存在
            else{
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }
            const cellScript = view.getComponent("CellView");
            cellScript.updateView();// 执行移动动作
            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            } 
        }
        // 重新标记this.cellviews的信息
        newCellViewInfo.forEach(function(ele){
            let model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        },this);
    }
    // 显示选中的格子背景
    updateSelect(pos){
         for(let i = 1; i <=9 ; i++){
            for(let j = 1 ; j <=9 ; j ++){
                if(this.cellViews[i][j]){
                    const cellScript = this.cellViews[i][j].getComponent("CellView");
                    if(pos.x == j && pos.y ==i){
                        cellScript.setSelect(true);
                    }
                    else{
                        cellScript.setSelect(false);
                    }

                }
            }
        }
        
    }
    /**
     * 根据cell的model返回对应的view
     */
    findViewByModel(model){
        for(let i = 1; i <=9 ; i++){
            for(let j = 1 ; j <=9 ; j ++){
                if(this.cellViews[i][j] && this.cellViews[i][j].getComponent("CellView").model == model){
                    return {view:this.cellViews[i][j],x:j, y:i};
                }
            }
        }
        return null;
    }
    getPlayAniTime(changeModels){
        if(!changeModels){
            return 0;
        }
        let maxTime = 0;
        changeModels.forEach(function(ele){
            ele.cmd.forEach(function(cmd){
                if(maxTime < cmd.playTime + cmd.keepTime){
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            },this)
        },this);
        return maxTime;
    }
    // 获得爆炸次数， 同一个时间算一个
    getStep(effectsQueue){
        if(!effectsQueue){
            return 0;
        }
        return effectsQueue.reduce(function(maxValue, efffectCmd){
            return Math.max(maxValue, efffectCmd.step || 0);
        }, 0);
    }
    //一段时间内禁止操作
    disableTouch(time, step){
        if(time <= 0){
            return ;
        }
        this.isInPlayAni = true;
        this.node.runAction(cc.sequence(cc.delayTime(time),cc.callFunc(function(){
            this.isInPlayAni = false;
            this.audioUtils.playContinuousMatch(step);
        }, this)));
    }
    // 正常击中格子后的操作
    selectCell(cellPos){
        const result = this.controller.selectCell(cellPos); // 直接先丢给model处理数据逻辑
        const changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
        const effectsQueue = result[1]; //各种特效
        this.playEffect(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.controller.cleanCmd(); 
        if(changeModels.length >= 2){
            this.updateSelect(cc.v2(-1,-1));
            this.audioUtils.playSwap();
        }
        else{
            this.updateSelect(cellPos);
            this.audioUtils.playClick();
        }
        return changeModels;
    }
    playEffect(effectsQueue){
        this.effectLayer.getComponent("EffectLayer").playEffects(effectsQueue);
    }

}
