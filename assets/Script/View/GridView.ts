import { _decorator, Component, Node, Prefab, Vec2, v2, Vec3, v3, instantiate, tween, UITransform, Graphics, Color } from 'cc';
const { ccclass, property } = _decorator;

import { CELL_WIDTH, CELL_HEIGHT, ANITIME, GRID_WIDTH, GRID_HEIGHT } from '../Model/ConstValue';
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
    private gridWidth: number = GRID_WIDTH;
    private gridHeight: number = GRID_HEIGHT;
    private cellMask: boolean[][] = [];
    private bgLayer: Node | null = null;
    private paused: boolean = false;

    public isAnimating(): boolean {
        return this.isInPlayAni;
    }

    public setPaused(paused: boolean): void {
        this.paused = paused;
    }

    onLoad(): void {
        // Ensure UITransform exists for coordinate conversion
        let uiTransform = this.node.getComponent(UITransform);
        if (!uiTransform) {
            uiTransform = this.node.addComponent(UITransform);
        }
        
        this.setListener();
        this.lastTouchPos = v2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false;
    }

    setController(controller: any): void {
        this.controller = controller;
    }

    initWithCellModels(
        cellsModels: (CellModel | null)[][],
        gridSize?: { rows: number; cols: number },
        cellMask?: boolean[][]
    ): void {
        if (gridSize) {
            this.gridHeight = gridSize.rows;
            this.gridWidth = gridSize.cols;
        }
        if (cellMask) {
            this.cellMask = cellMask;
        }

        this.initBackgroundLayer();
        
        this.cellViews = [];
        let cellCount = 0;
        
        for (let y = 1; y <= this.gridHeight; y++) {
            this.cellViews[y] = [];
            for (let x = 1; x <= this.gridWidth; x++) {
                if (this.cellMask[y] && this.cellMask[y][x] === false) {
                    continue;
                }
                if (!cellsModels[y] || !cellsModels[y][x]) {
                    console.warn(`GridView: No model at (${x}, ${y})`);
                    continue;
                }

                const type = cellsModels[y][x]!.type;
                if (type === null || type < 0 || type >= this.aniPre.length) {
                    console.warn(`GridView: Invalid type ${type} at (${x}, ${y})`);
                    continue;
                }
                
                const aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                const cellViewScript = aniView.getComponent(CellView);
                if (cellViewScript) {
                    cellViewScript.initWithModel(cellsModels[y][x]!);
                    cellCount++;
                } else {
                    console.error(`GridView: CellView component not found on prefab type ${type}`);
                }
                this.cellViews[y][x] = aniView;
            }
        }
        
    }

    private initBackgroundLayer(): void {
        if (!this.bgLayer) {
            this.bgLayer = new Node('CellBgLayer');
            this.node.addChild(this.bgLayer);
            this.bgLayer.setSiblingIndex(0);
        }
        this.bgLayer.removeAllChildren();

        for (let y = 1; y <= this.gridHeight; y++) {
            for (let x = 1; x <= this.gridWidth; x++) {
                if (this.cellMask[y] && this.cellMask[y][x] === false) {
                    continue;
                }
                const bgNode = new Node(`Bg_${x}_${y}`);
                this.bgLayer.addChild(bgNode);
                bgNode.setPosition(CELL_WIDTH * (x - 0.5), CELL_HEIGHT * (y - 0.5), -10);
                const uiTransform = bgNode.addComponent(UITransform);
                uiTransform.setContentSize(CELL_WIDTH - 6, CELL_HEIGHT - 6);
                const graphics = bgNode.addComponent(Graphics);
                graphics.fillColor = new Color(0, 0, 0, 60);
                graphics.strokeColor = new Color(255, 255, 255, 50);
                graphics.lineWidth = 2;
                graphics.roundRect(-(CELL_WIDTH - 6) / 2, -(CELL_HEIGHT - 6) / 2, CELL_WIDTH - 6, CELL_HEIGHT - 6, 10);
                graphics.fill();
                graphics.stroke();
            }
        }
    }

    setListener(): void {
        this.node.on(Node.EventType.TOUCH_START, (eventTouch: any) => {
            if (this.paused) {
                return true;
            }
            if (this.isInPlayAni) {
                return true;
            }
            const touchPos = eventTouch.getLocation();
            
            const cellPos = this.convertTouchPosToCell(touchPos);
            if (cellPos) {
                const changeModels = this.selectCell(cellPos);
                this.isCanMove = changeModels.length < 3;
            } else {
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
        // In Cocos 3.x, convertToNodeSpaceAR expects Vec3
        const worldPos = v3(pos.x, pos.y, 0);
        const localPos3 = uiTransform.convertToNodeSpaceAR(worldPos);
        
        const gridPixelWidth = this.gridWidth * CELL_WIDTH;
        const gridPixelHeight = this.gridHeight * CELL_HEIGHT;
        
        // Check if the touch is within grid bounds
        // Note: In Cocos 3.x, the coordinate origin might be at bottom-left
        if (localPos3.x < 0 || localPos3.x >= gridPixelWidth || 
            localPos3.y < 0 || localPos3.y >= gridPixelHeight) {
            return null;
        }
        
        // Convert pixel position to grid cell position (1-indexed)
        const x = Math.floor(localPos3.x / CELL_WIDTH) + 1;
        const y = Math.floor(localPos3.y / CELL_HEIGHT) + 1;
        
        // Validate cell position
        if (x < 1 || x > this.gridWidth || y < 1 || y > this.gridHeight) {
            console.error(`Invalid cell position calculated: (${x}, ${y})`);
            return null;
        }

        if (this.cellMask[y] && this.cellMask[y][x] === false) {
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
        for (let y = 1; y <= this.gridHeight; y++) {
            for (let x = 1; x <= this.gridWidth; x++) {
                if (this.cellViews[y] && this.cellViews[y][x]) {
                    const cellScript = this.cellViews[y][x]!.getComponent(CellView);
                    if (cellScript) {
                        cellScript.setSelect(pos.x == x && pos.y == y);
                    }
                }
            }
        }
    }

    findViewByModel(model: CellModel): { view: Node, x: number, y: number } | null {
        for (let y = 1; y <= this.gridHeight; y++) {
            for (let x = 1; x <= this.gridWidth; x++) {
                if (this.cellViews[y] && this.cellViews[y][x]) {
                    const cellView = this.cellViews[y][x]!.getComponent(CellView);
                    if (cellView && (cellView as any).model == model) {
                        return { view: this.cellViews[y][x]!, x, y };
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
        if (!this.controller) {
            console.error("GridView.selectCell: No controller set!");
            return [];
        }
        const result = this.controller.selectCell(cellPos);
        
        if (!result) {
            console.error("GridView.selectCell: Controller returned null/undefined");
            return [];
        }
        
        const changeModels = result[0];
        const effectsQueue = result[1];
        
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
