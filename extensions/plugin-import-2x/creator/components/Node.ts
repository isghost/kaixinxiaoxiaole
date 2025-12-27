'use strict';
import { getGroupLayerByIndex, fromEuler, hasUIRenderComponent, hasCanvasComponent } from '../common/utlis';
import { UITransform } from "./UITransform";
import { UIOpacity } from "./UIOpacity";

export const NODE = {
    "__type__": "cc.Node",
    "_name": "New Node",
    "_objFlags": 0,
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

export class Node {

    static create(name?: string, parentID?: number) {
        const node = JSON.parse(JSON.stringify(NODE));
        if (name) {
            node._name = name;
        }
        if (parentID) {
            node._parent = {
                __id__: parentID,
            };
        }
        return node;
    }

    static addComponents(node: any, componentID: number) {
        node._components.push({
            __id__: componentID,
        });
    }

    static addChildren(node: any, childID: number) {
        node._children.push({
            __id__: childID,
        });
    }

    static async migrate(index: number, json2D: any, json3D: any) {
        const source = JSON.parse(JSON.stringify(NODE));
        const node = json2D[index];
        // 先导入 components
        if (node._components) {
            for (const component of node._components) {
                const element = source._components.find((obj: any) => {
                    return obj.__id__ === component.__id__;
                });
                if (!element) {
                    source._components.push(component);
                }
            }
        }
        for (const key in node) {
            const value = node[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_groupIndex' || key === 'groupIndex') {
                let layer = await getGroupLayerByIndex(value);
                // 如果是 Canvas 并且 layer 是默认的，就设置为 UI_2D
                if (layer === 1 && hasCanvasComponent(node, json2D)) {
                    layer = 1 << 25;
                }
                if (!layer) {
                    console.warn(`The group layer: ${layer} no found. node name: ${node._name}`);
                    layer = value;
                }
                source._layer = layer;
            }
            else if (key === '_color' || key === '_components') {
                continue;
            }
            else if (key === '_trs') {
                const trs = value.array;
                source._lpos.x = trs[0];
                source._lpos.y = trs[1];
                source._lpos.z = trs[2];
                source._lrot.x = trs[3];
                source._lrot.y = trs[4];
                source._lrot.z = trs[5];
                source._lrot.w = trs[6] === 0 ? 1 : trs[6];
                source._lscale.x = trs[7];
                source._lscale.y = trs[8];
                // 如果不是 3d 节点并且 scale z 是 0，就默认设置为 1
                if (!node['_is3DNode'] && trs[9] === 0) {
                    trs[9] = 1;
                }
                source._lscale.z = trs[9];
            }
            else if (key === '_eulerAngles') {
                source._euler.x = value.x;
                source._euler.y = value.y;
                source._euler.z = value.z;
            }
            else if (key === '_contentSize') {
                if (hasUIRenderComponent(source, json2D)) {
                    UITransform.setContentSize(source, index, value, json3D);
                }
            }
            else if (key === '_anchorPoint') {
                if (hasUIRenderComponent(source, json2D)) {
                    UITransform.setAnchorPoint(source, index, value, json3D);
                }
            }
            else if (key === '_opacity') {
                if (hasUIRenderComponent(source, json2D)) {
                    UIOpacity.setOpacity(source, index, value, json3D);
                }
            }
            else {
                source[key] = value;
            }
        }
        fromEuler(source._lrot, source._euler.x, source._euler.y, source._euler.z);
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Node.migrate(index, json2D, json3D);
        json3D.splice(index, 1, source);
        return source;
    }
}
