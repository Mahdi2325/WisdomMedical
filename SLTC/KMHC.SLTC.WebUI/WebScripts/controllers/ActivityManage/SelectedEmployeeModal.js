/*
创建人:张有军
创建日期:2016-11-22
说明: 活动 activityRes
*/
angular.module("sltcApp")
.controller("SelectedEmployeeModal", ['$scope', '$rootScope', '$http', '$state', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope,$http, $state, $location, utility, resourceFactory) {
    var empRes = resourceFactory.getResource("employees");
    $scope.Emp = {
        EmpList: []
    };

    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: empRes,//异步请求的res
        params: { },
        success: function (data) {//请求成功时执行函数    
            $scope.Emp.EmpList = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    };

    $('#modalSelectedEmployee').on('show.bs.modal',
        function (e) {
            var selEmps = [];
            $scope.Emp.EmpList = [];

            var params = {};
            if ($scope.SelectedActivity == undefined || $scope.SelectedActivity == null) {
                return;
            }
            if ($scope.SelectedActivity.EmployeeIDs != undefined && $scope.SelectedActivity.EmployeeIDs != "" && $scope.SelectedActivity.EmployeeIDs != null) {
                selEmps = $scope.SelectedActivity.EmployeeIDs.split(',');
            } else {
                return;
            }
            for (var i = 0; i < selEmps.length; i++) {
                params['Data.EmployeeIDs[' + i + ']'] = selEmps[i];
            }
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.params = params;
            $scope.options.search();
        });
}])
;





