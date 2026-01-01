import { sys } from 'cc';

const KEY_UNLOCKED = 'level.unlocked';
const KEY_SELECTED = 'level.selected';
const KEY_STARS_PREFIX = 'level.stars.';

export default class LevelProgress {
  static getUnlockedLevel(defaultValue = 1): number {
    const raw = sys.localStorage.getItem(KEY_UNLOCKED);
    const value = raw ? parseInt(raw, 10) : defaultValue;
    return Number.isFinite(value) && value >= 1 ? value : defaultValue;
  }

  static setUnlockedLevel(level: number): void {
    const v = Math.max(1, Math.floor(level));
    sys.localStorage.setItem(KEY_UNLOCKED, String(v));
  }

  static getSelectedLevel(defaultValue = 1): number {
    const raw = sys.localStorage.getItem(KEY_SELECTED);
    const value = raw ? parseInt(raw, 10) : defaultValue;
    return Number.isFinite(value) && value >= 1 ? value : defaultValue;
  }

  static setSelectedLevel(level: number): void {
    const v = Math.max(1, Math.floor(level));
    sys.localStorage.setItem(KEY_SELECTED, String(v));
  }

  static getStars(level: number): number {
    const raw = sys.localStorage.getItem(KEY_STARS_PREFIX + String(level));
    const value = raw ? parseInt(raw, 10) : 0;
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(3, value));
  }

  static setStars(level: number, stars: number): void {
    const s = Math.max(0, Math.min(3, Math.floor(stars)));
    sys.localStorage.setItem(KEY_STARS_PREFIX + String(level), String(s));
  }
}
