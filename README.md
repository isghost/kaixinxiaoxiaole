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

---

## 本地 AI 临时美术资源工具（SVG → PNG）

开发期缺少美术资源时，可以让 AI 先输出“线稿 + 简单填色”的 **SVG**，然后用本工具在本地把 SVG 渲染成不同尺寸的 **PNG**，输出到项目的 `assets/Texture/temp_ai/` 下，方便后期直接替换为正式资源。

### 1) 安装依赖

仓库已内置依赖，首次拉取后执行一次：

- `npm install`

### 2) 用法

渲染单个 SVG 文件为多尺寸 PNG：

- `npm run ai:asset -- render --svgFile temp/cat.svg --name cat_01 --sizes 128,256,512`

或者从 stdin 读入 SVG：

- `type temp\\cat.svg | npm run ai:asset -- render --name cat_01 --sizes 256`

默认输出目录：`assets/Texture/temp_ai`，输出文件形如：

- `assets/Texture/temp_ai/cat_01_256.png`

> 提示：PNG 放进 `assets/` 后，Creator 会在打开工程时自动导入并生成对应 `.meta`。

### 3) 推荐给 AI 的 SVG 生成提示词模板

把下面提示词发给你常用的 AI（ChatGPT / Claude / Gemini / 本地模型等），让它只返回 SVG 文本（不要解释，不要 Markdown 代码块）：

```
请生成一个用于三消游戏的临时美术资源：{主题/物体，比如“可爱的猫头像”}。

要求：
1) 只输出一段完整可渲染的 SVG 文本，从 <svg ...> 开始到 </svg> 结束；不要任何解释、不要 Markdown 代码块。
2) 画面风格：线稿清晰、笔画均匀（类似描边插画），并用 2~4 个纯色区域做简单填充。
3) 需要有黑色描边（stroke），填充色用较柔和的纯色；不要渐变、不要滤镜、不要外部图片（no <image>），不要引用外部字体。
4) SVG 必须包含 viewBox，画面主体居中，四周留出 8% 空白边距，避免贴边。
5) 适合在 128~512 像素方形贴图中清晰可辨。

输出：仅 SVG。
```
