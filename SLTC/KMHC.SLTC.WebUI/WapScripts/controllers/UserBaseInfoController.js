/*
        创建人: jacklai
        创建日期:2016-05-26
        说明: 基本信息
*/

angular.module("sltcWapApp")
.controller("UserBaseInfoCtrl", ['$scope', '$http', '$state', '$location', '$stateParams', 'personRes', function ($scope, $http, $state, $location, $stateParams, personRes) {
    $scope.Init = function () {
        var id = $stateParams.id;
        $scope.Person = {};
        if (id) {
            personRes.get({ id: id }, function (data) {
                $scope.Person = data;
            });
        }
    };

    $scope.Init();
}])