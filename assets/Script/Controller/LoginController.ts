
import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;

@ccclass
export default class LoginController extends cc.Component{

    @property(cc.ProgressBar)
    loadingBar: cc.ProgressBar = null;

    @property(cc.Button)
    loginButton: cc.Button = null;

    @property(cc.AudioClip)
    worldSceneBGM:cc.AudioClip = null;

    gameSceneBGMAudioId: number;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {
        this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1);
    }

    onLogin(){
        let self = this;
        this.loadingBar.node.active = true;
        this.loginButton.node.active = false;
        this.loadingBar.progress = 0;
        let backup = cc.loader.onProgress;
        cc.loader.onProgress = function (count, amount) {
            self.loadingBar.progress = count / amount;
        }.bind(this);

        cc.director.preloadScene("Game", function () {
            cc.loader.onProgress = backup;
            self.loadingBar.node.active = false;
            self.loginButton.node.active = true;
            cc.director.loadScene("Game");
        }.bind(this));
    }

    onDestroy(){
        cc.audioEngine.stop(this.gameSceneBGMAudioId);
    }

    // update (dt) {},
}
