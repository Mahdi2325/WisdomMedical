/*
创建人:肖国栋
创建日期:2016-03-10
说明:自定义部門录入控件
*/
angular.module("extentComponent")
.directive("inputOrg", ['orgRes', function (orgRes) {
    return {
        resctict: "E",
        templateUrl: "/WebScripts/components/inputOrg/inputOrg.html",
        scope: {
            value: "@value",
            callbackFn: "&callback",
            required: "@required"
        },
        link: function (scope, element, attrs) {
            scope.Orgs = orgRes.query();

            scope.focus = function () {
                scope.showList = true;
            }

            scope.keydown = function () {
                if (event.keyCode == 9) {
                    scope.showList = false;
                }
            }

            scope.mouseleave = function () {
                scope.showList = false;
            };

            scope.change = function () {
                scope.showList = (angular.isDefined(scope.searchWords) && scope.searchWords != "");
            }

            scope.rowClick = function (item) {
                scope.searchWords = item.OrgName;//输入框显示选择的姓名
                scope.value = item.OrgID;
                scope.callbackFn({ item: item });//回调函数
                scope.showList = false;//隐藏列表
            };


            //根据关键字过滤结果
            scope.filterItems = function (item) {
                return (angular.isDefined(item.OrgID) && item.OrgID.indexOf(scope.searchWords) >= 0)
                    ||
                    (angular.isDefined(item.OrgName) && item.OrgName.indexOf(scope.searchWords) >= 0)
                    ||
                    !angular.isDefined(scope.searchWords);
            };

            //监控传入值的改变,同步关键字显示
            scope.$watch("value", function (newValue) {
                if (angular.isDefined(newValue) && newValue != "") {
                    orgRes.query({ currentPage: 1, pageSize: 10, name: $scope.keyword, id: $scope.keyword }, function (data) {
                        if (data.length > 0) {
                            scope.searchWords = data[0].OrgName;
                        }
                    });
                }
            });
        }
    }
}]);
