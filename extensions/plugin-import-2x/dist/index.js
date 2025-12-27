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
// @ts-ignore
const electron_1 = require("electron");
// @ts-ignore
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const convertor_1 = require("./convertor");
const utlis_1 = require("./common/utlis");
const MigrateManager_1 = require("./components/MigrateManager");
const base_1 = require("./common/base");
exports.style = (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../creator/index.css'), 'utf8');
const { I18n, Dialog, Message } = Editor;
const MANUAL = 'https://github.com/cocos-creator/migrate-cocos-creator2.x-plugin';
const PackageJSON = (0, fs_extra_1.readJSONSync)((0, path_1.join)(__dirname, '../package.json'));
function t(key, args) {
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
        this.$.tree.list.forEach((data) => {
            const detail = data.detail;
            detail.isNew = base_1.ImporterBase.isNew(this.projectRoot, detail.file);
        });
        this.$.tree.render(true);
    },
    updateTree(root) {
        return __awaiter(this, void 0, void 0, function* () {
            const tree = [];
            function step(file, children) {
                try {
                    if (file.endsWith('.DS_Store')) {
                        return;
                    }
                    if (utlis_1.SKIPS_SCRIPT.includes((0, path_1.basename)(file))) {
                        return;
                    }
                    const stat = (0, fs_extra_1.statSync)(file);
                    const ext = (0, path_1.extname)(file);
                    const elements = file.split('assets');
                    let url = '';
                    if (elements) {
                        url = 'db://assets' + elements[1].replace(ext, '');
                    }
                    const item = {
                        detail: {
                            value: (0, path_1.basename)(file),
                            file: file,
                            checked: true,
                            extname: ext,
                            isDirectory: stat.isDirectory(),
                            legal: !!(0, convertor_1.getConverter)(ext) && !stat.isDirectory(),
                            isNew: base_1.ImporterBase.isNew(root, file),
                            path: url,
                        },
                        showArrow: false,
                        children: [],
                    };
                    if (stat.isDirectory()) {
                        item.showArrow = true;
                        const names = (0, fs_extra_1.readdirSync)(file);
                        names.forEach((name) => {
                            const tempPath = (0, path_1.join)(file, name);
                            if (name.endsWith('.meta')) {
                                (0, utlis_1.addImportProjectAssets)(root, tempPath);
                                return;
                            }
                            step(tempPath, item.children);
                        });
                        if (item.children.length > 0) {
                            children.push(item);
                        }
                    }
                    else {
                        if (item.detail.legal) {
                            children.push(item);
                        }
                    }
                }
                catch (error) {
                }
            }
            const path = (0, path_1.join)(root, 'assets');
            step(path, tree);
            const state = yield Editor.Message.request('assets', 'unstaging');
            let sortType = 'type';
            if (state) {
                sortType = state.sortType;
            }
            this.sortTree(tree, sortType);
            this.$.tree.tree = this.baseTree = tree;
        });
    },
    sortTree(tree, sortType) {
        tree.sort((a, b) => {
            const detailA = a.detail, detailB = b.detail;
            if (detailA.isDirectory && !detailB.isDirectory) {
                return -1;
            }
            else if (!detailA.isDirectory && detailB.isDirectory) {
                return 1;
            }
            else {
                if (sortType === 'type' && detailA.extname !== detailB.extname) {
                    return utlis_1.collator.compare(detailA.extname, detailB.extname);
                }
                else {
                    return utlis_1.collator.compare(detailA.path, detailB.path);
                }
            }
        });
        for (const item of tree) {
            this.sortTree(item.children, sortType);
        }
    },
    scanProject(root) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!root) {
                return;
            }
            const path = (0, path_1.join)(root, 'assets');
            const projectPath = (0, path_1.join)(root, 'project.json');
            if (!(0, fs_extra_1.existsSync)(path) || !(0, fs_extra_1.existsSync)(projectPath)) {
                Dialog.warn(t('warn_dialog.message'), {
                    detail: t('warn_dialog.detail', {
                        path: root,
                    }),
                });
                return false;
            }
            const project = (0, fs_extra_1.readJSONSync)(projectPath);
            if (!project.version || (0, utlis_1.compareVersion)(project.version, '2.4.3') === -1) {
                Dialog.warn(t('warn_dialog.title'), {
                    detail: t('warn_dialog.version', { version: project.version }),
                });
            }
            this.projectRoot = root;
            this.$.import.removeAttribute('disabled');
            // 导入时的初始化
            utlis_1.uuidList.clear();
            utlis_1.importProjectAssets.clear();
            utlis_1.importSubAssets.clear();
            (0, utlis_1.initGroupList)(path);
            (0, utlis_1.scanningDefaultAssets2D)();
            yield this.updateTree(this.projectRoot);
            this.updateList();
            return true;
        });
    },
    updateList() {
        // 更新 list
        this.totalTree = [];
        this.list = [];
        this.$.tree.list.forEach((data) => {
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
        const scripts = new Map();
        const root = (0, path_1.join)(Editor.Project.path, 'assets');
        function step(file) {
            const files = (0, fs_extra_1.readdirSync)(file);
            files.forEach((item) => {
                const fPath = (0, path_1.join)(file, item);
                const stat = (0, fs_extra_1.statSync)(fPath);
                if (stat.isDirectory()) {
                    step(fPath);
                }
                if (!stat.isDirectory() && fPath.endsWith('.ts')) {
                    try {
                        const content = (0, fs_extra_1.readFileSync)(fPath, 'utf8');
                        const matchArray = content.match(/@ccclass\('(.*)'\)/);
                        const className = matchArray && matchArray[1];
                        if (className) {
                            scripts.set((0, path_1.basename)(fPath, (0, path_1.extname)(fPath)), {
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
        return scripts.size > 0 ? scripts : utlis_1.scriptList;
    },
    replaceScript() {
        const scripts = this.getScripts();
        for (const obj of utlis_1.replaceScriptList) {
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
                let code = (0, fs_extra_1.readFileSync)(obj.path, 'utf8');
                // @ts-ignore
                const dirOne = (0, path_1.dirname)(obj.path);
                const dirTwo = (0, path_1.dirname)(script.path);
                // @ts-ignore
                let relativePath = (0, path_1.relative)((0, path_1.dirname)(obj.path), script.path);
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
                (0, fs_extra_1.writeFileSync)(obj.path, code, { encoding: 'utf8' });
            }
        }
    },
    replaceFbx() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    let idx = 0;
                    if (utlis_1.replaceFbxUuidMap.size === 0) {
                        resolve(true);
                    }
                    utlis_1.replaceFbxUuidMap.forEach((data, path) => {
                        let done = false;
                        const meta = (0, fs_extra_1.readJSONSync)(path);
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
                            (0, fs_extra_1.writeJSONSync)(path, meta, { spaces: 2 });
                        }
                        idx++;
                        if (idx === utlis_1.replaceFbxUuidMap.size) {
                            resolve(true);
                        }
                    });
                }
                catch (e) {
                    reject(e);
                    console.error(e);
                }
            });
        });
    },
    importProject() {
        return __awaiter(this, void 0, void 0, function* () {
            let list = this.list;
            // 根据勾选的情况进行剔除
            list = list.filter((item) => {
                return item.detail.checked;
            });
            // 排序基础资源先导入
            (0, convertor_1.bubbleSort)(list);
            (0, utlis_1.clear)();
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
                const converter = (0, convertor_1.getConverter)(detail.extname);
                if (converter) {
                    if ((converter.type === 'mtl' || converter.type === 'effect')) {
                        yield (0, utlis_1.import2DChunks)();
                    }
                    let isDone = yield converter.beforeImport(this.projectRoot, detail.file);
                    // if (!converter.needImport()) {
                    //     continue;
                    // }
                    if (isDone) {
                        isDone = yield converter.import(this);
                    }
                    if (isDone) {
                        yield converter.afterImport();
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
                yield this.replaceFbx();
            }
            catch (e) { }
            MigrateManager_1.MigrateManager.logs.length > 0 && console.log(t('no_support_type', {
                type: MigrateManager_1.MigrateManager.logs.toString()
            }));
            this.$.progress.value = 100;
            this.$.progress.message = t('complete_message');
            // 统一刷新
            const { response } = yield Dialog.info(t('imported_dialog.message'), {
                default: 0,
                buttons: [
                    t('imported_dialog.btn_refresh'),
                    t('imported_dialog.btn_continue'),
                ]
            });
            if (0 === response) {
                yield Editor.Panel.close(`${PackageJSON.name}.creator`);
                Editor.Message.send('asset-db', 'refresh');
            }
        });
    },
    onSerializeComponent() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Editor.Message.request('scene', 'execute-scene-script', {
                name: 'importer',
                method: 'onSerializeComponent',
            });
        });
    },
};
exports.ready = function () {
    return __awaiter(this, void 0, void 0, function* () {
        this.$.engine2D.src = (0, path_1.join)(__dirname, '../creator/engine/engine2D.html');
        // 通过后缀名来注册转换器
        (0, convertor_1.registerConverter)();
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
        this.$.tree.setTemplateInit('item', ($item) => {
            $item.addEventListener('contextmenu', () => {
                Editor.Menu.popup({
                    menu: [{
                            label: t('menu.popup_open'),
                            click() {
                                electron_1.shell.showItemInFolder($item.data.detail.file);
                            },
                        }],
                });
            });
        });
        const newIcon = (0, path_1.join)(__dirname, `../creator/icon/new.png`);
        this.$.tree.setTemplate('text', `<ui-checkbox></ui-checkbox><ui-icon></ui-icon><span class="name"></span><image class="new" ></image>`);
        this.$.tree.setTemplateInit('text', ($text) => {
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
                function stepChildren(data, boolean) {
                    data.detail.checked = boolean;
                    data.children && data.children.forEach((child) => {
                        stepChildren(child, boolean);
                    });
                }
                stepChildren(data, data.detail.checked);
                // 更新父级勾选状态
                function stepParent(info) {
                    if (!info) {
                        return;
                    }
                    const checked = info.children.some((data) => {
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
        this.$.tree.setRender('text', ($text, data) => {
            $text.$checkbox.value = data.detail.checked;
            $text.$name.innerHTML = data.detail.value;
            if (data.detail.isDirectory) {
                $text.$icon.setAttribute('value', 'folder');
            }
            else {
                $text.$icon.setAttribute('value', 'file');
            }
            $text.$new.style.display = data.detail.isNew ? '' : 'none';
        });
        this.$.tree.setRender('item', ($item) => {
            const data = $item.data;
            if (data.detail.legal) {
                $item.removeAttribute('disabled');
            }
            else {
                $item.setAttribute('disabled', '');
            }
        });
        this.$.tree.css = (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../creator/tree.css'), 'utf8');
        this.$.serialize && this.$.serialize.addEventListener('confirm', () => {
            this.onSerializeComponent();
        });
        this.$.search && this.$.search.addEventListener('change', (event) => {
            // @ts-ignore
            const value = event.target.value;
            if (!value) {
                this.$.tree.tree = this.baseTree;
            }
            else {
                this.$.tree.tree = this.totalTree.map((item) => {
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
        this.$.project.addEventListener('change', (event) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const path = event.target.value;
            const done = yield this.scanProject(path);
            if (done) {
                Editor.Profile.setConfig(PackageJSON.name, 'import-path', path);
            }
            else {
                this.$.project.value = this.projectRoot;
            }
        }));
        // 开始导入按钮
        this.$.import.addEventListener('confirm', () => __awaiter(this, void 0, void 0, function* () {
            this.$.import.setAttribute('disabled', '');
            yield this.importProject();
            console.log(t('complete_message'));
            setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                this.updateTreeState();
                this.$.import.removeAttribute('disabled');
            }));
        }));
        // this.$.notes && this.$.notes.addEventListener('confirm', () => {
        //     const electron = require('electron');
        //     electron.shell.openExternal(MANUAL);
        // });
        const path = yield Editor.Profile.getConfig(PackageJSON.name, 'import-path');
        this.$.project.value = path;
        yield this.scanProject(path);
        // await this.scanProject('/Users/huangyanbin/helloworld-typescript');
        // await this.scanProject('/Users/huangyanbin/test-cases/v2_4_0');
    });
};
exports.beforeClose = function () {
};
exports.close = function () {
};
