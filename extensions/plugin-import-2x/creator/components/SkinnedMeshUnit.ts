'use strict';
export const SKINNEDMESHUNIT = {
    "__type__": "cc.SkinnedMeshUnit",
    "mesh": null,
    "skeleton": null,
    "material": null,
    "_localTransform": {
        "__type__": "cc.Mat4",
        "m00": 1,
        "m01": 0,
        "m02": 0,
        "m03": 0,
        "m04": 0,
        "m05": 1,
        "m06": 0,
        "m07": 0,
        "m08": 0,
        "m09": 0,
        "m10": 1,
        "m11": 0,
        "m12": 0,
        "m13": 0,
        "m14": 0,
        "m15": 1,
    },
    "_offset": {
        "__type__": "cc.Vec2",
        "x": 0,
        "y": 0,
    },
    "_size": {
        "__type__": "cc.Vec2",
        "x": 1,
        "y": 1,
    },
};

export class SkinnedMeshUnit {

    static create() {
        return JSON.parse(JSON.stringify(SKINNEDMESHUNIT));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SKINNEDMESHUNIT));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await SkinnedMeshUnit.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
