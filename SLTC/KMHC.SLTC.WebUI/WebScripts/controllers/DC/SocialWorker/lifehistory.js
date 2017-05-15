//
angular.module('sltcApp')
.controller('lifehistoryCtrl', ['$rootScope', '$scope', 'utility', '$state', 'dictionary', 'dc_PersonBasicRes', 'dc_LifeHistoryRes', function ($rootScope,$scope, utility, $state, dictionary, dc_PersonBasicRes, dc_LifeHistoryRes) {
    $scope.FeeNo = $state.params.FeeNo;
    $scope.Data = {};
    $scope.currentItem = {};
    $scope.buttonShow = true;
    $scope.Flag = false;
    $scope.init = function () {
        $scope.Org = $rootScope.Global.Organization;
    };
    //選中住民
    $scope.residentSelected = function (resident) {
        $scope.currentResident = resident;
        $scope.Flag = false;//每次重新选择住民后初始化一下标识，主要用途是防止重复添加数据
        $scope.currentItem = {};//清空編輯項
        
        if (angular.isDefined($scope.currentResident)) {
            $scope.buttonShow = false;
        }

        
        //获得当前登陆用户信息
        $scope.curUser = utility.getUserInfo();
        $scope.currentItem.CreateBy = $scope.curUser.EmpNo;
        
        $scope.FeeNo = resident.FeeNo;
       
        //选中住民后初始化表单部分字段
        $scope.currentItem.Name = resident.Name;
        $scope.currentItem.NickName = resident.NickName;
        $scope.currentItem.ResidentNo = resident.ResidentNo;
        $scope.currentItem.BirthPlace = resident.BirthPlace;
        $scope.currentItem.RegNo = resident.RegNo;
        $scope.sarch();
    }
    $scope.sarch = function () {
        if (angular.isDefined($scope.FeeNo)) {
            //dc_PersonBasicRes.get({ orgId: $scope.currentResident.OrgId, regNo: $scope.currentResident.RegNo, currentPage: 1, pageSize: 10 }, function (data) {
            //    debugger
            //    $scope.currentBasic = data.Data[0];
            //});
  
            dc_LifeHistoryRes.get({ feeNo: $scope.FeeNo, currentPage: 1, pageSize: 10 }, function (data) {
                if (data.Data[0] != null) {
                  
                    $scope.currentItem = data.Data[0];
                    $scope.Flag = true;
                }
            });
        }

    }
    $scope.saveForm = function (item) {
    
        if ($scope.phForm.$valid) {
           
            $scope.currentItem.FeeNo = $scope.FeeNo;
            $scope.currentItem.NickName = $scope.currentResident.NickName;
            $scope.currentItem.BirthPlace = $scope.currentResident.BirthPlace;
            dc_LifeHistoryRes.save(item, function (data) { 
                if (angular.isDefined(item.FeeNo)) {
                    utility.message($scope.currentResident.Name + "的生活資料儲存成功！");

                    $scope.currentItem.Id = data.Data.Id;
                }
                else {

                }
            });
        }
        else {
            //验证没有通过
            $scope.getErrorMessage($scope.phForm.$error);
            $scope.errs = $scope.errArr.reverse();
            for (var n = 0; n < $scope.errs.length; n++) {
                if (n != 3) {
                    utility.msgwarning($scope.errs[n]);
                }
                //if (n > 2) break;
            }
        }
            
      
    };
    $scope.AddLife = function () {
        // alert("這裡只提供基本資料修改！")
        $scope.currentItem = {};
    }
    $scope.clear = function () {
        $scope.currentItem.EcologicalMap = "";
    }
    $scope.changeBirthday = function (newValue) {
        $scope.currentItem.Age = new Date().getFullYear() - new Date(newValue).getFullYear();
    }

    $scope.PrintPreview = function () {
      
        if (angular.isDefined($scope.currentItem.Id)) {
            window.open('/DC_Report/Preview?templateName=DCS1.1個案生活史&recId=' + $scope.currentItem.Id);
        } else {
            utility.message("未获取到個案生活史记录,无法打印！");
        }
       
    }
    //验证信息提示
    $scope.getErrorMessage = function (error) {
        $scope.errArr = new Array();
        //var errorMsg = '';
        if (angular.isDefined(error)) {
            if (error.required) {
                $.each(error.required, function (n, value) {
                    $scope.errArr.push(value.$name + "不能為空");
                });
            }
            if (error.email) {
                $.each(error.email, function (n, value) {
                    $scope.errArr.push(value.$name + "郵箱驗證失敗");
                });
            }
            if (error.number, function (n, value) {
                $scope.errArr.push(value.$name + "只能錄入數字");
            });
            if (error.minlength) {
                $.each(error.minlength, function (n, value) {
                    $scope.errArr.push(value.$name + "超過設定最小錄入長度！");
                });

            }
            if (error.maxlength) {
                $.each(error.maxlength, function (n, value) {
           
                    $scope.errArr.push(value.$name + "超過設定最大錄入長度！");
                });
            }
            //return errorMsg;
        }

    };
    $scope.init();
}]);
