import {
  _decorator,
  Component,
  director,
  Node,
  Canvas,
  UITransform,
  Label,
  Layout,
  ScrollView,
  Mask,
  Vec3,
  view,
  Color,
  color,
  UIOpacity,
  Sprite,
  SpriteFrame,
  resources,
  Texture2D,
  ImageAsset,
  Graphics
} from 'cc';
import { LevelSession } from '../Model/Level/LevelSession';
import { LevelConfigService, LevelConfig } from '../Model/Level/LevelConfig';
import { LevelProgress } from '../Model/Level/LevelProgress';
const { ccclass, property } = _decorator;

@ccclass('LevelSelectController')
export class LevelSelectController extends Component {
  @property
  public defaultLevelId = 1;

  private scrollView: ScrollView | null = null;
  private contentNode: Node | null = null;
  private backgroundNode: Node | null = null;
  private scrollHintNode: Node | null = null;
  private iconFrames: Record<string, SpriteFrame> = {};

  async onLoad(): Promise<void> {
    LevelSession.setSelectedLevelId(this.defaultLevelId);
    this.ensureCanvasAndScrollView();
    await this.loadIcons();
    await this.loadAndRenderLevels();
  }

  onSelectLevel(levelId: number): void {
    LevelSession.setSelectedLevelId(levelId);
    director.loadScene('Game');
  }

  private ensureCanvasAndScrollView(): void {
    const scene = director.getScene();
    if (!scene) return;

    let canvas = scene.getComponentInChildren(Canvas);
    if (!canvas) {
      const canvasNode = new Node('Canvas');
      scene.addChild(canvasNode);
      canvas = canvasNode.addComponent(Canvas);
      const canvasTransform = canvasNode.addComponent(UITransform);
      const size = view.getVisibleSize();
      canvasTransform.setContentSize(size.width, size.height);
      canvasNode.setPosition(size.width / 2, size.height / 2, 0);
    }

    const canvasNode = canvas.node;
    const canvasTransform = canvasNode.getComponent(UITransform);
    const canvasWidth = canvasTransform ? canvasTransform.width : view.getVisibleSize().width;
    const canvasHeight = canvasTransform ? canvasTransform.height : view.getVisibleSize().height;
    if (!this.backgroundNode) {
      const bgNode = new Node('LevelBackground');
      canvasNode.addChild(bgNode);
      bgNode.setPosition(new Vec3(0, 0, 0));
      const bgTransform = bgNode.addComponent(UITransform);
      bgTransform.setContentSize(canvasWidth, canvasHeight);
      const bgSprite = bgNode.addComponent(Sprite);
      bgSprite.color = new Color(255, 255, 255, 255);
      this.backgroundNode = bgNode;
      bgNode.setSiblingIndex(0);
    }

    if (!this.scrollHintNode) {
      const hintNode = new Node('LevelScrollHint');
      canvasNode.addChild(hintNode);
      hintNode.setPosition(new Vec3(0, -canvasHeight * 0.4, 0));
      const hintTransform = hintNode.addComponent(UITransform);
      hintTransform.setContentSize(36, 36);
      hintNode.addComponent(Sprite);
      this.scrollHintNode = hintNode;
    }
    let scrollNode = canvasNode.getChildByName('LevelScroll');
    if (!scrollNode) {
      scrollNode = new Node('LevelScroll');
      canvasNode.addChild(scrollNode);
      scrollNode.setPosition(new Vec3(0, 0, 0));
      const scrollTransform = scrollNode.addComponent(UITransform);
      const size = view.getVisibleSize();
      scrollTransform.setContentSize(size.width * 0.9, size.height * 0.85);
      const mask = scrollNode.addComponent(Mask);
      mask.type = Mask.Type.GRAPHICS_RECT;
      const scrollView = scrollNode.addComponent(ScrollView);
      scrollView.vertical = true;
      scrollView.horizontal = false;

      const contentNode = new Node('Content');
      scrollNode.addChild(contentNode);
      const contentTransform = contentNode.addComponent(UITransform);
      contentTransform.setContentSize(scrollTransform.width, 0);
      contentTransform.setAnchorPoint(0.5, 1);
      contentNode.setPosition(new Vec3(0, scrollTransform.height / 2, 0));
      const layout = contentNode.addComponent(Layout);
      layout.type = Layout.Type.VERTICAL;
      layout.resizeMode = Layout.ResizeMode.CONTAINER;
      layout.spacingY = 20;
      layout.paddingTop = 20;
      layout.paddingBottom = 40;

      scrollView.content = contentNode;
    }

    this.scrollView = scrollNode.getComponent(ScrollView);
    const content = scrollNode.getChildByName('Content');
    this.contentNode = content || null;
  }

  private async loadIcons(): Promise<void> {
    const names = [
      'star',
      'crown',
      'lock',
      'unlock',
      'timer',
      'target',
      'arrow_down',
      'background'
    ];
    await Promise.all(names.map((name) => this.loadImageAsSpriteFrame(name)));

    if (this.backgroundNode && this.iconFrames.background) {
      const bgSprite = this.backgroundNode.getComponent(Sprite);
      if (bgSprite) {
        bgSprite.spriteFrame = this.iconFrames.background;
        bgSprite.sizeMode = Sprite.SizeMode.CUSTOM;
      }
    }

    if (this.scrollHintNode && this.iconFrames.arrow_down) {
      const hintSprite = this.scrollHintNode.getComponent(Sprite);
      if (hintSprite) {
        hintSprite.spriteFrame = this.iconFrames.arrow_down;
      }
    }
  }

  private loadImageAsSpriteFrame(name: string): Promise<SpriteFrame | null> {
    if (this.iconFrames[name]) {
      return Promise.resolve(this.iconFrames[name]);
    }

    return new Promise((resolve) => {
      resources.load(`level-select/${name}`, ImageAsset, (err, asset) => {
        if (err || !asset) {
          console.warn(`Failed to load sprite frame: ${name}`, err);
          resolve(null);
          return;
        }
        const frame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = asset;
        frame.texture = texture;
        this.iconFrames[name] = frame;
        resolve(frame);
      });
    });
  }

  private async loadAndRenderLevels(): Promise<void> {
    if (!this.contentNode) return;
    const levels = await LevelConfigService.loadAll();
    const progress = LevelProgress.load();

    this.contentNode.removeAllChildren();

    levels.forEach((level) => {
      const isUnlocked = progress.isUnlocked(level.data.unlock.starsRequired);
      const stars = progress.getStars(level.data.id);
      const itemNode = this.createLevelItem(level, stars, isUnlocked);
      this.contentNode!.addChild(itemNode);
    });
  }

  private createLevelItem(level: LevelConfig, stars: number, isUnlocked: boolean): Node {
    const itemNode = new Node(`LevelItem_${level.data.id}`);
    const itemTransform = itemNode.addComponent(UITransform);
    itemTransform.setContentSize(520, 140);

    const cardNode = new Node('Card');
    itemNode.addChild(cardNode);
    const cardTransform = cardNode.addComponent(UITransform);
    cardTransform.setContentSize(520, 140);
    const graphics = cardNode.addComponent(Graphics);
    graphics.fillColor = new Color(20, 20, 20, 220);
    graphics.roundRect(-260, -70, 520, 140, 16);
    graphics.fill();

    const clampedStars = Math.max(0, Math.min(3, stars));

    const titleNode = new Node('Title');
    itemNode.addChild(titleNode);
    const titleTransform = titleNode.addComponent(UITransform);
    titleTransform.setContentSize(500, 60);
    titleNode.setPosition(new Vec3(0, 38, 0));
    const titleLabel = titleNode.addComponent(Label);
    titleLabel.string = isUnlocked
      ? `${level.data.id}. ${level.data.name}`
      : `${level.data.id}. 未解锁`;
    titleLabel.fontSize = 32;
    titleLabel.color = isUnlocked ? color(255, 255, 255) : color(180, 180, 180);

    if (isUnlocked && clampedStars === 3 && this.iconFrames.crown) {
      const crownNode = new Node('Crown');
      itemNode.addChild(crownNode);
      const crownTransform = crownNode.addComponent(UITransform);
      crownTransform.setContentSize(32, 32);
      crownNode.setPosition(new Vec3(220, 35, 0));
      const crownSprite = crownNode.addComponent(Sprite);
      crownSprite.spriteFrame = this.iconFrames.crown;
    }

    const iconNode = new Node('StateIcon');
    itemNode.addChild(iconNode);
    const iconTransform = iconNode.addComponent(UITransform);
    iconTransform.setContentSize(48, 48);
    iconNode.setPosition(new Vec3(-210, 10, 0));
    const iconSprite = iconNode.addComponent(Sprite);
    const stateIcon = isUnlocked ? this.iconFrames.unlock : this.iconFrames.lock;
    if (stateIcon) {
      iconSprite.spriteFrame = stateIcon;
    }

    const starsNode = new Node('Stars');
    itemNode.addChild(starsNode);
    const starsTransform = starsNode.addComponent(UITransform);
    starsTransform.setContentSize(200, 40);
    starsNode.setPosition(new Vec3(-10, -15, 0));
    const starFrame = this.iconFrames.star;
    for (let i = 0; i < 3; i++) {
      const s = new Node(`Star_${i + 1}`);
      starsNode.addChild(s);
      const sTransform = s.addComponent(UITransform);
      sTransform.setContentSize(32, 32);
      s.setPosition(new Vec3((i - 1) * 40, 0, 0));
      const sSprite = s.addComponent(Sprite);
      if (starFrame) {
        sSprite.spriteFrame = starFrame;
      }
      sSprite.color = i < clampedStars && isUnlocked ? color(255, 215, 0) : color(130, 130, 130);
    }

    const modeNode = new Node('Mode');
    itemNode.addChild(modeNode);
    const modeTransform = modeNode.addComponent(UITransform);
    modeTransform.setContentSize(200, 40);
    modeNode.setPosition(new Vec3(170, -15, 0));
    const modeIconNode = new Node('ModeIcon');
    modeNode.addChild(modeIconNode);
    const modeIconTransform = modeIconNode.addComponent(UITransform);
    modeIconTransform.setContentSize(28, 28);
    modeIconNode.setPosition(new Vec3(-60, 0, 0));
    const modeIconSprite = modeIconNode.addComponent(Sprite);
    const modeFrame = level.data.mode === 'time' ? this.iconFrames.timer : this.iconFrames.target;
    if (modeFrame) {
      modeIconSprite.spriteFrame = modeFrame;
    }
    const modeLabelNode = new Node('ModeLabel');
    modeNode.addChild(modeLabelNode);
    const modeLabel = modeLabelNode.addComponent(Label);
    const valueText = level.data.mode === 'time' ? `${level.data.time || 0}s` : `${level.data.steps || 0}步`;
    modeLabel.string = valueText;
    modeLabel.fontSize = 24;
    modeLabel.color = isUnlocked ? color(255, 255, 255) : color(160, 160, 160);
    modeLabelNode.setPosition(new Vec3(10, 0, 0));

    if (!isUnlocked) {
      const opacity = itemNode.addComponent(UIOpacity);
      opacity.opacity = 180;
    } else {
      itemNode.on(Node.EventType.TOUCH_END, () => {
        this.onSelectLevel(level.data.id);
      });
    }


    return itemNode;
  }
}
