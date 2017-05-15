angular.module("sltcApp")
    .controller('CallPatientCtrl',
        [
            '$scope', 'resourceFactory', 'utility', function ($scope, resourceFactory, utility) {

               // var patientQueueInfoRes = resourceFactory.getResource('patientQueueInfo');
                $scope.patientQueues = [];
                $scope.patientInServicing = [];

                //$scope.residentPercentageInfo = function() {
                //    patientQueueInfoRes.get({ departmentId: utility.getUserInfo().DeptID, organizationID: $scope.$root.user.OrgId, checkRoomId: $scope.$root.user.CheckRoomID },
                //        function(data) {
                //            if (data.Data) {
                //                $scope.patientQueues = data.Data.InQueuePatientList;
                //                $scope.inServicingPatientList = data.Data.InServicingPatientList;
                //            }
                //        });
                //}

                //$scope.residentPercentageInfo();


                //'Data.Keywords
                var patientQueueInfoRes = resourceFactory.getResource('patientQueueInfo');
                $scope.init = function () {
                    $scope.options = {
                        buttons: [],
                        ajaxObject: patientQueueInfoRes,
                        params: { 'Data.DeptID': utility.getUserInfo().DeptID, 'Data.OrganizationID': $scope.$root.user.OrgId, 'Data.CheckRoomID': $scope.$root.user.CheckRoomID },
                        success: function (data) {
                            $scope.patientQueues = data.Data.InQueuePatientList;
                            $scope.inServicingPatientList = data.Data.InServicingPatientList;
                        },
                        pageInfo: { //分页信息
                            CurrentPage: 1,
                            PageSize: 5
                        }
                    }
                }

                $scope.init();

                $scope.getNextPatient = function () {
                    var patientQueue = resourceFactory.getResource('patientQueue');

                    var item = {
                        DeptID: utility.getUserInfo().DeptID,
                        CheckRoomID: utility.getUserInfo().CheckRoomID,
                        OrganizationID: $scope.$root.user.OrgId,
                        EmployeeID: $scope.$root.user.EmpId
                    };

                    patientQueue.UpdatePatientStatus(item,
                        function(data) {
                            if (data.Data) {
                                $scope.patientQueues = data.Data.InQueuePatientList;
                                $scope.inServicingPatientList = data.Data.InServicingPatientList;
                            }
                        });

                }

                $scope.setPatientExpired = function(item) {
                    var patientQueue = resourceFactory.getResource('patientQueue');

                    patientQueue.SetPatientExpired(item,
                        function(data) {
                            if (data.Data) {
                                $scope.patientQueues = data.Data.InQueuePatientList;
                                $scope.inServicingPatientList = data.Data.InServicingPatientList;
                            }
                        });
                }

                $scope.setPatientFinish = function(item) {
                    var patientQueue = resourceFactory.getResource('patientQueue');

                    patientQueue.SetPatientFinish(item,
                        function(data) {
                            if (data.Data) {
                                $scope.patientQueues = data.Data.InQueuePatientList;
                                $scope.inServicingPatientList = data.Data.InServicingPatientList;
                            }
                        });
                }
            }
        ]);