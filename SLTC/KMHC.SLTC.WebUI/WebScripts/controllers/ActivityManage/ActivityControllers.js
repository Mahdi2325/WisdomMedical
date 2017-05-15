/*
创建人:张有军
创建日期:2016-11-22
说明: 活动 activityRes
*/
angular.module("sltcApp")
.controller("activityListCtrl", ['$scope', '$rootScope', '$http', '$state', '$location', 'utility', 'resourceFactory', function ($scope,$rootScope, $http, $state, $location, utility, resourceFactory) {
    var activityRes = resourceFactory.getResource("activityRes");
    var GroupActivityCategoryRes = resourceFactory.getResource("GroupActivityCategoryRes");
    var GroupActivityCategoryEditRes = resourceFactory.getResource("GroupActivityCategoryEditRes");
    var areaRes = resourceFactory.getResource("area");

    $scope.activityItemList = [{ "ID": '', "ItemName": "-- 选择活动项目 --" }];
    $scope.activityCategoryList = [{ "ID": '', "CategoryName": "-- 选择活动分类 --" }];
    $scope.areaList = [{ "AreaID": '', "AreaName": "-- 选择区域 --" }];

    $scope.Data = [];

    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: activityRes,//异步请求的res
        params: { 'Data.Keywords': '' },
        success: function (data) {//请求成功时执行函数
            $scope.Data = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    };

    $scope.init = function () {
        GroupActivityCategoryRes.get({}, function (data) {
            $scope.activityCategoryList = $scope.activityCategoryList.concat(data.Data);
        });

        areaRes.get({ "Data.AreaName": "" }, function (data) {
            $scope.areaList = $scope.areaList.concat(data.Data);
            if ($scope.areaList != null && $scope.areaList.length >= 0) {
                var otherArea = new Object();
                otherArea.AreaID = -1;
                otherArea.AreaName = "其他区域";
                $scope.areaList.push(otherArea);
            }
        });
        $scope.options.params['Data.CategoryID'] = '';
        $scope.options.params['Data.ItemID'] = '';
        $scope.options.params['Data.AreaID'] = '';
    }


    $scope.selectCategory = function (categoryID) {
        if (categoryID == '') {
            $scope.activityItemList = [];
            $scope.options.params['Data.ItemID']='';
            return;
        }

        $scope.activityItemList = [{ "ID": '', "ItemName": "-- 选择活动项目 --" }];
        for (var i = 0; i < $scope.activityCategoryList.length; i++) {
            if ($scope.activityCategoryList[i].ID == categoryID) {
                $scope.activityItemList = $scope.activityItemList.concat($scope.activityCategoryList[i].GroupActivityItem);
                break;
            }
        }
        if ($scope.activityItemList.length==1) {
            $scope.activityItemList = [];
        }

        $scope.options.params['Data.ItemID'] = '';
    }

    //删除活动项目
    $scope.ItemDelete = function (item) {
        utility.confirm("您确定删除该信息吗?", function (result) {
            if (result) {
                activityRes.delete({ id: item.ID }, function (data) {
                    if (data.IsSuccess) {
                        $scope.options.search();
                        utility.message("成功刪除！");
                    } else {
                        utility.message("删除失败！");
                    }
                });
            }
        });
    };

    //查看已选员工
    $scope.ViewEmp = function (item) {
        $scope.SelectedActivity = item;
        $('#modalSelectedEmployee').modal('show');
    };

    //查看已选会员
    $scope.ViewMember = function (item) {
        $scope.SelectedActivity = item;
        $('#modalSelectedMember').modal('show');
    };

    $scope.init();
}])
.controller("activityEditCtrl",['$scope', '$location', '$stateParams', '$filter', '$timeout', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, $filter, $timeout, utility, resourceFactory) {
    var activityRes = resourceFactory.getResource("activityRes");
    var GroupActivityCategoryRes = resourceFactory.getResource("GroupActivityCategoryRes");
    var GroupActivityCategoryEditRes = resourceFactory.getResource("GroupActivityCategoryEditRes");
    var areaRes = resourceFactory.getResource("area");
    $scope.activityItemList = [];
    $scope.activityCategoryList = [];
    $scope.areaList = [];

    $scope.init = function () {
        $scope.activity = {};
        GroupActivityCategoryRes.get({ }, function (data) {
            $scope.activityCategoryList = data.Data;
        });

        areaRes.get({"Data.AreaName":""}, function (data) {
            $scope.areaList = data.Data;
            if ($scope.areaList != null && $scope.areaList.length>=0) {
                var otherArea = new Object();
                otherArea.AreaID = -1;
                otherArea.AreaName = "其他区域";
                $scope.areaList.push(otherArea);
            }
        });

        if ($stateParams.id) {
            $scope.isAdd = false;
            activityRes.get({ "id": $stateParams.id }, function (data) {
                $scope.selectCategory(data.Data.CategoryID);
                $scope.activity = data.Data;
            });
        } else {
            $scope.isAdd = true;
        }
    }

    $scope.ChangeTime = function () {
        if (!$scope.activity.StartTime || !$scope.activity.EndTime) {
            return;
        }
        var sTime = newDate($scope.activity.StartTime);
        var eTime = newDate($scope.activity.EndTime);
        if (sTime != null && eTime != null) {
            $scope.activity.Hours = ((eTime - sTime) / (1000 * 60 * 60)).toFixed(2);
        }
    }

    $scope.ChangeHours = function () {
        if (!$scope.activity.StartTime) {
            return;
        }
        var sTime = newDate($scope.activity.StartTime);
        if (sTime != null && $scope.activity.Hours != null && $scope.activity.Hours != "") {
            sTime = sTime.getTime() + $scope.activity.Hours * 1000 * 60 * 60;
            $scope.activity.EndTime = $filter('date')(sTime, 'yyyy-MM-dd HH:mm:ss');
        }
    }

    $scope.selectCategory = function (categoryID) {
        $scope.activityItemList = [];
        for (var i = 0; i < $scope.activityCategoryList.length; i++) {
            if ($scope.activityCategoryList[i].ID == categoryID) {
                $scope.activityItemList = $scope.activityCategoryList[i].GroupActivityItem;
            }
        }
        delete $scope.activity.ItemID;
    }

    //保存订单并生成任务
    $scope.prePostData = {};
    $scope.saveEdit = function (item) {
        
        var sTime = newDate($scope.activity.StartTime);
        var eTime = newDate($scope.activity.EndTime);
        if (sTime > eTime) {
            utility.message("无法保存：活动结束时间早于活动开始时间。");
            return;
        }


        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }

        activityRes.save(item, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("活动添加成功");
                $location.url("/angular/ActivityList");
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    //选择区域
    $scope.selectArea = function (areaID) {
        if (areaID == -1) {
            $scope.activity.ActivityPlace = "";
            return;
        }
        for (var i = 0; i < $scope.areaList.length; i++) {
            if ($scope.areaList[i].AreaID == areaID) {
                $scope.activity.ActivityPlace = $scope.areaList[i].City + $scope.areaList[i].Address;
                break;
            }
        }
    };

    $scope.cancelEdit = function () {
        $location.url("/angular/ActivityList");
    };
    $scope.init();

}]);





