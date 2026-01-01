import {
    _decorator,
    Component,
    Node,
    AudioSource,
    find,
    Vec2,
    director,
    Layers,
    UITransform,
    view,
    Graphics,
    Label,
    Color,
    Vec3,
} from 'cc';
const { ccclass, property } = _decorator;

import GameModel, { EffectCommand } from "../Model/GameModel";
import Toast from '../Utils/Toast';
import { GridView } from '../View/GridView';
import type CellModel from '../Model/CellModel';
import { logDebug, logError } from '../Utils/Debug';

@ccclass('GameController')
export class GameController extends Component {
    @property(Node)
    public grid: Node | null = null;
    
    @property(Node)
    public audioButton: Node | null = null;
    
    @property(AudioSource)
    public audioSource: AudioSource | null = null;
    
    private gameModel: GameModel | null = null;

    onLoad(): void {
        logDebug("GameController.onLoad: Starting initialization");

        this.ensureReturnHomeButton();
        
        if (this.node.parent) {
            let audioButton = this.node.parent.getChildByName('audioButton');
            if (audioButton) {
                audioButton.on('click', this.callback, this);
                logDebug("GameController.onLoad: Audio button listener registered");
            }
        }
        
        this.gameModel = new GameModel();
        this.gameModel.init(4);
        logDebug("GameController.onLoad: GameModel initialized");
        
        if (this.grid) {
            logDebug("GameController.onLoad: Grid node found");
            var gridScript = this.grid.getComponent(GridView);
            if (gridScript) {
                logDebug("GameController.onLoad: GridView component found");
                gridScript.setController(this);
                gridScript.initWithCellModels(this.gameModel.getCells());
                logDebug("GameController.onLoad: GridView initialized with models");
            } else {
                logError("GameController.onLoad: GridView component NOT found on grid node!");
            }
        } else {
            logError("GameController.onLoad: Grid node is NULL!");
        }
        
        // Find audio source from scene
        const gameSceneNode = find('Canvas/GameScene');
        if (gameSceneNode) {
            this.audioSource = gameSceneNode.getComponent(AudioSource);
            logDebug(`GameController.onLoad: Audio source ${this.audioSource ? 'found' : 'not found'}`);
        }
        
        logDebug("GameController.onLoad: Initialization complete");
    }

    private ensureReturnHomeButton(): void {
        const canvasNode = find('Canvas');
        if (!canvasNode) {
            logError('GameController.ensureReturnHomeButton: Canvas not found');
            return;
        }

        const existing = canvasNode.getChildByName('returnHomeButton');
        if (existing) {
            return;
        }

        const visibleSize = view.getVisibleSize();
        const width = visibleSize.width;
        const height = visibleSize.height;

        const btn = this.createRoundRectButton('返回', 140, 64, () => {
            director.loadScene('Level');
        });
        btn.name = 'returnHomeButton';
        btn.layer = Layers.Enum.UI_2D;
        btn.setPosition(new Vec3(-width / 2 + 40 + 70, height / 2 - 40 - 32, 0));

        canvasNode.addChild(btn);
    }

    private createRoundRectButton(text: string, w: number, h: number, onClick: () => void): Node {
        const btn = new Node('Btn');
        btn.layer = Layers.Enum.UI_2D;
        btn.addComponent(UITransform).setContentSize(w, h);

        const g = btn.addComponent(Graphics);
        g.fillColor = new Color(69, 146, 255, 255);
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

        const maybe = g as unknown as { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void };
        if (maybe.roundRect) {
            maybe.roundRect(x, y, w, h, radius);
            return;
        }

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

    callback(): void {
        if (!this.audioSource) return;
        
        // In Cocos 3.x, check if audio is playing
        const isPlaying = this.audioSource.playing;
        if (isPlaying) {
            this.audioSource.pause();
            Toast('关闭背景音乐🎵');
        } else {
            this.audioSource.play();
            Toast('打开背景音乐🎵');
        }
    }

    selectCell(pos: Vec2): [CellModel[], EffectCommand[]] | null {
        logDebug(`GameController.selectCell: Called with position (${pos.x}, ${pos.y})`);
        
        if (!this.gameModel) {
            logError("GameController.selectCell: No game model!");
            return null;
        }
        
        const result = this.gameModel.selectCell(pos);
        logDebug(`GameController.selectCell: Returning result with ${result[0].length} models`);
        return result;
    }

    cleanCmd(): void {
        if (this.gameModel) {
            this.gameModel.cleanCmd();
        }
    }

}
