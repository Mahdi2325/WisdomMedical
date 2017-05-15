angular.module("sltcApp")
.controller('homeMapCtrl', ['$scope', '$state', 'resourceBase', function ($scope, $state, resourceBase) {
    $("#homeMap").height($(document).height() - 80);
    (function () {
        $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
            $.getScript("/Content/echarts/extension/bmap.min.js", function () {
                (function () {
                    var myChart = echarts.init(document.getElementById('homeMap'));

                    myChart.showLoading();
                    $.get(resourceBase + 'org-map', function (data) {
                        myChart.hideLoading();

                        var convertData = function (data) {
                            var res = [];
                            for (var i = 0; i < data.length; i++) {
                                res.push({
                                    name: data[i].name,
                                    value: [data[i].lat, data[i].lon, data[i].id]
                                });
                            }
                            return res;
                        };

                        var monitorList = [];
                        $.each(data, function (i, v) {
                            if (i >= 8) { return false; }
                            monitorList.push(v);
                        });
                        $scope.monitorList = monitorList;
                        $scope.$apply();

                        var option = {
                             bmap: {
                                center: [108, 31],
                                zoom: 5,
                                roam: true,
                            },
                            series: [
                                {
                                    name: '机构',
                                    type: 'effectScatter',
                                    coordinateSystem: 'bmap',
                                    clickable: true,
                                    data: convertData(data),
                                    symbolSize: function (val) {
                                        //return val[2] / 10;
                                        return 16;
                                    },
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'top',
                                            formatter: function (param) {
                                                return param.name;
                                            },
                                            textStyle: {
                                                color: '#428BCA',
                                                fontWeight: 'bold',
                                                fontSize: '16',
                                            }
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            color: '#5CB85C'
                                        }
                                    }
                                }
                            ]
                        };

                        myChart.setOption(option);

                    });

                    myChart.on("click", eConsole);

                    function eConsole(param) {
                        if (typeof param.seriesIndex == 'undefined') {
                            return;
                        }
                        if (param.type == 'click') {
                            $state.go("HomeStatistic", { id: param.value[2] });
                        }
                    }

                }());

            }); //bmap
        }); //getscript
    }());
}]);