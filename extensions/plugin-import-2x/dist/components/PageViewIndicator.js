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
exports.PageViewIndicator = exports.PAGEVIEWINDICATOR = void 0;
const base_1 = require("../common/base");
exports.PAGEVIEWINDICATOR = {
    "__type__": "cc.PageViewIndicator",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "spacing": 0,
    "_spriteFrame": null,
    "_direction": 0,
    "_cellSize": {
        "__type__": "cc.Size",
        "width": 20,
        "height": 20,
    },
};
class PageViewIndicator {
    static create() {
        return JSON.parse(JSON.stringify(exports.PAGEVIEWINDICATOR));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.PAGEVIEWINDICATOR));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'spriteFrame') {
                    source._spriteFrame = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                    };
                }
                else if (key === 'cellSize') {
                    source._cellSize = value;
                }
                else if (key === 'direction') {
                    source._direction = value;
                }
                else {
                    source[key] = value;
                }
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield PageViewIndicator.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.PageViewIndicator = PageViewIndicator;
