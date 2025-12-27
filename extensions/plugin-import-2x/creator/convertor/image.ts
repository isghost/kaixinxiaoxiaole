
import { ImporterBase } from '../common/base';
import { importSubAssets } from "../common/utlis";

export class ImageImporter extends ImporterBase {
    type: string = 'image';
    async import(): Promise<boolean> {
        if (!this._2dMeta) {
            return true;
        }
        this._3dMeta.ver = '1.0.13';
        this._3dMeta.importer = 'image';
        // copy base asset and meta
        const userData = this._3dMeta.userData;
        if (this._2dMeta.type === 'sprite') {
            userData.type = 'sprite-frame';
            // texture
            const textureMeta = this.createNewMeta();
            textureMeta.importer = 'texture';
            const textureID = ImporterBase.getNameByID('texture');
            const filterMode = this._2dMeta['filterMode'];
            // @ts-ignore
            textureMeta.userData['minfilter'] = filterMode === 'point' ? 'nearest' : 'linear';
            // @ts-ignore
            textureMeta.userData['magfilter'] = filterMode === 'point' ? 'nearest' : 'linear';
            const wrapMode = this._2dMeta['wrapMode'];
            // @ts-ignore
            textureMeta.userData['wrapModeS'] = textureMeta.userData['wrapModeT'] = wrapMode === 'clamp' ? 'clamp-to-edge' : wrapMode;
            //
            const genMipmaps = this._2dMeta['genMipmaps'];
            let mipfilter = 'none';
            if (genMipmaps) {
                mipfilter = (filterMode === 'bilinear' || filterMode === 'point') ? 'nearest' : 'linear';
            }
            // @ts-ignore
            textureMeta.userData['mipfilter'] = mipfilter;
            this._3dMeta.subMetas[textureID] = textureMeta;
            // sprite frame
            const spriteFrameMeta = this.createNewMeta();
            const _2dSubMeta = this._2dMeta.subMetas[this.pathInfo!.name];
            for (const key in _2dSubMeta) {
                if (key === 'ver' || key === 'uuid' ||
                    key === 'subMetas' || key === 'rawTextureUuid') {
                    continue;
                }
                else {
                    // @ts-ignore
                    spriteFrameMeta.userData[key] = _2dSubMeta[key];
                }
            }
            spriteFrameMeta.importer = 'sprite-frame';
            // @ts-ignore
            spriteFrameMeta.userData.imageUuidOrDatabaseUri = `${this._3dMeta.uuid}@${textureID}`;
            //
            const spriteFrameID = ImporterBase.getNameByID('spriteFrame');
            this._3dMeta.subMetas[spriteFrameID] = spriteFrameMeta;
        } else {
            userData.type = 'raw';
        }
        // 是否开启缓存
        const compressSettings = await this.migratePlatformSettings(this._2dMeta.platformSettings);
        if (compressSettings) {
            userData.compressSettings = compressSettings;
        }
        this._3dMeta.userData = userData;
        //
        if (this._2dMeta.type === 'sprite') {
            for (const key in this._2dMeta.subMetas) {
                const subMeta = this._2dMeta.subMetas[key];
                if (subMeta) {
                    importSubAssets.set(subMeta.uuid, {
                        baseUuid: this._2dMeta.uuid,
                        uuid: `${this._2dMeta.uuid}@${ImporterBase.getNameByID('spriteFrame')}`,
                    });
                }
            }
        }
        else if (this._2dMeta.type === 'raw') {
            importSubAssets.set(this._2dMeta.uuid, {
                baseUuid: this._2dMeta.uuid,
                uuid: `${this._2dMeta.uuid}@${ImporterBase.getNameByID('texture')}`,
            });
        }
        return true;
    }
}
