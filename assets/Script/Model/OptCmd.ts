/**
 *  没有想好用什么名称，暂用Opt代指操作之后， 返回给View显示的数据
 *  每一次操作之后， 需要处理的显示数据。包括一些显示动画
 */
import CellModel from "./CellModel";
import {ANITIME} from "./ConstValue";

// cell所有动作的基类， 最小动作
export class CellCmd{
    playTime: number = 0;
    keepTime: number = 0;
}

//cell创建
export class CellCreate extends CellCmd{
    pos: cc.Vec2;
}
//移动
export class CellMoveTo extends CellCmd{
    pos: cc.Vec2;
    constructor(pos: cc.Vec2){
        super();
        this.pos = pos;
        this.keepTime = ANITIME.TOUCH_MOVE;
    }

}
//消除时的动作
export class CellDie extends CellCmd{
}
//抖动
export class CellShare extends CellCmd{
}
//设置是否可见
export class CellVisible extends CellCmd{
    isVisible: boolean;
}
//设置是否是选中状态
export class CellSelect extends  CellCmd{
    status: boolean;
    constructor(status: boolean){
        super();
        this.status = status;
    }
}
// 每一个cell的操作
export class CellOpt extends CellModel{
    cmdList: CellCmd[] = new Array<CellCmd>();

    addCellCmd(cmd: CellCmd){
        this.cmdList.push(cmd);
    }

    constructor(cell: CellModel) {
        super();
        Object.assign(this, cell);
    }
}

//特效的最小动作，由于特效一般没有连续操作， 所以没有EffectOpt这一层
export class EffectOpt{
    playTime: number;
    pos: cc.Vec2;
    constructor(pos: cc.Vec2){
        this.pos = pos;
    }
}
// cell被摧毁的效果
export class EffectCrush extends  EffectOpt{
    step: number; //第几次消除
    constructor(pos: cc.Vec2, step: number){
        super(pos);
        this.step = step;
    }
}

// 行爆炸
export class EffectRowBomb extends EffectOpt{

}
// 列爆炸
export class EffectColBomb extends EffectOpt{

}

export enum OptType {
    Click,//选中方格
    Swap, //两方格交换位置又返回
    Crush,//发生消除
}
//总的操作后的显示
export default class Opt {
    cellOptList: CellOpt[] = new Array<CellOpt>();
    effectOptList: EffectOpt[] = new Array<EffectOpt>();
    curTime: number = 0 ; //当前操作进行的时间
    step: number; //消除次数
    optType: number;

    addCellOptCmd(cellModel: CellModel, cellCmd: CellCmd){
        let cellOpt: CellOpt = this.getCellOpt(cellModel);
        if(cellOpt == null){
            cellOpt = new CellOpt(cellModel);
            this.cellOptList.push(cellOpt);
        }
        cellCmd.playTime = this.curTime;
        cellOpt.addCellCmd(cellCmd);
    }

    getCellOpt(cellModel: CellModel): CellOpt{
        for(let cellOpt of this.cellOptList){
            if(cellOpt.id == cellModel.id){
                return cellOpt
            }
        }
        return null;
    }

    addEffectOptList(opt: EffectOpt){
        opt.playTime = this.curTime;
        this.effectOptList.push(opt);
    }

    addTime(time: number){
        this.curTime += time;
        console.log("addTime = ", time);
    }

}