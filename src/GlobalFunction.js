/**
 * Created by jopi on 14-10-2.
 */

var GlobalFunction = {};

/**
 * 根据名称获取对应控件
 * @param root 父节点
 * @param widgetName 控件名称
 * @returns {*}
 */
GlobalFunction.getCocosWidget = function(root, widgetName){
    var result = ccui.helper.seekWidgetByName(root, widgetName);
    if(result == null || result == undefined) {cc.log("can not find " + widgetName);return null;}
    return result;
};

/**
 * 获取json中键值对应的值
 * @param {Object} dic josn对象
 * @param {String} keyName  键
 * @param defaultValue 默认值
 * @returns {*}
 */
GlobalFunction.getDicValue = function(dic, keyName,defaultValue,beignore){
    var result = null;
    result = dic[keyName];
    if(result == undefined)
    {
        result = defaultValue;
        if(beignore == undefined || beignore == false)
        {
            cc.log("the object do not contain key :" + keyName);
        }

    }
    return result;
};

GlobalFunction.setButtonEnabled = function(btn,beEnable){
    btn.setEnabled(beEnable);
    btn.setBright(beEnable);
};