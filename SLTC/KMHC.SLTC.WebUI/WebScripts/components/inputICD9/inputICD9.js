angular.module("extentComponent")
.directive("inputICD9", ['icd9Res', function (icd9Res) {
    return {
        resctict: "E",
        templateUrl: "/WebScripts/components/inputICD9/inputICD9.html",
        scope: {
            value: "@value",
            callbackFn: "&callback",
            required: "@required"
        },
        link: function (scope, element, attrs) {
           //icd9Res.get({ keyWord: "" }, function (data) {
           //    scope.items = data.Data
           // });

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
                if (scope.showList) {
                    icd9Res.get({ keyWord: scope.searchWords,currentPage: 1, pageSize: 10  }, function (data) {
                        scope.items = data.Data
                    });
                }
            }

            scope.rowClick = function (item) {
                scope.callbackFn({ item: item });//回调函数
                scope.showList = false;//隐藏列表
            };
            //根据关键字过滤结果
            scope.filterItems = function (item) {
                return ((angular.isDefined(item.IcdCode) && item.IcdCode.indexOf(scope.searchWords) >= 0) ||
                        (angular.isDefined(item.EngName) && item.EngName.indexOf(scope.searchWords) >= 0) ||
                        !angular.isDefined(scope.searchWords)
                );
            };

            //监控传入值的改变,同步关键字显示
            scope.$watch("value", function (newValue) {
                if (angular.isDefined(newValue) && newValue != "") {

                }
            });
        }
    }
}]);

