/*
创建人:刘美方
创建日期:2016-03-11
说明:自定义客户录入控件
*/
angular.module("extentComponent")
    .directive("inputPerson", ['$timeout', 'resourceFactory', function ($timeout, resourceFactory) {
        return {
            resctict: "E",
            templateUrl: "/WebScripts/components/inputPerson/inputPerson.html",
            scope: {
                value: "@value",
                callbackFn: "&callback",
                required: "@required"
            },
            link: function (scope, element, attrs) {
                var empGroup = attrs["empGroup"];
                var readonly = attrs["readonly"];
                if (!empGroup) {
                    empGroup = "";
                }
                if (readonly == "readonly") {
                    element.find("input").attr("readonly", "readonly");
                }

                element.find("input").val(scope.value);

                scope.blur = function () {
                    $timeout.cancel(scope.t1);
                    scope.t1 = $timeout(function () {
                        scope.showList = false;
                    }, 150);
                }

                scope.focus = function () {
                    if (!scope.Selected) {
                        scope.change();
                    }
                }

                scope.change = function () {
                    search();
                    scope.showList = (angular.isDefined(scope.searchWords) && scope.searchWords != "");
                    scope.Selected = false;
                }

                scope.rowClick = function (item) {
                    scope.searchWords = item.Name;//输入框显示选择的姓名
                    scope.value = item.id;
                    scope.callbackFn({ person: item });//回调函数
                    scope.showList = false;//隐藏列表
                    scope.Selected = true;
                };

                function search() {
                    if (scope.searchWords != null && scope.searchWords != "") {
                        resourceFactory.getResource("personRes").get({ "Data.SearchKey": scope.searchWords }, function (data) {
                            if (data.Data) {
                                scope.items = data.Data;
                            }
                        });
                    }
                }

                //监控传入值的改变,同步关键字显示
                scope.$watch("value", function (newValue) {
                    if (angular.isDefined(newValue) && newValue != "") {
                        resourceFactory.getResource("personRes").get({ "Data.PersonID": newValue }, function (data) {
                            if (data.Data && data.Data.length > 0) {
                                scope.searchWords = data.Data[0].Name;
                            }
                        });
                    } else {
                        if (newValue != undefined) {
                            scope.searchWords = newValue;
                        }
                    }
                });


                var rowNo = -1;
                scope.keydown = function (e) {
                    if (e.keyCode == 9) {
                        scope.showList = false;
                    }
                    var tElement = $("#tb tbody tr"), indis = -1, len = tElement.length;

                    //Up,Down事件的标识代码
                    if ((e.keyCode == 38 && (rowNo = ((rowNo == 0 || rowNo == -1) ? len : rowNo)) > -2) || (e.keyCode == 40 && (indis = 1) && (rowNo = (rowNo == len - 1 ? -1 : rowNo)) > -2)) {

                        for (var k = 0; k < len; k++) {
                            tElement[k].style.backgroundColor = "lightgray";
                        }
                        tElement[rowNo += indis].style.backgroundColor = "#FFFFFF";
                    }

                    //Enter事件的标识代码
                    if (e.keyCode == 13 && rowNo != -1) {
                        for (var k = 0; k < len; k++) {
                            if (rowNo == k) {
                                scope.rowClick(scope.items[k]);
                                break;
                            }
                        }
                    }
                }


            }
        }
    }])
;
