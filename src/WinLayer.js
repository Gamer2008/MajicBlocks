/**
 * Created by huaiyao on 14-10-5.
 */

var WinLayer= cc.Layer.extend({
    //初始化控件变量为空
    _gameManage:null,
    _btnReStart : null,
    _btnBack : null,
    _btnNext : null,
    _imgStar1 : null,
    _imgStar2 : null,
    _imgStar3 : null,

    ctor:function (gm){
        this._super();
        this._gameManage = gm;
        this.init();
    },
    //界面初始化，为控件变量赋值
    init:function (){
        this._super();
        var root = ccs.uiReader.widgetFromJsonFile(res.j_WinLayer_json);
        this.addChild(root);
        var offx = (cc.director.getWinSize().width - root.getContentSize().width) / 2;
        var offy = (cc.director.getWinSize().height - root.getContentSize().height) / 2;
        root.setPosition(cc.p(offx,offy));
        //初始化控件
        this._btnNext = GlobalFunction.getCocosWidget(root, "btn_next");
        this._btnNext.addTouchEventListener(this.onBtnNextEvent,this);
        this._btnReStart = GlobalFunction.getCocosWidget(root, "btn_reStart");
        this._btnReStart.addTouchEventListener(this.onBtnReStartEvent,this);
        this._btnBack = GlobalFunction.getCocosWidget(root, "btn_back");
        this._btnBack.addTouchEventListener(this.onBtnBackEvent,this);

        this._imgStar1 = GlobalFunction.getCocosWidget(root, "img_star1");
        this._imgStar2 = GlobalFunction.getCocosWidget(root, "img_star2");
        this._imgStar3 = GlobalFunction.getCocosWidget(root, "img_star3");

    },

    showStar:function(starNum){
        if(starNum < 3) this._imgStar3.loadTexture("starGameOver_mc_001.png",ccui.Widget.PLIST_TEXTURE);
        if(starNum < 2) this._imgStar2.loadTexture("starGameOver_mc_001.png",ccui.Widget.PLIST_TEXTURE);
        if(starNum < 1) this._imgStar1.loadTexture("starGameOver_mc_001.png",ccui.Widget.PLIST_TEXTURE);
        this.setVisible(true);
        ccs.actionManager.playActionByName("WinLayer.json","show");

    },

    onBtnReStartEvent : function(sender, type){

        if(type == ccui.Widget.TOUCH_ENDED){
            ccs.actionManager.releaseActions();
            this._gameManage.restart();
        }
    },
    onBtnBackEvent : function(sender, type){

        if(type == ccui.Widget.TOUCH_ENDED){
            ccs.actionManager.releaseActions();
            this._gameManage.gotoLevelSelect();
        }
    },
    onBtnNextEvent : function(sender, type){
        if(type == ccui.Widget.TOUCH_ENDED){
            ccs.actionManager.releaseActions();
            this._gameManage.goToNextLevel();
        }
    },
    onEnter:function(){
        this._super();
    },
    onExit:function(){
        this._super();
        //ccs.actionManager.releaseActions();

    }
});