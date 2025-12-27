'use strict';
export const BOXCOLLIDER2D = {
    "__type__": "cc.BoxCollider2D",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "tag": 0,
    "_group": 1,
    "_density": 1,
    "_sensor": false,
    "_friction": 0.2,
    "_restitution": 0,
    "_offset": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_size": {
        "__type__": "cc.Size",
        "width": 1,
        "height": 1,
    },
};

export class BoxCollider2D {

    static create() {
        return JSON.parse(JSON.stringify(BOXCOLLIDER2D));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(BOXCOLLIDER2D));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await BoxCollider2D.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
