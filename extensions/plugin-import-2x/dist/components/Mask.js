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
exports.Mask = exports.MASK = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
exports.MASK = {
    "__type__": "cc.Mask",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_materials": [],
    "_visFlags": 0,
    "_srcBlendFactor": 2,
    "_dstBlendFactor": 4,
    "_color": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "_type": 0,
    "_inverted": false,
    "_segments": 64,
    "_spriteFrame": null,
    "_alphaThreshold": 0.1,
};
class Mask {
    static typeTo2D(type) {
        switch (type) {
            case 2: // IMAGE_STENCIL
                return 3; // IMAGE_STENCIL
        }
        return type;
    }
    static create() {
        return JSON.parse(JSON.stringify(exports.MASK));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.MASK));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'node') {
                    source.node = value;
                    (0, utlis_1.setColor)(source, value.__id__, json2D);
                }
                else if (key === '_type') {
                    source._type = Mask.typeTo2D(value);
                }
                else if (key === '_N$alphaThreshold') {
                    source._alphaThreshold = value;
                }
                else if (key === '_spriteFrame') {
                    source._spriteFrame = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                    };
                }
                else if (key === '_N$inverted') {
                    source._inverted = value;
                }
                else if (key === '_srcBlendFactor') {
                    source._srcBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else if (key === '_dstBlendFactor') {
                    source._dstBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else if (key === '_materials') {
                    source._materials = [];
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
            const source = yield Mask.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Mask = Mask;
