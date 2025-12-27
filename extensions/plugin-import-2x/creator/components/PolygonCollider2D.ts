'use strict';
export const POLYGONCOLLIDER2D = {
    "__type__": "cc.PolygonCollider2D",
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
    "_points": [],
};

export class PolygonCollider2D {

    static create() {
        return JSON.parse(JSON.stringify(POLYGONCOLLIDER2D));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(POLYGONCOLLIDER2D));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === 'points') {
                source._point = value;
            }
            else {
                source[key] = value;
            }
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await PolygonCollider2D.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
