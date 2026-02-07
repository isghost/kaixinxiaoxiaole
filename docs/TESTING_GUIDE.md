# Testing New Obstacle Features

## Quick Start

1. **Open Project**
   - Launch Cocos Creator 3.8.6
   - Open this project directory

2. **Import Assets** (if needed)
   - If the new obstacle images don't appear, select `assets/resources/obstacles/` in the Assets panel
   - Right-click and select "Reimport"

3. **Run the Game**
   - Click the "Preview" button (Play icon) in the toolbar
   - Or use menu: `Project -> Preview`

4. **Test the Features**
   - Select Level 1, 2, or 3 from the level select screen
   - These levels have been configured with all new obstacle types

## What to Test

### ✅ Movable Rocks (Gravity)
- **Look for**: Gray rock icons on the game board
- **How to test**: Make matches below the rocks
- **Expected**: Rocks should fall down when space is cleared below them
- **Verify**: Rocks move smoothly with fall animation

### ✅ Multi-Level Obstacles
- **Look for**: Collision/explosion icons (appear darker/more opaque initially)
- **How to test**: Make matches adjacent to these obstacles multiple times
- **Expected**: 
  - Obstacle becomes slightly more transparent after each hit
  - Takes multiple hits to clear completely (3-4 hits depending on HP)
- **Verify**: Visual opacity changes with each hit

### ✅ Periodic Obstacle Spawning
- **How to test**: Play normally and make several moves (5-8 moves)
- **Expected**: New ice/obstacles appear on random empty cells periodically
- **Look for**: Brief refresh of the board when new obstacles spawn
- **Verify**: Check move counter - spawns should happen at specific intervals

## Level Details

### Level 1: "教学 1 - 测试新障碍"
- Mode: Steps (30 moves)
- Features:
  - 2 movable rocks at positions (3,3) and (7,3)
  - 1 multi-level obstacle (HP 3) at center
  - Ice spawns every 5 moves (max 2 at a time)

### Level 2: "教学 2 - 多级障碍"  
- Mode: Steps (25 moves)
- Features:
  - 2 multi-level obstacles (HP 4) at top and bottom
  - 2 movable rocks
  - Multi-level obstacles spawn every 8 moves

### Level 3: "教学 3 - 全部特性"
- Mode: Time (90 seconds)
- Features:
  - 4 movable rocks at corners
  - 1 multi-level obstacle in center
  - 2 crates (non-movable)
  - Ice spawns every 6 moves

## Common Issues

### Assets Not Showing
**Problem**: New obstacle sprites don't appear in game
**Solution**: 
1. Check that .png files exist in `assets/resources/obstacles/`
2. Reimport the obstacles folder in Creator
3. Check browser console for loading errors

### TypeScript Errors in Editor
**Problem**: Creator shows TypeScript compilation errors
**Solution**: This is normal. The code is designed for Cocos Creator's environment. Errors outside Creator can be ignored.

### Obstacles Not Spawning Periodically
**Problem**: No new obstacles appear during gameplay
**Solution**: 
1. Verify the level config has `periodicObstacles` defined
2. Make sure you're making enough moves (check the interval value)
3. Check that there are empty cells available for spawning

## Debug Mode

To see more detailed information:
1. Open browser developer tools (F12)
2. Check Console tab for game events
3. Look for spawn notifications or errors

## Code Changes Summary

If you want to understand or modify the implementation:
- **Model Layer**: `assets/Script/Model/GameModel.ts`, `CellModel.ts`
- **Level Config**: `assets/Script/Model/Level/LevelConfig.ts`, `LevelState.ts`
- **Controller**: `assets/Script/Controller/GameController.ts`
- **View**: `assets/Script/View/CellView.ts`, `GridView.ts`
- **Data**: `assets/resources/levels.json`

See `docs/NEW_OBSTACLES.md` for detailed technical documentation.

## Next Steps

After testing, you can:
1. Adjust obstacle parameters in `assets/resources/levels.json`
2. Create new levels with different obstacle combinations
3. Add more obstacle types by extending the system
4. Customize obstacle sprites in `assets/resources/obstacles/`

Enjoy testing! 🎮
