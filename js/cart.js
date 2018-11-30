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
                    // render(this);
                    this.endPulldownToRefresh();
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
    });

    //编辑商品
    $selBox.on('tap', '.mui-icon-compose', function () {
        var id = $(this).parent().attr('data-id');
        var item = _utility.getItemById(window.cartData.data, id);
        var html = template('cartEdit', item).replace(/\n/g, ''); //将获取的HTML字符串换行符替换成空防止自动生成<br>

        _dialog.confirm(html, ['确定', '取消'], function () {
            modalEvent();
            var params = {
                id: id,
                size: $('.lt-product-size').find('.active').html(),
                num: $('.lt-product-num').find('.mui-input-numbox').val()
            };
            $server.ajaxFilter({
                url: API_UPDATE_CART,
                type: 'post',
                data: params,
                success: function (data) {
                    if (data.success) {
                        _dialog.close(); //弹框关闭
                        // render();//重新渲染数据但这样需要调接口
                        //还可以利用缓存数据，修改item后window.cartData也修改了(因为item和cartData引用内存中的同一个数据)可以直接替换data完成新数据渲染
                        item.size = params.size;
                        item.num = params.num;
                        $('.mui-table-view').html(template('cartTemplate', window.cartData));
                    }
                }
            });
        }, '编辑商品');
    });

    //删除商品
    $selBox.on('tap', '.mui-icon-trash', function () {
        var self = $(this);
        var id = $(this).parent().attr('data-id');
        _dialog.confirm('你确定要删除该商品？', ['确定', '取消'], function () {
            var params = {
                id: id
            };
            $server.ajaxFilter({
                url: API_DEL_CART,
                type: 'get',
                data: params,
                success: function (data) {
                    if (data.success) {
                        _dialog.close(); //弹框关闭
                        //去掉<li>这条数据即可因为没有分页没有必要重新调接口
                        self.parent().parent().remove();
                    }
                }
            });
        }, '删除商品');
    });
});

/*弹框中的事件绑定,如果不能绑定成功就利用委托绑定*/
var modalEvent = function () {
    //选择尺寸
    $('.lt-product-size').on('tap', 'span', function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    //选择数量
    var $productNum = $('.lt-product-num');
    var $maxNum = parseInt($productNum.find('.mui-numbox').attr('data-max'));
    var $input = $productNum.find('.mui-input-numbox');

    $productNum.on('tap', '.mui-btn-numbox-minus', function () {
        var curNum = parseInt($input.val());
        if (curNum > 1) {
            $input.val(--curNum);
        } else {
            _dialog.toast('至少选择一件');
        }
    });
    $productNum.on('tap', '.mui-btn-numbox-plus', function () {
        var curNum = Number($input.val());
        if (curNum < $maxNum) {
            $input.val(++curNum);
        } else {
            _dialog.toast('提醒卖家补货');
        }
    });
};

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
    total = Math.floor(total * 100) / 100; //最多两位小数
    $('.lt-balance-price').html(total);
    $('.lt-balance-num').html(len);
};
//设置选中状态
var setSel = function (self) {
    var curCls = self.prop('checked') ? 'fa fa-check-circle' : 'fa fa-circle-thin';
    self.next('i').prop('class', curCls);
    //有物品被选中结算按钮可用
    var hasSel = $(".lt-goods-balance").find('input:checked');
    var btnCls = hasSel.length > 0 ? 'button active' : 'button';
    $(".lt-goods-balance button").prop('class', btnCls);
};

/*getCartData*/
var getCartData = function (callback) {
    $server.ajaxFilter({
        url: API_USER_CART, //api - bug数据库异常
        data: {
            page: 0,
            pageSize: 100
        },
        success: function (data) {
            window.cartData = data; //存全局变量方便编辑时使用数据
            callback && callback(data);
        }
    })
};