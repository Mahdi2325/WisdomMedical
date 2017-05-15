/*
创建人:肖国栋
创建日期:2016-03-10
说明:自定义员工录入控件
001	E00.013	護理
002	E00.013	社工
003	E00.013	營養
004	E00.013	職能治療
005	E00.013	物理治療
006	E00.013	醫師
007	E00.013	心理
008	E00.013	共同
009	E00.013	其他
*/
angular.module("extentComponent")
.directive("inputStaff", ['$timeout', 'resourceFactory', function ($timeout, resourceFactory) {
    return {
        resctict: "E",
        templateUrl: "/WebScripts/components/inputStaff/inputStaff.html",
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


            //scope.keydown = function (e) {
            //    if (e.keyCode == 9) {
            //        scope.showList = false;
            //    }
            //}

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
                scope.searchWords = item.EmpName;//输入框显示选择的姓名
                scope.value = item.EmpNO;
                scope.callbackFn({ item: item });//回调函数
                scope.showList = false;//隐藏列表
                scope.Selected = true;
            };

            function search() {
                if (scope.searchWords != null && scope.searchWords != "") {

                    resourceFactory.getResource("employeeRes").get({ "Data.SearchWords": scope.searchWords, "Data.EmpState": "001", currentPage: 1, pageSize: 10 }, function (response) {
                        scope.empFiles = response.Data;
                    });
                }
            }

            //监控传入值的改变,同步关键字显示
            scope.$watch("value", function (newValue) {
                if (angular.isDefined(newValue) && newValue != "") {
                    resourceFactory.getResource("employeeRes").get({ id: newValue }, function (data) {
                        if (data.Data) {
                            scope.searchWords = data.Data.EmpName;
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
                            tElement[k].click();
                        }
                    }
                }
            }


        }
    }
}])
.filter('employeeFilter', function () {
    return function (input, param1) {
        if (input && input.length > 0) {
            var filtered = [];
            $.each(input, function () {
                if (this.EmpNo === param1 || (this.EmpName && this.EmpName.indexOf(param1) >= 0)) {
                    filtered.push(this);
                }
            });
            return filtered;
        }
    };
});
