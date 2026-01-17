import { _decorator, Component, ProgressBar, Button, AudioClip, director, assetManager, AudioSource, Sprite, Node } from 'cc';
import { LevelSelectController } from './LevelSelectController';
const { ccclass, property } = _decorator;

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

        this.ensureProgressBarSpriteType();
    }

    onLogin(): void {
        if (!this.loadingBar || !this.loginButton) return;
        
        this.loadingBar.node.active = true;
        this.loginButton.node.active = false;
        
        this.ensureProgressBarSpriteType();

        const barSprite = this.loadingBar.getComponentInChildren(Sprite);
        if (barSprite && barSprite.type === Sprite.Type.FILLED) {
            barSprite.fillRange = 0;
        }

        this.loadingBar.progress = 0;
        
        // Preload the Level scene with progress tracking
        director.preloadScene("Level", (completedCount: number, totalCount: number, item: any) => {
            if (!this.loadingBar) return;
            
            let progress = completedCount / totalCount;
            this.loadingBar.progress = progress;
            
            const barSprite = this.loadingBar.getComponentInChildren(Sprite);
            if (barSprite && barSprite.type === Sprite.Type.FILLED && progress > barSprite.fillRange) {
                barSprite.fillRange = progress;
            }
        }, (error: Error | null) => {
            if (error) {
                console.error('Failed to preload scene:', error);
                return;
            }
            
            if (this.loadingBar && this.loginButton) {
                this.loadingBar.node.active = false;
                this.loginButton.node.active = false;
            }
            
            director.loadScene("Level", () => {
                const scene = director.getScene();
                if (!scene) return;
                let rootNode = scene.getChildByName('LevelRoot');
                if (!rootNode) {
                    rootNode = new Node('LevelRoot');
                    scene.addChild(rootNode);
                }
                if (!rootNode.getComponent(LevelSelectController)) {
                    rootNode.addComponent(LevelSelectController);
                }
            });
        });
    }

    onDestroy(): void {
        if (this.audioSource) {
            this.audioSource.stop();
        }
    }

    private ensureProgressBarSpriteType(): void {
        if (!this.loadingBar) return;
        const barSprite = this.loadingBar.getComponentInChildren(Sprite);
        if (!barSprite) return;
        if (this.loadingBar.mode === ProgressBar.Mode.FILLED) {
            barSprite.type = Sprite.Type.FILLED;
        } else {
            barSprite.type = Sprite.Type.SIMPLE;
        }
    }

}
