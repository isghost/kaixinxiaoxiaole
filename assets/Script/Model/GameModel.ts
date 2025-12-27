import { Vec2, v2 } from 'cc';
import CellModel from "./CellModel";
import { mergePointArray, exclusivePoint } from "../Utils/ModelUtils"
import { CELL_TYPE, CELL_BASENUM, CELL_STATUS, GRID_WIDTH, GRID_HEIGHT, ANITIME } from "./ConstValue";
import { logDebug } from '../Utils/Debug';

export type EffectAction = 'crush' | 'rowBomb' | 'colBomb';

export interface EffectCommand {
  playTime: number;
  pos: Vec2;
  action: EffectAction;
  step?: number;
}

export default class GameModel {
  cells: (CellModel | null)[][];
  cellBgs: unknown | null;
  lastPos: Vec2;
  cellTypeNum: number;
  cellCreateType: number[];
  changeModels: CellModel[];
  effectsQueue: EffectCommand[];
  curTime: number;

  private ensureRow(y: number): void {
    if (!this.cells[y]) {
      this.cells[y] = [];
    }
  }

  private getCell(x: number, y: number): CellModel | null {
    return this.cells[y]?.[x] ?? null;
  }

  private setCell(x: number, y: number, model: CellModel | null): void {
    this.ensureRow(y);
    this.cells[y][x] = model;
  }

  constructor() {
    this.cells = [];
    this.cellBgs = null;
    this.lastPos = v2(-1, -1);
    this.cellTypeNum = 5;
    this.cellCreateType = []; // 升成种类只在这个数组里面查找
    this.changeModels = [];
    this.effectsQueue = [];
    this.curTime = 0;
  }

  init(cellTypeNum?: number): void {
    this.cells = [];
    this.setCellTypeNum(cellTypeNum || this.cellTypeNum);
    for (let y = 1; y <= GRID_HEIGHT; y++) {
      this.cells[y] = [];
      for (let x = 1; x <= GRID_WIDTH; x++) {
        this.cells[y][x] = new CellModel();
      }
    }

    // this.mock();

    for (let y = 1; y <= GRID_HEIGHT; y++) {
      for (let x = 1; x <= GRID_WIDTH; x++) {
        const cell = this.getCell(x, y);
        if (!cell) continue;
        // 已经被mock数据生成了
        if (cell.type != null) {
          continue;
        }
        let flag = true;
        while (flag) {
          flag = false;

          cell.init(this.getRandomCellType());
          const result = this.checkPoint(x, y)[0];
          if (result.length > 2) {
            flag = true;
          }
          cell.setXY(x, y);
          cell.setStartXY(x, y);
        }
      }
    }

  }

  mock(): void {
    this.mockInit(5, 1, CELL_TYPE.A);
    this.mockInit(5, 3, CELL_TYPE.A);
    this.mockInit(4, 2, CELL_TYPE.A);
    this.mockInit(3, 2, CELL_TYPE.A);
    this.mockInit(5, 2, CELL_TYPE.B);
    this.mockInit(6, 2, CELL_TYPE.B);
    this.mockInit(7, 3, CELL_TYPE.B);
    this.mockInit(8, 2, CELL_TYPE.A);
  }

  mockInit(x: number, y: number, type: number): void {
    const cell = this.getCell(x, y);
    if (!cell) return;
    cell.init(type)
    cell.setXY(x, y);
    cell.setStartXY(x, y);
  }


  initWithData(_data: unknown): void {
    // to do
  }

  /**
   *
   * @param x
   * @param y
   * @param recursive 是否递归查找
   * @returns {([]|string|*)[]}
   */
  checkPoint(x: number, y: number, recursive?: boolean): [Vec2[], string | number, number, Vec2] {
    let rowResult = this.checkWithDirection(x, y, [v2(1, 0), v2(-1, 0)]);
    let colResult = this.checkWithDirection(x, y, [v2(0, -1), v2(0, 1)]);
    let samePoints: Vec2[] = [];
    let newCellStatus: string | number = "";
    if (rowResult.length >= 5 || colResult.length >= 5) {
      newCellStatus = CELL_STATUS.BIRD;
    }
    else if (rowResult.length >= 3 && colResult.length >= 3) {
      newCellStatus = CELL_STATUS.WRAP;
    }
    else if (rowResult.length >= 4) {
      newCellStatus = CELL_STATUS.LINE;
    }
    else if (colResult.length >= 4) {
      newCellStatus = CELL_STATUS.COLUMN;
    }
    if (rowResult.length >= 3) {
      samePoints = rowResult;
    }
    if (colResult.length >= 3) {
      samePoints = mergePointArray(samePoints, colResult);
    }
    const selfCell = this.getCell(x, y);
    let result: [Vec2[], string | number, number, Vec2] = [samePoints, newCellStatus, selfCell!.type!, v2(x, y)];
    // 检查一下消除的其他节点， 能不能生成更大范围的消除
    if (recursive && result[0].length >= 3) {
      let subCheckPoints = exclusivePoint(samePoints, v2(x, y));
      for (let point of subCheckPoints) {
        let subResult = this.checkPoint(point.x, point.y, false);
        if (subResult[1] > result[1] || (subResult[1] === result[1] && subResult[0].length > result[0].length)) {
          result = subResult;
        }
      }
    }
    return result;
  }

  checkWithDirection(x: number, y: number, direction: Vec2[]): Vec2[] {
    let queue: Vec2[] = [];
    let vis: boolean[] = [];
    const stride = GRID_WIDTH + 1;
    vis[x + y * stride] = true;
    queue.push(v2(x, y));
    let front = 0;
    while (front < queue.length) {
      //let direction = [v2(0, -1), v2(0, 1), v2(1, 0), v2(-1, 0)];
      let point = queue[front];
      let cellModel = this.getCell(point.x, point.y);
      front++;
      if (!cellModel) {
        continue;
      }
      for (let i = 0; i < direction.length; i++) {
        let tmpX = point.x + direction[i].x;
        let tmpY = point.y + direction[i].y;
        if (tmpX < 1 || tmpX > GRID_WIDTH
          || tmpY < 1 || tmpY > GRID_HEIGHT
          || vis[tmpX + tmpY * stride]
          || !this.getCell(tmpX, tmpY)) {
          continue;
        }
        if (cellModel.type === this.getCell(tmpX, tmpY)!.type) {
          vis[tmpX + tmpY * stride] = true;
          queue.push(v2(tmpX, tmpY));
        }
      }
    }
    return queue;
  }

  printInfo(): void {
    for (let y = 1; y <= GRID_HEIGHT; y++) {
      let printStr = "";
      for (let x = 1; x <= GRID_WIDTH; x++) {
        printStr += this.getCell(x, y)!.type + " ";
      }
      logDebug(printStr);
    }
  }

  getCells(): (CellModel | null)[][] {
    return this.cells;
  }

  // controller调用的主要入口
  // 点击某个格子
  selectCell(pos: Vec2): [CellModel[], EffectCommand[]] {
    this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
    this.effectsQueue = []; // 动物消失，爆炸等特效
    var lastPos = this.lastPos;
    var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
    if (delta != 1) { //非相邻格子， 直接返回
      this.lastPos = pos;
      return [[], []];
    }
    let curClickCell = this.getCell(pos.x, pos.y)!; //当前点击的格子
    let lastClickCell = this.getCell(lastPos.x, lastPos.y)!; // 上一次点击的格式
    this.exchangeCell(lastPos, pos);
    var result1 = this.checkPoint(pos.x, pos.y)[0];
    var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];
    this.curTime = 0; // 动画播放的当前时间
    this.pushToChangeModels(curClickCell);
    this.pushToChangeModels(lastClickCell);
    let isCanBomb = (curClickCell.status != CELL_STATUS.COMMON && // 判断两个是否是特殊的动物
      lastClickCell.status != CELL_STATUS.COMMON) ||
      curClickCell.status == CELL_STATUS.BIRD ||
      lastClickCell.status == CELL_STATUS.BIRD;
    if (result1.length < 3 && result2.length < 3 && !isCanBomb) {//不会发生消除的情况
      this.exchangeCell(lastPos, pos);
      curClickCell.moveToAndBack(lastPos);
      lastClickCell.moveToAndBack(pos);
      this.lastPos = v2(-1, -1);
      return [this.changeModels, []];
    }
    else {
      this.lastPos = v2(-1, -1);
      curClickCell.moveTo(lastPos, this.curTime);
      lastClickCell.moveTo(pos, this.curTime);
      var checkPoint = [pos, lastPos];
      this.curTime += ANITIME.TOUCH_MOVE;
      this.processCrush(checkPoint);
      return [this.changeModels, this.effectsQueue];
    }
  }

  // 消除
  processCrush(checkPoint: Vec2[]): void {
    let cycleCount = 0;
    while (checkPoint.length > 0) {
      let bombModels: CellModel[] = [];
      if (cycleCount == 0 && checkPoint.length == 2) { //特殊消除
        let pos1 = checkPoint[0];
        let pos2 = checkPoint[1];
        let model1 = this.getCell(pos1.x, pos1.y)!;
        let model2 = this.getCell(pos2.x, pos2.y)!;
        if (model1.status == CELL_STATUS.BIRD || model2.status == CELL_STATUS.BIRD) {
          let bombModel = null;
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
      for (var i in checkPoint) {
        var pos = checkPoint[i];
        if (!this.getCell(pos.x, pos.y)) {
          continue;
        }
        var [result, newCellStatus, newCellType, crushPoint] = this.checkPoint(pos.x, pos.y, true);

        if (result.length < 3) {
          continue;
        }
        for (var j in result) {
          var model = this.getCell(result[j].x, result[j].y)!;
          this.crushCell(result[j].x, result[j].y, false, cycleCount);
          if (model.status != CELL_STATUS.COMMON) {
            bombModels.push(model);
          }
        }
        this.createNewCell(crushPoint, newCellStatus, newCellType);

      }
      this.processBomb(bombModels, cycleCount);
      this.curTime += ANITIME.DIE;
      checkPoint = this.down();
      cycleCount++;
    }
  }

  //生成新cell
  createNewCell(pos: Vec2, status: string | number, type: number): void {
    if (status == "") {
      return;
    }
    if (status == CELL_STATUS.BIRD) {
      type = CELL_TYPE.BIRD
    }
    let model = new CellModel();
    this.setCell(pos.x, pos.y, model);
    model.init(type);
    model.setStartXY(pos.x, pos.y);
    model.setXY(pos.x, pos.y);
    model.setStatus(status);
    model.setVisible(0, false);
    model.setVisible(this.curTime, true);
    this.changeModels.push(model);
  }

  // 下落
  down(): Vec2[] {
    let newCheckPoint: CellModel[] = [];
    for (let y = 1; y <= GRID_HEIGHT; y++) {
      for (let x = 1; x <= GRID_WIDTH; x++) {
        if (this.getCell(x, y) == null) {
          let curRow = y;
          for (let k = curRow; k <= GRID_HEIGHT; k++) {
            const model = this.getCell(x, k);
            if (model) {
              this.pushToChangeModels(model);
              newCheckPoint.push(model);
              this.setCell(x, curRow, model);
              this.setCell(x, k, null);
              model.setXY(x, curRow);
              model.moveTo(v2(x, curRow), this.curTime);
              curRow++;
            }
          }
          let count = 1;
          for (let k = curRow; k <= GRID_HEIGHT; k++) {
            const newModel = new CellModel();
            newModel.init(this.getRandomCellType());
            newModel.setStartXY(x, count + GRID_HEIGHT);
            newModel.setXY(x, count + GRID_HEIGHT);
            newModel.moveTo(v2(x, k), this.curTime);
            this.setCell(x, k, newModel);
            count++;
            this.changeModels.push(newModel);
            newCheckPoint.push(newModel);
          }

        }
      }
    }
    this.curTime += ANITIME.TOUCH_MOVE + 0.3
    return newCheckPoint.map(m => v2(m.x, m.y));
  }

  pushToChangeModels(model: CellModel): void {
    if (this.changeModels.indexOf(model) != -1) {
      return;
    }
    this.changeModels.push(model);
  }

  cleanCmd(): void {
    for (let y = 1; y <= GRID_HEIGHT; y++) {
      for (let x = 1; x <= GRID_WIDTH; x++) {
        const cell = this.getCell(x, y);
        if (cell) {
          cell.cmd = [];
        }
      }
    }
  }

  exchangeCell(pos1: Vec2, pos2: Vec2): void {
    const tmpModel = this.getCell(pos1.x, pos1.y);
    const m2 = this.getCell(pos2.x, pos2.y);
    this.setCell(pos1.x, pos1.y, m2);
    if (m2) {
      m2.x = pos1.x;
      m2.y = pos1.y;
    }
    this.setCell(pos2.x, pos2.y, tmpModel);
    if (tmpModel) {
      tmpModel.x = pos2.x;
      tmpModel.y = pos2.y;
    }
  }

  // 设置种类
  // Todo 改成乱序算法
  setCellTypeNum(num: number): void {
    logDebug("num = ", num);
    this.cellTypeNum = num;
    this.cellCreateType = [];
    let createTypeList = this.cellCreateType;
    for (let i = 1; i <= CELL_BASENUM; i++) {
      createTypeList.push(i);
    }
    for (let i = 0; i < createTypeList.length; i++) {
      let index = Math.floor(Math.random() * (CELL_BASENUM - i)) + i;
      [createTypeList[i], createTypeList[index]] = [createTypeList[index], createTypeList[i]]
    }
  }

  // 随要生成一个类型
  getRandomCellType(): number {
    var index = Math.floor(Math.random() * this.cellTypeNum);
    return this.cellCreateType[index];
  }

  // TODO bombModels去重
  processBomb(bombModels: CellModel[], cycleCount: number): void {
    while (bombModels.length > 0) {
      let newBombModel: CellModel[] = [];
      let bombTime = ANITIME.BOMB_DELAY;
      bombModels.forEach((model) => {
        if (model.status == CELL_STATUS.LINE) {
          for (let i = 1; i <= GRID_WIDTH; i++) {
            const target = this.getCell(i, model.y);
            if (target) {
              if (target.status != CELL_STATUS.COMMON) {
                newBombModel.push(target);
              }
              this.crushCell(i, model.y, false, cycleCount);
            }
          }
          this.addRowBomb(this.curTime, v2(model.x, model.y));
        }
        else if (model.status == CELL_STATUS.COLUMN) {
          for (let i = 1; i <= GRID_HEIGHT; i++) {
            const target = this.getCell(model.x, i);
            if (target) {
              if (target.status != CELL_STATUS.COMMON) {
                newBombModel.push(target);
              }
              this.crushCell(model.x, i, false, cycleCount);
            }
          }
          this.addColBomb(this.curTime, v2(model.x, model.y));
        }
        else if (model.status == CELL_STATUS.WRAP) {
          let x = model.x;
          let y = model.y;
          for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
              let delta = Math.abs(x - j) + Math.abs(y - i);
              const target = this.getCell(j, i);
              if (target && delta <= 2) {
                if (target.status != CELL_STATUS.COMMON) {
                  newBombModel.push(target);
                }
                this.crushCell(j, i, false, cycleCount);
              }
            }
          }
        }
        else if (model.status == CELL_STATUS.BIRD) {
          let crushType = model.type
          if (bombTime < ANITIME.BOMB_BIRD_DELAY) {
            bombTime = ANITIME.BOMB_BIRD_DELAY;
          }
          if (crushType == CELL_TYPE.BIRD) {
            crushType = this.getRandomCellType();
          }
          for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
              const target = this.getCell(j, i);
              if (target && target.type == crushType) {
                if (target.status != CELL_STATUS.COMMON) {
                  newBombModel.push(target);
                }
                this.crushCell(j, i, true, cycleCount);
              }
            }
          }
          //this.crushCell(model.x, model.y);
        }
      });
      if (bombModels.length > 0) {
        this.curTime += bombTime;
      }
      bombModels = newBombModel;
    }
  }

  /**
   * 
   * @param playTime 开始播放的时间
   * @param pos cell位置
   * @param step 第几次消除，用于播放音效
   */
  addCrushEffect(playTime: number, pos: Vec2, step: number): void {
    this.effectsQueue.push({
      playTime,
      pos,
      action: "crush",
      step
    });
  }

  addRowBomb(playTime: number, pos: Vec2): void {
    this.effectsQueue.push({
      playTime,
      pos,
      action: "rowBomb"
    });
  }

  addColBomb(playTime: number, pos: Vec2): void {
    this.effectsQueue.push({
      playTime,
      pos,
      action: "colBomb"
    });
  }

  addWrapBomb(playTime: number, pos: Vec2): void {
    // TODO
  }

  // cell消除逻辑
  crushCell(x: number, y: number, needShake: boolean, step: number): void {
    let model = this.getCell(x, y)!;
    this.pushToChangeModels(model);
    if (needShake) {
      model.toShake(this.curTime)
    }

    let shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;
    model.toDie(this.curTime + shakeTime);
    this.addCrushEffect(this.curTime + shakeTime, v2(model.x, model.y), step);
    this.setCell(x, y, null);
  }

}

