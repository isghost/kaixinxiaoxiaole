'use strict';
export const RIGIDBODY = {
    "__type__": "cc.RigidBody",
    "_name": "",
    "_objFlags": 0,
    "node": null,
    "_enabled": true,
    "__prefab": null,
    "_group": 1,
    "_type": 1,
    "_mass": 1,
    "_allowSleep": true,
    "_linearDamping": 0.1,
    "_angularDamping": 0.1,
    "_useGravity": true,
    "_linearFactor": {
        "__type__": "cc.Vec3",
        "x": 1,
        "y": 1,
        "z": 1,
    },
    "_angularFactor": {
        "__type__": "cc.Vec3",
        "x": 1,
        "y": 1,
        "z": 1,
    },
};

export class RigidBody {

    static create() {
        return JSON.parse(JSON.stringify(RIGIDBODY));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(RIGIDBODY));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await RigidBody.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
