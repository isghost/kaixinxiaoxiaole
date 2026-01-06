# 地图系统和计时模式说明文档

## 概述

在原有关卡系统基础上，新增了地图配置和计时模式功能，使游戏更加多样化和具有挑战性。

## 新增功能

### 1. 游戏模式 (GameMode)

支持两种游戏模式：

#### 步数模式 (MOVES)
- 传统的步数限制模式
- 在限定的移动次数内完成目标
- 配置项：`maxMoves` - 最大移动次数

#### 计时模式 (TIMER) ⏰
- 基于时间限制的新模式
- 在限定时间内完成目标
- 配置项：`timeLimit` - 时间限制（秒）
- 首次移动时开始计时
- 时间耗尽游戏结束

### 2. 地图配置系统

#### 地图配置接口 (MapConfig)

```typescript
interface MapConfig {
  name: string;      // 地图名称
  width: number;     // 地图宽度
  height: number;    // 地图高度
  cells?: MapCellConfig[];  // 单元格配置（可选）
}
```

#### 单元格配置 (MapCellConfig)

```typescript
interface MapCellConfig {
  x: number;          // X坐标（从1开始）
  y: number;          // Y坐标（从1开始）
  active: boolean;    // 是否激活（false=障碍物/空位）
  presetType?: number;    // 预设方块类型
  presetStatus?: string;  // 预设方块状态（特殊方块）
}
```

#### 预定义地图

系统提供4种预定义地图：

1. **标准地图 (standard_9x9)**
   - 经典9x9全激活地图
   - 适合初级关卡

2. **爱心地图 (heart_shape)**
   - 心形布局
   - 顶部和底部有空位
   - 增加难度和趣味性

3. **十字地图 (cross_shape)**
   - 十字形布局
   - 四角为空
   - 需要特殊策略

4. **钻石地图 (diamond_shape)**
   - 菱形布局
   - 上下呈三角形
   - 高难度挑战

### 3. 关卡配置增强

#### 新增配置项

```typescript
{
  level: 4,
  name: '争分夺秒',
  gameMode: GameMode.TIMER,    // 游戏模式
  timeLimit: 60,               // 时间限制（计时模式）
  mapConfig: MAPS['heart_shape'],  // 地图配置
  cellTypeCount: 4,
  objectives: [...],
  starScores: [3500, 5000, 7000]
}
```

## 使用方法

### 创建计时模式关卡

```typescript
{
  level: 4,
  name: '争分夺秒',
  gameMode: GameMode.TIMER,
  timeLimit: 60,  // 60秒限制
  cellTypeCount: 4,
  objectives: [
    {
      type: LevelObjectiveType.SCORE,
      targetScore: 3500
    }
  ],
  starScores: [3500, 5000, 7000]
}
```

### 创建自定义地图关卡

```typescript
{
  level: 5,
  name: '爱心连连',
  gameMode: GameMode.MOVES,
  maxMoves: 25,
  mapConfig: MAPS['heart_shape'],  // 使用预定义地图
  cellTypeCount: 5,
  objectives: [...],
  starScores: [...]
}
```

### 创建完全自定义地图

```typescript
const customMap: MapConfig = {
  name: '自定义地图',
  width: 7,
  height: 7,
  cells: [
    // 阻挡四角
    { x: 1, y: 1, active: false },
    { x: 7, y: 1, active: false },
    { x: 1, y: 7, active: false },
    { x: 7, y: 7, active: false },
    // 中心预设特殊方块
    { x: 4, y: 4, active: true, presetType: 1, presetStatus: 'bird' }
  ]
};

{
  level: 11,
  name: '自定义挑战',
  gameMode: GameMode.TIMER,
  timeLimit: 90,
  mapConfig: customMap,
  cellTypeCount: 5,
  objectives: [...],
  starScores: [...]
}
```

## 游戏逻辑适配

### GameModel 适配

1. **初始化适配**
   - `initWithLevel()` 方法现在支持不规则地图
   - 自动处理被阻挡的单元格（设为 null）
   - 支持预设方块类型和状态

2. **计时器支持**
   - `updateTimer(deltaTime)` - 更新计时器
   - `startTimer()` - 开始计时
   - `stopTimer()` - 停止计时
   - `getTimeElapsed()` - 获取已用时间
   - `getRemainingTime()` - 获取剩余时间

3. **游戏结束判定**
   - 步数模式：步数用尽
   - 计时模式：时间耗尽

### GameController 适配

1. **UI 更新**
   - 自动识别游戏模式
   - 步数模式显示：`剩余步数: X`
   - 计时模式显示：`剩余时间: X秒`
   - 关卡标签显示模式：`关卡 X [步数/计时]`

2. **计时器管理**
   - 在 `update()` 中自动更新计时器
   - 首次移动时启动计时器

## 预设关卡更新

系统现已包含10个关卡，混合使用不同模式和地图：

| 关卡 | 名称 | 模式 | 地图 | 限制 | 特点 |
|-----|------|------|------|------|------|
| 1 | 初见萌宠 | 步数 | 标准 | 20步 | 教学关卡 |
| 2 | 欢乐时光 | 步数 | 标准 | 25步 | 增加难度 |
| 3 | 消除达人 | 步数 | 标准 | 30步 | 更多步数 |
| 4 | 争分夺秒 | **计时** | 标准 | **60秒** | 首个计时关卡 |
| 5 | 爱心连连 | 步数 | **爱心** | 25步 | 首个特殊地图 |
| 6 | 时间竞速 | **计时** | 标准 | **90秒** | 更长时间 |
| 7 | 十字交叉 | 步数 | **十字** | 30步 | 十字形地图 |
| 8 | 钻石时刻 | **计时** | **钻石** | **75秒** | 计时+特殊地图 |
| 9 | 大师之路 | 步数 | 标准 | 30步 | 高难度 |
| 10 | 终极挑战 | **计时** | 标准 | **120秒** | Boss关卡 |

## API 参考

### LevelConfig 新增方法

```typescript
// 游戏模式
getGameMode(): GameMode
isTimerMode(): boolean

// 时间限制
getTimeLimit(): number

// 地图配置
getMapConfig(): MapConfig | undefined
hasCustomMap(): boolean
isCellActive(x: number, y: number): boolean
getPresetCellType(x: number, y: number): number | undefined
getPresetCellStatus(x: number, y: number): string | undefined
```

### GameModel 新增方法

```typescript
// 计时器
updateTimer(deltaTime: number): void
startTimer(): void
stopTimer(): void
getTimeElapsed(): number
getRemainingTime(): number
```

## 扩展建议

### 更多地图形状

可以创建更多有趣的地图形状：
- 星形
- 字母形状
- 圆形
- 随机障碍物

### 动态障碍物

在 MapCellConfig 中添加：
```typescript
interface MapCellConfig {
  // ...现有字段
  obstacle?: string;  // 障碍物类型（冰块、石头等）
  countdown?: number; // 倒计时障碍物
}
```

### 混合模式

同时限制步数和时间：
```typescript
{
  gameMode: GameMode.MIXED,
  maxMoves: 20,
  timeLimit: 60
}
```

## 最佳实践

1. **难度递进**
   - 先让玩家熟悉步数模式
   - 再引入计时模式
   - 最后结合特殊地图

2. **地图设计**
   - 保持对称性（更美观）
   - 确保有足够的活跃单元格
   - 避免死角设计

3. **时间平衡**
   - 初期计时关卡给予充足时间（60-90秒）
   - 根据地图复杂度调整时间
   - Boss关卡可以设置更长时间（120秒+）

4. **测试建议**
   - 测试所有地图的可玩性
   - 确保计时模式时间合理
   - 验证障碍物单元格正确阻挡

## 技术说明

### 地图数据结构

- 单元格坐标从 1 开始（不是 0）
- 阻挡的单元格在 cells 数组中设为 null
- 未在 cells 配置中的单元格默认为激活状态

### 性能优化

- 地图配置在关卡加载时一次性解析
- 计时器仅在计时模式下更新
- UI 更新优化：仅在状态变化或计时模式时更新

---

*更新日期: 2026/01/06*
*新增功能: 计时模式 + 地图系统*
