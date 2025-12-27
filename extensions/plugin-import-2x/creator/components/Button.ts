'use strict';
import { ImporterBase } from "../common/base";

export const BUTTON = {
    "__type__": "cc.Button",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "clickEvents": [],
    "_interactable": true,
    "_transition": 0,
    "_normalColor": {
        "__type__": "cc.Color",
        "r": 214,
        "g": 214,
        "b": 214,
        "a": 255,
    },
    "_hoverColor": {
        "__type__": "cc.Color",
        "r": 211,
        "g": 211,
        "b": 211,
        "a": 255,
    },
    "_pressedColor": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "_disabledColor": {
        "__type__": "cc.Color",
        "r": 124,
        "g": 124,
        "b": 124,
        "a": 255,
    },
    "_normalSprite": null,
    "_hoverSprite": null,
    "_pressedSprite": null,
    "_disabledSprite": null,
    "_duration": 0.1,
    "_zoomScale": 1.2,
    "_target": null,
};

export class Button {

    static create() {
        return JSON.parse(JSON.stringify(BUTTON));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(BUTTON));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            switch (key) {
                case '_normalMaterial':
                case '_grayMaterial':
                case '_N$enableAutoGrayEffect':
                    break;
                case 'duration':
                    source._duration = value;
                    break;
                case 'zoomScale':
                    source._zoomScale = value;
                    break;
                case '_N$interactable':
                    source._interactable = value;
                    break;
                case '_N$transition':
                case 'transition':
                    source._transition = value;
                    break;
                case '_N$normalColor':
                    source._normalColor = value;
                    break;
                case '_N$pressedColor':
                case 'pressedColor':
                    source._pressedColor = value;
                    break;
                case '_N$hoverColor':
                case 'hoverColor':
                    source._hoverColor = value;
                    break;
                case '_N$disabledColor':
                    source._disabledColor = value;
                    break;
                case '_N$normalSprite':
                    source._normalSprite = {
                        __uuid__: await ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                    };
                    break;
                case '_N$pressedSprite':
                    source._pressedSprite = {
                        __uuid__: await ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                    };
                    break;
                case '_N$hoverSprite':
                    source._hoverSprite = {
                        __uuid__: await ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                    };
                    break;
                case '_N$disabledSprite':
                    source._disabledSprite = {
                        __uuid__: await ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                    };
                    break;
                case '_N$target':
                    source._target = value;
                    break;
                default:
                    source[key] = value;
                    break;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Button.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
