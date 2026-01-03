# Copilot instructions (kaixinxiaoxiaole)

## Big picture
- This is a **Cocos Creator 3.8.6** match-3 game. Primary scenes: `assets/Scene/Login.scene` → `assets/Scene/Game.scene`.
- Script layering (follow this structure when adding code):
  - `assets/Script/Controller/`: scene entry + UI callbacks (e.g. `GameController`, `LevelSelectController`)
  - `assets/Script/Model/`: gameplay rules/data (e.g. `GameModel`, `CellModel`, `ConstValue`)
  - `assets/Script/View/`: rendering + input + effects (e.g. `GridView`, `CellView`, `EffectLayer`)
  - `assets/Script/Utils/`: shared helpers (e.g. `Toast`, `Debug`, `AudioUtils`)

## Gameplay/data conventions (important)
- Grid is **1-indexed**: loops typically run `for (y=1..GRID_HEIGHT)` and `for (x=1..GRID_WIDTH)`; `cells[y][x]` is the canonical access pattern (see `GameModel`).
- Model→View flow:
  - `GridView` converts touches to grid coords (`convertTouchPosToCell`) and calls `controller.selectCell(pos)`.
  - `GameModel.selectCell` returns `[changeModels, effectsQueue]`; View animates via `CellView.updateView()` and effects via `EffectLayer`.
- Cell prefab mapping: `GridView.aniPre[type]` is used to instantiate visuals; keep `CellModel.type` within prefab array bounds.
- Timing is scheduled in the model with `curTime` + `ANITIME` constants (`assets/Script/Model/ConstValue.ts`).

## Project-specific coding patterns
- Prefer typed component access: `node.getComponent(EffectLayer)` over string names.
- Use the project logger instead of raw `console.*`: `logDebug/logInfo/logWarn/logError` from `assets/Script/Utils/Debug.ts`.
- UI code often uses `UITransform` and `Graphics` to draw simple shapes at runtime (see `LevelSelectController`, `Toast`).

## Developer workflow
- Run/play: open the repo in **Cocos Creator 3.8.6** and use Preview/Run.
- TypeScript is strict (`tsconfig.json` extends `temp/tsconfig.cocos.json`); add null checks and correct types.
- Do not edit or commit generated folders (gitignored): `library/`, `temp/`, `profiles/`, `build/`, `node_modules/`.

## Temporary art (during development)
- When art is missing, generate placeholder assets via the local tool (`tools/ai-temp-art/cli.js`).
- Put runtime-loadable images under `assets/resources/temp_ai/` so code can use `resources.load`.

### How to generate
- SVG sources live in `tools/ai-temp-art/svg_ui/` (UI placeholders).
- Render into `assets/resources/temp_ai/` (note: this differs from the tool default).

Example:
- `npm run ai:asset -- render --svgFile tools/ai-temp-art/svg_ui/icon_back.svg --name icon_back --outDir assets/resources/temp_ai --sizes 64`

Naming convention:
- Output file is `${name}_${size}.png`.
- In code, the resource path omits extension, e.g. `temp_ai/icon_back_64`.

### Available temp UI assets (resources paths)
- Existing: `temp_ai/lock_64`, `temp_ai/star_filled_32`, `temp_ai/star_empty_32`
- Icons (64):
  - `temp_ai/icon_back_64`, `temp_ai/icon_close_64`, `temp_ai/icon_home_64`, `temp_ai/icon_settings_64`
  - `temp_ai/icon_play_64`, `temp_ai/icon_pause_64`, `temp_ai/icon_retry_64`
  - `temp_ai/icon_sound_on_64`, `temp_ai/icon_sound_off_64`
  - `temp_ai/icon_coin_64`, `temp_ai/icon_heart_64`, `temp_ai/icon_level_64`, `temp_ai/icon_trophy_64`
- Stars (64): `temp_ai/star_filled_64`, `temp_ai/star_empty_64`
- UI shapes (256): `temp_ai/btn_primary_256`, `temp_ai/btn_secondary_256`, `temp_ai/panel_dialog_256`, `temp_ai/panel_toast_256`, `temp_ai/panel_pause_256`

### Recommended loading pattern
- Prefer best-effort loading with caching (see `LevelSelectController`):
  - Try `resources.load('temp_ai/<name>_<size>/spriteFrame', SpriteFrame, ...)` then fallback to `resources.load('temp_ai/<name>_<size>', SpriteFrame, ...)`.
  - If load fails, keep a label/graphics fallback (UI must not crash).
