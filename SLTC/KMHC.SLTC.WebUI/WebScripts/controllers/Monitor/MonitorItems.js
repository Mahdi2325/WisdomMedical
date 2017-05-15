angular.module("sltcApp")
.controller("MonitorItemsCtrl", ['$scope', '$state', 'utility', 'resourceFactory', function ($scope, $state, utility, resourceFactory) {
    var monitoritemRes = resourceFactory.getResource('monitoritemRes');
    $scope.MonitorItems = [];
    $scope.init = function () {
        monitoritemRes.query({}, function (data) {
            $scope.MonitorItems = data;
        });
    }

    $scope.MonitorItemDelete = function (item) {
        utility.confirm("您确定要删除该监测项目吗?", function (result) {
            if (result) {
                monitoritemRes.delete({ id: item.id }, function (data) {
                    $scope.MonitorItems.splice($scope.MonitorItems.indexOf(item), 1);
                });
            }
        });
    }

    $scope.init();


}])
.controller("MonitorItemEditCtrl", ['$scope', '$state', '$stateParams', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, utility, resourceFactory) {
    var monitoritemRes = resourceFactory.getResource('monitoritemRes');
    $scope.MonitorItem = {};

    if ($stateParams.id) {
        monitoritemRes.get({ id: $stateParams.id }, function (data) {
            $scope.MonitorItem = data;
        });
    }


    $scope.saveMonitorItem = function () {
        if ($scope.MonitorItem.MINo && $scope.MonitorItem.MINo != '') {
            if ($scope.MonitorItem.id && $scope.MonitorItem.id != '') {
                monitoritemRes.save($scope.MonitorItem, function (data) {
                    utility.message("监测项目 " + data.MIName + "  保存成功!");
                    $state.go("MonitorItems");
                });
            } else {
                monitoritemRes.query({ MINo: $scope.MonitorItem.MINo }, function (result) {
                    if (result && result.length > 0)
                    {
                        utility.message("监测项目编号 " + $scope.MonitorItem.MINo + "  已存在!");
                    } else {
                        monitoritemRes.save($scope.MonitorItem, function (data) {
                            utility.message("监测项目 " + data.MIName + "  保存成功!");
                            $state.go("MonitorItems");
                        });
                    }
                });
            }

        } else {
            utility.message("监测项目编号不能为空!");
        }
    }

}]);