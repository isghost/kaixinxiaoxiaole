import { _decorator, Component, Node, Prefab, Vec2, v2, instantiate, tween } from 'cc';
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
        this.setListener();
        this.lastTouchPos = v2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false;
    }

    setController(controller: any): void {
        this.controller = controller;
    }

    initWithCellModels(cellsModels: (CellModel | null)[][]): void {
        this.cellViews = [];
        for (let i = 1; i <= 9; i++) {
            this.cellViews[i] = [];
            for (let j = 1; j <= 9; j++) {
                if (!cellsModels[i] || !cellsModels[i][j]) continue;
                
                const type = cellsModels[i][j]!.type;
                if (type === null || type < 0 || type >= this.aniPre.length) continue;
                
                const aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                const cellViewScript = aniView.getComponent(CellView);
                if (cellViewScript) {
                    cellViewScript.initWithModel(cellsModels[i][j]!);
                }
                this.cellViews[i][j] = aniView;
            }
        }
    }

    setListener(): void {
        this.node.on(Node.EventType.TOUCH_START, (eventTouch: any) => {
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
        const localPos = this.node.getComponent(UITransform)?.convertToNodeSpaceAR(pos);
        if (!localPos) return null;
        
        if (localPos.x < 0 || localPos.x >= GRID_PIXEL_WIDTH || localPos.y < 0 || localPos.y >= GRID_PIXEL_HEIGHT) {
            return null;
        }
        const x = Math.floor(localPos.x / CELL_WIDTH) + 1;
        const y = Math.floor(localPos.y / CELL_HEIGHT) + 1;
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
        if (!this.controller) return [];
        
        const result = this.controller.selectCell(cellPos);
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
