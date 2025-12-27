import { CELL_TYPE, ANITIME, CELL_STATUS, GRID_HEIGHT } from "./ConstValue";
import { Vec2 } from "cc";

export default class CellModel {
  type: number | null;
  status: string | number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  cmd: Array<any>;
  isDeath: boolean;
  objecCount: number;

  constructor() {
    this.type = null;
    this.status = CELL_STATUS.COMMON;
    this.x = 1;
    this.y = 1;
    this.startX = 1;
    this.startY = 1;
    this.cmd = [];
    this.isDeath = false;
    this.objecCount = Math.floor(Math.random() * 1000);
  }

  init(type: number) {
    this.type = type;
  }

  isEmpty(): boolean {
    return this.type == CELL_TYPE.EMPTY;
  }

  setEmpty() {
    this.type = CELL_TYPE.EMPTY;
  }
  
  setXY(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setStartXY(x: number, y: number) {
    this.startX = x;
    this.startY = y;
  }

  setStatus(status: string | number) {
    this.status = status;
  }

  moveToAndBack(pos: Vec2) {
    var srcPos = new Vec2(this.x, this.y);
    this.cmd.push({
      action: "moveTo",
      keepTime: ANITIME.TOUCH_MOVE,
      playTime: 0,
      pos: pos
    });
    this.cmd.push({
      action: "moveTo",
      keepTime: ANITIME.TOUCH_MOVE,
      playTime: ANITIME.TOUCH_MOVE,
      pos: srcPos
    });
  }

  moveTo(pos: Vec2, playTime: number) {
    var srcPos = new Vec2(this.x, this.y);
    this.cmd.push({
      action: "moveTo",
      keepTime: ANITIME.TOUCH_MOVE,
      playTime: playTime,
      pos: pos
    });
    this.x = pos.x;
    this.y = pos.y;
  }

  toDie(playTime: number) {
    this.cmd.push({
      action: "toDie",
      playTime: playTime,
      keepTime: ANITIME.DIE
    });
    this.isDeath = true;
  }

  toShake(playTime: number) {
    this.cmd.push({
      action: "toShake",
      playTime: playTime,
      keepTime: ANITIME.DIE_SHAKE
    });
  }

  setVisible(playTime: number, isVisible: boolean) {
    this.cmd.push({
      action: "setVisible",
      playTime: playTime,
      keepTime: 0,
      isVisible: isVisible
    });
  }

  moveToAndDie(pos: Vec2) {

  }

  isBird(): boolean {
    return this.type == CELL_TYPE.BIRD;
  }

}
