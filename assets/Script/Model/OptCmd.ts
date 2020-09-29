
/**
 *  没有想好用什么名称，暂用Opt代指操作之后， 返回给View显示的数据
 *  每一次操作之后， 需要处理的显示数据。包括一些显示动画
 */

export class CellOpt{

}

export class EffectOpt{

}
export default class OptCmd {
    cellOptList: CellOpt[];
    effectOptList: EffectOpt[];

    addCellOptCmd(opt: CellOpt){
        this.cellOptList.push(opt);
    }

    addEffecfOptList(opt: EffectOpt){
        this.effectOptList.push(opt);
    }
}