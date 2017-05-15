angular.module('sltcApp')
.controller('personbasicCtrl', ['$rootScope', '$scope', '$state', 'utility', 'dictionary', 'webUploader', 'dc_PersonBasicRes', function ($rootScope,$scope, $state, utility, dictionary, webUploader, dc_PersonBasicRes) {
    $scope.FeeNo = $state.params.FeeNo;
    $scope.Data = {};
    $scope.currentItem = {};
    $scope.buttonShow = true;
    $scope.init = function () {

        $scope.Org = $rootScope.Global.Organization;
        webUploader.init('#FamilyPathPicker', { category: 'HomePhoto' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
            if (data.length > 0) {
        
                $scope.currentItem.EcologicalMap = data[0].SavedLocation;
                //$scope.Detail.PedigreeFileName = data[0].FileName;
                $scope.$apply();
            }
        });
    };
    //選中住民
    $scope.residentSelected = function (resident) {
        $scope.currentResident = resident;
        $scope.FeeNo = resident.FeeNo;
        $scope.sarch();

        $scope.currentItem = {};//清空編輯項
        if (angular.isDefined($scope.currentResident)) {
            $scope.buttonShow = false;
        }
        //选中住民后初始化表单部分字段

        $scope.currentItem.OrgId = resident.OrgId;
        $scope.currentItem.RegNo = resident.RegNo;
        //获得当前登陆用户信息
        $scope.curUser = utility.getUserInfo();
        $scope.currentItem.CreateBy = $scope.curUser.EmpNo;
        //$scope.currentItem.ApplyDate = new Date().format("yyyy-MM-dd");
    }
    $scope.sarch = function () {
        if (angular.isDefined($scope.FeeNo != "")) {
            dc_PersonBasicRes.get({ orgId: $scope.currentResident.OrgId, feeNo: $scope.FeeNo, idNo: '', name: '', currentPage: 1, pageSize: 10 }, function (data) {
          
                $scope.currentItem = data.Data[0];
                $scope.currentItem.BirthDate = new Date($scope.currentItem.BirthDate).format("yyyy-MM-dd");
                $scope.currentItem.InDate = new Date($scope.currentItem.InDate).format("yyyy年MM月dd日");
                $scope.currentItem.Age = (new Date().getFullYear() - new Date($scope.currentItem.BirthDate).getFullYear());
            });
        }
        
    }
    $scope.saveForm = function (item) {
            if (angular.isDefined(item.FeeNo)){

            if ($scope.basicForm.$valid) {//判断验证通过后才可以保存
                dc_PersonBasicRes.save(item, function (data) {
                    if (angular.isDefined(item.RegNo)) {
                        utility.message($scope.currentResident.Name + "的基本资料更新成功！");
                    }
                    else {
                        //$scope.Data.subsidys.push(data.Data);
                        //utility.message($scope.currentResident.Name + "的基本资料更新新成功！");
                    }
                });
            }
            else {
               // $scope.buttonShow = true;
                //验证没有通过
                $scope.getErrorMessage($scope.basicForm.$error);
                $scope.errs = $scope.errArr.reverse();
                var count = 0;
                for (var n = $scope.errs.length; n--;) {
                    utility.msgwarning($scope.errs[n]);
                    count++;
                    if (count > 2) break;
                }
            }
        }
        else {
            utility.message("請選擇住民！");
        }
    };
    $scope.AddLife = function () {
        alert("這裡只提供基本資料修改！")
    }
    $scope.clear = function () {
        $scope.currentItem.EcologicalMap = "";
    }
    $scope.changeBirthday = function (newValue) {
        $scope.currentItem.Age = new Date().getFullYear() - new Date(newValue).getFullYear();
    }
    $scope.keyup = function (x) {
        var l = x.length;
        if (l == 1) {
            //var regx = /^[A-Za-z]/;
            var regx = /^[Pp]/;
            var rs = regx.exec(x);
            if (rs == null) {
                $scope.currentItem.IdNo = "";
            }
        }
        else if (l > 1 && l <= 10) {

            var c = x.substring(l - 1)
            var regx = /[0-9]/;
            var rs = regx.exec(c);
            if (rs == null) {
                $scope.currentItem.IdNo = x.substring(0, l - 1)
            }

        }
        else {
            $scope.currentItem.IdNo = x.substring(0, 10)
        }
    };

    //验证信息提示
    $scope.getErrorMessage = function (error) {
        $scope.errArr = new Array();
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
            
                $.each(error.email, function (n, value) {
                    $scope.errArr.push(value.$name + "只能錄入數字");
                });
                
            });
            if (error.minlength) {
                $.each(error.minlength, function (n, value) {
                    if (value.$name == "身份證號")
                        $scope.errArr.push(value.$name + "格式： 首字母 P  开头+9位数字组成！");
                    else
                        $scope.errArr.push(value.$name + "錄入字符長度超過規定最小值");
                });

            }
            if (error.maxlength) {
                $.each(error.maxlength, function (n, value) {
                    if (value.$name == "身份證號")
                        $scope.errArr.push(value.$name + "格式： 首字母 P  开头+9位数字组成！");
                    else
                        $scope.errArr.push(value.$name + "錄入字符長度超過規定最大值");
                });
            }debugger
            if (error.pattern) {
                $.each(error.pattern, function (n, value) {
                    $scope.errArr.push(value.$name + "录入非法！");
                });
            }
        }

    };
    $scope.PrintPreview = function () {

        if (angular.isDefined($scope.FeeNo)) {
            window.open('/DC_Report/Preview?templateName=DCS1.3個案基本資料&recId=' + $scope.FeeNo);
        } else {
            utility.message("未获取到個案生活史记录,无法打印！");
        }

    }
    $scope.init();
}]);
