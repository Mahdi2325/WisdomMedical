angular.module("sltcApp")
    .controller('OrderStatisticCtrl', [ '$scope', 'resourceFactory', function($scope, resourceFactory) {

                $scope.employeeList = [];
                //查询选项
                $scope.options = {};
                $scope.options.params = {};
                $scope.currentEmployeeName = "";


                var employeeRes = resourceFactory.getResource("employeeRes");

                //查询所有
                $scope.init = function() {
                    $scope.options = {
                        buttons: [],
                        ajaxObject: employeeRes,
                        params: { "Data.SearchWords": "" },
                        success: function(data) {
                            $scope.employeeList = data.Data;
                        },
                        pageInfo: { //分页信息
                            CurrentPage: 1,
                            PageSize: 10
                        }
                    }
                }

                $scope.init();

                $scope.employeeClick = function (item) {
                    $scope.currentEmployeeName = item.EmpName;
                    $scope.getOrderSummaryInfo(item.EmployeeID);
                };

                $scope.search = function() {
                    $scope.options.pageInfo.CurrentPage = 1;
                    $scope.options.search();
                }

                $scope.enterEvent = function(e) {
                    $scope.options.enterEvent(e);
                }

                var orderSummaryInfo = resourceFactory.getResource('personalOrderDistributeInfo');

                $scope.getOrderSummaryInfo = function (employeeId) {
                    orderSummaryInfo.get({ organizationID: $scope.$root.user.OrgId, employeeId: employeeId },
                        function(data) {
                            if (data.Data) {
                                $scope.renderOrderSummaryInfo(data.Data);
                            }
                        });
                }
                $scope.getOrderSummaryInfo(-1);

                $scope.renderOrderSummaryInfo = function(list) {

                    if (list == null) return;
                    // 基于准备好的dom，初始化echarts实例
                    var myChart = echarts.init(document.getElementById('personalOrderDistribute'));

                    var monthList = [];
                    var counts = [];
                    angular.forEach(list,
                        function(data) {
                            monthList.push(data.Month);
                            counts.push(data.Count);
                        });
                    var option = {
                        title: {
                            text: $scope.currentEmployeeName + ' 月工单量统计' + (monthList.length == 0 && $scope.currentEmployeeName !="" ? ' (未找到！)' : ""),
                            subtext: $scope.currentEmployeeName ==""?"请选择服务人员查看": (monthList.length ==0 ?'没找到该员工服务工单':"")
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
                                name: '工单数',
                                type: 'bar',
                                data: counts,
                                itemStyle: {
                                    normal: {
                                        barBorderColor: 'rgba(0,0,0,0)',
                                        color: '#97CBFF',
                                        label: {
                                            show: true,
                                            position: 'top',
                                            //formatter: function (params) {
                                            //    return "工单数：" + params.value;
                                            //}
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

                }
            }
    ])
.controller('orderSummaryDistributeCtrl', [ '$scope', 'resourceFactory', function($scope, resourceFactory) {
            var orderSummaryInfo = resourceFactory.getResource('orderSummaryInfo');

            $scope.getOrderSummaryInfo = function() {
                orderSummaryInfo.get({ organizationID: $scope.$root.user.OrgId },
                    function(data) {
                        if (data.Data) {
                            $scope.renderOrderSummaryInfo(data.Data);
                        }
                    });
            }
            $scope.getOrderSummaryInfo();

            $scope.renderOrderSummaryInfo = function(list) {

                if (list == null) return;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('orderSummaryDistribute'));

                var monthList = [];
                var counts = [];
                angular.forEach(list,
                    function(data) {
                        monthList.push(data.Month);
                        counts.push(data.Count);
                    });
                var option = {
                    title: {
                        text: '机构月总工单量统计',
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
                            name: '工单数',
                            type: 'bar',
                            data: counts,
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: '#5CACEE',
                                    label: {
                                        show: true,
                                        position: 'top',
                                        //formatter: function (params) {
                                        //    return "工单数：" + params.value;
                                        //}
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
            }
        }
    ]);