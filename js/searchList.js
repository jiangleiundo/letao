$(function () {
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});

	//获取URL传递的参数
	var key = _utility.getQueryString('key') || '';
	var $input = $('.search-input');
	$input.val(key); //将传递过来的key放在搜索框中

	var curPage = 1; //当前渲染页面
	var pageSize = 4; //每页显示条数

	//渲染商品页面
	var render = function (source, callback) {
		var params = {
			proName: key,
			page: curPage,
			pageSize: pageSize
		};
		params = $.extend(params, source || {});
		getSearchData(params, function (data) {
			var method = curPage === 1? 'html': 'append';
			$('.lt-goods-con')[method](template('goodsList', data));
			callback && callback();//加载完数据执行回调
		})
	};

	//初始化渲染
	render();

	//搜索商品
	$('.search-btn').on('tap', function () {
		key = getKey($input);
		if (!key) {
			_dialog.toast('请输入关键字');
			return null;
		}
		render();
	});

	//按条件排序默认降序
	$('.lt-goods-nav > a').on('tap', function () {
		var self = $(this);
		var $i = self.find('i');

		if (self.hasClass('active')) { //当前已选中状态点击只改变箭头方向
			var curCls = $i.hasClass('fa-angle-down') ? 'fa fa-angle-up' : 'fa fa-angle-down';
			$i.prop('class', curCls);
		} else { //点击非选中时
			self.addClass('active').siblings().removeClass('active').find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
		}

		key = getKey($input);
		var order = self.attr('data-type');
		var orderType = $i.hasClass('fa-angle-up') ? 1 : 2;
		var params = {};
		params[order] = orderType;
		render(params);
	});

	//下拉刷新上拉加载
	mui.init({
		pullRefresh: {
			container: "#refreshContainer",//下拉刷新容器标识
			down: { //上拉刷新
				callback: function () {
					var self = this;
					curPage = 1;
					render(null, function () {
						self.endPulldownToRefresh();
					})
				}
			},
			up: { //下拉加载
				callback: function () {
					var self = this;
					curPage++;
					render(null, function () {
						self.endPullupToRefresh();
					})
				}
			}
		}
	});
});

//获取input中的value
var getKey = function (input) {
	return $.trim(input.val());
};

//获取产品列表
var getSearchData = function (params, callback) {
	$server.ajax(API_GET_PRODUCT, 'get', params, function (data) {
		callback && callback(data);
	})
};