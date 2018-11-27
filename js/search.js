$(function () {
	mui('.mui-scroll-wrapper').scroll({
		indicators: false //是否显示滚动条
	});
	//mui.init()中配置参数
	mui.init( { gestureConfig:{
		tap: true, //默认为true
		longtap: true //默认为false
		//doubletap: true, //默认为false
		//swipe: true, //默认为true
		//drag: true, //默认为true
		//hold:true,//默认为false，不监听
		//release:false//默认为false，不监听
	}});

	//获取本地存储的搜索记录渲染数据
	var $input = $('.search-input');
	var $history = $('.lt-search-history');

	var historyList = getLocalSearchData();
	$history.html(template('historyTpl', {list: historyList}));
	$input.val('');//获取搜索列表后清空搜索框中内容

	//点击搜索
	$('.search-btn').on('tap', function () {
		var key = $.trim($input.val());
		if (!key) {
			_dialog.toast('请输入关键字');
			return false;
		}

		/*搜索历史保留最近的10次搜索关键词，每一次搜索的关键词都用本地存储而且关键词要去重*/
		var arr = getLocalSearchData();
		if (arr.indexOf(key) == -1) { //先判断搜索关键词是否已存，未找到就添加进数组
			arr.push(key);
			if (arr.length > 10) { //如果数组长度大于10，最后一个元素删除
				arr.shift(); //删除数组第一个元素
			}
		} else { //先删除重复的元素在数组最后添加
			var index = arr.indexOf(key);
			arr.splice(index, 1);
			arr.push(key);
		}
		//本地存储
		localStorage.setItem('searchHistory', JSON.stringify(arr));
		/*跳转搜索列表*/
		location.href = 'searchList.html?key=' + key;
	});

	//删除所有记录
	$history.on('tap', '.fa-trash-o', function(){
		_dialog.confirm('确认删除历史记录？', ['取消','确认'], function(){
			localStorage.setItem('searchHistory', '');
			//重新渲染数据
			$history.html(template('historyTpl', {list: []}))
		})
	});

	//删除一条数据
	$history.on('longtap', 'a', function(){
		var index = $(this).attr('data-index');
		var arr = getLocalSearchData();
		_dialog.confirm('确认删除该历史记录？',['取消','确认'], function(){
			arr.splice(index, 1); //确认删除
			//重新存储数据
			localStorage.setItem('searchHistory', JSON.stringify(arr));
			//重新渲染数据
			$history.html(template('historyTpl', {list: arr}));
		})
	});

	//单击跳转
	$history.on('tap', 'a', function(){
		location.href = $(this).attr('data-href');
	})
});

//获取本地存储的搜索数据
var getLocalSearchData = function () {
	var str = localStorage.getItem('searchHistory') || '[]';
	return JSON.parse(str);
};

