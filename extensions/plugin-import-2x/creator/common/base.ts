/**
 * 用于导入 2d 项目到 3d 项目
 */

'use strict';

// @ts-ignore
import { v4 } from 'node-uuid';
import { nameToId } from './utlis';
import { relative, join, dirname, parse, extname, ParsedPath } from 'path';
// @ts-ignore
import { existsSync, ensureDirSync, copyFileSync, readJSONSync, writeJSONSync, readFileSync, writeFileSync } from 'fs-extra';
import {
    migratePlatformSettings,
    saveUuid,
    getDefaultAssets2D,
    getNewUuid,
    import2DChunks,
    importSubAssets, importProjectAssets,
} from './utlis';
import { UUID_2D_TO_3D, UUID_SKIP_EFFECT, UUID_UI_2D_TO_3D } from "./diff";
import { getConverter } from "../convertor";

export interface MessageInfo {
    type: string; // 类型表示需要处理什么资源
    json: any;    // 实际资源的源数据
}

export abstract class ImporterBase {
    public type: string = '';
    // 导入到 3d 工程所在磁盘的路径
    protected destFsPath: string = '';
    protected destMetaFsPath: string = '';
    // 2d 源文件所在磁盘的路径
    protected sourceFsPath: string = '';
    protected pathInfo: ParsedPath | null = null;
    protected _2dMeta: any = null;
    protected _3dMeta: any = null;
    // 2d 源文件转成 3d 源文件，如果不为 null 说明需要保存
    // 例如 animation、prefab、scene 之类的源文件
    protected _2dTo3dSource: any = null;

    // 检查 uuid 是否冲突，如果有就存储起来，后续会用到
    async checkUuid(meta: any) {
        const assetFsPath = await Editor.Message.request('asset-db', 'query-path', meta.uuid);
        if (assetFsPath && assetFsPath !== this.destFsPath) {
            const newUuid = v4();
            saveUuid(meta.uuid, newUuid);
            return newUuid;
        }
        // 存放 sprite frame uuid 对应的 texture uuid
        if (meta.type === 'sprite' && meta.subMetas) {
            for (const key in meta.subMetas) {
                const subMeta = meta.subMetas[key];
                saveUuid(subMeta.uuid, subMeta.rawTextureUuid);
            }
        }
        return meta.uuid;
    }

    get3DUuid() {
        try {
            const meta = readJSONSync(this.destMetaFsPath);
            return meta.uuid;
        }
        catch (e) {
            return v4();
        }
    }

    public reset() {
        this.destFsPath = '';
        this.sourceFsPath = '';
        this.pathInfo = null;
        this._2dMeta = null;
        this._3dMeta = null;
        this._2dTo3dSource = null;
    }

    public static getPathInfo(projectRoot: string, sourceFsPath: string) {
        let relativePath = relative(projectRoot, sourceFsPath);
        if (!relativePath.startsWith('assets')) {
            relativePath = join('assets', relativePath);
        }
        let to = join(Editor.Project.path, relativePath);
        // 改后缀名 .fire to .scene;
        if (to.endsWith('.fire')) {
            to = to.replace(/.fire+$/g, '.scene');
        } else if (to.endsWith('.js')) {
            const meta = readJSONSync(sourceFsPath + '.meta');
            if (!meta.isPlugin) {
                to = to.replace(/.js+$/g, '.ts');
            }
        }
        return {
            to: to,
            toMeta: to + '.meta',
            from: sourceFsPath,
            fromMeta: sourceFsPath + '.meta',
            pathInfo: parse(sourceFsPath),
        };
    }

    public static isNew(projectRoot: string, sourceFsPath: string) {
        try {
            if (sourceFsPath.endsWith('assets')) {
                return false;
            }
            const info = ImporterBase.getPathInfo(projectRoot, sourceFsPath);
            if (existsSync(info.to) && existsSync(info.toMeta)) {
                const _3DMeta = readJSONSync(info.toMeta);
                if (_3DMeta.importer === 'directory') {
                    return false;
                }
                const _2DMeta = readJSONSync(info.fromMeta);
                return _2DMeta.uuid !== _3DMeta.uuid;
            }
            return true;
        }
        catch (e) {
            return true;
        }
    }

    /*
     * 导入前
     * 参数一：项目的路径
     * 参数二：项目的资源路径
     */
    public async beforeImport(projectRoot: string, sourceFsPath: string): Promise<boolean> {
        // 重置
        this.reset();
        //
        this.sourceFsPath = sourceFsPath;
        const info = ImporterBase.getPathInfo(projectRoot, sourceFsPath);
        this.destFsPath = info.to;
        this.destMetaFsPath = info.toMeta;
        this.pathInfo = info.pathInfo;
        // update asset meta
        this._2dMeta = this.read2dMeta(sourceFsPath);
        // 检查 uuid 是否冲突
        const newUuid = this._2dMeta ? await this.checkUuid(this._2dMeta) : this.get3DUuid();
        this._3dMeta = this.createNewMeta(newUuid);
        this._3dMeta.uuid = newUuid;

        this._2dMeta && importProjectAssets.set(this._2dMeta.uuid, {
            type: extname(sourceFsPath),
            basePath: sourceFsPath,
            outPath: this.destMetaFsPath,
            outUuid: this._2dMeta.uuid,
            meta: this._2dMeta,
        });
        return true;
    }

    public needImport() {
        let doImport = true;
        if (existsSync(this.destFsPath) && existsSync(this.destMetaFsPath)) {
            const meta = readJSONSync(this.destMetaFsPath);
            doImport = this._3dMeta.uuid !== meta.uuid;
        }
        if (doImport) {
            // console.log(Editor.I18n.t('plugin-import-2x.import_log', {
            //     path: this.sourceFsPath,
            // }));
        }
        return doImport;
    }

    /*
     * 导入并且进行转换
     */
    public async import(main?: any): Promise<boolean> {
        return true;
    }

    /*
     * 转换后进行报错跟拷贝源文件的处理
     */
    public async afterImport() {
        this.copySync(this.sourceFsPath);
        if (this._2dTo3dSource) {
            try {
                if (this.destFsPath.endsWith('.ts') ||
                    this.destFsPath.endsWith('.js') ||
                    this.destFsPath.endsWith('.plist') ||
                    this.destFsPath.endsWith('.effect')) {
                    writeFileSync(this.destFsPath, this._2dTo3dSource, { encoding: 'utf8' });
                }
                else {
                    writeJSONSync(this.destFsPath, this._2dTo3dSource, { spaces: 2 });
                }
            }
            catch (e) { console.error(e); }
        }
        // console.log('保存：' + this.destFsPath);
        this.saveMeta();
    }

    /*
     * 创建新的 meta 对象
     */
    public createNewMeta(uuid?: string) {
        return {
            uuid: uuid || '',
            imported: false,
            importer: '*',
            files: [],
            subMetas: {},
            userData: {},
            ver: '0.0.1',
        };
    }

    /*
     * 读取 meta
     */
    public read2dMeta(sourceFsPath: string) {
        try {
            if (!sourceFsPath.endsWith('.meta')) {
                sourceFsPath += '.meta';
            }
            if (!existsSync(sourceFsPath)) {
                return null;
            }
            return readJSONSync(sourceFsPath);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    /*
     * 拷贝资源 + meta
     */
    public copySync(from: string, to?: string) {
        try {
            if (!existsSync(from)) {
                return 0;
            }
            if (to) {
                ensureDirSync(dirname(to));
                copyFileSync(from, to);
            } else {
                ensureDirSync(dirname(this.destFsPath));
                copyFileSync(from, this.destFsPath);
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    /*
     * 保存 meta
     */
    public async saveMeta() {
        if (!this.destMetaFsPath.endsWith('.meta')) {
            this.destMetaFsPath += '.meta';
        }
        try {
            writeJSONSync(this.destMetaFsPath, this._3dMeta, { spaces: 2 });
        }
        catch (e) {
            console.error(e);
        }
    }

    /*
     * 保存
     */
    public writeFileSync(to: string, data: any) {
        try {
            writeFileSync(to, data, { encoding: 'utf8' });
        }
        catch (e) {
            console.error(e);
        }
    }

    /*
     * 加载源文件类型为 JSON
     */
    public readJSONSync(sourceFsPath?: string) {
        try {
            return readJSONSync(sourceFsPath || this.sourceFsPath);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    /*
     * 加载源文件
     */
    public readFileSync(sourceFsPath?: string) {
        try {
            return readFileSync(sourceFsPath || this.sourceFsPath, 'utf8');
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    /*
     * 导入缓存纹理设置
     */
    public async migratePlatformSettings(platformSettings: any) {
        return await migratePlatformSettings(platformSettings);
    }

    static async getUuid(uuid: string, type?: string) {
        if (UUID_2D_TO_3D.has(uuid)) {
            return UUID_2D_TO_3D.get(uuid);
        }
        if (UUID_UI_2D_TO_3D.has(uuid)) {
            return UUID_UI_2D_TO_3D.get(uuid);
        }
        if (UUID_SKIP_EFFECT.has(uuid)) {
            console.warn(Editor.I18n.t('plugin-import-2x.effect_warn_tips', {
                name: UUID_SKIP_EFFECT.get(uuid) as string,
            }));
        }
        uuid = await ImporterBase.ensureDefaultAssets2DFor3D(uuid);
        uuid = getNewUuid(uuid);

        if (type && !uuid.includes('@')) {
            const id = `@${ImporterBase.getNameByID(type)}`;
            if (!uuid.endsWith(id)) {
                uuid += id;
            }
        }
        return uuid;
    }

    static getNewUuid(uuid: string) {
        return getNewUuid(uuid);
    }

    /*
     * 通过名字获取 id
     */
    static getNameByID(name: string) {
        return nameToId(name);
    }

    /*
     * 创建默认资源
     */
    static getDefaultAssets2D(uuid: string) {
        return getDefaultAssets2D(uuid);
    }

    /*
     * 创建 2d 默认资源
     */
    static async ensureDefaultAssets2DFor3D(uuid: string) {
        const subAssets = importSubAssets.get(uuid);
        if (subAssets) {
            uuid = subAssets.baseUuid;
        }
        else {
            const projectAssets = importProjectAssets.get(uuid);
            if (projectAssets) {
                uuid = projectAssets.outUuid;
            }
        }
        const info = getDefaultAssets2D(uuid);
        if (info && info.path) {
            // 如果是内置资源与 3d 的一致就直接用 3D 的
            if (UUID_UI_2D_TO_3D.has(info.baseUuid)) {
                return UUID_UI_2D_TO_3D.get(info.baseUuid);
            }
            if (UUID_2D_TO_3D.has(info.baseUuid)) {
                return UUID_2D_TO_3D.get(info.baseUuid);
            }
            const defaultAssetsRootPath = join(__dirname, '../../static');
            let relativePath = relative(defaultAssetsRootPath, info.path);
            if (!relativePath.startsWith('assets')) {
                relativePath = join('assets', relativePath);
            }
            const destFsPath = join(Editor.Project.path, relativePath);
            try {
                if (!existsSync(destFsPath)) {
                    if (destFsPath.endsWith('.mtl') || destFsPath.endsWith('.effect')) {
                        await import2DChunks(false);
                    }
                    const converter = getConverter(extname(info.path));
                    if (converter) {
                        await converter.beforeImport(defaultAssetsRootPath, info.path);
                        const isDone = await converter.import();
                        if (isDone) {
                            await converter.afterImport();
                        }
                    }
                    const readmePath = join(Editor.Project.path, 'asset', 'migrate-resources', 'README.md');
                    if (!existsSync(readmePath)) {
                        ensureDirSync(dirname(readmePath));
                        writeFileSync(readmePath, readFileSync(join(defaultAssetsRootPath, 'migrate-resources', 'README.md'), {encoding: 'utf8'}));
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
            if (subAssets) {
                return subAssets.uuid;
            }
            return info.baseUuid;
        }
        if (subAssets) {
            return subAssets.uuid;
        }
        return uuid;
    }

    /*
     * 通过 engine 进行序列化与反序列化
     */
    async queryCCClass(engine: any, message: any) {
        engine.contentWindow.postMessage(message, '*');
        return new Promise((resolve, reject) => {
            function onMessageCb(event: any) {
                window.removeEventListener("message", onMessageCb, false);
                resolve(event.data);
            }
            window.addEventListener("message", onMessageCb, false);
        });
    }

    replaceScript(name: string) {
        try {
            const defaultAssetsRootPath = join(__dirname, '../../static/migrate-resources/default-assets-2d/scripts');
            const fromFsPath = join(defaultAssetsRootPath, name);
            const destFsPath = join(Editor.Project.path, 'assets', 'default-assets-2d', 'scripts', name);
            if (!existsSync(destFsPath)) {
                ensureDirSync(dirname(destFsPath));
                copyFileSync(fromFsPath, destFsPath);
            }
            const fromMetaPath = fromFsPath + '.meta';
            const destMetaFsPath = destFsPath + '.meta';
            if (!existsSync(destMetaFsPath)) {
                ensureDirSync(dirname(destMetaFsPath));
                copyFileSync(fromMetaPath, destMetaFsPath);
            }
            const meta = readJSONSync(fromMetaPath);
            // @ts-ignore
            const EditorExtends: any = require('@base/electron-module').require('EditorExtends');
            const UuidUtils = EditorExtends.UuidUtils;
            return UuidUtils.compressUuid(meta.uuid, false);
        }
        catch (e) {
            console.error(e);
            return '';
        }
    }

    //
    ensureDefaultSprite2DFor3D(json3D: any) {
        for (const key in json3D) {
            const item = json3D[key];
            if (item.__type__ === 'cc.StudioComponent') {
                item.__type__ = this.replaceScript('studio-component.ts');
            }
            else if (item.__type__ === 'cc.StudioWidget') {
                item.__type__ = this.replaceScript('studio-widget.ts');
            }
        }
        return json3D;
    }
}
