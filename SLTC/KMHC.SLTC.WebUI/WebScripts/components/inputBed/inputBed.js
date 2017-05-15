/*
创建人:肖国栋
创建日期:2016-03-11
说明:自定义床位录入控件
*/
angular.module("extentComponent")
.directive("inputBed", ['bedRes', function (bedRes) {
    return {
        resctict: "E",
        templateUrl: "/WebScripts/components/inputBed/inputBed.html",
        scope: {
            value: "@value",
            callbackFn: "&callback",
            required: "@required"
        },
        link: function (scope, element, attrs) {
            scope.Beds = bedRes.query();

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
                scope.searchWords = item.Code;//输入框显示选择的姓名
                scope.value = item.Code;
                scope.callbackFn({ item: item });//回调函数
                scope.showList = false;//隐藏列表
            };


            //根据关键字过滤结果
            scope.filterItems = function (item) {
                return (angular.isDefined(item.Code) && item.Code.indexOf(scope.searchWords) >= 0)
                          ||
                       (angular.isDefined(item.RoomNo) && item.RoomNo.indexOf(scope.searchWords) >= 0)
                          ||
                       (angular.isDefined(item.Floor) && item.Floor.indexOf(scope.searchWords) >= 0)
                          ||
                        !angular.isDefined(scope.searchWords)
            };

            //监控传入值的改变,同步关键字显示
            scope.$watch("value", function (newValue) {
                scope.searchWords = newValue;
            });
        }
    }
}]);
