angular.module("sltcApp")
 .controller("payBillsCtrl", ['$scope', '$stateParams', 'billRes', 'BillPayRes', 'chargeDetailRes', 'utility', function ($scope, $stateParams, billRes, BillPayRes, chargeDetailRes, utility) {

     $scope.Data = {};
     $scope.Pay = {};
     $scope.Data.curBill = {};//账单
     $scope.Data.curPayment = {};//缴费信息
     // 當前住民
     $scope.curResident = {}
     $scope.txtResidentIDChange = function (resident) {
         $scope.curResident = resident;//獲取當前住民信息
         $scope.initBill($scope.curResident.ResidentNo);//加載當前住民的账单記錄
     }

     $scope.initBill = function (ResidentNo) {
         $scope.BillKey = {};
         billRes.query(function (data1) {
             $scope.item = [];
             angular.forEach(data1, function (data, index, array) {
                 if (data.ResidentNo == $scope.curResident.ResidentNo) {
                     $scope.item.push(data);
                 }
             });
             $scope.Data.bills = $scope.item;
         });
     }

     $scope.searchPay = function (bill) {
         $scope.Pay = {};
         if (bill.BillNo) {
             BillPayRes.query(function (data1) {
                 $scope.item = [];
                 angular.forEach(data1, function (data, index, array) {
                     //PayType 1是预存，2是账单
                     if (data.BillNo == bill.BillNo && data.PayType == 2) {
                         $scope.item.push(data);
                     }
                 });
                 $scope.Pay.billPayHis = $scope.item;
             });
         }
     }

     //生产账单
     $scope.GenerateBill = function () {
         utility.message("暂不提供生成账单");
         //billRes.get();
     }

     $scope.needPayDetailClick = function (bill) {
         $scope.Data.curBill = bill;
         $scope.Data.curPayment.TotalNeedAmount = bill.TotalNeedAmount;
         utility.message("请求执行缴费操作");
     };

     $scope.submitPay = function () {
         //账单记录
         $scope.Data.curBill.ResidentNo = $scope.curResident.ResidentNo;
         $scope.Data.curBill.TotalPayAmount = $scope.Data.curBill.TotalPayAmount + $scope.Data.curPayment.Amount;

         //缴费记录
         $scope.Data.curPayment.ResidentNo = $scope.curResident.ResidentNo;
         $scope.Data.curPayment.BillNo = $scope.Data.curBill.BillNo;
         $scope.Data.curPayment.PayType = 2;
         BillPayRes.save($scope.Data.curPayment, function () {//缴费记录
             billRes.save($scope.Data.curBill, function () {//账单记录
                 utility.message($scope.curResident.PersonName + "的缴费信息保存成功！");
                 $scope.Data.curBill = {};
                 $scope.Data.curPayment = {};
             });

         });
     }

     $scope.$watch("Data.curBill.Amount", function (newValue) {
         if (newValue) {
             $scope.isshow = !(parseFloat(newValue) > parseFloat($scope.Data.curBill.Balance));
         }
     });

     //账单明细
     $scope.detailClick = function (bill) {
         if (bill) {
             chargeDetailRes.query(function (data) {
                 if (data.length > 0) {
                     $scope.Data.BillDetails = data;
                 } else {
                     $scope.Data.BillDetails = [];
                 }
             });
         }
     };
 }])
.controller("billListCtrl", ['$scope', '$stateParams', '$q', 'utility', 'resourceFactory', function ($scope, $stateParams, $q, utility, resourceFactory) {

    var billRes = resourceFactory.getResource("billRes");
    var chargeDetailRes = resourceFactory.getResource("chargeDetailRes");
    $scope.ResidentID = $stateParams.residentId;
    $scope.init = function () {
        $scope.options = {
            buttons: [], //需要打印按钮时设置
            ajaxObject: billRes, //异步请求的res
            params: { 'Data.ResidentID': $scope.ResidentID },
            success: function (data) { //请求成功时执行函数               
                $scope.Data.bills = data.Data;
                console.log(data.Data);
            },
            pageInfo: {
                //分页信息
                CurrentPage: 1,
                PageSize: 10
            }
        };

    };
    $scope.init();

    $scope.Data = {};
    // 當前住民
    $scope.curResident = {}
    //账单明细
    $scope.detailClick = function (bill) {
        if (bill) {
            var item = [];
            chargeDetailRes.get({ "Data.BillID": bill.BillID, "Data.ResidentID": $scope.ResidentID }, function (data1) {
                $scope.Data.BillDetails = data1.Data;
                console.log(data1.Data);
            });
        }
    };
    $scope.ZdDisabled = false;
    $scope.CreateZD = function () {
        $scope.ZdDisabled = true;
        //把费用中所有没生成订单的数据找出来
        //遍历统计总额
        //保存账单   
        //保存缴费记录
        //更新账号余额
        var bill = { ResidentID: $scope.ResidentID };
        resourceFactory.getResource("billRes").save(bill, function (data) {            
            if (!data.IsSuccess) {
                utility.message(data.ResultMessage);
            } else {
                utility.message("账单生成成功！");
                $('#modalDetail').modal('hide');
                $scope.options.search();
            }
            $scope.ZdDisabled = false;
        });
    }

}]);