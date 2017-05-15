angular.module("sltcApp")
    .controller('Top10ServiceStatisticCtrl', ['$scope', 'resourceFactory', function ($scope, resourceFactory) {

            var top10Services = resourceFactory.getResource('getTop10Service');

            $scope.getTop10Service = function () {
                top10Services.get({ organizationID: $scope.$root.user.OrgId },
                    function (data) {
                        if (data.Data) {
                            $scope.renderTop10Service(data.Data);
                        }
                    });
            }
            $scope.getTop10Service();

            $scope.renderTop10Service = function (list) {

                if (list == null) return;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('top10Service'));

                var serviceNames = [];
                var serviceCounts = [];
                angular.forEach(list,
                    function (data) {
                        serviceNames.push(data.Name);
                        serviceCounts.push(data.CountOfMonth);
                    });
                var option = {
                    title: {
                        text: '当月前十名服务订单统计',
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
                            data: serviceNames
                        }
                    ],
                    series: [
                        {
                            name: '订单数',
                            type: 'bar',
                            data: serviceCounts,
                            itemStyle: {
                                normal: {
                                    barBorderColor: 'rgba(0,0,0,0)',
                                    color: '#5CACEE'
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
    ]);