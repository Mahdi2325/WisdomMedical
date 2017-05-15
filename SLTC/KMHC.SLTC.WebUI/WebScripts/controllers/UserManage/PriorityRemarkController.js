/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("PriorityRemarkListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams,$location, utility, resourceFactory) {

    var priorityRemarkRes = resourceFactory.getResource('priorityRemarkRes');

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: priorityRemarkRes,//异步请求的res
        params: { 'Data.PersonID': $stateParams.id },
        success: function (data) {//请求成功时执行函数
            $scope.PriorityRemarks = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.PriorityRemarkEdit = function (id) {
        $("#SelPriorityRemarkID").val(id);
        $('#modalEditPriorityRemark').modal('show');
    }

    $('#modalEditPriorityRemark').on('hide.bs.modal',
        function () {
        $scope.options.search();
    });

    $scope.PriorityRemarkDelete = function (Item) {
        utility.confirm("您确定删除该备注吗?", function (result) {
            if (result) {
                priorityRemarkRes.delete({ id: Item.ID }, function (data) {
                    $scope.options.search();
                });
            }
        });
    }

}])
.controller("PriorityRemarkEditCtrl", ['$scope', '$state', '$stateParams', 'webUploader', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, webUploader, utility, resourceFactory) {
    var priorityRemarkRes = resourceFactory.getResource('priorityRemarkRes');

    $scope.InitPriorityRemarkData = function () {
        $scope.curPriorityRemark = {};
        $scope.curPriorityRemark.PersonID = $stateParams.id;

        if ($("#SelPriorityRemarkID").val() != "") {
            $scope.isAdd = false;
            priorityRemarkRes.get({ "id": $("#SelPriorityRemarkID").val() }, function (data) {
                $scope.curPriorityRemark = data.Data;
            });

        } 

    }

    $scope.saveEdit = function () {
        priorityRemarkRes.save($scope.curPriorityRemark, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("保存成功");
                $('#modalEditPriorityRemark').modal('hide');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $('#modalEditPriorityRemark').on('show.bs.modal',
        function () {
            $scope.InitPriorityRemarkData();
    });

}]);
