///创建人:jacklai
///创建日期:2016-05-18
///说明:收费项目
angular.module("sltcApp")
.controller("chargeItemCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var chargeItemRes = resourceFactory.getResource("chargeItemRes");

    //初始化
    $scope.init = function () {
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: chargeItemRes,//异步请求的res
            params: { 'Data.CIName': "" },
            success: function (data) {//请求成功时执行函数              
                $scope.chargeItems = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        };
    };

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                resourceFactory.getResource("chargeItemRes").delete({ id: item.ChargeItemID }, function (data) {
                    $scope.chargeItems.splice($scope.chargeItems.indexOf(item), 1);
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };
    $scope.init();
}])
.controller("chargeItemEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, utility, resourceFactory) {
    var serviceItemCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
    $scope.init = function () {
        var serviceItemCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
        if ($stateParams.id) {
            $scope.isAdd = true;
            resourceFactory.getResource("chargeItemRes").get({ id: $stateParams.id }, function (data) {
                $scope.curItem = data.Data;
            });

        } else {
            $scope.isAdd = false;
            $scope.curItem = {};
            var codeRuleRes = resourceFactory.getResource("codeRules");
            codeRuleRes.get({
                "CodeKey": "ChargeItemCode",
                "GenerateRule": "None",
                "Prefix": "C",
                "SerialNumberLength": 4,
                "OrganizationID": $scope.$root.user.OrgId
            }, function (data) {
                $scope.curItem.CINo = data.Data;
            });
        }

        serviceItemCategoryRes.get({ "PageSize":0 }, function (data) {
            $scope.serviceitemcategoryList = data.Data;
        });
    }


    $scope.createItem = function (item) {
        resourceFactory.getResource("chargeItemRes").save(item, function (newItem) {
            utility.message("添加成功");
            $location.url("/angular/charge/chargeitem");
        });
    };

    $scope.updateItem = function (item) {
        resourceFactory.getResource("chargeItemRes").save(item, function () {
            utility.message("修改成功");
            $location.url("/angular/charge/chargeitem");
        });
    };

    $scope.cancelEdit = function () {
        $location.url("/angular/charge/chargeitem");
    };

    $scope.saveEdit = function (item) {
        if (angular.isDefined(item.Id)) {
            $scope.updateItem(item);
        } else {
            $scope.createItem(item);
        }
    };
    $scope.init();
}])
.controller("chargeItemBatchAddCtrl", ['$scope', '$location', '$stateParams', 'resourceFactory', '$filter', function ($scope, $location, $stateParams, resourceFactory, $filter) {
    var log = {
        info: function (message) {
            if (angular.isUndefined($scope.info)) {
                $scope.info = '';
            }
            $scope.info += 'Info:' + message + '\r\n';
        },
        error: function (message) {
            if (angular.isUndefined($scope.error)) {
                $scope.error = '';
            }
            $scope.error += 'ERROR:' + message + '\r\n';
        },
        reset: function () {
            $scope.info = '';
            $scope.error = '';
        }
    }

    //监听内容变化
    $scope.$watch("content", function () {
        var content = $scope.content;
        if (!angular.isDefined($scope.content) || $scope.content.trim() == "") {
            return;
        }
        $scope.content = $scope.content.trim().replace("[", "").replace("]", "");

        if ($scope.content.substring($scope.content.length - 1, $scope.content.length) === ",") {
            $scope.content = $scope.content.substring(0, $scope.content.length - 1);
        }
        $scope.content = "[" + $scope.content + "]";
    });

    $scope.saveItemBatch = function () {
        log.reset();//清空日志
        if (angular.isDefined($scope.content)) {
            try {
                $scope.items = angular.fromJson($scope.content);
            } catch (ex) {
                log.error("解析失败,请输入正确的JSON格式");
            }
            var chargeItemRes = resourceFactory.getResource("chargeItem");

            if (angular.isArray($scope.items)) {

                chargeItemRes.get({ "Data.OrganizationID": $scope.$root.user.OrgId }).$promise.then(function (data1) {
                    var data = data1.Data;
                    angular.forEach($scope.items, function (e) {
                        if (angular.isDefined(e.CINo)
                            && angular.isDefined(e.CIName)
                            && angular.isDefined(e.Unit)
                            && angular.isDefined(e.Price)) {                    
                            if ($.grep(data, function (bp) { return bp.CINo == e.CINo; }).length > 0) {
                                //同一个机构下面已经存在同一个编号,判定已存在
                                log.error(e.CINo + " " + e.CIName + "已存在");
                            } else {
                                var item = {
                                    CINo: e.CINo,
                                    CIName: e.CIName,
                                    CICategory: e.CICategory,
                                    Unit: e.Unit,
                                    Price: e.Price,
                                    OrganizationID: $scope.$root.user.OrgId
                                };
                                chargeItemRes.save(item, function () {
                                    log.info(e.CINo + " " + e.CIName + " 添加成功");
                                }, function (error) {
                                    //TODO 对接真实服务器要加返回错误的处理
                                });
                            }
                        } else {
                            log.error(e.CIName + " 信息不完整,被丢弃");
                        }
                    });
                });


                ////解析成功 [{"CINo":"项目编码","CIName":"项目名称","CIType":"项目类型","Unit":"单位","Price":价格}]
                //angular.forEach($scope.items, function (e) {

                //    if (angular.isDefined(e.CINo)
                //        && angular.isDefined(e.CIName)
                //        && angular.isDefined(e.CIType)
                //        && angular.isDefined(e.Unit)
                //        && angular.isDefined(e.Price)) {
                //        //TODO 如果已经存在的不添加,对接真实服务器后不用再判断
                //        chargeItemRes.query({ CINo: e.CINo }).$promise.then(function (result) {
                //            if (result.length > 0) {
                //                log.error(e.CINo + " " + e.CIName + "已存在");
                //            } else {
                //var item = {
                //    CINo: e.CINo,
                //    CIName: e.CIName,
                //    CIType: e.CIType,
                //    Unit: e.Unit,
                //    Price: e.Price,
                //    ResidentOrg: $scope.$root.user.curOrgNo
                //};

                //chargeItemRes.save(item, function () {
                //    log.info(e.CINo + " " + e.CIName + " 添加成功");
                //}, function (error) {
                //    //TODO 对接真实服务器要加返回错误的处理
                //});
                //            }
                //        });

                //    } else {
                //        log.error(e.CIName + " 信息不完整,被丢弃");
                //    }
                //});
            } else {
                log.error("录入数据非JSON数组格式,请检查输入");
            }
        }
    }

    $scope.cancelBatchAdd = function () {
        $location.url("/angular/charge/chargeitem");
    };
}]);