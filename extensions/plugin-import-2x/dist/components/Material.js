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
exports.Material = exports.MATERIAL = void 0;
const base_1 = require("../common/base");
exports.MATERIAL = {
    "__type__": "cc.Material",
    "_name": "",
    "_objFlags": 0,
    "_native": "",
    "_effectAsset": null,
    "_techIdx": 0,
    "_defines": [],
    "_states": [],
    "_props": [],
};
class Material {
    static create() {
        return JSON.parse(JSON.stringify(exports.MATERIAL));
    }
    static migrate(json2D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = JSON.parse(JSON.stringify(exports.MATERIAL));
            for (const key in json2D) {
                const value = json2D[key];
                if (key === '__type__' || value === undefined || value === null) {
                    continue;
                }
                if (key === '_effectAsset') {
                    source._effectAsset = {
                        "__uuid__": yield base_1.ImporterBase.getUuid(json2D._effectAsset.__uuid__),
                    };
                }
                else if (key === '_techniqueData') {
                    for (const key in json2D._techniqueData) {
                        const data = json2D._techniqueData[key];
                        if (data.defines) {
                            const defines = {};
                            for (let defineKey in data.defines) {
                                let va = data.defines[defineKey];
                                if (defineKey === 'USE_DIFFUSE_TEXTURE') {
                                    defineKey = 'USE_TEXTURE';
                                }
                                defines[defineKey] = va;
                            }
                            source._defines.push(defines);
                        }
                        if (data.props) {
                            const props = {};
                            for (let propKey in data.props) {
                                const value = data.props[propKey];
                                if (propKey === 'mainTexture' || propKey === 'texture' || propKey === 'diffuseTexture') {
                                    // 由于 texture 是关键字，所有都改成 mainTexture
                                    propKey = 'mainTexture';
                                    props[propKey] = {
                                        __uuid__: yield base_1.ImporterBase.getUuid(value.__uuid__, 'texture'),
                                    };
                                }
                                else {
                                    props[propKey] = value;
                                }
                            }
                            data.props && source._props.push(props);
                        }
                    }
                }
                else {
                    source[key] = value;
                }
            }
            return source;
        });
    }
    static apply(index, json2D, json3D) {
        return __awaiter(this, void 0, void 0, function* () {
            const source = yield Material.migrate(json2D[index]);
            json3D.splice(index, 1, source);
            return source;
        });
    }
}
exports.Material = Material;
