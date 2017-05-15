angular.module("extentComponent")
.directive("residentList", ['DCResidentRes', function (DCResidentRes) {
    return {
        resctict: "EA",
        templateUrl: "/WebScripts/components/residentList/residentList.html",
        scope: {
            //value: "@value",
            callbackFn: "&callback"
        },
        controller: ['$scope', function ($scope) {
            $scope.resident = { residentName: '', ipdFlag: "I", stationCode: '', residentNo: '' };
            DCResidentRes.get($scope.resident, function (data) {
                $scope.residentList = data.Data;
            });
            $scope.rowClick = function (item) {
                $scope.callbackFn({ resident: item });//回调函数
            };

            $scope.Search = function () {
                DCResidentRes.get($scope.resident, function (data) {
                    $scope.residentList = data.Data;
                });
            }
        }],
        link: function (scope, element, attrs) {
           
        }
    }
}]);
