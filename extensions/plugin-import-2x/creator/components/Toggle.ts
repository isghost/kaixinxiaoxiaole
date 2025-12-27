'use strict';
export const TOGGLE = {
    "__type__": "cc.Toggle",
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
    "checkEvents": [],
    "_isChecked": true,
    "_checkMark": null,
};

export class Toggle {

    static create() {
        return JSON.parse(JSON.stringify(TOGGLE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(TOGGLE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'duration') {
                source._duration = value;
            }
            else if (key === 'zoomScale') {
                source._zoomScale = value;
            }
            else if (key === '_N$interactable') {
                source._interactable = value;
            }
            else if (key === '_N$transition' || key === 'transition') {
                source._transition = value;
            }
            else if (key === '_N$normalColor' || key === 'normalColor') {
                source._normalColor = value;
            }
            else if (key === '_N$pressedColor' || key === 'pressedColor') {
                source._pressedColor = value;
            }
            else if (key === '_N$hoverColor' || key === 'hoverColor') {
                source._hoverColor = value;
            }
            else if (key === '_N$disabledColor' || key === 'disabledColor') {
                source._disabledColor = value;
            }
            else if (key === '_N$normalSprite' || key === 'normalSprite') {
                source._normalSprite = value;
            }
            else if (key === '_N$pressedSprite' || key === 'pressedSprite') {
                source._pressedSprite = value;
            }
            else if (key === '_N$hoverSprite' || key === 'hoverSprite') {
                source._hoverSprite = value;
            }
            else if (key === '_N$disabledSprite' || key === 'disabledSprite') {
                source._disabledSprite = value;
            }
            else if (key === '_N$target' || key === 'target') {
                source._target = value;
            }
            else if (key === '_N$isChecked' || key === 'isChecked') {
                source._isChecked = value;
            }
            else if (key === 'checkMark') {
                source._checkMark = value;
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Toggle.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
