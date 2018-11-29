$(function () {
    var render = function (that) {
        getCartData(function (data) {
            $('.mui-table-view').html(template('cartTemplate', data));
            that && that.endPulldownToRefresh(); //关闭下拉涮新
        })
    };
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback: function () {
                    render(this);
                    // this.endPulldownToRefresh();
                }
            }
        }
    });

    //选择商品
    var $selBox = $(".mui-table-view");
    var $allSel = $(".lt-goods-balance").find('input');
    //全选
    $allSel.on('change', function () {
        var self = $(this);
        var isSel = self.prop('checked');
        setSel(self);
        $selBox.find('input').each(function () {
            $(this).prop('checked', isSel);
            setSel($(this));
        });
        countCart();
    });

    //单选
    $selBox.on('change', 'input', function () {
        setSel($(this)); //当前选中
        var len = $selBox.find('input:checked').length;
        //只要选中一个物品就计算总价
        $allSel.prop('checked', len > 0);
        setSel($allSel);
        countCart();
    })
});

//计算账单
var countCart = function () {
    var total = 0;
    var inputs = $(".mui-table-view").find('input:checked');
    var len = inputs.length;
    inputs.each(function () {
        var price = $(this).attr('data-price');
        var num = $(this).attr('data-num');
        total += price * num;
    });
    $('.lt-balance-price').html(total);
    $('.lt-balance-num').html(len);
};
//设置选中状态
var setSel = function (self) {
    var curCls = self.prop('checked') ? 'fa fa-check-circle' : 'fa fa-circle-thin';
    self.next('i').prop('class', curCls);
    //有物品被选中结算按钮可用
    var hasSel = $(".lt-goods-balance").find('input:checked');
    var btnCls = hasSel.length > 0? 'button active': 'button';
    $(".lt-goods-balance button").prop('class', btnCls);
};

/*getCartData*/
var getCartData = function (callback) {
    $server.ajaxFilter({
        url: API_USER_CART, //api - bug
        data: {
            page: 0,
            size: 100
        },
        success: function (data) {
            setTimeout(function () {
                callback && callback(data);
            }, 500);
        }
    })
};