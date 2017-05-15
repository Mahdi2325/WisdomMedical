angular.module("sltcApp")
.controller('homeStatisticCtrl', ['$scope', '$state', 'resourceBase', function ($scope, $state, resourceBase) {

    if (angular.isDefined($state.params.id) && $state.params.id != "") {
        $scope.$root.orgId = $state.params.id;
    }
    
    var orgId = $scope.orgId;

    if (!angular.isDefined(orgId) || orgId == "") {
        return;
    }

    var height = ($(document).height() - 80 - 430);
    $("#sosMap").height(height);
    $("#monitorMap").height(height);
    $("#sosMapDiv").height(height);
    $("#monitorMapDiv").height(height);

    $scope.click = function (eleId, item) {
        var setPoint = function (lon, lat, mapData) {
            var myChart = echarts.getInstanceByDom(document.getElementById(eleId));
            var option = {
                bmap: {
                    center: [lon, lat]
                },
                series: [
                    {
                        data: mapData
                    }
                ]
            };
            myChart.setOption(option);
        };
        var mapData = [];
        if (eleId == "sosMap") {
            mapData = $scope.sosData;
        } else if (eleId == "monitorMap") {
            mapData = $scope.monitorData;
        }
        if (angular.isDefined(item.imei) && item.imei != "") {
        //if (angular.isDefined(item.imei)) {
            $.ajax({
                url: "api/Watch/" + item.imei,
                //url: "api/Watch/861232011124382",
                type: 'GET',
                dataType: 'json',
                success: function (data) {
                    var obj = JSON.parse(data);
                    var lon = item.lat, lat = item.lon;
                    if (obj.content.list.length > 0) {
                        lon = obj.content.list[0].gpsLng;
                        lat = obj.content.list[0].gpsLat;
                        var address = obj.content.list[0].address;
                        $.ajax({
                            url: "http://api.map.baidu.com/geoconv/v1/?coords=" + lon + "," + lat + "&from=3&to=5&ak=EF06cfb26173665ad80b8edf6a328192&callback=dealResult",
                            type: 'GET',
                            dataType: 'jsonp',
                            success: function (data) {
                                if (data.result.length > 0) {
                                    lon = data.result[0].x;
                                    lat = data.result[0].y;
                                    $.each(mapData, function (i, v) {
                                        if (v.name == item.name) {
                                            v.value[0] = lon;
                                            v.value[1] = lat;
                                            v.value[3] = address;
                                            return false;
                                        }
                                    });
                                }
                                setPoint(lon, lat, mapData);
                            }
                        });
                    }
                }
            });
        } else {
            setPoint(item.lat, item.lon, mapData);
        }
    };



    (function () {

        $.get(resourceBase + 'home', { orgId: orgId }, function (data) {
            $scope.callIn = data[0].callIn;
            $scope.callOut = data[0].callOut;
            $scope.service1 = data[0].service1;
            $scope.service2 = data[0].service2;
            $scope.service3 = data[0].service3;
            $scope.service4 = data[0].service4;
            $scope.$apply();
        });

        $.get(resourceBase + 'today-service', { orgId: orgId }, function (data) {
            var list = [];
            $.each(data, function (i, v) {
                if (i >= 4) { return false; }
                list.push(v);
            });
            $scope.todayServiceList = list;
            $scope.$apply();
        });

        $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
            $.getScript("/Content/echarts/extension/bmap.min.js", function () {

                // 一健救护
                (function () {
                    var myChart = echarts.init(document.getElementById('sosMap'));

                    myChart.showLoading();
                    $.get(resourceBase + 'sos-map', { orgId: orgId }, function (data) {
                        myChart.hideLoading();

                        var firstPoint = [ 114.114129, 37.550339 ];
                        if (data.length > 0) {
                            firstPoint = [data[0].lat, data[0].lon];
                        }
                        var convertData = function (data) {
                            var res = [];
                            for (var i = 0; i < data.length; i++) {
                                res.push({
                                    name: data[i].name,
                                    value: [data[i].lat, data[i].lon, data[i].phone, data[i].address]
                                });
                            }
                            return res;
                        };

                        var sosList = [];
                        $.each(data, function (i, v) {
                            if (i >= 8) { return false; }
                            sosList.push(v);
                        });
                        $scope.sosList = sosList;
                        $scope.$apply();

                        $scope.sosData = convertData(data);
                        var option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: function (param) {
                                    return param.name + "：" + param.value[2] + "<br>" + param.value[3];
                                }
                            },
                            bmap: {
                                center: firstPoint,
                                zoom: 18,
                                roam: true,
                            },
                            series: [
                                {
                                    name: '救护地点',
                                    type: 'scatter',
                                    coordinateSystem: 'bmap',
                                    data: $scope.sosData,
                                    symbolSize: function (val) {
                                        //return val[2] / 10;
                                        return 30;
                                    },
                                    symbol: "image://Images/Report/home/home_position.png"
                                }
                            ]
                        };

                        myChart.setOption(option);

                    });
                }());

                // 跌倒监测
                /*
                (function () {
                    var myChart = echarts.init(document.getElementById('monitorMap'));

                    myChart.showLoading();
                    $.get(resourceBase + 'monitor-map', { orgId: orgId }, function (data) {
                        myChart.hideLoading();

                        var firstPoint = [114.114129, 37.550339];
                        if (data.length > 0) {
                            firstPoint = [data[0].lat, data[0].lon];
                        }
                        var convertData = function (data) {
                            var res = [];
                            for (var i = 0; i < data.length; i++) {
                                res.push({
                                    name: data[i].name,
                                    value: [data[i].lat, data[i].lon, data[i].phone, data[i].address]
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

                        $scope.monitorData = convertData(data);
                        var option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: function (param) {
                                    return param.name + "：" + param.value[2] + "<br>" + param.value[3];
                                }
                            },
                            bmap: {
                                center: firstPoint,
                                zoom: 18,
                                roam: true,
                            },
                            series: [
                                {
                                    name: '跌倒监测',
                                    type: 'scatter',
                                    coordinateSystem: 'bmap',
                                    data: $scope.monitorData,
                                    symbolSize: function (val) {
                                        //return val[2] / 10;
                                        return 30;
                                    },
                                    symbol: "image://Images/Report/home/home_position.png"
                                }
                            ]
                        };

                        myChart.setOption(option);

                    });
                }());
                */
            }); //bmap
        }); //getscript

    }());

    (function () {
        $.get(resourceBase + 'abnormity', { orgId: orgId }, function (data) {
            $scope.abnormityList = data;
        });
    }());
}]);