import { _decorator, Component, Prefab, Node, Vec2, EventTouch, instantiate, tween } from 'cc';
import { CELL_WIDTH, CELL_HEIGHT, GRID_PIXEL_WIDTH, GRID_PIXEL_HEIGHT, ANITIME } from '../Model/ConstValue';
import { AudioUtils } from "../Utils/AudioUtils";
import { CellView } from "./CellView";
import CellModel from '../Model/CellModel';

const { ccclass, property } = _decorator;

@ccclass('GridView')
export class GridView extends Component {
    @property([Prefab])
    aniPre: Prefab[] = [];

    @property(Node)
    effectLayer: Node | null = null;

    @property(AudioUtils)
    audioUtils: AudioUtils | null = null;

    private cellViews: (Node | null)[][] = [];
    private lastTouchPos: Vec2 = new Vec2(-1, -1);
    private isCanMove: boolean = true;
    private isInPlayAni: boolean = false;
    private controller: any = null;

    onLoad() {
        this.setListener();
        this.lastTouchPos = new Vec2(-1, -1);
        this.isCanMove = true;
        this.isInPlayAni = false;
    }

    setController(controller: any) {
        this.controller = controller;
    }

    initWithCellModels(cellsModels: (CellModel | null)[][]) {
        this.cellViews = [];
        for (var i = 1; i <= 9; i++) {
            this.cellViews[i] = [];
            for (var j = 1; j <= 9; j++) {
                if (!cellsModels[i][j]) continue;
                var type = cellsModels[i][j]!.type!;
                var aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent(CellView);
                if (cellViewScript) {
                    cellViewScript.initWithModel(cellsModels[i][j]!);
                }
                this.cellViews[i][j] = aniView;
            }
        }
    }

    setListener() {
        this.node.on(Node.EventType.TOUCH_START, (eventTouch: EventTouch) => {
            if (this.isInPlayAni) {
                return true;
            }
            var touchPos = eventTouch.getLocation();
            var cellPos = this.convertTouchPosToCell(touchPos);
            if (cellPos) {
                var changeModels = this.selectCell(cellPos);
                this.isCanMove = changeModels.length < 3;
            } else {
                this.isCanMove = false;
            }
            return true;
        }, this);

        this.node.on(Node.EventType.TOUCH_MOVE, (eventTouch: EventTouch) => {
            if (this.isCanMove) {
                var startTouchPos = eventTouch.getStartLocation();
                var startCellPos = this.convertTouchPosToCell(startTouchPos);
                var touchPos = eventTouch.getLocation();
                var cellPos = this.convertTouchPosToCell(touchPos);
                if (startCellPos && cellPos && (startCellPos.x != cellPos.x || startCellPos.y != cellPos.y)) {
                    this.isCanMove = false;
                    var changeModels = this.selectCell(cellPos);
                }
            }
        }, this);

        this.node.on(Node.EventType.TOUCH_END, (eventTouch: EventTouch) => {
            // console.log("1111");
        }, this);

        this.node.on(Node.EventType.TOUCH_CANCEL, (eventTouch: EventTouch) => {
            // console.log("1111");
        }, this);
    }

    convertTouchPosToCell(pos: Vec2): Vec2 | null {
        const transform = this.node.getComponent('UITransform');
        if (!transform) {
            console.error('UITransform component not found on grid node');
            return null;
        }
        pos = transform.convertToNodeSpaceAR(pos);
        if (pos.x < 0 || pos.x >= GRID_PIXEL_WIDTH || pos.y < 0 || pos.y >= GRID_PIXEL_HEIGHT) {
            return null;
        }
        var x = Math.floor(pos.x / CELL_WIDTH) + 1;
        var y = Math.floor(pos.y / CELL_HEIGHT) + 1;
        return new Vec2(x, y);
    }

    updateView(changeModels: CellModel[]) {
        let newCellViewInfo: { model: CellModel, view: Node }[] = [];
        for (var i in changeModels) {
            var model = changeModels[i];
            var viewInfo = this.findViewByModel(model);
            var view: Node | null = null;

            if (!viewInfo) {
                var type = model.type!;
                var aniView = instantiate(this.aniPre[type]);
                aniView.parent = this.node;
                var cellViewScript = aniView.getComponent(CellView);
                if (cellViewScript) {
                    cellViewScript.initWithModel(model);
                }
                view = aniView;
            } else {
                view = viewInfo.view;
                this.cellViews[viewInfo.y][viewInfo.x] = null;
            }

            var cellScript = view.getComponent(CellView);
            if (cellScript) {
                cellScript.updateView();
            }

            if (!model.isDeath) {
                newCellViewInfo.push({
                    model: model,
                    view: view
                });
            }
        }

        newCellViewInfo.forEach((ele) => {
            let model = ele.model;
            this.cellViews[model.y][model.x] = ele.view;
        }, this);
    }

    updateSelect(pos: Vec2) {
        for (var i = 1; i <= 9; i++) {
            for (var j = 1; j <= 9; j++) {
                if (this.cellViews[i][j]) {
                    var cellScript = this.cellViews[i][j]!.getComponent(CellView);
                    if (cellScript) {
                        if (pos.x == j && pos.y == i) {
                            cellScript.setSelect(true);
                        } else {
                            cellScript.setSelect(false);
                        }
                    }
                }
            }
        }
    }

    findViewByModel(model: CellModel): { view: Node, x: number, y: number } | null {
        for (var i = 1; i <= 9; i++) {
            for (var j = 1; j <= 9; j++) {
                if (this.cellViews[i][j]) {
                    const cellView = this.cellViews[i][j]!.getComponent(CellView);
                    if (cellView && cellView['model'] == model) {
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
        var maxTime = 0;
        changeModels.forEach((ele) => {
            ele.cmd.forEach((cmd) => {
                if (maxTime < cmd.playTime + cmd.keepTime) {
                    maxTime = cmd.playTime + cmd.keepTime;
                }
            }, this)
        }, this);
        return maxTime;
    }

    getStep(effectsQueue: any[]): number {
        if (!effectsQueue) {
            return 0;
        }
        return effectsQueue.reduce((maxValue, efffectCmd) => {
            return Math.max(maxValue, efffectCmd.step || 0);
        }, 0);
    }

    disableTouch(time: number, step: number) {
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
        var result = this.controller.selectCell(cellPos);
        var changeModels = result[0];
        var effectsQueue = result[1];
        this.playEffect(effectsQueue);
        this.disableTouch(this.getPlayAniTime(changeModels), this.getStep(effectsQueue));
        this.updateView(changeModels);
        this.controller.cleanCmd();
        if (changeModels.length >= 2) {
            this.updateSelect(new Vec2(-1, -1));
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

    playEffect(effectsQueue: any[]) {
        if (this.effectLayer) {
            const effectLayer = this.effectLayer.getComponent("EffectLayer");
            if (effectLayer) {
                effectLayer.playEffects(effectsQueue);
            }
        }
    }
}
