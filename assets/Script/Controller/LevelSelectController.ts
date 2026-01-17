import { _decorator, Component, Node, Prefab, instantiate, UITransform, Vec3, director, ScrollView, Layout, Size, Color, Sprite, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

import LevelManager from '../Model/LevelManager';
import { DEFAULT_LEVELS } from '../Model/LevelData';
import LevelConfig from '../Model/LevelConfig';
import { LevelItem } from '../View/LevelItem';

/**
 * Level Select Controller
 * Displays a scrollable level selection screen similar to Candy Crush/开心消消乐
 * Levels are displayed from bottom to top
 */
@ccclass('LevelSelectController')
export class LevelSelectController extends Component {
    @property(Node)
    public levelItemContainer: Node | null = null;
    
    @property(Prefab)
    public levelItemPrefab: Prefab | null = null;
    
    @property(ScrollView)
    public scrollView: ScrollView | null = null;
    
    private levelManager: LevelManager | null = null;

    onLoad(): void {
        console.log("LevelSelectController.onLoad: Starting initialization");
        
        // Initialize level manager
        this.levelManager = LevelManager.getInstance();
        this.levelManager.registerLevels(DEFAULT_LEVELS);
        
        // Create level selection UI
        this.createLevelItems();
        
        // Scroll to current level
        this.scheduleOnce(() => {
            this.scrollToCurrentLevel();
        }, 0.1);
        
        console.log("LevelSelectController.onLoad: Initialization complete");
    }
    
    /**
     * Create level item nodes for all levels
     */
    private createLevelItems(): void {
        if (!this.levelItemContainer) {
            console.error("LevelSelectController: Missing level item container");
            return;
        }
        
        const allLevels = this.levelManager!.getAllLevels();
        const maxUnlocked = this.levelManager!.getMaxUnlockedLevel();
        
        console.log(`Creating ${allLevels.length} level items, max unlocked: ${maxUnlocked}`);
        
        // Reverse the levels so they display from bottom to top
        const reversedLevels = [...allLevels].reverse();
        
        for (const levelNum of reversedLevels) {
            const levelConfig = this.levelManager!.getLevelConfig(levelNum);
            if (!levelConfig) continue;
            
            const isUnlocked = this.levelManager!.isLevelUnlocked(levelNum);
            const progress = this.levelManager!.getLevelProgress(levelNum);
            
            // Create level item programmatically or from prefab
            let levelItem: Node;
            if (this.levelItemPrefab) {
                levelItem = instantiate(this.levelItemPrefab);
                levelItem.parent = this.levelItemContainer;
            } else {
                // Create programmatically if no prefab
                levelItem = LevelItem.createLevelItem(this.levelItemContainer);
            }
            
            // Set up level item
            this.setupLevelItem(levelItem, levelConfig, isUnlocked, progress);
        }
    }
    
    /**
     * Set up a single level item with data
     */
    private setupLevelItem(levelItem: Node, levelConfig: LevelConfig, isUnlocked: boolean, progress: any): void {
        // Find child nodes
        const levelLabel = levelItem.getChildByName('LevelLabel');
        const starsNode = levelItem.getChildByName('Stars');
        const lockIcon = levelItem.getChildByName('LockIcon');
        const mapIcon = levelItem.getChildByName('MapIcon');
        const modeIcon = levelItem.getChildByName('ModeIcon');
        
        // Set level number
        if (levelLabel) {
            const label = levelLabel.getComponent(Label);
            if (label) {
                label.string = `${levelConfig.getLevel()}`;
            }
        }
        
        // Set stars (if completed)
        if (starsNode && progress) {
            for (let i = 1; i <= 3; i++) {
                const star = starsNode.getChildByName(`Star${i}`);
                if (star) {
                    star.active = i <= progress.stars;
                }
            }
        } else if (starsNode) {
            starsNode.active = false;
        }
        
        // Set lock state
        if (lockIcon) {
            lockIcon.active = !isUnlocked;
        }
        
        // Set map icon based on map type
        if (mapIcon) {
            const sprite = mapIcon.getComponent(Sprite);
            if (sprite && levelConfig.hasCustomMap()) {
                // Different color for different maps
                const mapConfig = levelConfig.getMapConfig();
                if (mapConfig) {
                    switch(mapConfig.name) {
                        case '爱心地图':
                            sprite.color = new Color(255, 105, 180); // Pink
                            break;
                        case '十字地图':
                            sprite.color = new Color(100, 149, 237); // Cornflower blue
                            break;
                        case '钻石地图':
                            sprite.color = new Color(147, 112, 219); // Medium purple
                            break;
                        default:
                            sprite.color = new Color(128, 128, 128); // Gray
                    }
                }
            }
        }
        
        // Set mode icon
        if (modeIcon) {
            const label = modeIcon.getComponent(Label);
            if (label) {
                label.string = levelConfig.isTimerMode() ? '⏰' : '👣';
            }
        }
        
        // Set up button click
        const button = levelItem.getComponent(Button);
        if (button) {
            button.node.on('click', () => {
                this.onLevelItemClick(levelConfig.getLevel(), isUnlocked);
            }, this);
        }
        
        // Visual feedback for locked/unlocked
        const sprite = levelItem.getComponent(Sprite);
        if (sprite) {
            if (!isUnlocked) {
                sprite.color = new Color(128, 128, 128, 200); // Grayed out
            } else if (progress && progress.completed) {
                sprite.color = new Color(144, 238, 144); // Light green for completed
            } else {
                sprite.color = new Color(255, 255, 255); // White for available
            }
        }
    }
    
    /**
     * Handle level item click
     */
    private onLevelItemClick(levelNum: number, isUnlocked: boolean): void {
        if (!isUnlocked) {
            console.log(`Level ${levelNum} is locked`);
            return;
        }
        
        console.log(`Starting level ${levelNum}`);
        
        // Set current level
        if (this.levelManager!.setCurrentLevel(levelNum)) {
            // Load game scene
            director.loadScene("Game");
        }
    }
    
    /**
     * Scroll to current level
     */
    private scrollToCurrentLevel(): void {
        if (!this.scrollView || !this.levelItemContainer) return;
        
        const currentLevel = this.levelManager!.getCurrentLevel();
        const allLevels = this.levelManager!.getAllLevels();
        
        // Find the index (reversed)
        const reversedIndex = allLevels.length - currentLevel;
        const totalLevels = allLevels.length;
        
        // Calculate scroll percentage (0 = bottom, 1 = top)
        let scrollPercentage = 1 - (reversedIndex / Math.max(totalLevels - 1, 1));
        scrollPercentage = Math.max(0, Math.min(1, scrollPercentage));
        
        // Set scroll offset
        this.scrollView.scrollToPercentVertical(scrollPercentage, 0.5);
    }
    
    /**
     * Go back to main menu
     */
    public onBackButton(): void {
        director.loadScene("Login");
    }
}
