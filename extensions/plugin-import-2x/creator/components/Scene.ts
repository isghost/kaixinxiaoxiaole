'use strict';
export const SCENE = {
    "__type__": "cc.Scene",
    "_name": "New Node",
    "_objFlags": 0,
    "_parent": null,
    "_children": [],
    "_active": true,
    "_components": [],
    "_prefab": null,
    "autoReleaseAssets": false,
    "_globals": {
        "__id__": 1,
    },
};

export const SceneGlobals = {
    "__type__": "cc.SceneGlobals",
    "ambient": {
        "__id__": -1,
    },
    "shadows": {
        "__id__": -1,
    },
    "_skybox": {
        "__id__": -1,
    },
    "fog": {
        "__id__": -1,
    },
};

export const AmbientInfo = {
    "__type__": "cc.AmbientInfo",
    "_skyColor": {
        "__type__": "cc.Color",
        "r": 51,
        "g": 128,
        "b": 204,
        "a": 1,
    },
    "_skyIllum": 20000,
    "_groundAlbedo": {
        "__type__": "cc.Color",
        "r": 51,
        "g": 51,
        "b": 51,
        "a": 255,
    },
};

export const ShadowsInfo = {
    "__type__": "cc.ShadowsInfo",
    "_type": 0,
    "_enabled": false,
    "_normal": {
        "__type__": "cc.Vec3",
        "x": 0,
        "y": 1,
        "z": 0,
    },
    "_distance": 0,
    "_shadowColor": {
        "__type__": "cc.Color",
        "r": 0,
        "g": 0,
        "b": 0,
        "a": 76,
    },
    "_autoAdapt": true,
    "_pcf": 0,
    "_bias": 0.0035,
    "_near": 1,
    "_far": 30,
    "_aspect": 1,
    "_orthoSize": 5,
    "_size": {
        "__type__": "cc.Vec2",
        "x": 512,
        "y": 512,
    },
};

export const SkyboxInfo = {
    "__type__": "cc.SkyboxInfo",
    "_envmap": null,
    "_isRGBE": false,
    "_enabled": false,
    "_useIBL": false,
};

export const FogInfo = {
    "__type__": "cc.FogInfo",
    "_type": 0,
    "_fogColor": {
        "__type__": "cc.Color",
        "r": 200,
        "g": 200,
        "b": 200,
        "a": 255,
    },
    "_enabled": false,
    "_fogDensity": 0.3,
    "_fogStart": 0.5,
    "_fogEnd": 300,
    "_fogAtten": 5,
    "_fogTop": 1.5,
    "_fogRange": 1.2,
};

export class Scene {

    static create(type?: string) {
        if (type === 'SceneGlobals') {
            return JSON.parse(JSON.stringify(SceneGlobals));
        }
        else if (type === 'AmbientInfo') {
            return JSON.parse(JSON.stringify(AmbientInfo));
        }
        else if (type === 'ShadowsInfo') {
            return JSON.parse(JSON.stringify(ShadowsInfo));
        }
        else if (type === 'SkyboxInfo') {
            return JSON.parse(JSON.stringify(SkyboxInfo));
        }
        else if (type === 'FogInfo') {
            return JSON.parse(JSON.stringify(FogInfo));
        }
        return JSON.parse(JSON.stringify(SCENE));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(SCENE));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_active') {
                continue;
            }
            source[key] = value;
        }
        return source;
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const scene = await Scene.migrate(json2D[index]);
        json3D.splice(index, 1, scene);

        const sceneGlobals = Scene.create('SceneGlobals');
        json3D.push(sceneGlobals);
        scene._globals.__id__ = json3D.length - 1;

        const ambientInfo = Scene.create('AmbientInfo');
        json3D.push(ambientInfo);
        sceneGlobals.ambient.__id__ = json3D.length - 1;

        const shadowsInfo = Scene.create('ShadowsInfo');
        json3D.push(shadowsInfo);
        sceneGlobals.shadows.__id__ = json3D.length - 1;

        const skyboxInfo = Scene.create('SkyboxInfo');
        json3D.push(skyboxInfo);
        sceneGlobals._skybox.__id__ = json3D.length - 1;

        const fogInfo = Scene.create('FogInfo');
        json3D.push(fogInfo);
        sceneGlobals.fog.__id__ = json3D.length - 1;
        return scene;
    }
}
