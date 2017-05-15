/*
创建人: 肖国栋
创建日期:2016-07-25
说明:服务中心
*/

angular.module("sltcApp")
.controller("serviceCenterCtrl", ['$scope', '$location', '$state', '$interval', '$filter', 'resourceFactory', 'resourceBase', 'utility', function ($scope, $location, $state,$interval, $filter, resourceFactory, resourceBase, utility) {
    
    $scope.Data = {};
    //资源实例化
    var taskMonitorRes = resourceFactory.getResource("taskMonitorRes");
    var employeeRes = resourceFactory.getResource("employees");

    //获取服务人员信息
    employeeRes.get({ "Data.JobTitle": "6124" }, function (data) {
        $scope.Data.Emps = data.Data;
    });

    $scope.ServiceOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseServiceOrder", serviceOrderID);
    }

    function LoadData() {
        taskMonitorRes.get({ "Data": {} }, function (data) {
            $scope.Data.Residents = data.Data.Residents;
            $scope.Data.ServiceList = data.Data.ServiceList;
            $scope.Data.RemindList = data.Data.RemindList;
            $scope.Data.TodayCompleteTotal = data.Data.TodayCompleteTotal;
            $scope.Data.ExecutionTotal = data.Data.ExecutionTotal;
            $scope.Data.CompleteTotal = data.Data.CompleteTotal;
            $scope.Data.Message = data.Data.Message;
        });
    }

    $scope.timer = $interval(function () {
        LoadData();
    }, 5000);

    $scope.$on('$destroy', function () {
        $interval.cancel($scope.timer);
    }); //在控制器里，添加$on函数
}]);
