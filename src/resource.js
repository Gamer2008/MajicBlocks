var res = {
    p_BlockGame_png : "res/BlockGame.png",
    p_BlockGame_plist : "res/BlockGame.plist",
    p_grobold_png : "res/grobold.png",
    p_grobold_fnt : "res/grobold.fnt",

    j_BlockGame_json : "res/StartLayer.json",
    j_LevelSelectLayer_json : "res/LevelSelectLayer.json",
    j_LevelSelectItem_json : "res/LevelSelectItem.json",
    j_MainSceneLayer_json : "res/MainSceneLayer.json",
    j_WinLayer_json : "res/WinLayer.json",
    o_mus : "res/mus_1.mp3",
    o_roatate : "res/rotate_1.mp3",
    o_menu : "res/StarMenu.mp3",
    o_startUp : "res/StarUp_2.mp3",
    o_mouse1 : "res/connect.mp3",
    o_connect : "res/connect.mp3"
};

var g_resources = [];

for (var i in res) {
    g_resources.push(res[i]);
}