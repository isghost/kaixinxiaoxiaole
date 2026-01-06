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
 * Game mode types
 */
export enum GameMode {
  MOVES = 'moves',    // Move-based mode (default)
  TIMER = 'timer'     // Time-based mode
}

/**
 * Map cell configuration
 * Used to define irregular map layouts
 */
export interface MapCellConfig {
  /** X coordinate (1-based) */
  x: number;
  /** Y coordinate (1-based) */
  y: number;
  /** Whether this cell is active (true) or blocked (false) */
  active: boolean;
  /** Optional: Cell type for pre-filled cells */
  presetType?: number;
  /** Optional: Cell status for special pre-filled cells */
  presetStatus?: string;
}

/**
 * Map configuration for levels
 * Defines the grid layout and blocked cells
 */
export interface MapConfig {
  /** Map name/identifier */
  name: string;
  /** Grid width */
  width: number;
  /** Grid height */
  height: number;
  /** Cell configurations - if not provided, all cells are active */
  cells?: MapCellConfig[];
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
  /** Game mode: moves or timer */
  gameMode?: GameMode;
  /** Maximum number of moves allowed (for MOVES mode) */
  maxMoves?: number;
  /** Time limit in seconds (for TIMER mode) */
  timeLimit?: number;
  /** Grid width (default 9) - deprecated if using mapConfig */
  gridWidth?: number;
  /** Grid height (default 9) - deprecated if using mapConfig */
  gridHeight?: number;
  /** Map configuration - defines the grid layout */
  mapConfig?: MapConfig;
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
    
    // Validate game mode
    const gameMode = this.config.gameMode || GameMode.MOVES;
    if (gameMode === GameMode.MOVES) {
      if (!this.config.maxMoves || this.config.maxMoves < 1) {
        throw new Error('Max moves must be >= 1 for MOVES mode');
      }
    } else if (gameMode === GameMode.TIMER) {
      if (!this.config.timeLimit || this.config.timeLimit < 1) {
        throw new Error('Time limit must be >= 1 for TIMER mode');
      }
    }
    
    if (this.config.cellTypeCount < 2 || this.config.cellTypeCount > 6) {
      throw new Error('Cell type count must be between 2 and 6');
    }
    if (this.config.starScores[0] >= this.config.starScores[1] || 
        this.config.starScores[1] >= this.config.starScores[2]) {
      throw new Error('Star scores must be in ascending order');
    }
    
    // Validate map configuration if provided
    if (this.config.mapConfig) {
      if (this.config.mapConfig.width < 3 || this.config.mapConfig.height < 3) {
        throw new Error('Map dimensions must be at least 3x3');
      }
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
   * Get game mode
   */
  getGameMode(): GameMode {
    return this.config.gameMode || GameMode.MOVES;
  }

  /**
   * Check if level is timer-based
   */
  isTimerMode(): boolean {
    return this.getGameMode() === GameMode.TIMER;
  }

  /**
   * Get max moves allowed (for MOVES mode)
   */
  getMaxMoves(): number {
    return this.config.maxMoves || 0;
  }

  /**
   * Get time limit in seconds (for TIMER mode)
   */
  getTimeLimit(): number {
    return this.config.timeLimit || 0;
  }

  /**
   * Get map configuration
   */
  getMapConfig(): MapConfig | undefined {
    return this.config.mapConfig;
  }

  /**
   * Check if level has custom map
   */
  hasCustomMap(): boolean {
    return !!this.config.mapConfig;
  }

  /**
   * Get grid width
   */
  getGridWidth(): number {
    if (this.config.mapConfig) {
      return this.config.mapConfig.width;
    }
    return this.config.gridWidth || 9;
  }

  /**
   * Get grid height
   */
  getGridHeight(): number {
    if (this.config.mapConfig) {
      return this.config.mapConfig.height;
    }
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
   * Check if a cell position is active (not blocked) in the map
   */
  isCellActive(x: number, y: number): boolean {
    if (!this.config.mapConfig || !this.config.mapConfig.cells) {
      // If no map config or cell config, all cells are active
      return true;
    }
    
    // Find the cell configuration
    const cellConfig = this.config.mapConfig.cells.find(
      cell => cell.x === x && cell.y === y
    );
    
    // If cell is not in config, assume it's active
    if (!cellConfig) {
      return true;
    }
    
    return cellConfig.active;
  }

  /**
   * Get preset cell type for a position (if configured)
   */
  getPresetCellType(x: number, y: number): number | undefined {
    if (!this.config.mapConfig || !this.config.mapConfig.cells) {
      return undefined;
    }
    
    const cellConfig = this.config.mapConfig.cells.find(
      cell => cell.x === x && cell.y === y
    );
    
    return cellConfig?.presetType;
  }

  /**
   * Get preset cell status for a position (if configured)
   */
  getPresetCellStatus(x: number, y: number): string | undefined {
    if (!this.config.mapConfig || !this.config.mapConfig.cells) {
      return undefined;
    }
    
    const cellConfig = this.config.mapConfig.cells.find(
      cell => cell.x === x && cell.y === y
    );
    
    return cellConfig?.presetStatus;
  }

  /**
   * Get full configuration data
   */
  getConfigData(): LevelConfigData {
    return this.config;
  }
}
