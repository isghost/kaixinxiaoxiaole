# plugin-import-2.x

[中文](https://github.com/cocos-creator/plugin-import-2.x/blob/main/README.md)

[Cocos Creator 3.0 Upgrade Guide](https://github.com/cocos-creator/creator-docs/blob/v3.0/en/release-notes/upgrade-guide-v3.0.md)

This plugin is used to reduce the workload of developers upgrading v2.x projects to v3.0.0.

As the editor does not currently support hot updates for plugins, if developers encounter problems with the plugin, use the tutorial below to update the plugin so that they can quickly fix the problem without having to wait for the editor version to be updated.

## How to update the plugin

1. Download: 
    - Latest: 
        - Support for migration of the textureUuid field in plist
        - Fix buttons click invalid after v2.x migration to v3.0.0
        - Fix the problem that the class name of the ts script is lost when parsing
        - Fix the issue of SpriteFrame missing in animation clips
        - Fix the problem of missing data in the component ProgressBar
        - Fixes an issue in v2.x with the StudioWidget component that caused an error in the scene after an upgrade
        - Fix script upgrade property not setting type
        - Fix GetSet format error in JS code
    
             - [Click to download](https://github.com/cocos-creator/plugin-import-2.x/releases/download/main/importer.zip)

2. Store in the relevant designated location, as follows
    - To apply globally (all projects), just store the plugins folder under **User/.CocosCreator/extensions**
    - To apply to a single project, simply store the folder in the **extensions** folder at the same level as the **assets** file
    
> **Note**: If you do not have an **extensions** folder, you will need to create one yourself
    

3. Enable Extension
    
    1.Open Extension Manager via the main menu
    
    ![img](https://user-images.githubusercontent.com/7564028/114006756-49c20a80-9893-11eb-8744-30215330a10b.png)

    2.Click on the Refresh button
    
    ![img](https://user-images.githubusercontent.com/7564028/114006766-4c246480-9893-11eb-9f46-b0fe03c2c09b.png)

    3.Enable extension
    
    ![img](https://user-images.githubusercontent.com/7564028/114006763-4b8bce00-9893-11eb-88ba-e39e3d00a22a.png)

> **NOTE**: If 2 menus appear, restart the editor. (This is a known issue and will be fixed later)    

## How to give feedback

1. [New **New issue**](https://github.com/cocos-creator/plugin-import-2.x/issues/new) 
2. [Forum](https://forum.cocos.org/c/Creator)

If an existing project needs to be upgraded under special circumstances, and technical or workload difficulties are encountered, please contact [slackmoehrle@cocos.com](mailto:slackmoehrle@cocos.com) for assistance!

