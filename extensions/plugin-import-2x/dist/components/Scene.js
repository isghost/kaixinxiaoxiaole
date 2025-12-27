'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scene = exports.FogInfo = exports.SkyboxInfo = exports.ShadowsInfo = exports.AmbientInfo = exports.SceneGlobals = exports.SCENE = void 0;
exports.SCENE = {
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
exports.SceneGlobals = {
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
exports.AmbientInfo = {
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
exports.ShadowsInfo = {
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
exports.SkyboxInfo = {
    "__type__": "cc.SkyboxInfo",
    "_envmap": null,
    "_isRGBE": false,
    "_enabled": false,
    "_useIBL": false,
};
exports.FogInfo = {
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
class Scene {
    static create(type) {
        if (type === 'SceneGlobals') {
            return JSON.parse(JSON.stringify(exports.SceneGlobals));
        }
        else if (type === 'AmbientInfo') {
            return JSON.parse(JSON.stringify(exports.AmbientInfo));
        }
        else if (type === 'ShadowsInfo') {
            return JSON.parse(JSON.stringify(exports.ShadowsInfo));
        }
        else if (type === 'SkyboxInfo') {
            return JSON.parse(JSON.stringify(exports.SkyboxInfo));
        }
        else if (type === 'FogInfo') {
            return JSON.parse(JSON.stringify(exports.FogInfo));
        }
        return JSON.parse(JSON.stringify(exports.SCENE));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.SCENE));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === '_active') {
                    continue;
                }
                source[key] = value;
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const scene = yield Scene.migrate(json2D[index]);
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
        });
    }
}
exports.Scene = Scene;
