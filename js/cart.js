$(function () {
    var render = function (that) {
        getCartData(function (data) {
            // console.log(data);
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
});
/*getCartData*/
var getCartData = function (callback) {
    $server.ajaxFilter({
        url: API_USER_CART,
        data: {
            page: 0,
            size: 100
        },
        success: function (data) {
            console.log(data);
            setTimeout(function () {
                callback && callback(data);
            }, 500);
        }
    })
};