angular.module("sltcApp")
    .controller('OrderTaskRateCtrl', ['$scope', 'resourceFactory', function ($scope, resourceFactory) {

        var orderTaskRateRes = resourceFactory.getResource('orderTaskRate');

        $scope.orderTaskRate = function () {
                orderTaskRateRes.get({ organizationID: $scope.$root.user.OrgId },
                    function (data) {
                        if (data.Data) {
                            $scope.renderOrderTaskRateChart(data.Data);
                        }
                    });
            }

        $scope.orderTaskRate();

        $scope.renderOrderTaskRateChart = function (data) {

                if (data == null) return;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('orderTaskRate'));

                var option = {
                    title: {
                        text: '订单与工单占比',
                        subtext: '订单量：' + data.OrderCount + "   " + "工单量：" + data.TaskCount,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['订单', '工单']
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: {
                                show: true,
                                type: ['pie', 'funnel'],
                                option: {
                                    funnel: {
                                        x: '25%',
                                        width: '50%',
                                        funnelAlign: 'left',
                                        max: 1548
                                    }
                                }
                            },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    calculable: true,
                    series: [
                        {
                            name: '订单组成',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {
                                    value: data.OrderCount, name: '订单', itemStyle: {
                                        normal: {
                                            barBorderColor: 'rgba(0,0,0,0)',
                                            color: '#7CCD7C'
                                        }
                                    }
                                },
                                {
                                    value: data.TaskCount, name: '工单', itemStyle: {
                                        normal: {
                                            barBorderColor: 'rgba(0,0,0,0)',
                                            color: '#5CACEE'
                                        }
                                    }
                                }
                            ]

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