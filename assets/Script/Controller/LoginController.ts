import { _decorator, Component, ProgressBar, Button, AudioClip, AudioSource, director, assetManager } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('LoginController')
export class LoginController extends Component {
    @property(ProgressBar)
    loadingBar: ProgressBar | null = null;

    @property(Button)
    loginButton: Button | null = null;

    @property(AudioClip)
    worldSceneBGM: AudioClip | null = null;

    private audioSource: AudioSource | null = null;
    private last: number = 0;

    onLoad() {
        this.audioSource = this.addComponent(AudioSource);
        if (this.audioSource && this.worldSceneBGM) {
            this.audioSource.clip = this.worldSceneBGM;
            this.audioSource.loop = true;
            this.audioSource.play();
        }
    }

    onLogin() {
        this.last = 0;
        if (this.loadingBar) {
            this.loadingBar.node.active = true;
            this.loadingBar.progress = 0;
        }
        if (this.loginButton) {
            this.loginButton.node.active = false;
        }

        director.preloadScene("Game", (completedCount: number, totalCount: number, item: any) => {
            if (this.loadingBar) {
                let progress = completedCount / totalCount;
                this.loadingBar.progress = progress;
            }
        }, (error: Error | null) => {
            if (error) {
                console.error('Failed to load scene: ', error);
                return;
            }
            if (this.loadingBar) {
                this.loadingBar.node.active = false;
            }
            if (this.loginButton) {
                this.loginButton.node.active = false;
            }
            director.loadScene("Game");
        });
    }

    onDestroy() {
        if (this.audioSource) {
            this.audioSource.stop();
        }
    }
}
