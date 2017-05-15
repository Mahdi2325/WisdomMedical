///创建人:jacklai
///创建日期:2016-05-16
///说明:收费组合
angular.module("sltcApp")
.controller("ServiceGroupCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var serviceGroupRes = resourceFactory.getResource("serviceGroupRes");


    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: serviceGroupRes,//异步请求的res
        params: { 'Data.keyWords': "" },
        success: function (data) {//请求成功时执行函数
            $scope.serviceGroups = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.deleteItem = function (item) {
        if (item) {
            utility.confirm("确定删除该信息吗?", function (result) {
                if (result) {
                    serviceGroupRes.delete({ id: item.ServiceGroupID }, function () {
                        $scope.options.search();
                        utility.message("刪除成功");
                    });
                    return false;
                }               
            });           
        }
    };

    $scope.rowClick = function (item) {
        utility.confirm("是否为用户设置【"+item.SGName+"】套餐?", function (result) {
            if (result) {
                $scope.$emit('chooseServiceGroup', item);
                $('#modalSetServicePlan').modal('hide');
            }               
        });  
    }

    $scope.ServiceGroupEdit = function (id) {
        $scope.$broadcast('OpenServiceGroupEdit', id);
    }

    $scope.$on('SavedGroup', function (e, data) {
        $scope.options.search();
        $('#modalServiceGroupEdit').modal('hide');
    });

    $scope.$on("chooseServiceItem", function (event, data) {
        $scope.$broadcast('selServiceItem', data);
        $('#modalServiceItem').modal('hide');
    });
}])
.controller("ServiceGroupEditCtrl", ['$scope', '$location', '$filter', '$stateParams', 'utility', 'webUploader', 'resourceFactory', function ($scope, $location, $filter,$stateParams, utility, webUploader, resourceFactory) {
    var serviceGroupRes = resourceFactory.getResource("serviceGroupRes");

    $scope.HotArray = [1, 2, 3, 4, 5];

    $scope.InitServiceGroup = function (id) {
        $scope.prePostData = {};
        $scope.curChgItem = {};
        $scope.DeleteItem = [];
        $scope.ModifyOrCreateItem = [];
        $scope.curChgItemAdd = true;
        if (id) {
            $scope.isAdd = false;
            serviceGroupRes.get({ id: id }, function (data) {
                $scope.curItem = data.Data;
                ue.ready(function () {
                    ue.setContent($scope.curItem.Description);
                });
            });

        } else {
            $scope.isAdd = true;
            $scope.curItem = { GroupItems: [], CreateDate: getNowFormatDate() };//SGNo: Math.floor(Math.random() * 1000000000),
            var codeRuleRes = resourceFactory.getResource("codeRules");

            codeRuleRes.get({
                "CodeKey": "ServiceGroupCode",
                "GenerateRule": "None",
                "Prefix": "SG",
                "SerialNumberLength": 4
            }, function (data) {
                $scope.curItem.SGNo = data.Data;
            });
            ue.ready(function () {
                ue.setContent("");
            });
        }
    }

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

    $scope.FixPrice = function (type) {

        switch (type) {
            case 'ExpiryDate':
                $scope.curItem.ExpiryDate = $filter('number')($scope.curItem.ExpiryDate, 0).replace(/,/g, '') * 1;
                break;
            case 'InitPrice':
                $scope.curItem.InitPrice = $filter('number')($scope.curItem.InitPrice, 2).replace(/,/g, '') * 1;
                break;
            case 'SumPrice':
                $scope.curItem.SumPrice = $filter('number')($scope.curItem.SumPrice, 2).replace(/,/g, '') * 1;
                break;
            case 'ServiceTimes':
                $scope.curChgItem.ServiceTimes = $filter('number')($scope.curChgItem.ServiceTimes, 0).replace(/,/g, '') * 1;
                break;
        }
    };

    $scope.deleteCharegeDetl = function (item, $event) {
        if (item) {
            $scope.curItem.GroupItems.splice($scope.curItem.GroupItems.indexOf(item), 1);
            if (item.Id) {
                $scope.DeleteItem.push(item.Id);
            }
            $scope.JsPrice();
        }
        $event.stopPropagation();
    }

    $scope.saveEdit = function (item) {
        item.Description = ue.getContent();

        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }
        serviceGroupRes.save(item, function () {
            utility.message("保存成功");
            $scope.$emit("SavedGroup");
        });
    };

    $scope.selectChargeItem = function (item) {
        if (item) {
            angular.extend($scope.curChgItem, {
                CostItemId: item.Id,
                Unit: item.Unit,
                SINo: item.CINo,
                SIName: item.CIName,
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
        $scope.JsPrice();
        $scope.curChgItem = {};
        $scope.curChgItemAdd = true;
    }

    $scope.JsPrice = function () {
        $scope.curItem.InitPrice = 0;
        angular.forEach($scope.curItem.GroupItems, function (data, index, array) {
            $scope.curItem.InitPrice += (data.ServiceTimes * data.SumPrice);
        });
        $scope.FixPrice('InitPrice');
    }

    //选择的服务项目
    $scope.$on("selServiceItem", function (event, data) {
        $scope.curChgItem.ServiceItemID = data.ServiceItemID;
        $scope.curChgItem.SINo = data.SINo;
        $scope.curChgItem.SIName = data.SIName;
        $scope.curChgItem.SIType = data.SIType;
        $scope.curChgItem.SumPrice = data.SumPrice;
        $scope.curChgItem.ServiceTimes = 1;
    });

    webUploader.init('#PicturePathPicker', { category: 'ResidentAvatar' }, '', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
        if (data.length > 0) {
            $scope.curItem.Photo = data[0].SavedLocation;
            $scope.$apply();
        }
    },60);

    $scope.$on("OpenServiceGroupEdit", function (event, id) {
        $scope.InitServiceGroup(id);
    });
}])
.controller("ServiceGroupItemsCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, utility, resourceFactory) {

    $scope.search = function () {
        if ($scope.curResident.ResidentNo) {
            resourceFactory.getResource("servicegroupitemsRes").query({ ResidentNo: $scope.curResident.ResidentNo }, function (data1) {                
                //当前执行套餐
                $scope.fixedCharges = data1;

            });
        }
    }
    //选中住民回调函数
    $scope.residentSelected = function (resident) {
        $scope.curResident = resident;//设置当前住民
        $scope.search();//加载住民固定费用设置       
    }
}])
.controller("ServiceGroupItemBatchAddCtrl", ['$scope', '$location', '$filter', '$stateParams', 'utility', 'resourceFactory', '$q', function ($scope, $location, $filter, $stateParams, utility, resourceFactory, $q) {
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

            var serviceGroupRes = resourceFactory.getResource("serviceGroupRes");
            var serviceItemRes = resourceFactory.getResource("serviceItemRes");


            var serviceGroupPromise = serviceGroupRes.get({ "Data": {}, "CurrentPage": 1, "PageSize": 1000 }).$promise;//获取所有服务项目列表
            var serviceItemPromise = serviceItemRes.get({ "Data": {}, "CurrentPage": 1, "PageSize": 1000 }).$promise;//获取所有服务项目列表

            $q.all([serviceGroupPromise, serviceItemPromise]).then(function (arr) {
                if (angular.isArray($scope.items)) {
                    var serviceGroupList = arr[0].Data;
                    var serviceItemList = arr[1].Data;
                    var jsonList = {};

                    angular.forEach($scope.items, function (e) {
                        if (angular.isDefined(e.SGNo)//套餐编号,必须
                            && angular.isDefined(e.SGName)//套餐名称,必须
                            && angular.isDefined(e.ItemName)//套餐服务项目,必须
                            && angular.isDefined(e.Times)//套餐服务项目次数,必须
                            ) {
                            var json = {};
                            json = jsonList[e.SGNo];
                            if (!json) { json = { SG: null, Items: [] }; jsonList[e.SGNo] = json; }
                            if ('' == e.SGName.trim()) {
                                if ('' != e.ItemName.trim()) {
                                    var service = $filter('filter')(serviceItemList, { SIName: e.ItemName })[0];//根据SIName筛选出服务项目
                                    if (angular.isDefined(service)) {
                                        service.ServiceTimes = e.Times;
                                        json.Items.push(service);
                                    }
                                }
                            } else {

                                json.SG = {
                                    SGNo: e.SGNo,
                                    SGName: e.SGName,
                                    Status: "启用",
                                    //CreateDate: new Date().format("yyyy-MM-dd"),
                                    Remark: e.Description
                                }
                                if ('' != e.ItemName.trim()) {
                                    var service = $filter('filter')(serviceItemList, { SIName: e.ItemName })[0];//根据SIName筛选出服务项目
                                    if (angular.isDefined(service)) {
                                        service.ServiceTimes = e.Times;
                                        json.Items.push(service);
                                    }
                                }
                            }

                        } else {
                            log.error(e.SGName + " 信息不完整,被丢弃");
                        }

                    });

                    var sendRequest = function (sgObj) {
                        if ($.grep(serviceGroupList, function (bp) { return bp.SGNo == sgObj.SGNo; }).length > 0) {
                            log.error(sgObj.SGNo + " " + sgObj.SGName + "已存在");
                        } else {
                            serviceGroupRes.save(sgObj, function () {
                                log.info(sgObj.SGNo + " " + sgObj.SGName + " 添加成功");
                            }, function (error) {
                                //TODO 对接真实服务器要加返回错误的处理
                            });
                        }
                    };
                    //解析成功
                    for (var item in jsonList) {
                        var json = jsonList[item];
                        var sum = 0;
                        $.each(json.Items, function () {
                            sum += Number(this.SumPrice) * Number(this.ServiceTimes)
                        });
                        if (json.SG) {
                            json.SG.SumPrice = sum;
                            json.SG.GroupItems = json.Items;
                            sendRequest(angular.copy(json.SG));
                        }
                    }
                } else {
                    log.error("录入数据非JSON数组格式,请检查输入");
                }
            });
        }
    }

    $scope.cancelBatchAdd = function () {
        $location.url("/angular/ServiceGroup");
    };
}]);