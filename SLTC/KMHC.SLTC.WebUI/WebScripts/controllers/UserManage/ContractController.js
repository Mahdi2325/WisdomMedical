/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("ContractListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams,$location, utility, resourceFactory) {

    var contractRes = resourceFactory.getResource('contractRes');
    $scope.isCanDo =$scope.user.IsGroupAdmin;
    $scope.Data = {
        Users: []
    };

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: contractRes,//异步请求的res
        params: { 'Data.PersonID': $stateParams.id, 'Data.ContractNo': "" },
        success: function (data) {//请求成功时执行函数
            $scope.Contracts = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.ContractEdit = function (id) {
        $("#SelContractID").val(id);
        $('#modalEditContract').modal('show');
    }

    $('#modalEditContract').on('hide.bs.modal',
        function () {
        $scope.options.search();
    });

    $scope.ContractDelete = function (Item) {
        utility.confirm("您确定删除该合同吗?", function (result) {
            if (result) {
                contractRes.delete({ id: Item.ID }, function (data) {
                    $scope.options.search();
                });
            }
        });
    }

}])
.controller("ContractEditCtrl", ['$scope', '$state', '$stateParams', 'webUploader', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, webUploader,utility, resourceFactory) {
    var personRes = resourceFactory.getResource('persons');
    var contractRes = resourceFactory.getResource('contractRes');
    var empRes = resourceFactory.getResource("employees");


    $scope.InitContractData = function () {
        $scope.curContract = {};
        empRes.get({ "PageSize": 0 }, function (data) {
            $scope.EmpList = data.Data;
        });

        if ($("#SelContractID").val() != "") {
            $scope.isAdd = false;
            contractRes.get({ "id": $("#SelContractID").val() }, function (data) {
                $scope.curContract = data.Data;
                $scope.GetPersonInfo();
            });

        } else {
            $scope.isAdd = true;
            var codeRuleRes = resourceFactory.getResource("codeRules");
            codeRuleRes.get({
                "CodeKey": "ContractCode",
                "GenerateRule": "YearMonthDay",
                "Prefix": "C",
                "SerialNumberLength": 6,
                "OrganizationID": $scope.$root.user.OrgId
            }, function (data) {
                $scope.curContract.ContractNo = data.Data;
            });
            $scope.GetPersonInfo();
        }

    }

    $scope.GetPersonInfo = function () {
        personRes.get({ id: $stateParams.id }).$promise.then(function (data) {
            $scope.curContract.PersonID = data.Data.PersonID;
            $scope.curContract.PersonName = data.Data.Name;
        });
    }

    $scope.saveEdit = function () {
        contractRes.save($scope.curContract, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("合同保存成功");
                $('#modalEditContract').modal('hide');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $('#modalEditContract').on('show.bs.modal',
        function () {
        $scope.InitContractData();
    });
    
    webUploader.init('#FilePathPicker', { category: 'ContractFile' }, '合同文件', 'doc,docx', 'doc/*', function (data) {
        if (data.length > 0) {
            $scope.curContract.ContractFile = data[0].SavedLocation;
            $scope.$apply();
        }
    });

}]);
