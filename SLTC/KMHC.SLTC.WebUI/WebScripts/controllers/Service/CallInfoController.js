/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("CallInfoListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams,$location, utility, resourceFactory) {

    var callInfoRes = resourceFactory.getResource('callInfoRes');

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: callInfoRes,//异步请求的res
        params: { 'Data.PersonID': $stateParams.id },
        success: function (data) {//请求成功时执行函数
            $scope.CallInfos = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.CallInfoEdit = function (id) {
        $("#SelCallInfoID").val(id);
        $('#modalEditCallInfo').modal('show');
    }

    $('#modalEditCallInfo').on('hide.bs.modal',
        function () {
        $scope.options.search();
    });

    $scope.CallInfoDelete = function (Item) {
        utility.confirm("您确定删除该来电记录吗?", function (result) {
            if (result) {
                callInfoRes.delete({ id: Item.ID }, function (data) {
                    $scope.options.search();
                });
            }
        });
    }

}])
.controller("CallInfoEditCtrl", ['$scope', '$state', '$stateParams', 'webUploader', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, webUploader, utility, resourceFactory) {
    var callInfoRes = resourceFactory.getResource('callInfoRes');

    $scope.InitCallInfoData = function () {
        $scope.curCallInfo = {};
        $scope.curCallInfo.PersonID = $stateParams.id;
        $scope.curCallInfo.CallDate = new Date().format("yyyy-MM-dd hh:mm:ss");
        if ($("#SelCallInfoID").val() != "") {
            $scope.isAdd = false;
            callInfoRes.get({ "id": $("#SelCallInfoID").val() }, function (data) {
                $scope.curCallInfo = data.Data;
            });

        } 

    }

    $scope.saveEdit = function () {
        callInfoRes.save($scope.curCallInfo, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("来电信息保存成功");
                $('#modalEditCallInfo').modal('hide');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $('#modalEditCallInfo').on('show.bs.modal',
        function () {
            $scope.InitCallInfoData();
    });

}]);
