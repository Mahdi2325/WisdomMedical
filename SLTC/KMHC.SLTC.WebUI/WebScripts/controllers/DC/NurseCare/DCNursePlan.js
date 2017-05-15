angular.module("sltcApp").controller("DCNursePlanCtrl", ['$rootScope', '$scope', 'DCNursePlanRes', 'DCNurseRequirementEvalRes', 'utility', '$state', function ($rootScope, $scope, DCNursePlanRes, DCNurseRequirementEvalRes, utility, $state) {

    $scope.FeeNo = $state.params.FeeNo;
    $scope.Data = {};
    $scope.currentItem = {};
    $scope.Data.problemList = {};
    $scope.Data.diaList = {};
    $scope.Data.activityList = {};
    $scope.Data.regCplList = {};
    $scope.npItem = {};
    $scope.showEvaluationValue = true;
    $scope.residentSelected = function (resident) {
        //
        resident.Age = (new Date().getFullYear() - new Date(resident.BirthDate).getFullYear());
        $scope.currentResident = resident;
        $scope.currentResident.BirthDay = FormatDate(resident.BirthDate);
        $scope.residentList(resident.FeeNo, resident.RegNo);

        DCNurseRequirementEvalRes.get({ feeNo: resident.FeeNo }, function (data) {
            if (data.Data == null) {
                $scope.buttonReadShow = true;
                return;
            }
            DCNursePlanRes.get({ Id: data.Data.Id, regNo: RegNo }, function (data) {
                if (data.Data == null) {
                    $scope.Data.regCplList = {};
                }
                else {
                    $scope.Data.regCplList = data.Data;
                }

            })
            $scope.buttonReadShow = false;
            $scope.npItem = data.Data;
            if ($scope.npItem.Chinesedrugflag) {
                $scope.npItem.Chinesedrugflag = "有";
            }
            else {
                $scope.npItem.Chinesedrugflag = "無";
            }
            $scope.showChinesedrug();
            if ($scope.npItem.Westerndrugflag) {
                $scope.npItem.Westerndrugflag = "有";

            }
            else {
                $scope.npItem.Chinesedrugflag = "無";
            }
            $scope.showWesterndrug();
            if ($scope.npItem.Fall1Year) {
                $scope.npItem.Fall1Year = "有";

                if ($scope.npItem.Injuredflag) {
                    $scope.npItem.Injuredflag = "有";

                }
                else {
                    $scope.npItem.Chinesedrugflag = "無";
                }
            }
            else {
                $scope.npItem.Chinesedrugflag = "無";
            }
        });

    }


    $scope.residentList = function (FeeNo, RegNo) {
        $scope.cancelEdit();
        //加载最近一笔数据到表单
        DCNursePlanRes.get({ feeNo: FeeNo, regNo: RegNo }, function (data) {
            if (data.Data == null) {
                $scope.Data.regCplList = {};
            }
            else {
                $scope.Data.regCplList = data.Data;
            }

        })

        //$scope.Data.AdjuvantTherapyList = {};
        //$scope.options.pageInfo.CurrentPage = 1;
        //$scope.options.pageInfo.PageSize = 10;
        //$scope.options.params.feeNo = FeeNo;
    }

    $scope.save = function (item) {
        if (angular.isDefined($scope.currentResident)) {
            $scope.currentItem.FeeNo = $scope.currentResident.FeeNo;
            $scope.currentItem.RegNo = $scope.currentResident.RegNo;
            $scope.currentItem.RegName = $scope.currentResident.Name;
            $scope.currentItem.ResidentNo = $scope.currentResident.ResidentNo;
            $scope.currentItem.Sex = $scope.currentResident.Sex;
            $scope.currentItem.BirthDate = $scope.currentResident.BirthDay;
            DCNursePlanRes.save(item, function (data) {
                if (angular.isDefined(item.SeqNo)) {
                    $scope.currentItem = {};
                    $("#NursingEdit").modal("toggle");
                }
                else {
                    $scope.Data.regCplList.push(data.Data);
                    $scope.currentItem = {};
                    $scope.Data.diaList = {};
                    $scope.Data.activityList = {};
                    $scope.problemType = {};
                    $scope.editShow = false;
                }
                utility.message("儲存成功！");
            })
        }
        else {
            utility.message("請選擇住民");
        }

    }

    $scope.editItem = function (item) {
        $scope.editShow = false;
        $scope.currentItem = {};
        $scope.currentItem = item;
        $("#NursingEdit").modal("toggle");
    }

    $scope.init = function () {
        $scope.OrgName = $rootScope.Global.Organization;
        $scope.editShow = false;
        $scope.actionShow = false;


        DCNursePlanRes.get({ majorType: "護理" }, function (data) {
            $scope.Data.problemList = {};
            $scope.Data.problemList = data.Data;
        });
    }

    $scope.changeLevel = function (val) {
        for (var i = 0; i < $scope.Data.problemList.length; i++) {
            if ($scope.Data.problemList[i].CpNo == val) {
                $scope.currentItem.ProblemType = $scope.Data.problemList[i].ProblemType;
                $scope.currentItem.MajorType = $scope.Data.problemList[i].MajorType;
                break;
            }
        }

        $scope.currentItem.CpDia = "";
        $scope.currentItem.CplActivity = "";
        DCNursePlanRes.get({ cpNo: val }, function (data) {
            $scope.Data.activityList = {};
            $scope.Data.activityList = data.Data;
        });
        DCNursePlanRes.get({ cpNo: val, mark: "" }, function (data) {
            $scope.Data.diaList = {};
            $scope.Data.diaList = data.Data;
        });
    }

    $scope.selectDiaItem = function (val) {
        if (angular.isDefined($scope.currentItem.CpDia)) {
            if ($scope.currentItem.CpDia == "") {
                $scope.currentItem.CpDia = val;
            }
            else {
                $scope.currentItem.CpDia = $scope.currentItem.CpDia + "\r\n" + val;
            }
        }
    }

    $scope.selectActivityItem = function (val) {
        if (angular.isDefined($scope.currentItem.CplActivity)) {
            if ($scope.currentItem.CplActivity == "") {
                $scope.currentItem.CplActivity = val;
            }
            else {
                $scope.currentItem.CplActivity = $scope.currentItem.CplActivity + "\r\n" + val;
            }
        }
    }

    $scope.addItem = function () {
        $scope.currentItem = {};
        $scope.Data.diaList = {};
        $scope.Data.activityList = {};
        $scope.problemType = {};
        $scope.editShow = true;
    }


    $scope.showNursingPlan = function () {
        $("#NursingPlanEdit").modal("toggle");
    }


    $scope.action = function () {
        $scope.actionShow = true;
    }

    $scope.cancelEdit = function () {
        $scope.currentItem = {};
        $scope.Data.diaList = {};
        $scope.Data.activityList = {};
        $scope.problemType = {};
        $scope.editShow = false;
    }
    $scope.editEvaluationValue = function () {
        $scope.showEvaluationValue = false;
    }
    $scope.showReson = function (val) {
        if (val == "無法執行") {
            $scope.hideReson = true;
        }
        else {
            $scope.hideReson = false;
        }
    }
    function FormatDate(strTime) {
        if (strTime == null || strTime == "") {
            return "";
        }
        var date = new Date(strTime);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    $scope.init();
}])