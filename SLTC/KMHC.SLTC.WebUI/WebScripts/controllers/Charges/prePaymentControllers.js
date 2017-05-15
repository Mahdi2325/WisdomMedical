///创建人:jacklai
///创建日期:2016-05-20
///说明:预收款管理
angular.module("sltcApp")
.controller("prePaymentListCtrl", ['$scope', '$stateParams', 'utility', 'resourceFactory', function ($scope, $stateParams,utility, resourceFactory) {

    var BillPayRes = resourceFactory.getResource("BillPayRes");


    $scope.Data = {};
    $scope.ResidentID = $stateParams.residentId;
    // 當前住民
    $scope.currentResident = {}
    $scope.Data.PrePayments = [];

    $scope.init = function () {
        $scope.options = {
            buttons: [], //需要打印按钮时设置
            ajaxObject: BillPayRes, //异步请求的res
            params: { 'Data.PayType': "Pay", "Data.ResidentID": $scope.ResidentID },
            success: function (data) { //请求成功时执行函数               
                $scope.Data.PrePayments = data.Data;
            },
            pageInfo: {
                //分页信息
                CurrentPage: 1,
                PageSize: 10
            }
        };
    };
    $('#modalEditPrePayment').on('hide.bs.modal',
    function () {
        $scope.options.search();
    });

    $scope.init();
}]).controller("prePaymentEditCtrl", ['$scope', '$stateParams', 'utility', 'resourceFactory', function ($scope,$stateParams, utility, resourceFactory) {

    var BillPayRes = resourceFactory.getResource("BillPayRes");
    var prePaymentRes = resourceFactory.getResource("prePaymentRes");

    //保存预存款信息 
    $scope.createItem = function (item) {

        utility.confirm("保存后无法删除和修改，确认信息无误吗?", function (result) {
            if (result) {
                var newitem = { ResidentID: $scope.ResidentID, Amount: item.newAmount, DepositDate: item.DepositDate, Payee: item.Payee, InvoiceNo: item.InvoiceNo, PayMethod: item.PayMethod, Remark: item.Remark };
                prePaymentRes.save(newitem, function (data) {
                    if (!data.IsSuccess) {
                        utility.message(data.ResultMessage);
                    } else {
                        utility.message("预收款信息保存成功！");
                        $('#modalEditPrePayment').modal('hide');
                    }
                });
            }
        });
    };

    $('#modalEditPrePayment').on('show.bs.modal',
    function () {
        $scope.ResidentID = $stateParams.residentId;
        $scope.Data = {};
        $scope.currentItem = { nowAmount: 0, TotalConSpeMonth: 0, DepositDate: new Date().format("yyyy-MM-dd hh:mm:ss") };
        // 當前住民
        $scope.currentResident = {}
        $scope.disabled = true;
        $scope.Data.PrePayments = [];

        //获取当前余额
        prePaymentRes.get({ id: $scope.ResidentID }, function (data1) {
            var data = data1.Data;
            if (data != null) {
                $scope.currentItem.nowAmount = data.Amount;
                $scope.currentItem.ResidentNo = $scope.ResidentID;
                $scope.currentItem.id = data.DepositID;
                $scope.currentItem.TotalConSpeMonth = data.TotalConSpeMonth;
            }
        });
    });
}]);