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
exports.LabelShadow = exports.LABELSHADOW = void 0;
const utlis_1 = require("../common/utlis");
exports.LABELSHADOW = {
    "__type__": "cc.LabelShadow",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_color": {
        "__type__": "cc.Color",
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 255,
    },
    "_offset": {
        "__type__": "cc.Vec2",
        "x": 2,
        "y": 2,
    },
    "_blur": 2,
};
class LabelShadow {
    static create() {
        return JSON.parse(JSON.stringify(exports.LABELSHADOW));
    }
    static migrate(json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.LABELSHADOW));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'node') {
                    source.node = value;
                    (0, utlis_1.setColor)(source, value.__id__, json2D);
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
            const source = yield LabelShadow.migrate(json2D[index], json3D);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.LabelShadow = LabelShadow;
