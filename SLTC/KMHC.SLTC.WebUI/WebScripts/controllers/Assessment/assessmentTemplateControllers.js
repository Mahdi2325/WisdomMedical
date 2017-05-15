///创建人:郝元彦
///创建日期:2016-05-25
///说明:评估模板维护
angular.module("sltcApp")
.controller("assessmentTemplateCtrl", ['$scope', 'utility', 'assessmentTemplateRes', function ($scope, utility, assessmentTemplateRes) {
    $scope.init = function () {
        assessmentTemplateRes.query(function (data) {
            $scope.assessmentTemplates = data;
        });
    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                assessmentTemplateRes.delete({ id: item.id }, function (data) {
                    $scope.assessmentTemplates.splice($scope.assessmentTemplates.indexOf(item), 1);
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };
    $scope.init();
}])
.controller("assessmentTemplateEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'assessmentTemplateRes', function ($scope, $location, $stateParams, utility, assessmentTemplateRes) {
    $scope.init = function () {
        if ($stateParams.id) {
            $scope.isAdd = true;
            assessmentTemplateRes.get({ id: $stateParams.id }, function (data) {
                $scope.curItem = data;
                $scope.curContentString = angular.toJson(data.Content);
            });

        } else {
            $scope.isAdd = false;
            $scope.curItem = {};
        }
    }


    $scope.createItem = function (item) {
        assessmentTemplateRes.save(item, function (newItem) {
            utility.message("添加成功");
            $location.url("/angular/assessment/assessmenttemplate");
        });
    };

    $scope.updateItem = function (item) {
        assessmentTemplateRes.save(item, function () {
            utility.message("修改成功");
            $location.url("/angular/assessment/assessmenttemplate");
        });
    };

    $scope.cancelEdit = function () {
        $location.url("/angular/assessment/assessmenttemplate");
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
.controller("assessmentTemplatePreviewCtrl", ['$scope', '$location', '$stateParams', 'assessmentTemplateRes', function ($scope, $location, $stateParams, assessmentTemplateRes) {

    if ($stateParams.id) {
        assessmentTemplateRes.get({id: $stateParams.id }, function (data) {
            $scope.curTemplate = data;
        });

    } else {
        $scope.curTemplate = {};
    }
    //获取评估项目内容
    $scope.getAssessmentItem = function(AINo) {
        return {};
    }
}
])
;