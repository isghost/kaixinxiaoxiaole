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
                    
                    console.log(`EffectLayer: Effect positioned at (${instantEffect.position.x}, ${instantEffect.position.y}), parent: ${this.node.name}`);
                    
                    if (animation && animationName) {
                        console.log(`EffectLayer: Animation component found, clips: ${animation.clips.length}`);
                        console.log(`EffectLayer: Default clip: ${animation.defaultClip ? animation.defaultClip.name : 'none'}`);
                        console.log(`EffectLayer: PlayOnAwake: ${animation.playOnAwake}`);
                        
                        // Make sure animation is enabled
                        animation.enabled = true;
                        
                        // Stop any playing animation first
                        animation.stop();
                        
                        // Play the animation and get the state
                        const animState = animation.play(animationName);
                        
                        if (animState) {
                            console.log(`EffectLayer: Animation '${animationName}' playing, duration: ${animState.duration}s, speed: ${animState.speed}`);
                            
                            // Listen to the 'finished' event
                            animation.on(Animation.EventType.FINISHED, () => {
                                console.log(`EffectLayer: Animation finished, destroying effect`);
                                if (instantEffect && instantEffect.isValid) {
                                    instantEffect.destroy();
                                }
                            });
                            
                            // Also add a safety timeout
                            setTimeout(() => {
                                if (instantEffect && instantEffect.isValid) {
                                    console.log(`EffectLayer: Safety timeout, destroying effect`);
                                    instantEffect.destroy();
                                }
                            }, (animState.duration / animState.speed + 0.5) * 1000);
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
