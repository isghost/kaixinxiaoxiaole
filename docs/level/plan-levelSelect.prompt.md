## 关卡选择与关卡配置执行计划

目标：新增关卡选择页与关卡系统，使用 JSON 配置文件，关卡自定义公式评星，关卡选择 UI 纵向滚动，地图支持不规则。

### Step 1：关卡配置与进度模型（JSON）
- 新增关卡配置 JSON：assets/resources/levels.json。
- 新增数据结构与读取逻辑：assets/Script/Model/LevelConfig.ts、assets/Script/Model/LevelFormula.ts、assets/Script/Model/LevelProgress.ts。
- 定义关卡字段：id、mode（steps/time）、target（得分或目标）、grid（rows/cols）、mask（0/1）、unlock（starsRequired）、starFormula（自定义公式）。

### Step 2：棋盘改造支持不规则地图
- GameModel 支持传入关卡配置：动态 rows/cols + mask。
- GridView 支持根据 rows/cols 渲染与坐标换算。
- 匹配/消除逻辑忽略 mask=0 的格子。

### Step 3：关卡流程（步数/计时）
- GameController 接入关卡配置：模式驱动步数或计时。
- 关卡结束判定：完成目标或失败条件。

### Step 3.5：场景流转（Login → Level → Game）
- Login 完成后进入 Level 场景。
- Level 选择关卡后进入 Game 场景，并带入关卡 id。

### Step 4：星级评定与解锁
- LevelProgress 保存关卡星级与解锁状态。
- 公式求值：LevelFormula 根据关卡配置公式计算星级（自定义公式）。

### Step 5：关卡选择 UI（纵向滚动）
- 新增 LevelSelectScene + ScrollView + LevelItem。
- 显示关卡号、星级、锁定状态。
- 点击进入游戏场景并带入关卡 id。

### Step 6：临时美术资源（openemoji）
- 从 openemoji 复制 PNG 到 assets/Texture/LevelSelect/。
- 重命名为易读名称，并绑定到 UI。

---
当前执行进度：
- Step 1 已完成（新增 JSON 配置与基础模型/公式/进度结构）。
- Step 2 已完成（棋盘与输入适配动态尺寸与不规则 mask）。
- Step 3 基础逻辑已完成（步数/计时/目标判定，无 UI）。
- Step 3.5 已完成（Login → Level → Game 流程与关卡选择占位）。
- Step 4 已完成（关卡星级评定与解锁数据接入）。
- Step 5 已完成（关卡选择 UI 纵向滚动，运行时生成 UI）。

### Step 6：临时美术资源（openemoji）
- 已从 openemoji 复制并重命名到 assets/Texture/LevelSelect（star/crown/lock/unlock/timer/target/arrow_down）。
- 已将关卡 UI 图标与背景复制到 resources/level-select 并接入运行时 UI。

### Step 7：UI 优化与内容扩充
- 关卡卡片样式优化，添加卡片背景与布局调整。
- 关卡数扩展到 20，Level 1 地图改为心形。
- Game 场景增加返回按钮。
- 修复下落逻辑为逐格下落（保留不规则地图支持）。

备注：LevelSelectController 已在 Login → Level 跳转后运行时自动挂载到 LevelRoot。
