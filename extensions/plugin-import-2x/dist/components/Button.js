'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = exports.BUTTON = void 0;
const base_1 = require("../common/base");
exports.BUTTON = {
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
class Button {
    static create() {
        return JSON.parse(JSON.stringify(exports.BUTTON));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.BUTTON));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
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
                            __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                        };
                        break;
                    case '_N$pressedSprite':
                        source._pressedSprite = {
                            __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                        };
                        break;
                    case '_N$hoverSprite':
                        source._hoverSprite = {
                            __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                        };
                        break;
                    case '_N$disabledSprite':
                        source._disabledSprite = {
                            __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
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
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield Button.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Button = Button;
