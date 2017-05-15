/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("FamilyListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams,$location, utility, resourceFactory) {

    var familyRes = resourceFactory.getResource('familyRes');

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: familyRes,//异步请求的res
        params: { 'Data.PersonID': $stateParams.id },
        success: function (data) {//请求成功时执行函数
            $scope.Familys = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.FamilyEdit = function (id) {
        $("#SelFamilyID").val(id);
        $('#modalEditFamily').modal('show');
    }

    $('#modalEditFamily').on('hide.bs.modal',
        function () {
        $scope.options.search();
    });

    $scope.FamilyDelete = function (Item) {
        utility.confirm("您确定删除该家属信息吗?", function (result) {
            if (result) {
                familyRes.delete({ id: Item.ID }, function (data) {
                    $scope.options.search();
                });
            }
        });
    }

}])
.controller("FamilyEditCtrl", ['$scope', '$state', '$stateParams', 'webUploader', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, webUploader,utility, resourceFactory) {
    var personRes = resourceFactory.getResource('persons');
    var familyRes = resourceFactory.getResource('familyRes');
    var empRes = resourceFactory.getResource("employees");


    $scope.InitFamilyData = function () {
        $scope.curFamily = {};
        empRes.get({ "PageSize": 0 }, function (data) {
            $scope.EmpList = data.Data;
        });

        if ($("#SelFamilyID").val() != "") {
            $scope.isAdd = false;
            familyRes.get({ "id": $("#SelFamilyID").val() }, function (data) {
                $scope.curFamily = data.Data;
                $scope.GetPersonInfo();
            });

        } else {
            $scope.isAdd = true;
            $scope.GetPersonInfo();
        }

    }

    $scope.GetPersonInfo = function () {
        personRes.get({ id: $stateParams.id }).$promise.then(function (data) {
            $scope.curFamily.PersonID = data.Data.PersonID;
            $scope.curFamily.PersonName = data.Data.Name;
        });
    }

    $scope.saveEdit = function () {

        if ($scope.curFamily.IsEmerg =="1") {
            $scope.curFamily.IsEmerg = true;
        } else if ($scope.curFamily.IsEmerg == "0") {
            $scope.curFamily.IsEmerg = false;
        }
        if ($scope.curFamily.HasKey == "1") {
            $scope.curFamily.HasKey = true;
        } else if ($scope.curFamily.HasKey == "0") {
            $scope.curFamily.HasKey = false;
        }
        familyRes.save($scope.curFamily, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("家属信息保存成功");
                $('#modalEditFamily').modal('hide');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $('#modalEditFamily').on('show.bs.modal',
        function () {
        $scope.InitFamilyData();
    });

}]);
