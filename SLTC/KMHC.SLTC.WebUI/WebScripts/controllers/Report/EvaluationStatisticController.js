angular.module("sltcApp")
    .controller('EvaluationStatisticCtrl', ['$scope', 'resourceFactory', function ($scope, resourceFactory) {

            $scope.taskList = [];
            //查询选项
            $scope.options = {};
            $scope.options.params = {};
            $scope.currentEmployeeName = "";


            var taskRes = resourceFactory.getResource("evaluatedTaskRes");

            //查询所有
            $scope.init = function () {
                $scope.options = {
                    buttons: [],
                    ajaxObject: taskRes,
                    params: { organizationID: $scope.$root.user.OrgId },
                    success: function (data) {
                        $scope.taskList = data.Data;
                    },
                    pageInfo: { //分页信息
                        CurrentPage: 1,
                        PageSize: 8
                    }
                }
            }

            $scope.init();

            $scope.employeeClick = function (item) {
                $scope.currentEmployeeName = item.EmployeeName;
                $scope.getEvaluationSummaryInfo(item.EmployeeId);
            };

            $scope.search = function () {
                $scope.options.pageInfo.CurrentPage = 1;
                $scope.options.search();
            }

            $scope.enterEvent = function (e) {
                $scope.options.enterEvent(e);
            }



        var evaluationSummaryInfo = resourceFactory.getResource('evaluationSummaryInfo');

            $scope.getEvaluationSummaryInfo = function (employeeId) {
                evaluationSummaryInfo.get({ organizationID: $scope.$root.user.OrgId, employeeId: employeeId },
                    function (data) {
                        if (data.Data) {
                            $scope.renderEvaluationSummary(data.Data);
                        }
                    });
            }
            $scope.getEvaluationSummaryInfo(-1);

            $scope.renderEvaluationSummary = function (list) {

                if (list == null) return;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('evaluationSummaryDistribute'));

                var monthList = [];
                var avgMarks = [];
                var personalAvgMarks = [];
                angular.forEach(list,
                    function (data) {
                        monthList.push(data.Month);
                        avgMarks.push(Math.floor(data.AvgMark * 100) / 100);
                        personalAvgMarks.push(Math.floor(data.PersonalAvgMark * 100) / 100);
                    });

                var option = {
                    title: {
                        text: $scope.currentEmployeeName +($scope.currentEmployeeName !="" ?' 与 ':'') + '机构月综合评价',
                        subtext:  '员工与机构月综合评价对比'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['机构综合', $scope.currentEmployeeName]
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    yAxis: [
                        {
                            type: 'value',
                            boundaryGap: [0, 0.01]
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            data: monthList
                        }
                    ],
                    series: [
                        {
                            name: '机构评价',
                            type: 'bar',
                            data: avgMarks,
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: '#95CACA',
                                    label: {
                                        show: true,
                                        position: 'top',
                                        //formatter: function (params) {
                                        //    return "工单数：" + params.value;
                                        //}
                                    }

                                }
                            }
                        },
                        {
                            name: $scope.currentEmployeeName + '评价',
                            type: 'bar',
                            data: personalAvgMarks,
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: '#66B3FF',
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: function (params) {
                                            if (params.value == 0)
                                                return "未服务";
                                            return  params.value;
                                        }
                                    }
                                }
                            }
                        }

                    ]
                };

                // 使用刚指定的配置项和数据显示图表。
                if (option && typeof option === "object") {
                    myChart.setOption(option, true);
                }

            };

        }
    ])
.controller('EvaluationSummaryStatisticCtrl',['$scope','resourceFactory',function($scope, resourceFactory) {
    var evaluationSummaryInfo = resourceFactory.getResource('evaluationSummaryInfo');

    $scope.getEvaluationSummaryInfo = function (employeeId) {
        evaluationSummaryInfo.get({ organizationID: $scope.$root.user.OrgId, employeeId: employeeId },
                function (data) {
                    if (data.Data) {
                        $scope.renderEvaluationSummary(data.Data);
                    }
                });
        }
    $scope.getEvaluationSummaryInfo(-1);

    $scope.renderEvaluationSummary = function (list) {

            if (list == null) return;
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('evaluationSummaryDistribute'));

            var monthList = [];
            var avgMarks = [];
            var personalAvgMarks = [];
            angular.forEach(list,
                function (data) {
                    monthList.push(data.Month);
                    avgMarks.push(Math.floor(data.AvgMark * 100) / 100);
                    personalAvgMarks.push(Math.floor(data.PersonalAvgMark * 100) / 100);
                });

            var option = {
                title: {
                    text: '按月平均评价走势',
                    //subtext: '数据来自网络'
                },
                tooltip: {
                    trigger: 'axis'
                },
                //legend: {
                //    data: ['2011年']
                //},
                toolbox: {
                    show: true,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                yAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    }
                ],
                xAxis: [
                    {
                        type: 'category',
                        data: monthList
                    }
                ],
                series: [
                    {
                        name: '平均评价',
                        type: 'line',
                        data: avgMarks,
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: '#CE0000'
                            }
                        }
                    },
                    {
                        name: '平均评价',
                        type: 'line',
                        data: personalAvgMarks,
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: '#CE0000'
                            }
                        }
                    }

                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }

        };
    }]);