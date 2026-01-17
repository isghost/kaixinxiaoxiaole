import { sys } from 'cc';

export interface LevelProgressData {
  stars: Record<string, number>;
}

const STORAGE_KEY = 'levelProgress';

export class LevelProgress {
  private data: LevelProgressData;

  constructor(data?: LevelProgressData) {
    this.data = data || { stars: {} };
  }

  static load(): LevelProgress {
    const raw = sys.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new LevelProgress();

    try {
      const json = JSON.parse(raw) as LevelProgressData;
      return new LevelProgress(json);
    } catch (error) {
      console.warn('Failed to parse level progress:', error);
      return new LevelProgress();
    }
  }

  save(): void {
    sys.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  getStars(levelId: number): number {
    return Number(this.data.stars[String(levelId)] || 0);
  }

  setStars(levelId: number, stars: number): void {
    const current = this.getStars(levelId);
    if (stars > current) {
      this.data.stars[String(levelId)] = stars;
      this.save();
    }
  }

  getTotalStars(): number {
    let total = 0;
    const stars = this.data.stars;
    for (const key in stars) {
      if (Object.prototype.hasOwnProperty.call(stars, key)) {
        total += Number(stars[key] || 0);
      }
    }
    return total;
  }

  isUnlocked(starsRequired: number): boolean {
    return this.getTotalStars() >= starsRequired;
  }
}
