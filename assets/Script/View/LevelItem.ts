import { _decorator, Component, Node, UITransform, Sprite, Label, Button, Color, Size, Vec3, Widget, Layout } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Level Item Component
 * Represents a single level button in the level select screen
 */
@ccclass('LevelItem')
export class LevelItem extends Component {
    
    /**
     * Create a level item programmatically
     * This is a factory method to create level items when we don't have prefabs
     */
    static createLevelItem(parent: Node): Node {
        // Create main node
        const levelItem = new Node('LevelItem');
        levelItem.parent = parent;
        
        // Add UITransform
        const transform = levelItem.addComponent(UITransform);
        transform.setContentSize(new Size(120, 120));
        
        // Add Button component
        const button = levelItem.addComponent(Button);
        
        // Add Sprite for background
        const sprite = levelItem.addComponent(Sprite);
        sprite.color = new Color(255, 255, 255, 255);
        // Note: In a real implementation, you would set a sprite frame here
        
        // Create level label (number)
        const levelLabel = new Node('LevelLabel');
        levelLabel.parent = levelItem;
        levelLabel.setPosition(0, 0, 0);
        
        const levelLabelTransform = levelLabel.addComponent(UITransform);
        levelLabelTransform.setContentSize(new Size(100, 50));
        
        const levelLabelComp = levelLabel.addComponent(Label);
        levelLabelComp.string = "1";
        levelLabelComp.fontSize = 36;
        levelLabelComp.color = new Color(0, 0, 0, 255);
        levelLabelComp.horizontalAlign = Label.HorizontalAlign.CENTER;
        levelLabelComp.verticalAlign = Label.VerticalAlign.CENTER;
        
        // Create stars container
        const starsNode = new Node('Stars');
        starsNode.parent = levelItem;
        starsNode.setPosition(0, -40, 0);
        
        const starsTransform = starsNode.addComponent(UITransform);
        starsTransform.setContentSize(new Size(100, 30));
        
        const starsLayout = starsNode.addComponent(Layout);
        starsLayout.type = Layout.Type.HORIZONTAL;
        starsLayout.spacingX = 5;
        starsLayout.horizontalDirection = Layout.HorizontalDirection.LEFT_TO_RIGHT;
        starsLayout.resizeMode = Layout.ResizeMode.CONTAINER;
        
        // Create 3 stars
        for (let i = 1; i <= 3; i++) {
            const star = new Node(`Star${i}`);
            star.parent = starsNode;
            
            const starTransform = star.addComponent(UITransform);
            starTransform.setContentSize(new Size(20, 20));
            
            const starLabel = star.addComponent(Label);
            starLabel.string = "⭐";
            starLabel.fontSize = 20;
            star.active = false; // Hidden by default
        }
        
        // Create lock icon
        const lockIcon = new Node('LockIcon');
        lockIcon.parent = levelItem;
        lockIcon.setPosition(0, 0, 0);
        
        const lockTransform = lockIcon.addComponent(UITransform);
        lockTransform.setContentSize(new Size(50, 50));
        
        const lockLabel = lockIcon.addComponent(Label);
        lockLabel.string = "🔒";
        lockLabel.fontSize = 40;
        lockIcon.active = false; // Hidden by default
        
        // Create map icon (small indicator)
        const mapIcon = new Node('MapIcon');
        mapIcon.parent = levelItem;
        mapIcon.setPosition(-40, 40, 0);
        
        const mapTransform = mapIcon.addComponent(UITransform);
        mapTransform.setContentSize(new Size(20, 20));
        
        const mapSprite = mapIcon.addComponent(Sprite);
        mapSprite.color = new Color(128, 128, 128, 255);
        
        // Create mode icon (timer or moves)
        const modeIcon = new Node('ModeIcon');
        modeIcon.parent = levelItem;
        modeIcon.setPosition(40, 40, 0);
        
        const modeTransform = modeIcon.addComponent(UITransform);
        modeTransform.setContentSize(new Size(30, 30));
        
        const modeLabel = modeIcon.addComponent(Label);
        modeLabel.string = "👣";
        modeLabel.fontSize = 24;
        
        return levelItem;
    }
}
