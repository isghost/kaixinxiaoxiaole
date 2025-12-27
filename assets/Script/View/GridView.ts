import { _decorator, Component, Node, Prefab, Vec2, v2, instantiate, tween, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT, ANITIME } from '../Model/ConstValue';
import { AudioUtils } from "../Utils/AudioUtils";
import CellModel from '../Model/CellModel';
import { EffectCommand } from '../Model/GameModel';
import { CellView } from './CellView';

@ccclass('GridView')
export class GridView extends Component {
    @property([Prefab])
    public aniPre: Prefab[] = [];
    
    @property(Node)
    public effectLayer: Node | null = null;
    
    @property(AudioUtils)
    public audioUtils: AudioUtils | null = null;
    
    private controller: any = null;
    private cellViews: (Node | null)[][] = [];
    private lastTouchPos: Vec2 = v2(-1, -1);
    private isCanMove: boolean = true;
    private isInPlayAni: boolean = false;

    onLoad(): void {
        console.log("GridView.onLoad: Initializing");
        
        // Ensure UITransform exists for coordinate conversion
        let uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.log("GridView.onLoad: Adding UITransform component");
            uiTransform = this.node.addComponent(UITransform);
        }
        
        // Log node information for debugging
        console.log(`GridView.onLoad: Node size: ${uiTransform.width} x ${uiTransform.height}`);
        console.log(`GridView.onLoad: Node position: (${this.node.position.x}, ${this.node.position.y})`);
        
        this.setListener();
        this.lastTouchPos = v2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false;
        
        console.log("GridView.onLoad: Initialization complete");
    }

    setController(controller: any): void {
        this.controller = controller;
    }

    initWithCellModels(cellsModels: (CellModel | null)[][]): void {
        console.log("GridView.initWithCellModels: Starting initialization");
        console.log(`GridView: Available prefabs: ${this.aniPre.length}`);
        
        this.cellViews = [];
        let cellCount = 0;
        
        for (let i = 1; i <= 9; i++) {
            this.cellViews[i] = [];
            for (let j = 1; j <= 9; j++) {
                if (!cellsModels[i] || !cellsModels[i][j]) {
                    console.warn(`GridView: No model at (${i}, ${j})`);
                    continue;
                }
                
                const type = cellsModels[i][j]!.type;
                if (type === null || type < 0 || type >= this.aniPre.length) {
                    console.warn(`GridView: Invalid type ${type} at (${i}, ${j})`);
                    continue;
                }
                
                const aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                const cellViewScript = aniView.getComponent(CellView);
                if (cellViewScript) {
                    cellViewScript.initWithModel(cellsModels[i][j]!);
                    cellCount++;
                } else {
                    console.error(`GridView: CellView component not found on prefab type ${type}`);
                }
                this.cellViews[i][j] = aniView;
            }
        }
        
        console.log(`GridView.initWithCellModels: Initialized ${cellCount} cells`);
    }

    setListener(): void {
        console.log("GridView: Setting up touch listeners");
        
        this.node.on(Node.EventType.TOUCH_START, (eventTouch: any) => {
            console.log("GridView: TOUCH_START event received");
            
            if (this.isInPlayAni) {
                console.log("GridView: Animation in progress, ignoring touch");
                return true;
            }
            
            const touchPos = eventTouch.getLocation();
            console.log(`GridView: Touch location: (${touchPos.x}, ${touchPos.y})`);
            
            const cellPos = this.convertTouchPosToCell(touchPos);
            if (cellPos) {
                console.log(`GridView: Cell position: (${cellPos.x}, ${cellPos.y})`);
                const changeModels = this.selectCell(cellPos);
                this.isCanMove = changeModels.length < 3;
                console.log(`GridView: Change models count: ${changeModels.length}, isCanMove: ${this.isCanMove}`);
            } else {
                console.log("GridView: Touch outside grid bounds");
                this.isCanMove = false;
            }
            return true;
        }, this);

        this.node.on(Node.EventType.TOUCH_MOVE, (eventTouch: any) => {
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

        this.node.on(Node.EventType.TOUCH_END, (eventTouch: any) => {
            // Touch end handler
        }, this);

        this.node.on(Node.EventType.TOUCH_CANCEL, (eventTouch: any) => {
            // Touch cancel handler
        }, this);
    }

    convertTouchPosToCell(pos: Vec2): Vec2 | null {
        // In Cocos 3.x, we need UITransform to convert touch position
        const uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            console.error("GridView: UITransform component not found!");
            return null;
        }
        
        // Convert world/screen position to local node space
        // In Cocos 3.x, touch events give us world coordinates
        // We use convertToNodeSpaceAR which handles anchor point
        const v2Pos = v2(pos.x, pos.y);
        const localPos = uiTransform.convertToNodeSpaceAR(v2Pos);
        
        console.log(`Touch conversion: world(${pos.x.toFixed(1)}, ${pos.y.toFixed(1)}) -> local(${localPos.x.toFixed(1)}, ${localPos.y.toFixed(1)})`);
        console.log(`Grid bounds: width=${GRID_PIXEL_WIDTH}, height=${GRID_PIXEL_HEIGHT}`);
        console.log(`UITransform size: ${uiTransform.width} x ${uiTransform.height}`);
        
        // Check if the touch is within grid bounds
        // Note: In Cocos 3.x, the coordinate origin might be at bottom-left
        if (localPos.x < 0 || localPos.x >= GRID_PIXEL_WIDTH || 
            localPos.y < 0 || localPos.y >= GRID_PIXEL_HEIGHT) {
            console.log(`Touch outside grid bounds: local=(${localPos.x.toFixed(1)}, ${localPos.y.toFixed(1)})`);
            return null;
        }
        
        // Convert pixel position to grid cell position (1-indexed)
        const x = Math.floor(localPos.x / CELL_WIDTH) + 1;
        const y = Math.floor(localPos.y / CELL_HEIGHT) + 1;
        
        console.log(`Calculated cell position: (${x}, ${y})`);
        
        // Validate cell position
        if (x < 1 || x > 9 || y < 1 || y > 9) {
            console.error(`Invalid cell position calculated: (${x}, ${y})`);
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
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
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
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                if (this.cellViews[i] && this.cellViews[i][j]) {
                    const cellView = this.cellViews[i][j]!.getComponent(CellView);
                    if (cellView && (cellView as any).model == model) {
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
        console.log(`GridView.selectCell: Called with position (${cellPos.x}, ${cellPos.y})`);
        
        if (!this.controller) {
            console.error("GridView.selectCell: No controller set!");
            return [];
        }
        
        console.log("GridView.selectCell: Calling controller.selectCell");
        const result = this.controller.selectCell(cellPos);
        
        if (!result) {
            console.error("GridView.selectCell: Controller returned null/undefined");
            return [];
        }
        
        const changeModels = result[0];
        const effectsQueue = result[1];
        
        console.log(`GridView.selectCell: Got ${changeModels ? changeModels.length : 0} change models`);
        
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
        const effectLayerScript = this.effectLayer.getComponent('EffectLayer');
        if (effectLayerScript && (effectLayerScript as any).playEffects) {
            (effectLayerScript as any).playEffects(effectsQueue);
        }
    }

}
