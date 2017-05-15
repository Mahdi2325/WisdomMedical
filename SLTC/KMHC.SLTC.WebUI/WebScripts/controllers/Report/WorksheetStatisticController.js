angular.module("sltcApp")
.controller('worksheetStatisticCtrl', ['resourceBase', function (resourceBase) {
    //工单每日数量变化柱状图
    (function () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('workByDay'));


        myChart.showLoading();
        $.get(resourceBase + 'worksheet-item', function (data) {
            myChart.hideLoading();

            var postion = 0;
            var xData = [];
            var yData = [];

            var init = function () {
                xData = [];
                yData = [];
                postion = 0;
                for (var i = 0; i < 4; i++) {
                    xData.push(data[postion].name);
                    yData.push(data[postion].value);
                    postion++;
                }
            };

            init();

            var option = {
                color: ['#428BCA'],
                title: {
                    text: '工单每日数量',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    //formatter: function (params) {
                    //    params = params[0];
                    //    return params.name + ' : ' + params.value[1];
                    //},
                    axisPointer: {
                        animation: false
                    }
                },
                xAxis: {
                    type: 'category',
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        interval: 0,
                        formatter: function (params) {
                            var tmp = params.split('-');
                            if (tmp[2] == "01")
                                return tmp[0] + '-' + tmp[1] + '-' + tmp[2];
                            else
                                return tmp[1] + '-' + tmp[2];
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    data: xData
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    splitLine: {
                        show: false
                    }
                },
                series: [{
                    name: '数量',
                    type: 'bar',
                    showSymbol: false,
                    hoverAnimation: false,
                    barWidth: 20,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: yData
                }]
            };

            var timeTicket = setInterval(function () {

                if (postion == data.length) {
                    init();
                }

                if (xData.length > 10) {
                    xData.shift();
                    yData.shift();
                }

                xData.push(data[postion].name);
                yData.push(data[postion].value);
                postion++;

                myChart.setOption({
                    xAxis: {
                        data: xData
                    },
                    series: [{
                        data: yData
                    }]
                });
            }, 2000);

            myChart.setOption(option, true);
        });
    }());
    //工单状态
    (function () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('workState'));

        myChart.showLoading();
        $.get(resourceBase + 'worksheet', function (data) {
            myChart.hideLoading();

            var total = 0;
            var legendData = [];
            $.each(data, function (i, v) {
                total += v.value;
                legendData.push(v.name);
            });
            $('#total').text("共有" + total + "张工单");

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '工单状态',
                    //subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: legendData
                },
                series: [
                    {
                        name: '工单状态',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '60%'],
                        data: data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };

            myChart.setOption(option, true);
        });
    }());
}]);