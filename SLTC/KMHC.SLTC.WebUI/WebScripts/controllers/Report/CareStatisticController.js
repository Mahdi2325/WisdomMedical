angular.module("sltcApp")
.controller('careStatisticCtrl', ['$scope', 'resourceBase', function ($scope, resourceBase) {

    var orgId = $scope.orgId;
    if (!angular.isDefined(orgId) || orgId == "") {
        return;
    }

    var height = ($(document).height() - 80) / 2 - 40;
    $("#evaluationCategory").height(height);
    $("#executeNursePlanTotal").height(height);
    $("#centerActiveTotal").height(height);
    $("#evaluationAverage").height(height);

    $.get(resourceBase + 'evaluation', { orgId: orgId }, function (data) {
        var categoryData = { x: [], y: [] };
        var analysisData = { x: [], y: [] };
        var serviceData = { x: [], y: [] };
        $.each(data, function (i, v) {
            if (v.type == "evaluation") {
                categoryData.x.push(v.name);
                categoryData.y.push(v.value);
            }
            if (v.type == "service") {
                serviceData.x.push(v.name);
                serviceData.y.push(v.value);
            }
            if (v.type == "analysis") {
                analysisData.x.push(v.name);
                analysisData.y.push(v.value);
            }
        });

        //评估照护分类人数
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('evaluationCategory'));

            var option = {
                color: ['#5CB85C', '#F0AD4E'],
                title: {
                    text: '评估照护',
                    x: 'center'
                    //subtext: '数据来自国家统计局'
                },
                tooltip: {},
                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: 15,
                    containLabel: true
                },
                xAxis: {
                    'type': 'category',
                    'data': categoryData.x,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
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
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    barWidth: $scope.barWidth,
                    data: categoryData.y
                }
            }
            myChart.setOption(option, true);
        }());
        //照护问题分析
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('evaluationAverage'));

            var option = {
                color: ['#F0AD4E'],
                title: {
                    text: '照护问题分析',
                    x: 'center'
                    //subtext: '数据来自国家统计局'
                },
                tooltip: {},
                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: 15,
                    containLabel: true
                },
                xAxis: {
                    'type': 'category',
                    'data': analysisData.x,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
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
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    barWidth: $scope.barWidth,
                    data: analysisData.y
                }
            }

            myChart.setOption(option, true);
        }());
        //服务中心活动人次
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('centerActiveTotal'));

            var option = {
                color: ['#F0AD4E'],
                title: {
                    text: '服务中心活动人次',
                    x: 'center'
                    //subtext: '数据来自国家统计局'
                },
                tooltip: {},
                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: 15,
                    containLabel: true
                },
                xAxis: {
                    'type': 'category',
                    'data': serviceData.x,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
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
                    name: '人次',
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
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    barWidth: $scope.barWidth,
                    data: serviceData.y
                }
            }

            myChart.setOption(option, true);

            setInterval(function () {
                myChart.setOption({
                    series: {
                        data: []
                    }
                });
                myChart.setOption({
                    series: {
                        data: serviceData.y
                    }
                });
            }, 4000);
        }());
    });
    //在执行照护计划数量
    (function () {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('executeNursePlanTotal'));

        myChart.showLoading();
        $.get(resourceBase + 'worksheet-item', { orgId: orgId }, function (data) {
            myChart.hideLoading();

            var lineData = { x: [], y: [] };
            $.each(data, function (i, v) {
                lineData.x.push(v.name);
                lineData.y.push(v.value);
            });

            var option = {
                color: ['#EB6877'],
                title: {
                    text: '在执行照护计划数量',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        animation: false
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: 15,
                    containLabel: true
                },
                xAxis: {
                    'type': 'category',
                    'data': lineData.x,
                    splitLine: { show: false },
                    axisLabel: {
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
                    name: '数量',
                    boundaryGap: [0, '100%'],
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    }
                },
                series: [{
                    name: '数量',
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    lineStyle: {
                        normal: {
                            width: $scope.lineWidth
                        }
                    },
                    data: lineData.y
                }]
            };

            myChart.setOption(option, true);
        });
    }());
}]);