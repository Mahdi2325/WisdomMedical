angular.module("sltcApp")
.controller('memberStatisticCtrl', ['$scope', 'resourceBase', function ($scope, resourceBase) {

    var orgId = $scope.orgId;
    if (!angular.isDefined(orgId) || orgId == "") {
        return;
    }

    var height = ($(document).height() - 80) / 2 - 40;
    $("#age").height(height);
    $("#sex").height(height);
    $("#symptom").height(height);
    $("#area").height(height);

    $.get(resourceBase + 'customer', { orgId: orgId }, function (data) {
        var ageData = [];
        var sexData = [];

        $.each(data, function (i, v) {
            if (v.type == "age") {
                ageData.push({ name: v.name, value: v.value });
            }
            if (v.type == "sex") {
                sexData.push({ name: v.name, value: v.value });
            }
        });

        //年龄
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('age'));

            var option = {
                color: ["#53B2FB", "#7FEC4A", "#F0B629", "#252540", "#87CEEB", "#4682B4", "#708090", "#6A5ACD"],
                title: {
                    text: '会员年龄分布图',
                    //subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: '年龄',
                        type: 'pie',
                        radius: '60%',
                        center: ['50%', '60%'],
                        label: {
                            normal: {
                                formatter: '{b}: {d}%'
                            }
                        },
                        data: ageData,
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
        //性别
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('sex'));

            var option = {
                color: ["#53B2FB", "#252540"],
                title: {
                    text: '会员性别分布图',
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
                        selectedMode: 'single',
                        type: 'pie',
                        radius: [0, '60%'],
                        center: ['50%', '60%'],
                        label: {
                            normal: {
                                position: 'inner',
                                formatter: '{b}: {d}%'
                            }
                        },
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
    });
    $.get(resourceBase + 'city-area', { orgId: orgId }, function (data) {

        var cityData = [];
        var areaData = [];

        $.each(data, function (i, v) {
            cityData.push(v.name);
            areaData.push(v.value1);
        });

        //区域
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('area'));

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '会员区域分布图',
                    x: 'center'
                    //subtext: '数据来自国家统计局'
                },
                tooltip: {},
                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: 50,
                    containLabel: true
                },
                xAxis: {
                    'type': 'category',
                    'axisLabel': { 'interval': 0 },
                    'data': cityData,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: 0,
                        textStyle: {
                            color: '#000000'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#cccccc'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '人数',
                    //show: false,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: {
                    name: '人数',
                    type: 'bar',
                    barWidth: $scope.barWidth,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: areaData
                }
            }

            myChart.setOption(option, true);
        }());

    });
    $.get(resourceBase + 'condition', { orgId: orgId }, function (data) {

        var conditionData = [];
        var symptomData = [];
        var healthData = [];
        var rotate = 0;
        $.each(data, function (i, v) {
            conditionData.push(v.name);
            symptomData.push(v.value);
            healthData.push(v.value1);
        });

        if (data.length > 7) {
            rotate = 45;
        }

        //常见病症数量
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('symptom'));

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '常见症状分析',
                    x: 'center'
                    //subtext: '数据来自国家统计局'
                },
                tooltip: {},
                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: 50,
                    containLabel: true
                },
                xAxis: {
                    'type': 'category',
                    'axisLabel': { 'interval': 0 },
                    'data': conditionData,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: rotate,
                        textStyle: {
                            color: '#000000'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#cccccc'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '人数',
                    //show: false,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: {
                    name: '人数',
                    type: 'bar',
                    barWidth: $scope.barWidth,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: symptomData
                }
            }

            myChart.setOption(option, true);
        }());
        //健康标签数量
        /*
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('health'));

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '健康标签数量',
                    x: 'center'
                    //subtext: '数据来自国家统计局'
                },
                tooltip: {},
                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: 50,
                    containLabel: true
                },
                xAxis: {
                    'type': 'category',
                    'axisLabel': { 'interval': 0 },
                    'data': conditionData,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: rotate,
                        textStyle: {
                            color: '#000000'
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#cccccc'
                        }
                    },
                    axisTick: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '人数',
                    //show: false,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: {
                    name: '人数',
                    type: 'bar',
                    barWidth: 16,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: healthData
                }
            }

            myChart.setOption(option, true);
        }());
        */
    });
}]);