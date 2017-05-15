/*
 * 创建人: 刘承（Alex.Liu）
 *
 * 创建日期:2016-05-17
 *
 * 说明:床位管理
 *
 *
 */
angular.module("sltcApp")
    .controller("bedListCtrl", ['$scope', '$http', '$location', '$state', 'bedRes', 'roomRes', 'utility', function ($scope, $http, $location, $state, bedRes, roomRes, utility) {
        $scope.Data = {};
        $scope.Data.Beds = {};

        //查询选项
        $scope.options = {};
        $scope.options.params = {};

        //查询所有
        $scope.init = function () {
            bedRes.query({}, function (data) {
                $scope.Data.Beds = data;
            });

            roomRes.query({}, function (rooms) {
                $scope.Data.Rooms = rooms;
            });
        };

        //查询
        $scope.options.search = function () {
            $scope.Data.Beds.length = 0;
            bedRes.query({}, function (data) {
                if ($scope.options.params.bedName == undefined || $scope.options.params.bedName == "") {
                    $scope.Data.Beds = data;
                    return false;
                }
                angular.forEach(data, function (obj, index) {
                    if (obj.BedName == $scope.options.params.bedName) {
                        $scope.Data.Beds.push(obj);
                    }
                });
            });
        };

        $scope.delete = function (item) {
            utility.confirm("确定删除该床位信息吗?", function (result) {
                if (result) {
                    bedRes.delete({ id: item.BedNo }, function (data) {
                        $scope.Data.beds.splice($scope.Data.beds.indexOf(item), 1);
                        utility.message("刪除成功");
                    });
                }
            });

        };




        $scope.search = $scope.reload = function () {
            bedRes.get($scope.options.pageInfo, function (req) {
                $scope.Data.beds = req.Data;
                $scope.options.sumInfo = { RecordsCount: req.RecordsCount, PagesCount: req.PagesCount };
                $scope.options.renderPage = $scope.options.pageInfo.CurrentPage;
            });
        };

        $scope.init();
    }])
    .controller("bedEditCtrl", ['$scope', '$http', '$location', '$stateParams', 'bedRes', 'roomRes',
        function ($scope, $http, $location, $stateParams, bedRes, roomRes) {

            $scope.init = function () {
                $scope.Data = {};
                $scope.Data.Bed = {};
              
                $scope.Address1 = "安徽省-蚌埠市-禹会区-说到底";
                $scope.Address2 = "安徽省-蚌埠市-禹会区-说到底";
                //$scope.Data.Bed.BedKind = "001";
                //$scope.Data.Bed.BedType = "001";
                //$scope.Data.Bed.Prestatus = "N";
                //$scope.Data.Bed.InsbedFlag = "N";
                //$scope.Data.Bed.SexType = "001";

                //deptRes.get({ CurrentPage: 1, PageSize: 100 }, function (data) {
                //    $scope.Data.depts = data.Data;
                //    $scope.Data.bed.DeptNo = $scope.Data.depts[0].DeptNo
                //});

                //floorRes.get({ CurrentPage: 1, PageSize: 100 }, function (data) {
                //    $scope.Data.floors = data.Data;
                //    $scope.Data.bed.Floor = $scope.Data.floors[0].FloorId
                //});

                roomRes.query({}, function (data) {
                    $scope.Data.Rooms = data;

                });

                if ($stateParams.id) {
                    bedRes.get({ id: $stateParams.id }, function (data) {
                        $scope.Data.Bed = data;
                    });
                    $scope.isAdd = false;
                } else {
                    $scope.isAdd = true;

                }

            };

            $scope.residentSelected = function (item) {

                if (item[0])
                    $scope.Address = item[0];
                if (item[1])
                    $scope.Address = item[0] + " " + item[1];

            }

            $scope.myclick = function () {
               console.log($("#myAddress1").val() +"-"+ $scope.Data.AddressDetail1);
               console.log($("#myAddress2").val() + "-" + $scope.Data.AddressDetail1);
            };
            $scope.resident = function (item) {               
                if (item[0])
                    $scope.Address1 = item[0];
                if (item[1])
                    $scope.Address1 = item[0] + " " + item[1];

            }

            $scope.submit = function () {
                //$scope.Data.Bed.bedStatus = "E"
                bedRes.save($scope.Data.Bed, function (data) {
                    $location.url("/angular/BedList");
                });
            };

            $scope.init();

        }])
     .controller("bedModalPopuCtrl", ['$scope', '$http', '$state', '$location', 'bedRes', function ($scope, $http, $state, $location, bedRes) {
         //console.log(11);
         $scope.init = function () {
             $scope.Data = {};
             $scope.Data.Beds = {};
             bedRes.query({}, function (data) {
                 $scope.Data.Beds = data;
             });
         };

         $scope.init();
         $scope.rowClick = function (item) {

             $scope.$emit('chooseBed', item);

             //  $('#modalBed').modal('hide');
         };
     }]);