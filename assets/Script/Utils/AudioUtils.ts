import { _decorator, Component, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

import { logDebug } from './Debug';

@ccclass('AudioUtils')
export class AudioUtils extends Component {
    @property(AudioClip)
    public swap: AudioClip | null = null;
    
    @property(AudioClip)
    public click: AudioClip | null = null;
    
    @property([AudioClip])
    public eliminate: AudioClip[] = [];
    
    @property([AudioClip])
    public continuousMatch: AudioClip[] = [];
    
    private audioSource: AudioSource | null = null;

    onLoad(): void {
        // Create an AudioSource component for playing sound effects
        this.audioSource = this.node.addComponent(AudioSource);
    }

    start(): void {
    }

    playClick(): void {
        if (this.audioSource && this.click) {
            this.audioSource.playOneShot(this.click, 1);
        }
    }

    playSwap(): void {
        if (this.audioSource && this.swap) {
            this.audioSource.playOneShot(this.swap, 1);
        }
    }

    playEliminate(step: number): void {
        if (!this.audioSource || this.eliminate.length === 0) return;
        
        step = Math.min(this.eliminate.length - 1, step);
        if (this.eliminate[step]) {
            this.audioSource.playOneShot(this.eliminate[step], 1);
        }
    }

    playContinuousMatch(step: number): void {
        if (!this.audioSource || this.continuousMatch.length === 0) return;
        
        logDebug("step = ", step);
        step = Math.min(step, 11);
        if (step < 2) {
            return;
        }
        const index = Math.floor(step / 2) - 1;
        if (index >= 0 && index < this.continuousMatch.length) {
            this.audioSource.playOneShot(this.continuousMatch[index], 1);
        }
    }

}

