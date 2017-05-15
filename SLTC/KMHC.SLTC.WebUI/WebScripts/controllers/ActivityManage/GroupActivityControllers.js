/*
创建人:刘承
创建日期:2016-05-23
说明: 团体活动 groupActivityRes
      成员个别化评估 memberAssessRes
*/
angular.module("sltcApp")
.controller("GroupActivityCategoryCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var GroupActivityCategoryRes = resourceFactory.getResource("GroupActivityCategoryRes");

    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: GroupActivityCategoryRes,//异步请求的res
        params: { 'Data.keyWords': "" },
        success: function (data) {//请求成功时执行函数
            $scope.serviceGroups = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.deleteItem = function (item) {
        if (item) {
            utility.confirm("确定删除该信息吗?", function (result) {
                if (result) {
                    GroupActivityCategoryRes.delete({ id: item.ID }, function () {
                        $scope.options.search();
                        utility.message("刪除成功");
                    });
                    return false;
                }
            });
        }
    };

    $scope.ActivityCategoryEdit = function (item) {
        $scope.$broadcast('OpenActivityCategoryEdit', item);
    }

    $scope.$on('SavedActivityCategory', function (e, data) {
        $('#modalActivityCategoryEdit').modal('hide');
        $scope.options.search();
    });
}])
.controller("GroupActivityCategoryEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, utility, resourceFactory) {
    var GroupActivityCategoryEditRes = resourceFactory.getResource("GroupActivityCategoryEditRes");

    $scope.InitActivityCategory = function (item) {
        $scope.curChgItem = {};
        $scope.DeleteItem = [];
        $scope.ModifyOrCreateItem = [];
        $scope.prePostData = {};
        $scope.curChgItemAdd = true;
        if (item) {
            $scope.isAdd = false;
            $scope.curItem = item;
        } else {
            $scope.isAdd = true;
            $scope.curItem = { GroupActivityItem: [], CreateTime: getNowFormatDate() };
        }
    }

    $scope.updateItem = function (item) {
        var len = $scope.DeleteItem.length;
        var SaveItems = [];
        GroupActivityCategoryEditRes.save(item, function (data) {
            if (data.IsSuccess) {
                SaveItems = item.GroupActivityItem;
                for (var i = 0; i < len;i++){
                    SaveItems.push($scope.DeleteItem[i]);
                }
                GroupActivityCategoryEditRes.SaveActivityItems(SaveItems, function (data) {
                    $scope.DeleteItem = [];
                    utility.message("修改成功");
                    $scope.$emit("SavedActivityCategory");
                });
            }
        });
    };

    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    }

    $scope.charegeClick = function (item) {
        $scope.curChgItem = item;
        $scope.curChgItemAdd = false;
    }

    $scope.deleteCharegeDetl = function (item, $event) {
        if (item) {
            $scope.curItem.GroupActivityItem.splice($scope.curItem.GroupActivityItem.indexOf(item), 1);
            if (item.ID) {
                item.Action = "Delete";
                $scope.DeleteItem.push(item);
            }
        }
        $event.stopPropagation();
    }

    $scope.createItem = function (item) {
        GroupActivityCategoryEditRes.save(item, function () {
            utility.message("保存成功");
            $scope.$emit("SavedActivityCategory");
        });
    };

    $scope.cancelEdit = function () {
        $location.url("/angular/GroupActivityCategory");
    };


    $scope.saveEdit = function (item) {
        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }
        if (item.ID) {
            $scope.updateItem(item);
        } else {
            $scope.createItem(item);
        }
    };

 
    $scope.saveTempItem = function () {
        if ($scope.curChgItem.ItemName ==undefined || $scope.curChgItem.ItemName == "") {
            return;
        }
        $scope.curItem.hiddenId = $scope.hiddenId;
        if ($scope.curChgItemAdd) {
            $scope.curChgItem.GroupActivityCategoryID = $scope.curItem.ID;
            $scope.curItem.GroupActivityItem.push($scope.curChgItem);
        }
        $scope.curChgItem = {};
        $scope.curChgItemAdd = true;
    }

    $scope.$on("OpenActivityCategoryEdit", function (event, item) {
        $scope.InitActivityCategory(item);
    });
}])

