$(function(){
	mui('.mui-scroll-wrapper').scroll({
		indicators: false, //是否显示滚动条
		deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
	});
	mui('.mui-slider').slider({
		interval: 3000 //图片轮播3s
	})
});