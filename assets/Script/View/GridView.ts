import { _decorator, Component, Node, Prefab, Vec2, v2, Vec3, v3, instantiate, tween, UITransform, EventTouch } from 'cc';
const { ccclass, property } = _decorator;

import { CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT, ANITIME, GRID_WIDTH, GRID_HEIGHT } from '../Model/ConstValue';
import { AudioUtils } from "../Utils/AudioUtils";
import CellModel from '../Model/CellModel';
import { EffectCommand } from '../Model/GameModel';
import { CellView } from './CellView';
import { EffectLayer } from './EffectLayer';
import { logDebug, logError, logWarn } from '../Utils/Debug';

interface GridController {
    selectCell(pos: Vec2): [CellModel[], EffectCommand[]] | null;
    cleanCmd(): void;
}

@ccclass('GridView')
export class GridView extends Component {
    @property([Prefab])
    public aniPre: Prefab[] = [];
    
    @property(Node)
    public effectLayer: Node | null = null;
    
    @property(AudioUtils)
    public audioUtils: AudioUtils | null = null;
    
    private controller: GridController | null = null;
    private cellViews: (Node | null)[][] = [];
    private lastTouchPos: Vec2 = v2(-1, -1);
    private isCanMove: boolean = true;
    private isInPlayAni: boolean = false;

    onLoad(): void {
        logDebug("GridView.onLoad: Initializing");
        
        // Ensure UITransform exists for coordinate conversion
        let uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            logDebug("GridView.onLoad: Adding UITransform component");
            uiTransform = this.node.addComponent(UITransform);
        }
        
        // Log node information for debugging
        logDebug(`GridView.onLoad: Node size: ${uiTransform.width} x ${uiTransform.height}`);
        logDebug(`GridView.onLoad: Node position: (${this.node.position.x}, ${this.node.position.y})`);
        
        this.setListener();
        this.lastTouchPos = v2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false;
        
        logDebug("GridView.onLoad: Initialization complete");
    }

    setController(controller: GridController): void {
        this.controller = controller;
    }

    initWithCellModels(cellsModels: (CellModel | null)[][]): void {
        logDebug("GridView.initWithCellModels: Starting initialization");
        logDebug(`GridView: Available prefabs: ${this.aniPre.length}`);
        
        this.cellViews = [];
        let cellCount = 0;
        
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            this.cellViews[i] = [];
            for (let j = 1; j <= GRID_WIDTH; j++) {
                if (!cellsModels[i] || !cellsModels[i][j]) {
                    logWarn(`GridView: No model at (${i}, ${j})`);
                    continue;
                }
                
                const type = cellsModels[i][j]!.type;
                if (type === null || type < 0 || type >= this.aniPre.length) {
                    logWarn(`GridView: Invalid type ${type} at (${i}, ${j})`);
                    continue;
                }
                
                const aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                const cellViewScript = aniView.getComponent(CellView);
                if (cellViewScript) {
                    cellViewScript.initWithModel(cellsModels[i][j]!);
                    cellCount++;
                } else {
                    logError(`GridView: CellView component not found on prefab type ${type}`);
                }
                this.cellViews[i][j] = aniView;
            }
        }
        
        logDebug(`GridView.initWithCellModels: Initialized ${cellCount} cells`);
    }

    setListener(): void {
        logDebug("GridView: Setting up touch listeners");
        
        this.node.on(Node.EventType.TOUCH_START, (eventTouch: EventTouch) => {
            logDebug("GridView: TOUCH_START event received");
            
            if (this.isInPlayAni) {
                logDebug("GridView: Animation in progress, ignoring touch");
                return;
            }
            
            const touchPos = eventTouch.getLocation();
            logDebug(`GridView: Touch location: (${touchPos.x}, ${touchPos.y})`);
            
            const cellPos = this.convertTouchPosToCell(touchPos);
            if (cellPos) {
                logDebug(`GridView: Cell position: (${cellPos.x}, ${cellPos.y})`);
                const changeModels = this.selectCell(cellPos);
                this.isCanMove = changeModels.length < 3;
                logDebug(`GridView: Change models count: ${changeModels.length}, isCanMove: ${this.isCanMove}`);
            } else {
                logDebug("GridView: Touch outside grid bounds");
                this.isCanMove = false;
            }
        }, this);

        this.node.on(Node.EventType.TOUCH_MOVE, (eventTouch: EventTouch) => {
            if (this.isCanMove) {
                const startTouchPos = eventTouch.getStartLocation();
                const startCellPos = this.convertTouchPosToCell(startTouchPos);
                const touchPos = eventTouch.getLocation();
                const cellPos = this.convertTouchPosToCell(touchPos);
                if (startCellPos && cellPos && (startCellPos.x != cellPos.x || startCellPos.y != cellPos.y)) {
                    this.isCanMove = false;
                    this.selectCell(cellPos);
                }
            }
        }, this);

        this.node.on(Node.EventType.TOUCH_END, (_eventTouch: EventTouch) => {
            // Touch end handler
        }, this);

        this.node.on(Node.EventType.TOUCH_CANCEL, (_eventTouch: EventTouch) => {
            // Touch cancel handler
        }, this);
    }

    convertTouchPosToCell(pos: Vec2): Vec2 | null {
        // In Cocos 3.x, we need UITransform to convert touch position
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            logError("GridView: UITransform component not found!");
            return null;
        }
        
        // Convert world/screen position to local node space
        // In Cocos 3.x, convertToNodeSpaceAR expects Vec3
        const worldPos = v3(pos.x, pos.y, 0);
        const localPos3 = uiTransform.convertToNodeSpaceAR(worldPos);
        
        logDebug(`Touch conversion: world(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}) -> local(${localPos3.x.toFixed(1)}, ${localPos3.y.toFixed(1)})`);
        logDebug(`Grid bounds: width=${GRID_PIXEL_WIDTH}, height=${GRID_PIXEL_HEIGHT}`);
        logDebug(`UITransform size: ${uiTransform.width} x ${uiTransform.height}`);
        
        // Check if the touch is within grid bounds
        // Note: In Cocos 3.x, the coordinate origin might be at bottom-left
        if (localPos3.x < 0 || localPos3.x >= GRID_PIXEL_WIDTH || 
            localPos3.y < 0 || localPos3.y >= GRID_PIXEL_HEIGHT) {
            logDebug(`Touch outside grid bounds: local=(${localPos3.x.toFixed(1)}, ${localPos3.y.toFixed(1)})`);
            return null;
        }
        
        // Convert pixel position to grid cell position (1-indexed)
        const x = Math.floor(localPos3.x / CELL_WIDTH) + 1;
        const y = Math.floor(localPos3.y / CELL_HEIGHT) + 1;
        
        logDebug(`Calculated cell position: (${x}, ${y})`);
        
        // Validate cell position
        if (x < 1 || x > GRID_WIDTH || y < 1 || y > GRID_HEIGHT) {
            logError(`Invalid cell position calculated: (${x}, ${y})`);
            return null;
        }
        
        return v2(x, y);
    }

    updateView(changeModels: CellModel[]): void {
        const newCellViewInfo: { model: CellModel, view: Node }[] = [];
        
        for (let i = 0; i < changeModels.length; i++) {
            const model = changeModels[i];
            const viewInfo = this.findViewByModel(model);
            let view: Node | null = null;
            
            if (!viewInfo) {
                const type = model.type;
                if (type === null || type < 0 || type >= this.aniPre.length) continue;
                
                const aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                const cellViewScript = aniView.getComponent(CellView);
                if (cellViewScript) {
                    cellViewScript.initWithModel(model);
                }
                view = aniView;
            } else {
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }
            
            if (view) {
                const cellScript = view.getComponent(CellView);
                if (cellScript) {
                    cellScript.updateView();
                }
                
                if (!model.isDeath) {
                    newCellViewInfo.push({ model: model, view: view });
                }
            }
        }
        
        newCellViewInfo.forEach((ele) => {
            const model = ele.model;
            if (!this.cellViews[model.y]) {
                this.cellViews[model.y] = [];
            }
            this.cellViews[model.y][model.x] = ele.view;
        });
    }

    updateSelect(pos: Vec2): void {
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
                if (this.cellViews[i] && this.cellViews[i][j]) {
                    const cellScript = this.cellViews[i][j]!.getComponent(CellView);
                    if (cellScript) {
                        cellScript.setSelect(pos.x == j && pos.y == i);
                    }
                }
            }
        }
    }

    findViewByModel(model: CellModel): { view: Node, x: number, y: number } | null {
        for (let i = 1; i <= GRID_HEIGHT; i++) {
            for (let j = 1; j <= GRID_WIDTH; j++) {
                if (this.cellViews[i] && this.cellViews[i][j]) {
                    const cellView = this.cellViews[i][j]!.getComponent(CellView);
                    if (cellView && cellView.getModel() === model) {
                        return { view: this.cellViews[i][j]!, x: j, y: i };
                    }
                }
            }
        }
        return null;
    }

    getPlayAniTime(changeModels: CellModel[]): number {
        if (!changeModels) {
            return 0;
        }
        let maxTime = 0;
        changeModels.forEach((ele) => {
            ele.cmd.forEach((cmd) => {
                if (maxTime < cmd.playTime + cmd.keepTime) {
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            });
        });
        return maxTime;
    }

    getStep(effectsQueue: EffectCommand[]): number {
        if (!effectsQueue) {
            return 0;
        }
        return effectsQueue.reduce((maxValue, effectCmd) => {
            return Math.max(maxValue, effectCmd.step || 0);
        }, 0);
    }

    disableTouch(time: number, step: number): void {
        if (time <= 0) {
            return;
        }
        this.isInPlayAni = true;
        tween(this.node)
            .delay(time)
            .call(() => {
                this.isInPlayAni = false;
                if (this.audioUtils) {
                    this.audioUtils.playContinuousMatch(step);
                }
            })
            .start();
    }

    selectCell(cellPos: Vec2): CellModel[] {
        logDebug(`GridView.selectCell: Called with position (${cellPos.x}, ${cellPos.y})`);
        
        if (!this.controller) {
            logError("GridView.selectCell: No controller set!");
            return [];
        }
        
        logDebug("GridView.selectCell: Calling controller.selectCell");
        const result = this.controller.selectCell(cellPos);
        
        if (!result) {
            logError("GridView.selectCell: Controller returned null/undefined");
            return [];
        }
        
        const changeModels = result[0];
        const effectsQueue = result[1];
        
        logDebug(`GridView.selectCell: Got ${changeModels ? changeModels.length : 0} change models`);
        
        this.playEffect(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.controller.cleanCmd();
        
        if (changeModels.length >= 2) {
            this.updateSelect(v2(-1, -1));
            if (this.audioUtils) {
                this.audioUtils.playSwap();
            }
        } else {
            this.updateSelect(cellPos);
            if (this.audioUtils) {
                this.audioUtils.playClick();
            }
        }
        return changeModels;
    }

    playEffect(effectsQueue: EffectCommand[]): void {
        if (!this.effectLayer) return;
        const effectLayerScript = this.effectLayer.getComponent(EffectLayer);
        if (effectLayerScript) {
            effectLayerScript.playEffects(effectsQueue);
        }
    }

}
