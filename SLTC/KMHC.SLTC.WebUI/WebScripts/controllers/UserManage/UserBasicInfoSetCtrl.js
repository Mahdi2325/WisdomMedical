/*
        创建人: 李林玉
        创建日期:2016-06-21
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("UserBasicInfoSetCtrl", ['$scope', '$http', '$location', '$stateParams', '$timeout', 'utility', 'resourceFactory',
    function ($scope, $http, $location, $stateParams, $timeout, utility, resourceFactory) {
        var employeeRes = resourceFactory.getResource("employeeRes");
        var orgRes = resourceFactory.getResource("orgs");
        $scope.Data = {};
        $scope.Data.Emp = {};
        //$scope.Info = {};


        //$scope.resident = {};
        $scope.loadModelList = function () {
            employeeRes.get({ 'Data.UserId': $scope.$root.user.UserId, 'pageSize': 0 }, function (data) {
                if (data != null && data.Data != null && data.Data.length > 0) {
                    $scope.Data.Emp = data.Data[0];
                    $scope.AddressDetail = data.Data[0].City + data.Data[0].Address;
                    $timeout(function () {
                        $("#myAddress1").citypicker("refresh");
                    }, 1);
                }

            });

            orgRes.get({ 'Data.OrgIds': $scope.$root.user.OrgIds, 'pageSize': 0 }).$promise.then(function (result) {
                $scope.Data.Orgs = result.Data;
            });

        }
        $scope.loadModelList();
        $scope.save = function () {
            var vals = $("#myAddress1").val();
            if (vals != "") {
                var lastIndex = vals.lastIndexOf("-");
                $scope.Data.Emp.City = vals.substring(0, lastIndex + 1);
                $scope.Data.Emp.Address = vals.substring(lastIndex + 1, vals.length);
            }
            employeeRes.save($scope.Data.Emp, function (data) {
                $location.url('/');
            });
            utility.message($scope.Data.Emp.EmpName + "的信息保存成功！");
        }

    }]);
