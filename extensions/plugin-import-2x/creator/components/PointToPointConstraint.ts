'use strict';
export const POINTTOPOINTCONSTRAINT = {
    "__type__": "cc.PointToPointConstraint",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_enableCollision": true,
    "_connectedBody": null,
    "_pivotA": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_pivotB": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
};

export class PointToPointConstraint {

    static create() {
        return JSON.parse(JSON.stringify(POINTTOPOINTCONSTRAINT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(POINTTOPOINTCONSTRAINT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await PointToPointConstraint.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
