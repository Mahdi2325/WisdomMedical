///创建人:jacklai
///创建日期:2016-05-16
///说明:收费组合
angular.module("sltcApp")
.controller("chargeGroupCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    $scope.init = function () {

        resourceFactory.getResource("chargeGroupRes").query(function (data) {
            $scope.chargeGroups = data;
        });
    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                resourceFactory.getResource("chargeGroupRes").delete({ id: item.id }, function () {
                    $scope.chargeGroups.splice($scope.chargeGroups.indexOf(item), 1);
                    utility.message("刪除成功");
                    $scope.init();
                });
                return false;
            }
        });
    };

    $scope.init();
}])
.controller("chargeGroupEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, utility, resourceFactory) {

    $scope.init = function () {
        $scope.curChgItem = {};
        $scope.DeleteItem = [];
        $scope.ModifyOrCreateItem = [];
        $scope.curChgItemAdd = true;
        if ($stateParams.id) {
            $scope.isAdd = true;
            resourceFactory.getResource("chargeGroupRes").get({ id: $stateParams.id }, function (data) {
                $scope.curItem = data;
            });

        } else {
            $scope.isAdd = false;
            $scope.curItem = { GroupItems: [], CGNo: Math.floor(Math.random() * 1000000000), CreateDate: getNowFormatDate() };
        }
    }

    $scope.updateItem = function (item) {
        var len = $scope.DeleteItem.length, ids = $scope.DeleteItem.join(",");
        resourceFactory.getResource("chargeGroupRes").save(item, function () {
            if (len > 0) {
                resourceFactory.getResource("chargeGroupRes").delete({ id: ids }, function () {
                    $scope.DeleteItem = [];
                    utility.message("修改成功");
                    $location.url("/angular/charge/chargegroup");
                });
            } else {
                utility.message("修改成功");
                $location.url("/angular/charge/chargegroup");
            }
        });
    };

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    $scope.charegeClick = function (item) {
        $scope.curChgItem = item;
        $scope.curChgItemAdd = false;
    }

    $scope.deleteCharegeDetl = function (item, $event) {
        if (item) {
            $scope.curItem.GroupItems.splice($scope.curItem.GroupItems.indexOf(item), 1);
            if (item.Id) {
                $scope.DeleteItem.push(item.Id);
            }
        }
        $event.stopPropagation();
    }

    $scope.createItem = function (item) {
        resourceFactory.getResource("chargeGroupRes").save(item, function () {
            utility.message("添加成功");
            $location.url("/angular/charge/chargegroup");
        });

    };

    $scope.cancelEdit = function () {
        $location.url("/angular/charge/chargegroup");
    };

    $scope.saveEdit = function (item) {
        if (item.Id) {
            $scope.updateItem(item);

        } else {
            $scope.createItem(item);

        }
    };

    $scope.selectChargeItem = function (item) {
        if (item) {
            angular.extend($scope.curChgItem, {
                CostItemId: item.Id,
                Unit: item.Unit,
                CINo: item.CINo,
                CIName: item.CIName,
                Price: item.Price,
                RepeatCount: 1,
                Frequency: "Day",
                CIType: item.CIType,
                Status: item.Status
            });
        }
    };

    $scope.saveChargeItem = function () {
        $scope.curItem.hiddenId = $scope.hiddenId;
        if (!$scope.curChgItem.Id && $scope.curChgItemAdd && $scope.curChgItem.SINo) {
            $scope.curItem.GroupItems.push($scope.curChgItem);
        }
        $scope.curChgItem = {};
        $scope.curChgItemAdd = true;
    }

    $scope.rowClick = function (item) {
        $scope.$emit('chooseServiceItem', item);
    };

    $scope.init();
}]);