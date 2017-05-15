/*
创建人: 肖国栋
创建日期:2016-07-25
说明:会员位置 执行中任务位置 结束任务位置
*/

angular.module("sltcApp")
.controller("residentLocationCtrl", ['$scope', '$stateParams', 'resourceFactory', 'utility', function ($scope, $stateParams, resourceFactory, utility) {
    var residentRes = resourceFactory.getResource('residentRes');
    var myChart = echarts.init(document.getElementById('residentLocation'));

    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $.getScript("/Content/echarts/extension/bmap.min.js", function () {
            myChart.showLoading();
            var orgRes = resourceFactory.getResource("orgRes");
            var orgInfo = {};
            orgRes.get({ organizationID: $scope.$root.user.OrgId }, function (data) {
                if (data.Data) {
                    orgInfo = data.Data;
                }
            });

            residentRes.get({ HasLocation: true, PageSize: 0 }, function (data) {
                // 会员位置
                (function () {

                    myChart.hideLoading();
                    var firstPoint = [114.114129, 37.550339];

                    if (data.Data.length > 0 && data.Data[0].Lng != null && data.Data[0].Lat != null) {
                        firstPoint = [data.Data[0].Lng, data.Data[0].Lat];
                    }

                    var maxLng = firstPoint[0], minLng = firstPoint[0], maxLat = firstPoint[1], minLat = firstPoint[1];
                    var bmapPoints = [];
                    var convertData = function (data) {
                        var res = [];
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            if (item.Lat != null && item.Lng != null) {
                                bmapPoints.push(new BMap.Point(item.Lng, item.Lat));
                                res.push({
                                    name: item.PersonName,
                                    value: [item.Lng, item.Lat, item.Address]
                                });
                                if (item.Lat > maxLat) {
                                    maxLat = item.Lat;
                                }
                                if (item.Lng > maxLng) {
                                    maxLng = item.Lng;
                                }
                                if (item.Lat < minLat) {
                                    minLat = item.Lat;
                                }
                                if (item.Lng < minLng) {
                                    minLng = item.Lng;
                                }
                            }
                        }
                        return res;
                    };


                    var locationData = convertData(data.Data);
                    firstPoint = [minLng + (maxLng - minLng) / 2, minLat + (maxLat - minLat) / 2];
                    var option = {
                        tooltip: {
                            trigger: 'item',
                            formatter: function (param) {
                                return param.name + "：" + param.value[2];
                            }
                        },
                        bmap: {
                            center: firstPoint,
                            zoom: 10,
                            roam: true,
                        },
                        series: [
                            {
                                name: '会员位置',
                                type: 'scatter',
                                coordinateSystem: 'bmap',
                                data: locationData,
                                symbolSize: function (val) {
                                    //return val[2] / 10;
                                    return 30;
                                },
                                symbol: "image://Images/Report/home/home_position.png"
                            }
                        ]
                    };

                    myChart.setOption(option);

                    if (data.Data.length == 0) {

                        if (orgInfo != null && orgInfo.Lng != null && orgInfo.Lat != null) {
                            firstPoint = [orgInfo.Lng, orgInfo.Lat];
                        }

                        var point = new BMap.Point(firstPoint[0], firstPoint[1]);

                        myChart.getModel().getComponent('bmap').getBMap().centerAndZoom(point, 8);
                    }
                    else myChart.getModel().getComponent('bmap').getBMap().setViewport(bmapPoints);

                }());
            });
        });
    });

    $scope.residents = [];
    //查询选项
    $scope.options = {};
    $scope.options.params = {};

    //查询所有
    $scope.init = function () {
        $scope.options = {
            buttons: [],
            ajaxObject: residentRes,
            params: { 'Data.PersonName': "" },
            success: function (data) {
                $scope.residents = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 19
            }
        }
    }

    $scope.init();

    $scope.residentClick = function (item) {
        var map = myChart.getModel().getComponent('bmap').getBMap();

        if (item != null && item.Lng != null && item.Lat != null) {           
            var point = new BMap.Point(item.Lng, item.Lat);

            var opts = {
                width: 200, // 信息窗口宽度
                height: 100, // 信息窗口高度
                title: item.PersonName, // 信息窗口标题
                enableMessage: true, //设置允许信息窗发送短息
                message: ""
            }

            var orgName = item.OrgName == null ? "" : item.OrgName + '</br>';
            var address = item.CensusAddressName == null ? "" :"地址：" +item.CensusAddressName + '</br>';
            var contact = item.ContactPhone1 == null ? "" :"电话：" + item.ContactPhone1 + '</br>';
            var idCard = item.IdCard == null ? "" : "身份证："+ item.IdCard;

            var infoWindow = new BMap.InfoWindow(orgName + address + contact + idCard, opts); // 创建信息窗口对象 

            map.openInfoWindow(infoWindow, point); //开启信息窗口
            map.centerAndZoom(point,15);
        }
        else if (item != null && (item.Lng == null || item.Lat == null)) {
            myChart.getModel().getComponent('bmap').getBMap().closeInfoWindow();
            utility.message("缺少位置信息！");
        }
    };

    $scope.search = function () {
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.search();
    }

    $scope.enterEvent = function (e) {
        $scope.options.enterEvent(e);
    }

    }])
.controller("startTaskLocationCtrl", ['$scope', 'resourceFactory', 'utility', function ($scope, resourceFactory,utility ) {
    var locationRes = resourceFactory.getResource('locationRes');
    var myChart = echarts.init(document.getElementById('startTaskLocation'));
    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $.getScript("/Content/echarts/extension/bmap.min.js", function () {
            $scope.search = function () {
            myChart.showLoading();

            var orgRes = resourceFactory.getResource("orgRes");
            var orgInfo = {};
            orgRes.get({ organizationID: $scope.$root.user.OrgId }, function (data) {
                if (data.Data) {
                    orgInfo = data.Data;
                }
            });

            locationRes.StartTask({ "Data.Status": ["Execution"], "Data.StartHasLocation": true }, function (data) {
                var points = [];
                angular.forEach(data.Data, function (item, index) {
                    points[points.length] = new BMap.Point(item.StartLng, item.StartLat);
                });

                //坐标转换完之后的回调函数
                var translateCallback = function (newData) {
                    if (newData.status === 0) {
                        for (var i = 0; i < newData.points.length; i++) {
                            data.Data[i].Lng = newData.points[i].lng;
                            data.Data[i].Lat = newData.points[i].lat;
                        }
                    }
                    // 任务开始时的位置
                    (function (list) {
                        myChart.hideLoading();
                        var firstPoint = [114.114129, 37.550339];
                        if (list.length > 0) {
                            firstPoint = [list[0].Lng, list[0].Lat];
                        }
                        var maxLng = firstPoint[0], minLng = firstPoint[0], maxLat = firstPoint[1], minLat = firstPoint[1];
                        var convertData = function (data) {
                            var res = [];
                            for (var i = 0; i < data.length; i++) {
                                var item = data[i];
                                if (item.Lng != null && item.Lat != null) {
                                    res.push({
                                        name: "服务人员 : " + item.EmployeeName + '<br/>' + item.PersonName,
                                        value: [item.Lng, item.Lat, item.Address]
                                    });
                                    if (item.Lat > maxLat) {
                                        maxLat = item.Lat;
                                    }
                                    if (item.Lng > maxLng) {
                                        maxLng = item.Lng;
                                    }
                                    if (item.Lat < minLat) {
                                        minLat = item.Lat;
                                    }
                                    if (item.Lng < minLng) {
                                        minLng = item.Lng;
                                    }
                                }
                            }
                            return res;
                        };

                        var locationData = convertData(data.Data);
                        firstPoint = [minLng + (maxLng - minLng) / 2, minLat + (maxLat - minLat) / 2];
                        var option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: function (param) {
                                    return  param.name + "：" + param.value[2];
                                }
                            },
                            bmap: {
                                center: firstPoint,
                                zoom: 10,
                                roam: true,
                            },
                            series: [
                                {
                                    name: '任务开始时的位置',
                                    type: 'scatter',
                                    coordinateSystem: 'bmap',
                                    data: locationData,
                                    symbolSize: function (val) {
                                        //return val[2] / 10;
                                        return 30;
                                    },
                                    symbol: "image://Images/Report/home/home_position.png"
                                }
                            ]
                        };
                        myChart.setOption(option);
                       
                        if (list.length == 0) {
                            if (orgInfo != null && orgInfo.Lng != null && orgInfo.Lat != null) {
                                firstPoint = [orgInfo.Lng, orgInfo.Lat];
                            }

                            var point = new BMap.Point(firstPoint[0], firstPoint[1]);
                            myChart.getModel().getComponent('bmap').getBMap().centerAndZoom(point, 8);
                        } else myChart.getModel().getComponent('bmap').getBMap().setViewport(newData.points);

                    }(data.Data));
                    
                }

                var convertor = new BMap.Convertor();
                convertor.translate(points, 5, 5, translateCallback);
            });
            };
            $scope.search();
        });
    });

        $scope.startTasks = [];
        //查询选项
        $scope.options = {};
        $scope.options.params = {};

        $scope.queryTask = function () {
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.search();
        }

        $scope.taskClick = function (item) {
            var map = myChart.getModel().getComponent('bmap').getBMap();

            if (item != null && item.StartLng != null && item.StartLat != null) {             
                var point = new BMap.Point(item.StartLng, item.StartLat);

                var opts = {
                    width: 200, // 信息窗口宽度
                    height: 100, // 信息窗口高度
                    title:  "服务对象：" + item.PersonName + '</br>', // 信息窗口标题
                    enableMessage: true, //设置允许信息窗发送短息
                    message: ""
                }

                var serviceName = item.ServiceName == null ? "" : "服务方式： " + item.ServiceName + '</br>';
                var operator = item.Operator == null ? "" : "工作人员："+item.Operator + '</br>';
                var address = item.Address == null ? "" : "地    址：" + item.Address + '</br>';
                var beginTime = item.BeginTime == null ? "" : "开始时间：" + item.BeginTime.replace("T", " ") + '</br>';

                var infoWindow = new BMap.InfoWindow(serviceName + operator + address + beginTime, opts); // 创建信息窗口对象 

                map.openInfoWindow(infoWindow, point); //开启信息窗口
                map.centerAndZoom(point, 15);
            } else if (item != null && (item.Lng == null || item.Lat == null)) {
                myChart.getModel().getComponent('bmap').getBMap().closeInfoWindow();
                utility.message("缺少位置信息！");
            }
        }

        $scope.enterEvent = function (e) {
            $scope.options.enterEvent(e);
        }

        var locationResStartTask = resourceFactory.getResource('locationResStartTask');
        //查询所有
        $scope.init = function () {
            $scope.options = {
                buttons: [],
                ajaxObject: locationResStartTask,
                params: { "Data.Status": ["Execution"], "Data.StartHasLocation": true },
                success: function (data) {
                    $scope.startTasks = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 19
                }
            }
        }

        $scope.init();

    }])
.controller("endTaskLocationCtrl", ['$scope', 'resourceFactory','utility', function ($scope, resourceFactory,utility) {
    var now = new Date();
    $scope.pageData = {
        EndTimeStart: now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 00:00:00",
        EndTimeEnd: now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " 23:59:59",
    };
    var locationRes = resourceFactory.getResource('locationRes');
    var myChart = echarts.init(document.getElementById('endTaskLocation'));
    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $.getScript("/Content/echarts/extension/bmap.min.js", function () {
            $scope.search = function () {
                myChart.showLoading();

                var orgRes = resourceFactory.getResource("orgRes");
                var orgInfo = {};
                orgRes.get({ organizationID: $scope.$root.user.OrgId }, function (data) {
                    if (data.Data) {
                        orgInfo = data.Data;
                    }
                });

                locationRes.EndTask({"Data.Status": ["Finish"], "Data.EndHasLocation": true }, function (data) {
                    var points = [];
                    angular.forEach(data.Data, function (item, index) {
                        points[points.length] = new BMap.Point(item.EndLng, item.EndLat);
                    });

                    //坐标转换完之后的回调函数
                    var translateCallback = function (newData) {
                        if (newData.status === 0) {
                            for (var i = 0; i < newData.points.length; i++) {
                                data.Data[i].Lng = newData.points[i].lng;
                                data.Data[i].Lat = newData.points[i].lat;
                            }
                        }
                        // 任务结束时的位置
                        (function (list) {
                            myChart.hideLoading();
                            var firstPoint = [114.114129, 37.550339];
                            if (list.length > 0) {
                                firstPoint = [list[0].Lng, list[0].Lat];
                            }
                            var maxLng = firstPoint[0], minLng = firstPoint[0], maxLat = firstPoint[1], minLat = firstPoint[1];
                            var convertData = function (data) {
                                var res = [];
                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i];
                                    if (item.Lat != null && item.Lng != null) {
                                        res.push({
                                            name: item.PersonName,
                                            value: [item.Lng, item.Lat, item.Address]
                                        });
                                        if (item.Lat > maxLat) {
                                            maxLat = item.Lat;
                                        }
                                        if (item.Lng > maxLng) {
                                            maxLng = item.Lng;
                                        }
                                        if (item.Lat < minLat) {
                                            minLat = item.Lat;
                                        }
                                        if (item.Lng < minLng) {
                                            minLng = item.Lng;
                                        }
                                    }
                                }
                                return res;
                            };

                            var locationData = convertData(data.Data);
                            firstPoint = [minLng + (maxLng - minLng) / 2, minLat + (maxLat - minLat) / 2];
                            var option = {
                                tooltip: {
                                    trigger: 'item',
                                    formatter: function (param) {
                                        return param.name + "：" + param.value[2];
                                    }
                                },
                                bmap: {
                                    center: firstPoint,
                                    zoom: 10,
                                    roam: true,
                                },
                                series: [
                                    {
                                        name: '任务结束时的位置',
                                        type: 'scatter',
                                        coordinateSystem: 'bmap',
                                        data: locationData,
                                        symbolSize: function (val) {
                                            //return val[2] / 10;
                                            return 30;
                                        },
                                        symbol: "image://Images/Report/home/home_position.png"
                                    }
                                ]
                            };

                            myChart.setOption(option);
                            
                            if (list.length == 0) {
                                if (orgInfo != null && orgInfo.Lng != null && orgInfo.Lat != null) {
                                    firstPoint = [orgInfo.Lng, orgInfo.Lat];
                                }

                                var point = new BMap.Point(firstPoint[0], firstPoint[1]);
                                myChart.getModel().getComponent('bmap').getBMap().centerAndZoom(point, 8);
                            }
                            else myChart.getModel().getComponent('bmap').getBMap().setViewport(newData.points);

                        }(data.Data));
                    }

                    var convertor = new BMap.Convertor();
                    convertor.translate(points, 5, 5, translateCallback);
                });
            };
            $scope.search();
        });
    });


        $scope.endTasks = [];
        //查询选项
        $scope.options = {};
        $scope.options.params = {};

        $scope.queryTask = function () {
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.search();
        }

        $scope.taskClick = function (item) {
            var map = myChart.getModel().getComponent('bmap').getBMap();
            if (item != null && item.EndLng != null && item.EndLat != null) {              
                var point = new BMap.Point(item.EndLng, item.EndLat);

                var opts = {
                    width: 200, // 信息窗口宽度
                    height: 100, // 信息窗口高度
                    title: "服务对象：" + item.PersonName + '</br>', // 信息窗口标题
                    enableMessage: true, //设置允许信息窗发送短息
                    message: ""
                }

                var serviceName = item.ServiceName == null ? "" : "服务方式： " + item.ServiceName + '</br>';
                var operator = item.Operator == null ? "" : "工作人员：" + item.Operator + '</br>';
                var address = item.Address == null ? "" : "地    址：" + item.Address + '</br>';
                var endTime = item.EndTime == null ? "" : "结束时间：" + item.EndTime.replace("T"," ") + '</br>';

                var infoWindow = new BMap.InfoWindow(serviceName + operator + address + endTime, opts); // 创建信息窗口对象 

                map.openInfoWindow(infoWindow, point); //开启信息窗口
                map.centerAndZoom(point, 15);
            } else if (item != null && (item.Lng == null || item.Lat == null)) {
                myChart.getModel().getComponent('bmap').getBMap().closeInfoWindow();
                utility.message("缺少位置信息！");
            }
        }

        $scope.enterEvent = function (e) {
            $scope.options.enterEvent(e);
        }

        var locationResEndTask = resourceFactory.getResource('locationResEndTask');
        //查询所有
        $scope.init = function () {
            $scope.options = {
                buttons: [],
                ajaxObject: locationResEndTask,
                params: {"Data.Status": ["Finish"], "Data.EndHasLocation": true },
                success: function (data) {
                    $scope.endTasks = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 19
                }
            }
        }

        $scope.init();

}]).controller("MonitorSOSCtrl", ['$scope', '$interval', 'resourceFactory','utility', function ($scope, $interval,resourceFactory,utility) {

    var residentRes = resourceFactory.getResource('residentRes');
    var myChart = echarts.init(document.getElementById('sosLocation'));
    $scope.tempdata = {};

    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $.getScript("/Content/echarts/extension/bmap.min.js", function () {
            myChart.showLoading();
            var orgRes = resourceFactory.getResource("orgRes");

            orgRes.get({ organizationID: $scope.$root.user.OrgId }, function (data) {
                if (data.Data) {
                    $scope.orgInfo = data.Data;
                }
            });

            var option = {
                animation: true,
                tooltip: {
                    trigger: 'item',
                    formatter: function (param) {
                        return param.name + "(" + param.value[2] + ")&nbsp;" + param.value[4] + " </br>" + param.value[3];
                    }
                },
                bmap: {
                    //center: firstPoint,
                    zoom: 10,
                    roam: true,
                },
                series: [
                    {
                        name: 'SOS监控',
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        symbolSize: function (val) {
                            //return val[2] / 10;
                            return 30;
                        },
                        pointSize: 5,
                        blurSize: 6,
                        symbol: "image://Images/Report/home/sos.gif"
                    }
                ]
            };

            myChart.setOption(option);
            LoadData();
        });
    });

    function LoadData() {
        if (myChart == undefined) {
            return;
        }
        var option = myChart.getOption();
        if (option != undefined) {
            var res = [];
            var points = [];
            residentRes.GetSosData({'name':""}, function (data) {
                myChart.hideLoading();
                angular.forEach(data.Data, function (item, index) {
                    points[points.length] = new BMap.Point(item.Lng, item.Lat);
                    if (item.Lat != null && item.Lng != null) {
                        res.push({
                            name: item.Name,
                            value: [item.Lng, item.Lat, item.Phone, item.Address, $scope.GetUtcTime(item.EmgDate)]
                        });
                    }
                });

                option.series[0].data = res;
                myChart.setOption(option);
          
                if (res == null || res.length == 0) {
                    if ($scope.orgInfo != null && $scope.orgInfo.Lng != null && $scope.orgInfo.Lat != null) {
                        var point = new BMap.Point($scope.orgInfo.Lng, $scope.orgInfo.Lat);
                        myChart.getModel().getComponent('bmap').getBMap().centerAndZoom(point, 10);
                    }
                }
                else myChart.getModel().getComponent('bmap').getBMap().setViewport(points);
            });
        }
    }

    $scope.GetUtcTime = function(strUtc) {
        if (strUtc == "" || strUtc == undefined || strUtc == null) {
            return "";
        }
        var newDate = new Date();
        newDate.setTime(strUtc);
        return newDate.toLocaleTimeString();
    }


    $scope.timer = $interval(function () {
        LoadData();
        myChart.getModel().getComponent('bmap').getBMap().closeInfoWindow();
    }, 5000);

    $scope.$on('$destroy', function () {
        $interval.cancel($scope.timer);
    }); //在控制器里，添加$on函数


    $scope.sosDatas = [];
        //查询选项
    $scope.options = {};
    $scope.options.params = {};

    $scope.searchSosData = function () {
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.search();
    }

    $scope.sosDataClick = function (item) {
        var map = myChart.getModel().getComponent('bmap').getBMap();

        if (item != null && item.Lng != null && item.Lat != null) {         
            var point = new BMap.Point(item.Lng, item.Lat);

            var opts = {
                width: 200, // 信息窗口宽度
                height: 100, // 信息窗口高度
                title: item.Name, // 信息窗口标题
                enableMessage: true, //设置允许信息窗发送短息
                message: ""
            }

            var phone = item.Phone == null ? "" : "联系方式： " + item.Phone + '</br>';
            var date = item.EmgDate == null ? "" : "时间：" + $scope.GetUtcTime(item.EmgDate) + '</br>';
            var address = item.Address == null ? "" : "地    址：" + item.Address;

            $scope.infoWindow = new BMap.InfoWindow(phone + date + address, opts); // 创建信息窗口对象 

            map.openInfoWindow($scope.infoWindow, point); //开启信息窗口
            map.centerAndZoom(point,15);
        } else if (item != null && (item.Lng == null || item.Lat == null)) {
            myChart.getModel().getComponent('bmap').getBMap().closeInfoWindow();
            utility.message("缺少位置信息！");
        }
    }

    $scope.enterEvent = function (e) {
        $scope.options.enterEvent(e);
    }

    var residentGetSosData = resourceFactory.getResource('residentGetSosData');
    //查询所有
    $scope.init = function () {
        $scope.options = {
            buttons: [],
            ajaxObject: residentGetSosData,
            params: { "name": "" },
            success: function (data) {
                $scope.sosDatas = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 19
            }
        }
    }

    $scope.init();       
}])
    .controller("ScreenDisplayCtrl",['$scope','$timeout',function ($scope,$timeout) {
        $scope.isFullScreen = false;
        $scope.isFistgetTop3 = true;
        $scope.isgetTop3 = false;
        //语音文本
        // Reference the auto-generated proxy for the hub.
        var chat = $.connection.screenDisplayHub;
        // Create a function that the hub can call back to display messages.
        chat.client.clientAddGroupMessage = function (broadcartContent, url) {
            $scope.isFistgetTop3 = false;
            $scope.isgetTop3 = true;
            var audio = document.getElementById("audioCall");
            $('#datacon-call-text').text(broadcartContent);
            audio.src = url;
            audio.play();
        };

        // Start the connection.
        $.connection.hub.start().done(function () {
            chat.server.serverAddGroup('12345678');
        });

        //科室
        $scope.roomData = [
            {
                'id':-1,
                'name':'全部',
                'isFullScreen':false
            },
            {
                'id':1,
                'name':'体检科',
                'isFullScreen':false
            },
            {
                'id':2,
                'name':'经络理疗科',
                'isFullScreen':false
            }


        ]
        $scope.roomDataDetail = [
            {
                'id':1,
                'name':'体检科',
                'isFullScreen':false
            },
            {
                'id':2,
                'name':'经络理疗科',
                'isFullScreen':false
            }


        ]
        $scope.roomName = $scope.roomData[0].id;
        $scope.changeRoom = function (room) {
            if(room == -1){
                $scope.roomDataDetail = [
                    {
                        'id':1,
                        'name':'体检科',
                        'isFullScreen':false
                    },
                    {
                        'id':2,
                        'name':'经络理疗科',
                        'isFullScreen':false
                    }]
            }else{
                $scope.roomDataDetail = [{
                    'id':room,
                    'name':room==1?'体检科':'经络理疗科',
                    'isFullScreen':false
                }]
            }
            console.log($scope.roomDataDetail)

        }
        //全屏
        $scope.checkFullScreen = function (id) {
            $("#"+id).fullScreen({background:'#2a72dd',callback:function () {
                _.forEach($scope.roomDataDetail,function (n, key) {
                    n.isFullScreen = $.fullScreenStatus();
                })
            }});

        }
    }]);