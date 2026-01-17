import { LevelConfigData, LevelMode } from './LevelConfig';

export class LevelState {
  mode: LevelMode;
  stepsLeft: number;
  timeLeft: number;
  target: number;
  score: number;

  constructor(config: LevelConfigData) {
    this.mode = config.mode;
    this.stepsLeft = config.steps || 0;
    this.timeLeft = config.time || 0;
    this.target = config.target || 0;
    this.score = 0;
  }

  addScore(points: number): void {
    this.score += Math.max(0, points);
  }

  useMove(): void {
    if (this.mode !== 'steps') return;
    if (this.stepsLeft > 0) {
      this.stepsLeft -= 1;
    }
  }

  tick(deltaSeconds: number): void {
    if (this.mode !== 'time') return;
    if (this.timeLeft > 0) {
      this.timeLeft = Math.max(0, this.timeLeft - deltaSeconds);
    }
  }

  isWin(): boolean {
    return this.score >= this.target;
  }

  isLose(): boolean {
    if (this.isWin()) return false;
    if (this.mode === 'steps') {
      return this.stepsLeft <= 0;
    }
    return this.timeLeft <= 0;
  }
}
