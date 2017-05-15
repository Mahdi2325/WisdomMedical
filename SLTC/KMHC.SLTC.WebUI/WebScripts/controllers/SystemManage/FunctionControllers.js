///创建人:郝元彦
///创建日期:2016-06-27
///说明:系统功能点维护
angular.module("sltcApp")
.controller("functionBatchAddCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, utility, resourceFactory) {

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

    $scope.saveFunctionBatch = function () {
        if (angular.isDefined($scope.content)) {

            try {
                $scope.items = angular.fromJson($scope.content);
            } catch (ex) {
                //$scope.log = "解析失败,请输入正确的JSON格式";
                log.error("解析失败,请输入正确的JSON格式");
            }

            var functionRes = resourceFactory.getResource("functions");

            if (angular.isArray($scope.items)) {
                //解析成功
                angular.forEach($scope.items, function (e) {

                    if (angular.isDefined(e.FunctionNo)//功能点编号,必须
                        && angular.isDefined(e.FunctionName)//功能点名称,必须
                        && angular.isDefined(e.Url)//功能点URL,必须
                        && angular.isDefined(e.ModuleName//模块名称,必须
                        )) {


                        //TODO 如果已经存在的不添加,对接真实服务器后不用再判断
                        functionRes.get({ 'Data.FunctionNo': e.FunctionNo }).$promise.then(function (result) {
                            if (result.RecordsCount > 0) {
                                log.error(e.FunctionNo + " " + e.FunctionName + "已存在");
                            } else {
                                functionRes.save({
                                    FunctionNo: e.FunctionNo.trim(),
                                    FunctionName: e.FunctionName.trim(),
                                    Url: e.Url,
                                    ModuleName: e.ModuleName,
                                    Description: e.Description,
                                    IsIndependent: e.IsIndependent == '是',
                                    Remark: e.Remark
                                }, function () {
                                    //utility.message(e.FunctionNo + " " + e.FunctionName + " 添加成功");
                                    log.info(e.FunctionNo + " " + e.FunctionName + " 添加成功");
                                }, function (error) {
                                    //TODO 对接真实服务器要加返回错误的处理
                                });
                            }
                        });

                    } else {
                        //utility.message(e.FunctionName + " 信息不完整,被丢弃");
                        log.error(e.FunctionName + " 信息不完整,被丢弃");
                    }
                });
            } else {
                //utility.alert("录入数据非JSON数组格式,请检查输入");
                log.error("录入数据非JSON数组格式,请检查输入");
            }
        }
    }

}])
.controller("FunctionsCtrl", ['$scope', '$http', '$location', '$state', 'resourceFactory', 'utility', function ($scope, $http, $location, $state, resourceFactory, utility) {
    var functionRes = resourceFactory.getResource("functions");
    $scope.Data = {};
    $scope.Functions = [];

    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: functionRes,//异步请求的res
        params: { 'Data.keyWords': "" },
        success: function (data) {//请求成功时执行函数
            $scope.Functions = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    //删除
    $scope.delete = function (id) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                functionRes.delete({ id: id }, function (data) {
                    $scope.options.search();
                    utility.message("刪除成功");
                });
            }
        });

    };
}])
.controller("FunctionEditCtrl", ['$scope', '$location', '$stateParams', '$state', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, $state, utility, resourceFactory) {
    var functionRes = resourceFactory.getResource("functions");
    $scope.Functions = {};

    if ($stateParams.id) {
        functionRes.get({ id: $stateParams.id }, function (data) {
            if (data) {
                $scope.Functions = data.Data;
            } else {
                utility.message($stateParams.id + "无效！");
                $state.go('Functions');
            }

        });
    }
    else {
        $scope.Functions = {};
    }



    $scope.saveFunction = function () {
        functionRes.save($scope.Functions, function (data) {
            $state.go('Functions');
        });
    }

}])
//TODO 发布版本要拿掉这个ctrl
.controller("removeOrgTotallyCtrl", ['$scope', 'resourceFactory', '$q', function ($scope, resourceFactory, $q) {
    $scope.Data = {
        Groups: [],
        Orgs: [],
        Areas: [],
        Emps: [],
        Users: [],
        ChargeItems: [],
        ServiceCategory: [],
        ServiceItems: [],
        ServiceGroups: [],
        Residents: [],
        PrePayments: [],
        ServiceOrders: [],
        Tasks: [],
        Bills: [],
        ChargeDetails: []
    };


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
        output: function (message) {
            if (angular.isUndefined($scope.output)) {
                $scope.output = '';
            }
            $scope.output += message + '\r\n';
        },
        reset: function () {
            $scope.info = '';
            $scope.error = '';
            $scope.output = '';
        }
    }

    var residentRes = resourceFactory.getResource('residentRes');
    var groupRes = resourceFactory.getResource('groups');
    var orgRes = resourceFactory.getResource("orgs");
    var areaRes = resourceFactory.getResource("area");
    var empRes = resourceFactory.getResource("employees");
    var userRes = resourceFactory.getResource("users");
    var chargeItemRes = resourceFactory.getResource("chargeItemRes");
    var serviceCategoryRes = resourceFactory.getResource("serviceItemCategoryRes");
    var serviceItemRes = resourceFactory.getResource("serviceItemRes");
    var serviceGroupRes = resourceFactory.getResource("serviceGroupRes");
    var prePaymentRes = resourceFactory.getResource("prePaymentRes");
    var serviceOrderRes = resourceFactory.getResource("serviceOrderRes");
    var taskRes = resourceFactory.getResource("tasks");
    var billRes = resourceFactory.getResource("billRes");
    var chargeDetailRes = resourceFactory.getResource("chargeDetailRes");

    $scope.Data.Orgs = orgRes.query();
    $scope.$watch("SelectedItem", function (org) {
        if (angular.isUndefined(org)) return;

        $scope.buttonText = "正在加载,别点我";
        log.reset();


        var promises = [];
        promises.push(areaRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.Areas = results;
            log.output("包含服务区域信息" + results.length + "条");
        }));
        promises.push(groupRes.query({ GroupNo: org.GroupNo }, function (results) {
            $scope.Data.Groups = results;
            log.output("包含集团信息" + results.length + "条");
        }));
        promises.push(empRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.Emps = results;
            log.output("包含员工信息" + results.length + "条");
        }));
        promises.push(userRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.Users = results;
            log.output("包含用户信息" + results.length + "条");
        }));
        promises.push(chargeItemRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.ChargeItems = results;
            log.output("包含收费项目信息" + results.length + "条");
        }));
        promises.push(serviceCategoryRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.ServiceCategory = results;
            log.output("包含服务项目分类信息" + results.length + "条");
        }));
        promises.push(serviceItemRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.ServiceItems = results;
            log.output("包含服务项目信息" + results.length + "条");
        }));
        promises.push(serviceGroupRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.ServiceGroups = results;
            log.output("包含服务套餐信息" + results.length + "条");
        }));
        promises.push(residentRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.Residents = results;
            log.output("包含会员信息" + results.length + "条");
        }));
        promises.push(prePaymentRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.PrePayments = results;
            log.output("包含预收款信息" + results.length + "条");
        }));
        promises.push(serviceOrderRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.ServiceOrders = results;
            log.output("包含服务订单信息" + results.length + "条");
        }));
        promises.push(taskRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.Tasks = results;
            log.output("包含工单信息" + results.length + "条");
        }));
        promises.push(billRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.Bills = results;
            log.output("包含账单信息" + results.length + "条");
        }));

        promises.push(chargeDetailRes.query({ OrgNo: org.OrgNo }, function (results) {
            $scope.Data.ChargeDetails = results;
            log.output("包含费用明细" + results.length + "条");
        }));

        $q.all(promises).then(function () {
            window.setTimeout(function () {
                $scope.buttonText = "让这个机构消失(请温柔一点,此操作无法恢复)";
            }, 2000);
        });
    });

    $scope.removeOrgTotally = function () {
        var promises = [[], [], [], [], [], []];
        //start---------------清除业务数据--------------start
        //清除费用明细
        log.info("正在清除费用明细......");
        angular.forEach($scope.Data.ChargeDetails, function (item) {
            promises[0].push(item.$delete());
        });
        $q.all(promises[0]).then(function () {
            log.info("正在清除费用明细......完成");
        });
        //清除工单
        log.info("正在清除工单......");
        angular.forEach($scope.Data.Tasks, function (item) {
            promises[0].push(item.$delete());
        });
        $q.all(promises[0]).then(function () {
            log.info("正在清除工单......完成");
        });
        //清除工单
        log.info("正在清除账单......");
        angular.forEach($scope.Data.Bills, function (item) {
            promises[0].push(item.$delete());
        });
        $q.all(promises[0]).then(function () {
            log.info("正在清除账单......完成");
        });
        //清除会员信息
        log.info("正在清除会员......");
        angular.forEach($scope.Data.Residents, function (item) {
            promises[0].push(item.$delete());
        });
        $q.all(promises[0]).then(function () {
            log.info("正在清除会员......完成");
        });

        //清楚配置数据
        //批量删除区域
        angular.forEach($scope.Data.Areas, function (item) {
            item.$delete();
            log.info("正在删除区域......" + item.AreaName);
        });
        //批量删除员工
        angular.forEach($scope.Data.Emps, function (item) {
            item.$delete();
            log.info("正在删除员工......" + item.EmpName);
        });
        //批量删除用户
        angular.forEach($scope.Data.Users, function (item) {
            item.$delete();
            log.info("正在删除用户......" + item.username);
        });
        //批量删除收费项目
        angular.forEach($scope.Data.ChargeItems, function (item) {
            item.$delete();
            log.info("正在删除收费项目......" + item.CIName);
        });
        //批量删除服务项目分类
        angular.forEach($scope.Data.ServiceCategory, function (item) {
            item.$delete();
            log.info("正在删除服务项目分类......" + item.SICName);
        });
        //批量删除服务项目
        angular.forEach($scope.Data.ServiceItems, function (item) {
            item.$delete();
            log.info("正在删除服务项目......" + item.SIName);
        });
        //批量删除服务套餐
        angular.forEach($scope.Data.ServiceGroups, function (item) {
            item.$delete();
            log.info("正在删除服务套餐......" + item.SIName);
        });
    }
}])
;