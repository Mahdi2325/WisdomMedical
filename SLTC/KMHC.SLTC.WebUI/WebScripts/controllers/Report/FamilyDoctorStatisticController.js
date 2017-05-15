angular.module("sltcApp")
.controller('familyDoctorStatisticCtrl', ['$scope', 'resourceBase', function ($scope, resourceBase) {

    var orgId = $scope.orgId;
    if (!angular.isDefined(orgId) || orgId == "") {
        return;
    }

    var height = ($(document).height() - 80) / 2 - 40;
    $("#pie").height(height);
    $("#org").height(height);
    $("#care").height(height);

    $.get(resourceBase + 'family-doctor', { orgId: orgId }, function (data) {

        var pieData = { contract: 0, chronicdisease: 0, d: [] };
        var orgData = { x: [], y: [], d:[] };
        var index = 0;
        $.each(data, function (i, v) {
            // 三级机构转诊分析
            index = orgData.x.indexOf(v.org2);
            if (index < 0) {
                index = orgData.x.push(v.org2);
                index--;
                orgData.y.push(0);
            }
            orgData.y[index]++;
        });

        pieData.contract = pieData.contract + data.length;

        $.get(resourceBase + 'hbp', { orgId: orgId }, function (data) {
            pieData.chronicdisease = pieData.chronicdisease + data.length;
            $.get(resourceBase + 'dm', { orgId: orgId }, function (data) {
                pieData.chronicdisease = pieData.chronicdisease + data.length;

                pieData.d.push({ name: "签约数", value: pieData.contract });
                pieData.d.push({ name: "慢病患者人数", value: pieData.chronicdisease });

                //var title = "签约数: " + pieData.contract + " 慢病患者人数: " + pieData.chronicdisease + " 转诊率: " + (pieData.contract / pieData.chronicdisease).toFixed(3);
                var title = "转诊率: " + (pieData.contract * 100 / pieData.chronicdisease).toFixed(1) + "%";
                //转诊率
                (function () {
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('pie'));

                    var option = {
                        color: ["#53B2FB", "#252540"],
                        title: {
                            text: title,
                            //subtext: '纯属虚构',
                            x: 'center'
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        series: [
                            {
                                name: '签约情况',
                                selectedMode: 'single',
                                type: 'pie',
                                radius: [0, '60%'],
                                center: ['50%', '60%'],
                                label: {
                                    normal: {
                                        position: 'inner',
                                        formatter: '{b}: {c}'
                                    }
                                },
                                data: pieData.d,
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
        });
        //三级机构转诊分析
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('org'));

            var option = {
                color: ['#428BCA', '#5CB85C', '#F0AD4E'],
                title: {
                    text: '三级机构转诊分析',
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
                    'data': orgData.x,
                    splitLine: { show: false },
                    axisLabel: {
                        interval: 0,
                        rotate: 45,
                        textStyle: {
                            color: '#000000'
                        },
                        formatter: function (value, index) {
                            var result = value;
                            if (result.length > 6) {
                                result = result.substring(0, 6) + "..";
                            }
                            return result;
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
                    data: orgData.y
                }
            }

            myChart.setOption(option, true);
        }());

    });
    // 特殊人群管理分析
    $.get(resourceBase + 'care', { orgId: orgId }, function (data) {

        var careData = { x: ['70岁以上老人', '80岁以上老人', '百岁老人', '老干部', '残疾人', '军烈属', '伤残军人', '社会孤老', '老归侨', '独生子女', '退休劳模'], y: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
        var index = 0;
        $.each(data, function (i, v) {
            if (v.b1) { careData.y[0]++; }
            if (v.b2) { careData.y[1]++; }
            if (v.b3) { careData.y[2]++; }
            if (v.b4) { careData.y[3]++; }
            if (v.b5) { careData.y[4]++; }
            if (v.b6) { careData.y[5]++; }
            if (v.b7) { careData.y[6]++; }
            if (v.b8) { careData.y[7]++; }
            if (v.b9) { careData.y[8]++; }
            if (v.b10) { careData.y[10]++; }
            if (v.b11) { careData.y[11]++; }
        });


        //家庭医生签约老人特殊关爱情况分析
        (function () {
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('care'));

            var option = {
                color: ['#F0AD4E', '#5CB85C', '#428BCA'],
                title: {
                    text: '家庭医生签约老人特殊关爱情况分析',
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
                    'data': careData.x,
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
                    data: careData.y
                }
            }

            myChart.setOption(option, true);
        }());

    });
}]);