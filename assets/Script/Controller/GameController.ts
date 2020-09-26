const {ccclass, property} = cc._decorator;

import GameModel from "../Model/GameModel";

@ccclass
export default class Controller extends cc.Component{

    @property(cc.Node)
    grid: cc.Node = null;

    gameModel: GameModel;

    // use this for initialization
    onLoad() {
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        let gridScript = this.grid.getComponent("GridView");
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gameModel.getCells());
    }

    selectCell(pos: cc.Vec2){
        return this.gameModel.selectCell(pos);
    }

    cleanCmd(){
        this.gameModel.cleanCmd();
    }

}
