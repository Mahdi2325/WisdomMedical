angular.module("sltcApp")
    .controller('ResidentAgeStatisticCtrl', ['$scope', '$filter', 'resourceFactory', function ($scope, $filter, resourceFactory) {

        var residentAgeDistributeInfoRes = resourceFactory.getResource('residentAgeDistributeInfo');

        $scope.getResidentAgeDistribute = function () {
                residentAgeDistributeInfoRes.get({ organizationID: $scope.$root.user.OrgId },
                    function (data) {
                        if (data.Data) {
                            $scope.renderResidentAgeChart(data.Data);
                        }
                    });
            }

        $scope.getResidentAgeDistribute();

        $scope.renderResidentAgeChart = function (list) {

            if (list == null) return;
            // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('residentAge'));

            var ageAreas = [];
            var areaCounts = [];
            angular.forEach(list,
                function (data) {
                    ageAreas.push(data.AgeArea);
                    areaCounts.push(data.Count);
                });
            var option = {
                title: {
                    text: '会员年龄段个数统计',
                    //subtext: '数据来自网络'
                },
                tooltip: {
                    trigger: 'axis'
                },
                //legend: {
                //    data: ['年龄段']
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
                xAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: ageAreas
                    }
                ],
                series: [
                    {
                        name: '会员个数',
                        type: 'bar',
                        data: areaCounts,
                        itemStyle: {
                            normal: {
                                barBorderColor: 'rgba(0,0,0,0)',
                                color: '#66CDAA'
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