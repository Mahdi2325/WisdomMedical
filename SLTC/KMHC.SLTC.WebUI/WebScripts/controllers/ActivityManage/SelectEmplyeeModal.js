/*
创建人:张有军
创建日期:2016-11-22
说明: 活动 activityRes
*/
angular.module("sltcApp")
.controller("SelectEmployeeModalPopuCtrl", ['$scope', '$http', '$state', '$location', 'utility', 'resourceFactory', function ($scope, $http, $state, $location, utility,resourceFactory) {
    var empRes = resourceFactory.getResource("employees");
    $scope.Data = {
        Emps: [],
        Orgs: [],
        SelectedEmps: []
    };
    var qSelect = {};

    //初始化
    $scope.init = function () {
        $scope.Data.SelectedEmps = [];
        SetSelectedEmps();
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: empRes,//异步请求的res
            params: { 'Data.EmpName': "" },
            success: function (data) {//请求成功时执行函数              
                $scope.Data.Emps = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        };
    };

    function SetSelectedEmps() {
        if ($scope.activity.EmployeeIDs != "" && $scope.activity.EmployeeIDs != null && $scope.activity.EmployeeIDs != undefined) {
            var selIdArr = $scope.activity.EmployeeIDs.split(",");
            var selNameArr = $scope.activity.EmployeeNames.split(",");
            for (var i = 0; i < selIdArr.length; i++) {
                var selObj = new Object();
                selObj.EmpName = selNameArr[i];
                selObj.EmployeeID = selIdArr[i];
                $scope.Data.SelectedEmps.push(selObj);
            }
        }
    }

    function GetSelectedEmployees() {
        var emp = new Object();
        var strIds = "";
        var strNames = "";
        var schar = "";
        for (var i = 0; i < $scope.Data.SelectedEmps.length;i++) {
            strIds += schar + $scope.Data.SelectedEmps[i].EmployeeID;
            strNames += schar + $scope.Data.SelectedEmps[i].EmpName;
            schar = ",";
        }
        emp.EmployeeIDs = strIds;
        emp.EmployeeNames = strNames;
        return emp;
    }

    $scope.rowClick = function (item) {
        var selectedEmps = $scope.Data.SelectedEmps;
        var isExist = false;
        for (var i = 0; i < selectedEmps.length;i++){
            if (selectedEmps[i].EmployeeID == item.EmployeeID) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            var selObj = new Object();
            selObj.EmpName = item.EmpName;
            selObj.EmployeeID = item.EmployeeID;
            $scope.Data.SelectedEmps.push(selObj);
        }
    };

    $scope.delSelected = function (item) {
        $scope.Data.SelectedEmps.splice($scope.Data.SelectedEmps.indexOf(item), 1);
    };

    $('#modalSelectEmployeeItem').on('show.bs.modal',
    function () {
        $scope.Data.SelectedEmps = [];
        SetSelectedEmps();
    });
    $scope.SubmitSelect = function () {
        if ($scope.Data.SelectedEmps.length > 0) {
            //$scope.$emit('chooseEmployees', GetSelectedEmployees());
            var emps = GetSelectedEmployees();
            $scope.activity.EmployeeIDs = emps.EmployeeIDs;
            $scope.activity.EmployeeNames = emps.EmployeeNames;
            $scope.activity.EmployeeCount = $scope.Data.SelectedEmps.length;
            $('#modalSelectEmployeeItem').modal('hide');
        } else {
            utility.message("尚未选择员工。");
        }
    };

    $scope.init();
}]);





