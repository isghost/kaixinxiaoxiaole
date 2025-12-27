'use strict';
import { ImporterBase } from '../common/base';
// @ts-ignore
import { readFile, writeJSONSync } from 'fs-extra';
import { basename, extname, parse } from 'path';
import { getBlendFactor2DTo3D, importProjectAssets, importSubAssets } from "../common/utlis";

const plist = require('plist');

export class PlistImporter extends ImporterBase {
    type: string = 'plist';
    public async import(): Promise<boolean> {
        if (!this._2dMeta) {
            return true;
        }
        if (this._2dMeta.type === 'Texture Packer') {
            this._3dMeta.ver = '1.0.6';
            this._3dMeta.importer = 'sprite-atlas';
            return this.importTexturePacker();
        } else {
            this._3dMeta.ver = '1.0.2';
            this._3dMeta.importer = 'particle';
            return this.importParticle();
        }
    }

    async importTexturePacker() {
        try {
            let userData = this._3dMeta.userData;
            const file = await readFile(this.sourceFsPath, 'utf8');
            const data = plist.parse(file);
            userData.atlasTextureName = data.metadata.realTextureFileName;
            userData.format = data.metadata.format;
            userData.textureUuid = `${this._2dMeta.rawTextureUuid}@${ImporterBase.getNameByID('texture')}`;
            userData = this._3dMeta.userData;
            //
            for (const key in data.frames) {
                const _2dSubMeta = this._2dMeta.subMetas[key];
                const id = ImporterBase.getNameByID(parse(key).name);
                const subMeta = this.createNewMeta();
                subMeta.importer = "sprite-frame";
                for (const key in _2dSubMeta) {
                    switch (key) {
                        case 'ver':
                        case 'uuid':
                        case 'subMetas':
                        case 'spriteType':
                            // continue
                            break;
                        case 'rawTextureUuid':
                            // @ts-ignore
                            subMeta.userData.atlasUuid = _2dSubMeta[key];
                            break;
                        default:
                            // @ts-ignore
                            subMeta.userData[key] = _2dSubMeta[key];
                            break;
                    }
                }
                // @ts-ignore
                subMeta.imageUuidOrDatabaseUri = userData.textureUuid;
                this._3dMeta.subMetas[id] = subMeta;
                // 存储
                for (let key in this._2dMeta.subMetas) {
                    const subMeta = this._2dMeta.subMetas[key];
                    if (subMeta) {
                        key = basename(key, extname(key));
                        importSubAssets.set(subMeta.uuid, {
                            baseUuid: this._2dMeta.uuid,
                            uuid: `${this._2dMeta.uuid}@${ImporterBase.getNameByID(key)}`,
                        });
                    }
                }
                // 修改 plist 依赖图片类型设置为 texture
                const image = importProjectAssets.get(this._2dMeta.rawTextureUuid);
                if (image) {
                    const meta = this.readJSONSync(image.outPath);
                    if (meta.userData.type !== 'texture') {
                        meta.userData.type = 'texture';
                        writeJSONSync(image.outPath, meta, {spaces: 2});
                    }
                }
            }
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }

    async importParticle() {
        try {
            const file = await readFile(this.sourceFsPath, 'utf8');
            const data = plist.parse(file);
            if (data.spriteFrameUuid) {
                data.spriteFrameUuid = await ImporterBase.getUuid(data.spriteFrameUuid, 'spriteFrame');
            }
            else if (data.textureUuid) {
                // textureUuid 转成 spriteFrameUuid
                data.spriteFrameUuid = await ImporterBase.getUuid(data.textureUuid, 'spriteFrame');
                delete data.textureUuid;
            }
            if (data.blendFuncSource) {
                data.blendFuncSource = getBlendFactor2DTo3D(data.blendFuncSource);
            }
            if (data.blendFuncDestination) {
                data.blendFuncDestination = getBlendFactor2DTo3D(data.blendFuncDestination);
            }
            this._2dTo3dSource = plist.build(data);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
}
