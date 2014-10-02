
/****************************************************************************
Create by huaiyao' CocostudioCodeCreate  Tool 
Copyright (c) 2014 ledou 
****************************************************************************/ 

var LevelSelectLayer= cc.Layer.extend({ 
	//初始化控件变量为空
	_btnFormer : null,
	_btnNext : null,
	_btnBackHome : null,
    _paneLevel:null,

    _rowNum : 5,
    _colNum : 4,

    _currentPage:0,
    _totalLevelNum:52,
    _totalPageNum:0,
    _listItem:null,

	ctor:function (){
		this._super();
		this.init();
	},
	//界面初始化，为控件变量赋值
	init:function (){
		this._super();
        this._listItem = [];
		var root = ccs.uiReader.widgetFromJsonFile(res.j_LevelSelectLayer_json);;
		this.addChild(root);
		var offx = (cc.director.getWinSize().width - root.getContentSize().width) / 2;
		var offy = (cc.director.getWinSize().height - root.getContentSize().height) / 2;
		root.setPosition(cc.p(offx,offy));
		//初始化控件
        this._paneLevel = GlobalFunction.getCocosWidget(root, "pane_level");
		this._btnFormer = GlobalFunction.getCocosWidget(root, "btn_former");
		this._btnFormer.addTouchEventListener(this.onBtnFormerEvent,this);
		this._btnNext = GlobalFunction.getCocosWidget(root, "btn_next");
		this._btnNext.addTouchEventListener(this.onBtnNextEvent,this);
		this._btnBackHome = GlobalFunction.getCocosWidget(root, "btn_backHome");
		this._btnBackHome.addTouchEventListener(this.onBtnBackHomeEvent,this);

        this._totalLevelNum = UserInfo.getCurrentUser().getTotalLevelNum();
        this._totalPageNum = parseInt((this._totalLevelNum - 1) / (this._rowNum * this._colNum)) + 1;

        this._currentPage = 0;
        this.initLevelWithInfo(this._currentPage);



	},

    initLevelWithInfo:function(page){
        var page = this._currentPage;
        if(this._totalPageNum == 1){
            GlobalFunction.setButtonEnabled(this._btnFormer,false);
            GlobalFunction.setButtonEnabled(this._btnNext,false);
        }
        else if(this._currentPage == 0){
            GlobalFunction.setButtonEnabled(this._btnFormer,false);
            GlobalFunction.setButtonEnabled(this._btnNext,true);
        }
        else if(this._currentPage == this._totalPageNum - 1){
            GlobalFunction.setButtonEnabled(this._btnFormer,true);
            GlobalFunction.setButtonEnabled(this._btnNext,false);
        }
        else{
            GlobalFunction.setButtonEnabled(this._btnFormer,true);
            GlobalFunction.setButtonEnabled(this._btnNext,true);
        }

        for(var i = 0 ;i < this._rowNum ; i++){
            for(var j = 0 ;j< this._colNum ; j++){

                var index = this._colNum * i + j;
                var leveIndex = (this._rowNum * this._colNum * page) + this._colNum * i + j;
                var starNum = UserInfo.getCurrentUser().getLevelStar(leveIndex);
                if(index > this._listItem.length - 1){
                    var x = 60 + j * 110;
                    var y = 530 - i * 110;

                    var item = new LevelSelectItem(leveIndex,starNum);
                    this._paneLevel.addChild(item);
                    item.setPosition(cc.p(x,y));
                    this._listItem.push(item);

                    UserInfo.getCurrentUser().setLevelStar(leveIndex,2);
                }
                else{
                    if(leveIndex >= this._totalLevelNum){
                        var item = this._listItem[index];
                        item.setVisible(false);
                    }
                    else{
                        var item = this._listItem[index];
                        item.setVisible(true);
                        item.resetStar(leveIndex,starNum);
                    }
                }
            }
        }

        UserInfo.getCurrentUser().saveUserInfo();
    },



	onBtnFormerEvent : function(sender, type){
		if(type == ccui.Widget.TOUCH_ENDED){
            this._currentPage --;
            this.initLevelWithInfo(this._currentPage);
		}
	},
	onBtnNextEvent : function(sender, type){
		if(type == ccui.Widget.TOUCH_ENDED){
            this._currentPage ++;
            this.initLevelWithInfo(this._currentPage);
		}
	},
	onBtnBackHomeEvent : function(sender, type){
		if(type == ccui.Widget.TOUCH_ENDED){
		}
	}
});