function isEmpty(value) {
    if (value == null || value == "" || value == "undefined" || value == undefined || value == "null") { return true; } else {  //value = value.replace(/\s/g, "");
        if (value == "") {
            return true;
        }
        return false;
    }
}
function DateDiff(endDate, startDate) {
    if (isEmpty(endDate) || isEmpty(startDate)) {
        return '';
    }
    var s1 = new Date(startDate);
    var s2 = new Date(endDate);
    var total = (s2 - s1) / 1000;
    var day = parseInt(total / (24 * 60 * 60));//计算整数天数
    return day;
}
angular.module("sltcApp")
.controller("residentNavigateCtrl", ['$scope', '$state', 'utility', 'dc_AssignJobsRes', 'dc_AssignTaskRes', '$filter', function ($scope, $state, utility, dc_AssignJobsRes, dc_AssignTaskRes, $filter) {
    $scope.Data = {};
    $scope.LastData = {};
    $scope.filter = {Assignee:$scope.$root.user.id, RecStatus: null, NewRecFlag: null, AssignStartDate: null, AssignEndDate: null };
    $scope.init = function () {
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: dc_AssignJobsRes,//异步请求的res
            params: $scope.filter,
            success: function (data) {//请求成功时执行函数
                $scope.Data = data.Data;
                $scope.LastData = angular.copy(data.Data);
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 20
            }
          
        }
    }

    $scope.init();

    $scope.Search = function () {

        if ($scope.filter.AssignStartDate != "" && $scope.filter.AssignEndDate != "") {
            var days = DateDiff($scope.filter.AssignEndDate, $scope.filter.AssignStartDate)
            if (days < 0) {
                utility.message("結束日期不能小于開始日期");
                return;
            } 
        };

        $scope.options.params.AssignStartDate = $scope.filter.AssignStartDate;
        $scope.options.params.AssignEndDate = $scope.filter.AssignEndDate;
        $scope.options.search();
    };
    $scope.SearchUnFinish = function () {
        $scope.options.params.RecStatus = false;
        $scope.Search();
    }
    $scope.SearchFinish = function () {
        $scope.options.params.RecStatus = true;
        $scope.Search();
    }
    $scope.SearchAll = function () {
        $scope.options.params.AssignStartDate = null;
        $scope.options.params.AssignEndDate = null;
        $scope.options.params.RecStatus = null;
        $scope.options.params.NewRecFlag = null;
        $scope.options.search();
    }
    $scope.RestoreBeforeEdit = function (Item) {
        for (var i = 0; i < $scope.LastData.length; i++) {
            if (Item.ID == $scope.LastData[i].ID) {
                Item.UnFinishReason = $scope.LastData[i].UnFinishReason;
                Item.PerformDate = $scope.LastData[i].PerformDate;
                Item.FinishDate = $scope.LastData[i].FinishDate;
                break;
            }
        }
    }
    $scope.BeforeEdit = function () {
        $scope.LastData = angular.copy($scope.Data);
    }
    $scope.ChangeStatus = function (event, Item) {
       if (event.target.checked) {
            Item.FinishDate = $filter("date")(new Date(), "yyyy-MM-dd");
        } else {
            Item.FinishDate = null;
       }
       Item.RecStatus = event.target.checked;
       dc_AssignJobsRes.get({Id:Item.ID,recStatus:Item.RecStatus,finishDate:Item.FinishDate }, function (data) {
       });
    }
    $scope.ShowModal = function (id) {
        $scope.ReAllocateId = id;
    }

    $scope.SaveTask = function (Item) {
        dc_AssignJobsRes.save(Item, function(data) {
        });
    }

    $scope.$on("reAllocate", function (event, data) {
        var ID = $scope.ReAllocateId;
        dc_AssignTaskRes.save({ ID: ID, empList: data }, function (res) {
            utility.message("重新分配成功");
            //for (var i = 0; i < $scope.Data.length; i++) {
            //    if (ID == $scope.Data[i].ID) {
            //        $scope.Data.splice($scope.Data.indexOf($scope.Data[i]), 1);
            //        break;
            //    }
            //}
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.search();
            //$scope.init();
            //$scope.$apply();//需要手动刷新 
        })
        $('#modalAssignEmp').modal('hide');
    
    });

   
}]).controller("assignTaskEmpModalCtr", ['$scope', '$http', '$state', '$location', 'dc_AssignTaskRes', 'utility', function ($scope, $http, $state, $location, dc_AssignTaskRes, utility) {
    $scope.Data = {};
    $scope.EmpGroup = {};
    $scope.init = function () {
        dc_AssignTaskRes.get({ empNo: $scope.$root.user.id }, function (req) {
            $scope.Data = req.Data;
            $scope.EmpGroup = getEmpByGroup(req.Data);
        });
 
    };

        $scope.ChangeStatus = function (event, Item) {
            Item.Checked = event.target.checked;
        }

   

    $scope.AssignTask  = function () {
        var newArr = $.grep($scope.Data, function (item,i) {
            return item.Checked == true;
        });
        if (newArr.length > 0) {
            $scope.init();
            $scope.$emit('reAllocate', newArr);
        } else {
            utility.message("未選擇照會人員!");
        }
      
    };

    $scope.init();

}]);

function getEmpByGroup(arr) {
    var map = {}, dest = [];
    for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.EmpGroup]) {
            dest.push({ EmpGroup: ai.EmpGroup,EmpGroupName:ai.EmpGroupName, data: [ai] });
            map[ai.EmpGroup] = ai;
        } else {
            for (var j = 0; j < dest.length; j++)
            { var dj = dest[j]; if (dj.EmpGroup == ai.EmpGroup) { dj.data.push(ai); break; } }
        }
    }
    return dest;
}
