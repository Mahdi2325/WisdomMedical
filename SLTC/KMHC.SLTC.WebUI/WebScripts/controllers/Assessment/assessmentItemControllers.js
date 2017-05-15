///创建人:郝元彦
///创建日期:2016-05-23
///说明:评估项目维护
angular.module("sltcApp")
.controller("assessmentItemCtrl", ['$scope', 'utility', 'assessmentItemRes', function ($scope, utility, assessmentItemRes) {
    $scope.init = function () {
        assessmentItemRes.query(function (data) {
            $scope.assessmentItems = data;
        });
    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                assessmentItemRes.delete({ id: item.id }, function (data) {
                    $scope.assessmentItems.splice($scope.assessmentItems.indexOf(item), 1);
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };
    $scope.init();
}])
.controller("assessmentItemEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'assessmentItemRes', function ($scope, $location, $stateParams, utility, assessmentItemRes) {
    $scope.init = function () {
        if ($stateParams.id) {
            $scope.isAdd = true;
            assessmentItemRes.get({ id: $stateParams.id }, function (data) {
                $scope.curItem = data;
            });

        } else {
            $scope.isAdd = false;
            $scope.curItem = {};
        }
    }


    $scope.createItem = function (item) {
        assessmentItemRes.save(item, function (newItem) {
            utility.message("添加成功");
            $location.url("/angular/assessment/assessmentitem");
        });
    };

    $scope.updateItem = function (item) {
        assessmentItemRes.save(item, function () {
            utility.message("修改成功");
            $location.url("/angular/assessment/assessmentitem");
        });
    };

    $scope.cancelEdit = function () {
        $location.url("/angular/assessment/assessmentitem");
    };

    $scope.saveEdit = function (item) {
        if (angular.isDefined(item.Id)) {
            $scope.updateItem(item);
        } else {
            $scope.createItem(item);
        }
    };
    $scope.init();
}])
.controller("assessmentItemBatchAddCtrl", ['$scope', '$location', '$stateParams', 'utility', 'assessmentItemRes', function ($scope, $location, $stateParams, utility, assessmentItemRes) {

    $scope.saveItemBatch = function() {
        if (angular.isDefined($scope.content)) {
            
            try {
                $scope.items = angular.fromJson($scope.content);
            } catch (ex) {
                utility.alert("解析失败,请输入正确的JSON格式");
            }
            
            if (angular.isArray($scope.items)) {
                //解析成功
                angular.forEach($scope.items,function(e) {
                    if (angular.isDefined(e.AINo)
                        && angular.isDefined(e.AIName)
                        && angular.isDefined(e.AIType)
                        && angular.isDefined(e.Remark)) {

                        assessmentItemRes.save(e, function () {
                            utility.message(e.AIName + " 添加成功");
                        });

                    } else {
                        utility.message(e.AIName + " 信息不完整,被丢弃");
                    }
                });
            } else {
                utility.alert("录入数据非JSON数组格式,请检查输入");
            }
        }
    }

    $scope.cancelBatchAdd = function () {
        $location.url("/angular/assessment/assessmentitem");
    };
}])
;