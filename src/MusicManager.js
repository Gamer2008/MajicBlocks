/**
 * Created by huaiyao on 14-10-5.
 */

var MusicManager = {};

MusicManager.playConnect = function(){
    cc.audioEngine.playEffect(res.o_connect);
};

MusicManager.playStep = function(){
    cc.audioEngine.playEffect(res.o_roatate);
};

MusicManager.playBg = function(){
    cc.audioEngine.playMusic(res.o_mus, true);
};
MusicManager.stopBg = function(){
    cc.audioEngine.stopMusic();
}
MusicManager.PlayWin = function(){
    cc.audioEngine.playEffect(res.o_menu);
};

MusicManager.PlayClick = function(){
    cc.audioEngine.playEffect(res.o_mouse1);
};

MusicManager.PlayStar = function(){
    cc.audioEngine.playEffect(res.o_startUp);
};