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
exports.AnimImporter = void 0;
const base_1 = require("../common/base");
const AnimationClip_1 = require("../components/AnimationClip");
class AnimImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'anim';
    }
    // 合并 commonTarget
    mergersCommonTarget(key, curve, commonTargets, pathKey) {
        const commonTarget = {
            modifiers: [],
        };
        pathKey && commonTarget.modifiers.push(pathKey);
        if (key === 'x' || key === 'y' || key === 'z') {
            commonTarget.modifiers.push('position');
            const idx = commonTargets.findIndex((target) => {
                return JSON.stringify(target.modifiers) === JSON.stringify(commonTarget.modifiers);
            });
            if (idx === -1) {
                curve.commonTarget = commonTargets.length;
                commonTargets.push(commonTarget);
            }
            else {
                curve.commonTarget = idx;
            }
            curve.modifiers.push(this.getModifier(key));
        }
        else if (key === 'scaleX' || key === 'scaleY' || key === 'scaleZ') {
            commonTarget.modifiers.push('scale');
            const idx = commonTargets.findIndex((target) => {
                return JSON.stringify(target.modifiers) === JSON.stringify(commonTarget.modifiers);
            });
            if (idx === -1) {
                curve.commonTarget = commonTargets.length;
                commonTargets.push(commonTarget);
            }
            else {
                curve.commonTarget = idx;
            }
            curve.modifiers.push(this.getModifier(key));
        }
        else {
            pathKey && curve.modifiers.push(pathKey);
            curve.modifiers.push(this.getModifier(key));
        }
    }
    // 转换 Modifier
    getModifier(key) {
        if (key === 'angle' || key === 'rotation') {
            return 'eulerAngles';
        }
        else if (key === 'scaleX') {
            return 'x';
        }
        else if (key === 'scaleY') {
            return 'y';
        }
        else if (key === 'scaleZ') {
            return 'z';
        }
        else if (key === 'top' || key === 'bottom' ||
            key === 'left' || key === 'right' ||
            key === 'horizontalCenter' ||
            key === 'verticalCenter') {
            return 'editor' + key.substring(0, 1).toLocaleUpperCase() + key.substring(key.length, 1);
        }
        return key;
    }
    // 转换 value 数值
    getValue(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key === 'angle' || key === 'rotation') {
                return {
                    __type__: "cc.Vec3",
                    x: 0,
                    y: 0,
                    z: value !== undefined ? value : 0,
                };
            }
            else if (key === 'scale') {
                return {
                    __type__: "cc.Vec3",
                    x: value.x !== undefined ? value.x : 1,
                    y: value.y !== undefined ? value.y : 1,
                    z: value.z !== undefined ? value.z : 1,
                };
            }
            else if (key === 'position') {
                return {
                    __type__: "cc.Vec3",
                    x: value[0] !== undefined ? value[0] : 0,
                    y: value[1] !== undefined ? value[1] : 0,
                    z: 0,
                };
            }
            if (value && value.__uuid__) {
                if (key === 'spriteFrame' || key === 'texture') {
                    value = yield base_1.ImporterBase.getUuid(value.__uuid__, key);
                }
                else {
                    value = yield base_1.ImporterBase.getUuid(value.__uuid__);
                }
                return {
                    __uuid__: value
                };
            }
            return value;
        });
    }
    getPropsForCurveData(props, animationClipOrArray, pathKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const animationClip = Array.isArray(animationClipOrArray) ? animationClipOrArray[0] : animationClipOrArray;
            for (const key in props) {
                const prop = props[key];
                const frames = [];
                const values = [];
                const curve = {
                    modifiers: [],
                    data: {
                        keys: animationClip._keys.length,
                        values: values,
                        easingMethods: {},
                    },
                };
                if (key === 'opacity') {
                    const component = {
                        __type__: "cc.animation.ComponentPath",
                        component: 'cc.UIOpacity',
                    };
                    pathKey && curve.modifiers.push(pathKey);
                    curve.modifiers.push({
                        __id__: animationClipOrArray.length,
                    });
                    curve.modifiers.push(this.getModifier(key));
                    animationClipOrArray.push(component);
                }
                else if (key === 'width' || key === 'height') {
                    const component = {
                        __type__: "cc.animation.ComponentPath",
                        component: 'cc.UITransform',
                    };
                    let compIdx = animationClipOrArray.findIndex((item) => {
                        return item.__type__ === component.__type__ && item.component === component.component;
                    });
                    if (compIdx === -1) {
                        compIdx = animationClipOrArray.length;
                        animationClipOrArray.push(component);
                    }
                    const commonTarget = {
                        modifiers: [],
                    };
                    pathKey && commonTarget.modifiers.push(pathKey);
                    commonTarget.modifiers.push({
                        __id__: compIdx,
                    });
                    commonTarget.modifiers.push('contentSize');
                    let idx = animationClip._commonTargets.findIndex((target) => {
                        return JSON.stringify(target.modifiers) === JSON.stringify(commonTarget.modifiers);
                    });
                    if (idx === -1) {
                        idx = animationClip._commonTargets.length;
                        animationClip._commonTargets.push(commonTarget);
                    }
                    curve.commonTarget = idx;
                    curve.modifiers.push(this.getModifier(key));
                }
                else {
                    this.mergersCommonTarget(key, curve, animationClip._commonTargets, pathKey);
                }
                for (let k = 0; k < prop.length; k++) {
                    const item = prop[k];
                    frames.push(item.frame);
                    const value = yield this.getValue(key, item.value);
                    curve.data.values.push(value);
                    if (item.curve) {
                        curve.data.easingMethods[k] = item.curve;
                    }
                }
                animationClip._keys.push(frames);
                animationClip._curves.push(curve);
            }
            return animationClipOrArray.length > 1 ? animationClipOrArray : animationClip;
        });
    }
    getCurveDataForComps(comps, animationClipArray, pathKey) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const key in comps) {
                // component
                const comp = comps[key];
                const component = {
                    __type__: "cc.animation.ComponentPath",
                    component: key,
                };
                for (const propKey in comp) {
                    // component 内部属性
                    const props = comp[propKey];
                    const frames = [];
                    const values = [];
                    const curve = {
                        modifiers: [],
                        data: {
                            keys: animationClipArray[0]._keys.length,
                            values: values,
                            easingMethods: {},
                        },
                    };
                    pathKey && curve.modifiers.push(pathKey);
                    curve.modifiers.push({
                        // 下标从 1 开始
                        __id__: animationClipArray.length,
                    });
                    curve.modifiers.push(this.getModifier(propKey));
                    for (let k = 0; k < props.length; k++) {
                        const prop = props[k];
                        frames.push(prop.frame);
                        const value = yield this.getValue(propKey, prop.value);
                        curve.data.values.push(value);
                        if (prop.curve) {
                            curve.data.easingMethods[k] = prop.curve;
                        }
                    }
                    animationClipArray[0]._keys.push(frames);
                    animationClipArray[0]._curves.push(curve);
                }
                animationClipArray.push(component);
            }
            return animationClipArray;
        });
    }
    getCurveDataForPaths(paths, animationClipArray) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const path in paths) {
                const hierarchyPaths = {
                    "__type__": "cc.animation.HierarchyPath",
                    "path": path,
                };
                animationClipArray.push(hierarchyPaths);
                const data = paths[path];
                if (data.props) {
                    animationClipArray = yield this.getPropsForCurveData(data.props, animationClipArray, {
                        "__id__": animationClipArray.length - 1,
                    });
                }
                if (data.comps) {
                    const __id__ = animationClipArray.findIndex(item => {
                        return item.path === path;
                    });
                    animationClipArray = yield this.getCurveDataForComps(data.comps, animationClipArray, {
                        "__id__": __id__,
                    });
                }
            }
            return animationClipArray;
        });
    }
    getCurveData(curveData, animationClip) {
        return __awaiter(this, void 0, void 0, function* () {
            if (curveData.props) {
                animationClip = Array.isArray(animationClip) ? animationClip : [animationClip];
                animationClip = yield this.getPropsForCurveData(curveData.props, animationClip);
            }
            if (curveData.comps) {
                animationClip = Array.isArray(animationClip) ? animationClip : [animationClip];
                animationClip = yield this.getCurveDataForComps(curveData.comps, animationClip);
            }
            if (curveData.paths) {
                animationClip = Array.isArray(animationClip) ? animationClip : [animationClip];
                animationClip = yield this.getCurveDataForPaths(curveData.paths, animationClip);
            }
            return animationClip;
        });
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            const anim2D = this.readJSONSync();
            const animationClip = AnimationClip_1.AnimationClip.create();
            animationClip._name = anim2D._name;
            animationClip.sample = anim2D.sample;
            animationClip.speed = anim2D.speed;
            animationClip.wrapMode = anim2D.wrapMode;
            animationClip.events = anim2D.events;
            animationClip._duration = anim2D._duration;
            this._2dTo3dSource = yield this.getCurveData(anim2D.curveData, animationClip);
            this._3dMeta.ver = '1.0.6';
            this._3dMeta.importer = "animation-clip";
            return true;
        });
    }
}
exports.AnimImporter = AnimImporter;
