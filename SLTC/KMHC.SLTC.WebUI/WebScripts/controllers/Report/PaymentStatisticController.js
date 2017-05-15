angular.module("sltcApp")
    .controller('PaymentStatisticCtrl', ['$scope','$filter', 'resourceFactory', function ($scope,$filter, resourceFactory) {

        var paymentDistributeInfoRes = resourceFactory.getResource('paymentDistributeInfo');

        $scope.getPaymentDistributeInfo = function () {
                paymentDistributeInfoRes.get({ organizationID: $scope.$root.user.OrgId },
                    function (data) {
                        if (data.Data) {
                            $scope.renderPaymentChart(data.Data);
                        }
                    });
            }

        $scope.getPaymentDistributeInfo();

        $scope.renderPaymentChart = function (data) {

            if (data == null || data.length < 2) return;
            //var payment = $filter("currency")(data[0].Amount, '￥', 2);
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('paymentDistribute'));

                var option = {
                    title: {
                        text: '支付方式分布',
                        subtext: data[0].Payment + ":" + $filter("currency")(data[0].Amount, '￥', 2) + "   " + data[1].Payment + ":" + $filter("currency")(data[1].Amount, '￥', 2),
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: [data[0].Payment,data[1].Payment]
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
                            name: '支付方式',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {//现金
                                    value: data[0].Amount, name: data[0].Payment, itemStyle: {
                                        normal: {
                                            barBorderColor: 'rgba(0,0,0,0)',
                                            color: '#EEA2AD'
                                        }
                                    }
                                },
                                {//会员卡
                                    value: data[1].Amount, name: data[1].Payment, itemStyle: {
                                        normal: {
                                            barBorderColor: 'rgba(0,0,0,0)',
                                            color: '#528B8B'
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