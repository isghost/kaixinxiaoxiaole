import { sys } from 'cc';

const SELECTED_LEVEL_KEY = 'selectedLevelId';

export class LevelSession {
  static getSelectedLevelId(defaultId: number = 1): number {
    const raw = sys.localStorage.getItem(SELECTED_LEVEL_KEY);
    const parsed = raw ? Number(raw) : NaN;
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return defaultId;
    }
    return parsed;
  }

  static setSelectedLevelId(levelId: number): void {
    sys.localStorage.setItem(SELECTED_LEVEL_KEY, String(levelId));
  }
}
