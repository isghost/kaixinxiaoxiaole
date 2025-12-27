System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, ProgressBar, Button, AudioClip, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, LoginController;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      ProgressBar = _cc.ProgressBar;
      Button = _cc.Button;
      AudioClip = _cc.AudioClip;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5f4845Bus5AQoZakK7KAXht", "LoginController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'ProgressBar', 'Button', 'AudioClip']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LoginController", LoginController = (_dec = ccclass('LoginController'), _dec2 = property(ProgressBar), _dec3 = property(Button), _dec4 = property(AudioClip), _dec(_class = (_class2 = class LoginController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "loadingBar", _descriptor, this);

          _initializerDefineProperty(this, "loginButton", _descriptor2, this);

          _initializerDefineProperty(this, "worldSceneBGM", _descriptor3, this);
        }

        onLoad() {// this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1); 
        }

        onLogin() {// this.last = 0; 
          // this.loadingBar.node.active = true; 
          // this.loginButton.node.active = false; 
          // this.loadingBar.progress = 0; 
          // this.loadingBar.barSprite.fillRange = 0; 
          // cc.loader.onProgress = (count, amount, item) => { 
          // let progress = (count / amount).toFixed(2); 
          // if (progress > this.loadingBar.barSprite.fillRange) { 
          // this.loadingBar.barSprite.fillRange = count / amount; 
          // } 
          // }; 
          // cc.director.preloadScene("Game", function () { 
          // this.loadingBar.node.active = false; 
          // this.loginButton.node.active = false; 
          // cc.director.loadScene("Game"); 
          // }.bind(this)); 
        }

        onDestroy() {// cc.audioEngine.stop(this.gameSceneBGMAudioId); 
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "loadingBar", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "loginButton", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "worldSceneBGM", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      /**
       * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
       */
      // import AudioUtils from "../Utils/AudioUtils";
      // 
      // cc.Class({
      //   extends: cc.Component,
      // 
      //   properties: {
      //     loadingBar: {
      //       type: cc.ProgressBar,
      //       default: null,
      //     },
      //     loginButton: {
      //       type: cc.Button,
      //       default: null,
      //     },
      //     worldSceneBGM: {
      //       type: cc.AudioClip,
      //       default: null,
      //     }
      //   },
      // 
      //   onLoad() {
      //     this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1);
      //   },
      // 
      //   onLogin: function () {
      //     this.last = 0;
      //     this.loadingBar.node.active = true;
      //     this.loginButton.node.active = false;
      //     this.loadingBar.progress = 0;
      //     this.loadingBar.barSprite.fillRange = 0;
      //     cc.loader.onProgress = (count, amount, item) => {
      //       let progress = (count / amount).toFixed(2);
      //       if (progress > this.loadingBar.barSprite.fillRange) {
      //         this.loadingBar.barSprite.fillRange = count / amount;
      //       }
      //     };
      //     cc.director.preloadScene("Game", function () {
      //       this.loadingBar.node.active = false;
      //       this.loginButton.node.active = false;
      //       // cc.log("加载成功");
      //       cc.director.loadScene("Game");
      //     }.bind(this));
      //   },
      // 
      //   onDestroy: function () {
      //     cc.audioEngine.stop(this.gameSceneBGMAudioId);
      //   }
      // });


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=ee0bf2fdb20d27b93a7d7a94efba1d909cd40fa4.js.map