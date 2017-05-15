/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("acountSetCtrl", ['$scope', '$http', '$state', '$stateParams', '$location', 'resourceFactory', 'utility',
    function ($scope, $http, $state, $stateParams, $location, resourceFactory, utility) {

    var userRes = resourceFactory.getResource("users");

    $scope.Data = {};
    $scope.Data.User = {};

    $scope.oldPassword = "";
    $scope.init = function () {
        userRes.get({ id: $scope.$root.user.UserId }, function (data) {
            $scope.Data.User = data.Data;
            $scope.oldPassword = $scope.Data.User.Password;
            $scope.Data.User.Password = "";
            $scope.Data.User.NewPassword = "";
            $scope.Data.User.Repet = "";
        });
    }

    $scope.init();

    $scope.save = function () {
        //var userName = $scope.Data.User.username;
        //var nick = $scope.Data.User.DisplayName;
        //var oldPassword = $scope.Data.User.password;
        //var newPassword = $scope.Data.User.NewPassword;
        //var repet = $scope.Data.User.Repet;

        if ($scope.Data.User.NewPassword != $scope.Data.User.Repet) {
            utility.message("两次密码输入不一致");
            return false;
        }
      
        $.ajax({
            type: "POST",
            url: "/Home/CheckPwd",
            data: { name: $scope.Data.User.AccountName, pwd: $scope.Data.User.Password},
            success: function (data) {
                if (!data.Ok) {
                    utility.message("原密码匹配失败");
                    return false;
                } else {
                    $scope.Data.User.Password = $scope.Data.User.NewPassword;
                    userRes.save($scope.Data.User, function (obj) {
                        $location.url('/');
                        utility.message('密码修改成功');
                    });
                }
            }
        });



        //$http.post(authenticateUrl, {
        //    username: userName,
        //    password: oldPassword
        //}, {
        //    withCredentials: true
        //}).success(function (data) {
        //    $scope.Data.User.password = newPassword;
        //    userRes.save($scope.Data.User, function (obj) {
        //        $location.url('/');
        //        utility.message('密码修改成功');
        //    });
        //}).error(function (error) {
        //    utility.message("原密码匹配失败");
        //    return false;
        //});
     
    }

}])

