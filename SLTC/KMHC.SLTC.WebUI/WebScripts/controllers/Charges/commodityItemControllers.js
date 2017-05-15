///创建人:张有军
///创建日期:2016-11-16
///说明:商品
angular.module("sltcApp")
.controller("commodityItemCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var commodityItemRes = resourceFactory.getResource("commodityItemRes");
    var commodityTypeRes = resourceFactory.getResource("commodityTypeRes");

    //初始化
    $scope.init = function () {
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: commodityItemRes,//异步请求的res
            params: { 'Data.CIName': "" },
            success: function (data) {//请求成功时执行函数              
                $scope.commodityItems = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        };

        commodityTypeRes.get({}, function (data) {
            $scope.options.params['Data.CICategory'] = "";
            $scope.CommodityTypeList = [{ "CTypeID": "", "CTypeName": "---请选择商品分类---" }];
            $scope.CommodityTypeList = $scope.CommodityTypeList.concat(data.Data);
        });
    };

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                resourceFactory.getResource("commodityItemRes").delete({ id: item.CommodityItemID }, function (data) {
                    $scope.commodityItems.splice($scope.commodityItems.indexOf(item), 1);
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };

    $scope.CommodityItemEdit = function (id) {
        $scope.$broadcast('OpenCommodityItemEdit', id);
    }

    $scope.$on('SavedCommodityItem', function (e, data) {
        $('#modalCommodityItemEdit').modal('hide');
        $scope.options.search();
    });

    $scope.init();
}])
.controller("commodityItemEditCtrl", ['$scope', '$location', '$filter', '$stateParams', 'utility', 'resourceFactory', 'webUploader', function ($scope, $location,$filter, $stateParams, utility, resourceFactory, webUploader) {

    var commodityTypeRes = resourceFactory.getResource("commodityTypeRes");

    $scope.InitCommodityItem = function (id) {
        $scope.prePostData = {};
        if (id) {
            $scope.isAdd = false;
            resourceFactory.getResource("commodityItemRes").get({ id: id }, function (data) {
                $scope.curItem = data.Data;
				ue.ready(function() {
					ue.setContent($scope.curItem.Description);
				});
            });

        } else {
            $scope.isAdd = true;
            $scope.curItem = {};
            var codeRuleRes = resourceFactory.getResource("codeRules");
            codeRuleRes.get({
                "CodeKey": "CommodityItemCode",
                "GenerateRule": "None",
                "Prefix": "CM",
                "SerialNumberLength": 4,
                "OrganizationID": -1
            }, function (data) {
                $scope.curItem.CINo = data.Data;
            });
            ue.ready(function () {
                ue.setContent("");
            });
        }

        commodityTypeRes.get({}, function (data) {
            $scope.commodityTypeList = data.Data;
        });
    }


    $scope.cancelEdit = function () {
        $location.url("/angular/charge/commodityitem");
    };

    $scope.FixPrice = function () {
        $scope.curItem.Price = $filter('number')($scope.curItem.Price, 2).replace(/,/g, '') * 1;
    };


    $scope.saveEdit = function (item) {
        item.Description = ue.getContent();

        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }
        resourceFactory.getResource("commodityItemRes").save(item, function () {
            utility.message("修改成功");
            $scope.$emit("SavedCommodityItem");
        });
    };


    webUploader.init('#PicturePathPicker', { category: 'CommodityPhoto' }, '', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
        if (data.length > 0) {
            $scope.curItem.PhotoPath = data[0].SavedLocation;
            $scope.$apply();
        }
    },60);
    $scope.$on("OpenCommodityItemEdit", function (event, id) {
        $scope.InitCommodityItem(id);
    });
}])
.controller("commodityItemBatchAddCtrl", ['$scope', '$location', '$stateParams', 'resourceFactory', '$filter', function ($scope, $location, $stateParams, resourceFactory, $filter) {
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
        $location.url("/angular/charge/commodityitem");
    };
}]);