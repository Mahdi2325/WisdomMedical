/*
创建人:刘美方
创建日期:2016-03-11
说明:自定义客户录入控件
*/
angular.module("extentComponent")
    .directive("inputAddress", ['$timeout', 'resourceFactory', function ($timeout, resourceFactory) {
        return {
            resctict: "E",
            templateUrl: "/WebScripts/components/inputAddress/inputAddress.html",
            scope: {
                value: "@value",
                callbackFn: "&callback",
                required: "@required"
            },
            link: function (scope, element, attrs) {
                scope.InputAddress = {};
                var readonly = attrs["readonly"];
                if (readonly == "readonly") {
                    element.find("input").attr("readonly", "readonly");
                }

                scope.blur = function () {                   
                    scope.showList = false;
                }

                scope.focus = function () {
                    scope.showList = true;
                }
                scope.click = function () {
                    myValue = scope.searchWords;
                    if (angular.isDefined(scope.searchWords) && scope.searchWords != "") {
                        setPlace();
                    }
                }

                var map;
                var ac;
                var myValue;
                var startPoint;
                scope.initialize = function() {
                    map = new BMap.Map('searchMap');
                    startPoint = new BMap.Point(116.395645, 39.929986);
                    map.centerAndZoom(startPoint, 12);
                    ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                                {
                                    "input": "searchWords"
                                , "location": map
                                });
                    var geolocation = new BMap.Geolocation();
                    geolocation.getCurrentPosition(function (pos) {
                        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                            map.centerAndZoom(pos.point, 12);
                            ac.setLocation(pos.point);
                        }
                    });
                    ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
                        var str = "";
                        var _value = e.fromitem.value;
                        var value = "";
                        if (e.fromitem.index > -1) {
                            value = _value.province + _value.city + _value.district + _value.street + _value.business;
                        }
                        str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                        value = "";
                        if (e.toitem.index > -1) {
                            _value = e.toitem.value;
                            value = _value.province + _value.city + _value.district + _value.street + _value.business;
                        }
                        str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                        $("#searchResultPanel").html(str);
                    });

                    ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                        var _value = e.item.value;
                        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                        $("#searchResultPanel").html("onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue);
                        scope.InputAddress.City = _value.city;
                        scope.InputAddress.Address = _value.district + _value.street + _value.business+_value.streetNumber;
                        setPlace();
                        $("#searchWords").focus();
                        scope.callbackFn({ address: scope.InputAddress });//回调函数
                    });
                }
                

                //监控传入值的改变,同步关键字显示
                scope.$watch("value", function (newValue) {
                    ac.setInputValue(newValue);
                });

                function setPlace() {
                    map.clearOverlays();    //清除地图上所有覆盖物

                    var local = new BMap.LocalSearch(map, { //智能搜索
                        onSearchComplete: function () {
                            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                            map.centerAndZoom(pp, 18);
                            map.addOverlay(new BMap.Marker(pp));    //添加标注
                            scope.InputAddress.Lng = pp.lng;
                            scope.InputAddress.Lat = pp.lat;
                            scope.callbackFn({ address: scope.InputAddress });//回调函数
                        }
                    });
                    local.search(myValue);
                }
                scope.initialize();
            }
        }
    }])
;
