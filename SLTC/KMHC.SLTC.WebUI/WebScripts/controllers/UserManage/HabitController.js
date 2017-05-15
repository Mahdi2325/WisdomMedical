/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("HabitListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams,$location, utility, resourceFactory) {

    var habitRes = resourceFactory.getResource('habitRes');

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: habitRes,//异步请求的res
        params: { 'Data.PersonID': $stateParams.id },
        success: function (data) {//请求成功时执行函数
            $scope.Habits = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.HabitEdit = function (id) {
        $("#SelHabitID").val(id);
        $('#modalEditHabit').modal('show');
    }

    $('#modalEditHabit').on('hide.bs.modal',
        function () {
        $scope.options.search();
    });

    $scope.HabitDelete = function (Item) {
        utility.confirm("您确定删除该习惯吗?", function (result) {
            if (result) {
                habitRes.delete({ id: Item.ID }, function (data) {
                    $scope.options.search();
                });
            }
        });
    }

}])
.controller("HabitEditCtrl", ['$scope', '$state', '$stateParams', 'webUploader', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, webUploader, utility, resourceFactory) {
    var habitRes = resourceFactory.getResource('habitRes');

    $scope.InitHabitData = function () {
        $scope.curHabit = {};
        $scope.curHabit.PersonID = $stateParams.id;

        if ($("#SelHabitID").val() != "") {
            $scope.isAdd = false;
            habitRes.get({ "id": $("#SelHabitID").val() }, function (data) {
                $scope.curHabit = data.Data;
            });

        } else {

            $scope.isAdd = true;
        }

    }

    $scope.saveEdit = function () {
        habitRes.save($scope.curHabit, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("保存成功");
                $('#modalEditHabit').modal('hide');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $('#modalEditHabit').on('show.bs.modal',
        function () {
            $scope.InitHabitData();
    });

}]);
