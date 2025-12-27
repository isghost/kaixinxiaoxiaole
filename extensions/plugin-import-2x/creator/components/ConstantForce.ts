'use strict';
export const CONSTANTFORCE = {
    "__type__": "cc.ConstantForce",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_force": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_localForce": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_torque": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
    "_localTorque": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 0,
        "z": 0,
    },
};

export class ConstantForce {

    static create() {
        return JSON.parse(JSON.stringify(CONSTANTFORCE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(CONSTANTFORCE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await ConstantForce.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
