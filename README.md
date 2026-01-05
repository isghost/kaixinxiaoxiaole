# 开心消消乐（Cocos Creator）

使用 **Cocos Creator** 编写的三消小游戏工程。

本仓库当前已升级到 **Cocos Creator 3.8.6**，并改用 **TypeScript**（开启较严格的 TS 校验）。

---

## 环境要求

- Cocos Creator：**3.8.6**（推荐使用同版本打开，避免资源/序列化格式差异）
- 操作系统：Windows / macOS 均可（本仓库示例路径以 Windows 为主）

> 说明：该工程使用 Creator 3.x 的项目结构，根目录包含 `package.json`（其中 `creator.version = 3.8.6`）。

---

## 快速开始（打开与运行）

1. 安装并启动 **Cocos Creator 3.8.6**
2. 在 Creator 中选择 **打开项目（Open Project）**，选择本仓库根目录
3. 进入编辑器后，打开场景：
	 - `assets/Scene/Login.scene`（登录/加载入口）
	 - `assets/Scene/Game.scene`（游戏主场景）
4. 点击编辑器顶部 **预览（Preview）/ 运行** 进行调试

### 场景流转说明（便于理解工程入口）

- `Login.scene` 里的 `LoginController` 会预加载并切换到 `Game.scene`
- `Game.scene` 里的 `GameController` 初始化 `GameModel`，并驱动 `GridView` 渲染与交互

---

## 构建发布

在 Creator 3.8.6 中打开：**项目（Project） → 构建发布（Build）**，选择目标平台并构建。

由于 Creator 的构建面板与平台选项会随版本变化，建议以编辑器内面板为准。

---

## 目录结构

### 资源

- `assets/Scene/`：场景（`Login.scene` / `Game.scene`）
- `assets/Prefabs/`：预制体（棋子、特效等）
- `assets/AnimationClip/`：动画资源
- `assets/Music/`：音效与 BGM
- `assets/Texture/`：贴图资源

### 脚本（TypeScript）

- `assets/Script/Controller/`：控制层（场景入口、按钮回调、业务调度）
- `assets/Script/Model/`：数据与规则（如 GameModel、CellModel、常量定义等）
- `assets/Script/View/`：视图与表现（GridView、CellView、EffectLayer 等）
- `assets/Script/Utils/`：工具类（如 Toast、音频工具等）
- `assets/Script/UnitTest/`：简单测试/验证脚本（如有）


## 更新记录

2018/01/20 升级工程到 `cocos creator` `v1.8.1`  
2018/07/01 增加一些音效  
2019/01/30 升级工程到 `cocos creator` `v2.0.7`  
2025/12/27 升级工程到 `cocos creator` `v3.8.6`，改用 `TypeScript`  
2026/01/05 **新增关卡配置系统** - 完整的关卡管理和进度追踪功能

---

## ✨ 新功能：关卡配置系统

游戏现已支持完整的关卡配置能力，包括：

### 主要特性

- 🎮 **10个预设关卡**：从简单到困难，循序渐进
- 🎯 **目标系统**：支持分数目标、消除目标等多种玩法
- ⭐ **星级评分**：根据得分获得1-3星评价
- 📊 **进度追踪**：自动保存关卡进度和最佳成绩
- 🔓 **关卡解锁**：完成关卡解锁下一关
- 🎨 **完全可配置**：通过简单的 JSON 配置即可添加新关卡

### 关卡系统特点

- **步数限制**：每关有固定的移动次数
- **分数系统**：
  - 普通消除：10分
  - 特殊方块：50-200分
  - 连击加成：每次连击 +50%
- **自动保存**：进度保存在浏览器本地存储

### 快速开始

```typescript
// 初始化关卡管理器
const levelManager = LevelManager.getInstance();
levelManager.registerLevels(DEFAULT_LEVELS);

// 开始当前关卡
const levelConfig = levelManager.getCurrentLevelConfig();
const gameModel = new GameModel();
gameModel.initWithLevel(levelConfig);
```

### 详细文档

- 📖 [完整的关卡系统说明](./LEVEL_SYSTEM.md)
- 💻 [代码使用示例](./assets/Script/USAGE_EXAMPLES.ts)
- 🧪 [测试代码](./assets/Script/UnitTest/LevelConfigTest.ts)

### 预设关卡列表

| 关卡 | 名称 | 步数 | 方块种类 | 目标分数 |
|------|------|------|----------|----------|
| 1 | 初见萌宠 | 20 | 3 | 1000 |
| 2 | 欢乐时光 | 25 | 4 | 2000 |
| 3 | 消除达人 | 30 | 4 | 3000 |
| 4 | 萌宠大集合 | 25 | 5 | 4000 |
| 5 | 极限挑战 | 20 | 5 | 5000 |
| 6 | 萌宠嘉年华 | 30 | 6 | 6000 |
| 7 | 高分冲刺 | 25 | 5 | 8000 |
| 8 | 步步为营 | 15 | 4 | 5000 |
| 9 | 大师之路 | 30 | 6 | 10000 |
| 10 | 终极挑战 | 25 | 6 | 12000 |

### 添加自定义关卡

在 `assets/Script/Model/LevelData.ts` 中添加新关卡配置：

```typescript
{
  level: 11,
  name: '超级挑战',
  maxMoves: 30,
  cellTypeCount: 6,
  objectives: [
    {
      type: LevelObjectiveType.SCORE,
      targetScore: 15000
    }
  ],
  starScores: [15000, 20000, 25000]
}
```
