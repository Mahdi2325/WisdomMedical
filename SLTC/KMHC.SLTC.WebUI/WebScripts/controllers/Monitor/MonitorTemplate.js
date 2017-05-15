angular.module("sltcApp")
.controller("MonitorTemplatesCtrl", ['$scope', '$state', 'utility', 'resourceFactory', function ($scope, $state, utility, resourceFactory) {
    var monitortemplateRes = resourceFactory.getResource('monitortemplateRes');
    $scope.MonitorTemplates = [];
    $scope.init = function () {
        monitortemplateRes.query({}, function (data) {
            $scope.MonitorTemplates = data;
        });
    }

    $scope.MonitorTemplateDelete = function (item) {
        utility.confirm("您确定要删除该监测模版吗?", function (result) {
            if (result) {
                monitortemplateRes.delete({ id: item.id }, function (data) {
                    $scope.MonitorTemplates.splice($scope.MonitorTemplates.indexOf(item), 1);
                });
            }
        });
    }

    $scope.init();


}])
.controller("MonitorTemplateEditCtrl", ['$scope', '$state', '$stateParams', '$filter', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, $filter, utility, resourceFactory) {
    var monitortemplateRes = resourceFactory.getResource('monitortemplateRes');
    var monitoritemRes = resourceFactory.getResource('monitoritemRes');
    $scope.MonitorTemplate = { Items: [] };

    if ($stateParams.id) {
        monitortemplateRes.get({ id: $stateParams.id }, function (data) {
            monitoritemRes.query({}, function (list) {
                var miItem = [];
                var miObj = {};
                $.each(list, function () {
                    miObj[this.MINo] = this;
                });

                $.each(data.Items, function () {
                    var mi = miObj[this];
                    if (mi)
                    {
                        miItem.push(mi);
                    }
                });

                data.Items = miItem;
                $scope.MonitorTemplate = data;
            });
        });
    }


    $scope.saveMonitorTemplate = function () {
        if ($scope.MonitorTemplate.MTNo && $scope.MonitorTemplate.MTNo != '' && $scope.MonitorTemplate.Items.length > 0) {
            var miid = [];
            $.each($scope.MonitorTemplate.Items, function () {
                miid.push(this.MINo);
            });
            if ($scope.MonitorTemplate.id && $scope.MonitorTemplate.id != '') {
                $scope.MonitorTemplate.Items = miid;
                monitortemplateRes.save($scope.MonitorTemplate, function (data) {
                    utility.message("监测模版 " + data.MTName + "  保存成功!");
                    $state.go("MonitorTemplates");
                });
            } else {
                monitortemplateRes.query({ MTNo: $scope.MonitorTemplate.MTNo }, function (result) {
                    if (result && result.length > 0) {
                        utility.message("监测模版编号 " + $scope.MonitorTemplate.MINo + "  已存在!");
                    } else {
                        $scope.MonitorTemplate.Items = miid;
                        monitortemplateRes.save($scope.MonitorTemplate, function (data) {
                            utility.message("监测模版 " + data.MTName + "  保存成功!");
                            $state.go("MonitorTemplates");
                        });
                    }
                });
            }

        } else {
            utility.message("监测项目不能为空!");
        }
    }



    $scope.saveMonitorItem = function () {
        if ($scope.curItem.MINo && $scope.curItem.MINo != '') {
            var mi = $filter('filter')($scope.MonitorTemplate.Items, { MINo: $scope.curItem.MINo }, true)[0]
            if (!angular.isDefined(mi)) {
                $scope.MonitorTemplate.Items.push($scope.curItem);
                $scope.curItem = {};
            } else {
                utility.message("监测项目 " + $scope.curItem.MIName + "已存在!");
            }
        }
    }

    $scope.selectMonitorItem = function (item) {
        if (item) {
            $scope.curItem = item;
        }
    };

    $scope.deleteMonitorItem = function (item, $event) {
        if (item) {
            $scope.MonitorTemplate.Items.splice($scope.MonitorTemplate.Items.indexOf(item), 1);
        }
        $event.stopPropagation();
    }
}]);