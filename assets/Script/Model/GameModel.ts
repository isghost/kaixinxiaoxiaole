import CellModel from "./CellModel";
import { CELL_TYPE, CELL_BASE_NUM, CELL_STATUS, GRID_WIDTH, GRID_HEIGHT, ANITIME } from "./ConstValue";
import Opt, {
    CellCreate,
    CellDie,
    CellMoveTo,
    CellOpt,
    CellSelect,
    CellShare, EffectColBomb,
    EffectCrush,
    EffectRowBomb, OptType
} from "./OptCmd";
// @ts-ignore
import * as _ from "lodash"

export default class GameModel {

    cells: CellModel[][];
    lastPos: cc.Vec2;
    cellTypeNum: number;
    cellCreateType: number[];

    constructor() {

        this.lastPos = null;
        this.cellTypeNum = 5;
        this.cellCreateType = []; // 升成种类只在这个数组里面查找
        console.log("_ = ", _.unionWith )
    }

    init(cellTypeNum) {

        this.cells = [];
        this.setCellTypeNum(cellTypeNum || this.cellTypeNum);
        for (let i = 1; i <= GRID_WIDTH; i++) {
            this.cells[i] = [];
            for (let j = 1; j <= GRID_HEIGHT; j++) {
                this.cells[i][j] = new CellModel();
            }
        }

        for (let i = 1; i <= GRID_WIDTH; i++) {
            for (let j = 1; j <= GRID_HEIGHT; j++) {
                let flag = true;
                while (flag) {
                    flag = false;
                    this.cells[i][j].setType(this.getRandomCellType());
                    let result = <Object[]>this.checkPoint(j, i)[0];
                    if (result.length > 2) {
                        flag = true;
                    }
                    this.cells[i][j].setXY(j, i);
                    this.cells[i][j].setStartXY(j, i);
                }
            }
        }

    }

    initWithData(data) {
        // to do
    }

    checkWithDirection(x: number, y: number, direction: cc.Vec2[]): cc.Vec2[] {
        let queue: cc.Vec2[]= new Array<cc.Vec2>();
        let vis = [];
        vis[x + y * 9] = true;
        queue.push(cc.v2(x, y));
        let front = 0;
        while (front < queue.length) {
            //let direction = [cc.v2(0, -1), cc.v2(0, 1), cc.v2(1, 0), cc.v2(-1, 0)];
            let point = queue[front];
            let cellModel = this.cells[point.y][point.x];
            front++;
            if (!cellModel) {
                continue;
            }
            for (let i = 0; i < direction.length; i++) {
                let tmpX = point.x + direction[i].x;
                let tmpY = point.y + direction[i].y;
                if (tmpX < 1 || tmpX > 9
                    || tmpY < 1 || tmpY > 9
                    || vis[tmpX + tmpY * 9]
                    || !this.cells[tmpY][tmpX]) {
                    continue;
                }
                if (cellModel.type == this.cells[tmpY][tmpX].type) {
                    vis[tmpX + tmpY * 9] = true;
                    queue.push(cc.v2(tmpX, tmpY));
                }
            }
        }
        return queue;
    }
    checkPoint(x, y): Object[] {

        let rowResult = this.checkWithDirection(x, y, [cc.v2(1, 0), cc.v2(-1, 0)]);
        let colResult = this.checkWithDirection(x, y, [cc.v2(0, -1), cc.v2(0, 1)]);
        let newCellStatus = "";
        if (rowResult.length >= 5 || colResult.length >= 5) {
            newCellStatus = CELL_STATUS.BIRD;
        }
        else if (rowResult.length >= 3 && colResult.length >= 3) {
            newCellStatus = CELL_STATUS.WRAP;
        }
        else if (rowResult.length >= 4) {
            newCellStatus = CELL_STATUS.ROW;
        }
        else if (colResult.length >= 4) {
            newCellStatus = CELL_STATUS.COLUMN;
        }
        let result: cc.Vec2[] = [];
        if(colResult.length >= 3){
             result = colResult
        }
        if(rowResult.length >= 3){
            result = _.unionWith(result, rowResult, function (a: cc.Vec2, b: cc.Vec2): boolean {
                return a.x == b.x && a.y == b.y;
            });
        }

        return [result, newCellStatus, this.cells[y][x].type];
    }

    printInfo() {
        for (var i = 1; i <= 9; i++) {
            var printStr = "";
            for (var j = 1; j <= 9; j++) {
                printStr += this.cells[i][j].type + " ";
            }
            console.log(printStr);
        }
    }

    getCells() {
        return this.cells;
    }
    // controller调用的主要入口
    // 点击某个格子
    selectCell(pos: cc.Vec2): Opt {
        console.log("pos = ", pos);
        let opt = new Opt();
        let curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子
        if(this.lastPos == null){
            this.lastPos = pos;
            opt.addCellOptCmd(curClickCell, new CellSelect(true));
            opt.optType = OptType.Click;
            return opt;
        }
        let lastPos = this.lastPos;
        let delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
        let lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格式
        if (delta !=  1) { //非相邻格子， 直接返回
            this.lastPos = pos;
            opt.addCellOptCmd(lastClickCell, new CellSelect(false));
            opt.addCellOptCmd(curClickCell, new CellSelect(true));
            opt.optType = OptType.Click;
            return opt;
        }
        this.exchangeCell(lastPos, pos);
        let result1 = <Object[]>this.checkPoint(pos.x, pos.y)[0];
        let result2 = <Object[]>this.checkPoint(lastPos.x, lastPos.y)[0];
        opt.curTime = 0; // 动画播放的当前时间
        let isCanBomb = (curClickCell.status != CELL_STATUS.NORMAL && // 判断两个是否是特殊的动物
            lastClickCell.status != CELL_STATUS.NORMAL) ||
            curClickCell.status == CELL_STATUS.BIRD ||
            lastClickCell.status == CELL_STATUS.BIRD;
        opt.addCellOptCmd(lastClickCell, new CellSelect(false));
        if (result1.length < 3 && result2.length < 3 && !isCanBomb) {//不会发生消除的情况
            this.exchangeCell(lastPos, pos);
            opt.addCellOptCmd(curClickCell, new CellMoveTo(lastPos));
            opt.addCellOptCmd(lastClickCell, new CellMoveTo(pos));
            opt.addTime(ANITIME.TOUCH_MOVE);
            opt.addCellOptCmd(curClickCell, new CellMoveTo(pos));
            opt.addCellOptCmd(lastClickCell, new CellMoveTo(lastPos));
            this.lastPos = null;
            opt.addTime(ANITIME.TOUCH_MOVE);
            opt.optType = OptType.Swap;
            return opt;
        }
        else {
            this.lastPos = null;
            opt.addCellOptCmd(curClickCell, new CellMoveTo(lastPos));
            opt.addCellOptCmd(lastClickCell, new CellMoveTo(pos));
            let checkPoint = [pos, lastPos];
            opt.addTime(ANITIME.TOUCH_MOVE);
            this.processCrush(opt, checkPoint);
            opt.optType = OptType.Crush;
            return opt;
        }
    }
    // 消除
    processCrush(opt: Opt, checkPoint) {
        let cycleCount = 0;
        while (checkPoint.length > 0) {
            let bombModels = [];
            let hasCrush = false; //是否发生消除
            if (cycleCount == 0 && checkPoint.length == 2) { //特殊消除
                let pos1 = checkPoint[0];
                let pos2 = checkPoint[1];
                let model1 = this.cells[pos1.y][pos1.x];
                let model2 = this.cells[pos2.y][pos2.x];
                if (model1.status == CELL_STATUS.BIRD || model2.status == CELL_STATUS.BIRD) {
                    hasCrush = true;
                    if (model1.status == CELL_STATUS.BIRD) {
                        model1.type = model2.type;
                        bombModels.push(model1);
                    }
                    else {
                        model2.type = model1.type;
                        bombModels.push(model2);
                    }

                }
            }

            for (let pos of checkPoint) {
                console.log("pos = ", pos, this.cells);
                if (!this.cells[pos.y][pos.x]) {
                    continue;
                }
                let [result, newCellStatus, newCellType] = this.checkPoint(pos.x, pos.y);

                if ( (<Object[]>result).length < 3) {
                    continue;
                }
                for (let j in result) {
                    hasCrush = true;
                    let model = this.cells[result[j].y][result[j].x];
                    this.crushCell(opt, result[j].x, result[j].y, false, cycleCount);
                    if (model.status != CELL_STATUS.NORMAL) {
                        bombModels.push(model);
                    }
                }
                this.createNewCell(opt, pos, newCellStatus, newCellType);

            }
            this.processBomb(opt, bombModels, cycleCount);
            if(hasCrush){
                opt.addTime(ANITIME.DIE);
                checkPoint = this.down(opt);
            }else{
                checkPoint = [];
            }
            cycleCount++;
        }
    }

    //生成新cell
    createNewCell(opt: Opt, pos, status, type): CellModel {
        if (status == "") {
            return null;
        }
        if (status == CELL_STATUS.BIRD) {
            type = CELL_TYPE.BIRD
        }
        let model = new CellModel();
        this.cells[pos.y][pos.x] = model;
        model.setType(type);
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        opt.addCellOptCmd(model, new CellCreate());
        return model;
    }
    // 下落
    down(opt: Opt) {
        let newCheckPoint = [];
        for (let i = 1; i <= GRID_WIDTH; i++) {
            for (let j = 1; j <= GRID_HEIGHT; j++) {
                if (this.cells[i][j] == null) {
                    let k;
                    let curRow = i;
                    for (k = curRow; k <= GRID_HEIGHT; k++) {
                        if (this.cells[k][j]) {
                            newCheckPoint.push(this.cells[k][j]);
                            this.cells[curRow][j] = this.cells[k][j];
                            this.cells[k][j] = null;
                            this.cells[curRow][j].setXY(j, curRow);
                            opt.addCellOptCmd(this.cells[curRow][j], new CellMoveTo(cc.v2(j, curRow)));
                            curRow++;
                        }
                    }
                    let count = 1;
                    for (k = curRow; k <= GRID_HEIGHT; k++) {
                        this.cells[k][j] = new CellModel();
                        this.cells[k][j].setType(this.getRandomCellType());
                        this.cells[k][j].setStartXY(j, count + GRID_HEIGHT);
                        this.cells[k][j].setXY(j, k);
                        opt.addCellOptCmd(this.cells[k][j], new CellCreate());
                        opt.addCellOptCmd(this.cells[k][j], new CellMoveTo(cc.v2(j, k)));
                        count++;
                        newCheckPoint.push(this.cells[k][j]);
                    }

                }
            }
        }
        opt.addTime(ANITIME.TOUCH_MOVE + ANITIME.DOWN_DELAY);
        return newCheckPoint;
    }


    cleanCmd() {
        for (var i = 1; i <= GRID_WIDTH; i++) {
            for (var j = 1; j <= GRID_HEIGHT; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].cmd = [];
                }
            }
        }
    }

    exchangeCell(pos1: cc.Vec2, pos2: cc.Vec2) {
        let tmpModel = this.cells[pos1.y][pos1.x];
        this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
        this.cells[pos1.y][pos1.x].x = pos1.x;
        this.cells[pos1.y][pos1.x].y = pos1.y;
        this.cells[pos2.y][pos2.x] = tmpModel;
        this.cells[pos2.y][pos2.x].x = pos2.x;
        this.cells[pos2.y][pos2.x].y = pos2.y;
    }
    // 设置种类
    // Todo 改成乱序算法
    setCellTypeNum(num) {
        console.log("num = ", num);
        this.cellTypeNum = num;
        this.cellCreateType = [];
        let createTypeList = this.cellCreateType;
        for (let i = 1; i <= CELL_BASE_NUM; i++) {
            createTypeList.push(i);
        }
        for (let i = 0; i < createTypeList.length; i++) {
            let index = Math.floor(Math.random() * (CELL_BASE_NUM - i)) + i;
            createTypeList[i], createTypeList[index] = createTypeList[index], createTypeList[i]
        }
    }
    // 随要生成一个类型
    getRandomCellType() {
        let index = Math.floor(Math.random() * this.cellTypeNum);
        return this.cellCreateType[index];
    }
    // TODO bombModels去重
    processBomb(opt: Opt, bombModels, cycleCount) {
        let self = this;
        while (bombModels.length > 0) {
            let newBombModel = [];
            bombModels.forEach(function (model) {
                if (model.status == CELL_STATUS.ROW) {
                    for (let i = 1; i <= GRID_WIDTH; i++) {
                        if (self.cells[model.y][i]) {
                            if (self.cells[model.y][i].status != CELL_STATUS.NORMAL) {
                                newBombModel.push(self.cells[model.y][i]);
                            }
                            self.crushCell(opt, i, model.y, false, cycleCount);
                        }
                    }
                    opt.addEffectOptList(new EffectRowBomb(cc.v2(model.x, model.y)));
                }
                else if (model.status == CELL_STATUS.COLUMN) {
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        if (self.cells[i][model.x]) {
                            if (self.cells[i][model.x].status != CELL_STATUS.NORMAL) {
                                newBombModel.push(self.cells[i][model.x]);
                            }
                            self.crushCell(opt, model.x, i, false, cycleCount);
                        }
                    }
                    opt.addEffectOptList(new EffectColBomb(cc.v2(model.x, model.y)));
                }
                else if (model.status == CELL_STATUS.WRAP) {
                    let x = model.x;
                    let y = model.y;
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            let delta = Math.abs(x - j) + Math.abs(y - i);
                            if (self.cells[i][j] && delta <= 2) {
                                if (self.cells[i][j].status != CELL_STATUS.NORMAL) {
                                    newBombModel.push(self.cells[i][j]);
                                }
                                self.crushCell(opt, j, i, false, cycleCount);
                            }
                        }
                    }
                }
                else if (model.status == CELL_STATUS.BIRD) {
                    let crushType = model.type;
                    if (crushType == CELL_TYPE.BIRD) {
                        crushType = self.getRandomCellType();
                    }
                    opt.addTime(ANITIME.DIE_SHAKE);
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            if (self.cells[i][j] && self.cells[i][j].type == crushType) {
                                if (self.cells[i][j].status != CELL_STATUS.NORMAL) {
                                    newBombModel.push(self.cells[i][j]);
                                }
                                self.crushCell(opt, j, i, true, cycleCount);
                            }
                        }
                    }
                    //this.crushCell(model.x, model.y);
                }
            }, this);
            if (bombModels.length > 0) {
                opt.addTime(ANITIME.BOMB_DELAY);
            }
            bombModels = newBombModel;
        }
    }

    // cell消除逻辑
    crushCell(opt: Opt, x, y, needShake, step) {
        let model = this.cells[y][x];
        if (needShake) {
            opt.addCellOptCmd(model, new CellShare());
        }

        opt.addCellOptCmd(model, new CellDie());
        opt.addEffectOptList(new EffectCrush(cc.v2(model.x, model.y), step));
        this.cells[y][x] = null;
    }

    getInitOpt(): Opt{
        let opt = new Opt();
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
                opt.addCellOptCmd(this.cells[i][j], new CellCreate());
            }
        }
        return opt;
    }
}

