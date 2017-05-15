angular.module("sltcApp")
.controller("mainCtrl", ['$scope', '$state',  '$location', '$stateParams', 'cloudAdminUi', '$http', 'resourceFactory', '$filter', '$q', 'utility',
    function ($scope, $state, $location, $stateParams, cloudAdminUi, $http, resourceFactory, $filter, $q, utility) {
        //$location.url("/angular");//浏览器刷新默认回到主页,因为需要重新加载数据

        $scope.homePageMenu = {
            MenuName: "首页",
            ModuleName:"首页",
            Url:"HomePage"
        };

        //-------菜单UI事件控制----开始
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

        $scope.homePageClick = function () {
            $scope.$root.currentMenu = $scope.homePageMenu;
            $state.go("HomePage");
        }
       

        $scope.subMenuClick = function ($event, menu) {
            //必须所有数据加载完成才能点击
            $scope.$root.currentMenu = menu;
            $state.go(menu.Url);
            //var id = menu.FunctionID;
            //var name = menu.FunctionName;
            //var uri = "/angular/"+menu.Url;
            //var closable = true;
            //var item = { 'id': id, 'name': name, 'url': uri, 'closable': closable };
            //closableTab.addTab(item);
        }

        $scope.active = function (menu) {
            if ($scope.$root.currentMenu != null & menu != null && $scope.$root.currentMenu.ModuleName === menu.MenuName) {
                return true;
            }
            else {
                return false;
            }
        }

        $scope.activeSub = function (menu) {
            if ($scope.$root.currentMenu != null & menu != null && $scope.$root.currentMenu.Url === menu.Url) {
                return true;
            }
            else {
                return false;
            }
        }
        
        $scope.init = function () {
            $scope.$root.user = utility.getUserInfo();
            $scope.$root.user.RoleName = "";
            resourceFactory.getResource("roles").query(function (functions) {
                $scope.InitMenus(functions);
                $scope.$root.MyMenus = $scope.menus;
            });
            if (window.loading) {
                $scope.isInitialized = true;
                window.loading.finish();
            }
            if ($scope.$root.user.IsAdmin) {
                $scope.$root.user.RoleName = "超级管理员";
            } else {
                if ($scope.$root.user.RoleId != 0) {
                    resourceFactory.getResource("roles").get({ id: $scope.$root.user.RoleId }, function (data) {
                        if (data.IsSuccess) {
                            $scope.$root.user.RoleName = data.Data.RoleName;
                        }
                    });
                }
            }

            resourceFactory.getResource("orgs").get({ 'Data.OrgIds': $scope.$root.user.OrgIds, 'pageSize': 0 }, function (data) {
                $scope.GroupOrgList = data.Data;
            });
            resourceFactory.getResource("groups").get({ 'Data.GroupId': $scope.$root.user.GroupId, 'pageSize': 0 }, function (data) {
                $scope.GroupName = data.Data[0].GroupName;
            });           
        }

        $scope.InitMenus = function (functions) {
            $scope.menus = [];
            var modules = $filter("unique")(functions, "ModuleName");
            angular.forEach(modules, function (item) {
                $scope.menus.push({
                    icon: "icon-system",
                    MenuName: item.ModuleName,
                    Functions: $filter('filter')(functions, { ModuleName: item.ModuleName, IsIndependent: true }, true) //根据ModuleName筛选
                });
            });
        }

        $scope.selectOrg = function (orgId) {
            $scope.$root.user.OrgId = orgId;
            if (angular.isDefined($state.current.controller)) {
                $state.transitionTo($state.current, $stateParams, {
                    reload: true,
                    inherit: false,
                    notify: true
                });
            }
            $.ajax({
                type: "GET",
                url: "/Home/ChangeOrg",
                data: "orgId=" + orgId,
                success: function (msg) {
                }
            });
        }

        //登出
        $scope.logout = function () {
            window.location = "/Home/Logout";
        }

        $scope.init();

        $scope.homePageClick();

    }])