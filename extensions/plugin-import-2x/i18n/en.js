'use strict';

module.exports = {

    description: 'Import plugin for upgrading Cocos Creator 2.x projects',

    menu: {
        import: 'Import Cocos Creator 2.x project',
        popup_open: 'Open File',
    },

    tips: "Tips: If an error occurs while importing a project, you can update the plugin in the 'Manual' panel to update the plugin or give feedback on any possible issues.",

    effect_warn_tips: '{name} The effect is too complex and needs to be converted manually',

    plugin_js_tips: `Note: The original script has been commented out, due to the large number of changes in the script, there may be missing in the conversion, you need to convert it manually`,
    plugin_js_warn: `Convert {name}.js {asset({uuid})} plug-in scripts to '.ts', but the content is not converted, there may be a problem, need to convert it manually.`,

    skip_script_warn: `As the '{name}' script is not parsed by cc.Class, it is converted to '.ts', but the content is not converted, so you need to convert it yourself.`,

    file_num: 'Number of documents：{num}',

    select_dialog: {
        title: 'Select the root of the Cocos Creator 2.x project',
    },

    warn_dialog: {
        message: 'The selection is invalid.',
        detail: 'The path: {path} is invalid, please reselect the root directory of the Cocos Creator 2.x project.',
        title: 'Warm Tips!',
        version: 'The version of the project you are importing is {version}. It is recommended that you upgrade to Cocos Creator 2.4.3 or above separately before re-importing; otherwise the Import results will not be guaranteed to be correct.',
    },

    title: 'Import Cocos Creator 2.x Project',

    btnSelect: 'Select',
    btnImport: 'Import',

    search: 'search name',

    import_message_init: 'importing {current} / {total}',
    import_message: 'importing {current} / {total} asset: {name}',
    complete_message: 'Import complete',

    import_log: 'importing {path}',
    import_refresh: '-- Refreshing --',
    import_refreshend: '-- Refresh completed --',

    import_version: 'Version {version}',

    no_support_type: 'Unsupported type: [{type}]',

    script_rename_tips: 'The [{old}] script name is the same as [cc.{old}], change it to: [{new}]',

    canvas_tips: 'Currently 3.0 can only use a uniform design resolution globally, ' +
                 'the Canvas: {name} in scene: {scene} does not match the design resolution in the project settings, ' +
                 'please adjust it yourself. (Multiple resolutions will be supported in the future)',

    fbx_tips: 'fbx: {fbxName} Internal material is detected as using a custom texture, due to the new mapped material feature in 3.0.0 fbx, ' +
              'this may cause the texture to be lost and you will need to remap the custom texture for the fbx material yourself.\n' +
              'target fbx {fbxName} {asset({fbxUuid})} \n Using a list of custom textures:\n {textureAssets}',

    effect_tips: 'The current 3.0 and 2.x Effect are written very differently and need to be migrated by the user, Effect: {name} {asset({uuid})}.',

    imported_dialog: {
        message: 'After importing, need to refresh the editor.',
        btn_refresh: 'Refresh and close window',
        btn_continue: 'Continue importing',
    }
};
