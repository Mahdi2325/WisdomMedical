angular.module("sltcApp")
.controller("ServiceItemListCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var serviceItemRes = resourceFactory.getResource("serviceItemRes");
    var serviceItemCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
    
    $scope.init = function () {

        serviceItemCategoryRes.get({}, function (data) {
            $scope.options.params['Data.ServiceItemCategoryID'] = "";
            $scope.ServiceItemTypeList = [{ "ServiceItemCategoryID": "", "SICName": "---请选择服务项目类型---" }];
            $scope.ServiceItemTypeList = $scope.ServiceItemTypeList.concat(data.Data);
        });

        $scope.HotArray = [1, 2, 3, 4, 5];

        //查询选项
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: serviceItemRes,//异步请求的res
            params: { 'Data.keyWords': "" },
            success: function (data) {//请求成功时执行函数
                $scope.serviceItems = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        }
    }

    $scope.ServiceItemEdit = function (id) {
        $scope.$broadcast('OpenServiceItemEdit', id);
    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                serviceItemRes.delete({ id: item.ServiceItemID }, function (data) {
                    $scope.options.search();
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };

    $scope.$on('SavedItem', function (e, data) {
        $scope.options.search();
    });
    $scope.init();
}])
.controller("ServiceItemEditCtrl", ['$scope', '$location', '$filter', '$stateParams', 'utility', 'resourceFactory', 'webUploader', function ($scope, $location, $filter,$stateParams, utility, resourceFactory, webUploader) {
    var serviceItemCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
    var serviceItemRes = resourceFactory.getResource("serviceItemRes");

    $scope.InitServiceItem = function (id) {
        $scope.curChgItem = { Quantity: 0, Price: 0 };
        $scope.DeleteItem = [];
        $scope.ModifyOrCreateItem = [];
        $scope.curChgItemAdd = true;
        $scope.prePostData = {};

        serviceItemCategoryRes.get({ "Data": {},"PageSize":0 }, function (data) {
            $scope.serviceitemcategoryList = data.Data;
        });

        if (id) {
            $scope.isAdd = false;
            serviceItemRes.get({ id: id }, function (data) {
                $scope.curItem = data.Data;
                ue.ready(function () {
                    ue.setContent($scope.curItem.Description);
                });
            });

        } else {
            $scope.isAdd = true;
            $scope.curItem = { ChargeItems: [] };//SINo: Math.round(Math.random() * 1000000000),
            var codeRuleRes = resourceFactory.getResource("codeRules");

            codeRuleRes.get({
                "CodeKey": "ServiceItemCode",
                "GenerateRule": "None",
                "Prefix": "SI",
                "SerialNumberLength": 4
            }, function (data) {
                $scope.curItem.SINo = data.Data;
            });
            ue.ready(function () {
                ue.setContent("");
            });
        }

    }

    $scope.FixPrice = function (type) {

        switch (type) {
            case 'SumPrice':
                $scope.curItem.SumPrice = $filter('number')($scope.curItem.SumPrice, 2).replace(/,/g, '') * 1;
                break;
            case 'Price':
                $scope.curChgItem.Price = $filter('number')($scope.curChgItem.Price, 2).replace(/,/g, '') * 1;
                break;
            case 'Quantity':
                $scope.curChgItem.Quantity = $filter('number')($scope.curChgItem.Quantity, 0).replace(/,/g, '') * 1;
                break;
            case 'Unit':
                $scope.curItem.Unit = $filter('number')($scope.curItem.Unit, 2).replace(/,/g, '') * 1;
                break;
        }
    };

    $scope.charegeClick = function (item) {
        $scope.curChgItem = item;
        $scope.curChgItemAdd = false;
    }

    $scope.deleteCharegeDetl = function (item, $event) {
        if (item) {
            $scope.curItem.ChargeItems.splice($scope.curItem.ChargeItems.indexOf(item), 1);
            if (item.Id) {
                $scope.DeleteItem.push(item.Id);
            }
            //$scope.JsPrice();
        }
        $event.stopPropagation();
    }

    $scope.cancelEdit = function () {
        $location.url("/angular/ServiceItemList");
    };

    $scope.saveEdit = function (item) {
        item.Description = ue.getContent();
        if (!objEquals($scope.prePostData,item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }
        serviceItemRes.save(item, function () {
            utility.message("保存成功");
            $('#modalServiceItemEdit').modal('hide');
            $scope.$emit("SavedItem");
        });
    };

    $scope.selectChargeItem = function (item) {
        if (item) {
            angular.extend($scope.curChgItem, {
                ChargeItemID: item.ChargeItemID,
                Unit: item.Unit,
                CINo: item.CINo,
                CIName: item.CIName,
                Price: item.Price,
                Quantity: 1,
                Frequency: "Day",
                CIType: item.CIType,
                Status: item.Status
            });
        }
    };

    $scope.saveChargeItem = function () {
        $scope.curItem.hiddenId = $scope.hiddenId;
        if (!$scope.curChgItem.Id && $scope.curChgItemAdd) {
            $scope.curItem.ChargeItems.push($scope.curChgItem);
        } 
        $scope.curChgItem = { CINo: "", CIName: "", Unit: "", Quantity: 0, Price: 0 };
        $scope.curChgItemAdd = true;
        $scope.JsPrice();
    }

    $scope.JsPrice = function () {
        $scope.curItem.SumPrice = 0;
        angular.forEach($scope.curItem.ChargeItems, function (data, index, array) {
            $scope.curItem.SumPrice += (data.Price * data.Quantity);
        });
        $scope.FixPrice('SumPrice');
    }

    webUploader.init('#PicturePathPicker', { category: 'ServiceItemPhoto' }, '', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
        if (data.length > 0) {
            $scope.curItem.PhotoPath = data[0].SavedLocation;
            $scope.$apply();
        }
    },60);

    $scope.$on("OpenServiceItemEdit", function (event, id) {
        $scope.InitServiceItem(id);
    });
}])
.controller("ServiceItemBatchAddCtrl", ['$scope', '$location', '$stateParams', 'utility', 'serviceItemRes', 'resourceFactory', '$filter', '$q', function ($scope, $location, $stateParams, utility, serviceItemRes, resourceFactory, $filter, $q) {
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

    $scope.saveRoleBatch = function () {
        log.reset();//清空日志
        if (angular.isDefined($scope.content)) {
            try {
                $scope.items = angular.fromJson($scope.content);
            } catch (ex) {
                log.error("解析失败,请输入正确的JSON格式");
            }

            var serviceItemCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
            var serviceItemRes = resourceFactory.getResource("serviceItemRes");
            var chargeItemRes = resourceFactory.getResource("chargeItemRes");
            var serviceItemCategoryPromise = serviceItemCategoryRes.get({ "Data": {}, "CurrentPage": 1, "PageSize": 1000 }).$promise;//获取所有服务项目列表
            var serviceItemPromise = serviceItemRes.get({ "Data": {}, "CurrentPage": 1, "PageSize": 1000 }).$promise;//获取所有服务项目列表
            var chargeItemPromise = chargeItemRes.get({ "Data": {}, "CurrentPage": 1, "PageSize": 1000 }).$promise;

            $q.all([serviceItemCategoryPromise, serviceItemPromise, chargeItemPromise]).then(function (arr) {
                if (angular.isArray($scope.items) && arr[0].RecordsCount > 0 && arr[2].RecordsCount > 0) {
                    var serviceItemCategoryList = arr[0].Data;
                    var serviceItemList = arr[1].Data;
                    var chargeItemList = arr[2].Data;
                    //解析成功
                    angular.forEach($scope.items, function (e) {

                        if (angular.isDefined(e.SINo)//服务项目编码,必须
                            && angular.isDefined(e.SIName)//服务项目名称,必须
                            ) {
                            if ($.grep(serviceItemList, function (bp) { return bp.SINo == e.SINo; }).length > 0) {
                                log.error(e.SINo + " " + e.SIName + "已存在");
                            } else {
                                var chargeItems = [];
                                var SumPrice = 0;
                                // 兼容原来的文档去掉后缀s
                                angular.forEach(e.ChargeItem.split(','), function (value, key) {
                                    if ('' == value.trim()) return;//如果为空跳出                                   

                                    var chargeItem = $filter('filter')(chargeItemList, { CIName: value })[0];//根据CIName筛选出收费项目                                        
                                    if (angular.isDefined(chargeItem)) {
                                        SumPrice += chargeItem.Price;
                                        chargeItem.Quantity = 1;
                                        chargeItems.push(chargeItem);
                                    }
                                    ;
                                });
                                var serviceItemCategory = $filter('filter')(serviceItemCategoryList, { SICName: e.SIType })[0];
                                serviceItemRes.save({
                                    SINo: e.SINo,
                                    SIName: e.SIName,
                                    //SIType: e.SIType,
                                    ServiceItemCategoryID: serviceItemCategory.ServiceItemCategoryID,
                                    SumPrice: SumPrice,//待计算
                                    ChargeItems: chargeItems,
                                    Remark: e.SIName
                                }, function () {
                                    log.info(e.SINo + " " + e.SIName + " 添加成功");
                                }, function (error) {
                                    //TODO 对接真实服务器要加返回错误的处理
                                });
                            }
                        } else {
                            log.error(e.FunctionName + " 信息不完整,被丢弃");
                        }
                    });
                } else {
                    log.error("录入数据非JSON数组格式,请检查输入");
                }
            });
            return
        }
    }
}])
.controller("ServiceItemModalPopuCtrl", ['$scope', '$http', '$stateParams', '$state', '$location', 'resourceFactory', function ($scope, $http,$stateParams, $state, $location, resourceFactory) {
    var servicePlanItemRes = resourceFactory.getResource("servicePlanItemRes");
    var serviceItemCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
    $scope.Data = {};

    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: servicePlanItemRes,//异步请求的res
        params: { 'Data.keyWords': "" },
        success: function (data) {//请求成功时执行函数
            $scope.Data.serviceItems = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }
    $scope.InitServiceItem = function (item) {
        serviceItemCategoryRes.get({}, function (data) {
            $scope.Data.ServiceItemTypeList = data.Data;
        });
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.params["Data.ResidentID"] = item.ResidentID;
        $scope.options.params["Data.ServiceItemCategoryID"] = "";
        $scope.options.params["Data.keyWords"] = "";
        $scope.options.params["Data.SIBelong"] = item.ServiceType;
        $scope.options.params["Data.SelectedItemIDs"] = item.SelectedItemIDs;
        $scope.options.search();
    }

    $scope.search = function () {
        $scope.options.search();
    }

    $scope.ClickType = function (serviceItemCategoryID) {
        $scope.options.params["Data.keyWords"] = "";
        $scope.options.params["Data.ServiceItemCategoryID"] = serviceItemCategoryID;
        $scope.options.search();
    };

    $scope.rowClick = function (item) {
        $scope.$emit('chooseServiceItem', item);
        $('#modalServiceItem').modal('hide');
    };

    $scope.$on('OpenSelServiceItem', function (e, data) {
        $scope.InitServiceItem(data);
    });
}])
;