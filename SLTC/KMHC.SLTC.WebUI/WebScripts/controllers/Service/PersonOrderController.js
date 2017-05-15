/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("PersonOrderListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams, $location, utility, resourceFactory) {

    var serviceOrderRes = resourceFactory.getResource("serviceOrderRes");
    var personRes = resourceFactory.getResource("personRes");
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: serviceOrderRes,//异步请求的res
        initSearch: false,
        params: { 'Data.ResidentID': $stateParams.residentId,"Data.ServiceType":1 },
        success: function (data) {//请求成功时执行函数
            $scope.serviceOrders = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $('#modalEditOrder').on('hide.bs.modal',
        function () {
            $scope.options.search();
            $scope.$emit('RefreshInfo');
    });

    $scope.$on('chooseServiceItem', function (e, data) {
        $scope.$broadcast('selServiceItem', data);
    });

    $scope.$on('chooseChargeItem', function (e, data) {
        $scope.$broadcast('selChargeItem', data);
    });

    $scope.$on('OpenSelServiceItem_ToPrent', function (e, data) {
        $scope.$broadcast('OpenSelServiceItem', data);
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

    $scope.ServiceOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseServiceOrder", serviceOrderID);
    }


    $scope.CommodityOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseCommodityOrder", serviceOrderID);
    }

    $scope.ServiceOrderEdit = function (item) {
        $scope.$broadcast("EditServiceOrder", item);
    }

    $scope.$on("OpenAddressEdit_ToParent", function (event, item) {
        $scope.$broadcast("OpenAddressEdit", item);
    });
    $scope.$on("SavedAddress_ToParent", function (event, item) {
        $scope.$broadcast("SavedAddress");
    });
    $scope.$on("SelAddress_ToParent", function (event, item) {
        $scope.$broadcast("SelAddress", item);
    });

    //取消订单
    $scope.CancelOrder = function (serviceOrderID) {
        utility.confirm("确定要取消该订单吗?", function (result) {
            if (result) {
                serviceOrderRes.CancelOrder({ serviceOrderID: serviceOrderID }, function (data) {
                    $scope.options.search();
                    utility.message("订单已取消");
                });
                return false;
            }
        });
    };
}])
.controller("PersonOrderEditCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'utility', 'resourceFactory', function ($scope, $state, $stateParams,$timeout, utility, resourceFactory) {
    var personRes = resourceFactory.getResource('persons');
    var residentRes = resourceFactory.getResource('residentRes');
    var serviceOrderRes = resourceFactory.getResource("serviceOrderRes");
    var addressRes = resourceFactory.getResource("addressRes");
    $scope.order = {};

    $scope.InitPersonOrderData = function () {
        $scope.prePostData = {};
        if ($scope.order && $scope.order.ServiceOrderID != undefined) {
            if ($scope.order.OrderType == "Commodity") {
                $scope.order.ServiceType = 2;
            } else {
                $scope.order.ServiceType = 1;
            }

            $scope.isAdd = false;

        } else {
            $scope.order = { Priority: 1,ServiceType:1,Delivery:null, Payment:null};
            $scope.order.CommodityItems = [];
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
            $scope.GetPersonInfo();
        }

    }

    $scope.GetPersonInfo = function () {
        var person = $scope.PersonInfo;
        $scope.order.PersonID = person.PersonID;
        $scope.order.PersonName = person.Name;
        $scope.order.ResidentID = person.ResidentID;
        $scope.order.Operator = $scope.currentUserName;

        addressRes.get({ residentID: $stateParams.residentId }, function (data) {
            if (data && data.Data.length>0) {
                $scope.order.ServiceAddress = (data.Data[0].City ? data.Data[0].City : "") + (data.Data[0].Address ? data.Data[0].Address : "") + (data.Data[0].HouseNumber ? data.Data[0].HouseNumber : "");
                $scope.order.Lng = data.Data[0].Lng;
                $scope.order.Lat = data.Data[0].Lat;
                $scope.order.ContactName = data.Data[0].Name;
                $scope.order.ContactPhone = data.Data[0].Phone;
            } else if (person) {                
                $scope.order.ServiceAddress = person.City + person.Address + person.HouseNumber;
                $scope.order.Lng = person.Lng;
                $scope.order.Lat = person.Lat;
                $scope.order.ContactName = person.Name;
                $scope.order.ContactPhone = person.Phone;
            } 
        })

    }

    $scope.ChangePayment = function () {
        if ($scope.order.Payment == "ResidentCard") {
            resourceFactory.getResource("prePaymentRes").get({ id: $scope.order.ResidentID }, function (data1) {
                var totalConSpeMonth = 0;
                var amount = 0;
                if (data1.Data!=null && !angular.isUndefined(data1.Data.TotalConSpeMonth)) {
                    totalConSpeMonth = data1.Data.TotalConSpeMonth;
                };
                if (data1.Data != null && !angular.isUndefined(data1.Data.Amount)) {
                    amount = data1.Data.Amount;
                }
                $scope.RemainingMoney = amount - totalConSpeMonth;//余额  
                $scope.selPayment = true;
            });

        } else {
            $scope.selPayment = false;
        }
    }

    $scope.SelectST = function (type) {
        if (type==2) {
            $scope.order.OrderType = "Commodity";
            $scope.order.ServiceItemID = null;
            $scope.order.SINo = null;
            $scope.order.SIName = null;
            $scope.order.OrderTitle = null;
            $scope.order.SIType = null;
            $scope.order.InitPrice = null;
            $scope.order.Delivery = null;
        } else {
            $scope.order.OrderType = "Service";
            $scope.order.CommodityItems == null;
            $scope.order.InitPrice = null;
            $scope.order.Delivery = null;
        }
        $scope.selPayment = false;
        $scope.CountFinalPrice();
    }

    //保存订单并生成任务
    $scope.saveEdit = function (item) {
        if ($scope.order.Payment == "ResidentCard" && $scope.RemainingMoney < $scope.order.Price) {
            utility.message("会员卡余额不足，请充值后再进行预约,或使用其他支付方式进行预约。");
            return;
        }

        if ($scope.order.OrderType=="Commodity" && (!$scope.order.CommodityItems || $scope.order.CommodityItems.length == 0)) {
            utility.message("尚未添加商品");
            return;
        }

        //这个检验必须放到最后
        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }

        serviceOrderRes.save(item, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("订单保存成功。");
                $('#modalEditOrder').modal('hide');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $scope.saveChargeItem = function () {

        if ($scope.curChgItemAdd && $scope.tempItem.CINo) {
            $scope.order.CommodityItems.push($scope.tempItem);
        }
        $scope.JsPrice();
        $scope.tempItem = { Quantity: 0, Price: 0 };
        $scope.curChgItemAdd = true;
    }

    $scope.JsPrice = function () {
        $scope.order.InitPrice = 0;
        angular.forEach($scope.order.CommodityItems, function (data, index, array) {
            $scope.order.InitPrice += (data.Price * 10000 * data.Quantity) / 10000;
        });
        $scope.CountFinalPrice();
    }

    $scope.CountFinalPrice = function () {
        var initPrice = 0;
        var servicePrice = 0;
        var discount = 0;

        if ($scope.order.InitPrice && $scope.order.InitPrice !="") {
            initPrice = $scope.order.InitPrice * 1;
        }
        if ($scope.order.ServicePrice && $scope.order.ServicePrice != "") {
            servicePrice = $scope.order.ServicePrice * 1;
        }
        if ($scope.order.Discount && $scope.order.Discount != "") {
            discount = $scope.order.Discount * 1;
        }
        $scope.order.Price = initPrice + servicePrice - discount;
    }

    $scope.charegeClick = function (item) {
        $scope.tempItem = item;
        $scope.curChgItemAdd = false;
    }

    $scope.deleteCharegeDetl = function (item, $event) {
        if (item) {
            $scope.order.CommodityItems.splice($scope.order.CommodityItems.indexOf(item), 1);
            if (item.ChargeItemID) {
                $scope.DeleteItem.push(item.CommodityItemID);
            }
            $scope.JsPrice();
        }
        $event.stopPropagation();
    }

    $scope.OpenSelServiceItem = function () {
        var param = { ServiceType: 1, ResidentID: $scope.order.ResidentID };
        $scope.$emit('OpenSelServiceItem_ToPrent', param);
    }

    //选择的服务项目
    $scope.$on("selServiceItem", function (event, data) {
        if ($scope.order.CommodityItems == null) {
            $scope.order.CommodityItems = [];
        }
        $scope.order.ServiceItemID = data.ServiceItemID;
        $scope.order.SINo = data.SINo;
        $scope.order.SIName = data.SIName;
        $scope.order.OrderTitle = data.SIName;
        $scope.order.SIType = data.SIType;
        $scope.order.OrderType = data.RestTimes > 0 ? "Group" : "Service";
        if (!$scope.order.OrderType != "Group") {
            $scope.order.InitPrice = data.SumPrice;
            $scope.CountFinalPrice();
        }
    });

    //选择的服务项目
    $scope.$on("selChargeItem", function (event, data) {
        $scope.tempItem = data;
        $scope.tempItem.Quantity = 1;
        $scope.curChgItemAdd = true;
        $scope.order.OrderType = "Commodity";
        $scope.order.OrderTitle = "商品购买";
    });

    //选择地址
    $scope.$on("SelAddress", function (event, data) {
        $scope.order.ServiceAddress = (data.City ? data.City : "") + (data.Address ? data.Address : "") + (data.HouseNumber ? data.HouseNumber : "");
        $scope.order.Lng = data.Lng;
        $scope.order.Lat = data.Lat;
        $scope.order.ContactName = data.Name;
        $scope.order.ContactPhone = data.Phone;
        $('#modalSelectAddress').modal('hide');
    });

    $('#modalEditOrder').on('show.bs.modal',
        function () {
            $scope.InitPersonOrderData();
    });

    //选择的服务单
    $scope.$on("EditServiceOrder", function (event, order) {
        $scope.order = order;
        $scope.selPayment = false;
    });
}]);
