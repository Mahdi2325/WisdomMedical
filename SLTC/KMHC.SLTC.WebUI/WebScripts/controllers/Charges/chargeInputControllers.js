///创建人:jacklai
///创建日期:2016-05-17
///说明:费用录入
angular.module("sltcApp")
.filter('customCurrency', ["$filter", function ($filter) {       
    return function(amount, currencySymbol){
        var currency = $filter('currency');         

        if(amount < 0){
            return currency(amount, currencySymbol).replace("(", "-").replace(")", ""); 
        }

        return currency(amount, currencySymbol);
    };
}])
.controller("chargeInputCtrl", ['$scope', '$filter', '$stateParams', 'resourceFactory', 'utility', function ($scope, $filter, $stateParams, resourceFactory, utility) {
    var chargeDetailRes = resourceFactory.getResource("chargeDetailRes");

    $scope.ResidentID = $stateParams.residentId;

    $scope.init = function () {
        $scope.options = {
            buttons: [], //需要打印按钮时设置
            ajaxObject: chargeDetailRes, //异步请求的res
            params: { 'Data.ResidentID': $scope.ResidentID },
            success: function (data) { //请求成功时执行函数               
                $scope.charges = data.Data;
            },
            pageInfo: {
                //分页信息
                CurrentPage: 1,
                PageSize: 10
            }
        };
    };
    $scope.init();
}]);