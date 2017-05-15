
angular.module("sltcApp")
.controller("commodityTypeCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {
    var commodityTypeRes = resourceFactory.getResource("commodityTypeRes");

    //查询选项
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: commodityTypeRes,//异步请求的res
        params: { 'Data.keyWords': "" },
        success: function (data) {//请求成功时执行函数
            $scope.commodityTypeList = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }

    $scope.deleteItem = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                commodityTypeRes.delete({ id: item.CTypeID }, function () {
                    $scope.options.search();
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };

    $scope.$on('SavedCommodityType', function (e, data) {
        $('#modalCommodityTypeEdit').modal('hide');
        $scope.options.search();
    });

    $scope.editCommodityType = function (item) {
        $scope.$broadcast('OpenCommodityType', item);
    }
}])
.controller("commodityTypeEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, utility, resourceFactory) {
    var commodityTypeRes = resourceFactory.getResource("commodityTypeRes");

    $scope.SaveOrEdit = function (item) {
        if (!objEquals($scope.prePostData, item)) {
            angular.copy(item, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }

        commodityTypeRes.save(item, function () {
            utility.message("保存成功");
            $scope.$emit("SavedCommodityType");
        });
    };

    $scope.$on('OpenCommodityType', function (e, data) {
        $scope.curItem = data;
        $scope.prePostData = {};
        if (data.CTypeID) {
            $scope.isAdd = false;
        } else {
            $scope.isAdd = true;
        }
    });
}])
;