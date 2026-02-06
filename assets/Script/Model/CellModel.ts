import { Vec2, v2 } from 'cc';
import { CELL_TYPE, ANITIME, CELL_STATUS, GRID_HEIGHT } from "./ConstValue";

export interface CellCommand {
  action: string;
  keepTime: number;
  playTime: number;
  pos?: Vec2;
  isVisible?: boolean;
}

export default class CellModel {
  type: number | null;
  status: string | number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  cmd: CellCommand[];
  isDeath: boolean;
  objecCount: number;
  obstacleType: string | null;
  obstacleHp: number;
  isLocked: boolean;

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
    this.obstacleType = null;
    this.obstacleHp = 0;
    this.isLocked = false;
  }

  init(type: number): void {
    this.type = type;
  }

  isEmpty(): boolean {
    return this.type == CELL_TYPE.EMPTY;
  }

  setEmpty(): void {
    this.type = CELL_TYPE.EMPTY;
  }

  setXY(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  setStartXY(x: number, y: number): void {
    this.startX = x;
    this.startY = y;
  }

  setStatus(status: string | number): void {
    this.status = status;
  }

  setObstacle(type: string | null, hp: number, locked: boolean): void {
    this.obstacleType = type;
    this.obstacleHp = Math.max(0, hp);
    this.isLocked = locked;
  }

  moveToAndBack(pos: Vec2): void {
    const srcPos = v2(this.x, this.y);
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

  moveTo(pos: Vec2, playTime: number): void {
    const srcPos = v2(this.x, this.y);
    this.cmd.push({
      action: "moveTo",
      keepTime: ANITIME.TOUCH_MOVE,
      playTime: playTime,
      pos: pos
    });
    this.x = pos.x;
    this.y = pos.y;
  }

  toDie(playTime: number): void {
    this.cmd.push({
      action: "toDie",
      playTime: playTime,
      keepTime: ANITIME.DIE
    });
    this.isDeath = true;
  }

  toShake(playTime: number): void {
    this.cmd.push({
      action: "toShake",
      playTime: playTime,
      keepTime: ANITIME.DIE_SHAKE
    });
  }

  setVisible(playTime: number, isVisible: boolean): void {
    this.cmd.push({
      action: "setVisible",
      playTime: playTime,
      keepTime: 0,
      isVisible: isVisible
    });
  }

  moveToAndDie(pos: Vec2): void {
    // TODO: Implement if needed
  }

  isBird(): boolean {
    return this.type == CELL_TYPE.BIRD;
  }

}
