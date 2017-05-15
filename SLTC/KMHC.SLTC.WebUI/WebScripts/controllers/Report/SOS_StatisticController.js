angular.module("sltcApp")
.controller('SOS_StatisticCtrl', ['resourceBase', function (resourceBase) {

    $.get(resourceBase + 'sos', function (data) {
        $('#total').text("当日紧急求救总数：" + data[0].total + "次");
    });

    //紧急求救每日数量变化柱状图
    (function () {

        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('sosByDay'));

        myChart.showLoading();
        $.get(resourceBase + 'sos-item', function (data) {
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
                    text: '紧急求救每日数量',
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
    //紧急求救位置分布图
    (function () {
        $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
            $.getScript("/Content/echarts/extension/bmap.min.js", function () {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('sosMap'));

                myChart.showLoading();
                $.get(resourceBase + 'sos-map', function (data) {
                    myChart.hideLoading();

                    var convertData = function (data, latest) {
                        var res = [];
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            if (item.latest == latest) {
                                res.push({
                                    name: data[i].name,
                                    value: [data[i].lat, data[i].lon]
                                });
                            }
                        }
                        return res;
                    };

                    var option = {
                        title: {
                            text: '紧急求救位置分布图',
                            //subtext: 'data from PM25.in',
                            //sublink: 'http://www.pm25.in',
                            left: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a}：{b}"
                        },
                        bmap: {
                            center: [104.114129, 37.550339],
                            zoom: 5,
                            roam: true,
                        },
                        series: [
                            {
                                name: '姓名',
                                type: 'scatter',
                                coordinateSystem: 'bmap',
                                data: convertData(data, false),
                                symbolSize: function (val) {
                                    //return val[2] / 10;
                                    return 8;
                                },
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: false
                                    },
                                    emphasis: {
                                        show: true
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'purple'
                                    }
                                }
                            },
                            {
                                name: '最近求救记录',
                                type: 'effectScatter',
                                coordinateSystem: 'bmap',
                                data: convertData(data, true),
                                symbolSize: function (val) {
                                    return 16;
                                },
                                showEffectOn: 'render',
                                rippleEffect: {
                                    brushType: 'stroke'
                                },
                                hoverAnimation: true,
                                label: {
                                    normal: {
                                        formatter: '{b}',
                                        position: 'right',
                                        show: true
                                    }
                                },
                                itemStyle: {
                                    normal: {
                                        color: 'purple',
                                        shadowBlur: 10,
                                        shadowColor: '#333'
                                    }
                                },
                                zlevel: 1
                            }
                        ]
                    };

                    myChart.setOption(option);

                });
            }); //bmap
        }); //getscript

    }());
}]);