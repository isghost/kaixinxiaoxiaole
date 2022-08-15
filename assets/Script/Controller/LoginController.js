import AudioUtils from "../Utils/AudioUtils";

cc.Class({
  extends: cc.Component,

  properties: {
    loadingBar: {
      type: cc.ProgressBar,
      default: null,
    },
    loginButton: {
      type: cc.Button,
      default: null,
    },
    worldSceneBGM: {
      type: cc.AudioClip,
      default: null,
    }
  },

  onLoad() {
    this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1);
  },

  onLogin: function () {
    this.last = 0;
    this.loadingBar.node.active = true;
    this.loginButton.node.active = false;
    this.loadingBar.progress = 0;
    this.loadingBar.barSprite.fillRange = 0;
    cc.loader.onProgress = (count, amount, item) => {
      let progress = (count / amount).toFixed(2);
      if (progress > this.loadingBar.barSprite.fillRange) {
        this.loadingBar.barSprite.fillRange = count / amount;
      }
    };
    cc.director.preloadScene("Game", function () {
      this.loadingBar.node.active = false;
      this.loginButton.node.active = false;
      // cc.log("加载成功");
      cc.director.loadScene("Game");
    }.bind(this));
  },

  onDestroy: function () {
    cc.audioEngine.stop(this.gameSceneBGMAudioId);
  }
});
