import { _decorator, Component, Prefab, Animation, instantiate, tween, Vec3 } from 'cc';
import { CELL_WIDTH } from '../Model/ConstValue';
import { AudioUtils } from "../Utils/AudioUtils";

const { ccclass, property } = _decorator;

@ccclass('EffectLayer')
export class EffectLayer extends Component {
    @property(Prefab)
    bombWhite: Prefab | null = null;

    @property(Prefab)
    crushEffect: Prefab | null = null;

    @property(AudioUtils)
    audioUtils: AudioUtils | null = null;

    onLoad() {

    }

    playEffects(effectQueue: any[]) {
        if (!effectQueue || effectQueue.length <= 0) {
            return;
        }
        let soundMap: { [key: string]: boolean } = {};

        effectQueue.forEach((cmd) => {
            tween(this.node)
                .delay(cmd.playTime)
                .call(() => {
                    let instantEffect: any = null;
                    let animation: Animation | null = null;
                    
                    if (cmd.action == "crush") {
                        if (!this.crushEffect) return;
                        instantEffect = instantiate(this.crushEffect);
                        animation = instantEffect.getComponent(Animation);
                        if (animation) {
                            animation.play("effect");
                        }
                        if (!soundMap["crush" + cmd.playTime] && this.audioUtils) {
                            this.audioUtils.playEliminate(cmd.step);
                        }
                        soundMap["crush" + cmd.playTime] = true;
                    } else if (cmd.action == "rowBomb") {
                        if (!this.bombWhite) return;
                        instantEffect = instantiate(this.bombWhite);
                        animation = instantEffect.getComponent(Animation);
                        if (animation) {
                            animation.play("effect_line");
                        }
                    } else if (cmd.action == "colBomb") {
                        if (!this.bombWhite) return;
                        instantEffect = instantiate(this.bombWhite);
                        animation = instantEffect.getComponent(Animation);
                        if (animation) {
                            animation.play("effect_col");
                        }
                    }

                    if (instantEffect) {
                        instantEffect.setPosition(
                            CELL_WIDTH * (cmd.pos.x - 0.5),
                            CELL_WIDTH * (cmd.pos.y - 0.5)
                        );
                        instantEffect.parent = this.node;
                        
                        if (animation) {
                            animation.on(Animation.EventType.FINISHED, () => {
                                instantEffect.destroy();
                            }, this);
                        }
                    }
                })
                .start();
        }, this);
    }
}
