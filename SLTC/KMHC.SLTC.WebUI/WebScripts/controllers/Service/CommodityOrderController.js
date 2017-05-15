angular.module("sltcApp")
.controller("CommodityOrderListCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var commodityOrderRes = resourceFactory.getResource("serviceOrderRes");

    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: commodityOrderRes,//异步请求的res
        params: { },
        success: function (data) {//请求成功时执行函数
            $scope.commodityOrders = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }
    $scope.CommodityOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseCommodityOrder", serviceOrderID);
    }
    $scope.CancelOrder = function (serviceOrderID) {
        utility.confirm("确定要取消该订单吗?", function (result) {
            if (result) {
                commodityOrderRes.CancelOrder({ serviceOrderID: serviceOrderID }, function (data) {
                    $scope.options.search();
                    utility.message("订单已取消");
                });
                return false;
            }
        });
    };

    $scope.ConfirmOrder = function (serviceOrderID) {
        utility.confirm("确认此订单的客户已经取货?", function (result) {
            if (result) {
                commodityOrderRes.ConfirmOrder({ serviceOrderID: serviceOrderID }, function (data) {
                    $scope.options.search();
                    utility.message("订单已完成");
                });
                return false;
            }
        });
    };
}])
.controller("CommodityOrderEditCtrl", ['$scope', '$location', '$stateParams', '$filter', '$timeout', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, $filter, $timeout, utility, resourceFactory) {
    var serviceItemRes = resourceFactory.getResource("serviceItemRes");
    var commodityOrderRes = resourceFactory.getResource("serviceOrderRes");
    var residentRes = resourceFactory.getResource("residentRes");
    var personRes = resourceFactory.getResource("personRes");
    var prePaymentRes = resourceFactory.getResource("prePaymentRes");
    var taskRes = resourceFactory.getResource("taskRes");
    var employeeRes = resourceFactory.getResource("employeeRes");

    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: commodityOrderRes,//异步请求的res
        params: { 'Data.ResidentID': -1 },
        success: function (data) {//请求成功时执行函数
            $scope.commodityOrders = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.init = function () {
        $scope.CurrentMinDate = new Date().dateAdd('n', 15).getTime();
        $scope.order = {};
        $scope.order.ServiceItem = {};
        $scope.order.ServiceItem.ChargeItems = [];
        $scope.currentUserName = "";
        $scope.DeleteItem = [];
        $scope.ModifyOrCreateItem = [];
        $scope.curChgItemAdd = true;
        $scope.tempItem = { Quantity: 0, Price: 0 };
        $scope.prePostData = {};

        //var userName = userService.currentUser.UserInfo.then(function (user) {
        //    $scope.currentUserName = user.UserName;
        //});
        if ($stateParams.id) {
            $scope.isAdd = false;
            commodityOrderRes.get({ id: $stateParams.id }, function (data) {
                $scope.order = data.Data;
                $scope.isshow = !data.Data.IsDistribute;

                residentRes.get({ id: $scope.order.ResidentID }, function (data1) {
                    $scope.curResident = data1.Data;
                    $scope.order.PersonAddr = data1.Data.City + data1.Data.Address;
                    $timeout(function () {
                        $("#myAddress1").citypicker("refresh");
                    }, 1);
                    //$scope.order.ResidentNo = data1.Data.ResidentNo;

                });
                $scope.options.params['Data.ResidentID'] = $scope.order.ResidentID;
                $scope.options.search();
            });
        } else {
            $scope.isAdd = true;
            $scope.isshow = false;
            var codeRuleRes = resourceFactory.getResource("codeRules");

            codeRuleRes.get({
                "CodeKey": "ServiceOrderCode",
                "GenerateRule": "YearMonthDay",
                "Prefix": "SO",
                "SerialNumberLength": 4
            }, function (data) {
                $scope.order.SONo = data.Data;
            });

        }
    }

    $scope.selectItem = function (ServiceItemID) {
        for (var i = 0; i < $scope.serviceItemList.length; i++) {
            if ($scope.serviceItemList[i].ServiceItemID == ServiceItemID) {
                $scope.order.ServiceItemID = $scope.serviceItemList[i].ServiceItemID;
                $scope.order.SIName = $scope.serviceItemList[i].SIName;
                $scope.order.SIType = $scope.serviceItemList[i].SIType;
                $scope.order.SINo = $scope.serviceItemList[i].SINo;
                $scope.order.ServiceItem = $scope.serviceItemList[i];
                $scope.order.ServiceItem.ChargeItems=[];
                return;
            }
        }
    };

    serviceItemRes.get({ }, function (data) {
        $scope.serviceItemList = data.Data;
    });

    $scope.CommodityOrderEdit = function (item) {
        commodityOrderRes.get({id: item.ServiceOrderID }, function (data) {
            $scope.order = data.Data;
            $scope.order.PersonAddr = $scope.order.ServiceCity + $scope.order.ServiceAddress
            $timeout(function () {
                $("#myAddress1").citypicker("refresh");
            }, 1);
            $scope.isshow = !item.IsDistribute;
        });
    };

    $scope.txtResidentIDChange = function (resident) {
        $scope.curResident = resident;
        $scope.order = {
            SONo: $scope.order.SONo,
            Operator: $scope.currentUserName,
            ResidentID: resident.ResidentID,
            PersonAddr: resident.City + resident.Address,
            CurrentMinDate: new Date().dateAdd('n', 15).getTime(),
            ContactName: resident.PersonName,
            ContactPhone: resident.Phone,
            ServiceItem : {ChargeItems : []}
        };
        $scope.options.params['Data.ResidentID'] = resident.ResidentID;
        $scope.options.search();

        $timeout(function () {
            $("#myAddress1").citypicker("refresh");
        }, 1);

    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                commodityOrderRes.delete({ id: item.ServiceOrderID }, function (data) {
                    $scope.serviceOrders.splice($scope.serviceOrders.indexOf(item), 1);
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };

    $scope.cancelEdit = function () {
        $location.url("/angular/ServiceOrderList");
    };

    $scope.CreateTask = function (item) {
        item.IsDistribute = true;
        commodityOrderRes.save(item, function (newItem) {
            $scope.task = { TaskNo: Math.round(Math.random() * 1000000000), SONo: $scope.order.SONo, Status: 0 };
            taskRes.save($scope.task, function (newtask) {
                utility.message("任务生成成功");
                $location.url("/angular/ServiceOrderList");
            });

        });
    }
    //选择的服务项目
    $scope.$on("chooseChargeItem", function (event, data) {
        $scope.tempItem = data;
        $scope.curChgItemAdd = true;
        $('#modalChargeItem').modal('hide');
    });

    //选择的地址
    $scope.$on("chooseAddress", function (event, data) {
        $scope.order.PersonAddr = data;
        $scope.$apply();
    });

    $scope.equals = function (source, target) {
        var result = false;
        $.each(source, function (name, value) {
            if (target[name] != value) {
                result = false;
                return false;
            }
            else {
                result = true;
            }
        });
        return result;
    };

    //保存订单并生成任务
    $scope.saveEdit = function (item) {
        if (item.Price > $scope.curResident.RemainingMoney || $scope.curResident.RemainingMoney == 0) {
            utility.message("账户期初余额不足，请充值后完成操作");
            return;
        }
        //这个检验必须放到最后
        if (!$scope.equals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }
   
        var vals = $("#myAddress1").val();
        if (vals != "") {
            //var lastIndex = vals.lastIndexOf("-");
            //item.ServiceCity = vals.substring(0, lastIndex + 1);
            //item.ServiceAddress = vals.substring(lastIndex + 1, vals.length);
            var addArr = vals.split("-");
            var city = "";
            var address = "";
            var addChar = "";
            for (var i = 0; i < addArr.length; i++) {
                if (i < 3) {
                    city += addArr[i]+"-";
                } else {
                    address += addChar + addArr[i];
                    addChar = "-";
                }
            }
            item.ServiceCity = city;
            item.ServiceAddress = address;
        }
        commodityOrderRes.save(item, function (newItem) {
            if (newItem.IsSuccess) {
                $scope.$broadcast("refreshPrePaymentInfo", {});
                $scope.options.search();
                var oldData = {
                    Operator: $scope.order.Operator, ResidentID: $scope.order.ResidentID, PersonAddr: item.ServiceCity + item.ServiceAddress,
                    ServiceItemID: $scope.order.ServiceItemID, SIType: $scope.order.SIType,
                    ContactName:$scope.order.ContactName,ContactPhone:$scope.order.ContactPhone,
                    ServiceItem : {ChargeItems : []}
                };
                $scope.init();
                angular.copy(oldData, $scope.order);
                utility.message("订单任务生成成功");
            }
            else {
                utility.message(newItem.ResultMessage);
            }
            $timeout(function () {
                $("#myAddress1").citypicker("refresh");
            }, 1);
        });
    };

    $scope.saveChargeItem = function () {

        if ($scope.curChgItemAdd && $scope.tempItem.CINo) {
            $scope.order.ServiceItem.ChargeItems.push($scope.tempItem);
        }
        $scope.JsPrice();
        $scope.tempItem = { Quantity: 0, Price: 0 };
        $scope.curChgItemAdd = true;
    }

    $scope.JsPrice = function () {
        $scope.order.Price = 0;
        angular.forEach($scope.order.ServiceItem.ChargeItems, function (data, index, array) {
            $scope.order.Price += (data.Price * 10000 * data.Quantity)/10000;
        });
    }

    $scope.charegeClick = function (item) {
        $scope.tempItem = item;
        $scope.curChgItemAdd = false;
    }

    $scope.deleteCharegeDetl = function (item, $event) {
        if (item) {
            $scope.order.ServiceItem.ChargeItems.splice($scope.order.ServiceItem.ChargeItems.indexOf(item), 1);
            if (item.ChargeItemID) {
                $scope.DeleteItem.push(item.ChargeItemID);
            }
            $scope.JsPrice();
        }
        $event.stopPropagation();
    }

    $scope.CommodityOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseCommodityOrder", serviceOrderID);
    }   
    $scope.init();
}])
.controller("CommodityOrderInfoCtrl", ['$scope', '$http', '$state', '$location', '$stateParams', 'resourceFactory', function ($scope, $http, $state, $location, $stateParams, resourceFactory) {

    //选择的服务单
    $scope.$on("chooseCommodityOrder", function (event, serviceOrderID) {
        var commodityOrderDetailRes = resourceFactory.getResource("serviceOrderDetailRes");
        commodityOrderDetailRes.get({ id: serviceOrderID }, function (data) {
            $scope.Order = data.Data.Order;
            $scope.Task = data.Data.Task;
        });
    });
   
}])
.controller("CommodityItemModalCtrl", ['$scope', '$http', '$state', '$location', 'resourceFactory', function ($scope, $http, $state, $location, resourceFactory) {
    var commodityItemRes = resourceFactory.getResource("commodityItemRes");
    var commodityTypeRes = resourceFactory.getResource("commodityTypeRes");
    $scope.Data = {};
    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: commodityItemRes,//异步请求的res
        params: {  },
        success: function (data) {//请求成功时执行函数
            $scope.Data.commodityItems = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    commodityTypeRes.get({}, function (data) {
        $scope.options.params['Data.CICategory'] = "";
        $scope.Data.CommodityTypeList = [{"CTypeID":"","CTypeName":"---全部---"}];
        $scope.Data.CommodityTypeList = $scope.Data.CommodityTypeList.concat(data.Data);
    });

    $scope.search = function () {
        $scope.options.search();
    }

    $scope.rowClick = function (item) {
        $scope.$emit('chooseChargeItem', item);
        $('#modalCommodityItem').modal('hide');
    };
}])
;