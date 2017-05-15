angular.module("sltcApp")
    .controller('appointListCtrl',
        [
            '$scope', 'resourceFactory', function($scope, resourceFactory) {

                var date = new Date();
                var seperator1 = "-";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
                $scope.currDate = currentdate;


                var appointListRes = resourceFactory.getResource('appointList');
                $scope.appStatistics = [];

                $scope.init = function () {
                    appointListRes.get({ dt: $scope.currDate },
                        function(data) {
                            if (data.Data) {
                                $scope.appStatistics = data.Data.sevAppStatistics;
                            }
                        });
                }

                $scope.searchInfo = function () {
                    $scope.init();
                }

                $scope.SevAppDtlMorn = function (item) {
                    $scope.$broadcast("ServiceAppPeopleMorn", item);
                }
                $scope.SevAppDtlNoon = function (item) {
                    $scope.$broadcast("ServiceAppPeopleNoon", item);
                }
                
                $scope.init();
            }



        ])
    .controller('appointDtlCtrl',
        [
            '$scope', 'resourceFactory', function ($scope, resourceFactory) {
                
                $scope.$on("ServiceAppPeopleMorn", function (event, data) {
                    $scope.servItemName = data.ServiceItemType;
                    $scope.period = "Morn";
                    $scope.init();
                });
                $scope.$on("ServiceAppPeopleNoon", function (event, data) {
                    $scope.servItemName = data.ServiceItemType;
                    $scope.period = "Noon";
                    $scope.init();
                });
                var appointDtlRes = resourceFactory.getResource('appointDtl');
                $scope.appDtl = [];

                $scope.init = function () {
                    appointDtlRes.get({ sevItem: $scope.servItemName, dt: $scope.currDate, period: $scope.period },
                        function (data) {
                            if (data.Data) {
                                $scope.appDtl = data.Data.ServicePeople;
                            }
                        });
                }
            }
        ]);