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
exports.SkeletalAnimation = exports.SKELETALANIMATION = void 0;
const base_1 = require("../common/base");
exports.SKELETALANIMATION = {
    "__type__": "cc.SkeletalAnimation",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "playOnLoad": false,
    "_clips": [],
    "_defaultClip": null,
    "_useBakedAnimation": true,
    "_sockets": [],
};
class SkeletalAnimation {
    static create() {
        return JSON.parse(JSON.stringify(exports.SKELETALANIMATION));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.SKELETALANIMATION));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === '_defaultClip') {
                    source._defaultClip = {
                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__),
                    };
                }
                else if (key === '_clips') {
                    for (let i = 0; i < value.length; ++i) {
                        let clip = value[i];
                        if (clip) {
                            clip = {
                                __uuid__: yield base_1.ImporterBase.getUuid(clip.__uuid__),
                            };
                        }
                        source._clips.push(clip);
                    }
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
            const source = yield SkeletalAnimation.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.SkeletalAnimation = SkeletalAnimation;
