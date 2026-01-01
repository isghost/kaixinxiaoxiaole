import { _decorator, Component, ProgressBar, Button, AudioClip, director, AudioSource, Sprite } from 'cc';
const { ccclass, property } = _decorator;

import { logError } from '../Utils/Debug';

@ccclass('LoginController')
export class LoginController extends Component {
    @property(ProgressBar)
    public loadingBar: ProgressBar | null = null;
    
    @property(Button)
    public loginButton: Button | null = null;
    
    @property(AudioClip)
    public worldSceneBGM: AudioClip | null = null;
    
    private audioSource: AudioSource | null = null;

    onLoad(): void {
        // In Cocos 3.x, create AudioSource component to play audio
        this.audioSource = this.node.addComponent(AudioSource);
        if (this.audioSource && this.worldSceneBGM) {
            this.audioSource.clip = this.worldSceneBGM;
            this.audioSource.loop = true;
            this.audioSource.playOnAwake = true;
            this.audioSource.play();
        }
    }

    onLogin(): void {
        if (!this.loadingBar || !this.loginButton) return;
        
        this.loadingBar.node.active = true;
        this.loginButton.node.active = false;
        this.loadingBar.progress = 0;
        
        // Get the fill sprite if available
        const barSprite = this.loadingBar.getComponentInChildren(Sprite);
        if (barSprite) {
            barSprite.fillRange = 0;
        }
        
        // Preload the Level scene with progress tracking
        director.preloadScene("Level", (completedCount: number, totalCount: number, _item: unknown) => {
            if (!this.loadingBar) return;
            
            let progress = completedCount / totalCount;
            this.loadingBar.progress = progress;
            
            const barSprite = this.loadingBar.getComponentInChildren(Sprite);
            if (barSprite && progress > barSprite.fillRange) {
                barSprite.fillRange = progress;
            }
        }, (error: Error | null) => {
            if (error) {
                logError('Failed to preload scene:', error);
                return;
            }
            
            if (this.loadingBar && this.loginButton) {
                this.loadingBar.node.active = false;
                this.loginButton.node.active = false;
            }
            
            director.loadScene("Level");
        });
    }

    onDestroy(): void {
        if (this.audioSource) {
            this.audioSource.stop();
        }
    }

}
