'use strict';
import { ImporterBase } from '../common/base';

export class GltfImporter extends ImporterBase {
    type: string = 'base';
    async import(): Promise<boolean> {
        this._3dMeta.ver = '2.0.8';
        this._3dMeta.importer = 'gltf';
        this._3dMeta.userData.imageMetas = [];
        this._3dMeta.userData.legacyFbxImporter = false;
        this._3dMeta.userData.disableMeshSplit = true;
        return true;
    }
}
