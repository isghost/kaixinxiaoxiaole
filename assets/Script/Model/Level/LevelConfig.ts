import { JsonAsset, resources } from 'cc';

export type LevelMode = 'steps' | 'time';

export interface LevelUnlockRule {
  starsRequired: number;
}

export interface LevelGrid {
  rows: number;
  cols: number;
}

export type LevelObstacleType = 'ice' | 'chain' | 'crate' | 'rock' | 'multilevel';

export interface LevelObstacle {
  type: LevelObstacleType;
  hp?: number;
  positions: number[][];
  movable?: boolean;
}

export interface LevelCollectTarget {
  cellType: number;
  count: number;
}

export interface LevelPeriodicObstacle {
  type: LevelObstacleType;
  interval: number;
  hp?: number;
  maxCount?: number;
}

export interface LevelConfigData {
  id: number;
  name: string;
  mode: LevelMode;
  steps?: number;
  time?: number;
  target: number;
  grid: LevelGrid;
  mask: string[];
  obstacles?: LevelObstacle[];
  periodicObstacles?: LevelPeriodicObstacle[];
  collectTargets?: LevelCollectTarget[];
  unlock: LevelUnlockRule;
  starFormula: string;
}

export interface LevelConfigFile {
  version: number;
  levels: LevelConfigData[];
}

export class LevelConfig {
  data: LevelConfigData;
  private maskGrid: boolean[][];

  constructor(data: LevelConfigData) {
    this.data = data;
    this.maskGrid = LevelConfig.buildMask(data.grid.rows, data.grid.cols, data.mask);
  }

  static buildMask(rows: number, cols: number, mask: string[]): boolean[][] {
    const grid: boolean[][] = [];
    for (let r = 0; r < rows; r++) {
      const rowStr = mask[r] || '';
      grid[r + 1] = [];
      for (let c = 0; c < cols; c++) {
        grid[r + 1][c + 1] = rowStr[c] === '1';
      }
    }
    return grid;
  }

  isCellEnabled(x: number, y: number): boolean {
    if (!this.maskGrid[y] || typeof this.maskGrid[y][x] === 'undefined') {
      return false;
    }
    return this.maskGrid[y][x];
  }

  getMaskGrid(): boolean[][] {
    return this.maskGrid;
  }
}

export class LevelConfigService {
  private static cache: LevelConfig[] | null = null;

  static async loadAll(): Promise<LevelConfig[]> {
    if (this.cache) return this.cache;

    const data = await new Promise<LevelConfigFile>((resolve, reject) => {
      resources.load('levels', JsonAsset, (err, asset) => {
        if (err || !asset) {
          reject(err);
          return;
        }
        resolve(asset.json as LevelConfigFile);
      });
    });

    this.cache = (data.levels || []).map((level) => new LevelConfig(level));
    return this.cache;
  }

  static async getById(levelId: number): Promise<LevelConfig | null> {
    const levels = await this.loadAll();
    return levels.find((level) => level.data.id === levelId) || null;
  }
}
