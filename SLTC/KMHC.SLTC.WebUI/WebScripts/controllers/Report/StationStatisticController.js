angular.module("sltcApp")
.controller('stationStatisticCtrl', ['resourceBase', function (resourceBase) {

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('container'));

    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $.getScript("/Content/echarts/extension/bmap.min.js", function () {
            myChart.showLoading();
            $.get(resourceBase + 'city', function (data) {
                myChart.hideLoading();

                $('#total').text("全国共有" + data.length + "个医养站");
                var convertData = function (data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        res.push({
                            name: data[i].name,
                            value: [data[i].lat, data[i].lon, data[i].v1]
                        });
                    }
                    return res;
                };

                var option = {
                    title: {
                        text: '医养站分布图',
                        //subtext: 'data from PM25.in',
                        //sublink: 'http://www.pm25.in',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    bmap: {
                        center: [104.114129, 37.550339],
                        zoom: 5,
                        roam: true,
                    },
                    series: [
                        {
                            name: '医养站',
                            type: 'scatter',
                            coordinateSystem: 'bmap',
                            data: convertData(data),
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

}]);