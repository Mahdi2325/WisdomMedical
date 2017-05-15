//收案Or结案
angular.module('sltcApp')
.controller('ipdRegOutCtrl', ['$rootScope', '$scope', '$location', 'utility', '$state', 'dc_PersonBasicRes', 'dc_IpdRegRes', 'empFileRes', function ($rootScope, $scope, $location, utility, $state, dc_PersonBasicRes, dc_IpdRegRes, empFileRes) {
    $scope.FeeNo = $state.params.FeeNo;
    $scope.currentItem = {};
    $scope.currentBasic = {};
    $scope.editOrAdd = "add";
    $scope.ipdFlag = {};
    $scope.currentItem.IdNo = '';
    $scope.buttonShow = true;
    $scope.currentResident = {};
    $scope.IsDisabled = true;
    $scope.resetSave = false;
    $scope.init = function () {
        $scope.Org = $rootScope.Global.Organization;

        $scope.IsInvalid = false;
        if ($scope.FeeNo != "")
            $scope.sarch();
        //获取下拉字典数据

        empFileRes.get({ empNo: '', empName: '', empGroup: '', currentPage: 0, pageSize: 0 }, function (response) {
            var dest = getEmpMemberByGroup(response.Data);
            if (!isEmpty(dest)) {
                for (var i = 0; i < dest.length; i++) {
                    if (dest[i].EmpGroup == "001") {
                        $scope.NurseNoData = dest[i].data;
                    } else if (dest[i].EmpGroup == "002") {
                        $scope.CarerData = dest[i].data;
                    } else if (dest[i].EmpGroup == "003") {
                        $scope.NutritionistData = dest[i].data;
                    } else if (dest[i].EmpGroup == "005") {
                        $scope.PhysiotherapistData = dest[i].data;
                    } else if (dest[i].EmpGroup == "006") {
                        $scope.DoctorData = dest[i].data;
                    } else if (dest[i].EmpGroup == "009") {//9對應照服員
                        $scope.NurseAides = dest[i].data;
                    }
                }
            }
        });
        $scope.currentItem.OutDate = new Date().format("yyyy-MM-dd");
    };

    function getEmpMemberByGroup(arr) {
        var map = {}, dest = [];
        for (var i = 0; i < arr.length; i++) {
            var ai = arr[i];
            if (!map[ai.EmpGroup]) {
                dest.push({ EmpGroup: ai.EmpGroup, data: [ai] });
                map[ai.EmpGroup] = ai;
            } else {
                for (var j = 0; j < dest.length; j++)
                { var dj = dest[j]; if (dj.EmpGroup == ai.EmpGroup) { dj.data.push(ai); break; } }
            }
        }
        return dest;
    };
    function isEmpty(value) {
        if (value == null || value == "" || value == "undefined" || value == undefined || value == "null") { return true; } else {  //value = value.replace(/\s/g, "");
            if (value == "") {
                return true;
            }
            return false;
        }
    }
    

    $scope.checkIdNo = function () {
        if (angular.isDefined($scope.currentItem.IdNo)) {
            dc_IpdRegRes.get({ idNo: $scope.currentItem.IdNo, type: 1 }, function (data) {

                if (data.Data != null && data.Data.IpdFlag == "O") {
                    alert("已存在個案信息，建議您為此個案進行[重開案]作業！");
                    $scope.resetSave = true;
                    $scope.currentItem = data.Data;
                    $scope.IsDisabled = true;
                    //debugger;
                    //$scope.FeeNo = data.Data.FeeNo;
                    //$scope.sarch();
                }
            });
        }

    }
    //查询用户基本资料
    $scope.sarch = function () {

        if (angular.isDefined($scope.FeeNo)) {
            $scope.buttonShow = false;
            dc_IpdRegRes.get({ feeNo: $scope.FeeNo, currentPage: 1, pageSize: 10 }, function (data) {
            
                if ($state.current.name != "IpdregOut") {
                    $scope.currentItem = data.Data[0];
                    $scope.ipdFlag = data.Data[0].IpdFlag;
                }
                else {
                    if (data.Data[0].IpdFlag == "I") {
                        $scope.currentItem.RegName = $scope.currentResident.Name;
                        $scope.currentItem.BirthDate = new Date($scope.currentResident.BirthDate).format("yyyy-MM-dd");
                        $scope.currentItem.IdNo = $scope.currentResident.IdNo;
                        $scope.currentItem.MerryState = data.Data[0].MerryState;
                        $scope.currentItem.Phone = data.Data[0].Phone;
                        $scope.currentItem.PermanentAddress = data.Data[0].PermanentAddress;
                        $scope.currentItem.LivingAddress = data.Data[0].LivingAddress;
                        $scope.currentItem.InDate = $scope.currentResident.InDate;
                        $scope.currentItem.StationCode = data.Data[0].StationCode;
                    }
                    else {
                        $scope.currentItem = data.Data[0];
                    }
                }
                if ($scope.ipdFlag == "O")
                    $scope.resetSave = true;
            });
        }

    }

    //選中住民
    $scope.residentSelected = function (resident) {

        $scope.FeeNo = resident.FeeNo;
        $scope.currentResident = resident;
        $scope.currentItem = {};//清空編輯項
        $scope.sarch();
        $scope.editOrAdd = "edit";
        if (angular.isDefined($scope.currentResident)) {
            $scope.buttonShow = false;
        }
        //获得当前登陆用户信息
        $scope.curUser = utility.getUserInfo();
        $scope.currentItem.CreateBy = $scope.curUser.EmpNo;
        if ($scope.currentResident.IpdFlag == "I") {
            $scope.resetSave = false;
        }
        $scope.IsDisabled = true;
    }
  
    //保存结案
    $scope.saveOut = function (item) {
        
        if (window.confirm("您確定要進行結案操作嗎?")) {
            if ($scope.outForm.$valid) {
                $scope.currentItem.isAdd = "2";
                item.FeeNo = $scope.FeeNo;
                item.RegNo = $scope.currentResident.RegNo;
                item.StationCode = $scope.currentItem.StationCode;
                dc_IpdRegRes.save(item, function (data) {
                    if (data.ResultCode == -1) {
                        utility.message(data.ResultMessage);
                    }
                    else if (data.ResultCode == 0) {
                        utility.message($scope.currentResident.Name + " 於  " + new Date().format("yyyy-MM-dd") + "  结案成功！");
                        $state.go('IpdregOut', null, {
                            reload: true
                        });
                    }
                });
            }
            else {
                //验证没有通过
                $scope.getErrorMessage($scope.outForm.$error);
                $scope.errs = $scope.errArr.reverse();
                for (var n = 0; n < $scope.errs.length; n++) {
                    if (n != 3) {
                        utility.msgwarning($scope.errs[n]);
                    }
                    //if (n > 2) break;
                }
            }
        }
    }
    //身份证输入完成后回车校验事件
    $scope.myKeyup = function (e) {
        var keycode = window.event ? e.keyCode : e.which;
        if (keycode == 13) {
            $scope.checkPerson();
        }
    };

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
                    $scope.errArr.push(value.$name + "格式： 首字母 P  开头+9位数字组成！");
                });

            }
            if (error.maxlength) {
                $.each(error.maxlength, function (n, value) {
                    if (value.$name == "簡易服務摘要") {
                        $scope.errArr.push(value.$name + "錄入非法,已超過最大設定長度！");
                    } else {
                        $scope.errArr.push(value.$name + "格式： 首字母 P 开头+9位数字组成！");
                    }

                });
            }
            //return errorMsg;
        }

    };
    $scope.PrintPreview = function (type) {

        if (angular.isDefined($scope.FeeNo)) {
            if (type == 1)
                window.open('/DC_Report/Preview?templateName=DCS1.7個案收案表&recId=' + $scope.FeeNo);
            else
                window.open('/DC_Report/Preview?templateName=DCS1.5個案結案表&recId=' + $scope.FeeNo);
        } else {
            utility.message("未获取到個案生活史记录,无法打印！");
        }

    }

    $scope.init();
}]);
