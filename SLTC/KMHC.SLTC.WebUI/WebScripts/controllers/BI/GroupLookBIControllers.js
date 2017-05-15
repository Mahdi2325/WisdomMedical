angular.module("sltcApp")
.controller("ComprehensiveStatisticsCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {

    var ChartRes = resourceFactory.getResource("ChartRes");
    var groupId = $scope.user.GroupId;
    //图表配置
    var chart = { type: 'column' };
    var title = { text: '' };
    var subtitle = { text: '' };
    var xAxis = {
        categories: ['社区1', '社区2', '社区3', '社区4', '社区5'],
        labels: {
            rotation: 0, //字体倾斜
            align: 'right',
            style: { font: 'normal 13px 宋体' }
        }
    };
    var yAxis = {
        title: { text: '' },
        labels: {
            formatter: function () {
                return this.value / 1000;
            }
        }
    };
    var tooltip = { shared: true, valueSuffix: ' ' };
    var plotOptions = {
        column: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function (e) {
                        //点击图表,下方表格数据进行相应的加载
                        //console.log(e.point.series._i);
                    }
                }
            }
        }
    };
    var credits = {
        enabled: false
    };

    //虚拟数据1
    var data1 = [
        {
            name: '分数',
            data: [1034, 520, 300, 330, 600],
            color: "#e68ca5"
        }
    ]

    //虚拟数据2
    var data2 = [
        {
            name: '分数',
            data: [20, 30, 50, 66, 80],
            color: "#8fafe3"
        }
    ]

    //虚拟数据3
    var data3 = [
        {
            name: '分数',
            data: [5, 20, 82, 90, 100],
            color: "#8fafe3"
        }
    ]

    //虚拟数据4
    var data4 = [
        {
            name: '分数',
            data: [101, 150, 25, 66, 68],
            color: "#8fafe3"
        }
    ]

    var dataArr = [data1, data2, data3, data4]

    //会员机构档案数
    $scope.LoadChart1 = function () {

        ChartRes.GetOrgDanAnList({ "GroupId": groupId }, function (d) {


            var json1 = {};
            json1.chart = { type: 'column' };
            json1.title = { text: '' };
            json1.subtitle = { text: '' };
            json1.xAxis = {
                categories: d.Data.Name,
                labels: {
                    rotation: 0, //字体倾斜
                    align: 'right',
                    style: { font: 'normal 13px 宋体' }
                }
            };
            json1.yAxis = {
                title: { text: '' },
                labels: {
                    formatter: function () {
                        return this.value ;
                    }
                }
            };
            json1.tooltip = { shared: true, valueSuffix: ' ' };
            json1.plotOptions = {
                column: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                                //点击图表,下方表格数据进行相应的加载
                                //console.log(e.point.series._i);
                            }
                        }
                    }
                }
            };
            json1.credits = {
                enabled: false
            };
            json1.series = [
            {
                name: '数量',
                data: d.Data.Data,
                color: "#56cffb"
            }
            ];
            $('#chart1').highcharts(json1);
        });
    }
    //会员机构会员数
    $scope.LoadChart2 = function () {

        ChartRes.GetOrgHuiYuanList({ "GroupId": groupId }, function (d) {
            var json1 = {};
            json1.chart = { type: 'column' };
            json1.title = { text: '' };
            json1.subtitle = { text: '' };
            json1.xAxis = {
                categories: d.Data.Name,
                labels: {
                    rotation: 0, //字体倾斜
                    align: 'right',
                    style: { font: 'normal 13px 宋体' }
                }
            };
            json1.yAxis = {
                title: { text: '' },
                labels: {
                    formatter: function () {
                        return this.value ;
                    }
                },
                allowDecimals: false
            };
            json1.tooltip = { shared: true, valueSuffix: ' ' };
            json1.plotOptions = {
                column: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                                //点击图表,下方表格数据进行相应的加载
                                //console.log(e.point.series._i);
                            }
                        }
                    }
                }
            };
            json1.credits = {
                enabled: false
            };
            json1.series = [
            {
                name: '数量',
                data: d.Data.Data,
                color: "#56cffb"
            }
            ];
            $('#chart2').highcharts(json1);
        });
    }
    //机构服务订单量统计
    $scope.LoadChart3 = function () {

        ChartRes.GetOrgOrderList({ "GroupId": groupId }, function (d) {
            var json1 = {};
            json1.chart = { type: 'column' };
            json1.title = { text: '' };
            json1.subtitle = { text: '' };
            json1.xAxis = {
                categories: d.Data.Name,
                labels: {
                    rotation: 0, //字体倾斜
                    align: 'right',
                    style: { font: 'normal 13px 宋体' }
                }
            };
            json1.yAxis = {
                title: { text: '' },
                labels: {
                    formatter: function () {
                        return this.value ;
                    }
                },
                allowDecimals: false
            };
            json1.tooltip = { shared: true, valueSuffix: ' ' };
            json1.plotOptions = {
                column: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function (e) {
                                //点击图表,下方表格数据进行相应的加载
                                //console.log(e.point.series._i);
                            }
                        }
                    }
                }
            };
            json1.credits = {
                enabled: false
            };
            json1.series = [
            {
                name: '数量',
                data: d.Data.Data,
                color: "#56cffb"
            }
            ];
            $('#chart3').highcharts(json1);
        });
    }

    $scope.LoadChart4 = function () {
        ChartRes.GetOrgTaskList({ "GroupId": groupId }, function (d) {
            var chart = {
                type: 'column'
            };
            var title = {
                text: ''
            };
            var subtitle = {
                text: ''
            };
            var xAxis = {
                categories: d.Data.Name,
                crosshair: true
            };
            var yAxis = {
                min: 0,
                title: {
                    text: ''
                },
                allowDecimals: false
            };

            var plotOptions = {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            };
            var credits = {
                enabled: false
            };

            var series = [{
                name: '已完成',
                data: d.Data.AlreadyData,
                color: "#737cc9"
            },
                {
                    name: '未完成',
                    data: d.Data.NoneData,
                    color: "#56cffb"
                }
            ]

            var json = {};
            json.chart = chart;
            json.title = title;
            json.subtitle = subtitle;
            json.xAxis = xAxis;
            json.yAxis = yAxis;
            json.series = series;
            json.plotOptions = plotOptions;
            json.credits = credits;
            $('#chart4').highcharts(json);
        });

    }


    $scope.init = function () {
        $scope.LoadChart1();
        $scope.LoadChart2();
        $scope.LoadChart3();
        $scope.LoadChart4();
    }


    $scope.changeChart1 = function (x) {
        var json = {};
        json.chart = chart;
        json.title = title;
        json.subtitle = subtitle;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.plotOptions = plotOptions;
        json.credits = credits;
        json.series = dataArr[x - 1];
        $('#chart1').highcharts(json);
    }

    $scope.changeChart2 = function (x) {
        console.log(x);
        var json = {};
        json.chart = chart;
        json.title = title;
        json.subtitle = subtitle;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.plotOptions = plotOptions;
        json.credits = credits;
        json.series = dataArr[x - 1];
        $('#chart2').highcharts(json);
    }

    $scope.changeChart3 = function (x) {
        var json = {};
        json.chart = chart;
        json.title = title;
        json.subtitle = subtitle;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.plotOptions = plotOptions;
        json.credits = credits;
        json.series = dataArr[x - 1];
        $('#chart3').highcharts(json);
    }

    $scope.changeChart4 = function (x) {
        var json = {};
        json.chart = chart;
        json.title = title;
        json.subtitle = subtitle;
        json.xAxis = xAxis;
        json.yAxis = yAxis;
        json.tooltip = tooltip;
        json.plotOptions = plotOptions;
        json.credits = credits;
        json.series = dataArr[x - 1];
        $('#chart4').highcharts(json);
    }

    $scope.init();
}])
.controller("FileStatisticsCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var ChartRes = resourceFactory.getResource("ChartRes");
    var PhoneRes = resourceFactory.getResource("PhoneRes");

    var groupId = $scope.user.GroupId;
    var LoadChart1dataArr = [];
    var LoadChart2dataArr = [];
    //会员机构档案数
    $scope.LoadChart1 = function () {        
        ChartRes.GetOrgSexList({ "GroupId": groupId }, function (d) {
            $scope.SexOrgs = d.Data.SelectNames;
            $scope.SexOrgValue = d.Data.MyData.length;
            LoadChart1dataArr = d.Data.MyData;
            $scope.changeChart1(1);
        });
    }

    $scope.changeChart1 = function (x) {
        var chart = {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        };
        var title = {
            text: ''
        };
        var tooltip = {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        };
        var credits = {
            enabled: false
        };


        var plotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        };
        var series = [{
            type: 'pie',
            name: '百分比',
            data: LoadChart1dataArr[x - 1]
        }];

        var colors = [
             '#757dc5',         //第一个颜色
             '#51d0ff',        //第二个颜色
             '#92cd71',        //第三个颜色
             '#feb662',        //...
             '#f37566',
        ]

        var json = {};
        json.chart = chart;
        json.title = title;
        json.tooltip = tooltip;
        json.series = series;
        json.plotOptions = plotOptions;
        json.credits = credits;
        json.colors = colors;
        $('#chart1').highcharts(json);
    }

    $scope.LoadChart2 = function () {

        ChartRes.GetOrgAgeList({ "GroupId": groupId }, function (d) {
            $scope.AgeOrgs = d.Data.SelectNames;
            $scope.AgeOrgValue = d.Data.MyData.length;
            LoadChart2dataArr = d.Data.MyData;
            $scope.changeChart2(1);
        });
    }

    $scope.changeChart2 = function (x) {
        var chart = {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        };
        var title = {
            text: ''
        };
        var tooltip = {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        };
        var credits = {
            enabled: false
        };


        var plotOptions = {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                showInLegend: true
            }
        };
        var series = [{
            type: 'pie',
            name: '百分比',
            data: LoadChart2dataArr[x - 1]
        }];

        var colors = [
             '#757dc5',         //第一个颜色
             '#51d0ff',        //第二个颜色
             '#92cd71',        //第三个颜色
             '#feb662',        //...
             '#f37566',
        ]

        var json = {};
        json.chart = chart;
        json.title = title;
        json.tooltip = tooltip;
        json.series = series;
        json.plotOptions = plotOptions;
        json.credits = credits;
        json.colors = colors;
        $('#chart2').highcharts(json);
    }

    $scope.init = function () {
        $scope.LoadChart1();
        $scope.LoadChart2();
    }
    $scope.init();




}])
;