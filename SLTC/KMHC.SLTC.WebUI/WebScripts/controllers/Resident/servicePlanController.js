/*
        创建人: 李林玉
        创建日期:2016-06-23
        说明: 选择服务套餐
*/


angular.module("sltcApp")
.controller("residentServicePlanCtrl", ['$scope', '$filter', '$stateParams', 'utility', 'resourceFactory', function ($scope, $filter, $stateParams,utility, resourceFactory) {

    var residentServicePlanRes = resourceFactory.getResource("residentServicePlanRes");
    var serviceGroupRes = resourceFactory.getResource("serviceGroupRes");
    var personRes = resourceFactory.getResource("personRes");


    $scope.buttonShow = false;
    $scope.currentItem = { ResidentOrg: null };

    $scope.ServiceGroups = [];
    $scope.currentSelect = {};
    $scope.cacheServiceGroup = {};

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: residentServicePlanRes,//异步请求的res
        initSearch: false,
        params: { 'ResidentID': $stateParams.residentId },
        success: function (data) {//请求成功时执行函数
            $scope.ServicePlans = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.$on('chooseServiceGroup', function (e, data) {
        if (data && $scope.options.params['ResidentID']) {

            residentServicePlanRes.save({ ResidentID: $scope.options.params['ResidentID'], ServiceGroupID: data.ServiceGroupID }, function (data) {
                if (data.IsSuccess) {
                    $scope.options.search();
                    utility.message("设置服务套餐成功！");
                    $scope.$emit('RefreshInfo');
                } else {
                    utility.message(data.ResultMessage);
                }
            });
        }
    });


}]);


function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}