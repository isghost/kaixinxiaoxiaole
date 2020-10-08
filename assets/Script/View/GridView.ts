import {ANITIME, CELL_HEIGHT, CELL_MIN_MOVE_NUM, CELL_NAME_PREFIX, CELL_WIDTH} from '../Model/ConstValue';

import AudioUtils from "../Utils/AudioUtils";
import GameController from "../Controller/GameController";
import Opt, {
    CellCreate,
    CellDie,
    CellMoveTo,
    CellOpt,
    CellSelect,
    CellShare,
    EffectOpt,
    OptType
} from "../Model/OptCmd";
import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;

@ccclass
export default class GridView extends cc.Component{

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
        this.playOptAudio(opt);
        console.log("showCellOpt = ", opt);
        this.showCellOpt(opt.cellOptList);
        this.showEffectOpt(opt.effectOptList);
    }
    //显示选中状态
    // showSelectStatus(opt: Opt){
    //     let minCrushNum = 3; //最小消除数量， 发生消除后， 选中状态清空
    //     let swapNum = 2;//操作不会发生消除时
    //     let selectCellID = opt.selectCellModel.id;
    //     if(opt.effectOptList.length >= minCrushNum || opt.effectOptList.length == swapNum){ //虽然>=2即可， 但无法表示两种情况
    //         selectCellID = -1;
    //     }
    //     for(let cellViewNode of this.node.children){
    //         cellViewNode.getComponent("CellView").
    //         setSelect(cellViewNode.name == CELL_NAME_PREFIX + selectCellID);
    //     }
    // }
    //播放操作之后的声音
    playOptAudio(opt: Opt){
        if(opt.optType == OptType.Swap || opt.optType == OptType.Crush){
            this.audioUtils.playSwap();
        }
        else{
            this.audioUtils.playClick();
        }
    }
    //显示cell
    showCellOpt(optList: CellOpt[]){
        if(optList.length == 0) {
            return
        }
        for(let cellOpt of optList){
            let node = this.findCellNodeByID(cellOpt.id);
            let actionList = new Array<cc.FiniteTimeAction>();
            let curTime: number = 0;
            for(let cmd of cellOpt.cmdList){
                if(cmd.playTime > curTime){
                    actionList.push(cc.delayTime(cmd.playTime - curTime))
                }
                if(cmd instanceof CellCreate){
                    node = this.getCreateCell(cellOpt, cmd);
                    actionList.push(this.getVisibleAction(cellOpt, cmd));
                }else if(cmd instanceof  CellSelect){
                    this.showCellSelectStatus(cellOpt, cmd);
                }else if(cmd instanceof CellMoveTo){
                    actionList.push(this.getCellMoveToAction(cellOpt, cmd));
                }else if(cmd instanceof CellDie){
                    actionList.push(this.getCellDieAction(cellOpt, cmd));
                }else if(cmd instanceof CellShare){
                    actionList.push(this.getShareAction(cellOpt, cmd));
                }
                curTime = cmd.playTime +  cmd.keepTime;
            }
            if(actionList.length == 1){
                node.runAction(actionList[0])
            }else if(actionList.length > 1){
                node.runAction(cc.sequence(actionList));
            }
        }
    }
    //显示effect
    showEffectOpt(optList: EffectOpt[]){
        this.effectLayer.getComponent("EffectLayer").playEffects(optList);
    }

    getCreateCell(cellOpt: CellOpt, cmd: CellCreate): cc.Node{
        const aniView = cc.instantiate(this.aniPre[cellOpt.type]);
        aniView.parent = this.node;
        aniView.name = CELL_NAME_PREFIX + cellOpt.id;
        const cellViewScript = aniView.getComponent("CellView");
        cellViewScript.initWithModel(cellOpt);
        aniView.opacity = 0;
        return aniView;
    }

    getVisibleAction(cellOpt: CellOpt, cmd: CellCreate): cc.FiniteTimeAction{
        return  cc.callFunc(function (target: cc.Node) {
            target.opacity = 255;
        });
    }

    showCellSelectStatus(cellOpt: CellOpt, cmd: CellSelect){
        let node = this.findCellNodeByID(cellOpt.id);
        node.getComponent("CellView").setSelect(cmd.status);
    }

    getCellMoveToAction(cellOpt: CellOpt, cmd: CellMoveTo): cc.FiniteTimeAction{
        const x = (cmd.pos.x - 0.5) * CELL_WIDTH;
        const y = (cmd.pos.y - 0.5) * CELL_HEIGHT;
        return cc.moveTo(ANITIME.TOUCH_MOVE, cc.v2(x, y));
    }

    getCellDieAction(cellOpt: CellOpt, cmd: CellDie): cc.FiniteTimeAction{
        return  cc.callFunc(function (target: cc.Node) {
            target.destroy();
        });
    }

    getShareAction(cellOpt: CellOpt, cmd: CellDie): cc.FiniteTimeAction{
        let rotateRight = cc.rotateBy(0.06, 30);
        let rotateLeft = cc.rotateBy(0.12, -60);
        return cc.repeat(cc.sequence(rotateRight, rotateLeft, rotateRight), 2);
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

    //todo 加一层cache
    findCellNodeByID(id: number): cc.Node{
        for(let cellNode of this.node.children){
            if(cellNode.name == CELL_NAME_PREFIX + id){
                return cellNode;
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
    // 正常击中格子后的操作
    selectCell(cellPos){
        const result = this.controller.selectCell(cellPos); // 直接先丢给model处理数据逻辑
        const changeModels = result[0]; // 有改变的cell，包含新生成的cell和生成马上摧毁的格子
        const effectsQueue = result[1]; //各种特效
        this.playEffect(effectsQueue);
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
