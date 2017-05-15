angular.module("sltcApp")
.controller("ComOrderListCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var comOrderRes = resourceFactory.getResource("comOrderRes");
    $scope.IsOnlyShowProcess = true;
    $scope.Modal = { Refund: {} };
    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: comOrderRes,//异步请求的res
        params: { "Data.OrderStatus": ["Wait", "Undelivered", "Delivered"], "Data.ServiceType": 2},
        success: function (data) {//请求成功时执行函数
            $scope.serviceOrders = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.ComOrderEdit = function (item) {
        if (!item) {
            if (!$scope.ResidentID) {
                utility.message("请选择下单的会员");
                return;
            } else {
                item = { ResidentID: $scope.ResidentID, PersonName: $scope.PersonName, Phone: $scope.Phone };
            }
        }
        $scope.$broadcast("EditComOrder", item);
        $('#modalComOrderEdit').modal('show');
    }
    $scope.OpenProcessing = function (serviceOrderID) {
        $scope.$broadcast("OpenProcessing", serviceOrderID);
    }
    //选中住民
    $scope.residentSelected = function (resident) {
        $scope.currentResident = resident;
        $scope.ResidentID = resident.ResidentID;
        $scope.PersonName = resident.PersonName;
        $scope.Phone = resident.Phone;
        $scope.options.params["Data.ResidentID"] = resident.ResidentID;
        $scope.Search();
    };

    $scope.Search = function () {
        if ($scope.IsOnlyShowProcess) {
            $scope.options.params["Data.OrderStatus"] = ["Wait", "Undelivered", "Delivered"];
        } else {
            $scope.options.params["Data.OrderStatus"] = [];
        }

        $scope.options.search();
    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                comOrderRes.delete({ id: item.ServiceOrderID }, function (data) {
                    $scope.options.search();
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };

    $scope.$on("SavedOrder", function (event, item) {
        $('#modalComOrderEdit').modal('hide');
        $scope.options.search();
    });

    //取消订单
    $scope.CancelOrder = function (serviceOrderID) {
        utility.confirm("确定要取消该订单吗?", function (result) {
            if (result) {
                comOrderRes.CancelOrder({ serviceOrderID: serviceOrderID, opreatorId: $scope.$root.user.EmpId }, function (data) {
                    if (data.IsSuccess) {
                        $scope.options.search();
                        utility.message("订单已取消");
                    } else {
                        utility.message(data.ResultMessage);
                    }
                });
                return false;
            }
        });
    };

    $scope.$on('OpenSelServiceItem_ToPrent', function (e, data) {
        $scope.$broadcast('OpenSelServiceItem', data);
    });

    $scope.$on('chooseServiceItem', function (e, data) {
        $scope.$broadcast('selServiceItem', data);
    });


    $scope.ServiceOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseServiceOrder", serviceOrderID);
    }
}])
.controller("ComOrderEditCtrl", ['$scope', '$location', '$state', '$stateParams', '$filter', '$timeout', 'utility', 'resourceFactory', function ($scope, $location, $state, $stateParams, $filter, $timeout, utility, resourceFactory) {

    var personRes = resourceFactory.getResource('persons');
    var residentRes = resourceFactory.getResource('residentRes');
    var comOrderRes = resourceFactory.getResource("comOrderRes");
    var preOrderRes = resourceFactory.getResource("preOrderRes");
    $scope.order = {};

    $scope.InitComOrderData = function (order) {
        $scope.prePostData = {};
        if (order && order.ServiceOrderID != undefined) {
            $scope.order = order;
            $scope.GetPNCList();
            if (!$scope.order.ServiceItems) {
                $scope.order.ServiceItems = [];
            }
            $scope.isAdd = false;
        } else {
            $scope.order = order;
            $scope.order.ModifiedBy = $scope.$root.user.EmpId;
            $scope.order.CreatedBy = $scope.$root.user.EmpId;
            $scope.order.Priority = 1;
            $scope.order.ServiceType = 2;
            $scope.order.Delivery = null;
            $scope.order.Payment = null;
            if ($scope.order.ServiceAppID && $scope.order.ServiceAppID != 0) {
                $scope.order.Otime = $scope.order.ServiceDate;
                $scope.GetPNCList();
                $scope.order.PNCID = $scope.order.PNCID;
                $scope.order.ContactName = $scope.order.AppBy;
                $scope.order.ContactPhone = $scope.order.AppPhone;
                $scope.JsPrice();
            } else {
                $scope.order.ServiceItems = [];
                $scope.order.Otime = new Date().format("yyyy-MM-dd");
                $scope.GetPNCList();
                $scope.order.ContactName = $scope.order.PersonName;
                $scope.order.ContactPhone = $scope.order.Phone;
            }
            $scope.currentUserName = "";
            $scope.DeleteItem = [];
            $scope.ModifyOrCreateItem = [];
            $scope.curChgItemAdd = true;
            $scope.tempItem = { Quantity: 0, Price: 0 };

            $scope.isAdd = true;
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
    
    $scope.GetPNCList = function () {
        preOrderRes.GetPNCList({ date: $scope.order.Otime }, function (data) {
            $scope.PNCList = data.Data;
            if (!$scope.order.ServiceOrderID) {
                var cuurentTime = new Date().format("hhmm")*1;
                if ($scope.PNCList && $scope.PNCList.length>0) {
                    for (var i = 0; i < $scope.PNCList.length;i++){
                        var startTime = $scope.PNCList[i].StartTime.replace(":","")*1;
                        var endTime = $scope.PNCList[i].EndTime.replace(":","")*1;
                        if (cuurentTime >= startTime && cuurentTime <= endTime) {
                            $scope.order.PNCID = $scope.PNCList[i].PNCID;
                            return;
                        } 
                    }
                }
            }
        });
    }


    $scope.ReSyncToQueue = function (item) {

        utility.confirm("确定将其重新排队?", function (result) {
            if (result) {
                var syncIds = [];
                syncIds.push(item.ServiceOrderSIID);
                comOrderRes.SyncToCheckQueue({ OrderSiIds: syncIds, OperatorId: $scope.$root.user.EmpId }, function (data) {
                    if (data.IsSuccess) {
                        utility.message("已重新加入排队队列中。");
                        item.ChargeStatus = 0;
                    } else {
                        utility.message(data.ResultMessage);
                    }
                });
                return false;
            }
        });
    };

    //保存订单并生成任务
    $scope.saveEdit = function (item) {

        if ((!$scope.order.ServiceItems || $scope.order.ServiceItems.length == 0)) {
            utility.message("尚未添加项目");
            return;
        }

        //这个检验必须放到最后
        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }

        comOrderRes.save(item, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("订单保存成功。");
                $scope.$emit('SavedOrder');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $scope.saveServiceItem = function () {
        var qty = 0;
        var unitPrice = 0;
        var discount = 0;

        if ($scope.tempItem.Qty && $scope.tempItem.Qty != "") {
            qty = $scope.tempItem.Qty * 1;
        }

        if ($scope.tempItem.UnitPrice && $scope.tempItem.UnitPrice != "") {
            unitPrice = $scope.tempItem.UnitPrice * 1;
        }
        if ($scope.tempItem.DiscountPrice && $scope.tempItem.DiscountPrice != "") {
            discount = $scope.tempItem.DiscountPrice * 1;
        }
        $scope.tempItem.SumPrice = $filter('number')(qty * unitPrice - discount, 2).replace(/,/g, '') * 1;

        if ($scope.curChgItemAdd && $scope.tempItem.SINo) {
            $scope.tempItem.DiscountPrice = 0;
            $scope.order.ServiceItems.push($scope.tempItem);
        }
        $scope.JsPrice();
        $scope.tempItem = { Qty: 0, DiscountPrice: 0, };
        $scope.curChgItemAdd = true;
    }

    $scope.JsPrice = function () {
        $scope.order.InitPrice = 0;
        $scope.order.Discount = 0;
        $scope.order.Price = 0;
        angular.forEach($scope.order.ServiceItems, function (data, index, array) {
            if (data.Qty && data.UnitPrice) {
                $scope.order.InitPrice += (data.UnitPrice * 10000 * data.Qty) / 10000;
            }
            if (data.DiscountPrice) {
                $scope.order.Discount += data.DiscountPrice;
            }
            if (data.SumPrice) {
                $scope.order.Price += data.SumPrice;
            }
        });
        $scope.order.InitPrice = $filter('number')($scope.order.InitPrice, 2).replace(/,/g, '') * 1;
        $scope.order.Discount = $filter('number')($scope.order.Discount, 2).replace(/,/g, '') * 1;
        $scope.order.Price = $filter('number')($scope.order.Price, 2).replace(/,/g, '') * 1;
    }

    $scope.serviceItemClick = function (item) {
        $scope.tempItem = item;
        $scope.curChgItemAdd = false;
    }

    $scope.deleteServiceItem = function (item, $event) {
        if (item) {
            $scope.order.ServiceItems.splice($scope.order.ServiceItems.indexOf(item), 1);
            if (item.ServiceItemID) {
                $scope.JsPrice();
            }
        }
        $event.stopPropagation();
    }

    $scope.OpenSelServiceItem = function () {

        var param = { ServiceType: 2, ResidentID: $scope.order.ResidentID };
        if ($scope.order.ServiceItems && $scope.order.ServiceItems.length>0) {
            var selectedArr = [];
            for(var i=0;i<$scope.order.ServiceItems.length; i++){
                selectedArr.push($scope.order.ServiceItems[i].ServiceItemID);
            }
            param.SelectedItemIDs = selectedArr;
        }
        $scope.$emit('OpenSelServiceItem_ToPrent', param);
    }

    //选择的服务项目
    $scope.$on("selServiceItem", function (event, data) {
        $scope.tempItem = data;
        if (data.ResidentServicePlanItemID==0) {
            $scope.tempItem.UnitPrice = data.SumPrice;
            $scope.tempItem.DiscountPrice = 0;
            $scope.tempItem.SumPrice = data.UnitPrice;
        }
        $scope.tempItem.Qty = 1;
        $scope.curChgItemAdd = true;
    });

    //选择的服务单
    $scope.$on("EditComOrder", function (event, order) {
        $scope.InitComOrderData(order);
    });
}])
.controller("ServiceItemProcessingCtrl", ['$scope', '$http', '$state', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $http, $state, $location, $stateParams,utility, resourceFactory) {

    var comOrderRes = resourceFactory.getResource("comOrderRes");

    //选择的服务单
    $scope.$on("OpenProcessing", function (event, orderId) {
        $scope.ServiceItems = [];
        comOrderRes.GetOrderItems({ serviceOrderID: orderId }, function (newItem) {
            if (newItem.IsSuccess) {
                $scope.ServiceItems = newItem.Data;
            }
            else {
                utility.message("获取订单数据失败");
            }
        });

    });

    $scope.ReSyncToQueue = function (item) {

        utility.confirm("确定将其重新排队?", function (result) {
            if (result) {
                var syncIds = [];
                syncIds.push(item.ServiceOrderSIID);
                comOrderRes.SyncToCheckQueue({ OrderSiIds: syncIds, OperatorId: $scope.$root.user.EmpId }, function (data) {
                    if (data.IsSuccess) {
                        utility.message("已重新加入排队队列中。");
                        item.ChargeStatus = 0;
                    } else {
                        utility.message(data.ResultMessage);
                    }
                });
                return false;
            }
        });
    };
}])
;