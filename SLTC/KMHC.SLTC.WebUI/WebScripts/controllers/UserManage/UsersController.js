/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("userListCtrl", ['$scope', '$http', '$location', '$state', '$q', 'utility', 'resourceFactory', function ($scope, $http, $location, $state, $q, utility, resourceFactory) {

    var usersApi = resourceFactory.getResource('users');
    $scope.isCanDo =$scope.user.IsGroupAdmin;
    $scope.Data = {
        Users: []
    };

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: usersApi,//异步请求的res
        params: { 'Data.UserName': "" },
        success: function (data) {//请求成功时执行函数
            $scope.Data.Users = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }


    $scope.UserDelete = function (item) {
        utility.confirm("您确定删除该用户信息吗?", function (result) {
            if (result) {
                usersApi.delete({ id: item.UserID }, function (data) {
                    $scope.options.search();
                });
            }
        });
    }

    $scope.init();
}])
.controller("userEditCtrl", ['$scope', '$state', '$stateParams', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, utility, resourceFactory) {
    var usersApi = resourceFactory.getResource('users');
    var roleRes = resourceFactory.getResource('roles');
    var empRes = resourceFactory.getResource("employees");

    $scope.isCanDo = $scope.user.IsGroupAdmin;

    //选择员工
    $scope.staffSelected = function (item) {
        $scope.Data.User.Employee = item;
        $scope.Data.User.DisplayName = item.EmpName;
    }
    $scope.InitUser = function (emp) {
        $scope.Data = {
            User: {},
            Roles: []
        };
        $scope.Data.User.Employee = emp;
        //初始化角色列表
        roleRes.QueryRoles({ currentPage: 1, pageSize: 1000 }, function (result) {
            $scope.Data.Roles = result.Data;
        });
        if (emp.EmployeeID) {
            empRes.GetUserByEmployeeID({ employeeID: emp.EmployeeID }, function (data) {
                if (data.Data) {
                    $scope.Data.User = data.Data;
                    $scope.Data.User.Password = null;
                } else {
                    $scope.Data.User.DisplayName = emp.EmpName;
                }
            });
        }
    }


    $scope.save = function () {
        var obj = {
            AccountName: $scope.Data.User.AccountName,
            DisplayName: $scope.Data.User.DisplayName
        };
        if ($scope.Data.User.Role) {
            if ($scope.Data.User.Role.RoleID) {
                obj.RoleId = $scope.Data.User.Role.RoleID;
            }            
        }
        if ($scope.user.GroupId) {
            obj.GroupID = $scope.user.GroupId;
        }
        //如果是从集团列表过来的 就是添加集团管理员了
        if ($stateParams.GroupID && $scope.user.IsAdmin) {
            obj.RoleId = 6;
            obj.GroupID = $stateParams.GroupID;

        } else if ($scope.user.IsGroupAdmin) {
            obj.RoleId = 7;                     
        }       
        if ($scope.Data.User.Employee && $scope.Data.User.Employee.EmployeeID) {
            obj.Employee = { EmployeeID: $scope.Data.User.Employee.EmployeeID }
        }
        if ($scope.Data.User.confirmPassword && $scope.Data.User.Password && $scope.Data.User.Password != '') {
            if ($scope.Data.User.Password !== $scope.Data.User.confirmPassword) {
                utility.message("两次密码输入不一致");
                return false;
            }
            obj.Password = $scope.Data.User.Password;
        } else
            if ($scope.Data.User.Password && $scope.Data.User.Password != '') {
                obj.Password = $scope.Data.User.Password;
            }

        if ($scope.Data.User.UserID) {
            obj.UserID = $scope.Data.User.UserID;
        }
        if ($stateParams.orgID) {
            obj.OrganizationID = $stateParams.orgID;
        }
        usersApi.save(obj, function (data) {
            if (data) {
                if (data.IsSuccess) {
                    utility.message("登录用户信息设置成功");
                    $scope.$emit("SavedUser");
                } else {
                    utility.message(data.ResultMessage);
                }
            }
        });
    }
    $scope.$on("OpenUserEdit", function (event, emp) {
        $scope.InitUser(emp);
    });
}]);
