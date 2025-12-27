'use strict';
export const JOINT2D = {
    "__type__": "cc.Joint2D",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "anchor": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "connectedAnchor": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "collideConnected": false,
    "connectedBody": null,
};

export class Joint2D {

    static create() {
        return JSON.parse(JSON.stringify(JOINT2D));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(JOINT2D));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Joint2D.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
