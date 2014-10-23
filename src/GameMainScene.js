/**
 * Created by jopi on 14-10-2.
 */

var testTime = 0.0001;

var GameMainLayer = cc.Layer.extend({
    //初始化控件变量为空
    FIELD_WIDTH : 10,
    FIELD_HEIGHT : 10,
    CELL_SIZE : 60,
    levelId : 51,
    STEP_OPEN : 0,
    STEP_CLOSE : 1,
    STEP_CLOSE_FIGURE : 2,
    field:[],
    numStar:0,
    levelId:0,

    _btnStop : null,
    _btnReStart: null,
    _btnUnDo: null,
    _sliderScore: null,
    _lblScore: null,
    _lblLevel: null,
    _lblStar1: null,
    _lblStar2 : null,
    _lblStar3: null,
    _imgaeStar1: null,
    _imgaeStar2: null,
    _imgaeStar3: null,

    _panelContainer:null,
    _winLayer:null,
    _stepNum : 0,

    beGetResult:false,

    ctor:function (){
        this._super();
        this.init();
    },
    //界面初始化，为控件变量赋值
    init:function (){
        this._super();
        var root = ccs.uiReader.widgetFromJsonFile(res.j_MainSceneLayer_json);
        this.addChild(root);

        this._panelContainer = GlobalFunction.getCocosWidget(root, "panel_container");
        this._btnStop = GlobalFunction.getCocosWidget(root, "btn_stop");
        this._btnReStart = GlobalFunction.getCocosWidget(root, "btn_reStart");
        this._btnUnDo = GlobalFunction.getCocosWidget(root, "btn_unDo");
        this._sliderScore = GlobalFunction.getCocosWidget(root, "slider_score");
        this._lblScore = GlobalFunction.getCocosWidget(root, "lbl_score");
        this._lblLevel= GlobalFunction.getCocosWidget(root, "lbl_level");
        this._lblStar1 = GlobalFunction.getCocosWidget(root, "lbl_star1");
        this._lblStar2 = GlobalFunction.getCocosWidget(root, "lbl_star2");
        this._lblStar3 = GlobalFunction.getCocosWidget(root, "lbl_star3");
        this._imgaeStar1 = GlobalFunction.getCocosWidget(root, "imgae_star1");
        this._imgaeStar2 = GlobalFunction.getCocosWidget(root, "imgae_star2");
        this._imgaeStar3 = GlobalFunction.getCocosWidget(root, "imgae_star3");

        this._btnStop.addTouchEventListener(this.stopTouchEvent,this);
        this._btnReStart.addTouchEventListener(this.restartTouchEvent,this);
        this._btnUnDo.addTouchEventListener(this.undoTouchEvent,this);

        this.loadLevel();
        this.fieldContainer = new FieldContainer(this.field, this);
        this._panelContainer.addChild(this.fieldContainer);

        this._winLayer = new WinLayer(this);
        this.addChild(this._winLayer);
        this._winLayer.setVisible(false);
        //this.fieldContainer.setPosition(this._panelContainer.getPosition());
    },
    stopTouchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.gotoLevelSelect();
                break;
            case ccui.Widget.TOUCH_CANCELED:
                break;

            default:
                break;
        }
    },
    restartTouchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.restart();
                break;

            case ccui.Widget.TOUCH_CANCELED:
                break;

            default:
                break;
        }
    },

    undoTouchEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                break;
            case ccui.Widget.TOUCH_MOVED:
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.fieldContainer.deleteStep();
                break;

            case ccui.Widget.TOUCH_CANCELED:
                break;

            default:
                break;
        }
    },
    onEnter:function(){
        this._super();
    },
    onExit:function(){
        this._super();
    },

    loadLevel :  function () {
        this.levelId = UserInfo.getCurrentUser().getCurrentLevelIndex();
        this.field = [];
        var info = UserInfo.getCurrentUser().getLevelInfo(this.levelId);
        var level = info.tiles;
        this.numStar = parseInt(info.numStar);
        this._stepNum = 0;
        this.numStarThree= this.numStar;
        this.numStarTwo =Math.ceil(this.numStarThree*0.4)+this.numStar;
        this.numStarOne=Math.ceil(this.numStarTwo*0.5)+this.numStarTwo;
        this.initLevelUI();
        var idNow = 0;
        for (var i = 0; i < this.FIELD_WIDTH; i++){
            this.field[i] = [];
            for (var j = 0; j < this.FIELD_HEIGHT; j++) {
                this.field[i][j] = parseInt(level[idNow]);
                idNow++
            }
        }

    },
    initLevelUI:function(){
        this._lblLevel.setString(this.levelId);
        this._lblScore.setString("0");
        this._lblStar1.setString(this.numStarOne);
        this._lblStar2.setString(this.numStarTwo);
        this._lblStar3.setString(this.numStarThree);
        this._sliderScore.setPercent(100);
        var orgX = this._sliderScore.getPositionX() - this._sliderScore.getContentSize().width / 2;
        var p1 = Math.ceil(this.numStarThree / this.numStarOne *this._sliderScore.getContentSize().width)  +orgX ;
        this._lblStar3.setPositionX(p1);
        this._imgaeStar3.setPositionX(p1);
        var p2 = Math.ceil(this.numStarTwo / this.numStarOne *this._sliderScore.getContentSize().width)  +orgX ;
        this._lblStar2.setPositionX(p2);
        this._imgaeStar2.setPositionX(p2);

    },
    getStep:function(){
        return this._stepNum;
    },
    setStep:function(num){
        this._stepNum = num;
        this._lblScore.setString(num);
        this._sliderScore.setPercent(100 * (this.numStarOne - num) / this.numStarOne);
    },
    addStep:function(){
        this._stepNum ++;
        this.setStep(this._stepNum);
    },
    showWin:function(){
        var starNum = 0;
        if(this._stepNum <= this.numStarThree)  starNum = 3;
        else if(this._stepNum <= this.numStarTwo)  starNum = 2;
        else if(this._stepNum <= this.numStarOne)  starNum = 1;
        else  starNum = 0;

        if(starNum == 3){
            var xhr = cc.loader.getXMLHttpRequest();
            var url = "http://localhost:19242/Index.aspx?content=["+ (this.levelId + 1) + ","+ this.fieldContainer.logResult() + "]";
            xhr.open("GET",url , true);
            xhr.send();
        }
        this._winLayer.showStar(starNum);
        UserInfo.getCurrentUser().setCurrentLevelIndex(this.levelId + 1);
        UserInfo.getCurrentUser().setLevelStar(this.levelId,starNum);
        UserInfo.getCurrentUser().saveUserInfo();
    },
    restart : function () {

        ccs.actionManager.releaseActions();
        UserInfo.getCurrentUser().setCurrentLevelIndex(this.levelId);
        var tran = new cc.TransitionFade(1.2, new GameMainScene());
        cc.director.runScene(tran);
    },
    setPause : function () {

    },
      gotoLevelSelect : function () {
        ccs.actionManager.releaseActions();
        cc.director.runScene(new LevelSelectScene());
    },
    setGameOver : function () {

    },
    goToNextLevel:function(){
        UserInfo.getCurrentUser().setCurrentLevelIndex(this.levelId + 1);
        var tran = new cc.TransitionFade(1.2, new GameMainScene());
        cc.director.runScene(tran);
    }
});

var GameMainScene = cc.Scene.extend({

    ctor:function() {
        this._super();
        this.init();
    },

    init:function(){
        this._super();
        this.levelSelectLayer = new GameMainLayer();
        this.addChild(this.levelSelectLayer);
    },


    onEnter:function () {
        this._super();
    },

    onExit:function(){
        this._super();
    }
});
