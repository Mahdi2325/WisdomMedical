angular.module("extentComponent")
.directive("inputMonitorItem", ['resourceFactory', function (resourceFactory) {
    var monitoritemRes = resourceFactory.getResource('monitoritemRes');
    return {
        resctict: "E",
        templateUrl: "/WebScripts/components/inputMonitorItem/inputMonitorItem.html",
        scope: {
            value: "@value",
            callbackFn: "&callback",
            required: "@required"
        },
        controller: ['$scope', function ($scope) {
            monitoritemRes.query({},function (data) {
                $scope.monitorItems = data;
            });

            $scope.change = function () {
                $scope.showList = (angular.isDefined($scope.searchWords) && $scope.searchWords != "");
            }


            $scope.rowCick = function (item) {
                $scope.searchWords = item.MINo;//输入框显示选择的编码
                $scope.callbackFn({ item: item });//回调函数
                $scope.showList = false;//隐藏列表
            };


            //根据关键字过滤结果
            $scope.filterItems = function (item) {
                if (item.MINo != undefined && item.MIName != undefined) {
                    return item.MINo.indexOf($scope.searchWords) >= 0 ||
                     item.MIName.indexOf($scope.searchWords) >= 0;
                }
            };

            //监控传入值的改变,同步关键字显示
            $scope.$watch("value", function (newValue) {
                $scope.searchWords = newValue;
            });
        }]
    }
}]);
