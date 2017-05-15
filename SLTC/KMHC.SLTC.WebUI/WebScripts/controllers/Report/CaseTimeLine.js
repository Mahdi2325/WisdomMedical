angular.module("sltcApp")
.controller("caseManagementCtrl", ['$scope', '$http', '$location', '$timeout', '$state', '$filter', 'utility', 'resourceFactory',  function ($scope, $http, $location, $timeout, $state, $filter, utility, resourceFactory) {
    Handlebars.registerHelper('getTime', function(time) {
        return moment(time).format('h:mm:ss');
    });
    Handlebars.registerHelper('getFullDate', function(time) {
        return moment(time).format('YYYY-MM-DD');
    });
    Handlebars.registerHelper('getIndex', function(idx) {
        return (idx+1)+".";
    });
    $scope.currentType = $('#case-tab li.active').attr('data-type');
    $('#case-tab li').click(function () {
        var _this= $(this),type=_this.attr('data-type');
        $scope.currentType=_this.attr('data-type');
        _this.addClass('active').siblings().removeClass('active');
        $scope.getCaseCon();

    }).css('cursor','pointer');

    $scope.Data = {};
    $scope.feeNo = -1;
    $scope.IpdFlag = "I";
    $scope.OrgData = {};
    $scope.eDate = moment().format('YYYY-MM-DD');
    $scope.sDate = moment().subtract(6, "d").format('YYYY-MM-DD');

    $scope.init=function () {
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: CaseMgrFeeRes,//异步请求的res
            params: { st: $scope.sDate, et: $scope.eDate, feeNo: $scope.feeNo},
            success: function (data) {//请求成功时执行函数
                if($scope.feeNo==-1){
                    utility.msgwarning("请选择住民~");
                    return;
                }
                if (!data.RecordsCount) {
                    utility.showNoData('#showDatas');
                    return;
                }
                $scope.Data = data;
                var code = $('#'+$scope.currentType).html();
                var template = Handlebars.compile(code);
                var dom = template($scope.Data);
                $("#showDatas").html(dom);
                cfpLoadingBar.complete();

            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        }

        $scope.loadOrg();

    }
    $scope.changeOrg = function (institutionName) {
        $scope.loadResident(institutionName);
    }
    $scope.loadOrg = function () {
        NCIAAuditAppcertRes.get({ org: 0 }, function (data) {
            if (data.Data && data.Data.length) {
                $scope.OrgData = data.Data;
                $scope.institutionName = data.Data[0].NsId;
                $scope.loadResident($scope.institutionName);
            }
        });
    };
    $scope.loadResident = function (institutionName) {
        $http({
            url:"/api/CaseMgr/GetResidents",
            params:{'nsId':institutionName}
        }).success(function (data) {
            $scope.residents = JSON.parse(data);
        })
    }
    $scope.afterSelected = function (item) {
        $scope.currentResident = item;//设置ResidentCard的currentResident
        $scope.feeNo =item.FeeNo;
        $scope.getCaseCon()
    }
    $scope.getCaseCon = function (feeNo,type) {
        cfpLoadingBar.start();

        var ajaxObj;
        switch (type){
            case "GetFee":
                ajaxObj = CaseMgrFeeRes;
                break;
            case "GetCplRec":
                ajaxObj = CaseMgrCplRec;
                break;
            case "GetNsRec":
                ajaxObj = CaseMgrNsRecRes;
                break;
            case "GetMeasureRec":
                ajaxObj = CaseMgrMeasureRecRes;
                break;
            case "GetEvlRec":
                ajaxObj = CaseMgrEvlRecRes;
                break;
            default:
                ajaxObj = null;
        }
        $scope.options.params.feeNo=feeNo;
        $scope.options.params.st = $scope.sDate;
        $scope.options.params.et = $scope.eDate;
        $scope.options.ajaxObject=ajaxObj;
        $scope.options.pageInfo.CurrentPage=1;
        $scope.options.search();
    }
    $scope.init();
}])