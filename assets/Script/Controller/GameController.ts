import { _decorator, Component, Node, AudioSource, find, Canvas, UITransform, Vec3, Label, Color, Graphics, director, tween, Widget, view, sys, BlockInputEvents } from 'cc';
const { ccclass, property } = _decorator;

import GameModel from "../Model/GameModel";
import { LevelConfig, LevelConfigService } from "../Model/Level/LevelConfig";
import { LevelSession } from "../Model/Level/LevelSession";
import { LevelState } from "../Model/Level/LevelState";
import { evaluateStarFormula } from "../Model/Level/LevelFormula";
import { LevelProgress } from "../Model/Level/LevelProgress";
import { GridView } from '../View/GridView';
import { Vec2 } from 'cc';
import { LevelSelectController } from './LevelSelectController';
import type { EffectCommand } from '../Model/GameModel';

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    public grid: Node | null = null;
    
    @property(AudioSource)
    public audioSource: AudioSource | null = null;
    
    private gameModel: GameModel | null = null;
    private levelConfig: LevelConfig | null = null;
    private levelState: LevelState | null = null;
    private isLevelEnded: boolean = false;
    private hudNode: Node | null = null;
    private scoreLabel: Label | null = null;
    private limitLabel: Label | null = null;
    private limitTitleLabel: Label | null = null;
    private resultPanel: Node | null = null;
    private resultLabel: Label | null = null;
    private resultStarsLabel: Label | null = null;
    private displayedScore: number = 0;
    private pendingResultPanel: { isWin: boolean } | null = null;

    private isPaused: boolean = false;
    private pauseButton: Node | null = null;
    private pausePanel: Node | null = null;
    private volumeLabel: Label | null = null;
    private volume: number = 1;

    onLoad(): void {
        const levelId = LevelSession.getSelectedLevelId(1);
        this.initLevel(levelId);
        
        // Find audio source from scene
        const gameSceneNode = find('Canvas/GameScene');
        if (gameSceneNode) {
            this.audioSource = gameSceneNode.getComponent(AudioSource);
        }

        this.restoreVolume();
        this.hideLegacyTopUI();
        this.ensurePauseButton();
        this.ensureHud();
    }

    private loadLevelSceneWithBootstrap(): void {
        director.loadScene('Level', () => {
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
    }

    private hideLegacyTopUI(): void {
        const scene = director.getScene();
        if (!scene) return;
        const canvas = scene.getComponentInChildren(Canvas);
        if (!canvas) return;

        const canvasNode = canvas.node;
        const labels = canvasNode.getComponentsInChildren(Label);
        for (const label of labels) {
            const text = (label.string || '').trim();
            if (text === '音乐播放/暂停' || text === '返回') {
                // Prefer disabling the container node to remove the whole legacy control.
                const container = label.node.parent && label.node.parent !== canvasNode ? label.node.parent : label.node;
                container.active = false;
            }
        }
    }

    private restoreVolume(): void {
        const raw = sys.localStorage.getItem('volume');
        const v = raw ? Number(raw) : 1;
        this.volume = Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 1;
        this.applyVolume(this.volume);
    }

    private applyVolume(v: number): void {
        const scene = director.getScene();
        if (!scene) return;
        const sources = scene.getComponentsInChildren(AudioSource);
        sources.forEach((s) => {
            s.volume = v;
        });
    }

    private setPaused(paused: boolean): void {
        this.isPaused = paused;
        const gridView = this.grid?.getComponent(GridView);
        gridView?.setPaused(paused);
    }

    private ensurePauseButton(): void {
        const scene = director.getScene();
        if (!scene) return;
        const canvas = scene.getComponentInChildren(Canvas);
        if (!canvas) return;
        const canvasNode = canvas.node;

        if (this.pauseButton && this.pauseButton.isValid) return;

        const btn = new Node('PauseButton');
        canvasNode.addChild(btn);
        btn.setPosition(new Vec3(0, 0, 0));
        const ui = btn.addComponent(UITransform);
        ui.setContentSize(60, 60);
        const widget = btn.addComponent(Widget);
        widget.isAlignTop = true;
        widget.isAlignRight = true;
        widget.top = 18;
        widget.right = 18;
        widget.target = canvasNode;

        const bg = btn.addComponent(Graphics);
        bg.fillColor = new Color(20, 20, 20, 190);
        bg.roundRect(-30, -30, 60, 60, 14);
        bg.fill();
        bg.strokeColor = new Color(255, 255, 255, 120);
        bg.lineWidth = 2;
        bg.roundRect(-30, -30, 60, 60, 14);
        bg.stroke();

        const icon = new Node('Icon');
        btn.addChild(icon);
        icon.setPosition(new Vec3(0, 0, 0));
        const ig = icon.addComponent(Graphics);
        ig.fillColor = new Color(255, 255, 255, 230);
        // pause bars
        ig.roundRect(-12, -14, 8, 28, 2);
        ig.roundRect(4, -14, 8, 28, 2);
        ig.fill();

        btn.on(Node.EventType.TOUCH_END, () => {
            this.showPausePanel(true);
        });

        this.pauseButton = btn;
    }

    private createPanelButton(parent: Node, name: string, y: number, text: string, iconDrawer: (g: Graphics) => void): Node {
        const btn = new Node(name);
        parent.addChild(btn);
        btn.setPosition(new Vec3(0, y, 0));
        const ui = btn.addComponent(UITransform);
        ui.setContentSize(360, 66);
        const bg = btn.addComponent(Graphics);
        bg.fillColor = new Color(30, 30, 45, 220);
        bg.roundRect(-180, -33, 360, 66, 14);
        bg.fill();
        bg.strokeColor = new Color(120, 170, 255, 120);
        bg.lineWidth = 2;
        bg.roundRect(-180, -33, 360, 66, 14);
        bg.stroke();

        const iconNode = new Node('Icon');
        btn.addChild(iconNode);
        iconNode.setPosition(new Vec3(-130, 0, 0));
        const ig = iconNode.addComponent(Graphics);
        ig.fillColor = new Color(255, 255, 255, 230);
        ig.strokeColor = new Color(255, 255, 255, 230);
        ig.lineWidth = 3;
        iconDrawer(ig);

        const labelNode = new Node('Text');
        btn.addChild(labelNode);
        labelNode.setPosition(new Vec3(-40, 0, 0));
        const label = labelNode.addComponent(Label);
        label.string = text;
        label.fontSize = 26;
        label.color = new Color(255, 255, 255, 255);
        label.horizontalAlign = Label.HorizontalAlign.LEFT;

        return btn;
    }

    private showPausePanel(show: boolean): void {
        if (show) {
            if (!this.pausePanel) {
                this.pausePanel = this.buildPausePanel();
            }
            this.pausePanel.active = true;
            this.setPaused(true);
            return;
        }
        if (this.pausePanel) {
            this.pausePanel.active = false;
        }
        this.setPaused(false);
    }

    private buildPausePanel(): Node {
        const scene = director.getScene();
        if (!scene) {
            const n = new Node('PausePanel');
            n.active = false;
            return n;
        }
        const canvas = scene.getComponentInChildren(Canvas);
        const canvasNode = canvas?.node;
        if (!canvasNode) {
            const n = new Node('PausePanel');
            n.active = false;
            return n;
        }

        const overlay = new Node('PausePanel');
        canvasNode.addChild(overlay);
        overlay.setSiblingIndex(9999);
        overlay.setPosition(new Vec3(0, 0, 0));
        overlay.addComponent(UITransform);
        const widget = overlay.addComponent(Widget);
        widget.isAlignTop = true;
        widget.isAlignBottom = true;
        widget.isAlignLeft = true;
        widget.isAlignRight = true;
        widget.top = 0;
        widget.bottom = 0;
        widget.left = 0;
        widget.right = 0;
        widget.target = canvasNode;
        overlay.addComponent(BlockInputEvents);

        const dim = overlay.addComponent(Graphics);
        dim.fillColor = new Color(0, 0, 0, 160);
        const visible = view.getVisibleSize();
        dim.rect(-visible.width / 2, -visible.height / 2, visible.width, visible.height);
        dim.fill();

        const panel = new Node('Panel');
        overlay.addChild(panel);
        panel.setPosition(new Vec3(0, 0, 0));
        const pui = panel.addComponent(UITransform);
        pui.setContentSize(440, 420);
        const pbg = panel.addComponent(Graphics);
        pbg.fillColor = new Color(20, 20, 30, 235);
        pbg.roundRect(-220, -210, 440, 420, 18);
        pbg.fill();
        pbg.strokeColor = new Color(120, 170, 255, 120);
        pbg.lineWidth = 2;
        pbg.roundRect(-220, -210, 440, 420, 18);
        pbg.stroke();

        const titleNode = new Node('Title');
        panel.addChild(titleNode);
        titleNode.setPosition(new Vec3(0, 150, 0));
        const title = titleNode.addComponent(Label);
        title.string = '已暂停';
        title.fontSize = 34;
        title.color = new Color(255, 255, 255, 255);

        // Volume row
        const volRow = new Node('VolumeRow');
        panel.addChild(volRow);
        volRow.setPosition(new Vec3(0, 80, 0));
        volRow.addComponent(UITransform).setContentSize(420, 60);

        const volIcon = new Node('VolumeIcon');
        volRow.addChild(volIcon);
        volIcon.setPosition(new Vec3(-170, 0, 0));
        const vg = volIcon.addComponent(Graphics);
        vg.fillColor = new Color(255, 255, 255, 220);
        vg.strokeColor = new Color(255, 255, 255, 220);
        vg.lineWidth = 3;
        // speaker
        vg.moveTo(-10, -8);
        vg.lineTo(-2, -8);
        vg.lineTo(8, -16);
        vg.lineTo(8, 16);
        vg.lineTo(-2, 8);
        vg.lineTo(-10, 8);
        vg.close();
        vg.fill();
        vg.stroke();
        // waves
        vg.arc(10, 0, 10, -0.8, 0.8, false);
        vg.stroke();

        const volTextNode = new Node('VolumeText');
        volRow.addChild(volTextNode);
        volTextNode.setPosition(new Vec3(-70, 0, 0));
        const volText = volTextNode.addComponent(Label);
        volText.string = '音量';
        volText.fontSize = 26;
        volText.color = new Color(255, 255, 255, 255);
        volText.horizontalAlign = Label.HorizontalAlign.LEFT;

        const minusBtn = new Node('VolMinus');
        volRow.addChild(minusBtn);
        minusBtn.setPosition(new Vec3(90, 0, 0));
        minusBtn.addComponent(UITransform).setContentSize(56, 56);
        const mg = minusBtn.addComponent(Graphics);
        mg.fillColor = new Color(30, 30, 45, 220);
        mg.roundRect(-28, -28, 56, 56, 14);
        mg.fill();
        mg.strokeColor = new Color(120, 170, 255, 120);
        mg.lineWidth = 2;
        mg.roundRect(-28, -28, 56, 56, 14);
        mg.stroke();
        const minusIcon = new Node('Icon');
        minusBtn.addChild(minusIcon);
        const mig = minusIcon.addComponent(Graphics);
        mig.strokeColor = new Color(255, 255, 255, 230);
        mig.lineWidth = 5;
        mig.moveTo(-12, 0);
        mig.lineTo(12, 0);
        mig.stroke();

        const plusBtn = new Node('VolPlus');
        volRow.addChild(plusBtn);
        plusBtn.setPosition(new Vec3(160, 0, 0));
        plusBtn.addComponent(UITransform).setContentSize(56, 56);
        const pg = plusBtn.addComponent(Graphics);
        pg.fillColor = new Color(30, 30, 45, 220);
        pg.roundRect(-28, -28, 56, 56, 14);
        pg.fill();
        pg.strokeColor = new Color(120, 170, 255, 120);
        pg.lineWidth = 2;
        pg.roundRect(-28, -28, 56, 56, 14);
        pg.stroke();
        const plusIcon = new Node('Icon');
        plusBtn.addChild(plusIcon);
        const pig = plusIcon.addComponent(Graphics);
        pig.strokeColor = new Color(255, 255, 255, 230);
        pig.lineWidth = 5;
        pig.moveTo(-12, 0);
        pig.lineTo(12, 0);
        pig.moveTo(0, -12);
        pig.lineTo(0, 12);
        pig.stroke();

        const percentNode = new Node('VolumePercent');
        volRow.addChild(percentNode);
        percentNode.setPosition(new Vec3(20, -40, 0));
        const percent = percentNode.addComponent(Label);
        percent.fontSize = 20;
        percent.color = new Color(200, 220, 255, 255);
        this.volumeLabel = percent;
        this.refreshVolumeLabel();

        minusBtn.on(Node.EventType.TOUCH_END, () => {
            this.setVolume(this.volume - 0.1);
        });
        plusBtn.on(Node.EventType.TOUCH_END, () => {
            this.setVolume(this.volume + 0.1);
        });

        // Buttons
        const btnHome = this.createPanelButton(panel, 'BtnHome', -20, '返回主页', (g) => {
            // house
            g.moveTo(-12, -2);
            g.lineTo(0, 12);
            g.lineTo(12, -2);
            g.stroke();
            g.rect(-10, -18, 20, 16);
            g.stroke();
        });

        const btnContinue = this.createPanelButton(panel, 'BtnContinue', -100, '继续游戏', (g) => {
            // play triangle
            g.moveTo(-6, -14);
            g.lineTo(16, 0);
            g.lineTo(-6, 14);
            g.close();
            g.fill();
        });

        btnHome.on(Node.EventType.TOUCH_END, () => {
            this.setPaused(false);
            director.loadScene('Login');
        });
        btnContinue.on(Node.EventType.TOUCH_END, () => {
            this.showPausePanel(false);
        });

        overlay.active = false;
        return overlay;
    }

    private refreshVolumeLabel(): void {
        if (!this.volumeLabel) return;
        this.volumeLabel.string = `当前：${Math.round(this.volume * 100)}%`;
    }

    private setVolume(v: number): void {
        const next = Math.min(1, Math.max(0, v));
        this.volume = next;
        sys.localStorage.setItem('volume', String(next));
        this.applyVolume(next);
        this.refreshVolumeLabel();
    }

    private async initLevel(levelId: number): Promise<void> {
        try {
            const levelConfig = await LevelConfigService.getById(levelId);
            this.levelConfig = levelConfig || null;
            this.levelState = levelConfig ? new LevelState(levelConfig.data) : null;
            this.isLevelEnded = false;
            this.displayedScore = 0;

            this.gameModel = new GameModel();
            this.gameModel.init(levelConfig, 4);

            if (this.grid) {
                var gridScript = this.grid.getComponent(GridView);
                if (gridScript) {
                    gridScript.setController(this);
                    gridScript.initWithCellModels(
                        this.gameModel.getCells(),
                        this.gameModel.getGridSize(),
                        this.gameModel.getMask()
                    );
                    gridScript.setPaused(this.isPaused);
                } else {
                    console.error("GameController.onLoad: GridView component NOT found on grid node!");
                }
            } else {
                console.error("GameController.onLoad: Grid node is NULL!");
            }

            // Fix HUD title text after async init
            if (this.limitTitleLabel) {
                this.updateLimitTitle(this.limitTitleLabel);
            }
            this.updateHud();
        } catch (error) {
            console.error('Failed to init level:', error);
        }
    }

    selectCell(pos: Vec2): any {
        if (!this.gameModel) {
            console.error("GameController.selectCell: No game model!");
            return null;
        }
        if (this.isLevelEnded || this.isPaused) {
            return [[], []];
        }
        
        const result = this.gameModel.selectCell(pos);
        if (result) {
            this.updateLevelState(result[0], result[1]);
        }
        return result;
    }

    cleanCmd(): void {
        if (this.gameModel) {
            this.gameModel.cleanCmd();
        }
    }

    update(dt: number): void {
        if (!this.levelState) return;
        // Even after the level ends, keep HUD/score animating until result is shown.
        if (!this.isLevelEnded && !this.isPaused) {
            this.levelState.tick(dt);
            this.checkLevelEnd();
        }
        this.updateScoreAnimation(dt);
        this.updateHud();
    }

    private updateScoreAnimation(dt: number): void {
        if (!this.levelState) return;
        const targetScore = this.levelState.score;
        if (this.displayedScore < targetScore) {
            // Animate score increase over time
            const scoreDiff = targetScore - this.displayedScore;
            const increment = Math.max(1, Math.ceil(scoreDiff * dt * 5)); // 5 = animation speed
            this.displayedScore = Math.min(targetScore, this.displayedScore + increment);
        }
    }

    private updateLevelState(changeModels: any[], effectsQueue: EffectCommand[]): void {
        if (!this.levelState) return;

        if (changeModels && changeModels.length > 0) {
            this.levelState.useMove();
        }

        this.scheduleScoreFromEffects(effectsQueue || []);
    }

    private scheduleScoreFromEffects(effectsQueue: EffectCommand[]): void {
        if (!this.levelState || !effectsQueue || effectsQueue.length === 0) return;

        const crushes = effectsQueue.filter((cmd) => cmd.action === 'crush');
        if (crushes.length === 0) return;

        // Group by elimination "step" (i.e., cascade index) so one move with multiple cascades
        // produces multiple score updates.
        const groups = new Map<number, { count: number; at: number }>();
        for (const cmd of crushes) {
            const step = typeof cmd.step === 'number' ? cmd.step : 0;
            const at = Math.max(0, Number(cmd.playTime || 0));
            const g = groups.get(step);
            if (!g) {
                groups.set(step, { count: 1, at });
            } else {
                g.count += 1;
                g.at = Math.min(g.at, at);
            }
        }

        const sorted = Array.from(groups.entries())
            .map(([step, v]) => ({ step, ...v }))
            .sort((a, b) => a.at - b.at || a.step - b.step);

        for (const g of sorted) {
            this.scheduleOnce(() => {
                if (!this.levelState) return;
                // 10 points per crushed cell (same as previous behavior, just split per step)
                this.levelState.addScore(g.count * 10);
                // Re-check end condition after each batch of score is applied.
                this.checkLevelEnd();
            }, g.at);
        }
    }

    private checkLevelEnd(): void {
        if (!this.levelState || this.isLevelEnded) return;

        if (this.levelState.isWin()) {
            this.isLevelEnded = true;
            this.saveLevelProgress(true);
            this.scheduleResultPanel(true);
            return;
        }

        if (this.levelState.isLose()) {
            this.isLevelEnded = true;
            this.saveLevelProgress(false);
            this.scheduleResultPanel(false);
        }
    }

    private scheduleResultPanel(isWin: boolean): void {
        // Wait until GridView reports animations finished.
        this.pendingResultPanel = { isWin };
        const gridView = this.grid?.getComponent(GridView);
        if (!gridView) {
            this.showResultPanel(isWin);
            return;
        }

        const tryShow = (): void => {
            if (!this.pendingResultPanel) return;
            if (gridView.isAnimating()) return;

            // Small extra delay to avoid showing panel mid-frame.
            this.scheduleOnce(() => {
                if (!this.pendingResultPanel) return;
                this.showResultPanel(this.pendingResultPanel.isWin);
                this.pendingResultPanel = null;
                this.unschedule(tryShow);
            }, 0.05);
        };

        // Poll while animations are playing.
        this.schedule(tryShow, 0.05);
        // Ensure we stop polling after showing.
        this.scheduleOnce(() => {
            this.unschedule(tryShow);
            tryShow();
        }, 10);
    }

    private saveLevelProgress(isWin: boolean): void {
        if (!isWin || !this.levelState || !this.levelConfig) return;

        const levelId = this.levelConfig.data.id;
        const stars = evaluateStarFormula(this.levelConfig.data.starFormula, {
            score: this.levelState.score,
            stepsLeft: this.levelState.stepsLeft,
            timeLeft: this.levelState.timeLeft,
            target: this.levelState.target
        });
        const progress = LevelProgress.load();
        progress.setStars(levelId, stars);
    }

    private ensureHud(): void {
        const scene = director.getScene();
        if (!scene) return;
        const canvas = scene.getComponentInChildren(Canvas);
        if (!canvas) return;

        const canvasNode = canvas.node;
        if (!this.hudNode) {
            const hud = new Node('GameHUD');
            canvasNode.addChild(hud);
            const hudTransform = hud.addComponent(UITransform);
            const visible = view.getVisibleSize();
            hudTransform.setContentSize(Math.max(520, visible.width * 0.92), 96);
            hud.setPosition(new Vec3(0, 0, 0));

            const widget = hud.addComponent(Widget);
            widget.isAlignTop = true;
            widget.isAlignHorizontalCenter = true;
            // Leave room for the pause button/top safe area.
            widget.top = 96;
            widget.horizontalCenter = 0;
            widget.target = canvasNode;

            const w = hudTransform.width;
            const h = hudTransform.height;
            const halfW = w / 2;
            const halfH = h / 2;

            // Background with gradient-like appearance using multiple layers
            const bgOuter = hud.addComponent(Graphics);
            bgOuter.fillColor = new Color(25, 25, 35, 220);
            bgOuter.roundRect(-halfW, -halfH, w, h, 18);
            bgOuter.fill();
            bgOuter.strokeColor = new Color(120, 170, 255, 160);
            bgOuter.lineWidth = 2;
            bgOuter.roundRect(-halfW, -halfH, w, h, 18);
            bgOuter.stroke();

            // Score section (left side)
            const scoreBgNode = new Node('ScoreBg');
            hud.addChild(scoreBgNode);
            scoreBgNode.setPosition(new Vec3(-w * 0.25, 0, 0));
            const scoreBgTransform = scoreBgNode.addComponent(UITransform);
            scoreBgTransform.setContentSize(w * 0.45, 64);
            const scoreBg = scoreBgNode.addComponent(Graphics);
            scoreBg.fillColor = new Color(55, 60, 80, 180);
            scoreBg.roundRect(-scoreBgTransform.width / 2, -32, scoreBgTransform.width, 64, 12);
            scoreBg.fill();

            const scoreTitleNode = new Node('ScoreTitle');
            hud.addChild(scoreTitleNode);
            scoreTitleNode.setPosition(new Vec3(-w * 0.43, 18, 0));
            const scoreTitleLabel = scoreTitleNode.addComponent(Label);
            scoreTitleLabel.string = '分数';
            scoreTitleLabel.fontSize = 18;
            scoreTitleLabel.color = new Color(180, 200, 255, 255);

            const scoreNode = new Node('ScoreLabel');
            hud.addChild(scoreNode);
            scoreNode.setPosition(new Vec3(-w * 0.25, -10, 0));
            const scoreLabel = scoreNode.addComponent(Label);
            scoreLabel.fontSize = 30;
            scoreLabel.color = new Color(255, 220, 100, 255);
            this.scoreLabel = scoreLabel;

            // Limit section (right side)
            const limitBgNode = new Node('LimitBg');
            hud.addChild(limitBgNode);
            limitBgNode.setPosition(new Vec3(w * 0.25, 0, 0));
            const limitBgTransform = limitBgNode.addComponent(UITransform);
            limitBgTransform.setContentSize(w * 0.45, 64);
            const limitBg = limitBgNode.addComponent(Graphics);
            limitBg.fillColor = new Color(55, 60, 80, 180);
            limitBg.roundRect(-limitBgTransform.width / 2, -32, limitBgTransform.width, 64, 12);
            limitBg.fill();

            const limitTitleNode = new Node('LimitTitle');
            hud.addChild(limitTitleNode);
            limitTitleNode.setPosition(new Vec3(w * 0.07, 18, 0));
            const limitTitleLabel = limitTitleNode.addComponent(Label);
            limitTitleLabel.fontSize = 18;
            limitTitleLabel.color = new Color(180, 200, 255, 255);
            limitTitleLabel.string = '步数';
            this.limitTitleLabel = limitTitleLabel;
            this.updateLimitTitle(limitTitleLabel);

            const limitNode = new Node('LimitLabel');
            hud.addChild(limitNode);
            limitNode.setPosition(new Vec3(w * 0.25, -10, 0));
            const limitLabel = limitNode.addComponent(Label);
            limitLabel.fontSize = 30;
            limitLabel.color = new Color(255, 255, 255, 255);
            this.limitLabel = limitLabel;

            this.hudNode = hud;
        }
        this.updateHud();
    }

    private updateLimitTitle(label: Label): void {
        if (!this.levelState) return;
        label.string = this.levelState.mode === 'time' ? '时间' : '步数';
    }

    private updateHud(): void {
        if (!this.levelState || !this.scoreLabel || !this.limitLabel) return;
        // Use animated score display
        this.scoreLabel.string = `${Math.floor(this.displayedScore)}`;
        if (this.levelState.mode === 'time') {
            const timeLeft = Math.ceil(this.levelState.timeLeft);
            this.limitLabel.string = `${timeLeft}s`;
            // Change color when time is running low
            if (timeLeft <= 10) {
                this.limitLabel.color = new Color(255, 100, 100, 255);
            } else {
                this.limitLabel.color = new Color(255, 255, 255, 255);
            }
        } else {
            this.limitLabel.string = `${this.levelState.stepsLeft}`;
            // Change color when steps are running low
            if (this.levelState.stepsLeft <= 3) {
                this.limitLabel.color = new Color(255, 100, 100, 255);
            } else {
                this.limitLabel.color = new Color(255, 255, 255, 255);
            }
        }
    }

    private showResultPanel(isWin: boolean): void {
        const scene = director.getScene();
        if (!scene) return;
        const canvas = scene.getComponentInChildren(Canvas);
        if (!canvas) return;

        const canvasNode = canvas.node;
        if (!this.resultPanel) {
            const panel = new Node('ResultPanel');
            canvasNode.addChild(panel);
            panel.setPosition(new Vec3(0, 0, 0));
            const panelTransform = panel.addComponent(UITransform);
            panelTransform.setContentSize(520, 320);
            const bg = panel.addComponent(Graphics);
            bg.fillColor = new Color(0, 0, 0, 200);
            bg.roundRect(-260, -160, 520, 320, 16);
            bg.fill();

            const titleNode = new Node('ResultTitle');
            panel.addChild(titleNode);
            titleNode.setPosition(new Vec3(0, 100, 0));
            const titleLabel = titleNode.addComponent(Label);
            titleLabel.fontSize = 36;
            titleLabel.color = new Color(255, 255, 255, 255);
            this.resultLabel = titleLabel;

            const starsNode = new Node('ResultStars');
            panel.addChild(starsNode);
            starsNode.setPosition(new Vec3(0, 40, 0));
            const starsLabel = starsNode.addComponent(Label);
            starsLabel.fontSize = 30;
            starsLabel.color = new Color(255, 215, 0, 255);
            this.resultStarsLabel = starsLabel;

            const backNode = new Node('ResultBack');
            panel.addChild(backNode);
            backNode.setPosition(new Vec3(-100, -90, 0));
            const backLabel = backNode.addComponent(Label);
            backLabel.string = '返回关卡';
            backLabel.fontSize = 28;
            backLabel.color = new Color(255, 255, 255, 255);
            backNode.on(Node.EventType.TOUCH_END, () => {
                this.loadLevelSceneWithBootstrap();
            });

            const nextNode = new Node('ResultNext');
            panel.addChild(nextNode);
            nextNode.setPosition(new Vec3(120, -90, 0));
            const nextLabel = nextNode.addComponent(Label);
            nextLabel.string = '下一关';
            nextLabel.fontSize = 26;
            nextLabel.color = new Color(255, 255, 255, 255);
            nextNode.on(Node.EventType.TOUCH_END, async () => {
                if (!this.levelConfig) {
                    this.loadLevelSceneWithBootstrap();
                    return;
                }
                const nextId = this.levelConfig.data.id + 1;
                const nextConfig = await LevelConfigService.getById(nextId);
                if (!nextConfig) {
                    this.loadLevelSceneWithBootstrap();
                    return;
                }
                LevelSession.setSelectedLevelId(nextId);
                director.loadScene('Game');
            });

            this.resultPanel = panel;
        }

        if (this.resultLabel) {
            this.resultLabel.string = isWin ? '通关成功' : '通关失败';
        }

        if (this.resultStarsLabel && this.levelConfig && this.levelState) {
            const stars = isWin
                ? evaluateStarFormula(this.levelConfig.data.starFormula, {
                    score: this.levelState.score,
                    stepsLeft: this.levelState.stepsLeft,
                    timeLeft: this.levelState.timeLeft,
                    target: this.levelState.target
                })
                : 0;
            this.resultStarsLabel.string = '★'.repeat(stars) + '☆'.repeat(3 - stars);
        }

        if (this.resultPanel) {
            this.resultPanel.active = true;
        }
    }

}
