/*
 * 创建人: 刘承（Alex.Liu）
 *
 * 创建日期:2016-05-17
 *
 * 说明:房间管理
 *
 *
 */

angular.module("sltcApp")
    .controller("roomListCtrl", ['$scope', '$http', '$location', 'roomRes', 'floorRes', 'utility', function ($scope, $http, $location,  roomRes, floorRes, utility) {
        $scope.Data = {};
        $scope.Data.Rooms = {};

        //查询选项
        $scope.options = {};
        $scope.options.params = {};


        $scope.init = function () {
            //房间查询
            roomRes.query({}, function (data) {
                $scope.Data.Rooms = data;
            });
            //楼层查询
            floorRes.query({}, function (floors) {
                $scope.Data.Floors = floors;
            });
        }

        //查询
        $scope.options.search = function () {
            $scope.Data.Rooms.length = 0;
            roomRes.query({}, function (data) {
                if ($scope.options.params.roomName == undefined || $scope.options.params.roomName == "") {
                    $scope.Data.Rooms = data;
                    return false;
                }
                angular.forEach(data, function (obj, index) {
                    if (obj.RoomName == $scope.options.params.roomName) {
                        $scope.Data.Rooms.push(obj);
                    }
                });
            });
        };

        $scope.delete = function (id) {
            utility.confirm("确定删除该房间信息吗?", function (result) {
                if (result) {
                    roomRes.delete({ id: id }, function (data) {
                        if (data.$resolved) {
                            var whatIndex = null;
                            angular.forEach($scope.Data.Rooms, function (cb, index) {
                                if (cb.id === id) {
                                    whatIndex = index;
                                }
                            });
                            $scope.Data.Rooms.splice(whatIndex, 1);
                            utility.message("刪除成功");
                        }
                    });
                }
            });
         };

        $scope.init();

    }])
    .controller("roomEditCtrl", ['$scope', '$http', '$location', '$stateParams', 'floorRes', 'roomRes', 'orgRes', 
        function ($scope, $http, $location, $stateParams,  floorRes, roomRes, orgRes) {
            $scope.init = function () {
                $scope.Data = {};
                $scope.Data.Room = {};
                $scope.Data.Floors = {};
                
                floorRes.query({}, function (data) {
                    $scope.Data.Floors = data;
                });

                if ($stateParams.id) {
                    roomRes.get({ id: $stateParams.id }, function (data) {
                        $scope.Data.Room = data;
                    });

                    $scope.isAdd = false;
                } else {
                    
                    $scope.isAdd = true;
                }
            };

            $scope.submit = function () {
                roomRes.save($scope.Data.Room, function (data) {
                    $location.url('/angular/RoomList');
                });
            };

            $scope.init();
        }]);