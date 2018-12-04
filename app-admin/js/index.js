$(function () {
    //get data
    var barData = [
        {name: '六月', num: 2130},
        {name: '七月', num: 3650},
        {name: '八月', num: 4452},
        {name: '九月', num: 5656},
        {name: '十月', num: 3636},
        {name: '十一月', num: 7852},
        {name: '十二月', num: 8899}
    ];
    var nameArr = [];
    var numArr = [];
    barData.forEach(function (item, i) {
        nameArr.push(item.name);
        numArr.push(item.num);
    });
    barCharts(nameArr, numArr);
    pieCharts();
});
//柱状图
var barCharts = function (nameArr, numArr) {
    var chartBox = document.getElementById('bar_chart');
    var barCharts = echarts.init(chartBox);
    var option = {
        title: {
            text: '每月新增用户'
        },
        color: ['#3398DB'],
        tooltip: {},
        legend: {
            data: ['人数']
        },
        xAxis: [
            {
                data: nameArr
            }
        ],
        yAxis: [{}],
        series: [
            {
                name: '人数',
                type: 'bar',
                barWidth: '50%',
                data: numArr
            }
        ]
    };
    barCharts.setOption(option);
};
//饼状图
var pieCharts = function () {
    echarts.init(document.getElementById('pie_chart')).setOption({
        title: {
            text: '热门商品销量',
            subtext: '2018年12月',
            x: 'center'
        },
        color: ['#9D3D3F', '#CA8269', '#A6C7B2', '#94859C', '#5B6356'],
        tooltip: {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['耐克', '阿迪达斯', '匡威', '艾力', '美特斯邦威']
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: 335, name: '耐克'},
                    {value: 310, name: '阿迪达斯'},
                    {value: 234, name: '匡威'},
                    {value: 135, name: '艾力'},
                    {value: 548, name: '美特斯邦威'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    })
};