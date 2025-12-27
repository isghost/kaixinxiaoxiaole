

import { Component, ccenum, _decorator, SpriteFrame, CCFloat } from 'cc';
const { ccclass, type, property } = _decorator;

export enum ComponentType {
    NONE = 0,
    CHECKBOX = 1,
    TEXT_ATLAS = 2,
    SLIDER_BAR = 3,
    LIST_VIEW = 4,
    PAGE_VIEW = 5,
}
ccenum(ComponentType);

export enum ListDirection {
    VERTICAL = 0,
    HORIZONTAL = 1,
}
ccenum(ListDirection);

export enum VerticalAlign {
    TOP = 0,
    CENTER = 1,
    BOTTOM = 2,
}
ccenum(VerticalAlign);

export enum HorizontalAlign {
    LEFT = 0,
    CENTER = 1,
    RIGHT = 2,
}
ccenum(HorizontalAlign);

@ccclass('StudioComponent')
export class StudioComponent extends Component {

    static ComponentType: ComponentType;
    static ListDirection: ListDirection;
    static VerticalAlign: VerticalAlign;
    static HorizontalAlign: HorizontalAlign;

    private _type: ComponentType = ComponentType.NONE;
    private _checkNormalBackFrame: SpriteFrame | null = null;
    private _checkPressedBackFrame: SpriteFrame | null = null;
    private _checkDisableBackFrame: SpriteFrame | null = null;
    private _checkNormalFrame: SpriteFrame | null = null;
    private _checkDisableFrame: SpriteFrame | null = null;
    private _atlasFrame: SpriteFrame | null = null;
    private _sliderBackFrame: SpriteFrame | null = null;
    private _sliderBarFrame: SpriteFrame | null = null;
    private _sliderBtnNormalFrame: SpriteFrame | null = null;
    private _sliderBtnPressedFrame: SpriteFrame | null = null;
    private _sliderBtnDisabledFrame: SpriteFrame | null = null;

    @property
    @type(ComponentType)
    get type(): ComponentType {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    // props for checkbox
    @property
    @type(SpriteFrame)
    get checkNormalBackFrame(): SpriteFrame | null {
        return this._checkNormalBackFrame;
    }

    set checkNormalBackFrame(value) {
        this._checkNormalBackFrame = value;
    }

    @property
    @type(SpriteFrame)
    get checkPressedBackFrame(): SpriteFrame | null {
        return this._checkPressedBackFrame;
    }

    set checkPressedBackFrame(value) {
        this._checkPressedBackFrame = value;
    }

    @property
    @type(SpriteFrame)
    get checkDisableBackFrame(): SpriteFrame | null {
        return this._checkDisableBackFrame;
    }

    set checkDisableBackFrame(value) {
        this._checkDisableBackFrame = value;
    }

    @property
    @type(SpriteFrame)
    get checkNormalFrame(): SpriteFrame | null {
        return this._checkNormalFrame;
    }

    set checkNormalFrame(value) {
        this._checkNormalFrame = value;
    }

    @property
    @type(SpriteFrame)
    get checkDisableFrame(): SpriteFrame | null {
        return this._checkDisableFrame;
    }

    set checkDisableFrame(value) {
        this._checkDisableFrame = value;
    }

    @property
    public checkInteractable = true;
    @property
    public isChecked = true;

    // props for TextAtlas
    @property
    @type(SpriteFrame)
    get atlasFrame(): SpriteFrame | null {
        return this._atlasFrame;
    }

    set atlasFrame(value) {
        this._atlasFrame = value;
    }

    @property
    public firstChar = '.';
    @property
    public charWidth = 0;
    @property
    public charHeight = 0;
    @property
    public string = '';

    // props for SliderBar
    @property
    @type(SpriteFrame)
    get sliderBackFrame(): SpriteFrame | null {
        return this._sliderBackFrame;
    }

    set sliderBackFrame(value) {
        this._sliderBackFrame = value;
    }

    @property
    @type(SpriteFrame)
    get sliderBarFrame(): SpriteFrame | null {
        return this._sliderBarFrame;
    }

    set sliderBarFrame(value) {
        this._sliderBarFrame = value;
    }

    @property
    @type(SpriteFrame)
    get sliderBtnNormalFrame(): SpriteFrame | null {
        return this._sliderBtnNormalFrame;
    }

    set sliderBtnNormalFrame(value) {
        this._sliderBtnNormalFrame = value;
    }

    @property
    @type(SpriteFrame)
    get sliderBtnPressedFrame(): SpriteFrame | null {
        return this._sliderBtnPressedFrame;
    }

    set sliderBtnPressedFrame(value) {
        this._sliderBtnPressedFrame = value;
    }

    @property
    @type(SpriteFrame)
    get sliderBtnDisabledFrame(): SpriteFrame | null {
        return this._sliderBtnDisabledFrame;
    }

    set sliderBtnDisabledFrame(value) {
        this._sliderBtnDisabledFrame = value;
    }

    @property
    public sliderInteractable = true;

    @property
    @type(CCFloat)
    public sliderProgress = 0.5;

    // props for ListView
    @property
    public listInertia = true;

    // props for ListView
    @property
    @type(ListDirection)
    public listDirection = ListDirection.VERTICAL;

    @property
    @type(HorizontalAlign)
    public listHorizontalAlign = HorizontalAlign.LEFT;

    @property
    @type(VerticalAlign)
    public listVerticalAlign = VerticalAlign.TOP;

    @property
    public listPadding = 0;
}
