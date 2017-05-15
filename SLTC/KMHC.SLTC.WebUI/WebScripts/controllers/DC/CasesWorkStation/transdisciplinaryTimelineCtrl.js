angular.module("sltcApp").controller("transdisciplinaryTimelineCtrl", ['$rootScope', '$scope', '$timeout', 'resourceFactory', 'caseHtlExamRes', 'caseHtlExamRecordRes', 'utility', function ($rootScope, $scope,$timeout, resourceFactory, caseHtlExamRes, caseHtlExamRecordRes, utility) {
    var serviceOrderRes = resourceFactory.getResource("serviceOrderRes");
    var chargeDetailRes = resourceFactory.getResource("chargeDetailRes");


    $scope.Data = {};
    $scope.ResidentID = -1;
    $scope.IpdFlag = "I";
    $scope.OrgData = {};
    $scope.eDate = new Date().format("yyyy-MM-dd");
    $scope.sDate = new Date().dateAdd('d', -6).format('yyyy-MM-dd');
    
    


    $scope.init = function () {

        $scope.SelStartDate = $scope.sDate;
        $scope.SelEndDate = $scope.eDate;

        $scope.InitTimeLineDate();
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: serviceOrderRes,//异步请求的res
            params: { "Data.StartDate": $scope.SelStartDate, "Data.EndDate": $scope.SelEndDate, "Data.ResidentID": $scope.ResidentID },
            success: function (data) {//请求成功时执行函数
                if ($scope.ResidentID == -1) {
                    utility.msgwarning("请选择会员。");
                    return;
                }
                $scope.Data = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        }
        
    }

    $scope.changeDate = function () {
        $scope.SelStartDate = $scope.sDate;
        $scope.SelEndDate = $scope.eDate;
        $scope.InitTimeLineDate();
        $scope.getCaseCon();
    }

    //选中住民
    $scope.residentSelected = function (resident) {
        $scope.Data = {};
        $scope.currentResident = resident;
        $scope.ResidentID = resident.ResidentID;
        $scope.IdCard = resident.IdCard;
        if (!angular.isDefined($scope.StartDate) || $scope.StartDate == null) {
            $scope.StartDate = "";
        }
        if (!angular.isDefined($scope.EndDate) || $scope.EndDate == null) {
            $scope.EndDate = "";
        }
        $scope.getCaseCon();
    };

    $scope.currentType = $('#case-tab li.active').attr('data-type');
    $('#case-tab li').click(function () {
        var _this = $(this), type = _this.attr('data-type');
        $scope.currentType = _this.attr('data-type');
        _this.addClass('active').siblings().removeClass('active');
        $scope.getCaseCon();

    }).css('cursor', 'pointer');
    $scope.getCaseCon = function () {
        var type = $scope.currentType;
        var ajaxObj;
        switch (type) {
            case "GetOrder":
                ajaxObj = serviceOrderRes;
                break;
            case "GetMeasureRec":
                ajaxObj = caseHtlExamRes;
                break;
            case "GetHlRec":
                ajaxObj = caseHtlExamRecordRes;
                break;
            case "GetFee":
                ajaxObj = chargeDetailRes;
                break;
            default:
                ajaxObj = null;
        }
        $scope.options.params["Data.StartDate"] = $scope.SelStartDate;
        $scope.options.params["Data.EndDate"] = $scope.SelEndDate;
        if (type == "GetMeasureRec" || type == "GetHlRec") {
            $scope.options.params["Data.IdCard"] = $scope.IdCard;
        } else {
            $scope.options.params["Data.ResidentID"] = $scope.ResidentID;
        }
        $scope.options.ajaxObject = ajaxObj;
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.search();
    }

    $scope.InitTimeLineDate = function () {
        if (!$scope.eDate || !$scope.sDate)
            return;
        var dateDiffCnt = newDate($scope.sDate).dateDiff("d", newDate($scope.eDate));
        $scope.SearchDates = [];

        if(dateDiffCnt>0){
            
            for (var i = 0; i <= dateDiffCnt; i++) {
                var newDateObj = {};
                var tempDate = newDate($scope.sDate).dateAdd('d', i);
                newDateObj.Date = tempDate.format('dd/MM/yyyy');
                newDateObj.DateName = tempDate.format('MM月dd日');
                newDateObj.UseDate = tempDate.format('yyyy-MM-dd');
                $scope.SearchDates.push(newDateObj);
            }
        }     

    }

    $scope.ServiceOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseServiceOrder", serviceOrderID);
    }


    $scope.CommodityOrderInfo = function (serviceOrderID) {
        $scope.$broadcast("chooseCommodityOrder", serviceOrderID);
    }

    $scope.showDate = function (date) {
        if (date != null) {
            var index = date.indexOf('T');
            if (index > -1) {
                return date.substring(0, index);
            }
        }
    };

    $scope.SelectDate = function (date) {
        $scope.SelStartDate = date;
        $scope.SelEndDate = date;
        $scope.getCaseCon();
    };

    $scope.CheckResult = function (itemId, reulst) {
        var tmpValue;
        var rs = true;
        switch (itemId) {
            case 554:
                tmpValue = parseInt(reulst);
                rs = tmpValue >= 90 && tmpValue < 140;
                break;
            case 556:
                tmpValue = parseInt(reulst);
                rs = tmpValue >= 60 && tmpValue < 90;
                break;
            case 776:
                tmpValue = parseFloat(reulst);
                rs = tmpValue >= 3.1 && tmpValue < 11.1;
                break;
        }

        return rs;
    };

    $scope.showDatetime = function (date) {
        if (date != null) {
            return date.substring(0, 16).replace('T', ' ').toString();
        }
    };

    $scope.getLocalTime = function (strTime) {
        if (strTime == null || strTime == "") {
            return "";
        }
        var date = new Date(strTime);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    }
    //一体机体检结果
    $scope.popupResult = function (data) {

        var ExamId = data.ExamId + ',' + data.Doctor + ',' + $scope.showDate(data.ExamDate) + ',' + $scope.currentResident.PersonID + ',' + $scope.currentResident.IdCard;
        $("#CurrentExamId").val(ExamId);
        $("#modalResult").modal("show");
    }

    //一体机体检建议
    $scope.popupSuggest = function (data) {
        var ExamId = data.ExamId + ',' + data.Doctor + ',' + $scope.showDate(data.ExamDate) + ',' + $scope.currentResident.PersonID + ',' + $scope.currentResident.IdCard;
        $("#CurrentExamId").val(ExamId);
        $("#modalSuggest").modal("show");
    }


    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //下面是在table render完成后执行的js
        $timeout(function () {
            initTimeline($('.cd-horizontal-timeline'));
        });
    });

    $scope.init();
}]);


