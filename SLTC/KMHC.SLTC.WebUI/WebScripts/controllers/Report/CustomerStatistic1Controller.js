angular.module("sltcApp")
.controller('customerStatistic1Ctrl', ['resourceBase', function (resourceBase) {
    $.get(resourceBase + 'customer', function (data) {
        var sexData = [];
        var healthData = [];
        var symptomData = [];
        var total = 0;
        $.each(data, function (i, v) {
            if (v.type == "sex") {
                sexData.push({ name: v.name, value: v.value });
                total += v.value;
            }
            if (v.type == "health") {
                healthData.push({ name: v.name, value: v.value });
            }
            if (v.type == "symptom") {
                symptomData.push({ name: v.name, value: v.value });
            }
        });

        $('#total').text("会员总数：" + total + "人");

        //性别
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('sex'));

            var option = {
                title: {
                    text: '会员性别分布',
                    //subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: '性别',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '60%'],
                        data: sexData,
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
        }());
        //会员健康情况分布
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('health'));

            var option = {
                title: {
                    text: '会员健康情况分布',
                    //subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: '健康情况',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '60%'],
                        data: healthData,
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
        }());
        //会员病种分布
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('symptom'));

            var option = {
                title: {
                    text: '会员病种分布',
                    //subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: '病种',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '60%'],
                        data: symptomData,
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
        }());
    });
    //会员地理位置分布图
    (function () {
        $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
            $.getScript("/Content/echarts/extension/bmap.min.js", function () {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('area'));

                myChart.showLoading();
                $.get(resourceBase + 'customer-map', function (data) {
                    myChart.hideLoading();

                    var convertData = function (data, latest) {
                        var res = [];
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            res.push({
                                name: data[i].name,
                                value: [data[i].lat, data[i].lon]
                            });
                        }
                        return res;
                    };

                    var option = {
                        title: {
                            text: '会员地理位置分布图',
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
                            }
                        ]
                    };

                    myChart.setOption(option);

                });
            }); //bmap
        }); //getscript

    }());
}]);