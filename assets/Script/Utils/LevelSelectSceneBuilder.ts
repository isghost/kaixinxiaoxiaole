import { _decorator, Component, Node, UITransform, Canvas, Widget, Layout, Size, ScrollView, view, Color, Sprite, Label, Button, Vec3 } from 'cc';
const { ccclass } = _decorator;

/**
 * Level Select Scene Builder
 * Creates the level selection UI programmatically
 * This is a helper component that can be attached to the Canvas to auto-build the scene
 */
@ccclass('LevelSelectSceneBuilder')
export class LevelSelectSceneBuilder extends Component {
    
    onLoad(): void {
        console.log("LevelSelectSceneBuilder: Building scene structure");
        this.buildScene();
    }
    
    private buildScene(): void {
        const canvas = this.node.getComponent(Canvas);
        if (!canvas) {
            console.error("LevelSelectSceneBuilder must be attached to Canvas node");
            return;
        }
        
        // Get design resolution
        const designResolution = view.getDesignResolutionSize();
        
        // Create background
        const background = new Node('Background');
        background.parent = this.node;
        background.layer = this.node.layer;
        
        const bgTransform = background.addComponent(UITransform);
        bgTransform.setContentSize(designResolution);
        
        const bgWidget = background.addComponent(Widget);
        bgWidget.isAlignTop = true;
        bgWidget.isAlignBottom = true;
        bgWidget.isAlignLeft = true;
        bgWidget.isAlignRight = true;
        bgWidget.top = 0;
        bgWidget.bottom = 0;
        bgWidget.left = 0;
        bgWidget.right = 0;
        
        const bgSprite = background.addComponent(Sprite);
        bgSprite.color = new Color(135, 206, 250, 255); // Sky blue
        
        // Create title
        const title = new Node('Title');
        title.parent = this.node;
        title.layer = this.node.layer;
        title.setPosition(0, designResolution.height / 2 - 80, 0);
        
        const titleTransform = title.addComponent(UITransform);
        titleTransform.setContentSize(new Size(400, 80));
        
        const titleLabel = title.addComponent(Label);
        titleLabel.string = "选择关卡";
        titleLabel.fontSize = 60;
        titleLabel.color = new Color(255, 255, 255, 255);
        titleLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
        titleLabel.verticalAlign = Label.VerticalAlign.CENTER;
        
        // Create back button
        const backButton = new Node('BackButton');
        backButton.parent = this.node;
        backButton.layer = this.node.layer;
        backButton.setPosition(-designResolution.width / 2 + 80, designResolution.height / 2 - 80, 0);
        
        const backBtnTransform = backButton.addComponent(UITransform);
        backBtnTransform.setContentSize(new Size(120, 60));
        
        const backBtnSprite = backButton.addComponent(Sprite);
        backBtnSprite.color = new Color(70, 130, 180, 255);
        
        const backBtnLabel = new Node('Label');
        backBtnLabel.parent = backButton;
        backBtnLabel.layer = this.node.layer;
        
        const backBtnLabelTransform = backBtnLabel.addComponent(UITransform);
        backBtnLabelTransform.setContentSize(new Size(120, 60));
        
        const backBtnLabelComp = backBtnLabel.addComponent(Label);
        backBtnLabelComp.string = "返回";
        backBtnLabelComp.fontSize = 32;
        backBtnLabelComp.color = new Color(255, 255, 255, 255);
        backBtnLabelComp.horizontalAlign = Label.HorizontalAlign.CENTER;
        backBtnLabelComp.verticalAlign = Label.VerticalAlign.CENTER;
        
        const backBtn = backButton.addComponent(Button);
        
        // Create ScrollView
        const scrollView = new Node('ScrollView');
        scrollView.parent = this.node;
        scrollView.layer = this.node.layer;
        scrollView.setPosition(0, -50, 0);
        
        const scrollTransform = scrollView.addComponent(UITransform);
        scrollTransform.setContentSize(new Size(designResolution.width - 100, designResolution.height - 250));
        
        const scrollSprite = scrollView.addComponent(Sprite);
        scrollSprite.color = new Color(255, 255, 255, 100);
        
        const scrollViewComp = scrollView.addComponent(ScrollView);
        scrollViewComp.horizontal = false;
        scrollViewComp.vertical = true;
        
        // Create view (mask area)
        const view = new Node('view');
        view.parent = scrollView;
        view.layer = this.node.layer;
        
        const viewTransform = view.addComponent(UITransform);
        viewTransform.setContentSize(scrollTransform.contentSize);
        
        // Create content
        const content = new Node('content');
        content.parent = view;
        content.layer = this.node.layer;
        
        const contentTransform = content.addComponent(UITransform);
        contentTransform.setContentSize(new Size(scrollTransform.width, 1000)); // Will grow with items
        contentTransform.setAnchorPoint(0.5, 0); // Anchor at bottom
        
        const contentLayout = content.addComponent(Layout);
        contentLayout.type = Layout.Type.VERTICAL;
        contentLayout.resizeMode = Layout.ResizeMode.CONTAINER;
        contentLayout.verticalDirection = Layout.VerticalDirection.BOTTOM_TO_TOP;
        contentLayout.spacingY = 20;
        contentLayout.paddingTop = 20;
        contentLayout.paddingBottom = 20;
        contentLayout.paddingLeft = 20;
        contentLayout.paddingRight = 20;
        
        // Set scroll view content
        scrollViewComp.content = contentTransform;
        
        console.log("LevelSelectSceneBuilder: Scene structure created");
        console.log(`ScrollView: ${scrollView.name}, Content: ${content.name}`);
    }
}
