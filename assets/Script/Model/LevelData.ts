import { LevelConfigData, LevelObjectiveType } from './LevelConfig';

/**
 * Pre-defined level configurations
 * Based on mainstream match-3 game design patterns
 */
export const DEFAULT_LEVELS: LevelConfigData[] = [
  // Level 1 - Tutorial level (Easy)
  {
    level: 1,
    name: '初见萌宠',
    maxMoves: 20,
    cellTypeCount: 3,
    allowedCellTypes: [1, 2, 3],
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 1000
      }
    ],
    starScores: [1000, 1500, 2000]
  },

  // Level 2 - Introduction to more types
  {
    level: 2,
    name: '欢乐时光',
    maxMoves: 25,
    cellTypeCount: 4,
    allowedCellTypes: [1, 2, 3, 4],
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 2000
      }
    ],
    starScores: [2000, 3000, 4000]
  },

  // Level 3 - More challenge
  // Note: allowedCellTypes is optional - will default to [1,2,3,4] based on cellTypeCount
  {
    level: 3,
    name: '消除达人',
    maxMoves: 30,
    cellTypeCount: 4,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 3000
      }
    ],
    starScores: [3000, 4500, 6000]
  },

  // Level 4 - Full type challenge
  {
    level: 4,
    name: '萌宠大集合',
    maxMoves: 25,
    cellTypeCount: 5,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 4000
      }
    ],
    starScores: [4000, 6000, 8000]
  },

  // Level 5 - Limited moves challenge
  {
    level: 5,
    name: '极限挑战',
    maxMoves: 20,
    cellTypeCount: 5,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 5000
      }
    ],
    starScores: [5000, 7500, 10000]
  },

  // Level 6 - All types
  {
    level: 6,
    name: '萌宠嘉年华',
    maxMoves: 30,
    cellTypeCount: 6,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 6000
      }
    ],
    starScores: [6000, 9000, 12000]
  },

  // Level 7 - High score challenge
  {
    level: 7,
    name: '高分冲刺',
    maxMoves: 25,
    cellTypeCount: 5,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 8000
      }
    ],
    starScores: [8000, 12000, 16000]
  },

  // Level 8 - Very limited moves
  {
    level: 8,
    name: '步步为营',
    maxMoves: 15,
    cellTypeCount: 4,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 5000
      }
    ],
    starScores: [5000, 8000, 11000]
  },

  // Level 9 - Complex challenge
  {
    level: 9,
    name: '大师之路',
    maxMoves: 30,
    cellTypeCount: 6,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 10000
      }
    ],
    starScores: [10000, 15000, 20000]
  },

  // Level 10 - Boss level
  {
    level: 10,
    name: '终极挑战',
    maxMoves: 25,
    cellTypeCount: 6,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 12000
      }
    ],
    starScores: [12000, 18000, 25000]
  }
];
