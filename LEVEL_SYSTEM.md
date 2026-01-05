# 关卡配置系统说明文档

## 概述

本系统为消消乐游戏添加了完整的关卡配置能力，参考主流消消乐游戏（如 Candy Crush、开心消消乐等）的设计模式实现。

## 核心功能

### 1. 关卡配置 (LevelConfig)

每个关卡可以配置以下参数：

- **基础属性**
  - `level`: 关卡编号
  - `name`: 关卡名称（如"初见萌宠"）
  - `maxMoves`: 最大步数限制
  - `cellTypeCount`: 本关卡中不同方块类型的数量（2-6种）
  - `allowedCellTypes`: 允许出现的方块类型列表

- **目标系统**
  - `objectives`: 关卡目标列表，支持：
    - `SCORE`: 达到目标分数
    - `CLEAR_TYPES`: 消除特定类型的方块
    - `SURVIVAL`: 生存模式（在步数限制内完成）

- **星级评分**
  - `starScores`: 三星评分阈值 [1星分数, 2星分数, 3星分数]
  - 根据玩家得分自动计算星级

### 2. 关卡管理器 (LevelManager)

采用单例模式，负责：

- **关卡进度管理**
  - 当前关卡追踪
  - 关卡解锁状态
  - 每关最佳成绩和星级记录

- **数据持久化**
  - 使用 localStorage 保存进度
  - 自动保存/加载玩家进度

- **关卡切换**
  - `setCurrentLevel()`: 切换到指定关卡
  - `nextLevel()`: 进入下一关
  - `restartLevel()`: 重新开始当前关卡

### 3. 游戏模型集成 (GameModel)

扩展了原有的 GameModel，添加：

- **分数系统**
  - 基础消除：10分
  - 特殊方块：50-200分
  - 连击加成：每次连击增加50%分数

- **步数追踪**
  - 实时追踪已使用步数
  - 计算剩余步数
  - 判断游戏结束条件

- **胜负判定**
  - `isGameOver()`: 检查是否用完步数
  - `checkLevelComplete()`: 检查是否完成目标
  - `getStarsEarned()`: 获取获得的星级

### 4. 游戏控制器更新 (GameController)

- **自动初始化**
  - 游戏启动时自动加载关卡配置
  - 初始化关卡管理器

- **UI更新**
  - 实时显示关卡信息（关卡号、分数、剩余步数）
  - 游戏结束时显示结果

- **关卡控制**
  - `restartLevel()`: 重新开始
  - `nextLevel()`: 下一关

## 预设关卡

系统默认包含 10 个关卡（LevelData.ts），难度递进：

| 关卡 | 名称 | 步数 | 方块种类 | 目标分数 | 特点 |
|------|------|------|----------|----------|------|
| 1 | 初见萌宠 | 20 | 3 | 1000 | 教学关卡 |
| 2 | 欢乐时光 | 25 | 4 | 2000 | 增加难度 |
| 3 | 消除达人 | 30 | 4 | 3000 | 更多步数 |
| 4 | 萌宠大集合 | 25 | 5 | 4000 | 5种方块 |
| 5 | 极限挑战 | 20 | 5 | 5000 | 步数受限 |
| 6 | 萌宠嘉年华 | 30 | 6 | 6000 | 全部方块类型 |
| 7 | 高分冲刺 | 25 | 5 | 8000 | 高分挑战 |
| 8 | 步步为营 | 15 | 4 | 5000 | 极限步数 |
| 9 | 大师之路 | 30 | 6 | 10000 | 高难度 |
| 10 | 终极挑战 | 25 | 6 | 12000 | Boss关卡 |

## 使用方法

### 添加新关卡

在 `LevelData.ts` 中添加新的关卡配置：

```typescript
{
  level: 11,
  name: '自定义关卡',
  maxMoves: 30,
  cellTypeCount: 5,
  objectives: [
    {
      type: LevelObjectiveType.SCORE,
      targetScore: 15000
    }
  ],
  starScores: [15000, 20000, 25000]
}
```

### 代码集成示例

```typescript
// 初始化关卡管理器
const levelManager = LevelManager.getInstance();
levelManager.registerLevels(DEFAULT_LEVELS);

// 获取当前关卡配置
const currentLevel = levelManager.getCurrentLevelConfig();

// 用关卡配置初始化游戏
const gameModel = new GameModel();
gameModel.initWithLevel(currentLevel);

// 检查游戏状态
if (gameModel.isGameOver()) {
  if (gameModel.checkLevelComplete()) {
    // 关卡完成
    const stars = gameModel.getStarsEarned();
    levelManager.completeLevel(currentLevel.getLevel(), gameModel.getScore(), stars);
  }
}
```

## 扩展性设计

### 未来可扩展的功能

1. **更多目标类型**
   - 收集特定数量的特殊方块
   - 在限定时间内完成
   - 达到特定连击数

2. **障碍物系统**
   - 冰块、石块等障碍
   - 特殊地形配置

3. **道具系统**
   - 关卡内可用道具
   - 道具使用次数限制

4. **关卡编辑器**
   - 可视化关卡配置界面
   - JSON 导入导出

## 文件结构

```
assets/Script/
├── Model/
│   ├── LevelConfig.ts       # 关卡配置类
│   ├── LevelManager.ts      # 关卡管理器
│   ├── LevelData.ts         # 预设关卡数据
│   └── GameModel.ts         # 游戏模型（已更新）
├── Controller/
│   └── GameController.ts    # 游戏控制器（已更新）
└── UnitTest/
    └── LevelConfigTest.ts   # 测试代码
```

## 测试

运行 `LevelConfigTest` 组件来测试系统功能：

1. 关卡配置验证
2. 关卡管理器功能
3. 游戏模型集成

## 注意事项

1. **向后兼容**：旧代码仍然可以使用 `gameModel.init(cellTypeNum)` 初始化，不受影响

2. **数据持久化**：关卡进度保存在浏览器 localStorage 中，清除浏览器数据会重置进度

3. **分数计算**：
   - 普通消除：10分/个
   - 横/竖特效：50分/个
   - 包裹特效：100分/个
   - 小鸟特效：200分/个
   - 连击加成：每次连击 +50%

4. **关卡解锁**：只能顺序解锁关卡，不能跳关

## 技术实现

- **TypeScript**: 使用严格类型检查
- **单例模式**: LevelManager 采用单例模式
- **数据驱动**: 关卡配置完全数据驱动，易于扩展
- **模块化设计**: 各个组件职责清晰，低耦合

## 常见问题

**Q: 如何重置游戏进度？**
A: 调用 `LevelManager.getInstance().resetProgress()`

**Q: 如何修改关卡难度？**
A: 编辑 `LevelData.ts` 中对应关卡的配置，调整 `maxMoves`、`targetScore` 等参数

**Q: 如何添加新的目标类型？**
A: 在 `LevelConfig.ts` 的 `LevelObjectiveType` 枚举中添加新类型，并在 `checkObjectivesMet()` 中实现判断逻辑

---

*本系统基于 Cocos Creator 3.8.6 开发*
