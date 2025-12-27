import { _decorator, Component, AudioClip, AudioSource } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioUtils')
export class AudioUtils extends Component {
    @property(AudioClip)
    swap: AudioClip | null = null;

    @property(AudioClip)
    click: AudioClip | null = null;

    @property([AudioClip])
    eliminate: AudioClip[] = [];

    @property([AudioClip])
    continuousMatch: AudioClip[] = [];

    private audioSource: AudioSource | null = null;

    onLoad() {
        this.audioSource = this.addComponent(AudioSource);
    }

    start() {

    }

    playClick() {
        if (this.click && this.audioSource) {
            this.audioSource.playOneShot(this.click, 1);
        }
    }

    playSwap() {
        if (this.swap && this.audioSource) {
            this.audioSource.playOneShot(this.swap, 1);
        }
    }

    playEliminate(step: number) {
        if (this.eliminate.length === 0 || !this.audioSource) return;
        step = Math.min(this.eliminate.length - 1, step);
        const clip = this.eliminate[step];
        if (clip) {
            this.audioSource.playOneShot(clip, 1);
        }
    }

    playContinuousMatch(step: number) {
        console.log("step = ", step);
        if (this.continuousMatch.length === 0 || !this.audioSource) return;
        step = Math.min(step, 11);
        if (step < 2) {
            return;
        }
        const index = Math.floor(step / 2) - 1;
        const clip = this.continuousMatch[index];
        if (clip) {
            this.audioSource.playOneShot(clip, 1);
        }
    }
}
