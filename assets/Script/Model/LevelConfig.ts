/**
 * Level Configuration Data Structure
 * Based on mainstream match-3 games design
 */

/**
 * Level objective types
 */
export enum LevelObjectiveType {
  SCORE = 'score',           // Reach target score
  CLEAR_TYPES = 'clear_types', // Clear specific number of each cell type
  SURVIVAL = 'survival'      // Survive with limited moves
}

/**
 * Special cell spawn configuration
 */
export interface SpecialCellConfig {
  /** Which cell types can spawn (1-6 for basic types) */
  allowedTypes: number[];
  /** Probability of spawning special cells (0-1) */
  specialSpawnRate?: number;
}

/**
 * Level objective configuration
 */
export interface LevelObjective {
  type: LevelObjectiveType;
  /** Target score (for SCORE type) */
  targetScore?: number;
  /** Target cell clear count (for CLEAR_TYPES type) */
  targetClears?: { [cellType: number]: number };
}

/**
 * Main level configuration interface
 */
export interface LevelConfigData {
  /** Level number */
  level: number;
  /** Level name */
  name: string;
  /** Maximum number of moves allowed */
  maxMoves: number;
  /** Grid width (default 9) */
  gridWidth?: number;
  /** Grid height (default 9) */
  gridHeight?: number;
  /** Number of different cell types in this level (default 5) */
  cellTypeCount: number;
  /** Which cell types are allowed in this level */
  allowedCellTypes?: number[];
  /** Level objectives */
  objectives: LevelObjective[];
  /** Star score thresholds (3 stars) */
  starScores: [number, number, number];
}

/**
 * Level configuration class
 */
export default class LevelConfig {
  private config: LevelConfigData;

  constructor(configData: LevelConfigData) {
    this.config = configData;
    this.validate();
  }

  /**
   * Validate level configuration
   */
  private validate(): void {
    if (this.config.level < 1) {
      throw new Error('Level number must be >= 1');
    }
    if (this.config.maxMoves < 1) {
      throw new Error('Max moves must be >= 1');
    }
    if (this.config.cellTypeCount < 2 || this.config.cellTypeCount > 6) {
      throw new Error('Cell type count must be between 2 and 6');
    }
    if (this.config.starScores[0] >= this.config.starScores[1] || 
        this.config.starScores[1] >= this.config.starScores[2]) {
      throw new Error('Star scores must be in ascending order');
    }
  }

  /**
   * Get level number
   */
  getLevel(): number {
    return this.config.level;
  }

  /**
   * Get level name
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * Get max moves allowed
   */
  getMaxMoves(): number {
    return this.config.maxMoves;
  }

  /**
   * Get grid width
   */
  getGridWidth(): number {
    return this.config.gridWidth || 9;
  }

  /**
   * Get grid height
   */
  getGridHeight(): number {
    return this.config.gridHeight || 9;
  }

  /**
   * Get cell type count
   */
  getCellTypeCount(): number {
    return this.config.cellTypeCount;
  }

  /**
   * Get allowed cell types
   */
  getAllowedCellTypes(): number[] {
    if (this.config.allowedCellTypes) {
      return this.config.allowedCellTypes;
    }
    // Default: return first N types
    const types: number[] = [];
    for (let i = 1; i <= this.config.cellTypeCount; i++) {
      types.push(i);
    }
    return types;
  }

  /**
   * Get level objectives
   */
  getObjectives(): LevelObjective[] {
    return this.config.objectives;
  }

  /**
   * Get star score thresholds
   */
  getStarScores(): [number, number, number] {
    return this.config.starScores;
  }

  /**
   * Calculate stars earned based on score
   */
  calculateStars(score: number): number {
    if (score >= this.config.starScores[2]) return 3;
    if (score >= this.config.starScores[1]) return 2;
    if (score >= this.config.starScores[0]) return 1;
    return 0;
  }

  /**
   * Check if objectives are met
   */
  checkObjectivesMet(score: number, moveCount: number, cellsCleared?: { [key: number]: number }): boolean {
    for (const objective of this.config.objectives) {
      switch (objective.type) {
        case LevelObjectiveType.SCORE:
          if (score < (objective.targetScore || 0)) {
            return false;
          }
          break;
        case LevelObjectiveType.CLEAR_TYPES:
          if (objective.targetClears && cellsCleared) {
            for (const cellType in objective.targetClears) {
              const required = objective.targetClears[cellType];
              const cleared = cellsCleared[cellType] || 0;
              if (cleared < required) {
                return false;
              }
            }
          }
          break;
        case LevelObjectiveType.SURVIVAL:
          // Just need to have moves left
          if (moveCount >= this.config.maxMoves) {
            return false;
          }
          break;
      }
    }
    return true;
  }

  /**
   * Get full configuration data
   */
  getConfigData(): LevelConfigData {
    return this.config;
  }
}
