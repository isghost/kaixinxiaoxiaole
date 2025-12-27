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
        
        console.log(`EffectLayer.playEffects: Playing ${effectQueue.length} effects`);
        
        const soundMap: { [key: string]: boolean } = {};
        
        effectQueue.forEach((cmd, index) => {
            // Use setTimeout instead of tween for more reliable timing
            setTimeout(() => {
                console.log(`EffectLayer: Playing effect ${index}: ${cmd.action} at (${cmd.pos.x}, ${cmd.pos.y})`);
                
                let instantEffect: any = null;
                let animation: Animation | null = null;
                
                if (cmd.action == "crush" && this.crushEffect) {
                    instantEffect = instantiate(this.crushEffect);
                    animation = instantEffect.getComponent(Animation);
                    if (animation) {
                        console.log(`EffectLayer: Playing 'effect' animation, clips: ${animation.clips.length}`);
                        // Make sure animation is enabled
                        animation.enabled = true;
                        animation.play("effect");
                    } else {
                        console.error("EffectLayer: No Animation component on crushEffect prefab");
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
                        console.log(`EffectLayer: Playing 'effect_line' animation, clips: ${animation.clips.length}`);
                        animation.enabled = true;
                        animation.play("effect_line");
                    } else {
                        console.error("EffectLayer: No Animation component on bombWhite prefab");
                    }
                }
                else if (cmd.action == "colBomb" && this.bombWhite) {
                    instantEffect = instantiate(this.bombWhite);
                    animation = instantEffect.getComponent(Animation);
                    if (animation) {
                        console.log(`EffectLayer: Playing 'effect_col' animation, clips: ${animation.clips.length}`);
                        animation.enabled = true;
                        animation.play("effect_col");
                    } else {
                        console.error("EffectLayer: No Animation component on bombWhite prefab");
                    }
                }
                
                if (instantEffect) {
                    // Set position before adding to parent
                    instantEffect.setPosition(
                        CELL_WIDTH * (cmd.pos.x - 0.5),
                        CELL_WIDTH * (cmd.pos.y - 0.5),
                        0
                    );
                    // Add to scene
                    instantEffect.parent = this.node;
                    
                    console.log(`EffectLayer: Effect positioned at (${instantEffect.position.x}, ${instantEffect.position.y}), parent: ${this.node.name}`);
                    
                    if (animation) {
                        // Get the animation duration
                        const currentClip = animation.defaultClip || animation.clips[0];
                        const duration = currentClip ? currentClip.duration : 1.0;
                        
                        console.log(`EffectLayer: Animation duration: ${duration}s`);
                        
                        // In Cocos 3.x, listen to the 'finished' event
                        animation.on(Animation.EventType.FINISHED, () => {
                            console.log(`EffectLayer: Animation finished, destroying effect`);
                            if (instantEffect && instantEffect.isValid) {
                                instantEffect.destroy();
                            }
                        });
                        
                        // Also add a safety timeout in case event doesn't fire
                        setTimeout(() => {
                            if (instantEffect && instantEffect.isValid) {
                                console.log(`EffectLayer: Safety timeout, destroying effect`);
                                instantEffect.destroy();
                            }
                        }, (duration + 0.5) * 1000);
                    } else {
                        // If no animation, destroy after a delay
                        console.log(`EffectLayer: No animation, will destroy after 1s`);
                        setTimeout(() => {
                            if (instantEffect && instantEffect.isValid) {
                                instantEffect.destroy();
                            }
                        }, 1000);
                    }
                }
            }, cmd.playTime * 1000);
        });
    }

}
