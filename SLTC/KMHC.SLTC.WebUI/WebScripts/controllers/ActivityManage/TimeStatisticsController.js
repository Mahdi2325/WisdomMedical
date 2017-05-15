angular.module("sltcApp").controller("timeStatisticsCtrl", ['$scope', 'resourceFactory', 'utility', function ($scope, resourceFactory, utility) {
    //API
    var volunteerApi = resourceFactory.getResource('volunteer');
    //Table表头加载的团体活动类别List
    $scope.GroupActivity = {};
    //团体活动子类别
    $scope.GroupActivityItem = {};
    //团体活动帮扶结对时间统计数据
    $scope.GroupActivityTask = {};
    //Table表头加载的团体活动子类别List
    $scope.GroupActivityItemList = [];
    //志愿者的团体活动子类别List
    $scope.SubGroupActivityItemList = [];
    //志愿者List
    $scope.VolunteerList = {};
    //团体活动时间统计数据
    $scope.GroupActivityRecord = {};
    //查询条件开始时间
    $scope.startDate = "";
    //查询条件结束时间
    $scope.endDate = Date.prototype.currentDate();
    //加载查询条件下的所有数据
    $scope.init = function () {
        volunteerApi.get({}, function (data) {
            $scope.GroupActivity = data.Data;
            if ($scope.GroupActivity != null) {
                angular.forEach($scope.GroupActivity, function (item) {
                    if (item.GroupActivityItem.length == 0) {
                        $scope.GroupActivityItem.Id = 0;
                        $scope.GroupActivityItem.GroupactivitycategoryID = item.ID;
                        $scope.GroupActivityItem.ItemName = "";
                        $scope.GroupActivityItem.Hours = 0;
                        $scope.SubGroupActivityItemList.push($scope.GroupActivityItem);
                        $scope.GroupActivityItem = {};
                    }
                    if (item.GroupActivityItem.length > 0) {
                        angular.forEach(item.GroupActivityItem, function (subItem) {
                            $scope.GroupActivityItemList.push(subItem);
                            $scope.SubGroupActivityItemList.push(subItem);
                        });
                    }
                });
                $scope.search();
            }
        });
    }

    $scope.search = function () {
        volunteerApi.get({ mark: "volunteer", name: $scope.personName }, function (subData) {
            $scope.VolunteerList = subData.Data;
            if ($scope.VolunteerList != null) {
                $scope.MakeRecord();
            }
        });
    }

    //查询
    $scope.MakeRecord = function () {
        $scope.tStartDate = $scope.startDate;
        $scope.tEndDate = $scope.endDate;
        volunteerApi.get({ startDate: $scope.startDate, endDate: $scope.endDate }, function (records) {
            $scope.GroupActivityRecord = records.Data;
            if ($scope.VolunteerList != null) {
                volunteerApi.get({ mark: "task", startDate: $scope.startDate, endDate: $scope.endDate }, function (taskData) {
                    $scope.GroupActivityTask = taskData.Data;
                    angular.forEach($scope.VolunteerList, function (item) {
                        var totalHours = 0;
                        var taskHours = 0;
                        item.groupActivityItem = angular.copy($scope.SubGroupActivityItemList);
                        //帮扶结对特殊处理
                        //***********start************
                        if ($scope.GroupActivityTask != null) {
                            angular.forEach($scope.GroupActivityTask, function (taskItem) {
                                if (item.EmployeeId == taskItem.EmployeeId) {
                                    angular.forEach(item.groupActivityItem, function (volItem) {
                                        if (volItem.ItemName == "帮扶结对") {
                                            var diffHours = 0;
                                            try {
                                                var diff = new Date(taskItem.EndTime).getTime() - new Date(taskItem.BeginTime).getTime();
                                                //计算出小时数  
                                                var leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数  
                                                diffHours = Math.floor(leave1 / (3600 * 1000));
                                                
                                            }
                                            catch (e) {

                                            }
                                            volItem.Hours = volItem.Hours + diffHours;
                                            taskHours = volItem.Hours;
                                        }
                                    });
                                }
                            });
                            totalHours = totalHours + taskHours;
                        }
                        //************end*************
                        angular.forEach($scope.GroupActivityRecord, function (subItem) {
                            if (subItem.EmployeeIds != undefined && subItem.EmployeeIds != null) {
                                var empList = subItem.EmployeeIds.split(',');
                                angular.forEach(empList, function (empId) {
                                    if (item.EmployeeId == empId) {
                                        angular.forEach(item.groupActivityItem, function (volItem) {
                                            if (subItem.CategoryId == volItem.GroupactivitycategoryID) {
                                                if (subItem.ItemId == 0) {
                                                    volItem.Hours = volItem.Hours + subItem.Hours;
                                                    totalHours = totalHours + subItem.Hours;
                                                }
                                                else if (subItem.ItemId == volItem.ID) {
                                                    volItem.Hours = volItem.Hours + subItem.Hours;
                                                    totalHours = totalHours + subItem.Hours;
                                                }

                                            }
                                        });
                                    }
                                });
                            }
                        });
                        item.TotalHours = totalHours;
                    });
                });
            }
        });

    }
    //加载
    $scope.init();
}]).filter('hourFix',function(){
    return function (hour) {
        if (hour==0) {
            return "";
        }
        return hour.toFixed(2)*1;
    }
});