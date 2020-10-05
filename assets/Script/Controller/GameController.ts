import {CELL_HEIGHT, CELL_WIDTH, GRID_PIXEL_HEIGHT, GRID_PIXEL_WIDTH} from "../Model/ConstValue";

const {ccclass, property} = cc._decorator;

import GameModel from "../Model/GameModel";
import GridView from "../View/GridView";

@ccclass
export default class GameController extends cc.Component{

    @property(cc.Node)
    grid: cc.Node = null;

    gridScript: GridView;

    gameModel: GameModel;

    isInPlayAni: boolean;// 是否在播放动画中

    isCanMove: boolean;// 是否可以滑动

    // use this for initialization
    onLoad() {
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        this.gridScript = this.grid.getComponent("GridView");
        this.gridScript.setController(this);
        this.gridScript.showOpt(this.gameModel.getInitOpt());
    }

    selectCell(pos: cc.Vec2){
        return this.gameModel.selectCell(pos);
    }

    cleanCmd(){
        this.gameModel.cleanCmd();
    }

    setListener(){
        let self = this;
        this.grid.on(cc.Node.EventType.TOUCH_START, function(eventTouch){
            if(self.isInPlayAni){//播放动画中，不允许点击
                return true;
            }
            const touchPos = eventTouch.getLocation();
            const cellPos = self.convertTouchPosToCell(touchPos);
            if(cellPos){
                self.gameModel.selectCell(cellPos);
                const changeModels = self.selectCell(cellPos);
                self.isCanMove = changeModels.length < 3;
            }
            else{
                self.isCanMove = false;
            }
            return true;
        }, this);
        // 滑动操作逻辑
        this.grid.on(cc.Node.EventType.TOUCH_MOVE, function(eventTouch){
            if(self.isCanMove){
                const startTouchPos = eventTouch.getStartLocation();
                const startCellPos = self.convertTouchPosToCell(startTouchPos);
                const touchPos = eventTouch.getLocation();
                const cellPos = self.convertTouchPosToCell(touchPos);
                if(!startCellPos || !cellPos){
                    return
                }
                if(startCellPos.x != cellPos.x || startCellPos.y != cellPos.y){
                    self.isCanMove = false;
                    const changeModels = self.gridScript.selectCell(cellPos);
                }
            }
        }, this);
        this.grid.on(cc.Node.EventType.TOUCH_END, function(eventTouch){
            // console.log("1111");
        }, this);
        this.grid.on(cc.Node.EventType.TOUCH_CANCEL, function(eventTouch){
            // console.log("1111");
        }, this);
    }
    // 根据点击的像素位置，转换成网格中的位置
    convertTouchPosToCell(pos): cc.Vec2{
        pos = this.node.convertToNodeSpace(pos);
        if(pos.x < 0 || pos.x >= GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= GRID_PIXEL_HEIGHT){
            return null;
        }
        const x = Math.floor(pos.x / CELL_WIDTH) + 1;
        const y = Math.floor(pos.y / CELL_HEIGHT) + 1;
        return cc.v2(x, y);
    }

}
