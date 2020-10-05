/**
 *  没有想好用什么名称，暂用Opt代指操作之后， 返回给View显示的数据
 *  每一次操作之后， 需要处理的显示数据。包括一些显示动画
 */
import CellModel from "./CellModel";

// cell所有动作的基类， 最小动作
export class CellCmd{
    playTime: number;
    keepTime: number;
}

//cell创建
export class CellCreate extends CellCmd{
    pos: cc.Vec2;
}
//移动
export class CellMoveTo extends CellCmd{
    pos: cc.Vec2;
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
}
// cell被摧毁的效果
export class EffectCrush extends  EffectOpt{
    step: number;
}

// 行爆炸
export class EffectRowBomb extends EffectOpt{

}
// 列爆炸
export class EffectColBomb extends EffectOpt{

}

//总的操作后的显示
export default class Opt {
    cellOptList: CellOpt[] = new Array<CellOpt>();
    effectOptList: EffectOpt[] = new Array<EffectOpt>();
    curTime: number; //当前操作进行的时间

    addCellOpt(opt: CellOpt){
        this.cellOptList.push(opt);
    }

    addEffectOptList(opt: EffectOpt){
        this.effectOptList.push(opt);
    }
}