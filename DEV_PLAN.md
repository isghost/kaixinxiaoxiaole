# 开发计划（Cocos Creator 3.8.6）

> 适用工程：开心消消乐（本仓库）  
> 版本状态：已升级到 **Cocos Creator 3.8.6**，脚本主要为 **TypeScript**，并开启较严格的 TS 校验（见 `tsconfig.json`）。

---

## 1. 项目现状分析（基于代码与目录）

### 1.1 引擎与工程结构

- 引擎版本：Cocos Creator **3.8.6**（见根目录 `package.json` 的 `creator.version`）
- 场景：
  - `assets/Scene/Login.scene`：入口/加载
  - `assets/Scene/Game.scene`：主玩法
- 脚本分层（约定俗成的 MVC）：
  - `assets/Script/Controller/`：入口控制与按钮事件（如 `LoginController`、`GameController`）
  - `assets/Script/Model/`：核心规则与数据（如 `GameModel`、`CellModel`、`ConstValue`）
  - `assets/Script/View/`：网格渲染、动画与特效（如 `GridView`、`CellView`、`EffectLayer`）
  - `assets/Script/Utils/`：通用工具（如 `AudioUtils`、`Toast`、`ModelUtils`）

### 1.2 玩法链路（入口到交互）

- `LoginController`：预加载并切换到 `Game` 场景
- `GameController`：初始化 `GameModel`，把 `cells` 传给 `GridView`，并处理音频开关与 Toast 提示
- `GridView`：
  - 初始化 9×9 视图网格
  - 监听触摸（`TOUCH_START` / `TOUCH_MOVE`）并把触摸位置转换为格子坐标
  - 调用 `controller.selectCell()` 获取：
    - `changeModels`：需要播放动画/更新的格子模型列表
    - `effectsQueue`：需要播放的特效队列
  - 驱动：`CellView.updateView()` 与 `EffectLayer.playEffects()`

### 1.3 规则与数据结构（核心 Model）

- 网格固定：`GRID_WIDTH = 9`、`GRID_HEIGHT = 9`，并使用 **1 起始索引**（范围 1..9）
- `GameModel.selectCell(pos)`：交换、检测、消除、下落、补齐等（内部维护 `curTime` 做时序排程）
- 特殊消除：由 `CELL_STATUS` 表达（`LINE` / `COLUMN` / `WRAP` / `BIRD` 等）
- 特效播放：通过 `EffectCommand`（`playTime`、`pos`、`action`、`step?`）在 View 层异步触发

### 1.4 迁移后的现状（3.x 常见点已适配）

- UI 尺寸与透明度：已使用 `UITransform` / `UIOpacity`（避免 `node.width/height` 旧写法）
- 动画：3.8 的 `Animation.play()` 返回 `void`，如需状态应使用 `getState()`
- TS 严格度：`tsconfig.json` 开启 `strict` 等选项，新增代码需要更规范的类型与空值处理

---

## 2. 开发目标（建议）

### 2.1 近期目标（升级后稳定）

- 确认升级后的玩法完整可玩：交换/消除/特效/音效/连续消除提示
- 降低迁移期遗留的不确定性：减少 `any`、减少字符串式 `getComponent()`、减少过量日志
- 建立最小回归手段：每次改动都能快速验证“核心链路不坏”

### 2.2 中期目标（可发布质量）

- 性能与稳定性：长时间游玩无明显卡顿/内存持续增长
- 体验一致性：不同分辨率/不同平台输入准确，UI 显示正常
- 构建可重复：Web/Android/iOS（按你的目标平台）构建参数明确、可复现

---

## 3. 里程碑与工作拆解（可直接执行）

> 时间仅为建议，你可以按团队节奏调整。

### M0：基线确认与工程卫生（0.5～1 天）

- 在 Creator 3.8.6：
  - 能打开项目、无脚本报错
  - 预览运行：`Login.scene → Game.scene` 链路正常
  - 核心交互：点击/滑动交换、可触发消除
- 仓库卫生（建议项）：
  - 检查 `.gitignore` 是否屏蔽 `library/`、`temp/`、`profiles/` 等生成目录（避免提交体积暴涨）
  - `settings/` 是否纳入版本控制：
    - 通常建议 **保留并纳入**（团队协作更稳定）
    - 如你有明确策略，也可只保留必要子项，但要统一规则

交付物：可运行基线 + README/忽略规则明确。

### M1：核心玩法回归与确定性（1～3 天）

目标：把“看起来能玩”变成“稳定能玩”。

- 规则回归清单（手工 + 自动化最小化）：
  - 普通 3 消除
  - 4 连生成 LINE/COLUMN
  - T/L 型生成 WRAP
  - 5 连生成 BIRD
  - 特殊与特殊互换（以及 BIRD 逻辑）
  - 连续消除（cascade）流程正确
- 建议新增（不影响玩法的前提下）：
  - 将 `GameModel` 的关键分支加断言/保护（防止数组越界、空引用）
  - 为 `GameModel` 增加一个“纯逻辑可跑”的最小测试入口：
    - 方案 A（轻量）：在 `assets/Script/UnitTest/` 增加一个测试组件，运行时输出断言结果
    - 方案 B（更工程化）：引入独立的 TS 测试框架（Jest/Vitest）并在 CI 执行（会增加依赖与配置）

交付物：回归清单 + 最小自动化（至少能一键验证核心规则）。

### M2：表现层与输入准确性（1～2 天）

- 输入：
  - 触摸坐标转换在不同分辨率/缩放下仍正确（重点检查 `GridView.convertTouchPosToCell`）
  - 滑动交换的判定（起点格与当前格）在边界条件下不误触
- 动画与特效：
  - `CellView.updateView()` 的 tween 队列时序正确（delay/position/销毁）
  - `EffectLayer.playEffects()` 的销毁逻辑可靠（FINISHED 与 safety timeout 不重复销毁）
- 日志治理（强烈建议）：
  - 把大量 `console.log` 收敛到可控开关（例如 `DEBUG_LOG` 常量），避免影响性能与控制台可读性

交付物：输入准确、表现稳定、日志可控。

### M3：音频与用户提示一致性（0.5～1 天）

- BGM：进入/退出场景时行为一致（是否循环、是否默认开启、是否需要全局单例）
- 音效：
  - 点击、交换、消除、连续消除音效不叠加到失控
  - 音量/静音状态可持久化（可选：LocalStorage）
- Toast：
  - 文本过长换行、背景绘制、淡出时长在不同分辨率下表现一致

交付物：音频行为明确 + 提示体验稳定。

### M4：构建发布与版本管理（1～2 天）

- 明确目标平台（Web / Android / iOS）与配置：
  - 构建参数、资源压缩策略、首包大小目标
- 发布检查清单（Checklist）：
  - 关键功能回归通过
  - 关键资源引用无丢失
  - 性能（帧率/内存）达到可接受范围
- 版本号规则：
  - 建议采用 `MAJOR.MINOR.PATCH`（例如 `3.8.6+game.0.1.0` 的内部标识）

交付物：可重复构建 + 发布 checklist + 版本策略。

---

## 4. 技术债清单（按优先级）

### P0（建议尽快处理）

- 减少 `any`：例如 `GameModel.cellBgs: any`、以及部分回调参数类型
- 减少字符串式组件获取：如 `getComponent('EffectLayer')` → 优先改为 `getComponent(EffectLayer)`（类型更安全）
- 清理迁移期 debug 日志：避免影响性能与定位真实问题

### P1（有时间再做，但收益明显）

- 把 1..9 的硬编码收敛为常量（已存在 `GRID_WIDTH/HEIGHT`，建议全量替换）
- 将“时序”集中管理：目前 Model 里用 `curTime` 排程，View 里又有 tween/setTimeout；建议统一策略（避免竞态）
- 把 `EffectCommand.action` 从 string 收敛为联合类型（例如 `'crush' | 'rowBomb' | 'colBomb'`）

### P2（可选增强）

- 增加可配置关卡数据（目标、步数、掉落权重等）
- 增加数据持久化（音量、历史最高分/关卡进度）

---

## 5. 质量标准（建议采用）

- 代码：
  - 新增/修改脚本尽量通过 TS 严格检查
  - 重要逻辑（消除、生成特殊、连锁）必须有可复现的验证方式
- 性能：
  - 避免每帧频繁 `console.log`
  - 节点销毁要可控（避免泄漏/重复销毁）
- 稳定性：
  - 空引用保护（prefab/audio/节点引用缺失时能给出明确错误而不是崩溃）

---

## 6. 风险与对策

- 风险：Creator 2.x → 3.x 迁移遗留行为差异（动画、坐标系、UI 尺寸）
  - 对策：用回归清单覆盖 + 关键函数加日志开关与断言
- 风险：Model 时序与 View 时序双重维护导致竞态
  - 对策：明确“时序来源唯一”，逐步把 setTimeout/tween 的触发点收敛
- 风险：资源引用丢失或序列化差异导致某些 prefab/clip 运行时缺失
  - 对策：启动时做关键资源自检（例如音效、特效 prefab）并输出可读错误

---

## 7. 建议的下一步（最短路径）

1. 先按 M0 走通：确认所有人本地都能打开/预览运行
2. 建立 M1 的回归清单（手工也行），把“核心玩法稳定”放在第一位
3. 再做 M2/M3 的体验收敛，最后进入 M4 构建发布
