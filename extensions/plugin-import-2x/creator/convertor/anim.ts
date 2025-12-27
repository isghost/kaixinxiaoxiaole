'use strict';
import { ImporterBase } from '../common/base';
import { AnimationClip } from "../components/AnimationClip";

export class AnimImporter extends ImporterBase {
    type: string = 'anim';

    // 合并 commonTarget
    mergersCommonTarget(key: string, curve :any, commonTargets: any[], pathKey?: any) {
        const commonTarget: any = {
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
            } else {
                curve.commonTarget = idx;
            }
            curve.modifiers.push(this.getModifier(key));
        } else if (key === 'scaleX' || key === 'scaleY' || key === 'scaleZ') {
            commonTarget.modifiers.push('scale');
            const idx = commonTargets.findIndex((target) => {
                return JSON.stringify(target.modifiers) === JSON.stringify(commonTarget.modifiers);
            });
            if (idx === -1) {
                curve.commonTarget = commonTargets.length;
                commonTargets.push(commonTarget);
            } else {
                curve.commonTarget = idx;
            }
            curve.modifiers.push(this.getModifier(key));
        } else {
            pathKey && curve.modifiers.push(pathKey);
            curve.modifiers.push(this.getModifier(key));
        }
    }

    // 转换 Modifier
    getModifier(key: string) {
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
    async getValue(key: string, value: any) {
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
                value = await ImporterBase.getUuid(value.__uuid__, key);
            }
            else {
                value = await ImporterBase.getUuid(value.__uuid__);
            }
            return {
                __uuid__: value
            }
        }
        return value;
    }

    async getPropsForCurveData(props: any, animationClipOrArray: any, pathKey?: any) {
        const animationClip = Array.isArray(animationClipOrArray) ? animationClipOrArray[0] : animationClipOrArray;

        for (const key in props) {
            const prop = props[key];
            const frames: number[] = [];
            const values: any[] = [];

            const curve: any = {
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
            } else if (key === 'width' || key === 'height') {
                const component = {
                    __type__: "cc.animation.ComponentPath",
                    component: 'cc.UITransform',
                };
                let compIdx = animationClipOrArray.findIndex((item: any) => {
                    return item.__type__ === component.__type__ && item.component === component.component;
                });
                if (compIdx === -1) {
                    compIdx = animationClipOrArray.length;
                    animationClipOrArray.push(component);
                }

                const commonTarget: any = {
                    modifiers: [],
                };
                pathKey && commonTarget.modifiers.push(pathKey);
                commonTarget.modifiers.push({
                    __id__: compIdx,
                });
                commonTarget.modifiers.push('contentSize');
                let idx = animationClip._commonTargets.findIndex((target: any) => {
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
                const value = await this.getValue(key, item.value);
                curve.data.values.push(value);
                if (item.curve) {
                    curve.data.easingMethods[k] = item.curve;
                }
            }
            animationClip._keys.push(frames);
            animationClip._curves.push(curve);
        }
        return animationClipOrArray.length > 1 ? animationClipOrArray : animationClip;
    }

    async getCurveDataForComps(comps: any, animationClipArray: any, pathKey?: any) {
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

                const frames: number[] = [];
                const values: any[] = [];
                const curve: any = {
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
                    const value = await this.getValue(propKey, prop.value);
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
    }

    async getCurveDataForPaths(paths: any, animationClipArray: any[]) {
        for (const path in paths) {
            const hierarchyPaths = {
                "__type__": "cc.animation.HierarchyPath",
                "path": path,
            };
            animationClipArray.push(hierarchyPaths);
            const data = paths[path];
            if (data.props) {
                animationClipArray = await this.getPropsForCurveData(data.props, animationClipArray, {
                    "__id__": animationClipArray.length - 1,
                });
            }
            if (data.comps) {
                const __id__ = animationClipArray.findIndex(item => {
                    return item.path === path;
                });
                animationClipArray = await this.getCurveDataForComps(data.comps, animationClipArray, {
                    "__id__": __id__,
                });
            }
        }
        return animationClipArray;
    }

    async getCurveData(curveData: any, animationClip: any) {
        if (curveData.props) {
            animationClip = Array.isArray(animationClip) ? animationClip : [animationClip];
            animationClip = await this.getPropsForCurveData(curveData.props, animationClip);
        }
        if (curveData.comps) {
            animationClip = Array.isArray(animationClip) ? animationClip : [animationClip];
            animationClip = await this.getCurveDataForComps(curveData.comps, animationClip);
        }
        if (curveData.paths) {
            animationClip = Array.isArray(animationClip) ? animationClip : [animationClip];
            animationClip = await this.getCurveDataForPaths(curveData.paths, animationClip);
        }
        return animationClip;
    }

    async import(): Promise<boolean> {
        const anim2D = this.readJSONSync();
        const animationClip = AnimationClip.create();
        animationClip._name = anim2D._name;
        animationClip.sample = anim2D.sample;
        animationClip.speed = anim2D.speed;
        animationClip.wrapMode = anim2D.wrapMode;
        animationClip.events = anim2D.events;
        animationClip._duration = anim2D._duration;
        this._2dTo3dSource = await this.getCurveData(anim2D.curveData, animationClip);
        this._3dMeta.ver = '1.0.6';
        this._3dMeta.importer = "animation-clip";
        return true;
    }
}
