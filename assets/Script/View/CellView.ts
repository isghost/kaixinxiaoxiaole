import { _decorator, Component, SpriteFrame, Animation, Sprite, tween, v3, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { CELL_STATUS, CELL_WIDTH, CELL_HEIGHT, ANITIME } from '../Model/ConstValue';
import CellModel from '../Model/CellModel';

@ccclass('CellView')
export class CellView extends Component {
    @property(SpriteFrame)
    public defaultFrame: SpriteFrame | null = null;
    
    private model: CellModel | null = null;
    private isSelect: boolean = false;

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
    }

    updateView(): void {
        if (!this.model) return;
        
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
