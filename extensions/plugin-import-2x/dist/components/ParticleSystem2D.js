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
exports.ParticleSystem2D = exports.PARTICLESYSTEM2D = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
exports.PARTICLESYSTEM2D = {
    "__type__": "cc.ParticleSystem2D",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_materials": null,
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
    "preview": true,
    "_custom": false,
    "_file": null,
    "_spriteFrame": null,
    "_texture": null,
    "playOnLoad": true,
    "autoRemoveOnFinish": false,
    "_totalParticles": 150,
    "duration": -1,
    "emissionRate": 10,
    "life": 1,
    "lifeVar": 0,
    "_startColor": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 255,
    },
    "_startColorVar": {
        "__type__": "cc.Color",
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 0,
    },
    "_endColor": {
        "__type__": "cc.Color",
        "r": 255,
        "g": 255,
        "b": 255,
        "a": 0,
    },
    "_endColorVar": {
        "__type__": "cc.Color",
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 0,
    },
    "angle": 90,
    "angleVar": 20,
    "startSize": 50,
    "startSizeVar": 0,
    "endSize": 0,
    "endSizeVar": 0,
    "startSpin": 0,
    "startSpinVar": 0,
    "endSpin": 0,
    "endSpinVar": 0,
    "sourcePos": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "posVar": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_positionType": 0,
    "emitterMode": 0,
    "gravity": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "speed": 180,
    "speedVar": 50,
    "tangentialAccel": 80,
    "tangentialAccelVar": 0,
    "radialAccel": 0,
    "radialAccelVar": 0,
    "rotationIsDir": false,
    "startRadius": 0,
    "startRadiusVar": 0,
    "endRadius": 0,
    "endRadiusVar": 0,
    "rotatePerS": 0,
    "rotatePerSVar": 0,
};
class ParticleSystem2D {
    static create() {
        return JSON.parse(JSON.stringify(exports.PARTICLESYSTEM2D));
    }
    static migrate(json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.PARTICLESYSTEM2D));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === 'node') {
                    source.node = value;
                    (0, utlis_1.setColor)(source, value.__id__, json2D);
                }
                else if (key === '_N$preview') {
                    source.preview = value;
                }
                else if (key === '_materials') {
                    if (key === '_materials') {
                        source._materials = [];
                        for (let i = 0; i < value.length; ++i) {
                            let material = value[i];
                            if (material) {
                                material = {
                                    __uuid__: yield base_1.ImporterBase.getUuid(material.__uuid__),
                                };
                                source._materials.push(material);
                            }
                        }
                    }
                }
                else if (key === '_totalParticles') {
                    source.totalParticles = value;
                }
                else if (key === '_spriteFrame') {
                    source._spriteFrame = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'spriteFrame'),
                    };
                }
                else if (key === '_texture') {
                    source._texture = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'texture'),
                    };
                }
                else if (key === '_file') {
                    source._file = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__),
                    };
                }
                else if (key === '_dstBlendFactor') {
                    source._dstBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
                }
                else if (key === '_srcBlendFactor') {
                    source._srcBlendFactor = (0, utlis_1.getBlendFactor2DTo3D)(value);
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
            const source = yield ParticleSystem2D.migrate(json2D[index], json3D);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.ParticleSystem2D = ParticleSystem2D;
