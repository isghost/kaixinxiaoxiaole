'use strict';
export const HINGECONSTRAINT = {
    "__type__": "cc.HingeConstraint",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_enableCollision": true,
    "_connectedBody": null,
    "axisA": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "axisB": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "pivotA": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "pivotB": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
};

export class HingeConstraint {

    static create() {
        return JSON.parse(JSON.stringify(HINGECONSTRAINT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(HINGECONSTRAINT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await HingeConstraint.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
