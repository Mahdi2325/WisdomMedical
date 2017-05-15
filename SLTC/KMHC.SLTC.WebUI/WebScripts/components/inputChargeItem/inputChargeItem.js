angular.module("extentComponent")
.directive("inputChargeItem", ['resourceFactory', function (resourceFactory) {
    return {
        resctict: "E",
        templateUrl: "/WebScripts/components/inputChargeItem/inputChargeItem.html",
        scope: {
            value: "@value",
            callbackFn: "&callback",
            required: "@required"
        },
        controller: ['$scope', function ($scope) {
            var chargeItemRes = resourceFactory.getResource("chargeItemRes");
            chargeItemRes.get({ OrganizationID: $scope.$root.curUser.OrganizationID }, function (data) {
                $scope.chargeItems = data.Data;
            });

            $scope.change = function () {
                $scope.showList = (angular.isDefined($scope.searchWords) && $scope.searchWords != "");
                if ($scope.showList) {
                    chargeItemRes.get({ "Data.CIName": $scope.searchWords, currentPage: 1, pageSize: 100}, function (data) {
                        $scope.chargeItems = data.Data
                    });
                }
            }


            $scope.rowCick = function (item) {
                $scope.searchWords = item.CINo;//输入框显示选择的编码
                $scope.callbackFn({ item: item });//回调函数
                $scope.showList = false;//隐藏列表
            };


            //根据关键字过滤结果
            $scope.filterItems = function (item) {              
                if (item.CINo != undefined && item.CIName != undefined) {
                    return item.CINo.indexOf($scope.searchWords) >= 0 ||
                     item.CIName.indexOf($scope.searchWords) >= 0;
                }
            };

            //监控传入值的改变,同步关键字显示
            $scope.$watch("value", function (newValue) {
                $scope.searchWords = newValue;
            });
        }]
    }
}]);
