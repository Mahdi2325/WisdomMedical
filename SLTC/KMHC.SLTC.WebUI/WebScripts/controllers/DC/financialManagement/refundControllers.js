/*
创建人: 吴晓波
创建日期:2017-05-08
说明: 订单服务项目收费
*/
angular.module("sltcApp").controller('RefundCtrl', ['$scope', 'resourceFactory', 'utility', function ($scope, resourceFactory, utility) {
    var refundRes = resourceFactory.getResource("refund");
    var SaveRefundRes = resourceFactory.getResource("SaveRefund");
    var refundRecRes = resourceFactory.getResource("refundRec");

    $scope.Data = {};
    $scope.EmpList = {};
    $scope.ResidentID = -1;
    $scope.UserEmp = $scope.$root.user;

    //列表全选Flag
    $scope.CheckBoxShowFlag = true;
    $scope.currentItem = [];


    //已选退费订单服务项目
    $scope.SelNumber = 0;

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: refundRecRes,//异步请求的res
        params: { residentID: $scope.ResidentID, serviceType: 2 },
        success: function (data) {//请求成功时执行函数
            $scope.Data.ServiceOrderRefundRec = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }
    //初始化
    $scope.init = function () {
        //退费金额
        $scope.currentItem.RefundAmt = 0;
        $scope.currentItem.Payer = $scope.PersonName;
        $scope.currentItem.PaymentType = 1;
        $scope.currentItem.RefundReason = "";
        $scope.GetServiceOrders();
    };

    //选中住民
    $scope.residentSelected = function (resident) {
        $scope.currentItem.RefundAmt = 0;
        $scope.currentItem.PaymentType = 1;
        $scope.currentItem.RefundReason = "";
        $scope.currentItem.Payer = resident.PersonName;
        $scope.currentResident = resident;
        $scope.ResidentID = resident.ResidentID;
        $scope.PersonName = resident.PersonName;
        $scope.GetServiceOrders();

        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.pageInfo.PageSize = 10;
        $scope.options.params.residentID = $scope.ResidentID;
        $scope.options.params.serviceType = 2;
        $scope.options.search();
    };

    $scope.currentType = $('#case-tab li.active').attr('data-type');
    //切换Tab页
    $('#case-tab li').click(function () {
        var _this = $(this), type = _this.attr('data-type');
        $scope.currentType = _this.attr('data-type');
        _this.addClass('active').siblings().removeClass('active');

        if (type == "RefundTab") {
            $scope.GetServiceOrders();
        } else {
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.pageInfo.PageSize = 10;
            $scope.options.params.residentID = $scope.ResidentID;
            $scope.options.params.serviceType = 2;
            $scope.options.search();
        }
    }).css('cursor', 'pointer');

    //获取未缴费订单
    $scope.GetServiceOrders = function () {
        refundRes.get({ residentID: $scope.ResidentID, serviceType: 2 }, function (data) {
            $scope.Data.ServiceOrders = data.Data;
            if ($scope.Data.ServiceOrders.length == 0) {
                $scope.CheckBoxShowFlag = false;
                $scope.select_all = false;
                if ($scope.ResidentID != -1) {
                    utility.message("会员：" + $scope.PersonName + "，没有已缴费订单！");
                };
            } else {
                $scope.CheckBoxShowFlag = true;
                $scope.select_all = false;
                angular.forEach($scope.Data.ServiceOrders, function (i) {
                    i.checked = false;
                });
            };
        });
    };

    //全选未发送医嘱
    $scope.selectAll = function () {
        $scope.SelNumber = 0;
        $scope.currentItem.RefundAmt = 0;
        if ($scope.select_all) {
            angular.forEach($scope.Data.ServiceOrders, function (i) {
                i.checked = false;
            });
            $scope.select_all = false;
        } else {
            angular.forEach($scope.Data.ServiceOrders, function (i) {
                i.checked = true;
                $scope.SelNumber++;
                $scope.currentItem.RefundAmt = $scope.currentItem.RefundAmt + i.SumPrice;
            });
            $scope.select_all = true;
        };
    };

    //单选未发送医嘱
    $scope.selectOne = function () {
        $scope.SelNumber = 0;
        $scope.currentItem.RefundAmt = 0;
        var checkCount = 0;
        angular.forEach($scope.Data.ServiceOrders, function (i) {
            if (i.checked == false) {
                checkCount++;
            } else {
                $scope.SelNumber++;
                $scope.currentItem.RefundAmt = $scope.currentItem.RefundAmt + i.SumPrice;
            };
        });

        if (checkCount > 0) {
            $scope.select_all = false;
        } else {
            $scope.select_all = true;
        };
    };

    //退费
    $scope.saveCharge = function () {
        if ($scope.ResidentID == -1) {
            utility.message("请选择会员！");
            return;
        };

        if ($scope.currentItem.Payer == "" || $scope.currentItem.Payer == null || $scope.currentItem.Payer == undefined) {
            utility.msgwarning("收款人为必填项！");
            return;
        };

        if ($scope.currentItem.PaymentType == "" || $scope.currentItem.PaymentType == null || $scope.currentItem.PaymentType == undefined) {
            utility.msgwarning("收款方式为必填项！");
            return;
        };

        if ($scope.currentItem.RefundReason == "" || $scope.currentItem.RefundReason == null || $scope.currentItem.RefundReason == undefined) {
            utility.msgwarning("退费原因为必填项！");
            return;
        };


        $scope.SerOrdSerItModelList = {};
        $scope.SerOrdSerItModelList.RefundInfos = {};
        $scope.SerOrdSerItModelList.SerOrdSerItModelLists = [];

        angular.forEach($scope.Data.ServiceOrders, function (i) {
            if (i.checked == true) {
                $scope.SerOrdSerItModelList.SerOrdSerItModelLists.push(i);
            };
        });

        $scope.SerOrdSerItModelList.RefundInfos.ResidentID = $scope.ResidentID;
        $scope.SerOrdSerItModelList.RefundInfos.RefundAmt = $scope.currentItem.RefundAmt;
        $scope.SerOrdSerItModelList.RefundInfos.Payer = $scope.currentItem.Payer;
        $scope.SerOrdSerItModelList.RefundInfos.PaymentType = $scope.currentItem.PaymentType;
        $scope.SerOrdSerItModelList.RefundInfos.RefundReason = $scope.currentItem.RefundReason;

        SaveRefundRes.SaveRefundByRsId($scope.SerOrdSerItModelList, function (data) {
            if (data.ResultCode == -1) {
                utility.msgwarning(data.ResultMessage);
            }
            else {
                utility.message("退费成功！");
                $scope.init();
            };
        });
    };

    $scope.init();
}]);
