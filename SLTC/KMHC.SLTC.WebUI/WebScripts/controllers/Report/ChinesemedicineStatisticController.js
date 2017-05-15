angular.module("sltcApp")
.controller('chinesemedicineStatisticCtrl', ['$scope', 'resourceBase', function ($scope, resourceBase) {

    var orgId = $scope.orgId;
    if (!angular.isDefined(orgId) || orgId == "") {
        return;
    }

    var height = ($(document).height() - 80) / 2 - 40;
    $("#sex").height(height);
    $("#age").height(height);
    $("#chinesemedicine").height(height);

    $.get(resourceBase + 'chinesemedicine', { orgId: orgId }, function (data) {

        var sexData = { x: [], y: [], d: [] };
        var ageData = { x: ['51-60岁', '61-70岁', '71-80岁', '81-90岁', '91-100岁', '100+岁'], y: [0, 0, 0, 0, 0, 0] };
        var chinesemedicineData = { x: [], y: [] };
        var chinesemedicineRotate = 0, ageRotate = 0;
        var index = 0;
        $.each(data, function (i, v) {
            // 性别
            index = sexData.x.indexOf(v.sex);
            if (index < 0) {
                index = sexData.x.push(v.sex);
                index--;
                sexData.y.push(0);
            }
            sexData.y[index]++;

            // 年龄分布
            index = parseInt((v.age - 51) / 10);
            ageData.y[index]++;

            // 中医体质分析
            var tmp = v.category.split("、")
            for (var j = 0; j < tmp.length; j++) {
                var item = tmp[j];
                index = chinesemedicineData.x.indexOf(item);
                if (index < 0) {
                    index = chinesemedicineData.x.push(item);
                    index--;
                    chinesemedicineData.y.push(0);
                }
                chinesemedicineData.y[index]++;
            }
        });
        if (ageData.x.length > 7) {
            ageRotate = 45;
        }
        $.each(sexData.x, function (i, v) {
            sexData.d.push({ name: v, value: sexData.y[i] });
        });
        //性别分布
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('sex'));

            var option = {
                color: ["#53B2FB", "#252540"],
                title: {
                    text: '性别分布',
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
                        data: sexData.d,
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
        //年龄分布
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('age'));

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '年龄分布',
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
                    'data': ageData.x,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: ageRotate,
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
                    data: ageData.y
                }
            }

            myChart.setOption(option, true);
        }());
        //中医体质分析
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('chinesemedicine'));

            var option = {
                color: ['#F0AD4E', '#5CB85C', '#428BCA'],
                title: {
                    text: '中医体质分析',
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
                    'data': chinesemedicineData.x,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: chinesemedicineRotate,
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
                    data: chinesemedicineData.y
                }
            }

            myChart.setOption(option, true);
        }());
    });
}]);