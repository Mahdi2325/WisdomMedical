angular.module("sltcApp")
.controller("assignWorkNoteCtrl", ['$scope', '$state', 'utility', 'dc_AssignWorkNoteRes', '$filter', function ($scope, $state, utility, dc_AssignWorkNoteRes, $filter) {
  
    $scope.init = function () {
        $scope.maxErrorTips = 3;
        $scope.Data = {};
        $scope.EmpList = [];
        $scope.AssignNameList = '';
    }

    $scope.init();


    $scope.SaveTask = function () {
        var errorTips = 0;
        if (angular.isDefined($scope.myForm.$error.required)) {
            var msg = "";
            for (var i = 0; i < $scope.myForm.$error.required.length; i++) {
                msg = $scope.myForm.$error.required[i].$name + " 為必填項";
                utility.msgwarning(msg);
                errorTips++;
                if (errorTips >= $scope.maxErrorTips) {
                    return;
                }
            }
        }

        if (angular.isDefined($scope.myForm.$error.maxlength)) {
            var msg = "";
            for (var i = 0; i < $scope.myForm.$error.maxlength.length; i++) {
                msg = $scope.myForm.$error.maxlength[i].$name + "超過設定長度 ";
                utility.msgwarning(msg);
                errorTips++;
                if (errorTips >= $scope.maxErrorTips) {
                    return;
                }
            }
        }
        if (errorTips > 0) { return; }
      
        var list = { empList: $scope.EmpList, PerformDate: $scope.Data.PerformDate, Content: $scope.Data.Content, ID: 0 };
        dc_AssignWorkNoteRes.save(list, function (res) {
            $scope.init();
            utility.message("儲存成功!");
        })
    }

    $scope.$on("reAllocate", function (event, data) {
        $scope.EmpList = data;
        $('#modalAssignEmp').modal('hide');
        $.each(data, function (n, item) {
            if (n == 0) {
                $scope.AssignNameList = item.EmpName;
            } else {
                $scope.AssignNameList += ','+item.EmpName;
            }
        });
    });


}])
