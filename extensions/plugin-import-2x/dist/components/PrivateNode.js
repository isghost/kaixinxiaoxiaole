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
exports.PrivateNode = exports.PRIVATENODE = void 0;
const utlis_1 = require("../common/utlis");
const UITransform_1 = require("./UITransform");
const UIOpacity_1 = require("./UIOpacity");
exports.PRIVATENODE = {
    "__type__": "cc.PrivateNode",
    "_name": "New Node",
    "_objFlags": 1024,
    "_parent": null,
    "_children": [],
    "_active": true,
    "_components": [],
    "_prefab": null,
    "_lpos": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_lrot": {
        "__type__": "cc.Quat",
        "x": 0,
        "y": 0,
        "z": 0,
        "w": 1,
    },
    "_lscale": {
        "__type__": "cc.Vec3",
        "x": 1,
        "y": 1,
        "z": 1,
    },
    "_layer": 1073741824,
    "_euler": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
};
class PrivateNode {
    static create() {
        return JSON.parse(JSON.stringify(exports.PRIVATENODE));
    }
    static migrate(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.PRIVATENODE));
            const privateNode = json2D[index];
            for (const key in privateNode) {
                const value = privateNode[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === '_groupIndex') {
                    let layer = yield (0, utlis_1.getGroupLayerByIndex)(value);
                    if (!layer) {
                        console.warn(`The group layer: ${index} no found. node name: ${privateNode._name}`);
                        layer = value;
                    }
                    source._layer = layer;
                }
                else if (key === '_trs') {
                    const trs = value.array;
                    source._lpos.x = trs[0];
                    source._lpos.y = trs[1];
                    source._lpos.z = trs[2];
                    source._lrot.x = trs[3];
                    source._lrot.y = trs[4];
                    source._lrot.z = trs[5];
                    source._lrot.w = trs[6];
                    source._lscale.x = trs[7];
                    source._lscale.y = trs[8];
                    source._lscale.z = trs[9];
                }
                else if (key === '_eulerAngles') {
                    source._euler.x = value.x;
                    source._euler.y = value.y;
                    source._euler.z = value.z;
                }
                else if (key === '_contentSize' || key === '_anchorPoint') {
                    let uiTransform = null;
                    source._components.find((obj) => {
                        const comp = json3D[obj.__id__];
                        if (comp && comp.__type__ === 'cc.UITransform') {
                            uiTransform = comp;
                            return comp;
                        }
                    });
                    if (!uiTransform) {
                        uiTransform = UITransform_1.UITransform.create();
                        uiTransform.node = {
                            __id__: index,
                        };
                        json3D.push(uiTransform);
                        source._components.push({
                            __id__: json3D.length - 1,
                        });
                    }
                    if (key === '_contentSize') {
                        uiTransform._contentSize = privateNode._contentSize;
                    }
                    else if (key === '_anchorPoint') {
                        uiTransform._anchorPoint = privateNode._anchorPoint;
                    }
                }
                else if (key === '_opacity') {
                    let uiOpacity = null;
                    source._components.find((obj) => {
                        const comp = json3D[obj.__id__];
                        if (comp && comp.__type__ === 'cc.UIOpacity') {
                            uiOpacity = comp;
                            return comp;
                        }
                    });
                    if (!uiOpacity) {
                        uiOpacity = UIOpacity_1.UIOpacity.create();
                        uiOpacity.node = {
                            __id__: index,
                        };
                        json3D.push(uiOpacity);
                        source._components.push({
                            __id__: json3D.length - 1,
                        });
                    }
                    uiOpacity._opacity = privateNode._opacity;
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
            const source = yield PrivateNode.migrate(index, json2D, json3D);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.PrivateNode = PrivateNode;
