import { _decorator, Component, Prefab, instantiate, Animation, Node } from 'cc';
const { ccclass, property } = _decorator;

import { CELL_WIDTH } from '../Model/ConstValue';
import { AudioUtils } from "../Utils/AudioUtils";
import { EffectCommand } from '../Model/GameModel';
import { logDebug, logError, logWarn } from '../Utils/Debug';

type EffectNode = Node & { _safetyTimeout?: ReturnType<typeof setTimeout> };

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
        
        logDebug(`EffectLayer.playEffects: Playing ${effectQueue.length} effects`);
        
        const soundMap: { [key: string]: boolean } = {};
        
        effectQueue.forEach((cmd, index) => {
            // Use setTimeout instead of tween for more reliable timing
            setTimeout(() => {
                logDebug(`EffectLayer: Playing effect ${index}: ${cmd.action} at (${cmd.pos.x}, ${cmd.pos.y})`);
                
                let instantEffect: EffectNode | null = null;
                let animation: Animation | null = null;
                let animationName: string = "";
                
                if (cmd.action == "crush" && this.crushEffect) {
                    instantEffect = instantiate(this.crushEffect) as EffectNode;
                    animation = instantEffect.getComponent(Animation);
                    animationName = "effect";
                    if (!soundMap["crush" + cmd.playTime] && this.audioUtils && cmd.step !== undefined) {
                        this.audioUtils.playEliminate(cmd.step);
                    }
                    soundMap["crush" + cmd.playTime] = true;
                }
                else if (cmd.action == "rowBomb" && this.bombWhite) {
                    instantEffect = instantiate(this.bombWhite) as EffectNode;
                    animation = instantEffect.getComponent(Animation);
                    animationName = "effect_line";
                }
                else if (cmd.action == "colBomb" && this.bombWhite) {
                    instantEffect = instantiate(this.bombWhite) as EffectNode;
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
                    
                    logDebug(`EffectLayer: Effect positioned at (${instantEffect.position.x}, ${instantEffect.position.y}), parent: ${this.node.name}`);
                    
                    if (animation && animationName) {
                        logDebug(`EffectLayer: Animation component found, clips: ${animation.clips.length}`);
                        logDebug(`EffectLayer: Default clip: ${animation.defaultClip ? animation.defaultClip.name : 'none'}`);
                        
                        // Make sure animation is enabled
                        animation.enabled = true;
                        
                        // Stop any playing animation first
                        animation.stop();

                        // Listen first, then play
                        animation.once(Animation.EventType.FINISHED, () => {
                            logDebug(`EffectLayer: Animation FINISHED event fired, destroying effect immediately`);
                            if (instantEffect && instantEffect.isValid) {
                                const timeoutId = instantEffect._safetyTimeout;
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
                            logDebug(`EffectLayer: Animation '${animationName}' playing, duration: ${animState.duration}s, speed: ${animState.speed}`);
                            
                            // Add a safety timeout only as a fallback (with exact duration, no extra delay)
                            // This should NOT normally fire if FINISHED event works correctly
                            const speed = animState.speed || 1;
                            const exactDuration = (animState.duration / speed) * 1000;
                            const safetyTimeout = setTimeout(() => {
                                if (instantEffect && instantEffect.isValid) {
                                    logWarn(`EffectLayer: Safety timeout triggered (FINISHED event didn't fire), destroying effect`);
                                    instantEffect.destroy();
                                }
                            }, exactDuration + 100); // Only 100ms extra as safety margin
                            
                            // Store timeout ID so we can clear it if FINISHED fires first
                            instantEffect._safetyTimeout = safetyTimeout;
                        } else {
                            logError(`EffectLayer: Failed to play animation '${animationName}'`);
                            // Fallback: destroy after 1 second
                            setTimeout(() => {
                                if (instantEffect && instantEffect.isValid) {
                                    instantEffect.destroy();
                                }
                            }, 1000);
                        }
                    } else {
                        if (!animation) {
                            logError(`EffectLayer: No Animation component on prefab`);
                        }
                        // If no animation, destroy after a delay
                        logDebug(`EffectLayer: No animation, will destroy after 1s`);
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
