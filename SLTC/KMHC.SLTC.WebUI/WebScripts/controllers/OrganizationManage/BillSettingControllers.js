/*
创建人: 刘承
创建日期:2016-05-20
说明:费用设定
*/

angular.module("sltcApp")
    .controller("billSettingListCtrl", ['$scope', '$http', '$location', '$state', 'billSettingRes', 'utility', function ($scope, $http, $location, $state, billSettingRes, utility) {
        $scope.Data = {};
        $scope.Data.BillSettings = {};

        //查询选项
        $scope.options = {};
        $scope.options.params = {};

        //查询所有
        $scope.init = function () {
            billSettingRes.query({}, function (data) {
                $scope.Data.billSettings = data;
            });
        };
        
        $scope.delete = function (id) {
            utility.confirm("确定删除该费用设定信息吗?", function (result) {
                if (result) {
                    billSettingRes.delete({ id: id }, function (data) {
                        if (data.$resolved) {
                            var whatIndex = null;
                            angular.forEach($scope.Data.BillSettings, function (cb, index) {
                                if (cb.id === id) {
                                    whatIndex = index;
                                }
                            });
                            $scope.Data.BillSettings.splice(whatIndex, 1);
                            utility.message("刪除成功");
                        }
                    });
                }

            });
        };

        //查询
        $scope.options.search = function () {
            $scope.Data.billSettings.length = 0;
            billSettingRes.query({}, function (data) {
                if ($scope.options.params.orgNo == undefined || $scope.options.params.orgNo == "") {
                    $scope.Data.billSettings = data;
                    return false;
                }
                angular.forEach(data, function (obj, index) {
                    if (obj.OrgNo == $scope.options.params.orgNo) {
                        $scope.Data.billSettings.push(obj);
                    }
                });
            });
        };

        //删除
        $scope.search = $scope.reload = function () {
            if ($scope.keyword) {
                deptRes.query({ Code: $scope.keyword }, function (data) {
                    $scope.Data.BillSettings = data;
                });
            }
        };

        //初始化
        $scope.init();
    }])
    .controller("billSettingEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'billSettingRes', 'orgRes', function ($scope, $location, $stateParams, utility, billSettingRes, orgRes) {

        $scope.init = function () {
            var curUser = utility.getUserInfo();
            $scope.Data = {};

            $scope.Info = {};
            $scope.Info.Org = {};
            orgRes.query({}, function (data) {
                $scope.Data.Orgs = data;
            });

            if ($stateParams.id) {
                billSettingRes.get({ id: $stateParams.id }, function (data) {
                    $scope.Data.BillSetting = data;
                    angular.forEach($scope.Data.Orgs, function (d, index) {
                        if (d.OrgNo === data.OrgNo) {
                            console.log(d);
                            $scope.Info.Org = d;
                            return false;
                        }
                    });
                });
                $scope.isAdd = false;
            } else {
                $scope.isAdd = true;
                $scope.Data.BillSetting = { OrgNo: curUser.OrgNo }
            }

            

        };

        $scope.save = function () {
            billSettingRes.save($scope.Data.BillSetting, function (data) {
                $location.url("/angular/BillSettingList");
            });
        };
        $scope.init();
    }]);