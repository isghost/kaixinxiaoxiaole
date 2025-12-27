import { _decorator, Component, SpriteFrame, Animation, Sprite, Vec3, tween, Vec2, Tween, Node } from 'cc';
import { CELL_STATUS, CELL_WIDTH, CELL_HEIGHT, ANITIME } from '../Model/ConstValue';
import CellModel from '../Model/CellModel';

const { ccclass, property } = _decorator;

@ccclass('CellView')
export class CellView extends Component {
    @property(SpriteFrame)
    defaultFrame: SpriteFrame | null = null;

    private model: CellModel | null = null;
    private isSelect: boolean = false;

    onLoad() {
        this.isSelect = false;
    }

    initWithModel(model: CellModel) {
        this.model = model;
        var x = model.startX;
        var y = model.startY;
        this.node.setPosition(CELL_WIDTH * (x - 0.5), CELL_HEIGHT * (y - 0.5));
        
        var animation = this.node.getComponent(Animation);
        if (animation) {
            if (model.status == CELL_STATUS.COMMON) {
                animation.stop();
            } else {
                animation.play(model.status as string);
            }
        }
    }

    // 执行移动动作
    updateView() {
        if (!this.model) return;
        
        var cmd = this.model.cmd;
        if (cmd.length <= 0) {
            return;
        }

        var curTime = 0;
        let tweenSequence: Tween<Node> | null = null;

        for (var i in cmd) {
            const command = cmd[i];
            
            if (command.playTime > curTime) {
                var delay = command.playTime - curTime;
                tweenSequence = this.getTweenOrChain(tweenSequence).delay(delay);
            }

            if (command.action == "moveTo") {
                var x = (command.pos.x - 0.5) * CELL_WIDTH;
                var y = (command.pos.y - 0.5) * CELL_HEIGHT;
                tweenSequence = this.getTweenOrChain(tweenSequence).to(ANITIME.TOUCH_MOVE, { position: new Vec3(x, y, 0) });
            } else if (command.action == "toDie") {
                if (this.model.status == CELL_STATUS.BIRD) {
                    let animation = this.node.getComponent(Animation);
                    if (animation) {
                        animation.play("effect");
                    }
                    tweenSequence = this.getTweenOrChain(tweenSequence).delay(ANITIME.BOMB_BIRD_DELAY);
                }
                tweenSequence = this.getTweenOrChain(tweenSequence).call(() => {
                    this.node.destroy();
                });
            } else if (command.action == "setVisible") {
                let isVisible = command.isVisible;
                tweenSequence = this.getTweenOrChain(tweenSequence).call(() => {
                    if (isVisible) {
                        this.node.opacity = 255;
                    } else {
                        this.node.opacity = 0;
                    }
                });
            } else if (command.action == "toShake") {
                // 使用 tween 实现抖动效果
                const rotateRight = tween().by(0.06, { angle: 30 });
                const rotateLeft = tween().by(0.12, { angle: -60 });
                const rotateBack = tween().by(0.06, { angle: 30 });
                const shakeSequence = tween(this.node)
                    .then(rotateRight)
                    .then(rotateLeft)
                    .then(rotateBack)
                    .then(rotateRight)
                    .then(rotateLeft)
                    .then(rotateBack);
                
                tweenSequence = this.getTweenOrChain(tweenSequence).then(shakeSequence);
            }
            curTime = command.playTime + command.keepTime;
        }

        if (tweenSequence) {
            tweenSequence.start();
        }
    }

    // Helper method to get existing tween or create new one
    private getTweenOrChain(tweenSequence: Tween<Node> | null): Tween<Node> {
        return tweenSequence || tween(this.node);
    }

    setSelect(flag: boolean) {
        if (!this.model) return;
        
        var animation = this.node.getComponent(Animation);
        var bg = this.node.getChildByName("select");
        
        if (flag == false && this.isSelect && this.model.status == CELL_STATUS.COMMON) {
            if (animation) {
                animation.stop();
            }
            const sprite = this.node.getComponent(Sprite);
            if (sprite && this.defaultFrame) {
                sprite.spriteFrame = this.defaultFrame;
            }
        } else if (flag && this.model.status == CELL_STATUS.COMMON) {
            if (animation) {
                animation.play(CELL_STATUS.CLICK as string);
            }
        } else if (flag && this.model.status == CELL_STATUS.BIRD) {
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
