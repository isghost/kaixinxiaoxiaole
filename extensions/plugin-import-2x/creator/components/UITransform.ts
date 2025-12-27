'use strict';

export const UITRANSFORM = {
    "__type__": "cc.UITransform",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_priority": 0,
    "_contentSize": {
        "__type__": "cc.Size",
        "width": 100,
        "height": 100,
    },
    "_anchorPoint": {
        "__type__": "cc.Vec2",
        "x": 0.5,
        "y": 0.5,
    },
};

export class UITransform {

    static create(nodeID?: number, name?: string) {
        const uiTransform = JSON.parse(JSON.stringify(UITRANSFORM));
        if (nodeID) {
            uiTransform.node = {
                __id__: nodeID,
            };
        }
        if (name) {
            uiTransform._name = name;
        }
        return uiTransform;
    }

    static add(node: any, nodeID: number, json3D: any) {
        let uiTransform;
        node._components.find((obj: any) => {
            const comp = json3D[obj.__id__];
            if (comp && comp.__type__ === 'cc.UITransform') {
                uiTransform = comp;
                return comp;
            }
        });
        if (!uiTransform) {
            uiTransform = UITransform.create();
            uiTransform.node = {
                __id__: nodeID,
            };
            json3D.push(uiTransform);
            node._components.push({
                __id__: json3D.length - 1,
            });
        }
        return uiTransform;
    }

    static setContentSize(node: any, nodeID: number, contentSize: any, json3D: any) {
        const uiTransform = UITransform.add(node, nodeID, json3D) as any;
        uiTransform._contentSize = contentSize;
    }

    static setAnchorPoint(node: any, nodeID: number, anchorPoint: any, json3D: any) {
        const uiTransform = UITransform.add(node, nodeID, json3D) as any;
        uiTransform._anchorPoint = anchorPoint;
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(UITRANSFORM));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await UITransform.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
