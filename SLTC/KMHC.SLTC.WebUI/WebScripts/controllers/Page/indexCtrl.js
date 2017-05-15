angular.module("sltcApp")
//userService 暂时不改，首页菜单生成已经改用新的方法了
.controller("menuCtr", ['$scope', '$state', '$location', 'cloudAdminUi', 'userService', 'funcRes', function ($scope, $state, $location, cloudAdminUi, userService, funcRes) {

    $scope.init = function () {
        
        userService.currentUser.UserInfo.then(function (curUser) {
            $scope.currentUser = curUser;
            if ($scope.currentUser.Roles.length > 0) {
                for (var i = $scope.currentUser.Roles.length - 1; i > -1 && !$scope.super; i--) {
                    $scope.super = ($scope.currentUser.Roles[i] == "R000");
                }
            }
            var arr = [] ,i = 0, j = 0, k = 0;
            if ($scope.super) {
                var menuObj = {};
                funcRes.query({IsIndependent:true}, function (menus) {
                    var menusTemp = [], mTmp = {};
                    $.each(menus, function (p,item) {
                        if (!mTmp[item.ModuleName]) {
                            mTmp[item.ModuleName] = [];
                        } 
                        mTmp[item.ModuleName].push(item);
                        //menusTemp.push();
                        //if (k < 2) arr.push($.extend(item, { ModuleName: item.FunctionName, SuperModuleId: i.toString(), Sort: j }));
                    });

                    for (var item in mTmp) {
                        ++i;
                        menusTemp.push({ ModuleName: item, ModuleId: i.toString(), SuperModuleId: '00', Url: "" });
                        $.each(mTmp[item], function (q, its) {
                            menusTemp.push($.extend(its, { ModuleName: its.FunctionName, SuperModuleId: i.toString(), Sort: ++j }));
                            if ((++k) < 2) arr.push($.extend(its, { ModuleName: its.FunctionName, SuperModuleId: i.toString(), Sort: j }));
                        });
                    }

                    $scope.menus = menusTemp;
                    if (arr.length > 0) {
                        $scope.selectMent = arr[0];
                    }
                    cloudAdminUi.handleSidebar();
                });
                
            } else {
                userService.currentUser.UserMenus.then(function (menus) {
                    var m = [];
                    $.each(menus, function (i,item) {
                        m.push({ ModuleName: item.Name, ModuleId: i.toString(), SuperModuleId: '00', Url: "" })
                        if (item.Functions.length > 0) {
                            $.each(item.Functions, function (j, it) {
                                m.push($.extend(it, { ModuleName: it.FunctionName, SuperModuleId: i.toString(), Sort: it.Sort }));
                            });
                        }
                    });
                    $scope.menus = m;
                    $scope.selectMent = null;
                    $scope.super = false;
                    var arr = $.grep($scope.menus, function (item, i) {
                        if (item.Target == "2") {
                            if (item.Url && item.Url != null) {
                                var url = encodeURI(item.Url);
                                return $location.$$url.indexOf(url) > -1;
                            } else {
                                return false;
                            }
                        }
                        else {
                            var url = "";
                            var stateName = "";
                            if (item.Url && item.Url != null) {
                                var stateArr = item.Url.split(".");
                                $.each(stateArr, function (i, item) {
                                    stateName = stateName != "" ? stateName + "." + item : item;
                                    var p = $state.get(stateName);
                                    if (p != null) {
                                        url = url + p.url;
                                    }
                                });
                            }
                            if (url != "") {
                                url = encodeURI(url.replace(":id", ""));
                                return url != null && $location.$$url.indexOf(url) > -1;
                            }
                            else {
                                return false;
                            }
                        }
                    });
                    if (arr.length > 0) {
                        $scope.selectMent = arr[0];
                    }
                    cloudAdminUi.handleSidebar();
                });
            }
           
        });
    }

    $scope.displayblock = {
        "display": "block"
    }

    $scope.displaynone = {
        "display": "none"
    }

    var getTarget = function (t) {
        if (t.tagName === "A") {
            return t;
        } else {
            return $(t).parent();
        }
    }

    $scope.init();

    $scope.menuClick = function ($event) {
        var target = getTarget($event.target);//$event.target.closest("a");
        var last = $('.has-sub.open', $('.sidebar-menu'));
        last.removeClass("open");
        $('.arrow', last).removeClass("open");
        $('.sub', last).slideUp(200);
        var thisElement = $(target);
        var slideOffeset = -200;
        var slideSpeed = 200;

        var sub = $(target).next();
        if (sub.is(":visible")) {
            $('.arrow', $(target)).removeClass("open");
            $(target).parent().removeClass("open");
            sub.slideUp(slideSpeed, function () {
                if ($('#sidebar').hasClass('sidebar-fixed') === false) {
                    App.scrollTo(thisElement, slideOffeset);
                }
                cloudAdminUi.handleSidebarAndContentHeight();
            });
        } else {
            $('.arrow', jQuery(target)).addClass("open");
            $(target).parent().addClass("open");
            sub.slideDown(slideSpeed, function () {
                if ($('#sidebar').hasClass('sidebar-fixed') === false) {
                    App.scrollTo(thisElement, slideOffeset);
                }
                cloudAdminUi.handleSidebarAndContentHeight();
            });
        }
    }

    $scope.subMenuClick = function ($event, url, way) {
        var target = getTarget($event.target);//$event.target.closest("a");
        jQuery(target).parent().parent().children(".active").removeClass("active");
        jQuery(target).parent().addClass("active");
        if (way === '1') {
            $state.go(url, { id: 0 });
        } else if (way === '2') {
            $location.url(url);
        } else {
            $state.go(url);
        }
    }

    $scope.active = function (menu) {
        if ($scope.selectMent != null && ($scope.selectMent.Url == menu.Url || $scope.selectMent.SuperModuleId == menu.ModuleId)) {
            return true;
        }
        else {
            return false;
        }
    }
}])
.controller("indexPageCtrl", ['$scope', '$state', '$location', 'cloudAdminUi', 'taskRes', 'serviceOrderRes', 'utility',
    function ($scope, $state, $location, cloudAdminUi, taskRes, serviceOrderRes, utility) {
        $scope.CurrentTasks = [];
        $scope.init = function () {
            $scope.UserEmp = $scope.$root.user.Employee;
            taskRes.query({}, function (data) {
                if (data && data.length > 0) {
                    $scope.Tasks = data;
                    serviceOrderRes.query({}, function (orderData) {
                        $scope.Orders = orderData;
                        angular.forEach($scope.Tasks, function (parent, index1) {
                            var parentId = parent.SONo;
                            angular.forEach(orderData, function (child, index2) {
                                if (child.SONo == parentId) {
                                    $scope.Tasks[index1].orderItem = {};
                                    $scope.Tasks[index1].orderItem = child;
                                }
                            });
                        });
                    });

                    angular.forEach($scope.Tasks, function (obj, i) {
                        if (obj.EmployeeNo === $scope.UserEmp.EmpNo) {
                            if (obj.Status > 0 && obj.Status < 3) {
                                $scope.CurrentTasks.push(obj);
                            }
                        }
                    });
                }

            });
        };

        $scope.init();
    }]);