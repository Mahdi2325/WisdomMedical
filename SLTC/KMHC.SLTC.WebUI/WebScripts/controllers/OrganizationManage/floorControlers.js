/*
 * 创建人: 刘承（Alex.Liu）
 *
 * 创建日期:2016-05-17
 *
 * 说明:楼层管理
 *
 *
 */

angular.module("sltcApp")
    .controller("floorListCtrl", ['$scope', '$http', '$location', 'floorRes', 'orgRes', 'utility', function ($scope, $http, $location, floorRes, orgRes, utility) {

        $scope.Data = {};
        $scope.Data.Floors = [];
        //查询选项
        $scope.options = {};
        $scope.options.params = {};


        //查询所有
        $scope.init = function () {
            floorRes.query({}, function (data) {
                $scope.Data.Floors = data;
            });

            orgRes.query({}, function (orgs) {
                $scope.Data.Orgs = orgs;
            });
        }

        //查询
        $scope.options.search = function () {
            $scope.Data.Floors.length = 0;
            floorRes.query({}, function (data) {
                if ($scope.options.params.floorName == undefined || $scope.options.params.floorName == "") {
                    $scope.Data.Floors = data;
                    return false;
                }
                angular.forEach(data, function (obj, index) {
                    if (obj.FloorName == $scope.options.params.floorName) {
                        $scope.Data.Floors.push(obj);
                    }
                });
            });
        };
        //删除单项
        $scope.delete = function (id) {
            utility.confirm("确定删除该楼层信息吗?", function (result) {
                if (result) {
                    floorRes.delete({ id: id }, function (data) {
                        $scope.options.pageInfo.CurrentPage = 1;
                        $scope.options.search();
                        utility.message("刪除成功");
                    });
                }
            });

        };

        $scope.init();
    }])
    .controller("floorEditCtrl", ['$scope', '$http', '$location', '$stateParams', 'orgRes', 'floorRes', function ($scope, $http, $location, $stateParams, orgRes, floorRes) {

        $scope.init = function () {
            $scope.Data = {};
            $scope.Data.Floor = {};
            $scope.Data.Orgs = {};

           
            orgRes.query({}, function (data) {
                $scope.Data.Orgs = data;
            });

            if ($stateParams.id) {
                floorRes.get({ id: $stateParams.id }, function (data) {
                    $scope.Data.Floor = data;
                });
                $scope.isAdd = false;
            } else {
                $scope.isAdd = true;
            }
        };

        $scope.submit = function () {
            floorRes.save($scope.Data.Floor, function (data) {
                $location.url("/angular/FloorList");
            });
        };
        $scope.init();
    }]);