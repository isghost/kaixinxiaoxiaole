System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, AudioSource, _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _descriptor3, _crd, ccclass, property, GameController;

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
      Node = _cc.Node;
      AudioSource = _cc.AudioSource;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5ac64Iq16lBqrHZ0246FRcZ", "GameController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'AudioSource']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameController", GameController = (_dec = ccclass('GameController'), _dec2 = property(Node), _dec3 = property(Node), _dec4 = property(AudioSource), _dec(_class = (_class2 = class GameController extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "grid", _descriptor, this);

          _initializerDefineProperty(this, "audioButton", _descriptor2, this);

          _initializerDefineProperty(this, "audioSource", _descriptor3, this);
        }

        onLoad() {// let audioButton = this.node.parent.getChildByName('audioButton') 
          // audioButton.on('click', this.callback, this) 
          // this.gameModel = new GameModel(); 
          // this.gameModel.init(4); 
          // var gridScript = this.grid.getComponent("GridView"); 
          // gridScript.setController(this); 
          // gridScript.initWithCellModels(this.gameModel.getCells()); 
          // this.audioSource = cc.find('Canvas/GameScene')._components[1].audio; 
        }

        callback() {// let state = this.audioSource._state; 
          // state === 1 ? this.audioSource.pause() : this.audioSource.play() 
          // Toast(state === 1 ? '关闭背景音乐🎵' : '打开背景音乐🎵' ) 
        }

        selectCell(pos) {// return this.gameModel.selectCell(pos); 
        }

        cleanCmd() {// this.gameModel.cleanCmd(); 
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "grid", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "audioButton", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "audioSource", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: null
      })), _class2)) || _class));
      /**
       * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
       */
      // import GameModel from "../Model/GameModel";
      // import Toast from '../Utils/Toast';
      // 
      // cc.Class({
      //   extends: cc.Component,
      //   properties: {
      //     grid: {
      //       default: null,
      //       type: cc.Node
      //     },
      //     audioButton: {
      //       default: null,
      //       type: cc.Node
      //     },
      //     audioSource: {
      //       type: cc.AudioSource
      //     }
      //   },
      //   // use this for initialization
      //   onLoad: function () {
      //     let audioButton = this.node.parent.getChildByName('audioButton')
      //     audioButton.on('click', this.callback, this)
      //     this.gameModel = new GameModel();
      //     this.gameModel.init(4);
      //     var gridScript = this.grid.getComponent("GridView");
      //     gridScript.setController(this);
      //     gridScript.initWithCellModels(this.gameModel.getCells());
      //     this.audioSource = cc.find('Canvas/GameScene')._components[1].audio;
      //   },
      // 
      //   callback: function () {
      //     let state = this.audioSource._state;
      //     state === 1 ? this.audioSource.pause() : this.audioSource.play()
      //     Toast(state === 1 ? '关闭背景音乐🎵' : '打开背景音乐🎵' )
      //   },
      // 
      //   selectCell: function (pos) {
      //     return this.gameModel.selectCell(pos);
      //   },
      //   cleanCmd: function () {
      //     this.gameModel.cleanCmd();
      //   }
      // });


      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d6f5680c937f6b9ecec13dd1e3562cb547ac5d25.js.map