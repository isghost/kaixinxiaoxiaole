import LevelConfig, { LevelConfigData } from './LevelConfig';

/**
 * Level progress data
 */
export interface LevelProgress {
  level: number;
  completed: boolean;
  stars: number;
  bestScore: number;
}

/**
 * Level Manager - handles level progression and state
 */
export default class LevelManager {
  private static instance: LevelManager | null = null;
  
  private levelConfigs: Map<number, LevelConfig>;
  private currentLevel: number;
  private levelProgress: Map<number, LevelProgress>;
  private maxUnlockedLevel: number;

  private constructor() {
    this.levelConfigs = new Map();
    this.currentLevel = 1;
    this.levelProgress = new Map();
    this.maxUnlockedLevel = 1;
    this.loadProgress();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): LevelManager {
    if (!LevelManager.instance) {
      LevelManager.instance = new LevelManager();
    }
    return LevelManager.instance;
  }

  /**
   * Register a level configuration
   */
  registerLevel(configData: LevelConfigData): void {
    const config = new LevelConfig(configData);
    this.levelConfigs.set(config.getLevel(), config);
  }

  /**
   * Register multiple level configurations
   */
  registerLevels(configsData: LevelConfigData[]): void {
    for (const configData of configsData) {
      this.registerLevel(configData);
    }
  }

  /**
   * Get level configuration by level number
   */
  getLevelConfig(level: number): LevelConfig | null {
    return this.levelConfigs.get(level) || null;
  }

  /**
   * Get current level configuration
   */
  getCurrentLevelConfig(): LevelConfig | null {
    return this.getLevelConfig(this.currentLevel);
  }

  /**
   * Set current level
   */
  setCurrentLevel(level: number): boolean {
    if (!this.levelConfigs.has(level)) {
      console.warn(`Level ${level} not found`);
      return false;
    }
    if (level > this.maxUnlockedLevel) {
      console.warn(`Level ${level} is locked`);
      return false;
    }
    this.currentLevel = level;
    return true;
  }

  /**
   * Get current level number
   */
  getCurrentLevel(): number {
    return this.currentLevel;
  }

  /**
   * Complete current level with score
   */
  completeLevel(level: number, score: number, stars: number): void {
    const progress = this.levelProgress.get(level) || {
      level: level,
      completed: false,
      stars: 0,
      bestScore: 0
    };

    progress.completed = true;
    progress.stars = Math.max(progress.stars, stars);
    progress.bestScore = Math.max(progress.bestScore, score);
    
    this.levelProgress.set(level, progress);

    // Unlock next level
    if (level >= this.maxUnlockedLevel) {
      this.maxUnlockedLevel = level + 1;
    }

    this.saveProgress();
  }

  /**
   * Get level progress
   */
  getLevelProgress(level: number): LevelProgress | null {
    return this.levelProgress.get(level) || null;
  }

  /**
   * Check if level is unlocked
   */
  isLevelUnlocked(level: number): boolean {
    return level <= this.maxUnlockedLevel;
  }

  /**
   * Get max unlocked level
   */
  getMaxUnlockedLevel(): number {
    return this.maxUnlockedLevel;
  }

  /**
   * Get total stars earned
   */
  getTotalStars(): number {
    let total = 0;
    this.levelProgress.forEach(progress => {
      total += progress.stars;
    });
    return total;
  }

  /**
   * Go to next level
   */
  nextLevel(): boolean {
    const nextLevel = this.currentLevel + 1;
    return this.setCurrentLevel(nextLevel);
  }

  /**
   * Restart current level
   */
  restartLevel(): void {
    // Current level stays the same, just reset game state
  }

  /**
   * Get all registered level numbers
   */
  getAllLevels(): number[] {
    return Array.from(this.levelConfigs.keys()).sort((a, b) => a - b);
  }

  /**
   * Get total level count
   */
  getTotalLevelCount(): number {
    return this.levelConfigs.size;
  }

  /**
   * Load progress from local storage
   */
  private loadProgress(): void {
    try {
      const saved = localStorage.getItem('levelProgress');
      if (saved) {
        const data = JSON.parse(saved);
        this.currentLevel = data.currentLevel || 1;
        this.maxUnlockedLevel = data.maxUnlockedLevel || 1;
        
        if (data.progress) {
          this.levelProgress = new Map(Object.entries(data.progress).map(
            ([key, value]) => [parseInt(key), value as LevelProgress]
          ));
        }
      }
    } catch (error) {
      console.error('Failed to load level progress:', error);
    }
  }

  /**
   * Save progress to local storage
   */
  private saveProgress(): void {
    try {
      const progressObj: { [key: number]: LevelProgress } = {};
      this.levelProgress.forEach((value, key) => {
        progressObj[key] = value;
      });

      const data = {
        currentLevel: this.currentLevel,
        maxUnlockedLevel: this.maxUnlockedLevel,
        progress: progressObj
      };

      localStorage.setItem('levelProgress', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save level progress:', error);
    }
  }

  /**
   * Reset all progress (for testing)
   */
  resetProgress(): void {
    this.currentLevel = 1;
    this.maxUnlockedLevel = 1;
    this.levelProgress.clear();
    localStorage.removeItem('levelProgress');
  }
}
