
/*

        创建人: 李林玉
        创建日期:2016-06-01
        说明: 老人展示控台
*/

angular.module("sltcApp")
    .controller("residentStatusCtrl", ['$scope', '$http', '$state', '$stateParams', '$location', 'htlExamRes', 'resourceFactory', 'utility', function ($scope, $http, $state, $stateParams,$location, htlExamRes, resourceFactory, utility) {
        var personRes = resourceFactory.getResource('persons');

        $scope.initList = function () {
            if ($stateParams.id) {
                personRes.get({ id: $stateParams.id },function (data) {
                    $scope.curPerson = data.Data;
                    if ($scope.curPerson != null && $scope.curPerson.IdCard != null && $scope.curPerson.IdCard != "") {
                        $scope.GetMeasureData($scope.curPerson.IdCard);
                    }
                });
            }
        };

        $scope.GetMeasureData = function (idno) {
            $scope.MeasureRecord = {};
            $scope.MeasureRecord.SP = [];
            $scope.MeasureRecord.DP = [];
            $scope.MeasureRecord.GLU = [];
            htlExamRes.get({ currentPage: 1, pageSize: 3, idnos: idno, unit: 'day', items: '554,556,776' }, function (response) {
                var data = response.Data, len = data ? data.length : 0, tempData, tmpValue, Status = false;
                for (var i = 0; i < len; i++) {
                    tempData = data[i];
                    switch (tempData.ItemId) {
                        case 554:
                            tmpValue = parseInt(tempData.Result);
                            Status = tmpValue >= 90 && tmpValue < 140;
                            $scope.MeasureRecord.SP.push({ Value: tempData.Result, Time: tempData.CreateDate.substr(0, tempData.CreateDate.indexOf("T")), Status: Status });
                            break;
                        case 556:
                            tmpValue = parseInt(tempData.Result);
                            Status = tmpValue >= 60 && tmpValue < 90;
                            $scope.MeasureRecord.DP.push({ Value: tempData.Result, Time: tempData.CreateDate.substr(0, tempData.CreateDate.indexOf("T")), Status: Status });
                            break;
                        case 776:
                            tmpValue = parseFloat(tempData.Result);
                            Status = tmpValue >= 3.1 && tmpValue < 11.1;
                            $scope.MeasureRecord.GLU.push({ Value: tempData.Result, Time: tempData.CreateDate.substr(0, tempData.CreateDate.indexOf("T")), Status: Status });
                            break;
                    }
                }
            });
        }

        $scope.showBloodPressDetail = function () {
            if ($scope.MeasureRecord.SP.length==0) {
                utility.message("没有相应的血压量测数据!");
                return;
            }

            $("#modalBloodPress").modal("show");
        };

        $scope.showBloodSugarDetail = function () {
            if ($scope.MeasureRecord.GLU.length == 0) {
                utility.message("没有相应的血糖量测数据!");
                return;
            }

            $("#modalBloodSugar").modal("show");
        };
        $scope.initList();
    }])
    .controller("bloodPressDetailCtrl", ['$scope', '$stateParams', '$state', '$location', 'htlExamRes', 'resourceFactory', function ($scope, $stateParams, $state, $location, htlExamRes, resourceFactory) {
        var personRes = resourceFactory.getResource('persons');
        $scope.initData = function () {
            personRes.get({ id: $stateParams.id }, function (res) {
                var person = res.Data;
                htlExamRes.get({ currentPage: 1, pageSize: 30, idnos: person.IdCard, unit: 'day', items: '554,556' }, function (response) {
                    var filtered = [], data = response.Data, len = data ? data.length : 0, sp = [], dp = [], tempData;
                    for (var i = 0; i < len; i++) {
                        tempData = data[i];
                        switch (tempData.ItemId) {
                            case 554:
                                tmpValue = parseInt(tempData.Result);
                                Status = tmpValue >= 90 && tmpValue < 140;
                                sp.push({ Value: tmpValue, Time: tempData.CreateDate.substr(0, tempData.CreateDate.indexOf("T")), Status: Status });
                                break;
                            case 556:
                                tmpValue = parseInt(tempData.Result);
                                Status = tmpValue >= 60 && tmpValue < 90;
                                dp.push({ Value: tmpValue, Time: tempData.CreateDate.substr(0, tempData.CreateDate.indexOf("T")), Status: Status });
                                break;
                        }
                    }
                    if (data && sp.length > 0 ) {
                        var len = sp.length;
                        for (var i = 0; i < len; i++) {
                            if (dp[i]) {
                                filtered.push({
                                    CollectData: { dp: dp[i].Value, sp: sp[i].Value, status: ((sp[i].Status && dp[i].Status) ? "" : "1") },
                                    CollectTime: sp[i].Time,
                                    CollectType: "1",
                                    ResidentNo: person.PersonNo,
                                    collector: "1",
                                    id: person.IdCard
                                });

                            }
                        }
                    }
                    InitBloodPressureChart2(filtered);
                });

            });
        };

        $('#modalBloodPress').on('show.bs.modal',
        function () {
            $scope.initData();
        });

    }]).controller("bloodSugarDetailCtrl", ['$scope', '$stateParams', '$state', '$location', 'htlExamRes', 'resourceFactory', function ($scope, $stateParams, $state, $location, htlExamRes, resourceFactory) {

        var personRes = resourceFactory.getResource('persons');
        $scope.initData = function () {
            personRes.get({ id: $stateParams.id }, function (res) {
                var person = res.Data;
                htlExamRes.get({ currentPage: 1, pageSize: 30, idnos: person.IdCard, unit: 'day', items: '776' }, function (response) {
                    var filtered = [], data = response.Data, len = data ? data.length : 0, glu = [], tempData;
                    for (var i = 0; i < len; i++) {
                        tempData = data[i];
                        tmpValue = parseFloat(tempData.Result);
                        Status = tmpValue >= 3.1 && tmpValue < 11.1;
                        glu.push({ Value: tmpValue, Time: tempData.CreateDate.substr(0, tempData.CreateDate.indexOf("T")), Status: Status });                     
                    }
                    if (data && glu.length > 0) {
                        var len = glu.length;
                        for (var i = 0; i < len; i++) {
                            if (glu[i]) {
                                filtered.push({
                                    CollectData: { value: glu[i].Value, status: (glu[i].Status ? "" : "1") },
                                    CollectTime: glu[i].Time,
                                    CollectType: "2",
                                    ResidentNo: person.PersonNo,
                                    collector: "",
                                    id: person.IdCard
                                });
                            }
                        }
                    }
                    InitBloodSugarChart2(filtered);
                });

            });
        };

        $('#modalBloodSugar').on('show.bs.modal',
        function () {
            $scope.initData();
        });

    }]);

//处理血压数据
function GetBloodPressureData2(data) {
    var sp = [], x = [], dp = [];
    $.each(data, function () {
        if (this.CollectType === "1") {
            var time = new Date(this.CollectTime);
            var utc = time.getFullYear().toString() + "/" + (time.getMonth() + 1).toString() + "/" + time.getDate().toString();
            sp.push(this.CollectData.sp);
            dp.push(this.CollectData.dp);
            x.push(utc)
        }
    });
    return { sp: sp, dp: dp, x: x };
}

//处理血糖数据
function GetBloodSugarData2(data) {
    var json = [], x = [];
    $.each(data, function () {
        if (this.CollectType === "2") {
            var time = new Date(this.CollectTime);
            var utc = time.getFullYear().toString() + "/" + (time.getMonth() + 1).toString() + "/" + time.getDate().toString();
            json.push(this.CollectData.value);
            x.push(utc);
        }
    });
    return { glu: json, x: x };
}

//血压图表
function InitBloodPressureChart2(data) {
    var json = GetBloodPressureData2(data);
    $('#bloodpressure').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: '血压信息'
        },
        subtitle: {
            text: '最近30天的血压量测记录'
        },
        exporting: {
            filename: '导出图表',
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: '导出PNG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出JPEG图片',
                        onclick: function () {                           
                            this.exportChart({ type: 'image/jpeg' });
                        }
                    }, {
                        text: '导出PDF文件',
                        onclick: function () {
                            this.exportChart({ type: 'application/pdf' });
                        }
                    }]
                }
            }
        },
        xAxis: {
            categories: json.x
        },
        yAxis: {
            max: 180,
            min: 30,
            plotLines: [{
                color: '#FF0000',
                width: 1,
                value: 140,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }, {
                color: '#FF0000',
                width: 1,
                value: 60,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }, {
                color: '#FF0000',
                width: 1,
                value: 90,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }],
            title: {
                text: '血压 (mmHg)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }, series: {
                marker: {
                    radius: 4
                }
            }
        },
        series: [{
            name: '收缩压',
            data: json.sp
        }, {
            name: '舒张压',
            data: json.dp
        }]
    });
}

//血糖图表
function InitBloodSugarChart2(data) {
    var json = GetBloodSugarData2(data);
    $('#bloodsugar').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: '血糖信息'
        },
        subtitle: {
            text: '最近30天的血糖量测记录'
        }, exporting: {
            filename: '导出图表',
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: '导出PNG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出JPEG图片',
                        onclick: function () {
                            this.exportChart({ type: 'image/jpeg' });
                        }
                    }, {
                        text: '导出PDF文件',
                        onclick: function () {
                            this.exportChart({ type: 'application/pdf' });
                        }
                    }]
                }
            }
        },
        xAxis: {
            categories: json.x
        },
        yAxis: {
            max: 30,
            min: 0,
            plotLines: [{
                color: '#FF0000',
                width: 1,
                value: 11.1,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    text: '超出血糖临界值',
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }, {
                color: '#FF0000',
                width: 1,
                value: 3.8,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    text: '超出血糖最低值',
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }],
            title: {
                text: '血糖 (mmol/L)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '血糖',
            data: json.glu
        }]
    });
}