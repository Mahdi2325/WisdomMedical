angular.module("sltcApp").controller("DCBasicDataArrangementCtrl", ['$rootScope', '$scope', 'DCBasicDataArrangementRes', 'utility', '$state', function ($rootScope, $scope, DCBasicDataArrangementRes, utility, $state) {
    $scope.FeeNo = $state.params.FeeNo;
    $scope.currentItem = {};
    $scope.Data = {};
    $scope.currentCnt = 0;
    $scope.init = function () {
        $scope.OrgName = $rootScope.Global.Organization;
        $scope.buttonEditShow = true;
        $scope.buttonSaveShow = true;
        $scope.buttonHistoryShow = true;
        $scope.buttonPrintShow = true;
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: DCBasicDataArrangementRes,//异步请求的res
            success: function (data) {//请求成功时执行函数
                $scope.Data.BasicDataArrangementList = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            },
            params: {
                feeNo: -1
            }

        }
    }

    $scope.residentSelected = function (resident) {

        $scope.buttonEditShow = false;
        $scope.buttonSaveShow = false;
        $scope.buttonHistoryShow = false;
        $scope.buttonPrintShow = false;

        $scope.currentResident = resident;
        //加载最近一笔数据到表单
        DCBasicDataArrangementRes.get({ feeNo: resident.FeeNo }, function (data) {
            if (data.Data == null) {
                DCBasicDataArrangementRes.get({ feeNo: resident.FeeNo, regNo: resident.RegNo, cnt: 1 }, function (data) {
                    if (data.Data != null) {
                        $scope.currentItem = data.Data;
                    }
                    else {
                        $scope.currentItem = {};
                    }
                    //
                    $scope.currentItem.Cnt = "1";
                    $scope.currentItem.RecordDate = FormatDate("");
                    //
                    $scope.currentItem.FeeNo = resident.FeeNo;
                    $scope.currentItem.RegName = resident.Name;
                    $scope.currentItem.RegNo = resident.RegNo;
                    $scope.currentItem.ResidentNo = resident.ResidentNo;
                    $scope.currentItem.BirthDate = FormatDate(resident.BirthDate);

                });
            }
            else {
                $scope.currentItem = data.Data;
                $scope.currentCnt = data.Data.Cnt;
                //
                $scope.currentItem.FeeNo = resident.FeeNo;
                $scope.currentItem.RegName = resident.Name;
                $scope.currentItem.RegNo = resident.RegNo;
                $scope.currentItem.ResidentNo = resident.ResidentNo;
                $scope.currentItem.BirthDate = FormatDate(resident.BirthDate);
            }

        });
        //加载该住民所有历史记录
        $scope.Data.BasicDataArrangementList = {};
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.pageInfo.PageSize = 10;
        $scope.options.params.feeNo = resident.FeeNo;
        $scope.options.search();
    }

    $scope.addBasicData = function () {
        //
        if (angular.isDefined($scope.currentItem.Id)) {
            if ($scope.currentItem.Id != 0) {

                //
                var cnt = $scope.currentCnt + 1;

                //if ($scope.currentCnt == "1") {
                //    cnt = 2;
                //}
                //else if ($scope.currentCnt == "2") {
                //    cnt = 3;
                //}
                //else if ($scope.currentCnt == "3") {
                //    cnt = 4;
                //}
                //else if ($scope.currentCnt == "4") {
                //    cnt = 1;
                //}
                //else {
                //    cnt = 1;
                //}
                DCBasicDataArrangementRes.get({ feeNo: $scope.currentResident.FeeNo, regNo: $scope.currentResident.RegNo, cnt: cnt }, function (data) {

                    $scope.currentItem = {};
                    if (data.Data != null) {
                        $scope.currentItem = data.Data;
                    }
                    //
                    $scope.currentItem.Cnt = cnt;
                    $scope.currentItem.RecordDate = FormatDate("");
                    //
                    $scope.currentItem.FeeNo = $scope.currentResident.FeeNo;
                    $scope.currentItem.RegName = $scope.currentResident.Name;
                    $scope.currentItem.RegNo = $scope.currentResident.RegNo;
                    $scope.currentItem.ResidentNo = $scope.currentResident.ResidentNo;
                    $scope.currentItem.BirthDate = FormatDate($scope.currentResident.BirthDate);


                });
            }
        }

    }

    $scope.saveBasicData = function (item) {
        if (angular.isDefined($scope.BdFrom.$error.required)) {
            for (var i = 0; i < $scope.BdFrom.$error.required.length; i++) {
                utility.msgwarning($scope.BdFrom.$error.required[i].$name + "為必填項！");
                if (i > 1) {
                    return;
                }
            }
            return;
        }

        if (angular.isDefined($scope.BdFrom.$error.maxlength)) {
            for (var i = 0; i < $scope.BdFrom.$error.maxlength.length; i++) {
                utility.msgwarning($scope.BdFrom.$error.maxlength[i].$name + "超過設定長度！");
                if (i > 1) {
                    return;
                }
            }
            return;
        }
        //
        DCBasicDataArrangementRes.save(item, function (data) {
            $scope.currentItem = data.Data;
            $scope.currentItem.BirthDate = FormatDate($scope.currentItem.BirthDate);
            if (!angular.isDefined(item.Id)) {
                $scope.currentCnt = data.Data.Cnt;
            }
            else if (item.Id == 0)
            {
                $scope.currentCnt = data.Data.Cnt;
            }
            $scope.Data.BasicDataArrangementList = {};
            $scope.options.params.feeNo = $scope.currentResident.FeeNo;
            $scope.options.search();
            utility.message("儲存成功！");
        });
    }

    $scope.showHistoryList = function () {
        $("#BasicDataArrangementList").modal("toggle");
    }

    $scope.BasicDataArrangementSelected = function (item) {
        $scope.currentItem = item;
        $("#BasicDataArrangementList").modal("toggle");
    }

    $scope.PrintPreview = function () {
        if (angular.isDefined($scope.currentResident.FeeNo)) {
            if ($scope.Data.BasicDataArrangementList == null || $scope.Data.BasicDataArrangementList.length==0) {
                utility.message("無打印數據");
                return;
            }
            window.open('/DC_Report/PreviewNursingReport?templateName=DCN1.5個案基本資料彙整表&feeNo=' + $scope.currentResident.FeeNo);
        } else {
            utility.message("無打印數據");
        }
    }


    function FormatDate(strTime) {
        if (strTime == null || strTime == "") {
            var d = new Date();
            var str = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            return str;
        }
        var date = new Date(strTime);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    $scope.init();
}])