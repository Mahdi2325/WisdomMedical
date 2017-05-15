/*
        创建人: 李林玉
        创建日期:2016-06-05
        说明: 首页
*/
angular.module("sltcApp")
    .controller("homeCtrl", ['$scope', '$http', '$location', 'resourceFactory', function ($scope, $http, $location, resourceFactory) {

        var briefInfoRes = resourceFactory.getResource('homeInfo');
            $scope.briefInfo = {};

            $scope.getHomeInfo = function() {
                briefInfoRes.get({ organizationID: $scope.$root.user.OrgId },
                    function(data) {
                        if (data.Data) {
                            $scope.briefInfo = data.Data;
                        }
                    });
            }


            $scope.getHomeInfo();

            var todayInfoRes = resourceFactory.getResource('todayInfo');
            $scope.todayInfo = {};

            $scope.getTodayInfo = function () {
                todayInfoRes.get({ organizationID: $scope.$root.user.OrgId },
                    function (data) {
                        if (data.Data) {
                            $scope.todayInfo = data.Data;
                        }
                    });
            }


            $scope.getTodayInfo();


            $scope.refresh = function() {

                $scope.getHomeInfo();
                $scope.getTodayInfo();
            };

        }
    ]);