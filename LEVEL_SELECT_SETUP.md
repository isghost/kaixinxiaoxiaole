# 关卡选择场景设置指南

本指南提供在 Cocos Creator 中手动设置关卡选择场景的详细步骤。

## 方法一：自动构建（推荐）

最简单的方式是使用自动构建功能。

### 步骤

1. **创建新场景**
   - File → New Scene
   - 命名为 `LevelSelect.scene`
   - 保存到 `assets/Scene/` 目录

2. **添加自动构建组件**
   - 选中 Canvas 节点
   - 在 Inspector 面板点击 "Add Component"
   - 搜索并添加 `LevelSelectSceneBuilder`
   - 搜索并添加 `LevelSelectController`

3. **运行场景**
   - 点击预览按钮
   - 场景会自动构建完整的UI结构

4. **连接引用（首次运行后）**
   - 停止预览
   - 选中 Canvas 节点
   - 在 `LevelSelectController` 组件中：
     - 将 `ScrollView` 节点拖到 `scrollView` 属性
     - 将 `content` 节点拖到 `levelItemContainer` 属性
   - 保存场景

5. **配置返回按钮**
   - 选中 `BackButton` 节点
   - 在 `Button` 组件的 Click Events 中：
     - 点击 "+" 添加事件
     - 拖动 Canvas 到 "cc.Node" 框
     - 选择 Component: LevelSelectController
     - 选择 Method: onBackButton

6. **测试**
   - 预览场景
   - 测试滚动和点击功能

## 方法二：手动构建

如果需要更多控制，可以手动构建场景。

### 1. 创建场景结构

```
LevelSelect.scene
└── Canvas
    ├── Background (Sprite)
    ├── Title (Label)
    ├── BackButton (Button + Label)
    └── ScrollView
        └── view
            └── content (Layout)
```

### 2. 详细步骤

#### 2.1 Background（背景）

1. 在 Canvas 下创建节点 "Background"
2. 添加组件：
   - UITransform: 设置为全屏大小
   - Widget: 对齐所有边
   - Sprite: 颜色设为天蓝色 `#87CEEB`

#### 2.2 Title（标题）

1. 在 Canvas 下创建节点 "Title"
2. 添加组件：
   - UITransform: 400x80
   - Label:
     - String: "选择关卡"
     - Font Size: 60
     - Color: 白色
     - Horizontal Align: Center
     - Vertical Align: Center
3. 设置位置: (0, 屏幕高度/2 - 80)

#### 2.3 BackButton（返回按钮）

1. 在 Canvas 下创建节点 "BackButton"
2. 添加组件：
   - UITransform: 120x60
   - Sprite: 颜色设为钢蓝色 `#4682B4`
   - Button
3. 创建子节点 "Label":
   - Label 组件:
     - String: "返回"
     - Font Size: 32
     - Color: 白色
4. 设置位置: (-屏幕宽度/2 + 80, 屏幕高度/2 - 80)

#### 2.4 ScrollView（滚动视图）

1. 在 Canvas 下创建节点 "ScrollView"
2. 添加组件：
   - UITransform: (屏幕宽度-100, 屏幕高度-250)
   - Sprite: 半透明白色
   - ScrollView:
     - Horizontal: false
     - Vertical: true
3. 设置位置: (0, -50)

#### 2.5 view（视图区域）

1. 在 ScrollView 下创建节点 "view"
2. 添加组件：
   - UITransform: 与 ScrollView 相同大小

#### 2.6 content（内容容器）

1. 在 view 下创建节点 "content"
2. 添加组件：
   - UITransform: 
     - Width: 与 view 相同
     - Height: 1000（会自动调整）
     - Anchor: (0.5, 0) - 底部锚点
   - Layout:
     - Type: VERTICAL
     - Resize Mode: CONTAINER
     - Vertical Direction: BOTTOM_TO_TOP
     - Spacing Y: 20
     - Padding: 20 (all sides)

#### 2.7 连接 ScrollView

1. 选中 ScrollView 节点
2. 在 ScrollView 组件中：
   - 拖动 `content` 到 `Content` 属性

### 3. 添加控制器

1. 选中 Canvas 节点
2. 添加 `LevelSelectController` 组件
3. 设置属性：
   - Level Item Container: 拖动 `content` 节点
   - Scroll View: 拖动 `ScrollView` 节点
   - Level Item Prefab: 留空（会自动创建）

### 4. 配置按钮事件

1. 选中 BackButton
2. 在 Button 组件的 Click Events:
   - Target: Canvas (拖动 Canvas 节点)
   - Component: LevelSelectController
   - Handler: onBackButton

## 方法三：完全程序化（无需 Creator）

如果无法使用 Cocos Creator 编辑器，可以完全用代码创建。

### 创建入口脚本

```typescript
// LevelSelectBootstrap.ts
import { _decorator, Component, Canvas } from 'cc';
import { LevelSelectSceneBuilder } from './Utils/LevelSelectSceneBuilder';
import { LevelSelectController } from './Controller/LevelSelectController';

const { ccclass } = _decorator;

@ccclass('LevelSelectBootstrap')
export class LevelSelectBootstrap extends Component {
    onLoad(): void {
        const canvas = this.node.getComponent(Canvas);
        if (!canvas) return;
        
        // 添加构建器
        const builder = canvas.addComponent(LevelSelectSceneBuilder);
        
        // 添加控制器
        const controller = canvas.addComponent(LevelSelectController);
        
        // 等待构建完成后连接引用
        this.scheduleOnce(() => {
            const scrollView = canvas.node.getChildByName('ScrollView');
            const content = scrollView?.getChildByPath('view/content');
            
            if (scrollView && content) {
                const scrollViewComp = scrollView.getComponent(ScrollView);
                controller.scrollView = scrollViewComp;
                controller.levelItemContainer = content;
            }
            
            // 连接返回按钮
            const backButton = canvas.node.getChildByName('BackButton');
            if (backButton) {
                const button = backButton.getComponent(Button);
                button?.node.on('click', () => {
                    controller.onBackButton();
                });
            }
        }, 0);
    }
}
```

### 使用方法

1. 创建空场景
2. 将 `LevelSelectBootstrap` 添加到 Canvas
3. 运行场景

## 调试技巧

### 1. 检查节点层次

在控制台输出节点结构：

```typescript
private printNodeHierarchy(node: Node, indent: string = ''): void {
    console.log(indent + node.name);
    for (const child of node.children) {
        this.printNodeHierarchy(child, indent + '  ');
    }
}
```

### 2. 验证引用

在 `LevelSelectController.onLoad()` 中添加：

```typescript
console.log('levelItemContainer:', this.levelItemContainer);
console.log('scrollView:', this.scrollView);
console.log('levelItemPrefab:', this.levelItemPrefab);
```

### 3. 测试滚动

在控制台手动测试：

```typescript
// 滚动到顶部
this.scrollView.scrollToTop(1);

// 滚动到底部
this.scrollView.scrollToBottom(1);

// 滚动到指定百分比
this.scrollView.scrollToPercentVertical(0.5, 1);
```

### 4. 检查关卡数据

```typescript
const levelManager = LevelManager.getInstance();
console.log('Total levels:', levelManager.getTotalLevelCount());
console.log('Current level:', levelManager.getCurrentLevel());
console.log('Max unlocked:', levelManager.getMaxUnlockedLevel());
```

## 常见问题

### Q: 场景一片空白？
**A:** 检查 Canvas 是否正确设置，确认 LevelSelectSceneBuilder 组件已添加。

### Q: 滚动不工作？
**A:** 确认 ScrollView 的 Content 属性已正确连接到 content 节点。

### Q: 关卡项不显示？
**A:** 检查 levelItemContainer 是否正确设置，查看控制台日志。

### Q: 点击无反应？
**A:** 确认 Button 组件已添加到关卡项，事件正确绑定。

### Q: 返回按钮不工作？
**A:** 检查 Button 的 Click Events 配置是否正确。

## 性能优化建议

### 1. 使用对象池

```typescript
private itemPool: Node[] = [];

private getItem(): Node {
    return this.itemPool.pop() || LevelItem.createLevelItem(this.levelItemContainer!);
}
```

### 2. 懒加载

只创建可见的关卡项：

```typescript
private visibleRange: { start: number, end: number } = { start: 0, end: 10 };
```

### 3. 减少更新频率

不要在 update() 中频繁更新UI。

## 下一步

完成场景设置后：

1. 测试所有功能
2. 调整视觉效果
3. 添加音效
4. 优化性能
5. 准备美术资源

---

*最后更新: 2026/01/10*
*版本: 1.0*
