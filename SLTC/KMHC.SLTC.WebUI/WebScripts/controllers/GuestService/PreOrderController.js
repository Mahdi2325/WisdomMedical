/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("PreOrderListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams, $location, utility, resourceFactory) {

    var preOrderRes = resourceFactory.getResource("preOrderRes");
    $scope.IsOnlyShowWait = true;
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: preOrderRes,//异步请求的res
        initSearch: false,
        params: { "Data.Status":"Wait" },
        success: function (data) {//请求成功时执行函数
            $scope.Appointments = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    //选中住民
    $scope.residentSelected = function (resident) {
        $scope.currentResident = resident;
        $scope.ResidentID = resident.ResidentID;
        $scope.PersonName = resident.PersonName;
        $scope.options.params["Data.ResidentID"] = resident.ResidentID;
        $scope.Search();
    };

    $scope.$on("SavedPreOrder", function (event, item) {
        $scope.Search();
        $('#modalPreOrderEdit').modal('hide');
    });

    $scope.$on("SavedOrder", function (event, item) {
        $('#modalComOrderEdit').modal('hide');
        $scope.Search();
    });

    $scope.Search = function (item) {
        if ($scope.IsOnlyShowWait) {
            $scope.options.params["Data.Status"] = "Wait";
        } else {
            $scope.options.params["Data.Status"] = "";
        }
        $scope.options.search();
    }
    $scope.PreOrderEdit = function (item) {
        if (!item) {
            if (!$scope.ResidentID) {
                utility.message("请选择预约的会员");
                return;
            } else {
                item = { ResidentID: $scope.ResidentID, PersonName: $scope.PersonName };
            }
        }
        $scope.$broadcast("EditPreOrder", item);
        $('#modalPreOrderEdit').modal('show');
    }

    $scope.$on('chooseServiceItem', function (e, data) {
        $scope.$broadcast('selServiceItem', data);
    });


    $scope.$on('OpenSelServiceItem_ToPrent', function (e, data) {
        $scope.$broadcast('OpenSelServiceItem', data);
    });

    $scope.GenOrder = function (item) {
        $scope.$broadcast("EditComOrder", item);
        $('#modalComOrderEdit').modal('show');
    }

    //取消预约
    $scope.CancelApp = function (serviceAppID) {
        utility.confirm("确定要取消该预约吗?", function (result) {
            if (result) {
                preOrderRes.CancelApp({ ServiceAppID: serviceAppID }, function (data) {
                    $scope.Search();
                    utility.message("订单已取消");
                });
                return false;
            }
        });
    };
}])
.controller("PreOrderEditCtrl", ['$scope', '$state', '$stateParams', '$filter', '$timeout', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, $filter,$timeout, utility, resourceFactory) {
    var preOrderRes = resourceFactory.getResource("preOrderRes");
    $scope.preOrder = {};

    $scope.InitPreOrderData = function (preOrder) {
        $scope.prePostData = {};
        if (preOrder.ServiceAppID != undefined) {
            $scope.isAdd = false;
            $scope.GetPNCList();
        } else {
            $scope.preOrder.ServiceType =2;
            $scope.preOrder.ModifiedBy = $scope.$root.user.EmpId;
            $scope.preOrder.CreatedBy = $scope.$root.user.EmpId;
            $scope.preOrder.Status = "Wait";
            $scope.preOrder.AppTime = new Date().format("yyyy-MM-dd hh:mm:ss");
            $scope.preOrder.IsDeleted = false;
            $scope.preOrder.ServiceItems = [];
            $scope.DeleteItem = [];
            $scope.ModifyOrCreateItem = [];
            $scope.curChgItemAdd = true;
            $scope.tempItem = { Qty: 0, UnitPrice: 0 };
            $scope.isAdd = true;
        }

    }

    $scope.GetPNCList = function () {
        preOrderRes.GetPNCList({ date: $scope.preOrder.ServiceDate }, function (data) {
            $scope.PNCList = data.Data;
        });
    }

    //保存订单并生成任务
    $scope.saveEdit = function (item) {

        if (!$scope.preOrder.ServiceItems || $scope.preOrder.ServiceItems.length == 0) {
            utility.message("尚未添加服务项目");
            return;
        }

        //这个检验必须放到最后
        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }

        preOrderRes.save(item, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("预约保存成功。");
                $scope.$emit("SavedPreOrder");
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

        $scope.tempItem.SumPrice = $filter('number')(qty * unitPrice, 2).replace(/,/g, '') * 1;
        if ($scope.curChgItemAdd && $scope.tempItem.SINo) {
            $scope.preOrder.ServiceItems.push($scope.tempItem);
        }
        $scope.tempItem = { Quantity: 0, Price: 0 };
        $scope.curChgItemAdd = true;
    }

    $scope.serviceItemClick = function (item) {
        $scope.tempItem = item;
        $scope.curChgItemAdd = false;
    }

    $scope.deleteServiceItem = function (item, $event) {
        if (item) {
            $scope.preOrder.ServiceItems.splice($scope.preOrder.ServiceItems.indexOf(item), 1);
        }
        $event.stopPropagation();
    }

    $scope.OpenSelServiceItem = function () {
        var param = { ServiceType: 2, ResidentID: $scope.preOrder.ResidentID };
        if ($scope.preOrder.ServiceItems && $scope.preOrder.ServiceItems.length > 0) {
            var selectedArr = [];
            for (var i = 0; i < $scope.preOrder.ServiceItems.length; i++) {
                selectedArr.push($scope.preOrder.ServiceItems[i].ServiceItemID);
            }
            param.SelectedItemIDs = selectedArr;
        }
        $scope.$emit('OpenSelServiceItem_ToPrent', param);
    }

    //选择的服务项目
    $scope.$on("selServiceItem", function (event, data) {
        $scope.tempItem = data;
        if (data.ResidentServicePlanItemID == 0) {
            $scope.tempItem.UnitPrice = data.SumPrice;
            $scope.tempItem.SumPrice = data.UnitPrice;
        }
        $scope.tempItem.Qty = 1;
        $scope.curChgItemAdd = true;
    });

    //选择的服务单
    $scope.$on("EditPreOrder", function (event, preOrder) {
        $scope.preOrder = preOrder;
        $scope.InitPreOrderData(preOrder);
    });
}]);
