
/****************************************************************************
Create by huaiyao' CocostudioCodeCreate  Tool 
Copyright (c) 2014 ledou 
****************************************************************************/
var LevelSelectItem= cc.Layer.extend({
	//初始化控件变量为空
	_imgStar1 : null,
	_imgStar2 : null,
	_imgStar3 : null,
	_btnItem : null,
	_lblLevelNum : null,
    _startNum:-1,
    _levelIndex:0,

	ctor:function (levelIndex,starNumber){
		this._super();
		this.init(levelIndex,starNumber);
	},
	//界面初始化，为控件变量赋值
	init:function (levelIndex,starNumber){
		this._super();
		var root = ccs.uiReader.widgetFromJsonFile(res.j_LevelSelectItem_json);
		this.addChild(root);
		var offx = (cc.director.getWinSize().width - root.getContentSize().width) / 2;
		var offy = (cc.director.getWinSize().height - root.getContentSize().height) / 2;
		root.setPosition(cc.p(offx,offy));
		//初始化控件
		this._imgStar1 = GlobalFunction.getCocosWidget(root, "img_star1");
		this._imgStar2 = GlobalFunction.getCocosWidget(root, "img_star2");
		this._imgStar3 = GlobalFunction.getCocosWidget(root, "img_star3");
		this._btnItem = GlobalFunction.getCocosWidget(root, "btn_item");
		this._btnItem.addTouchEventListener(this.onBtnItemEvent,this);
		this._lblLevelNum = GlobalFunction.getCocosWidget(root, "lbl_levelNum");

        this.resetStar(levelIndex,starNumber);
	},

    resetStar:function(levelIndex,starNumber){
        this._startNum = starNumber;
        this._levelIndex = levelIndex;

        this._lblLevelNum.setString((levelIndex + 1));

        this._imgStar1.loadTexture("LevelMenuStar_mc_000.png",ccui.Widget.PLIST_TEXTURE);
        this._imgStar2.loadTexture("LevelMenuStar_mc_000.png",ccui.Widget.PLIST_TEXTURE);
        this._imgStar3.loadTexture("LevelMenuStar_mc_000.png",ccui.Widget.PLIST_TEXTURE);

        if(starNumber == -1){
            this._btnItem.setEnabled(false);
            this._btnItem.setBright(false);
        }else{
            this._btnItem.setEnabled(true);
            this._btnItem.setBright(true);

            if(starNumber > 0){this._imgStar1.loadTexture("LevelMenuStar_mc_001.png",ccui.Widget.PLIST_TEXTURE);}
            if(starNumber > 1){this._imgStar2.loadTexture("LevelMenuStar_mc_001.png",ccui.Widget.PLIST_TEXTURE);}
            if(starNumber > 2){this._imgStar3.loadTexture("LevelMenuStar_mc_001.png",ccui.Widget.PLIST_TEXTURE);}
        }
    },
	onBtnItemEvent : function(sender, type){
		if(type == ccui.Widget.TOUCH_ENDED){
            UserInfo.getCurrentUser().setCurrentLevelIndex(this._levelIndex);
            var info = UserInfo.getCurrentUser().getLevelInfo(this._levelIndex);
            cc.log(info.tiles);
            cc.director.runScene(new GameMainScene());
		}
	}
});