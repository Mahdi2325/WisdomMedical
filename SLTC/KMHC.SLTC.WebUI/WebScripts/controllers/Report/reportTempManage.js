/******************************************************************
** 创建人   :BobDu
** 创建时间 :
** 说明     :
******************************************************************/
angular.module("sltcApp")
.controller("dayReportTempManageCtrl", ['$scope', '$q', 'dayReportTempManageRes', 'utility', 'resourceFactory', function ($scope, $q, dayReportTempManageRes, utility, resourceFactory) {
    $scope.date = moment().format("YYYY-MM-DD");
    $scope.operatorId = utility.getUserInfo().UserId;
    resourceFactory.getResource('users').get(function (data) {
        $scope.userData = data.Data;
    });
    Handlebars.registerHelper("addOne", function (index, options) {
        return parseInt(index) + 1;
    });
    Handlebars.registerHelper('PaymentType', function (v1, v2, options) {
        if (v1 === v2) {
            return options.fn(this);
        }
        return options.inverse(this);
    });
    $scope.reportType = "Payment";
    $scope.init = function () {
        $scope.data = {};
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: dayReportTempManageRes,//异步请求的res
            params: { date: $scope.date, mark: $scope.reportType, operatorId: $scope.operatorId },
            success: function (data) {//请求成功时执行函数
                //if (data.RecordsCount == 0) {
                //    utility.msgwarning("暂无数据");
                //    return;
                //}
                $scope.Data = data;
                if (!$scope.reportType) return;
                var source = '';
                switch ($scope.reportType) {

                    case "Payment":
                        source = "#Payment";
                        break;
                    default:
                        source = "#commonReport";
                        break;
                }
                var code = $(source).html();
                var template = Handlebars.compile(code);
                //注册一个比较大小的Helper,判断v1是否大于v2
                Handlebars.registerHelper("compare", function (v1, v2, options) {
                    if (v1 == v2) {
                        //满足添加继续执行
                        return options.fn(this);
                    } else {
                        //不满足条件执行{{else}}部分
                        return options.inverse(this);
                    }
                });
                var dom = template($scope.Data);
                $("#reportListTab").html(dom);
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        }
    };

    $scope.Search = function () {
        if (!$scope.date) {
            utility.message("请选择日期！");
            return;
        }

        if (!$scope.reportType) {
            utility.message("请选择报表名称！");
            return;
        }
        if (!$scope.operatorId) {
            utility.message("请选择操作员！");
            return;
        }
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.pageInfo.PageSize = 10;
        $scope.options.params.mark = $scope.reportType;
        $scope.options.params.date = $scope.date;
        $scope.options.params.operatorId = $scope.operatorId;
        $scope.options.search();
    }

    $scope.init();
   
}])
.controller("monthReportTempManageCtrl", ['$scope', '$q', 'monthReportTempManageRes', 'utility', function ($scope, $q, monthReportTempManageRes, utility) {

}])