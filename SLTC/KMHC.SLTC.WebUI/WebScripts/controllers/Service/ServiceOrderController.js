angular.module("sltcApp")
.controller("ServiceOrderListCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var serviceOrderRes = resourceFactory.getResource("serviceOrderRes");
    $scope.Modal = { Refund: {} };
    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: serviceOrderRes,//异步请求的res
        params: { "Data.ServiceType": 1 },
        success: function (data) {//请求成功时执行函数
            $scope.serviceOrders = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                serviceOrderRes.delete({ id: item.ServiceOrderID }, function (data) {
                    $scope.options.search();
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };

    $scope.Audit = function (item) {
        $scope.Modal.Refund = [];
        serviceOrderRes.GetAuditRefund({ "serviceOrderID": item.ServiceOrderID }, function (d) {
            if (d.IsSuccess) {
                $scope.Modal.Refund = d.Data;
                $scope.Modal.Refund.Status = null;
            }
            $('#refundAudit').modal("show");
        });
    }

    //保存改签审核意见
    $scope.SaveAudit = function () {
        var json = {
            ID: $scope.Modal.Refund.ID,
            ServiceOrderID: $scope.Modal.Refund.ServiceOrderID,
            Reply: $scope.Modal.Refund.Reply,
            Status: $scope.Modal.Refund.Status
        };
        serviceOrderRes.SaveAudit(json, function (d) {
            if (d.IsSuccess) {
                utility.message("退款申请已审核。");
                $('#refundAudit').modal("hide");
                $scope.options.search();
            }
        });
    }
    
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


    $scope.ConfirmOrder = function (serviceOrderID) {
        utility.confirm("确认此订单的客户已经取货?", function (result) {
            if (result) {
                serviceOrderRes.ConfirmOrder({ serviceOrderID: serviceOrderID }, function (data) {
                    $scope.options.search();
                    utility.message("订单已完成");
                });
                return false;
            }
        });
    };

    $scope.ServiceOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseServiceOrder", serviceOrderID);
    }

    $scope.CommodityOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseCommodityOrder", serviceOrderID);
    }
}])
.controller("ServiceOrderEditCtrl", ['$scope', '$location', '$state', '$stateParams', '$filter', '$timeout', 'utility', 'resourceFactory', function ($scope, $location, $state,$stateParams, $filter, $timeout, utility, resourceFactory) {

    var personRes = resourceFactory.getResource("personRes");
    var residentRes = resourceFactory.getResource("residentRes");
    var familyRes = resourceFactory.getResource('familyRes');
    var prePaymentRes = resourceFactory.getResource('prePaymentRes');
    $scope.curTab = "PriorityRemark";
    $scope.activeTab = function (tabName) {
        var s = $location.absUrl();
        if (s.indexOf(tabName) != -1) {
            $scope.curTab = tabName;
            return true;
        } else {
            return false;
        }
    }

    $scope.personSelected = function (person) {
        $scope.PersonID = person.PersonID;
        $scope.PersonInfo = person;
        $scope.ResidentID = person.ResidentID;
        $scope.IdCard = person.IdCard;
        if (person.ResidentID == null || person.ResidentID == 0 || person.ResidentID == undefined) {
            $scope.IsResident = false;
        } else {
            $scope.IsResident = true;
        }

        familyRes.get({ "PageSize": 0, "Data.PersonID": person.PersonID,"Data.IsEmerg": true}, function (data) {
            $scope.Familys = data.Data;
        });
        
        $scope.InitResidentInfo();

        $state.go("ServiceOrderAdd." + $scope.curTab, { id: $scope.PersonID, residentId: $scope.ResidentID, idCard: $scope.IdCard });
    }

    $scope.InitResidentInfo = function () {
        if ($scope.IsResident) {
            residentRes.GetResidentInfo({ residentID: $scope.ResidentID, personID: $scope.PersonID }, function (data) {
                $scope.ResidentInfo = data.Data;
            });
        }
    }

    $scope.curItem = {};
    $scope.openAuthentication = function (item) {
        $scope.$broadcast('OpenAuthentication', item);
    }

    $scope.$on('RefreshInfo', function (e, data) {
        $scope.InitResidentInfo();
    });


    $scope.$on('SavedPerson', function (e, data) {
        $('#modalPersonEdit').modal('hide');
        $scope.personSelected(data);
    });

    $scope.init();
}])
.controller("ServiceOrderInfoCtrl", ['$scope', '$http', '$state', '$location', '$stateParams', 'resourceFactory', function ($scope, $http, $state, $location, $stateParams, resourceFactory) {

    //选择的服务单
    $scope.$on("chooseServiceOrder", function (event, serviceOrderID) {
        var serviceOrderDetailRes = resourceFactory.getResource("serviceOrderDetailRes");
        serviceOrderDetailRes.get({ id: serviceOrderID }, function (data) {
            $scope.Order = data.Data.Order;
            $scope.Task = data.Data.Task;
        });
    });    
}])
;