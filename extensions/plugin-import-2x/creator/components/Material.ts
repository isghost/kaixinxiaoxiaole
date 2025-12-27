'use strict';
import { ImporterBase } from "../common/base";

export const MATERIAL = {
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

export class Material {

    static create() {
        return JSON.parse(JSON.stringify(MATERIAL));
    }

    static async migrate(json2D: any) {
        const source = JSON.parse(JSON.stringify(MATERIAL));
        for (const key in json2D) {
            const value = json2D[key];
            if (key === '__type__' || value === undefined || value === null) { continue; }
            if (key === '_effectAsset') {
                source._effectAsset = {
                    "__uuid__": await ImporterBase.getUuid(json2D._effectAsset.__uuid__),
                };
            }
            else if (key === '_techniqueData') {
                for (const key in json2D._techniqueData) {
                    const data = json2D._techniqueData[key];
                    if (data.defines) {
                        const defines: any = {};
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
                        const props: any = {};
                        for (let propKey in data.props) {
                            const value = data.props[propKey];
                            if (propKey === 'mainTexture' || propKey === 'texture' || propKey === 'diffuseTexture') {
                                // 由于 texture 是关键字，所有都改成 mainTexture
                                propKey = 'mainTexture';
                                props[propKey] = {
                                    __uuid__: await ImporterBase.getUuid(value.__uuid__, 'texture'),
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
    }

    static async apply(index: number, json2D: any, json3D: any) {
        const source = await Material.migrate(json2D[index]);
        json3D.splice(index, 1, source);
        return source;
    }
}
