'use strict';

export const UIOPACITY = {
    "__type__": "cc.UIOpacity",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_opacity": 255,
};

export class UIOpacity {

    static create() {
        return JSON.parse(JSON.stringify(UIOPACITY));
    }

    static add(node: any, nodeID: number, json3D: any) {
        let uiOpacity;
        node._components.find((obj: any) => {
            const comp = json3D[obj.__id__];
            if (comp && comp.__type__ === 'cc.UIOpacity') {
                uiOpacity = comp;
                return comp;
            }
        });
        if (!uiOpacity) {
            uiOpacity = UIOpacity.create();
            uiOpacity.node = {
                __id__: nodeID,
            };
            json3D.push(uiOpacity);
            node._components.push({
                __id__: json3D.length - 1,
            });
        }
        return uiOpacity;
    }

    static setOpacity(node: any, nodeID: number, opacity: any, json3D: any) {
        const uiOpacity = UIOpacity.add(node, nodeID, json3D) as any;
        uiOpacity._opacity = opacity;
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(UIOPACITY));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await UIOpacity.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
