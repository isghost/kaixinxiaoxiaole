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
exports.TrailModule = exports.TRAILMODULE = void 0;
exports.TRAILMODULE = {
    "__type__": "cc.TrailModule",
    "_enable": false,
    "mode": 0,
    "lifeTime": {
        "__id__": 1,
    },
    "_minParticleDistance": 0.1,
    "existWithParticles": true,
    "textureMode": 0,
    "widthFromParticle": true,
    "widthRatio": {
        "__id__": 2,
    },
    "colorFromParticle": false,
    "colorOverTrail": {
        "__id__": 3,
    },
    "colorOvertime": {
        "__id__": 4,
    },
    "_space": 0,
    "_particleSystem": null,
};
class TrailModule {
    static create() {
        return JSON.parse(JSON.stringify(exports.TRAILMODULE));
    }
    static setParticleSystem(json3D) {
        json3D.forEach((obj, index) => {
            if (obj.__type__ === 'cc.ParticleSystem') {
                const __id__ = obj._trailModule && obj._trailModule.__id__;
                const trailModule = __id__ && json3D[__id__];
                if (trailModule) {
                    trailModule._particleSystem = {
                        __id__: index,
                    };
                }
            }
        });
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.TRAILMODULE));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                source[key] = value;
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield TrailModule.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.TrailModule = TrailModule;
