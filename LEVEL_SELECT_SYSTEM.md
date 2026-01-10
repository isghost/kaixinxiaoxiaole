# 关卡选择系统说明文档

## 概述

关卡选择系统提供了类似"开心消消乐"和"Candy Crush"的关卡选择界面，允许玩家浏览所有关卡并选择要玩的关卡。

## 主要特点

### 1. 关卡展示
- **从下往上排列**：关卡从底部到顶部排列，符合主流消消乐游戏的设计
- **滚动视图**：支持上下滑动浏览所有关卡
- **自动定位**：自动滚动到当前可玩关卡

### 2. 关卡状态显示

#### 未解锁关卡
- 显示🔒图标
- 灰色背景
- 点击无效

#### 已解锁关卡
- 白色背景
- 显示关卡编号
- 可以点击进入

#### 已完成关卡
- 浅绿色背景
- 显示获得的星星数（1-3颗⭐）
- 可以重复游玩

### 3. 关卡信息显示

每个关卡显示以下信息：

- **关卡编号**：显示在中央
- **游戏模式图标**：
  - 👣 = 步数模式
  - ⏰ = 计时模式
- **地图类型图标**：不同颜色表示不同地图
  - 粉色 = 爱心地图
  - 蓝色 = 十字地图
  - 紫色 = 钻石地图
  - 灰色 = 标准地图
- **星星**：显示已获得的星星数

## 技术实现

### 组件结构

#### LevelSelectController
主控制器，负责：
- 初始化关卡管理器
- 创建关卡选择UI
- 处理关卡点击事件
- 场景跳转

#### LevelItem
关卡项组件，提供：
- 静态工厂方法创建关卡项
- 程序化生成UI元素
- 临时替代美术资源

#### LevelSelectSceneBuilder
场景构建器，自动创建：
- 背景
- 标题
- 返回按钮
- 滚动视图
- 关卡容器

### 场景流程

```
Login.scene → LevelSelect.scene → Game.scene
   ↑                                    ↓
   └────────────────────────────────────┘
```

### UI 层次结构

```
Canvas (LevelSelectSceneBuilder + LevelSelectController)
├── Background (天蓝色背景)
├── Title ("选择关卡")
├── BackButton (返回按钮)
└── ScrollView
    └── view
        └── content (Layout: VERTICAL, BOTTOM_TO_TOP)
            ├── LevelItem (Level 10)
            ├── LevelItem (Level 9)
            ├── ...
            └── LevelItem (Level 1)  ← 最底部
```

## 使用方法

### 在 Cocos Creator 中设置

1. **创建 LevelSelect.scene**
   - 新建场景
   - 在 Canvas 添加 LevelSelectSceneBuilder 组件
   - 在 Canvas 添加 LevelSelectController 组件

2. **配置 LevelSelectController**
   - 将自动创建的 `content` 节点拖到 `levelItemContainer` 属性
   - 将自动创建的 `ScrollView` 节点拖到 `scrollView` 属性
   - `levelItemPrefab` 可以留空（会自动程序化创建）

3. **配置返回按钮**
   - 找到 BackButton 节点
   - 在 Button 组件的 Click Events 中添加事件
   - 目标：LevelSelectController
   - 方法：onBackButton

### 程序化创建（无需场景文件）

如果无法在编辑器中操作，可以完全程序化创建：

```typescript
// 在某个入口组件中
const canvas = this.node.getComponent(Canvas);

// 添加场景构建器
const builder = canvas.addComponent(LevelSelectSceneBuilder);

// 添加控制器
const controller = canvas.addComponent(LevelSelectController);

// 等待构建完成后设置引用
this.scheduleOnce(() => {
    const scrollView = canvas.node.getChildByName('ScrollView');
    const content = scrollView?.getChildByPath('view/content');
    
    if (scrollView && content) {
        controller.scrollView = scrollView.getComponent(ScrollView);
        controller.levelItemContainer = content;
    }
}, 0);
```

## 关卡项自定义

### 修改关卡项外观

在 `LevelItem.createLevelItem()` 中可以自定义：

```typescript
// 修改尺寸
transform.setContentSize(new Size(150, 150));

// 修改颜色
sprite.color = new Color(255, 200, 150, 255);

// 修改字体大小
levelLabelComp.fontSize = 48;
```

### 添加自定义图标

```typescript
// 在 LevelItem.createLevelItem() 中
const customIcon = new Node('CustomIcon');
customIcon.parent = levelItem;
// ... 设置位置、大小、图片等
```

## 关卡地图可视化

关卡选择界面使用不同颜色的图标来区分地图类型：

| 地图类型 | 颜色 | 色值 |
|---------|------|------|
| 标准地图 | 灰色 | (128, 128, 128) |
| 爱心地图 | 粉色 | (255, 105, 180) |
| 十字地图 | 蓝色 | (100, 149, 237) |
| 钻石地图 | 紫色 | (147, 112, 219) |

## API 参考

### LevelSelectController

```typescript
class LevelSelectController extends Component {
    // 属性
    levelItemContainer: Node | null;
    levelItemPrefab: Prefab | null;
    scrollView: ScrollView | null;
    
    // 方法
    onLoad(): void;
    onBackButton(): void;
    
    // 私有方法
    private createLevelItems(): void;
    private setupLevelItem(levelItem: Node, levelConfig: LevelConfig, 
                          isUnlocked: boolean, progress: any): void;
    private onLevelItemClick(levelNum: number, isUnlocked: boolean): void;
    private scrollToCurrentLevel(): void;
}
```

### LevelItem

```typescript
class LevelItem extends Component {
    static createLevelItem(parent: Node): Node;
}
```

### LevelSelectSceneBuilder

```typescript
class LevelSelectSceneBuilder extends Component {
    onLoad(): void;
    private buildScene(): void;
}
```

## 扩展功能

### 1. 添加关卡预览

在关卡项中显示地图预览：

```typescript
// 创建小型地图预览
const mapPreview = new Node('MapPreview');
// 根据 levelConfig.getMapConfig() 绘制小型地图网格
```

### 2. 添加动画效果

```typescript
import { tween } from 'cc';

// 关卡项出现动画
tween(levelItem)
    .from(0.3, { scale: new Vec3(0, 0, 1) })
    .start();

// 解锁动画
tween(lockIcon)
    .to(0.3, { scale: new Vec3(0, 0, 1) })
    .call(() => { lockIcon.active = false; })
    .start();
```

### 3. 添加音效

```typescript
import { AudioSource } from 'cc';

// 点击音效
private onLevelItemClick(levelNum: number, isUnlocked: boolean): void {
    // 播放点击音效
    const audioSource = this.node.getComponent(AudioSource);
    if (audioSource) {
        audioSource.playOneShot(clickSound);
    }
    
    // ... 其他逻辑
}
```

### 4. 关卡组/世界系统

扩展为多世界结构：

```typescript
interface WorldConfig {
    worldId: number;
    name: string;
    levels: number[];
    backgroundColor: Color;
}

// 在 LevelSelectController 中添加世界切换
private currentWorld: number = 1;
private createWorldTabs(): void {
    // 创建世界标签页
}
```

## 美术资源建议

当有美术资源时，可以替换以下内容：

### 关卡项背景
- 未解锁：锁定状态的按钮图片
- 已解锁：普通按钮图片
- 已完成：完成状态的按钮图片

### 图标
- 地图类型：不同地图的小图标
- 游戏模式：时钟图标和脚印图标
- 锁图标：更精美的锁图标
- 星星：金色星星图片

### 背景
- 渐变色背景
- 主题相关的装饰图案
- 视差滚动背景

### 动画
- 关卡解锁动画
- 星星闪烁动画
- 关卡项悬浮/点击动画

## 性能优化

### 1. 对象池

```typescript
// 使用对象池管理关卡项
private levelItemPool: Node[] = [];

private getLevelItem(): Node {
    if (this.levelItemPool.length > 0) {
        return this.levelItemPool.pop()!;
    }
    return LevelItem.createLevelItem(this.levelItemContainer!);
}

private returnLevelItem(item: Node): void {
    item.active = false;
    this.levelItemPool.push(item);
}
```

### 2. 懒加载

只创建可见区域的关卡项：

```typescript
private createVisibleLevelItems(): void {
    const scrollY = this.scrollView!.getScrollOffset().y;
    const viewHeight = this.scrollView!.node.getComponent(UITransform)!.height;
    
    // 只创建可见范围内的关卡项
    for (const levelNum of this.getVisibleLevels(scrollY, viewHeight)) {
        // 创建关卡项
    }
}
```

## 故障排除

### 问题：关卡项不显示

**解决方案：**
1. 检查 `levelItemContainer` 是否正确设置
2. 确认 LevelManager 已初始化
3. 查看控制台日志

### 问题：滚动不流畅

**解决方案：**
1. 减少关卡项的复杂度
2. 使用对象池
3. 实现懒加载

### 问题：点击无反应

**解决方案：**
1. 确认 Button 组件已添加
2. 检查事件监听是否正确绑定
3. 验证关卡是否解锁

## 最佳实践

1. **渐进式解锁**：只解锁当前关卡+1，保持游戏挑战性
2. **视觉反馈**：提供清晰的锁定/解锁状态
3. **信息展示**：显示关键信息（星星、模式、地图）
4. **流畅体验**：优化滚动性能
5. **易于导航**：提供返回和快速跳转功能

---

*创建日期: 2026/01/10*
*组件: 关卡选择系统*
