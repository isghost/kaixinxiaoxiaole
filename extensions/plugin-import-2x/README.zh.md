# plugin-import-2.x

[English](https://github.com/cocos-creator/plugin-import-2.x/blob/main/README.md)

[Cocos Creator 3.0 升级指南](https://github.com/cocos-creator/creator-docs/blob/v3.0/zh/release-notes/upgrade-guide-v3.0.md)

该插件用于减少开发者升级 v2.x 项目到 v3.0.0 的工作量。

由于目前编辑器无法支持插件热更新，所以如果开发者在使用该插件时遇到问题，通过下方教程去更新插件，从而能够快速解决问题，无需等待编辑器版本更新。


## 更新说明

   - 优化界面添加版本显示以及导入后的提示

## 如何更新插件

### 编辑器版本 >= 3.7.0

1. 通过主菜单打开扩展管理器

![img.png](https://user-images.githubusercontent.com/7564028/232646751-dbb30224-00f2-4b4f-9a92-d9c150fe81d2.png)

2. 找到 **plugin-import-2x** 插件点击安装或者更新，获取最新版本

![img_1.png](https://user-images.githubusercontent.com/7564028/232646762-a07b971d-0e38-4808-8b4d-d884baef3591.png)

### 编辑器版本 <= 3.6.x

1. 存放到相关指定位置，如下
    - 应用于全局（所有项目）下，只需要将插件文件夹存放到 **用户/.CocosCreator/extensions** 下
    - 应用于单个项目下，只需要将文件夹存放到与 **assets** 文件同级的 **extensions** 文件夹下

> **注意**: 如果没有 **extensions** 文件夹，需要自行创建一个

2. 启用插件
    
    1.通过主菜单打开插件管理器

   ![img](https://user-images.githubusercontent.com/7564028/114006756-49c20a80-9893-11eb-8744-30215330a10b.png)

    
    2.点击刷新按钮

   ![img](https://user-images.githubusercontent.com/7564028/114006766-4c246480-9893-11eb-9f46-b0fe03c2c09b.png)
    
    3.启用插件
    
   ![img](https://user-images.githubusercontent.com/7564028/114006763-4b8bce00-9893-11eb-88ba-e39e3d00a22a.png)
    
> **注意**: 如果出现 2 个菜单的话，重启编辑器即可。（该问题是已知问题，后续会修复）

## 如何反馈问题

1. [新建 **New issue**](https://github.com/cocos-creator/plugin-import-2.x/issues/new) 
2. [论坛](https://forum.cocos.org/c/Creator)

如果现有项目因为特殊原因需要升级，并且遇到了技术上或者工作量上的困难，也可以联系 [liyan@cocos.com](mailto:liyan@cocos.com) 获取我们的人工协助！

