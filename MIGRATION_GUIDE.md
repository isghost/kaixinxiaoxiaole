# Cocos Creator 3.8.6 Migration Guide

This document describes the migration from Cocos Creator 2.4.3 to 3.8.6 with TypeScript.

## Migration Summary

### What's Been Done

#### 1. Project Structure Updated
- Updated `project.json` to version 3.8.6
- Created `tsconfig.json` for TypeScript support
- Updated `settings/project.json` to v3.x format
- Updated `.gitignore` for v3.x artifacts

#### 2. Complete TypeScript Migration
All JavaScript files have been migrated to TypeScript with proper type annotations:

**Model Layer:**
- `ConstValue.ts` - Game constants
- `CellModel.ts` - Cell data model
- `GameModel.ts` - Game logic model

**View Layer:**
- `CellView.ts` - Cell visual component
- `GridView.ts` - Grid management component
- `EffectLayer.ts` - Visual effects component

**Controller Layer:**
- `GameController.ts` - Main game controller
- `LoginController.ts` - Login scene controller

**Utils Layer:**
- `Toast.ts` - Toast notification utility
- `AudioUtils.ts` - Audio management utility
- `ModelUtils.ts` - Helper functions

**Tests:**
- `GameModelTest.ts` - Unit test component

#### 3. API Migration to Cocos Creator 3.x

**Key API Changes Implemented:**

| Cocos Creator 2.x | Cocos Creator 3.x |
|-------------------|-------------------|
| `cc.Class()` | `@ccclass` decorator with `class extends Component` |
| `properties: {}` | `@property()` decorators |
| `cc.v2()` | `new Vec2()` |
| `cc.director` | `director` (imported from 'cc') |
| `cc.instantiate()` | `instantiate()` (imported from 'cc') |
| `node.x = 10` | `node.setPosition(10, y)` |
| `node.runAction()` | `tween()` system |
| `cc.sequence()` | `tween().then()` |
| `cc.delayTime()` | `tween().delay()` |
| `cc.callFunc()` | `tween().call()` |
| `cc.audioEngine.play()` | `audioSource.playOneShot()` |
| `node.convertToNodeSpace()` | `node.getComponent(UITransform).convertToNodeSpaceAR()` |
| `node.on('click', ...)` | Same, but with proper typing |

### What Needs to Be Done (Manual Steps in Editor)

#### Phase 3: Scene & Asset Migration

The following tasks **require** opening the project in Cocos Creator 3.8.6 Editor:

1. **Open Project in Cocos Creator 3.8.6**
   - Install Cocos Creator 3.8.6 if not already installed
   - Open this project folder in the editor
   - The editor will automatically attempt to upgrade scene files

2. **Scene File Conversion**
   - `assets/Scene/Login.fire` - Login scene
   - `assets/Scene/Game.fire` - Main game scene
   - The editor may prompt for automatic conversion
   - Verify all node references and components are correct

3. **Prefab Updates**
   - Check all prefabs in `assets/Prefabs/` folder
   - Verify component references
   - Update any broken script references to point to new .ts files

4. **Animation Clips**
   - Check animation clips in `assets/AnimationClip/`
   - Verify animation targets and properties
   - Update any deprecated animation properties

5. **Script Component Reassignment**
   - In each scene/prefab, verify that all script components are correctly assigned
   - The old .js references need to be updated to .ts references
   - Check property assignments in the inspector

6. **Asset References**
   - Verify all sprite references
   - Check audio clip references
   - Verify prefab references in scripts

#### Phase 4: Testing & Validation

After scene migration:

1. **Build Configuration**
   - Update build settings in Project → Build
   - Test web build
   - Test native builds if needed

2. **Functional Testing**
   - Test login scene
   - Test game scene loading
   - Test cell selection and matching
   - Test special effects (line, column, wrap, bird)
   - Test audio (background music, sound effects)
   - Test UI interactions

3. **Debug & Fix**
   - Fix any runtime errors
   - Verify animation playback
   - Check touch/mouse input handling
   - Validate game logic correctness

## Key Differences in Code

### Component Definition
```typescript
// OLD (2.x)
cc.Class({
    extends: cc.Component,
    properties: {
        myNode: {
            default: null,
            type: cc.Node
        }
    }
});

// NEW (3.x)
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MyComponent')
export class MyComponent extends Component {
    @property(Node)
    myNode: Node | null = null;
}
```

### Vector Creation
```typescript
// OLD (2.x)
let pos = cc.v2(10, 20);

// NEW (3.x)
import { Vec2 } from 'cc';
let pos = new Vec2(10, 20);
```

### Animation/Action System
```typescript
// OLD (2.x)
this.node.runAction(
    cc.sequence(
        cc.delayTime(1),
        cc.moveTo(0.5, cc.v2(100, 100)),
        cc.callFunc(() => console.log('done'))
    )
);

// NEW (3.x)
import { tween, Vec3 } from 'cc';
tween(this.node)
    .delay(1)
    .to(0.5, { position: new Vec3(100, 100, 0) })
    .call(() => console.log('done'))
    .start();
```

### Audio System
```typescript
// OLD (2.x)
cc.audioEngine.play(this.audioClip, false, 1);

// NEW (3.x)
this.audioSource = this.addComponent(AudioSource);
this.audioSource.playOneShot(this.audioClip, 1);
```

## Import Structure

All Cocos Creator APIs are now imported from the 'cc' module:

```typescript
import {
    _decorator,
    Component,
    Node,
    Vec2,
    Vec3,
    Sprite,
    Label,
    director,
    instantiate,
    tween,
    AudioSource,
    Animation
} from 'cc';

const { ccclass, property } = _decorator;
```

## Troubleshooting

### Common Issues

1. **"Cannot find module 'cc'"**
   - Make sure `tsconfig.json` is properly configured
   - Restart the Cocos Creator Editor

2. **Scene files don't load**
   - Open scenes in the editor and save them to convert format
   - Check console for specific errors

3. **Script components missing in scenes**
   - Manually reassign TypeScript components in the inspector
   - Check that script UUIDs match in .meta files

4. **Animations not playing**
   - Verify animation clip references
   - Check Animation component configuration
   - Update animation event handlers to use new API

5. **Touch events not working**
   - Verify UITransform component exists on nodes
   - Check touch event registration syntax

## Next Steps

1. Open project in Cocos Creator 3.8.6
2. Let the editor convert scene files
3. Test the game thoroughly
4. Fix any issues that arise
5. Build and deploy

## Resources

- [Cocos Creator 3.8 Documentation](https://docs.cocos.com/creator/3.8/manual/en/)
- [2.x to 3.x Migration Guide](https://docs.cocos.com/creator/3.8/manual/en/release-notes/upgrade-guide-v3.0.html)
- [TypeScript Support](https://docs.cocos.com/creator/3.8/manual/en/scripting/typescript.html)

## Notes

- All code has been updated to use Cocos Creator 3.x APIs
- TypeScript provides better type safety and IDE support
- The tween system replaces the old action system
- Scene files (.fire) need manual conversion in the editor
- Some features may need adjustment based on editor conversion results
