///创建人:jacklai
///创建日期:2016-05-19
///说明:固定费用设定
angular.module("sltcApp")
.controller("fixedChargeCtrl", ['$scope', '$q', '$timeout', 'utility', 'fixedChargeRes', 'fixedChargeChargeGroupRes', 'chargeGroupRes', 'servicegroupitemsRes', 'serviceItemRes', function ($scope, $q, $timeout, utility, fixedChargeRes, fixedChargeChargeGroupRes, chargeGroupRes, servicegroupitemsRes, serviceItemRes) {
    $scope.isCanAdd = false;
    //当前正在编辑的项目
    $scope.init = function () {
        $scope.curItem = { Period: "Month", RepeatCount: 1, nextdoTime: "2016-7-1" };
        $scope.curResident = $scope.curResident || {};
        chargeGroupRes.query(function (data) {
            $scope.chargeGroups = data;
        });
    }

    $scope.search = function () {
        if ($scope.curResident.ResidentNo) {
            servicegroupitemsRes.query(function (data1) {
                $scope.olditem = [];
                $scope.newitem = [];
                angular.forEach(data1, function (data, index, array) {
                    if (data.ResidentNo == $scope.curResident.ResidentNo) {
                        if (data.Status == 0) {
                            $scope.olditem.push(data);
                        }
                        if (data.Status == 1) {
                            $scope.newitem.push(data);
                        }
                    }
                });
                //当前执行套餐
                $scope.fixedCharges = $scope.olditem;
                //变更后执行套餐
                $scope.newfixedCharges = $scope.newitem;
            });
        }
    }
    $scope.deleteItem = function (item) {

        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                fixedChargeRes.delete({ id: item.id }, function () {
                    $scope.fixedCharges.splice($scope.fixedCharges.indexOf(item), 1);
                    utility.message("刪除成功");
                    $scope.init();
                });
                return false;
            }
        });
    };

    $scope.createItem = function (item) {
        item.ResidentNo = $scope.curResident.ResidentNo;
        //保存
        fixedChargeRes.save(item, function (newItem) {

            $scope.fixedCharges.push(newItem);
            $scope.init();
            utility.message("添加成功");
        });
    };

    $scope.updateItem = function (item) {
        fixedChargeRes.save(item, function () {
            $scope.init();
            utility.message("修改成功");
        });
    };



    $scope.rowSelect = function (item) {
        $scope.curItem = item;
    };


    $scope.saveEdit = function (item) {
        if (angular.isDefined(item.id)) {
            $scope.updateItem(item);//修改
        } else {
            $scope.createItem(item);//新增
        }
    };

    //选中收费项目回调函数
    $scope.chargeSelected = function (chargeItem) {
        angular.extend($scope.curItem, {
            CINo: chargeItem.CINo,
            CIName: chargeItem.CIName,
            Unit: chargeItem.Unit,
            Price: chargeItem.Price,
            CostItemId: chargeItem.id,
            Quantity: 1
        });
    }

    //选中住民回调函数
    $scope.residentSelected = function (resident) {
        $scope.curResident = resident;//设置当前住民
        $scope.search();//加载住民固定费用设置
        $scope.init();
        if (angular.isDefined($scope.curResident.ResidentNo)) {
            $scope.isCanAdd = true;
        }
    }

    //往固定收费记录里面添加数据
    $scope.SavefixedCharge = function (itemid) {     
        var obj = [];
        fixedChargeRes.query(function (data1) {
            angular.forEach(data1, function (data, index, array) {
                if (data.ResidentNo == $scope.curResident.ResidentNo && data.Status == 1) {                 
                    obj.push(fixedChargeRes.delete({ id: data.id }));
                }
            });
        });
        $q.all(obj).then(function () {
        });
        chargeGroupRes.get({ id: itemid }, function (data1) {
            $.each(data1.GroupItems, function (i, data) {
                //服务项目编号
                var SINo = data.SINo;
                //通过服务项目编号去找服务项目
                serviceItemRes.query(function (serviceitems) {
                    angular.forEach(serviceitems, function (data, index, array) {                      
                        if (data.SINo == SINo) {
                            console.log(data.ChargeItem);
                            var chargeItems = data.ChargeItem;
                            angular.forEach(chargeItems, function (chargeItem, index, array) {
                                chargeItem.ResidentNo = $scope.curResident.ResidentNo;
                                chargeItem.Status = 1;
                                fixedChargeRes.save(chargeItem, function (d) {
                                    console.log("保存成功");
                                });
                            });
                        }
                    });

                });
            });
        });
    };

    // 变更套餐
    $scope.inputChargeGroup = function (itemid) {
        if (!itemid) {
            return;
        }
        $scope.SavefixedCharge(itemid);

        $scope.isCanAdd = false;
        //新套餐
        var datasoure = $scope.newfixedCharges;
        $.each(datasoure, function (i, data) {
            servicegroupitemsRes.delete({ id: data.id }, function () {
                $scope.newfixedCharges.splice($scope.newfixedCharges.indexOf(data), 1);
            });
        });

        //往新套餐里面添加数据
        chargeGroupRes.get({ id: itemid }, function (data1) {
            $.each(data1.GroupItems, function (i, data) {
                data.SGNo = Math.floor(Math.random() * 1000000000);
                data.ResidentNo = $scope.curResident.ResidentNo;
                data.Status = 1;
                data.CGNo = itemid;
                data.CGName = data1.CGName;
                servicegroupitemsRes.save(data, function (newItem) {
                    $scope.newfixedCharges.push(newItem);
                });
            });

            utility.message("套餐修改成功");
            $timeout(function () {
                $scope.isCanAdd = true;
            }, 3000);
        });


    }
    $scope.init();
}]);