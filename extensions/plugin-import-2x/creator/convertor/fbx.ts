'use strict';
import { ImporterBase } from '../common/base';
import {
    replaceFbxUuidMap,
    getFBXSubMetaNewName,
    isFbxMultKey,
    importSubAssets, importProjectAssets,
} from '../common/utlis';
import {basename, extname} from "path";

export class FbxImporter extends ImporterBase {
    type: string = 'fbx';
    async import(): Promise<boolean> {
        if (!this._2dMeta) {
            return true;
        }
        this._3dMeta.ver = '2.0.8';
        this._3dMeta.importer = 'fbx';
        this._3dMeta.userData.imageMetas = [];
        this._3dMeta.userData.legacyFbxImporter = true;
        this._3dMeta.userData.disableMeshSplit = true;
        this._3dMeta.uuid = this._2dMeta.uuid;
        const subMetas: any = [];
        for (let key in this._2dMeta.subMetas) {
            const subMeta2D = this._2dMeta.subMetas[key];
            const isMult = isFbxMultKey(this._2dMeta.subMetas, key);
            key = getFBXSubMetaNewName(this.destFsPath, key, isMult);
            const name = ImporterBase.getNameByID(key);
            const newUuid = `${this._2dMeta.uuid}@${name}`;
            subMetas.push({
                key: key,
                name: name,
                uuid: newUuid,
            });
            importSubAssets.set(subMeta2D.uuid, {
                baseUuid: this._2dMeta.uuid,
                uuid: newUuid,
                meta: subMeta2D,
            });
        }

        const metaContent = JSON.stringify(this._2dMeta.subMetas);
        let uuids = metaContent.match(/(?<=uuid":")([a-zA-Z0-9-]+)(?=")/g) || [];
        uuids = uuids.concat(metaContent.match(/(?<=__uuid__":")([a-zA-Z0-9-]+)(?=")/g) || []);
        let useSprites: any[] = [];
        for (let uuid of uuids) {
            const asset = importProjectAssets.get(uuid);
            const meta = asset && asset.meta;
            if (meta && (meta.type === 'sprite' || meta.type === 'raw')) {
                if (!useSprites.find(item => item && item.uuid === uuid)) {
                    useSprites.push({
                        uuid: uuid,
                        name: basename(asset.basePath),
                    });
                }
            }
        }

        if (useSprites.length > 0) {
            let textureAssetsStr = '';
            for (let useSprite of useSprites) {
                textureAssetsStr += `${useSprite.name} {asset(${useSprite.uuid})}`;
            }
            console.warn(Editor.I18n.t('plugin-import-2x.fbx_tips', {
                fbxName: basename(this.destFsPath) || '',
                fbxUuid: this._3dMeta.uuid,
                textureAssets: textureAssetsStr,
            }));
        }

        if (subMetas.length > 0) {
            replaceFbxUuidMap.set(this.destMetaFsPath, subMetas);
        }
        return true;
    }
}
