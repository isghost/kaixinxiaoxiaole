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
        
        effectQueue.forEach((cmd, index) => {
            // Use setTimeout instead of tween for more reliable timing
            setTimeout(() => {
                let instantEffect: any = null;
                let animation: Animation | null = null;
                let animationName: string = "";
                
                if (cmd.action == "crush" && this.crushEffect) {
                    instantEffect = instantiate(this.crushEffect);
                    animation = instantEffect.getComponent(Animation);
                    animationName = "effect";
                    if (!soundMap["crush" + cmd.playTime] && this.audioUtils && cmd.step !== undefined) {
                        this.audioUtils.playEliminate(cmd.step);
                    }
                    soundMap["crush" + cmd.playTime] = true;
                }
                else if (cmd.action == "rowBomb" && this.bombWhite) {
                    instantEffect = instantiate(this.bombWhite);
                    animation = instantEffect.getComponent(Animation);
                    animationName = "effect_line";
                }
                else if (cmd.action == "colBomb" && this.bombWhite) {
                    instantEffect = instantiate(this.bombWhite);
                    animation = instantEffect.getComponent(Animation);
                    animationName = "effect_col";
                }
                
                if (instantEffect) {
                    // IMPORTANT: Add to scene FIRST before playing animation
                    instantEffect.parent = this.node;
                    
                    // Set position after adding to parent
                    instantEffect.setPosition(
                        CELL_WIDTH * (cmd.pos.x - 0.5),
                        CELL_WIDTH * (cmd.pos.y - 0.5),
                        0
                    );
                    if (animation && animationName) {
                        // Make sure animation is enabled
                        animation.enabled = true;
                        
                        // Stop any playing animation first
                        animation.stop();

                        // Listen first, then play
                        animation.once(Animation.EventType.FINISHED, () => {
                            if (instantEffect && instantEffect.isValid) {
                                const timeoutId = (instantEffect as any)._safetyTimeout as ReturnType<typeof setTimeout> | undefined;
                                if (timeoutId) {
                                    clearTimeout(timeoutId);
                                }
                                instantEffect.destroy();
                            }
                        });

                        // Play the animation (3.8: returns void)
                        animation.play(animationName);
                        const animState = animation.getState(animationName);

                        if (animState) {
                            // Add a safety timeout only as a fallback (with exact duration, no extra delay)
                            // This should NOT normally fire if FINISHED event works correctly
                            const speed = animState.speed || 1;
                            const exactDuration = (animState.duration / speed) * 1000;
                            const safetyTimeout = setTimeout(() => {
                                if (instantEffect && instantEffect.isValid) {
                                    console.warn(`EffectLayer: Safety timeout triggered (FINISHED event didn't fire), destroying effect`);
                                    instantEffect.destroy();
                                }
                            }, exactDuration + 100); // Only 100ms extra as safety margin
                            
                            // Store timeout ID so we can clear it if FINISHED fires first
                            (instantEffect as any)._safetyTimeout = safetyTimeout;
                        } else {
                            console.error(`EffectLayer: Failed to play animation '${animationName}'`);
                            // Fallback: destroy after 1 second
                            setTimeout(() => {
                                if (instantEffect && instantEffect.isValid) {
                                    instantEffect.destroy();
                                }
                            }, 1000);
                        }
                    } else {
                        if (!animation) {
                            console.error(`EffectLayer: No Animation component on prefab`);
                        }
                        // If no animation, destroy after a delay
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
