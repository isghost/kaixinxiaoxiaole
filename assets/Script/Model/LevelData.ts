import { LevelConfigData, LevelObjectiveType, GameMode, MapConfig } from './LevelConfig';

/**
 * Pre-defined map configurations
 */
export const MAPS: { [key: string]: MapConfig } = {
  // Standard 9x9 grid - all cells active
  'standard_9x9': {
    name: '标准地图',
    width: 9,
    height: 9
  },
  
  // Heart-shaped map
  'heart_shape': {
    name: '爱心地图',
    width: 9,
    height: 9,
    cells: [
      // Row 1: block corners
      { x: 1, y: 1, active: false },
      { x: 2, y: 1, active: false },
      { x: 5, y: 1, active: false },
      { x: 8, y: 1, active: false },
      { x: 9, y: 1, active: false },
      // Row 2: slight narrowing
      { x: 1, y: 2, active: false },
      { x: 9, y: 2, active: false },
      // Row 9: bottom point
      { x: 1, y: 9, active: false },
      { x: 2, y: 9, active: false },
      { x: 3, y: 9, active: false },
      { x: 4, y: 9, active: false },
      { x: 6, y: 9, active: false },
      { x: 7, y: 9, active: false },
      { x: 8, y: 9, active: false },
      { x: 9, y: 9, active: false },
      // Row 8: narrowing
      { x: 1, y: 8, active: false },
      { x: 2, y: 8, active: false },
      { x: 8, y: 8, active: false },
      { x: 9, y: 8, active: false },
      // Row 7: more narrowing
      { x: 1, y: 7, active: false },
      { x: 9, y: 7, active: false }
    ]
  },
  
  // Cross-shaped map
  'cross_shape': {
    name: '十字地图',
    width: 9,
    height: 9,
    cells: [
      // Block corners to form a cross
      { x: 1, y: 1, active: false },
      { x: 2, y: 1, active: false },
      { x: 3, y: 1, active: false },
      { x: 7, y: 1, active: false },
      { x: 8, y: 1, active: false },
      { x: 9, y: 1, active: false },
      { x: 1, y: 2, active: false },
      { x: 2, y: 2, active: false },
      { x: 3, y: 2, active: false },
      { x: 7, y: 2, active: false },
      { x: 8, y: 2, active: false },
      { x: 9, y: 2, active: false },
      { x: 1, y: 3, active: false },
      { x: 2, y: 3, active: false },
      { x: 3, y: 3, active: false },
      { x: 7, y: 3, active: false },
      { x: 8, y: 3, active: false },
      { x: 9, y: 3, active: false },
      { x: 1, y: 7, active: false },
      { x: 2, y: 7, active: false },
      { x: 3, y: 7, active: false },
      { x: 7, y: 7, active: false },
      { x: 8, y: 7, active: false },
      { x: 9, y: 7, active: false },
      { x: 1, y: 8, active: false },
      { x: 2, y: 8, active: false },
      { x: 3, y: 8, active: false },
      { x: 7, y: 8, active: false },
      { x: 8, y: 8, active: false },
      { x: 9, y: 8, active: false },
      { x: 1, y: 9, active: false },
      { x: 2, y: 9, active: false },
      { x: 3, y: 9, active: false },
      { x: 7, y: 9, active: false },
      { x: 8, y: 9, active: false },
      { x: 9, y: 9, active: false }
    ]
  },
  
  // Diamond-shaped map
  'diamond_shape': {
    name: '钻石地图',
    width: 9,
    height: 9,
    cells: [
      // Top triangle
      { x: 1, y: 1, active: false },
      { x: 2, y: 1, active: false },
      { x: 3, y: 1, active: false },
      { x: 4, y: 1, active: false },
      { x: 6, y: 1, active: false },
      { x: 7, y: 1, active: false },
      { x: 8, y: 1, active: false },
      { x: 9, y: 1, active: false },
      { x: 1, y: 2, active: false },
      { x: 2, y: 2, active: false },
      { x: 3, y: 2, active: false },
      { x: 7, y: 2, active: false },
      { x: 8, y: 2, active: false },
      { x: 9, y: 2, active: false },
      { x: 1, y: 3, active: false },
      { x: 2, y: 3, active: false },
      { x: 8, y: 3, active: false },
      { x: 9, y: 3, active: false },
      { x: 1, y: 4, active: false },
      { x: 9, y: 4, active: false },
      // Bottom triangle
      { x: 1, y: 6, active: false },
      { x: 9, y: 6, active: false },
      { x: 1, y: 7, active: false },
      { x: 2, y: 7, active: false },
      { x: 8, y: 7, active: false },
      { x: 9, y: 7, active: false },
      { x: 1, y: 8, active: false },
      { x: 2, y: 8, active: false },
      { x: 3, y: 8, active: false },
      { x: 7, y: 8, active: false },
      { x: 8, y: 8, active: false },
      { x: 9, y: 8, active: false },
      { x: 1, y: 9, active: false },
      { x: 2, y: 9, active: false },
      { x: 3, y: 9, active: false },
      { x: 4, y: 9, active: false },
      { x: 6, y: 9, active: false },
      { x: 7, y: 9, active: false },
      { x: 8, y: 9, active: false },
      { x: 9, y: 9, active: false }
    ]
  }
};

/**
 * Pre-defined level configurations
 * Based on mainstream match-3 game design patterns
 */
export const DEFAULT_LEVELS: LevelConfigData[] = [
  // Level 1 - Tutorial level (Easy)
  {
    level: 1,
    name: '初见萌宠',
    gameMode: GameMode.MOVES,
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
    gameMode: GameMode.MOVES,
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
    gameMode: GameMode.MOVES,
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

  // Level 4 - First timer mode level!
  {
    level: 4,
    name: '争分夺秒',
    gameMode: GameMode.TIMER,
    timeLimit: 60,
    cellTypeCount: 4,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 3500
      }
    ],
    starScores: [3500, 5000, 7000]
  },

  // Level 5 - Heart-shaped map
  {
    level: 5,
    name: '爱心连连',
    gameMode: GameMode.MOVES,
    maxMoves: 25,
    mapConfig: MAPS['heart_shape'],
    cellTypeCount: 5,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 4000
      }
    ],
    starScores: [4000, 6000, 8000]
  },

  // Level 6 - Timer mode with more types
  {
    level: 6,
    name: '时间竞速',
    gameMode: GameMode.TIMER,
    timeLimit: 90,
    cellTypeCount: 5,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 6000
      }
    ],
    starScores: [6000, 9000, 12000]
  },

  // Level 7 - Cross-shaped map
  {
    level: 7,
    name: '十字交叉',
    gameMode: GameMode.MOVES,
    maxMoves: 30,
    mapConfig: MAPS['cross_shape'],
    cellTypeCount: 5,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 5000
      }
    ],
    starScores: [5000, 7500, 10000]
  },

  // Level 8 - Diamond map with timer
  {
    level: 8,
    name: '钻石时刻',
    gameMode: GameMode.TIMER,
    timeLimit: 75,
    mapConfig: MAPS['diamond_shape'],
    cellTypeCount: 6,
    objectives: [
      {
        type: LevelObjectiveType.SCORE,
        targetScore: 5000
      }
    ],
    starScores: [5000, 8000, 11000]
  },

  // Level 9 - High difficulty standard
  {
    level: 9,
    name: '大师之路',
    gameMode: GameMode.MOVES,
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

  // Level 10 - Boss level with timer
  {
    level: 10,
    name: '终极挑战',
    gameMode: GameMode.TIMER,
    timeLimit: 120,
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
