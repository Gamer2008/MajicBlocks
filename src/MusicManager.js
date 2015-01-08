/**
 * Created by huaiyao on 14-10-5.
 */

var MusicManager = {};
MusicManager.beOpen = false;

MusicManager.playConnect = function(){
    if(MusicManager.beOpen == false) return ;
    cc.audioEngine.playEffect(res.o_connect);
};

MusicManager.playStep = function(){
    if(MusicManager.beOpen == false) return ;
    cc.audioEngine.playEffect(res.o_roatate);
};

MusicManager.playBg = function(){
    cc.audioEngine.playMusic(res.o_mus, true);
    MusicManager.beOpen = true;
};
MusicManager.stopBg = function(){
    cc.audioEngine.stopMusic();
    MusicManager.beOpen = false;
}
MusicManager.PlayWin = function(){
    if(MusicManager.beOpen == false) return ;
    cc.audioEngine.playEffect(res.o_menu);
};

MusicManager.PlayClick = function(){
    if(MusicManager.beOpen == false) return ;
    cc.audioEngine.playEffect(res.o_mouse1);
};

MusicManager.PlayStar = function(){
    if(MusicManager.beOpen == false) return ;
    cc.audioEngine.playEffect(res.o_startUp);
};