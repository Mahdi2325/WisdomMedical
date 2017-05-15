/*
创建人:刘承（Alex）
创建日期:2016-05-16
说明: 集团管理
*/
angular.module("sltcApp")
.controller("groupListCtrl", ['$scope', '$http', '$location', '$state', 'utility', 'resourceFactory', function ($scope, $http, $location, $state, utility, resourceFactory) {
    $scope.Groups = [];
    //查询参数
    $scope.oparams = {};
    //资源初始化
    var groupRes = resourceFactory.getResource("groups");

    $scope.isCanDo = $scope.user.IsAdmin;
    //初始化
    $scope.init = function () {
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: groupRes,//异步请求的res
            params: { 'Data.GroupName': "" },
            success: function (data) {//请求成功时执行函数              
                $scope.Groups = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        };
    };
    //删除
    $scope.Delete = function (item) {
        utility.confirm("您确定删除该集团信息吗?", function (result) {
            if (result) {
                groupRes.delete({ id: item.GroupID }, function (data) {
                    utility.message(item.GroupName + " 集团信息删除成功.");
                    $scope.Groups.splice($scope.Groups.indexOf(item), 1);
                    $scope.options.search();
                });
            }
        });
    }
    $scope.init();
}])
.controller("groupEditCtrl", ['$scope', '$http', '$location', '$state', '$stateParams', '$timeout', 'utility', 'resourceFactory', function ($scope, $http, $location, $state, $stateParams, $timeout, utility, resourceFactory) {
    //操作对象
    $scope.Group = {};

    //资源初始化
    var groupRes = resourceFactory.getResource("groups");

    //选择对象初始化
    $scope.init = function () {
        if ($stateParams.id) {
            groupRes.get({ id: $stateParams.id }, function (data) {
                $scope.Group = data.Data;
                $scope.AddressDetail = data.Data.City + data.Data.Address;              
                $timeout(function () {
                    $("#myAddress1").citypicker("refresh");
                }, 1);
            });
        } else {

            var codeRuleRes = resourceFactory.getResource("codeRules");

            codeRuleRes.get({
                "CodeKey": "GroupCode",
                "GenerateRule": "None",
                "Prefix": "G",
                "SerialNumberLength": 4,
                "OrganizationID": $scope.$root.user.OrgId
            }, function (data) {
                $scope.Group.GroupNo = data.Data;
            });
        }
    };
    //编辑保存操作
    $scope.save = function () {
        $scope.Group.City = "";
        $scope.Group.Address = "";
        var vals = $("#myAddress1").val();
        if (vals != "") {
            var lastIndex = vals.lastIndexOf("-");
            $scope.Group.City = vals.substring(0, lastIndex + 1);
            $scope.Group.Address = vals.substring(lastIndex + 1, vals.length);
        }
        groupRes.save($scope.Group, function (data) {
            utility.message($scope.Group.GroupName + " 集团信息编辑成功.");
            $location.url('/angular/GroupList');
        });
    }

    $scope.init();
}]);



