/****************************************************************************
 Create by huaiyao' CocostudioCodeCreate  Tool
 Copyright (c) 2014 ledou
 ****************************************************************************/

var StartLayer= cc.Layer.extend({
    //初始化控件变量为空
    _imgTitle : null,
    _btnStart : null,
    _btnMusic : null,

    ctor:function (){
        this._super();
        this.init();
    },
    //界面初始化，为控件变量赋值
    init:function (){
        this._super();
        var root = ccs.uiReader.widgetFromJsonFile(res.j_BlockGame_json);
        this.addChild(root);
        var offx = (cc.director.getWinSize().width - root.getContentSize().width) / 2;
        var offy = (cc.director.getWinSize().height - root.getContentSize().height) / 2;
        root.setPosition(cc.p(offx,offy));
        //初始化控件
        this._imgTitle = GlobalFunction.getCocosWidget(root, "img_title");
        this._btnStart = GlobalFunction.getCocosWidget(root, "btn_start");
        this._btnStart.addTouchEventListener(this.onBtnStartEvent,this);
        this._btnMusic = GlobalFunction.getCocosWidget(root, "btn_music");
        this._btnMusic.addTouchEventListener(this.onMusicEvent,this);

    },
    onBtnStartEvent : function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
            var tran = new cc.TransitionFade(1.2, new LevelSelectScene());
            cc.director.runScene(tran);
        }
    },
    onMusicEvent : function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
        }
    },
    onEnter:function(){
        ccs.actionManager.playActionByName("StartLayer.json","show");
        this._super();
    },
    onExit:function(){
        this._super();
        ccs.actionManager.releaseActions();
    }
});

var StartScene = cc.Scene.extend({

    ctor:function() {
        this._super();
        this.init();
    },

    init:function(){
        this._super();
        this._startLayer = new StartLayer();
        this.addChild(this._startLayer);
    },


    onEnter:function () {
        this._super();
    },

    onExit:function(){
        this._super();
    }
});
