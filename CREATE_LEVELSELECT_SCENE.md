# 关卡选择场景创建说明

## 重要提示

由于关卡选择系统需要一个新的场景文件，请按以下步骤创建：

## 方法一：在 Cocos Creator 中创建场景（推荐）

### 步骤

1. **在 Cocos Creator 中打开项目**

2. **创建新场景**
   - 在 Assets 面板中，右键点击 `assets/Scene/` 目录
   - 选择 "Create" → "Scene"
   - 命名为 `LevelSelect`
   - 场景会自动保存为 `LevelSelect.scene`

3. **设置场景**
   - 双击打开 `LevelSelect.scene`
   - 选中 `Canvas` 节点
   - 在 Inspector 面板点击 "Add Component"
   - 添加 `LevelSelectSceneBuilder` 组件
   - 添加 `LevelSelectController` 组件

4. **保存并测试**
   - 保存场景 (Ctrl+S / Cmd+S)
   - 运行 `Login` 场景
   - 点击"开始游戏"按钮
   - 应该会跳转到关卡选择页

5. **构建设置（如果需要发布）**
   - 打开 "Project" → "Build"
   - 确保 `LevelSelect` 场景包含在构建列表中

## 方法二：临时解决方案（不需要 Creator 编辑器）

如果无法使用 Cocos Creator 编辑器创建场景，可以暂时修改代码直接跳转到 Game 场景：

### 修改 LoginController.ts

临时将跳转目标改为 Game：

```typescript
// 临时方案：直接跳转到游戏场景
director.preloadScene("Game", ...);
// 在回调中
director.loadScene("Game");
```

然后在 GameController 中添加关卡选择功能。

## 方法三：手动创建场景文件

如果你熟悉 Cocos Creator 的场景格式，可以手动创建场景文件：

### 创建最小化的 LevelSelect.scene

在 `assets/Scene/` 目录创建 `LevelSelect.scene` 文件，内容如下：

```json
[
  {
    "__type__": "cc.SceneAsset",
    "_name": "LevelSelect",
    "_objFlags": 0,
    "_native": "",
    "scene": {
      "__id__": 1
    }
  },
  {
    "__type__": "cc.Scene",
    "_name": "LevelSelect",
    "_objFlags": 0,
    "_parent": null,
    "_children": [
      {
        "__id__": 2
      }
    ],
    "_active": true,
    "_components": [],
    "_prefab": null,
    "autoReleaseAssets": false,
    "_globals": {
      "__id__": 10
    },
    "_id": "level-select-scene-id"
  },
  {
    "__type__": "cc.Node",
    "_name": "Canvas",
    "_objFlags": 0,
    "_parent": {
      "__id__": 1
    },
    "_children": [],
    "_active": true,
    "_components": [
      {
        "__id__": 3
      },
      {
        "__id__": 4
      },
      {
        "__id__": 5
      },
      {
        "__id__": 6
      }
    ],
    "_prefab": null,
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 375,
      "y": 667,
      "z": 0
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": 0,
      "y": 0,
      "z": 0,
      "w": 1
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_layer": 33554432,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    },
    "_id": "canvas-node-id"
  },
  {
    "__type__": "cc.UITransform",
    "_name": "",
    "_objFlags": 0,
    "node": {
      "__id__": 2
    },
    "_enabled": true,
    "__prefab": null,
    "_contentSize": {
      "__type__": "cc.Size",
      "width": 750,
      "height": 1334
    },
    "_anchorPoint": {
      "__type__": "cc.Vec2",
      "x": 0.5,
      "y": 0.5
    },
    "_id": "ui-transform-id"
  },
  {
    "__type__": "cc.Canvas",
    "_name": "",
    "_objFlags": 0,
    "node": {
      "__id__": 2
    },
    "_enabled": true,
    "__prefab": null,
    "_cameraComponent": {
      "__id__": 8
    },
    "_alignCanvasWithScreen": true,
    "_id": "canvas-component-id"
  },
  {
    "__type__": "LevelSelectSceneBuilder",
    "_name": "",
    "_objFlags": 0,
    "node": {
      "__id__": 2
    },
    "_enabled": true,
    "__prefab": null,
    "_id": "builder-id"
  },
  {
    "__type__": "LevelSelectController",
    "_name": "",
    "_objFlags": 0,
    "node": {
      "__id__": 2
    },
    "_enabled": true,
    "__prefab": null,
    "levelItemContainer": null,
    "levelItemPrefab": null,
    "scrollView": null,
    "_id": "controller-id"
  },
  {
    "__type__": "cc.Node",
    "_name": "Camera",
    "_objFlags": 0,
    "_parent": {
      "__id__": 1
    },
    "_children": [],
    "_active": true,
    "_components": [
      {
        "__id__": 8
      }
    ],
    "_prefab": null,
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 1000
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": 0,
      "y": 0,
      "z": 0,
      "w": 1
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_layer": 1073741824,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    },
    "_id": "camera-node-id"
  },
  {
    "__type__": "cc.Camera",
    "_name": "",
    "_objFlags": 0,
    "node": {
      "__id__": 7
    },
    "_enabled": true,
    "__prefab": null,
    "_priority": 0,
    "_fov": 45,
    "_fovAxis": 0,
    "_orthoHeight": 667,
    "_near": 1,
    "_far": 2000,
    "_color": {
      "__type__": "cc.Color",
      "r": 51,
      "g": 51,
      "b": 51,
      "a": 255
    },
    "_depth": 1,
    "_stencil": 0,
    "_clearFlags": 7,
    "_rect": {
      "__type__": "cc.Rect",
      "x": 0,
      "y": 0,
      "width": 1,
      "height": 1
    },
    "_aperture": 19,
    "_shutter": 7,
    "_iso": 0,
    "_screenScale": 1,
    "_visibility": 1108344832,
    "_targetTexture": null,
    "_projection": 1,
    "_id": "camera-component-id"
  },
  {
    "__type__": "cc.Node",
    "_name": "Main Light",
    "_objFlags": 0,
    "_parent": {
      "__id__": 1
    },
    "_children": [],
    "_active": true,
    "_components": [
      {
        "__id__": 10
      }
    ],
    "_prefab": null,
    "_lpos": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 0,
      "z": 0
    },
    "_lrot": {
      "__type__": "cc.Quat",
      "x": -0.24184,
      "y": -0.24184,
      "z": -0.06270,
      "w": 0.93548
    },
    "_lscale": {
      "__type__": "cc.Vec3",
      "x": 1,
      "y": 1,
      "z": 1
    },
    "_layer": 1073741824,
    "_euler": {
      "__type__": "cc.Vec3",
      "x": -28,
      "y": -28,
      "z": 0
    },
    "_id": "light-node-id"
  },
  {
    "__type__": "cc.DirectionalLight",
    "_name": "",
    "_objFlags": 0,
    "node": {
      "__id__": 9
    },
    "_enabled": true,
    "__prefab": null,
    "_color": {
      "__type__": "cc.Color",
      "r": 255,
      "g": 255,
      "b": 255,
      "a": 255
    },
    "_useColorTemperature": false,
    "_colorTemperature": 6550,
    "_staticSettings": {
      "__id__": 11
    },
    "_illuminance": 65000,
    "_id": "light-component-id"
  },
  {
    "__type__": "cc.StaticLightSettings",
    "_baked": false,
    "_editorOnly": false,
    "_bakeable": false,
    "_castShadow": false
  },
  {
    "__type__": "cc.SceneGlobals",
    "ambient": {
      "__id__": 13
    },
    "shadows": {
      "__id__": 14
    },
    "_skybox": {
      "__id__": 15
    },
    "fog": {
      "__id__": 16
    }
  },
  {
    "__type__": "cc.AmbientInfo",
    "_skyColor": {
      "__type__": "cc.Color",
      "r": 51,
      "g": 128,
      "b": 204,
      "a": 1
    },
    "_skyIllum": 20000,
    "_groundAlbedo": {
      "__type__": "cc.Color",
      "r": 51,
      "g": 51,
      "b": 51,
      "a": 255
    }
  },
  {
    "__type__": "cc.ShadowsInfo",
    "_type": 0,
    "_enabled": false,
    "_normal": {
      "__type__": "cc.Vec3",
      "x": 0,
      "y": 1,
      "z": 0
    },
    "_distance": 0,
    "_shadowColor": {
      "__type__": "cc.Color",
      "r": 76,
      "g": 76,
      "b": 76,
      "a": 255
    },
    "_autoAdapt": true,
    "_pcf": 0,
    "_bias": 0.00001,
    "_normalBias": 0,
    "_near": 1,
    "_far": 30,
    "_aspect": 1,
    "_orthoSize": 5,
    "_maxReceived": 4,
    "_size": {
      "__type__": "cc.Vec2",
      "x": 512,
      "y": 512
    }
  },
  {
    "__type__": "cc.SkyboxInfo",
    "_envmap": null,
    "_isRGBE": false,
    "_enabled": false,
    "_useIBL": false
  },
  {
    "__type__": "cc.FogInfo",
    "_type": 0,
    "_fogColor": {
      "__type__": "cc.Color",
      "r": 200,
      "g": 200,
      "b": 200,
      "a": 255
    },
    "_enabled": false,
    "_fogDensity": 0.3,
    "_fogStart": 0.5,
    "_fogEnd": 300,
    "_fogAtten": 5,
    "_fogTop": 1.5,
    "_fogRange": 1.2
  }
]
```

**注意**：这个方法比较复杂且容易出错，建议使用方法一。

### 创建对应的 .meta 文件

还需要创建 `LevelSelect.scene.meta` 文件。

## 验证场景是否正确加载

在浏览器控制台查看日志：
- 应该看到 "LevelSelectSceneBuilder: Building scene structure"
- 应该看到 "LevelSelectController.onLoad: Starting initialization"

## 常见问题

### Q: 点击开始游戏没有跳转？
**A:** 
1. 检查是否创建了 `LevelSelect.scene` 文件
2. 检查场景是否在构建列表中
3. 查看浏览器控制台错误信息

### Q: 场景跳转但一片空白？
**A:**
1. 检查 Canvas 上是否添加了 LevelSelectSceneBuilder
2. 检查控制台日志
3. 确认组件正确加载

### Q: 如何快速测试？
**A:** 可以暂时修改 LoginController 直接跳转到 Game 场景进行其他功能测试。

---

**重要**: 这是一个需要在 Cocos Creator 编辑器中完成的步骤。如果你没有 Cocos Creator，建议先使用临时方案继续开发其他功能。
