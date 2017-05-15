angular.module('sltcApp')
.controller('ondaylifeCtrl', ['$rootScope', '$scope', 'utility', '$state', 'dictionary', 'dc_PersonDayLifeRes', function ($rootScope,$scope, utility, $state, dictionary, dc_PersonDayLifeRes) {
    $scope.Data = {};
    $scope.FeeNo = $state.params.FeeNo;
    $scope.currentItem = {};
    $scope.buttonShow = true;
    $scope.Flag = false;
    $scope.currentItem.Id = 0;
    $scope.init = function () {
        $scope.Org = $rootScope.Global.Organization;
    };
    //選中住民
    $scope.residentSelected = function (resident) {
        $scope.currentResident = resident;

        $scope.currentItem = {};//清空編輯項
        if (angular.isDefined($scope.currentResident)) {
            $scope.buttonShow = false;
        }
        
        $scope.currentItem.OrgId = resident.OrgId;
        $scope.currentItem.RegNo = resident.RegNo;
        //获得当前登陆用户信息
        $scope.curUser = utility.getUserInfo();
        $scope.currentItem.CreateBy = $scope.curUser.EmpNo;
        $scope.currentResident.BirthDate = new Date(resident.BirthDate).format("yyyy-MM-dd");
  
        $scope.FeeNo = resident.FeeNo;
        $scope.search();
    }
    $scope.search = function () {
        
        if (angular.isDefined($scope.FeeNo) || $scope.FeeNo != "") {
            dc_PersonDayLifeRes.get({ id: $scope.FeeNo }, function (data) {
                $scope.currentItem = data.Data;
                
              //  $scope.currentItem.BirthDate = new Date($scope.currentItem.BirthDate).form("yyyy-MM-dd");
                if (data.Data != null) {
                    $scope.Flag = true;
                }
            });
        }
        else $scope.currentItem.Id = 0;
    }
    $scope.saveForm = function (item) {
       // if (!$scope.Flag) {
            $scope.currentItem.FeeNo = $scope.currentResident.FeeNo;
            $scope.currentItem.Name = $scope.currentResident.Name;
            dc_PersonDayLifeRes.save(item, function (data) {
                if (angular.isDefined(item.FeeNo)) {
                    utility.message($scope.currentResident.Name + "的生活资料储存成功！");
                    $scope.currentItem.Id = data.Data.Id;
                }
                else {
                    //$scope.Data.subsidys.push(data.Data);
                    //utility.message($scope.currentResident.Name + "的基本资料更新新成功！");
                }
            });
        //}
        //else {
        //    utility.message($scope.currentResident.Name + "的1天生活资料已经存在,請勿重複添加！");
        //}
    };
    $scope.PrintPreview = function (id) {
    
        if (angular.isDefined(id) && id!=undefined) {
            window.open('/DC_Report/Preview?templateName=DCS1.8一天的生活&recId=' + $scope.currentItem.Id)
        } else {
            utility.message("未获取到個案生活史记录,无法打印！");
        }

    }
    $scope.init();
}]);
