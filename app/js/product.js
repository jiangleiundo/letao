$(function () {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false
    });

    //商品ID
    var pId = _utility.getQueryString('id');
    //render data
    var render = function (){
        getProductDetail({id: pId}, function (data) {
            $('.mui-scroll').html(template('pDetail', data));
            mui('.mui-slider').slider({
                interval: 5000
            });

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
        });
    };
    render();

    //reload
    $('.lt-header').on('tap', '.fa-refresh', function (){
        $('.mui-scroll').html('<div id="loading"><div class="box">加载中···</div></div>');
        render();
    });
    //add to cart
    $('.lt-trade-nav').on('tap', '.mui-btn-grey', function (){
        if(window.addFlag){ //avoid repeat submit
            return false;
        }
        var params = {
            productId: pId,
            size: $('.lt-product-size').find('.active').html(),
            num: $('.lt-product-num').find('.mui-input-numbox').val()
        };
        //validate
        if(_utility.isEmpty(params.productId)){
            _dialog.toast('商品异常');
            return false;
        }
        if(_utility.isEmpty(params.size)){
            _dialog.toast('请选择尺码');
            return false;
        }
        //send data
        $server.ajaxFilter({
            url: API_ADD_CART,
            type: 'post',
            data: params,
            dataType: 'json',
            beforeSend: function () {
                window.addFlag = true;
            },
            success: function (data){
                if(data.success){
                    _dialog.confirm('加入购物车成功,去购物车看看？', ['去看看', '继续浏览'], function (){
                        location.href = URL_USER_CART
                    })
                }else{
                    _dialog.toast('添加失败')
                }
                window.addFlag = false;
            },
            error: function (){
                _dialog.toast('网络忙...');
                window.addFlag = false;
            }
        })
    })
});

//获取商品详情
var getProductDetail = function (params, callback) {
    $server.ajax(API_GET_PRODUCT_INFO, 'get', params, function (data) {
        callback && callback(data);
    })
};