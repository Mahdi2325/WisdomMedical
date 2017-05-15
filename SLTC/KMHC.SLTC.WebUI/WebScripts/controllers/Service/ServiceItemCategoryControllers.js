
angular.module("sltcApp")
.controller("ServiceItemCategoryListCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var serviceItemCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");

    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: serviceItemCategoryRes,//异步请求的res
        params: { 'Data.keyWords': "" },
        success: function (data) {//请求成功时执行函数
            $scope.serviceitemcategoryList = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                serviceItemCategoryRes.delete({ id: item.ServiceItemCategoryID }, function () {
                    $scope.options.search();
                    utility.message("刪除成功");
                    //$scope.init();
                });
                return false;
            }
        });
    };

    $scope.ServiceTypeEdit = function (item) {
        $scope.$broadcast('OpenServiceTypeEdit', item);
    }

    $scope.$on('SavedServiceType', function (e, data) {
        $('#modalServiceTypeEdit').modal('hide');
        $scope.options.search();
    });
}])
.controller("ServiceitemcategoryEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, utility, resourceFactory) {
    var serviceItemCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
    $scope.InitServiceType = function (item) {
        $scope.prePostData = {};
        if (item) {
            $scope.isAdd = false;
            $scope.curItem = item;
        } else {
            $scope.isAdd = true;
            $scope.curItem = {};
            var codeRuleRes = resourceFactory.getResource("codeRules");

            codeRuleRes.get({
                "CodeKey": "ServiceItemCategoryCode",
                "GenerateRule": "None",
                "Prefix": "SC",
                "SerialNumberLength": 2
            }, function (data) {
                $scope.curItem.SICNo = data.Data;
            });
        }
    };

    $scope.SaveOrEdit = function (item) {

        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }

        serviceItemCategoryRes.save(item, function () {
            utility.message("保存成功");
            $scope.$emit("SavedServiceType");
        });
    };

    $scope.$on("OpenServiceTypeEdit", function (event, item) {
        $scope.InitServiceType(item);
    });
}])

.controller("sicategoryBatchAdd", ['$scope', '$filter', '$http', '$location', '$stateParams', 'utility', 'resourceFactory',
        function ($scope, $filter, $http, $location, $stateParams, utility, resourceFactory) {
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

                    var SICategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
                    //var orgRes = resourceFactory.getResource("orgs");

                    SICategoryRes.get({ "Data": {}, "CurrentPage": 1, "PageSize": 1000 }, function (SICategorys) {

                        if (angular.isArray($scope.items)) {
                            //解析成功
                            angular.forEach($scope.items, function (e) {

                                if (angular.isDefined(e.SICNo)//区域编号,必须
                                    && angular.isDefined(e.SICName)//区域名称,必须
                                    && '' != e.SICNo.trim()
                                    && '' != e.SICName.trim()
                                    ) {
                                    //TODO 如果已经存在的不添加,对接真实服务器后不用再判断
                                    //var SICategory = $filter('filter')(SICategorys, { SICNo: e.SICNo })[0];
                                    //if (angular.isDefined(SICategory)) {
                                    if ($.grep(SICategorys.Data, function (bp) { return bp.SICNo == e.SICNo; }).length > 0) {
                                        log.error(e.SICNo + " " + e.SICName + "已存在");
                                    } else {
                                        SICategoryRes.save({
                                            SICNo: e.SICNo,
                                            SICName: e.SICName,
                                            Remark: e.Remark
                                        }, function () {
                                            log.info(e.SICNo + " " + e.SICName + " 添加成功");
                                        }, function (error) {
                                            //TODO 对接真实服务器要加返回错误的处理
                                        });

                                    }

                                } else {
                                    log.error(e.SICName + " 信息不完整,被丢弃");
                                }
                            });
                        } else {
                            log.error("录入数据非JSON数组格式,请检查输入");
                        }


                    });
                }
            }
        }]);