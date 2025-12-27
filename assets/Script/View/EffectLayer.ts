import { _decorator, Component, Prefab, instantiate, Animation, tween } from 'cc';
const { ccclass, property } = _decorator;

import { CELL_WIDTH } from '../Model/ConstValue';
import { AudioUtils } from "../Utils/AudioUtils";
import { EffectCommand } from '../Model/GameModel';

@ccclass('EffectLayer')
export class EffectLayer extends Component {
    @property(Prefab)
    public bombWhite: Prefab | null = null;
    
    @property(Prefab)
    public crushEffect: Prefab | null = null;
    
    @property(AudioUtils)
    public audioUtils: AudioUtils | null = null;

    onLoad(): void {
    }

    playEffects(effectQueue: EffectCommand[]): void {
        if (!effectQueue || effectQueue.length <= 0) {
            return;
        }
        
        const soundMap: { [key: string]: boolean } = {};
        
        effectQueue.forEach((cmd) => {
            tween(this.node)
                .delay(cmd.playTime)
                .call(() => {
                    let instantEffect: any = null;
                    let animation: Animation | null = null;
                    
                    if (cmd.action == "crush" && this.crushEffect) {
                        instantEffect = instantiate(this.crushEffect);
                        animation = instantEffect.getComponent(Animation);
                        if (animation) {
                            animation.play("effect");
                        }
                        if (!soundMap["crush" + cmd.playTime] && this.audioUtils && cmd.step !== undefined) {
                            this.audioUtils.playEliminate(cmd.step);
                        }
                        soundMap["crush" + cmd.playTime] = true;
                    }
                    else if (cmd.action == "rowBomb" && this.bombWhite) {
                        instantEffect = instantiate(this.bombWhite);
                        animation = instantEffect.getComponent(Animation);
                        if (animation) {
                            animation.play("effect_line");
                        }
                    }
                    else if (cmd.action == "colBomb" && this.bombWhite) {
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
                            animation.once(Animation.EventType.FINISHED, () => {
                                instantEffect.destroy();
                            }, this);
                        }
                    }
                })
                .start();
        });
    }

}
