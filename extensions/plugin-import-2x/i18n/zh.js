'use strict';

module.exports = {

    description: '用于升级 Cocos Creator 2.x 项目导入插件',

    menu: {
        import: '导入 Cocos Creator 2.x 项目',
        popup_open: '打开原文件',
    },

    tips: "提示：在导入过程中，如果出现错误，可以点击上方的使用说明按钮，来更新插件或者反馈问题。",

    search: '搜索 name',

    effect_warn_tips: '{name} 该 effect 过于复杂，需要进行手动转换',

    plugin_js_tips: `注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换`,
    plugin_js_warn: `转换 {name}.js {asset({uuid})} 插件脚本为 '.ts', 但是内容未进行转换，可能会有问题，需要手动转换`,

    skip_script_warn: `由于 '{name}' 脚本没有 cc.Class 无法解析，直接转为 '.ts', 但是内容未进行转换，需要自行转换`,

    file_num: '文件数量：{num}',

    select_dialog: {
        title: '选择 CocosCreator 2.x 项目根目录',
    },

    warn_dialog: {
        message: '选择目录无效',
        detail: '该路径: {path} 不符合，请重新选择 Cocos Creator 2.x 项目的【根目录】。',
        title: '温馨提示！',
        version: '您当前要导入的项目版本为 {version}，推荐先单独升级到 Cocos Creator 2.4.3 或以上版本，再重新导入；否则无法确保导入结果的正确性。',
    },

    title: '导入 Cocos Creator 2.x 项目',

    btnSelect: '选择',
    btnImport: '导入',

    import_message_init: '导入 {current} / {total}',
    import_message: '导入 {current} / {total} 资源：{name}',
    complete_message: '导入完毕',

    import_log: '导入 {path}',
    import_refresh: '-- 刷新中 --',
    import_refreshend: '-- 刷新完成 --',

    import_version: '版本 {version}',

    no_support_type: '不支持类型：[{type}]',

    script_rename_tips: '[{old}] 脚本名与 [cc.{old}] 同名, 改为：[{new}]',

    canvas_tips: '目前 3.0 全局只能使用统一的设计分辨率，在场景：{scene} 中的 Canvas：{name} 与项目设置中的设计分辨率不一致，请自行调整。（后续会支持多种分辨率）',

    fbx_tips: '检测到 fbx：{fbxName} 内部材质使用了自定义纹理，由于 3.0.0 fbx 添加了新的映射材质功能，从而可能导致纹理丢失，需要自行对 fbx 的材质进行重新映射自定义纹理。\n ' +
              '目标 fbx：{fbxName} {asset({fbxUuid})} \n 使用自定义纹理列表：\n {textureAssets}',

    effect_tips: '目前 3.0 与 2.x Effect 的写法差异大，需要用户自行导入，Effect: {name} {asset({uuid})}',

    imported_dialog: {
        message: '导入完毕，需要刷新编辑器。',
        btn_refresh: '刷新并关闭窗口',
        btn_continue: '继续导入',
    }
};
