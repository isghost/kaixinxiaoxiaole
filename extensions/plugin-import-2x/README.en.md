# plugin-import-2.x

[中文](https://github.com/cocos-creator/plugin-import-2.x/blob/main/README.zh-cn.md)

[Cocos Creator 3.0 Upgrade Guide](https://github.com/cocos-creator/creator-docs/blob/v3.0/en/release-notes/upgrade-guide-v3.0.md)

This plugin is used to reduce the workload of developers upgrading v2.x projects to v3.0.0.

As the editor does not currently support hot updates for plugins, if developers encounter problems with the plugin, use the tutorial below to update the plugin so that they can quickly fix the problem without having to wait for the editor version to be updated.

## Update Notes

  - Optimize the interface to add version display and prompt after import

## How to update the plugin

### Editor Version >= 3.7.0

1. Open Extension Manager from the main menu

![img.png](https://user-images.githubusercontent.com/7564028/232646751-dbb30224-00f2-4b4f-9a92-d9c150fe81d2.png)

2. Find the **plugin-import-2x** plugin and click Install or Update to get the latest version

![img_1.png](https://user-images.githubusercontent.com/7564028/232646762-a07b971d-0e38-4808-8b4d-d884baef3591.png)

### Editor Version <= 3.6.x

1. Store in the relevant designated location, as follows
    - To apply globally (all projects), just store the plugins folder under **User/.CocosCreator/extensions**
    - To apply to a single project, simply store the folder in the **extensions** folder at the same level as the **assets** file
    
> **Note**: If you do not have an **extensions** folder, you will need to create one yourself
    

2. Enable Extension
    
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

If an existing project needs to be upgraded under special circumstances, and technical or workload difficulties are encountered, please contact [liyan@cocos.com](mailto:liyan@cocos.com) for assistance!

