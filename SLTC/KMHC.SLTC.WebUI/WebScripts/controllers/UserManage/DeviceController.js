/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("DeviceListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams,$location, utility, resourceFactory) {

    var deviceRes = resourceFactory.getResource('deviceRes');

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: deviceRes,//异步请求的res
        params: { 'Data.PersonID': $stateParams.id },
        success: function (data) {//请求成功时执行函数
            $scope.Devices = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.DeviceEdit = function (id) {
        $("#SelDeviceID").val(id);
        $('#modalEditDevice').modal('show');
    }

    $('#modalEditDevice').on('hide.bs.modal',
        function () {
        $scope.options.search();
    });

    $scope.DeviceDelete = function (Item) {
        utility.confirm("您确定删除该设备吗?", function (result) {
            if (result) {
                deviceRes.delete({ id: Item.ID }, function (data) {
                    $scope.options.search();
                });
            }
        });
    }

}])
.controller("DeviceEditCtrl", ['$scope', '$state', '$stateParams', 'webUploader', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, webUploader, utility, resourceFactory) {
    var deviceRes = resourceFactory.getResource('deviceRes');

    $scope.InitDeviceData = function () {
        $scope.curDevice = {};
        $scope.curDevice.PersonID = $stateParams.id;

        if ($("#SelDeviceID").val() != "") {
            $scope.isAdd = false;
            deviceRes.get({ "id": $("#SelDeviceID").val() }, function (data) {
                $scope.curDevice = data.Data;
            });

        } else {
            $scope.isAdd = true;
        }

    }

    $scope.saveEdit = function () {
        deviceRes.save($scope.curDevice, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("设备保存成功");
                $('#modalEditDevice').modal('hide');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $('#modalEditDevice').on('show.bs.modal',
        function () {
            $scope.InitDeviceData();
    });

}]);
