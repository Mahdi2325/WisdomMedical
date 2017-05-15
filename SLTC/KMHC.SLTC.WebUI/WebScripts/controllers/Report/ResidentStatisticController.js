angular.module("sltcApp")
    .controller('ResidentStatisticCtrl', ['$scope', 'resourceFactory', function ($scope, resourceFactory) {

            var residentPercentageInfoRes = resourceFactory.getResource('residentPercentageInfo');

            $scope.residentPercentageInfo = function() {
                residentPercentageInfoRes.get({ organizationID: $scope.$root.user.OrgId },
                    function(data) {
                        if (data.Data) {
                            $scope.renderResidentChart(data.Data);
                        }
                    });
            }

            $scope.residentPercentageInfo();

            $scope.renderResidentChart = function(data) {

                if (data == null) return;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('residentPercentage'));

                var option = {
                    title: {
                        text: '会员与非会员占比',
                        subtext: '会员：' + data.ResidentCount + "   " + "非会员：" + data.NonResidentCount,
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['会员', '非会员']
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
                            name: '客户组成',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                {
                                    value: data.ResidentCount, name: '会员', itemStyle: {
                                        normal: {
                                            barBorderColor: 'rgba(0,0,0,0)',
                                            color: '#7CCD7C'
                                        }
                                    }
                                },
                                {
                                    value: data.NonResidentCount, name: '非会员', itemStyle: {
                                        normal: {
                                            barBorderColor: 'rgba(0,0,0,0)',
                                            color: '#A9A9A9'
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