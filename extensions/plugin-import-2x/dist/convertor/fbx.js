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
exports.FbxImporter = void 0;
const base_1 = require("../common/base");
const utlis_1 = require("../common/utlis");
const path_1 = require("path");
class FbxImporter extends base_1.ImporterBase {
    constructor() {
        super(...arguments);
        this.type = 'fbx';
    }
    import() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._2dMeta) {
                return true;
            }
            this._3dMeta.ver = '2.0.8';
            this._3dMeta.importer = 'fbx';
            this._3dMeta.userData.imageMetas = [];
            this._3dMeta.userData.legacyFbxImporter = true;
            this._3dMeta.userData.disableMeshSplit = true;
            this._3dMeta.uuid = this._2dMeta.uuid;
            const subMetas = [];
            for (let key in this._2dMeta.subMetas) {
                const subMeta2D = this._2dMeta.subMetas[key];
                const isMult = (0, utlis_1.isFbxMultKey)(this._2dMeta.subMetas, key);
                key = (0, utlis_1.getFBXSubMetaNewName)(this.destFsPath, key, isMult);
                const name = base_1.ImporterBase.getNameByID(key);
                const newUuid = `${this._2dMeta.uuid}@${name}`;
                subMetas.push({
                    key: key,
                    name: name,
                    uuid: newUuid,
                });
                utlis_1.importSubAssets.set(subMeta2D.uuid, {
                    baseUuid: this._2dMeta.uuid,
                    uuid: newUuid,
                    meta: subMeta2D,
                });
            }
            const metaContent = JSON.stringify(this._2dMeta.subMetas);
            let uuids = metaContent.match(/(?<=uuid":")([a-zA-Z0-9-]+)(?=")/g) || [];
            uuids = uuids.concat(metaContent.match(/(?<=__uuid__":")([a-zA-Z0-9-]+)(?=")/g) || []);
            let useSprites = [];
            for (let uuid of uuids) {
                const asset = utlis_1.importProjectAssets.get(uuid);
                const meta = asset && asset.meta;
                if (meta && (meta.type === 'sprite' || meta.type === 'raw')) {
                    if (!useSprites.find(item => item && item.uuid === uuid)) {
                        useSprites.push({
                            uuid: uuid,
                            name: (0, path_1.basename)(asset.basePath),
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
                    fbxName: (0, path_1.basename)(this.destFsPath) || '',
                    fbxUuid: this._3dMeta.uuid,
                    textureAssets: textureAssetsStr,
                }));
            }
            if (subMetas.length > 0) {
                utlis_1.replaceFbxUuidMap.set(this.destMetaFsPath, subMetas);
            }
            return true;
        });
    }
}
exports.FbxImporter = FbxImporter;
