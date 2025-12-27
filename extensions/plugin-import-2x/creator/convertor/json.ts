'use strict';
import { ImporterBase } from '../common/base';

export class JSONImporter extends ImporterBase {
    type: string = 'base';
    async import(): Promise<boolean> {
        const isSpine = this.validateSpine();
        if (isSpine) {
            this._3dMeta.ver = '1.2.3';
            this._3dMeta.importer = 'spine-data';
        }
        else if (this.validateDragonBones()) {
            this._3dMeta.ver = '1.0.0';
            this._3dMeta.importer = 'dragonbones';
        }
        else if (this.validateDragonBonesAtlasAsset()) {
            this._3dMeta.ver = '1.0.0';
            this._3dMeta.importer = 'dragonbones-atlas';
        }
        else {
            this._3dMeta.ver = '1.0.0';
            this._3dMeta.importer = 'json';
        }
        return true;
    }

    validateDragonBonesAtlasAsset() {
        let json;
        const text = this.readFileSync(this.sourceFsPath);
        try {
            if (text) {
                json = JSON.parse(text);
            }
        }
        catch (e) {
            return false;
        }
        return typeof json.imagePath === 'string' && Array.isArray(json.SubTexture);
    }

    validateDragonBones() {
        var json;
        if (this.sourceFsPath.endsWith('.json')) {
            const text = this.readFileSync(this.sourceFsPath);
            try {
                if (text) {
                    json = JSON.parse(text);
                }
            }
            catch (e) {
                return false;
            }
        } else {
            const bin = this.readFileSync(this.sourceFsPath);
            try {
                // @ts-expect-error
                json = dragonBones.BinaryDataParser.getInstance().parseDragonBonesData(bin.buffer);
            } catch (e) {
                return false;
            }
        }
        return Array.isArray(json.armature) || !!json.armatures;
    }

    validateSpine() {
        if (this.sourceFsPath.endsWith('.skel')) {
            return true;
        }
        let json;
        const text = this.readFileSync(this.sourceFsPath);
        if (text) {
            const fastTest = text.slice(0, 30);
            const maybe = (fastTest.indexOf('slots') > 0 ||
                fastTest.indexOf('skins') > 0 ||
                fastTest.indexOf('events') > 0 ||
                fastTest.indexOf('animations') > 0 ||
                fastTest.indexOf('bones') > 0 ||
                fastTest.indexOf('skeleton') > 0 ||
                fastTest.indexOf('"ik"') > 0
            );
            if (maybe) {
                try {
                    json = JSON.parse(text);
                } catch (e) {
                    return false;
                }
                return Array.isArray(json.bones);
            }
        }
        return false;
    }
}
