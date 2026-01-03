import {
  _decorator,
  Component,
  director,
  Node,
  Canvas,
  UITransform,
  Layers,
  view,
  Camera,
  Color,
  color,
  Graphics,
  Label,
  Mask,
  ScrollView,
  Vec3,
  Sprite,
  SpriteFrame,
  resources,
} from 'cc';

import Toast from '../Utils/Toast';
import LevelProgress from '../Model/LevelProgress';

const { ccclass } = _decorator;

@ccclass('LevelSelectController')
export class LevelSelectController extends Component {
  private readonly totalLevels = 50;
  private readonly levelSpacingY = 170;
  private readonly pathAmplitudeX = 220;
  private readonly pathWaveStep = 0.55;

  private readonly tempArt = {
    lockPath: 'temp_ai/lock_64',
    // Use the currently imported star assets.
    starFilledPath: 'temp_ai/star_filled_32',
    starEmptyPath: 'temp_ai/star_empty_32',
  } as const;

  private readonly tempArtCache = new Map<string, SpriteFrame>();
  private readonly tempArtLoads = new Map<string, Promise<SpriteFrame | null>>();

  onLoad(): void {
    void this.init();
  }

  private async init(): Promise<void> {
    this.ensureUICameraVisibility();

    // Preload temporary art so UI does not need label/emoji fallbacks.
    await this.preloadTempArt();

    const canvas = this.ensureCanvas();
    if (!canvas) {
      return;
    }

    this.buildUI(canvas);
  }

  private async preloadTempArt(): Promise<void> {
    // Best-effort; failures should never block or crash the UI.
    await Promise.all([
      this.getSpriteFrameFromResources(this.tempArt.lockPath),
      this.getSpriteFrameFromResources(this.tempArt.starFilledPath),
      this.getSpriteFrameFromResources(this.tempArt.starEmptyPath),
    ]);
  }

  private async getSpriteFrameFromResources(basePath: string): Promise<SpriteFrame | null> {
    const cached = this.tempArtCache.get(basePath);
    if (cached) return cached;

    const existingLoad = this.tempArtLoads.get(basePath);
    if (existingLoad) return existingLoad;

    const loadPromise = (async () => {
      const firstTry = await this.loadSpriteFrameAt(`${basePath}/spriteFrame`);
      const spriteFrame = firstTry ?? (await this.loadSpriteFrameAt(basePath));
      if (spriteFrame) this.tempArtCache.set(basePath, spriteFrame);
      return spriteFrame;
    })();

    this.tempArtLoads.set(basePath, loadPromise);
    return loadPromise;
  }

  private loadSpriteFrameAt(resourcePath: string): Promise<SpriteFrame | null> {
    return new Promise((resolve) => {
      resources.load(resourcePath, SpriteFrame, (err, asset) => {
        if (err || !asset) {
          resolve(null);
          return;
        }
        resolve(asset);
      });
    });
  }

  private ensureUICameraVisibility(): void {
    const camera = this.node.getComponent(Camera);
    if (camera) {
      camera.visibility = 0xffffffff;
    }
  }

  private ensureCanvas(): Canvas | null {
    const existing = director.getScene()?.getComponentInChildren(Canvas) ?? null;
    if (existing) {
      return existing;
    }

    const scene = director.getScene();
    if (!scene) return null;

    const visibleSize = view.getVisibleSize();

    const canvasNode = new Node('Canvas');
    canvasNode.layer = Layers.Enum.UI_2D;
    canvasNode.setPosition(new Vec3(visibleSize.width / 2, visibleSize.height / 2, 0));

    const canvasTransform = canvasNode.addComponent(UITransform);
    canvasTransform.setContentSize(visibleSize.width, visibleSize.height);

    const canvas = canvasNode.addComponent(Canvas);
    canvas.alignCanvasWithScreen = true;

    // Create a dedicated UI camera (matches the pattern in Login/Game scenes)
    const cameraNode = new Node('Main Camera');
    cameraNode.layer = Layers.Enum.DEFAULT;
    cameraNode.setPosition(new Vec3(0, 0, 1000));

    const camera = cameraNode.addComponent(Camera);
    camera.visibility = 0xffffffff;
    camera.projection = Camera.ProjectionType.ORTHO;
    camera.orthoHeight = visibleSize.height / 2;
    camera.clearColor = new Color(0, 0, 0, 255);
    camera.clearFlags = Camera.ClearFlag.SOLID_COLOR;

    canvas.cameraComponent = camera;

    canvasNode.addChild(cameraNode);
    scene.addChild(canvasNode);

    return canvas;
  }

  private buildUI(canvas: Canvas): void {
    const canvasTransform = canvas.node.getComponent(UITransform);
    if (!canvasTransform) return;

    const width = canvasTransform.width;
    const height = canvasTransform.height;

    // Root
    const root = new Node('LevelUI');
    root.layer = Layers.Enum.UI_2D;
    root.addComponent(UITransform).setContentSize(width, height);
    canvas.node.addChild(root);

    // Background
    const bg = new Node('Background');
    bg.layer = Layers.Enum.UI_2D;
    bg.addComponent(UITransform).setContentSize(width, height);
    const bgG = bg.addComponent(Graphics);
    bgG.fillColor = color(28, 45, 75, 255);
    bgG.rect(-width / 2, -height / 2, width, height);
    bgG.fill();
    root.addChild(bg);

    // Top bar
    const topBarH = 120;
    const topBar = new Node('TopBar');
    topBar.layer = Layers.Enum.UI_2D;
    topBar.setPosition(0, height / 2 - topBarH / 2);
    topBar.addComponent(UITransform).setContentSize(width, topBarH);
    const topG = topBar.addComponent(Graphics);
    topG.fillColor = color(14, 24, 44, 255);
    topG.rect(-width / 2, -topBarH / 2, width, topBarH);
    topG.fill();
    root.addChild(topBar);

    const titleNode = new Node('Title');
    titleNode.layer = Layers.Enum.UI_2D;
    titleNode.setPosition(0, 0);
    titleNode.addComponent(UITransform).setContentSize(width, topBarH);
    const title = titleNode.addComponent(Label);
    title.string = '关卡选择';
    title.fontSize = 44;
    title.color = new Color(245, 245, 245, 255);
    title.horizontalAlign = Label.HorizontalAlign.CENTER;
    title.verticalAlign = Label.VerticalAlign.CENTER;
    topBar.addChild(titleNode);

    // Back button
    const backBtn = this.createRoundRectButton('返回', 140, 64, () => {
      director.loadScene('Login');
    });
    backBtn.setPosition(-width / 2 + 40 + 70, 0);
    topBar.addChild(backBtn);

    // ScrollView container
    const scrollW = Math.min(620, width * 0.92);
    const scrollH = height - topBarH - 80;

    const scrollNode = new Node('ScrollView');
    scrollNode.layer = Layers.Enum.UI_2D;
    scrollNode.setPosition(0, -topBarH / 2 - 20);
    scrollNode.addComponent(UITransform).setContentSize(scrollW, scrollH);

    const mask = scrollNode.addComponent(Mask);

    const scrollView = scrollNode.addComponent(ScrollView);
    scrollView.horizontal = false;
    scrollView.vertical = true;
    scrollView.inertia = true;
    scrollView.brake = 0.6;
    root.addChild(scrollNode);

    const content = new Node('Content');
    content.layer = Layers.Enum.UI_2D;
    const contentTransform = content.addComponent(UITransform);
    const paddingTop = 60;
    const paddingBottom = 120;
    const contentH = paddingTop + paddingBottom + (this.totalLevels - 1) * this.levelSpacingY + 240;
    contentTransform.setContentSize(scrollW, Math.max(scrollH, contentH));

    scrollNode.addChild(content);
    scrollView.content = content;

    const unlocked = LevelProgress.getUnlockedLevel(1);

    // Draw map path and place level nodes
    const pathNode = new Node('Path');
    pathNode.layer = Layers.Enum.UI_2D;
    pathNode.addComponent(UITransform).setContentSize(scrollW, contentTransform.height);
    const pathG = pathNode.addComponent(Graphics);
    pathG.lineWidth = 18;
    pathG.strokeColor = color(255, 240, 210, 220);
    content.addChild(pathNode);

    const points: { x: number; y: number }[] = [];
    for (let level = 1; level <= this.totalLevels; level++) {
      const p = this.getLevelPoint(level, scrollW, contentTransform.height, paddingTop);
      points.push(p);
    }

    if (points.length > 0) {
      pathG.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        pathG.lineTo(points[i].x, points[i].y);
      }
      pathG.stroke();
    }

    for (let level = 1; level <= this.totalLevels; level++) {
      const isLocked = level > unlocked;
      const p = points[level - 1];
      const node = this.createLevelNode(level, isLocked, LevelProgress.getStars(level));
      node.setPosition(p.x, p.y);
      content.addChild(node);
    }

    // Hint footer
    const hint = new Node('Hint');
    hint.layer = Layers.Enum.UI_2D;
    hint.setPosition(0, -height / 2 + 24);
    hint.addComponent(UITransform).setContentSize(width, 48);
    const hintLabel = hint.addComponent(Label);
    hintLabel.string = `已解锁：${unlocked} / ${this.totalLevels}`;
    hintLabel.fontSize = 24;
    hintLabel.color = new Color(230, 230, 230, 255);
    hintLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
    hintLabel.verticalAlign = Label.VerticalAlign.CENTER;
    root.addChild(hint);
  }

  private getLevelPoint(level: number, scrollW: number, contentH: number, paddingTop: number): { x: number; y: number } {
    const centerX = 0;
    const topY = contentH / 2 - paddingTop;
    const y = topY - (level - 1) * this.levelSpacingY;

    // Slightly curved “map” path
    const t = (level - 1) * this.pathWaveStep;
    const maxX = Math.max(40, Math.min(this.pathAmplitudeX, scrollW / 2 - 90));
    const x = centerX + Math.sin(t) * maxX;
    return { x, y };
  }

  private createLevelNode(level: number, locked: boolean, stars: number): Node {
    const radius = 54;
    const node = new Node(`Level_${level}`);
    node.layer = Layers.Enum.UI_2D;
    node.addComponent(UITransform).setContentSize(radius * 2 + 10, radius * 2 + 46);

    // Circle badge
    const badge = new Node('Badge');
    badge.layer = Layers.Enum.UI_2D;
    badge.addComponent(UITransform).setContentSize(radius * 2, radius * 2);
    const g = badge.addComponent(Graphics);
    g.fillColor = locked ? color(110, 110, 120, 255) : color(255, 208, 72, 255);
    g.strokeColor = locked ? color(160, 160, 170, 255) : color(255, 244, 220, 255);
    g.lineWidth = 8;
    g.circle(0, 0, radius);
    g.fill();
    g.stroke();
    node.addChild(badge);

    // Level number
    const numberNode = new Node('Number');
    numberNode.layer = Layers.Enum.UI_2D;
    numberNode.addComponent(UITransform).setContentSize(radius * 2, radius * 2);
    const numLabel = numberNode.addComponent(Label);
    numLabel.string = String(level);
    numLabel.fontSize = 42;
    numLabel.color = locked ? new Color(235, 235, 235, 255) : new Color(55, 35, 18, 255);
    numLabel.horizontalAlign = Label.HorizontalAlign.CENTER;
    numLabel.verticalAlign = Label.VerticalAlign.CENTER;
    badge.addChild(numberNode);

    // Stars under the badge
    const starsNode = new Node('Stars');
    starsNode.layer = Layers.Enum.UI_2D;
    starsNode.setPosition(0, -(radius + 24));
    starsNode.addComponent(UITransform).setContentSize(radius * 2 + 10, 40);
    const s = Math.max(0, Math.min(3, stars));
    node.addChild(starsNode);

    // Use temporary art sprites (loaded from assets/resources/temp_ai). No label fallback.
    const starIcons = new Node('StarIcons');
    starIcons.layer = Layers.Enum.UI_2D;
    starIcons.active = false;
    starIcons.addComponent(UITransform).setContentSize(radius * 2 + 10, 40);
    starsNode.addChild(starIcons);

    const starSprites: Sprite[] = [];
    const spacing = 28;
    for (let i = 0; i < 3; i++) {
      const sn = new Node(`Star_${i + 1}`);
      sn.layer = Layers.Enum.UI_2D;
      sn.setPosition((i - 1) * spacing, 0);
      sn.addComponent(UITransform).setContentSize(26, 26);
      starSprites.push(sn.addComponent(Sprite));
      starIcons.addChild(sn);
    }

    if (!locked) {
      void this.applyStarSprites(starIcons, starSprites, s);
    }

    if (locked) {
      const lockIcon = new Node('LockIcon');
      lockIcon.layer = Layers.Enum.UI_2D;
      lockIcon.active = false;
      lockIcon.setPosition(radius - 12, -radius + 12);
      lockIcon.addComponent(UITransform).setContentSize(40, 40);
      const lockSprite = lockIcon.addComponent(Sprite);
      badge.addChild(lockIcon);

      void this.applyLockSprite(lockSprite, lockIcon);
    }

    node.on(Node.EventType.TOUCH_END, () => {
      if (locked) {
        Toast('该关卡未解锁');
        return;
      }
      LevelProgress.setSelectedLevel(level);
      director.loadScene('Game');
    });

    return node;
  }

  private async applyLockSprite(lockSprite: Sprite, lockIconNode: Node): Promise<void> {
    const sf = await this.getSpriteFrameFromResources(this.tempArt.lockPath);
    if (!sf) return;
    lockSprite.spriteFrame = sf;
    lockIconNode.active = true;
  }

  private async applyStarSprites(starIcons: Node, starSprites: Sprite[], filledCount: number): Promise<void> {
    const [filled, empty] = await Promise.all([
      this.getSpriteFrameFromResources(this.tempArt.starFilledPath),
      this.getSpriteFrameFromResources(this.tempArt.starEmptyPath),
    ]);

    if (!filled || !empty) return;

    for (let i = 0; i < starSprites.length; i++) {
      starSprites[i].spriteFrame = i < filledCount ? filled : empty;
    }

    starIcons.active = true;
  }

  private createRoundRectButton(text: string, w: number, h: number, onClick: () => void): Node {
    const btn = new Node('Btn');
    btn.layer = Layers.Enum.UI_2D;
    btn.addComponent(UITransform).setContentSize(w, h);

    const g = btn.addComponent(Graphics);
    g.fillColor = color(69, 146, 255, 255);
    this.roundRect(g, -w / 2, -h / 2, w, h, 18);
    g.fill();

    const tNode = new Node('Label');
    tNode.layer = Layers.Enum.UI_2D;
    tNode.addComponent(UITransform).setContentSize(w, h);
    const label = tNode.addComponent(Label);
    label.string = text;
    label.fontSize = 28;
    label.color = new Color(255, 255, 255, 255);
    label.horizontalAlign = Label.HorizontalAlign.CENTER;
    label.verticalAlign = Label.VerticalAlign.CENTER;
    btn.addChild(tNode);

    btn.on(Node.EventType.TOUCH_END, onClick);
    return btn;
  }

  private roundRect(g: Graphics, x: number, y: number, w: number, h: number, r: number): void {
    const radius = Math.max(0, Math.min(r, Math.min(w, h) / 2));

    // Prefer engine built-in if available (some typings/environments may differ).
    const maybe = g as unknown as { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void };
    if (maybe.roundRect) {
      maybe.roundRect(x, y, w, h, radius);
      return;
    }

    // Manual path for maximum compatibility.
    g.moveTo(x + radius, y);
    g.lineTo(x + w - radius, y);
    g.arc(x + w - radius, y + radius, radius, -Math.PI / 2, 0, false);
    g.lineTo(x + w, y + h - radius);
    g.arc(x + w - radius, y + h - radius, radius, 0, Math.PI / 2, false);
    g.lineTo(x + radius, y + h);
    g.arc(x + radius, y + h - radius, radius, Math.PI / 2, Math.PI, false);
    g.lineTo(x, y + radius);
    g.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2, false);
    g.close();
  }
}
