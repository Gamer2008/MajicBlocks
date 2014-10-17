cc.game.onStart = function(){

    var winSize = cc.director.getWinSize();
    var realWidth = 640;
    var realHeight = 960;

    /*
    if(realWidth < 640){
        realWidth = 640;
        realHeight = realWidth / winSize.width *  winSize.height;
    }
    if(realWidth > 960){
        realWidth = 960;
        realHeight = realWidth / winSize.width *  winSize.height;
    }

    if(realHeight > 1024){
        realHeight = 1024;
        realWidth = realHeight / winSize.height *  winSize.width;
    }
*/
    if (cc.sys.os == cc.sys.OS_WINDOWS)
        cc.view.setDesignResolutionSize(realWidth, realHeight, cc.ResolutionPolicy.SHOW_ALL);
    else
    	cc.view.setDesignResolutionSize(realWidth, realHeight, cc.ResolutionPolicy.SHOW_ALL);
	cc.view.resizeWithBrowserSize(true);

    //cc.director.setProjection(cc.Director.PROJECTION_2D);
    //load resources
    //cc.director.setAnimationInterval(1 / 30);
    cc.LoaderScene.preload(g_resources, function () {
        var scene = new StartScene();
        cc.director.runScene(scene);
    }, this);
};
cc.game.run();