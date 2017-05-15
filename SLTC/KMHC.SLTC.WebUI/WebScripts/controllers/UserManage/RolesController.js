/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 角色信息
*/
angular.module("sltcApp")
.controller("roleListCtrl", ['$scope', '$http', '$location', 'resourceFactory', function ($scope, $http, $location, resourceFactory) {
    var roleRes = resourceFactory.getResource('roles');
    $scope.Data = {};

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: { get: roleRes.QueryRoles },//异步请求的res
        params: { 'Data.RoleName': "" },
        success: function (data) {//请求成功时执行函数
            $scope.Data.Roles = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }


    $scope.RoleDelete = function (item) {
        if (confirm("您确定删除该角色信息吗?")) {
            roleRes.delete({ id: item.RoleID }, function (data) {
                $scope.options.search();
            });
        }
    }

}])
.controller("roleEditCtrl", ['$scope', '$http', '$location', '$stateParams', 'resourceFactory', 'functionRes', function ($scope, $http, $location, $stateParams, resourceFactory, functionRes) {
    var roleRes = resourceFactory.getResource('roles');

    $scope.Data = {};

    roleRes.query({}, function (menus) {
        $scope.Data.DefaultMenus = [];
        if (menus && menus.length > 0) {
            $.each(menus, function () {
                this.Status = false;
            });
            $scope.Data.DefaultMenus = menus;
        }
    });
    if ($stateParams.id) {
        roleRes.get({ id: $stateParams.id }, function (data) {
            if (data.Data) {
                $scope.Data.Role = data.Data;
            }
        });
    }
    else {
        $scope.Data.Role = {};
        $scope.Data.Role.Status = true;
        $scope.Data.Role.MenuItems = [];
    }

    $scope.saveRole = function () {
        var compare = function (a, b) {
            return a.Sort - b.Sort;
        }

        if ($scope.Data.Role.MenuItems && $scope.Data.Role.MenuItems.length > 0) {
            $scope.Data.Role.MenuItems.sort(compare);
            $.each($scope.Data.Role.MenuItems, function () {
                var cp = this;
                delete cp.edit;
                if (cp.Functions && cp.Functions.length > 0) {
                    cp.Functions.sort(compare);
                    $.each(cp.Functions, function () {
                        delete this.edit;
                    });
                }
            });
        }

        roleRes.save($scope.Data.Role, function (data) {
            if ($scope.Data.Role.RoleName) {
                $location.url('/angular/RoleList');
            }
        });
    }

    $scope.addMenus = function () {
        if (!$scope.Data.Role.MenuItems) { $scope.Data.Role.MenuItems = []; }
        $scope.Data.Role.MenuItems.push({ edit: true, Sort: 0 });
    };

    $scope.addChild = function (obj) {
        var selectMenu = [];
        $.each($scope.Data.DefaultMenus, function () {
            if (this.Status) {
                this.Status = false;
                selectMenu.push({ FunctionID: this.FunctionID, OrderSeq: 0, MenuID: obj.MenuID, MenuName: this.FunctionName });
            }
        });
        if (selectMenu.length > 0) {
            if (!obj.Functions) {
                obj.Functions = [];
            }
            $.each(selectMenu, function () {
                var sm = this;
                var exist = false;
                $.each(obj.Functions, function () {
                    if (this.FunctionID === sm.FunctionID) {
                        exist = true;
                    }
                });
                if (!exist) {
                    obj.Functions.push(sm);
                }
            });
        } else {
            alert("请先选择功能菜单");
        }

    };

    $scope.edit = function (obj) {
        obj.edit = true;
    };

    $scope.saveMenuItems = function (obj) {
        if (obj.MenuName && obj.MenuName !== "" && obj.OrderSeq != undefined) {
            obj.edit = false;
        }
    };

    $scope.saveFunction = function (obj) {
        if (obj.MenuName && obj.MenuName !== "" && obj.OrderSeq != undefined) {
            obj.edit = false;
        }
    };

    $scope.delete = function (arr, obj) {
        arr.splice($.inArray(obj, arr), 1);
    };


}])
//批量添加角色 郝元彦 2016-6-30
.controller("roleBatchAddCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', '$filter', '$q', function ($scope, $location, $stateParams, utility, resourceFactory, $filter, $q) {
    $scope.Data = {
        Functions: [],//已有功能列表
        Roles: []//角色列表
    }
    var promises = [];

    //控制日志显示
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


    var roleRes = resourceFactory.getResource("roles");

    //必须依赖的数据放在约定列表里面加载完
    promises.push(roleRes.query({}, function (results) {
        $scope.Data.Functions = results;
        debugger;
    }));//获取所有功能点列表

    //约定全部完成后再开始主体功能
    $q.all(promises).then(function () {
        $scope.saveRoleBatch = function () {
            log.reset();//清空日志
            if (angular.isDefined($scope.content)) {
                try {
                    $scope.items = angular.fromJson($scope.content);
                } catch (ex) {
                    log.error("解析失败,请输入正确的JSON格式");
                }

                if (angular.isArray($scope.items)) {
                    //解析成功
                    angular.forEach($scope.items, function (e) {

                        if (angular.isDefined(e.RoleNo)//角色编号,必须
                            && angular.isDefined(e.RoleName)//角色名称,必须
                            ) {

                            var menuItems = [{ "MenuName": "我的菜单", "Functions": [] }];
                            angular.forEach(e.MenuItems.split(','), function (value, key) {
                                if ('' == value.trim()) return;//如果为空跳出
                                var menu = $filter('filter')($scope.Data.Functions, { FunctionName: value }, true)[0];//根据FunctionName筛选出菜单,加参数true精确匹配,模糊匹配如果名称前几个字重合就有问题
                                if (angular.isDefined(menu)) {
                                    menu.OrderSeq = key + 1;//字符串中的位置即是排序
                                    menu.DisplayName = (key + 1) + "." + value;//显示成 1.XXX 2.xxx的格式
                                    menu.MenuName = menu.FunctionName;
                                    menuItems[0].Functions.push(menu);
                                }
                            });
                            debugger;
                            roleRes.save({
                                RoleNo: e.RoleNo.trim(),
                                RoleName: e.RoleName.trim(),
                                Description: e.Description,
                                MenuItems: menuItems
                            }, function (json) {
                                if (json) {
                                    if (json.IsSuccess) {
                                        log.info(e.RoleNo + " " + e.RoleName + " 添加成功");
                                    } else {
                                        log.info(json.ResultMessage);
                                    }
                                }
                            }, function (error) {

                            });

                        } else {
                            log.error(e.FunctionName + " 信息不完整,被丢弃");
                        }
                    });
                } else {
                    log.error("录入数据非JSON数组格式,请检查输入");
                }
            }
        }
    });

}])
;
