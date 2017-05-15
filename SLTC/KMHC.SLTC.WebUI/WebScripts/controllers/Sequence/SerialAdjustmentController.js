angular.module("sltcApp")
    .controller('SerialAdjustmentCtrl',
        [
            '$scope', 'resourceFactory', function ($scope, resourceFactory) {

                $scope.patientQueues = [];
                
                $scope.parentGetPatientQueueForAdjust = function () {
                    $scope.options = {
                        buttons: [],
                        ajaxObject: resourceFactory.getResource('getPatientQueueForAdjustInfo'),
                        params: { 'Data.DeptID': $scope.$root.user.DeptID, 'Data.OrganizationID': $scope.$root.user.OrgId, 'Data.CheckRoomID': $scope.$root.user.CheckRoomID },
                        success: function (data) {
                            $scope.patientQueues = data.Data;
                        },
                        pageInfo: { //分页信息
                            CurrentPage: 1,
                            PageSize: 5
                        }
                    }
                }

                $scope.parentGetPatientQueueForAdjust();
                $scope.$root.parentGetPatientQueueForAdjust = function() {
                    $scope.options.search();
                }


                $scope.SetPatientNumberForward = function (item) {
                    var serialAdjustment = resourceFactory.getResource('serialAdjustment');

                    serialAdjustment.SetPatientNumberForward(item,
                        function (data) {
                            if (data.Data) {
                                $scope.patientQueues = data.Data.InQueuePatientList;
                                $scope.options.search();
                            }
                        });

                }

                $scope.SetPatientNumberBackward = function (item) {
                    var serialAdjustment = resourceFactory.getResource('serialAdjustment');

                    serialAdjustment.SetPatientNumberBackward(item,
                        function (data) {
                            if (data.Data) {
                                $scope.patientQueues = data.Data.InQueuePatientList;
                                $scope.options.search();
                            }
                        });

                }

                $scope.SetPatientNumberToFirst = function (item) {
                    var serialAdjustment = resourceFactory.getResource('serialAdjustment');

                    serialAdjustment.SetPatientNumberToFirst(item,
                        function (data) {
                            if (data.Data) {
                                $scope.patientQueues = data.Data.InQueuePatientList;
                                $scope.options.search();
                            }
                        });
                }


            }
        ])
 .controller('ExpiredPatientListCtrl',
        [
            '$scope', 'resourceFactory', function ($scope, resourceFactory) {

                $scope.inExpiredPatientList = [];                

                $scope.GetExpiredPatientList = function () {

                    $scope.options = {
                        buttons: [],
                        ajaxObject: resourceFactory.getResource('getExpiredPatientListInfo'),
                        params: { 'Data.DeptID': $scope.$root.user.DeptID, 'Data.OrganizationID': $scope.$root.user.OrgId, 'Data.CheckRoomID': $scope.$root.user.CheckRoomID },
                        success: function (data) {
                            $scope.inExpiredPatientList = data.Data;
                        },
                        pageInfo: { //分页信息
                            CurrentPage: 1,
                            PageSize: 5
                        }
                    }
                }

                $scope.GetExpiredPatientList();
                $scope.$root.GetExpiredPatientList = function() {
                    $scope.options.search();
                }


               
                $scope.AddExpiredPatientToQueue = function (item) {
                    var serialAdjustment = resourceFactory.getResource('serialAdjustment');

                    serialAdjustment.AddExpiredPatientToQueue(item,
                        function (data) {
                            if (data.Data) {
                                $scope.$root.parentGetPatientQueueForAdjust();
                                $scope.options.search();
                            }
                        });
                }
            }
        ]);