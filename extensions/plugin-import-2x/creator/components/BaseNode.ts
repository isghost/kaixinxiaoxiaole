'use strict';
export const BASENODE = {
    "__type__": "cc.BaseNode",
    "_name": "New Node",
    "_objFlags": 0,
    "_parent": null,
    "_children": [],
    "_active": true,
    "_components": [],
    "_prefab": null,
};

export class BaseNode {

    static create() {
        return JSON.parse(JSON.stringify(BASENODE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(BASENODE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await BaseNode.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
