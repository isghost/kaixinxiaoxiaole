'use strict';
// @ts-ignore
import { shell } from 'electron';
// @ts-ignore
import { readFileSync, statSync, readdirSync, existsSync, writeFileSync, readJSONSync, writeJSONSync } from 'fs-extra';
import { join, basename, extname, relative, dirname } from 'path';

import { registerConverter, getConverter, bubbleSort } from './convertor';
import {
    clear,
    initGroupList,
    replaceScriptList,
    importProjectAssets,
    uuidList,
    import2DChunks,
    replaceFbxUuidMap,
    scanningDefaultAssets2D,
    importSubAssets,
    addImportProjectAssets,
    scriptList,
    SKIPS_SCRIPT,
    collator, compareVersion,
} from './common/utlis';

import { MigrateManager } from "./components/MigrateManager";
import { ImporterBase } from "./common/base";

exports.style = readFileSync(join(__dirname, '../creator/index.css'), 'utf8');

const { I18n, Dialog, Message } = Editor;

const MANUAL: string = 'https://github.com/cocos-creator/migrate-cocos-creator2.x-plugin';

const PackageJSON = readJSONSync(join(__dirname, '../package.json'))

function t(key: string, args?: any) {
    return args ? I18n.t(`${PackageJSON.name}.${key}`, args) : I18n.t(`${PackageJSON.name}.${key}`);
}

exports.linteners = {
    resize() {
        this.$.tree.render(true);
    },
};

exports.template = `
    <header>
        <h1>
            <ui-label value="i18n:${PackageJSON.name}.title"></ui-label>
        </h1>
        
        <ui-progress></ui-progress>        

        <ui-file 
            class="project" 
            type="directory"
            placeholder="i18n:${PackageJSON.name}.select_dialog.title"
        ></ui-file>
    </header>
    <section>
        <ui-tree></ui-tree>
    </section>
                
    <footer>
        <ui-label class="version"></ui-label>
        <ui-button class="import">
            <ui-label value="i18n:${PackageJSON.name}.btnImport"></ui-label>
        </ui-button>       
    </footer>
    <iframe class="engine2D" style="display: none"></iframe>
`;

exports.$ = {
    tree: 'ui-tree',
    project: '.project',
    import: '.import',
    progress: 'ui-progress',
    // serialize: '.serialize',
    search: '.search',
    engine2D: '.engine2D',
    version: '.version',
};

exports.methods = {

    updateTreeState() {
        this.$.tree.list.forEach((data: any) => {
            const detail = data.detail;
            detail.isNew = ImporterBase.isNew(this.projectRoot, detail.file)
        });
        this.$.tree.render(true);
    },

    async updateTree(root: string) {
        const tree: any[] = [];
        function step(file: string, children: any) {
            try {
                if (file.endsWith('.DS_Store')) {
                    return;
                }

                if (SKIPS_SCRIPT.includes(basename(file))) {
                    return;
                }

                const stat = statSync(file);
                const ext = extname(file);

                const elements = file.split('assets');
                let url = '';
                if (elements) {
                    url = 'db://assets' + elements[1].replace(ext, '');
                }
                const item: any = {
                    detail: {
                        value: basename(file),
                        file: file,
                        checked: true,
                        extname: ext,
                        isDirectory: stat.isDirectory(),
                        legal: !!getConverter(ext) && !stat.isDirectory(),
                        isNew: ImporterBase.isNew(root, file),
                        path: url,
                    },
                    showArrow: false,
                    children: [],
                };

                if (stat.isDirectory()) {
                    item.showArrow = true;
                    const names = readdirSync(file);

                    names.forEach((name: string) => {
                        const tempPath = join(file, name);
                        if (name.endsWith('.meta')) {
                            addImportProjectAssets(root, tempPath);
                            return;
                        }
                        step(tempPath, item.children);
                    });

                    if (item.children.length > 0) {
                        children.push(item);
                    }
                } else {
                    if (item.detail.legal) {
                        children.push(item);
                    }
                }
            } catch (error) {
            }
        }

        const path = join(root, 'assets');
        step(path, tree);

        const state = await Editor.Message.request('assets', 'unstaging');
        let sortType = 'type';
        if (state) {
            sortType = state.sortType;
        }
        this.sortTree(tree, sortType);

        this.$.tree.tree = this.baseTree = tree;
    },

    sortTree(tree: any[], sortType: string) {
        tree.sort((a: any, b: any) => {
            const detailA = a.detail, detailB = b.detail;
            if (detailA.isDirectory && !detailB.isDirectory) {
                return -1;
            } else if (!detailA.isDirectory && detailB.isDirectory) {
                return 1;
            } else {
                if (sortType === 'type' && detailA.extname !== detailB.extname) {
                    return collator.compare(detailA.extname, detailB.extname);
                } else {
                    return collator.compare(detailA.path, detailB.path);
                }
            }
        });
        for (const item of tree) {
            this.sortTree(item.children, sortType);
        }
    },

    async scanProject(root: string) {
        if (!root) {
            return;
        }
        const path = join(root, 'assets');
        const projectPath = join(root, 'project.json');
        if (!existsSync(path) || !existsSync(projectPath)) {
            Dialog.warn(t('warn_dialog.message'), {
                detail: t('warn_dialog.detail', {
                    path: root,
                }),
            });
            return false;
        }

        const project = readJSONSync(projectPath);
        if (!project.version || compareVersion(project.version, '2.4.3') === -1) {
            Dialog.warn(t('warn_dialog.title'), {
                detail: t('warn_dialog.version', { version: project.version }),
            });
        }

        this.projectRoot = root;
        this.$.import.removeAttribute('disabled');

        // 导入时的初始化
        uuidList.clear();
        importProjectAssets.clear();
        importSubAssets.clear();
        initGroupList(path);
        scanningDefaultAssets2D();

        await this.updateTree(this.projectRoot);
        this.updateList();
        return true;
    },

    updateList() {
        // 更新 list
        this.totalTree = [];
        this.list = [];
        this.$.tree.list.forEach((data: any) => {
            if (data.detail.checked) {
                if (!data.detail.legal) {
                    // 统计统一弹窗提示，打印太多 log 了
                    // console.warn(`无法导入文件: ${data.detail.file}`);
                    return;
                }
                this.list.push(data);
            }
            this.totalTree.push(data);
        });
        this.progressCurrentIdx = 0;
        this.$.progress.message = t('import_message_init', {
            current: this.progressCurrentIdx,
            total: this.list.length,
        });
        if (this.list.length === 0) {
            this.$.import.setAttribute('disabled', '');
        }
        else {
            this.$.import.removeAttribute('disabled');
        }
    },

    getScripts() {
        const scripts: Map<string, any> = new Map<string, any>();
        const root = join(Editor.Project.path, 'assets');
        function step(file: string) {
            const files = readdirSync(file);
            files.forEach((item: any) => {
                const fPath = join(file, item);
                const stat = statSync(fPath);
                if(stat.isDirectory()) {
                    step(fPath);
                }
                if (!stat.isDirectory() && fPath.endsWith('.ts')) {
                    try {
                        const content = readFileSync(fPath, 'utf8');
                        const matchArray = content.match(/@ccclass\('(.*)'\)/);
                        const className = matchArray && matchArray[1];
                        if (className) {
                            scripts.set(basename(fPath, extname(fPath)), {
                                className: className,
                                path: fPath,
                            });
                        }
                    }
                    catch (e) {
                        console.error(e + ',\n this file path: ' + fPath);
                    }
                }
            });
        }
        step(root);
        return scripts.size > 0 ? scripts : scriptList;
    },

    replaceScript() {
        const scripts = this.getScripts();
        for (const obj of replaceScriptList) {
            // @ts-ignore
            const hasReplaceExtendClass = obj.extendClassName !== undefined;
            // @ts-ignore
            const key = hasReplaceExtendClass ? obj.extendClassName : obj.importPath;
            const name = key.replace(/[.|\\/]/g, '');
            const script = scripts.get(name);
            if (!script) {
                continue;
            }
            // @ts-ignore
            if (script.className) {
                // @ts-ignore
                let code = readFileSync(obj.path, 'utf8');
                // @ts-ignore
                const dirOne = dirname(obj.path);
                const dirTwo = dirname(script.path);
                // @ts-ignore
                let relativePath = relative(dirname(obj.path), script.path);
                if (dirOne === dirTwo) {
                    relativePath = './' + relativePath;
                }
                if (hasReplaceExtendClass) {
                    // @ts-ignore
                    code = code.replace(obj.extendClassName, relativePath.replace('.ts', ''));
                    code = code.replace(/@@@@@@/g, script.className);
                }
                else {
                    const newPath = `from '${relativePath.replace('.ts', '')}'`;
                    // @ts-ignore
                    code = code.replace(`from '${obj.importPath}'`, newPath);
                    // @ts-ignore
                    code = code.replace(`from "${obj.importPath}"`, newPath);
                }
                // @ts-ignore
                writeFileSync(obj.path, code, { encoding: 'utf8' });
            }
        }
    },

    async replaceFbx() {
        return new Promise((resolve, reject) => {
            try {
                let idx = 0;
                if (replaceFbxUuidMap.size === 0) {
                    resolve(true);
                }
                replaceFbxUuidMap.forEach((data: any, path: string) => {
                    let done = false;
                    const meta = readJSONSync(path);
                    if (meta) {
                        for (const value of data) {
                            const subMeta = meta.subMetas[value.name];
                            if (subMeta) {
                                subMeta.uuid = value.uuid;
                                done = true;
                            }
                        }
                    }
                    if (done) {
                        writeJSONSync(path, meta, { spaces: 2 });
                    }
                    idx++;
                    if (idx === replaceFbxUuidMap.size) {
                        resolve(true);
                    }
                });
            }
            catch (e) {
                reject(e);
                console.error(e);
            }
        });
    },

    async importProject() {
        let list = this.list;

        // 根据勾选的情况进行剔除
        list = list.filter((item: any) => {
            return item.detail.checked;
        });

        // 排序基础资源先导入
        bubbleSort(list);
        clear();

        this.progressCurrentIdx = 0;
        this.progressCurrentName = '';
        for (let i = 0; i < list.length; i++) {
            const detail = list[i].detail;

            this.progressCurrentIdx = i + 1;
            this.progressCurrentName = detail.value;
            this.$.progress.value = this.progressCurrentIdx / list.length * 100;
            this.$.progress.message = t('.import_message', {
                // @ts-ignore
                current: this.progressCurrentIdx,
                total: list.length,
                name: detail.value,
            });
            const converter = getConverter(detail.extname);
            if (converter) {
                if ((converter.type === 'mtl' || converter.type === 'effect')) {
                    await import2DChunks();
                }
                let isDone = await converter.beforeImport(this.projectRoot, detail.file);
                // if (!converter.needImport()) {
                //     continue;
                // }
                if (isDone) {
                    isDone = await converter.import(this);
                }
                if (isDone) {
                    await converter.afterImport();
                }
                // 无需每次都进行刷新，导入完后统一一次刷新
                // const next = list[i + 1];
                // if (next) {
                //     const extname = next.detail.extname;
                //     const nextConverter = getConverter(extname);
                //     if (nextConverter) {
                //         if (nextConverter.type !== converter.type) {
                //             if (converter.type === 'script' || nextConverter.type === 'script') {
                //                 continue;
                //             }
                //             await Message.request('asset-db', 'refresh-asset', 'db://assets');
                //         }
                //     }
                // }
            }
        }

        this.replaceScript();
        console.log(t('import_refresh'));
        // await Message.request('asset-db', 'refresh-asset', 'db://assets');
        console.log(t('import_refreshend'));
        try {
            await this.replaceFbx();
        }
        catch (e) {}

        MigrateManager.logs.length > 0 && console.log(t('no_support_type', {
            type: MigrateManager.logs.toString()
        }));

        this.$.progress.value = 100;
        this.$.progress.message = t('complete_message');
        // 统一刷新
        const { response  } = await Dialog.info(t('imported_dialog.message'), {
            default: 0,
            buttons: [
                t('imported_dialog.btn_refresh'),
                t('imported_dialog.btn_continue'),
            ]
        });
        if (0 === response) {
            await Editor.Panel.close(`${PackageJSON.name}.creator`);
            Editor.Message.send('asset-db', 'refresh');
        }
    },

    async onSerializeComponent() {
        await Editor.Message.request('scene', 'execute-scene-script', {
            name: 'importer',
            method: 'onSerializeComponent',
        });
    },
};

exports.ready = async function() {
    this.$.engine2D.src = join(__dirname, '../creator/engine/engine2D.html');
    // 通过后缀名来注册转换器
    registerConverter();

    Message.addBroadcastListener('i18n:change', () => {
        if (this.$.progress.message) {
            const total = this.list.length;
            if (this.progressCurrentIdx === total) {
                this.$.progress.message = t('complete_message');
            }
            else if (this.progressCurrentIdx === 0) {
                this.$.progress.message = t('import_message_init', {
                    // @ts-ignore
                    current: 0,
                    total: total,
                });
            }
            else {
                this.$.progress.value = this.progressCurrentIdx / total * 100;
                this.$.progress.message = t('import_message', {
                    // @ts-ignore
                    current: this.progressCurrentIdx,
                    total: total,
                    name: this.progressCurrentName,
                });
            }
        }
    });

    this.$.version.value = t('import_version', { version: PackageJSON.version });

    this.$.tree.setTemplateInit('item', ($item: any) => {
        $item.addEventListener('contextmenu', () => {
            Editor.Menu.popup({
                menu: [{
                    label: t('menu.popup_open'),
                    click() {
                        shell.showItemInFolder($item.data.detail.file);
                    },
                }],
            });
        });
    });
    const newIcon = join(__dirname, `../creator/icon/new.png`);
    this.$.tree.setTemplate('text', `<ui-checkbox></ui-checkbox><ui-icon></ui-icon><span class="name"></span><image class="new" ></image>`);
    this.$.tree.setTemplateInit('text', ($text: any) => {
        $text.$checkbox = $text.querySelector('ui-checkbox');
        $text.$icon = $text.querySelector('ui-icon');
        $text.$name = $text.querySelector('.name');
        $text.$new = $text.querySelector('.new');
        $text.$new.style.display = 'none';
        $text.$new.src = newIcon;

        $text.$checkbox.addEventListener('confirm', () => {
            const data = $text.data;
            data.detail.checked = !data.detail.checked;

            // 将配置同步给子元素
            function stepChildren(data: any, boolean: boolean) {
                data.detail.checked = boolean;
                data.children && data.children.forEach((child: any) => {
                    stepChildren(child, boolean);
                });
            }
            stepChildren(data, data.detail.checked);

            // 更新父级勾选状态
            function stepParent(info: any) {
                if (!info) {
                    return;
                }

                const checked = info.children.some((data: any) => {
                    return data.detail.checked;
                });

                if (checked !== info.detail.checked) {
                    info.detail.checked = checked;
                    stepParent(info.parent);
                }

            }
            stepParent(data.parent);

            this.updateList();
            this.$.tree.render(true);
        });
    });
    this.$.tree.setRender('text', ($text: any, data: any) => {
        $text.$checkbox.value = data.detail.checked;
        $text.$name.innerHTML = data.detail.value;
        if (data.detail.isDirectory) {
            $text.$icon.setAttribute('value', 'folder');
        } else {
            $text.$icon.setAttribute('value', 'file');
        }
        $text.$new.style.display = data.detail.isNew ? '' : 'none';
    });

    this.$.tree.setRender('item', ($item: any) => {
        const data = $item.data;
        if (data.detail.legal) {
            $item.removeAttribute('disabled');
        } else {
            $item.setAttribute('disabled', '');
        }
    });

    this.$.tree.css = readFileSync(join(__dirname, '../creator/tree.css'), 'utf8');

    this.$.serialize && this.$.serialize.addEventListener('confirm', () => {
        this.onSerializeComponent();
    });

    this.$.search && this.$.search.addEventListener('change', (event: Event) => {
        // @ts-ignore
        const value = event.target.value;
        if (!value) {
            this.$.tree.tree = this.baseTree;
        }
        else {
            this.$.tree.tree = this.totalTree.map((item: any) => {
                if ((item.detail.value.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) > -1)) {
                    return item;
                }
                return false;
            }).filter(Boolean);
        }
        this.$.tree.render(true);
    });

    // 选择项目按钮
    this.$.import.setAttribute('disabled', '');
    this.$.project.addEventListener('change', async (event: Event) => {
        // @ts-ignore
        const path = event.target.value;
        const done = await this.scanProject(path);
        if (done) {
            Editor.Profile.setConfig(PackageJSON.name, 'import-path', path);
        }
        else {
            this.$.project.value = this.projectRoot;
        }
    });

    // 开始导入按钮
    this.$.import.addEventListener('confirm', async () => {
        this.$.import.setAttribute('disabled', '');
        await this.importProject();
        console.log(t('complete_message'));
        setTimeout(async () => {
            this.updateTreeState();
            this.$.import.removeAttribute('disabled');
        });
    });

    // this.$.notes && this.$.notes.addEventListener('confirm', () => {
    //     const electron = require('electron');
    //     electron.shell.openExternal(MANUAL);
    // });

    const path = await Editor.Profile.getConfig(PackageJSON.name, 'import-path');
    this.$.project.value = path;
    await this.scanProject(path);
    // await this.scanProject('/Users/huangyanbin/helloworld-typescript');
    // await this.scanProject('/Users/huangyanbin/test-cases/v2_4_0');
};

exports.beforeClose = function() {

};

exports.close = function() {

};
