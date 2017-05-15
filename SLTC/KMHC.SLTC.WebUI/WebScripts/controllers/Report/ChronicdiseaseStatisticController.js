angular.module("sltcApp")
.controller('chronicdiseaseStatisticCtrl', ['$scope', 'resourceBase', function ($scope, resourceBase) {

    var orgId = $scope.orgId;
    if (!angular.isDefined(orgId) || orgId == "") {
        return;
    }

    var height = ($(document).height() - 80) / 2 - 40;
    $("#sex").height(height);
    $("#age").height(height);
    $("#area").height(height);
    $("#symptom").height(height);
    $("#health").height(height);

    $.get(resourceBase + 'dm', { orgId: orgId }, function (data) {

        var visitData = { x: [], y: [], d: [] };
        var sexData = { x: [], y: [], d: [] };
        var index = 0;
        $.each(data, function (i, v) {
            // 2型糖尿病当前随访情况
            index = visitData.x.indexOf(v.visit);
            if (index < 0) {
                index = visitData.x.push(v.visit);
                index--;
                visitData.y.push(0);
            }
            visitData.y[index]++;

            // 2型糖尿病性别分布
            index = sexData.x.indexOf(v.sex);
            if (index < 0) {
                index = sexData.x.push(v.sex);
                index--;
                sexData.y.push(0);
            }
            sexData.y[index]++;
        });

        $.each(visitData.x, function (i, v) {
            visitData.d.push({ name: v, value: visitData.y[i] });
        });
        $.each(sexData.x, function (i, v) {
            sexData.d.push({ name: v, value: sexData.y[i] });
        });

        //当前随访情况
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('age'));

            var option = {
                color: ["#53B2FB", "#252540"],
                title: {
                    text: '2型糖尿病当前随访情况',
                    //subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: '当前随访情况',
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
                        data: visitData.d,
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
        //型糖尿病性别分布
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('sex'));

            var option = {
                color: ["#53B2FB", "#252540"],
                title: {
                    text: '2型糖尿病性别分布',
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
    });
    $.get(resourceBase + 'hbp', { orgId: orgId }, function (data) {
        console.log(data);
        var dangerData = { x: [], y: [] };
        var ageData = { x: ['51-60岁', '61-70岁', '71-80岁', '81-90岁', '91-100岁', '100+岁'], y: [0, 0, 0, 0, 0, 0] };
        var sourceData = { x: [], y: [] };
        var dangerRotate = 0, ageRotate = 0, sourceRotate = 0;
        var index = 0;
        $.each(data, function (i, v) {
            // 高血压危险分层分析
            index = dangerData.x.indexOf(v.danger);
            if (index < 0) {
                index = dangerData.x.push(v.danger);
                index--;
                dangerData.y.push(0);
            }
            dangerData.y[index]++;

            // 高血压年龄分布
            index = parseInt((v.age - 51) / 10);
            ageData.y[index]++;

            // 高血压病人来源分析
            index = sourceData.x.indexOf(v.source);
            if (index < 0) {
                index = sourceData.x.push(v.source);
                index--;
                sourceData.y.push(0);
            }
            sourceData.y[index]++;
        });

        if (dangerData.x.length > 7) {
            dangerRotate = 45;
        }
        if (ageData.x.length > 7) {
            ageRotate = 45;
        }
        if (sourceData.x.length > 7) {
            sourceRotate = 45;
        }

        //高血压危险分层分析
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('area'));

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '高血压危险分层分析',
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
                    'data': dangerData.x,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: dangerRotate,
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
                    data: dangerData.y
                }
            }

            myChart.setOption(option, true);
        }());
        //高血压年龄分布
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('symptom'));

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '高血压年龄分布',
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
        //高血压病人来源分析
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('health'));

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '高血压病人来源分析',
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
                    'data': sourceData.x,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: sourceRotate,
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
                    data: sourceData.y
                }
            }

            myChart.setOption(option, true);
        }());
    });
}]);