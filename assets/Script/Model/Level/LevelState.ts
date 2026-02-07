import { LevelCollectTarget, LevelConfigData, LevelMode, LevelPeriodicObstacle } from './LevelConfig';

type CollectProgress = LevelCollectTarget & { collected: number };

export class LevelState {
  mode: LevelMode;
  stepsLeft: number;
  timeLeft: number;
  target: number;
  score: number;
  collectTargets: CollectProgress[];
  moveCount: number;
  periodicObstacles: LevelPeriodicObstacle[];

  constructor(config: LevelConfigData) {
    this.mode = config.mode;
    this.stepsLeft = config.steps || 0;
    this.timeLeft = config.time || 0;
    this.target = config.target || 0;
    this.score = 0;
    this.collectTargets = (config.collectTargets || []).map((t) => ({
      cellType: t.cellType,
      count: t.count,
      collected: 0
    }));
    this.moveCount = 0;
    this.periodicObstacles = config.periodicObstacles || [];
  }

  addScore(points: number): void {
    this.score += Math.max(0, points);
  }

  useMove(): void {
    if (this.mode !== 'steps') return;
    if (this.stepsLeft > 0) {
      this.stepsLeft -= 1;
    }
    this.moveCount += 1;
  }

  tick(deltaSeconds: number): void {
    if (this.mode !== 'time') return;
    if (this.timeLeft > 0) {
      this.timeLeft = Math.max(0, this.timeLeft - deltaSeconds);
    }
    this.moveCount += 1;
  }

  isWin(): boolean {
    if (this.score < this.target) return false;
    if (this.collectTargets.length === 0) return true;
    return this.collectTargets.every((t) => t.collected >= t.count);
  }

  addCollected(cellType: number | undefined, amount: number): void {
    if (!cellType || amount <= 0) return;
    if (this.collectTargets.length === 0) return;
    for (const t of this.collectTargets) {
      if (t.cellType === cellType) {
        t.collected = Math.min(t.count, t.collected + amount);
      }
    }
  }

  getCollectDisplayText(): string {
    if (this.collectTargets.length === 0) return '';
    return this.collectTargets
      .map((t) => `${t.collected}/${t.count}(T${t.cellType})`)
      .join(' ');
  }

  isLose(): boolean {
    if (this.isWin()) return false;
    if (this.mode === 'steps') {
      return this.stepsLeft <= 0;
    }
    return this.timeLeft <= 0;
  }

  shouldSpawnPeriodicObstacle(): LevelPeriodicObstacle | null {
    for (const obstacle of this.periodicObstacles) {
      if (obstacle.interval > 0 && this.moveCount > 0 && this.moveCount % obstacle.interval === 0) {
        return obstacle;
      }
    }
    return null;
  }
}
