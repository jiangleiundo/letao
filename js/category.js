$(function () {
	getFirstCategory(function (data) {
		$('.lt-category-nav').find('ul').html(template('firstCategory', data));
		//默认选择第一个分类
		getSecondCategory({id: data.rows[0].id}, function(data){
			$('.lt-category-con').find('ul').html(template('secondCategory', data));
		})
	});

	//一级菜单绑定点击事件
	$('.lt-category-nav').on('tap', 'ul li a', function(){
		//当前点击对象选中
		$('.lt-category-nav').find('a').removeClass('active');
		$(this).addClass('active');
		//根据一级分类id获取二级分类数据
	  var curCategoryId = $(this).attr('data-id');
		getSecondCatgory({id: curCategoryId}, function(data){
			$('.lt-category-con').find('ul').html(template('secondCategory', data));
		})
	})


});

//获取一级分类
var getFirstCategory = function (callback) {
	$server.ajax(API_GET_FIRST_CATEGORY, 'get', {}, function (data) {
		callback && callback(data);
	})
};

//获取二级分类
var getSecondCategory = function (params, callback) {
	$server.ajax(API_GET_SECOND_CATEGORY, 'get', params, function (data) {
		callback && callback(data);
	})
};