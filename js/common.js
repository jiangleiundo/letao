var _utility = {
    /**
     * 解析URL传参
     * @param {Object} name
     */
    getQueryString: function (name) {
        var after = window.location.search;
        if (after.indexOf('?') === -1) return null; //如果url中没有传参直接返回空

        //先通过search取值如果取不到就通过hash来取
        after = after.substr(1) || window.location.hash.split("?")[1];

        if (after) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = after.match(reg);
            if (r != null) {
                return decodeURIComponent(r[2]);
            }
            else {
                return null;
            }
        }
    },
    /**
     * is a string empty
     * @param str [string]
     * @returns {boolean}
     */
    isEmpty: function (str) {
        var res = false;
        try {
            res = !str || str === "''" || str === "" || str == null || str === '{}' || str === '[]' || str === '0';
        } catch (e) {
            res = false;
        }
        return res;
    },
    serialize2Obj: function (serializeStr) {
        var obj = {};
        if (!_utility.isEmpty(serializeStr)) {
            var arr = serializeStr.split('&');
            arr.forEach(function (item, i) {
                var itemArr = item.split('=');
                obj[itemArr[0]] = itemArr[1];
            })
        }
        return obj;
    }
};

var _dialog = {
    /**
     * 弹框确认
     * @param msg [string]
     * @param btn [array]
     * @param callback [fn]
     */
    confirm: function (msg, btn, callback) {
        mui.confirm(msg, '', btn, function (e) {
            if (e.index === 1) {//e.index值从左到右0,1..对应btn['btn1','btn2']
                callback && callback();
            }
        })
    },
    /**
     * 消息提示框
     * @param msg [string]
     * @param duration [string 提示框显示时间]
     * @param type [string]
     */
    toast: function (msg, duration, type) {
        mui.toast(msg, {duration: duration, type: type})
    }
};
