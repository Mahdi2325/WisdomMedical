/*
创建人: 吴晓波
创建日期:2017-05-08
说明: 订单服务项目收费
*/
angular.module("sltcApp").controller('PaymentCtrl', ['$scope', 'resourceFactory', 'utility', function ($scope, resourceFactory, utility) {
    var paymentRes = resourceFactory.getResource("payments");
    var paymentPreAmountRes = resourceFactory.getResource("paymentsPreAmount");
    var SavePaymentsRes = resourceFactory.getResource("SavePayments");
    var paymentsRecRes = resourceFactory.getResource("paymentsRec");

    $scope.Data = {};
    $scope.Data.PreAmount = [];
    $scope.EmpList = {};
    $scope.ResidentID = -1;
    $scope.UserEmp = $scope.$root.user;

    //列表全选Flag
    $scope.CheckBoxShowFlag = true;
    $scope.currentItem = [];

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: paymentsRecRes,//异步请求的res
        params: { residentID: $scope.ResidentID, serviceType: 2 },
        success: function (data) {//请求成功时执行函数
            $scope.Data.ServiceOrderRec = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }
    //初始化
    $scope.init = function () {
        //应收金额
        $scope.currentItem.ThisTtlAmt = 0;
        //预收款金额
        $scope.currentItem.PreAmount = 0;
        //实收金额
        $scope.currentItem.CurAmount = 0;
        $scope.currentItem.InvoiceNo = "";
        $scope.currentItem.Payer = $scope.PersonName;
        $scope.currentItem.PaymentType = 1;
        $scope.GetServiceOrders();
        $scope.GetPreAmountRes();
    };

    //选中住民
    $scope.residentSelected = function (resident) {
        $scope.currentItem.ThisTtlAmt = 0;
        $scope.currentItem.PreAmount = 0;
        $scope.currentItem.CurAmount = 0;
        $scope.currentItem.InvoiceNo = "";
        $scope.currentItem.Payer = resident.PersonName;
        $scope.currentItem.PaymentType = 1;
        $scope.currentResident = resident;
        $scope.ResidentID = resident.ResidentID;
        $scope.PersonName = resident.PersonName;
        $scope.GetServiceOrders();
        $scope.GetPreAmountRes();

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

        if (type == "ChargeTab") {
            $scope.GetPreAmountRes();
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
        paymentRes.get({ residentID: $scope.ResidentID, serviceType: 2 }, function (data) {
            $scope.currentItem.ThisTtlAmt = 0;
            $scope.Data.ServiceOrders = data.Data;
            if ($scope.Data.ServiceOrders.length == 0) {
                $scope.CheckBoxShowFlag = false;
                $scope.select_all = false;
                if ($scope.ResidentID != -1) {
                    utility.message("会员：" + $scope.PersonName + "，没有未缴费订单！");
                };
            } else {
                $scope.CheckBoxShowFlag = true;
                $scope.select_all = true;
                angular.forEach($scope.Data.ServiceOrders, function (i) {
                    i.checked = true;
                    $scope.currentItem.ThisTtlAmt = $scope.currentItem.ThisTtlAmt + i.SumPrice;
                });

                if ($scope.Data.PreAmount.Amount >= $scope.currentItem.ThisTtlAmt) {
                    $scope.currentItem.PreAmount = $scope.currentItem.ThisTtlAmt;
                    $scope.currentItem.CurAmount = 0;
                } else {
                    if ($scope.Data.PreAmount.Amount > 0) {
                        $scope.currentItem.PreAmount = $scope.Data.PreAmount.Amount;
                        $scope.currentItem.CurAmount = $scope.currentItem.ThisTtlAmt - $scope.currentItem.PreAmount;
                    } else {
                        $scope.currentItem.CurAmount = $scope.currentItem.ThisTtlAmt;
                        $scope.currentItem.PreAmount = 0;
                    };
                };
            };
        });
    };

    //获取会员预收款余额
    $scope.GetPreAmountRes = function () {
        paymentPreAmountRes.get({ residentID: $scope.ResidentID }, function (data) {
            if (data.Data) {
                $scope.Data.PreAmount = data.Data;
                if ($scope.Data.PreAmount.Amount >= $scope.currentItem.ThisTtlAmt) {
                    $scope.currentItem.PreAmount = $scope.currentItem.ThisTtlAmt;
                    $scope.currentItem.CurAmount = 0;
                } else {
                    if ($scope.Data.PreAmount.Amount > 0) {
                        $scope.currentItem.PreAmount = $scope.Data.PreAmount.Amount;
                        $scope.currentItem.CurAmount = $scope.currentItem.ThisTtlAmt - $scope.currentItem.PreAmount;
                    } else {
                        $scope.currentItem.CurAmount = $scope.currentItem.ThisTtlAmt;
                        $scope.currentItem.PreAmount = 0;
                    };
                };
            } else {
                $scope.Data.PreAmount.Amount = 0;
            };
        });
    };

    //全选未发送医嘱
    $scope.selectAll = function () {
        $scope.currentItem.ThisTtlAmt = 0;
        if ($scope.select_all) {
            angular.forEach($scope.Data.ServiceOrders, function (i) {
                i.checked = false;
            });
            $scope.select_all = false;
        } else {
            angular.forEach($scope.Data.ServiceOrders, function (i) {
                i.checked = true;
                $scope.currentItem.ThisTtlAmt = $scope.currentItem.ThisTtlAmt + i.SumPrice;

            });
            $scope.select_all = true;
        };

        if ($scope.Data.PreAmount.Amount >= $scope.currentItem.ThisTtlAmt) {
            $scope.currentItem.PreAmount = $scope.currentItem.ThisTtlAmt;
            $scope.currentItem.CurAmount = 0;
        } else {
            if ($scope.Data.PreAmount.Amount > 0) {
                $scope.currentItem.PreAmount = $scope.Data.PreAmount.Amount;
                $scope.currentItem.CurAmount = $scope.currentItem.ThisTtlAmt - $scope.currentItem.PreAmount;
            } else {
                $scope.currentItem.CurAmount = $scope.currentItem.ThisTtlAmt;
                $scope.currentItem.PreAmount = 0;
            };
        };
    };

    //单选未发送医嘱
    $scope.selectOne = function () {
        var checkCount = 0;
        $scope.currentItem.ThisTtlAmt = 0;
        angular.forEach($scope.Data.ServiceOrders, function (i) {
            if (i.checked == false) {
                checkCount++;
            } else {
                $scope.currentItem.ThisTtlAmt = $scope.currentItem.ThisTtlAmt + i.SumPrice;
            };
        });

        if (checkCount > 0) {
            $scope.select_all = false;
        } else {
            $scope.select_all = true;
        };

        if ($scope.Data.PreAmount.Amount >= $scope.currentItem.ThisTtlAmt) {
            $scope.currentItem.PreAmount = $scope.currentItem.ThisTtlAmt;
            $scope.currentItem.CurAmount = 0;
        } else {
            if ($scope.Data.PreAmount.Amount > 0) {
                $scope.currentItem.PreAmount = $scope.Data.PreAmount.Amount;
                $scope.currentItem.CurAmount = $scope.currentItem.ThisTtlAmt - $scope.currentItem.PreAmount;
            } else {
                $scope.currentItem.CurAmount = $scope.currentItem.ThisTtlAmt;
                $scope.currentItem.PreAmount = 0;
            };
        };
    };

    //检查实收金额
    $scope.checkCurAmount = function () {
        if ($scope.currentItem.CurAmount === "" || $scope.currentItem.CurAmount == null || !angular.isDefined($scope.currentItem.CurAmount)) {
            utility.msgwarning("实收金额为必填项！");
            return;
        };

        if (isNumber($scope.currentItem.CurAmount)) {
            if ($scope.currentItem.CurAmount < 0) {

                utility.msgwarning("实收金额不能小于零！");
                return;
            } else {
                if (isNumber($scope.currentItem.PreAmount)) {
                    if ($scope.currentItem.CurAmount + $scope.currentItem.PreAmount != $scope.currentItem.ThisTtlAmt) {
                        if ($scope.ResidentID != -1) {
                            utility.msgwarning("实收金额+预收款金额不等于应收金额！");
                            return;
                        };
                    };
                };
            };
        } else {
            utility.msgwarning("实收金额格式不正确！");
            return;
        };
    };

    //检查预收款金额
    $scope.checkPreAmount = function () {
        if ($scope.currentItem.PreAmount === "" || $scope.currentItem.PreAmount == null || !angular.isDefined($scope.currentItem.PreAmount)) {
            utility.msgwarning("预收款金额为必填项！");
            return;
        };

        if (isNumber($scope.currentItem.PreAmount)) {
            if ($scope.currentItem.PreAmount < 0) {

                utility.msgwarning("预收款金额不能小于零！");
                return;
            } else {
                if (isNumber($scope.Data.PreAmount.Amount)) {
                    if ($scope.currentItem.PreAmount > $scope.Data.PreAmount.Amount) {
                        if ($scope.ResidentID != -1) {
                            utility.msgwarning("预收款余额不足！");
                            return;
                        };
                    } else {
                        if ($scope.currentItem.CurAmount + $scope.currentItem.PreAmount != $scope.currentItem.ThisTtlAmt) {
                            if ($scope.ResidentID != -1) {
                                utility.msgwarning("实收金额+预收款金额不等于应收金额！");
                                return;
                            };
                        };
                    };
                };
            };
        } else {
            utility.msgwarning("预收款金额格式不正确！");
            return;
        };
    };

    //缴费
    $scope.saveCharge = function () {
        if ($scope.ResidentID == -1) {
            utility.message("请选择会员！");
            return;
        };

        if ($scope.currentItem.Payer == "" || $scope.currentItem.Payer == null || $scope.currentItem.Payer == undefined) {
            utility.msgwarning("缴费人为必填项！");
            return;
        };

        if ($scope.currentItem.PaymentType == "" || $scope.currentItem.PaymentType == null || $scope.currentItem.PaymentType == undefined) {
            utility.msgwarning("缴费方式为必填项！");
            return;
        };

        if ($scope.currentItem.CurAmount === "" || $scope.currentItem.CurAmount == null || !angular.isDefined($scope.currentItem.CurAmount)) {
            utility.msgwarning("实收金额为必填项！");
            return;
        };

        if ($scope.currentItem.PreAmount === "" || $scope.currentItem.PreAmount == null || !angular.isDefined($scope.currentItem.PreAmount)) {
            utility.msgwarning("预收款金额为必填项！");
            return;
        };

        if (isNumber($scope.currentItem.CurAmount)) {
            if ($scope.currentItem.CurAmount < 0) {
                utility.msgwarning("实收金额不能小于零！");
                return;
            } else {
                if (isNumber($scope.currentItem.PreAmount)) {
                    if ($scope.currentItem.CurAmount + $scope.currentItem.PreAmount != $scope.currentItem.ThisTtlAmt) {
                        utility.msgwarning("实收金额+预收款金额不等于应收金额！");
                        return;
                    };
                };
            };
        } else {
            utility.msgwarning("实收金额格式不正确！");
            return;
        };

        if (isNumber($scope.currentItem.PreAmount)) {
            if ($scope.currentItem.PreAmount < 0) {
                utility.msgwarning("预收款金额不能小于零！");
                return;
            } else {
                if (isNumber($scope.Data.PreAmount.Amount)) {
                    if ($scope.currentItem.PreAmount > $scope.Data.PreAmount.Amount) {
                        utility.msgwarning("预收款余额不足！");
                        return;
                    } else {
                        if ($scope.currentItem.CurAmount + $scope.currentItem.PreAmount != $scope.currentItem.ThisTtlAmt) {
                            utility.msgwarning("实收金额+预收款金额不等于应收金额！");
                            return;
                        };
                    };
                };
            };
        } else {
            utility.msgwarning("预收款金额格式不正确！");
            return;
        };

        $scope.SerOrdSerItModelList = {};
        $scope.SerOrdSerItModelList.PaymentInfos = {};
        $scope.SerOrdSerItModelList.SerOrdSerItModelLists = [];
        $scope.SerOrdSerItModelList.PaymentsServiceOrderModelLists = [];
        $scope.PaymentsServiceOrderModelLists = [];
        $scope.PaymentsServiceOrderModelLists.ServiceOrderID = "";
        $scope.PaymentsServiceOrderModelLists.SumPrice = 0;


        angular.forEach($scope.Data.ServiceOrders, function (i) {
            if (i.checked == true) {
                $scope.SerOrdSerItModelList.SerOrdSerItModelLists.push(i);
            };
        });

        $scope.SerOrdSerItModelList.PaymentInfos.ResidentID = $scope.ResidentID;
        $scope.SerOrdSerItModelList.PaymentInfos.ThisTtlAmt = $scope.currentItem.ThisTtlAmt;
        $scope.SerOrdSerItModelList.PaymentInfos.Payer = $scope.currentItem.Payer;
        $scope.SerOrdSerItModelList.PaymentInfos.PaymentType = $scope.currentItem.PaymentType;
        $scope.SerOrdSerItModelList.PaymentInfos.InvoiceNo = $scope.currentItem.InvoiceNo;
        $scope.SerOrdSerItModelList.PaymentInfos.CurAmount = $scope.currentItem.CurAmount;
        $scope.SerOrdSerItModelList.PaymentInfos.PreAmount = $scope.currentItem.PreAmount;

        SavePaymentsRes.SavePaymentByRsId($scope.SerOrdSerItModelList, function (data) {
            if (data.ResultCode == -1) {
                utility.msgwarning(data.ResultMessage);
            }
            else {
                utility.message("收费成功！");
                $scope.init();
            };
        });
    };

    $scope.init();
}]);
