import { _decorator, Component, SpriteFrame, Animation, Sprite, tween, v3, UIOpacity, Vec3, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

import { CELL_STATUS, CELL_WIDTH, CELL_HEIGHT, ANITIME } from '../Model/ConstValue';
import CellModel from '../Model/CellModel';
import { ResourceLoader } from '../Utils/ResourceLoader';

@ccclass('CellView')
export class CellView extends Component {
    @property(SpriteFrame)
    public defaultFrame: SpriteFrame | null = null;
    
    private model: CellModel | null = null;
    private isSelect: boolean = false;
    private obstacleNode: Node | null = null;
    private obstacleSprite: Sprite | null = null;

    private static obstacleFrames: Record<string, SpriteFrame> = {};
    private static obstacleLoading: Record<string, Promise<void>> = {};

    onLoad(): void {
        this.isSelect = false;
    }

    initWithModel(model: CellModel): void {
        this.model = model;
        const x = model.startX;
        const y = model.startY;
        this.node.setPosition(CELL_WIDTH * (x - 0.5), CELL_HEIGHT * (y - 0.5));
        
        const animation = this.node.getComponent(Animation);
        if (animation) {
            if (model.status == CELL_STATUS.COMMON) {
                animation.stop();
            } else {
                animation.play(model.status as string);
            }
        }

        this.ensureObstacleNode();
        this.refreshObstacleVisual();
    }

    updateView(): void {
        if (!this.model) return;

        // Always refresh obstacle overlay even if there is no tween command.
        this.refreshObstacleVisual();
        
        const cmd = this.model.cmd;
        if (cmd.length <= 0) {
            return;
        }
        
        let currentTween = tween(this.node);
        let curTime = 0;
        
        for (let i = 0; i < cmd.length; i++) {
            const command = cmd[i];
            
            // Add delay if needed
            if (command.playTime > curTime) {
                currentTween = currentTween.delay(command.playTime - curTime);
            }
            
            if (command.action == "moveTo" && command.pos) {
                const x = (command.pos.x - 0.5) * CELL_WIDTH;
                const y = (command.pos.y - 0.5) * CELL_HEIGHT;
                currentTween = currentTween.to(ANITIME.TOUCH_MOVE, {
                    position: v3(x, y, 0)
                });
            }
            else if (command.action == "toDie") {
                if (this.model.status == CELL_STATUS.BIRD) {
                    const animation = this.node.getComponent(Animation);
                    if (animation) {
                        animation.play("effect");
                    }
                    currentTween = currentTween.delay(ANITIME.BOMB_BIRD_DELAY);
                }
                currentTween = currentTween.call(() => {
                    this.node.destroy();
                });
            }
            else if (command.action == "setVisible") {
                const isVisible = command.isVisible;
                currentTween = currentTween.call(() => {
                    const uiOpacity = this.node.getComponent(UIOpacity) || this.node.addComponent(UIOpacity);
                    if (uiOpacity) {
                        uiOpacity.opacity = isVisible ? 255 : 0;
                    }
                });
            }
            else if (command.action == "toShake") {
                // Create shake animation with rotation
                currentTween = currentTween
                    .to(0.06, { eulerAngles: v3(0, 0, 30) })
                    .to(0.12, { eulerAngles: v3(0, 0, -30) })
                    .to(0.06, { eulerAngles: v3(0, 0, 30) })
                    .to(0.06, { eulerAngles: v3(0, 0, -30) })
                    .to(0.12, { eulerAngles: v3(0, 0, 30) })
                    .to(0.06, { eulerAngles: v3(0, 0, 0) });
            }
            
            curTime = command.playTime + command.keepTime;
        }
        
        currentTween.start();
    }

    private ensureObstacleNode(): void {
        if (this.obstacleNode && this.obstacleNode.isValid) return;
        const n = new Node('Obstacle');
        this.node.addChild(n);
        n.setPosition(new Vec3(0, 0, 1));
        const ui = n.addComponent(UITransform);
        ui.setContentSize(CELL_WIDTH - 8, CELL_HEIGHT - 8);
        const sp = n.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        this.obstacleNode = n;
        this.obstacleSprite = sp;
    }

    private refreshObstacleVisual(): void {
        if (!this.model) return;
        this.ensureObstacleNode();
        if (!this.obstacleNode || !this.obstacleSprite) return;

        const type = this.model.obstacleType || (this.model.isLocked ? 'chain' : null);
        if (!type) {
            this.obstacleNode.active = false;
            return;
        }

        this.obstacleNode.active = true;
        const frame = CellView.obstacleFrames[type];
        if (frame) {
            this.obstacleSprite.spriteFrame = frame;
        } else {
            this.obstacleSprite.spriteFrame = null;
            this.loadObstacleFrame(type);
        }

        const uiOpacity = this.obstacleNode.getComponent(UIOpacity) || this.obstacleNode.addComponent(UIOpacity);
        if (type === 'ice') {
            uiOpacity.opacity = this.model.obstacleHp >= 2 ? 255 : 190;
        } else {
            uiOpacity.opacity = 235;
        }
    }

    private loadObstacleFrame(type: string): void {
        if (CellView.obstacleFrames[type] || CellView.obstacleLoading[type]) return;
        const path = type === 'ice'
            ? 'obstacles/ice'
            : type === 'crate'
                ? 'obstacles/crate'
                : 'obstacles/chain';

        CellView.obstacleLoading[type] = ResourceLoader.loadSpriteFrame(path)
            .then((sf) => {
                CellView.obstacleFrames[type] = sf;
                delete CellView.obstacleLoading[type];
                this.refreshObstacleVisual();
            })
            .catch(() => {
                delete CellView.obstacleLoading[type];
            });
    }

    setSelect(flag: boolean): void {
        if (!this.model) return;
        
        const animation = this.node.getComponent(Animation);
        const bg = this.node.getChildByName("select");
        
        if (!flag && this.isSelect && this.model.status == CELL_STATUS.COMMON) {
            if (animation) {
                animation.stop();
            }
            const sprite = this.node.getComponent(Sprite);
            if (sprite && this.defaultFrame) {
                sprite.spriteFrame = this.defaultFrame;
            }
        }
        else if (flag && this.model.status == CELL_STATUS.COMMON) {
            if (animation) {
                animation.play(CELL_STATUS.CLICK as string);
            }
        }
        else if (flag && this.model.status == CELL_STATUS.BIRD) {
            if (animation) {
                animation.play(CELL_STATUS.CLICK as string);
            }
        }
        
        if (bg) {
            bg.active = flag;
        }
        this.isSelect = flag;
    }

}
