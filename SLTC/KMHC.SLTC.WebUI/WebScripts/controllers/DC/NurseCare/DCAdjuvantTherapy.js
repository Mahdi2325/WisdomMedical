angular.module("sltcApp").controller("DCAdjuvantTherapyCtrl", ['$rootScope', '$scope', 'DCAdjuvantTherapyRes', 'utility', '$state', function ($rootScope,$scope, DCAdjuvantTherapyRes, utility, $state) {
    $scope.FeeNo = $state.params.FeeNo;
    $scope.currentResident = {};
    $scope.partItem = {};
    $scope.currentItem = {};

    $scope.Data = {};

    $scope.residentSelected = function (resident) {
        $scope.buttonEditShow = false;
        $scope.buttonSaveShow = false;
        $scope.buttonHistoryShow = false;
        $scope.buttonPrintShow = false;
        //
        resident.Age = (new Date().getFullYear() - new Date(resident.BirthDate).getFullYear());
        $scope.currentResident = resident;
        $scope.currentResident.BirthDay = FormatDate(resident.BirthDate);
        $scope.residentList(resident.FeeNo, resident.RegNo);
    }
    //列印
    $scope.PrintPreview = function () {
        if (angular.isDefined($scope.currentItem.Id)) {
            if ($scope.currentItem.Id == 0)
            {
                utility.message("無打印數據！");
                return;
            }
            window.open('/DC_Report/PreviewNursingReport?templateName=DCN1.3個案個別化活動需求初評&id=' + $scope.currentItem.Id);
        } else {
            utility.message("無打印數據！");
        }

    }

    $scope.residentList = function (FeeNo, RegNo) {
        //加载最近一笔数据到表单
        DCAdjuvantTherapyRes.get({ feeNo: FeeNo, regNo: RegNo }, function (data) {
            if (data.Data == null)
            {
                DCAdjuvantTherapyRes.get({ feeNo: resident.FeeNo, regNo: resident.RegNo, mark: "" }, function (data) {
                    $scope.partItem = data.Data;
                    $scope.currentItem = data.Data;
                });
            }
            else
            {
                $scope.currentItem = data.Data;
                $scope.currentItem.EvalDate = FormatDate($scope.currentItem.EvalDate);
                $scope.currentItem.NextevalDate = FormatDate($scope.currentItem.NextevalDate);
            }

        })

        $scope.Data.AdjuvantTherapyList = {};
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.pageInfo.PageSize = 10;
        $scope.options.params.feeNo = FeeNo;
    }

    //保存
    $scope.save = function (item) {
        if (item.EvalDate == "" || item.EvalDate == null)
        {
            utility.msgwarning("請填寫收案日期");
            return;
        }
        if (angular.isDefined($scope.currentResident)) {
            $scope.currentItem.FeeNo = $scope.currentResident.FeeNo;
            $scope.currentItem.RegNo = $scope.currentResident.RegNo;
            $scope.currentItem.RegName = $scope.currentResident.Name;
            $scope.currentItem.ResidentNo = $scope.currentResident.ResidentNo;
            $scope.currentItem.Sex = $scope.currentResident.Sex;
            $scope.currentItem.BirthDate = $scope.currentResident.BirthDay;
            $scope.currentItem.InDate = $scope.currentResident.InDate;
            DCAdjuvantTherapyRes.save(item, function (data) {
                $scope.Data.medicineList = {};
                $scope.options.params.feeNo = $scope.currentResident.FeeNo;
                $scope.currentItem.Id = data.Id;
                utility.message("儲存成功！");
            })
        }
        else {
            utility.message("請選擇住民");
        }

    }

    $scope.init = function () {
        $scope.OrgName= $rootScope.Global.Organization;
        $scope.buttonEditShow = true;
        $scope.buttonSaveShow = true;
        $scope.buttonHistoryShow = true;
        $scope.buttonPrintShow = true;
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: DCAdjuvantTherapyRes,//异步请求的res
            success: function (data) {//请求成功时执行函数
                $scope.Data.AdjuvantTherapyList = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            },
            params: {
                feeNo: -1
            }

        }
    }

    $scope.clear = function () {
        DCAdjuvantTherapyRes.get({ feeNo: $scope.currentResident.FeeNo, regNo: $scope.currentResident.RegNo, mark: "" }, function (data) {
            $scope.currentItem = data.Data;
        });
    }

    $scope.showHistory = function () {
        $scope.options.search();
        $("#AdjuvantTherapyList").modal("toggle");
    };

    $scope.AdjuvantTherapySelected = function (item) {
        $scope.currentItem = item;
        $("#AdjuvantTherapyList").modal("toggle");
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