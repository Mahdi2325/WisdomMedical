angular.module('sltcApp')
.controller('regLifeQualityEval', ['$rootScope', '$scope', 'utility', '$state', 'cloudAdminUi', 'dc_RegLifeQualityEvalRes', function ($rootScope, $scope, utility, $state, cloudAdminUi, dc_RegLifeQualityEvalRes) {
    $scope.FeeNo = 0; //utility.hashCode('341122195006062035');//utility.hashCode($state.params.FeeNo);
    $scope.StrFeeNo = '';//'341122195006062035';
    $scope.StrRegNo = '';
    $scope.currentItem = {};
    $scope.buttonShow = true;
    $scope.init = function () {
        //$scope.Org = $rootScope.Global.Organization;
        //$(".uniform").uniform();
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: dc_RegLifeQualityEvalRes,//异步请求的res
            success: function (data) {//请求成功时执行函数

                $scope.HistoryList = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            },
            params: { feeNo: $scope.FeeNo }
        }
    };
    //选中住民
    $scope.residentSelected = function (resident) {
        $scope.StrFeeNo = resident.ResidentNo;
        $scope.StrRegNo = resident.PersonNo;
        resident.FeeNo = utility.hashCode(resident.ResidentNo);
        resident.RegNo = utility.hashCode(resident.PersonNo);
        resident.Name = resident.PersonName;
        //resident.SEX = resident.Sex;
        resident.BirthDate = resident.Birthdate;
        $scope.currentResident = resident;
        $scope.currentItem = {};//清空编辑项
        if (angular.isDefined($scope.currentResident)) {
            $scope.buttonShow = false;
        }
        //选中住民后初始化表单部分字段
        $scope.currentItem.RegNo = resident.RegNo;
        //获得当前登陆用户信息
        $scope.curUser = { EmpNo: $scope.$root.user.id, EmpName: $scope.$root.user.EmpName };// utility.getUserInfo();
        //$scope.currentItem.CreateBy = $scope.curUser.EmpNo;
        $scope.FeeNo = resident.FeeNo;
        $scope.currentItem.OrgId = $scope.currentResident.ResidentOrg;
        $scope.HistoryList = {};
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.pageInfo.PageSize = 10;
        $scope.options.params.feeNo = $scope.FeeNo;

        $scope.sarch();
    }
    $scope.sarch = function () {
        if (angular.isDefined($scope.FeeNo)) {
            dc_RegLifeQualityEvalRes.get({ feeNo: $scope.FeeNo, currentPage: 1, pageSize: 10 }, function (data) {
                if (data != null && data.Data != null && data.Data.length > 0) {
                    $scope.currentItem = data.Data[0];
                    $scope.currentItem.Id = data.Data[0].Id;
                }
            });
        }

    }
    $scope.saveForm = function (item) {
        item.FeeNo = $scope.FeeNo;
        dc_RegLifeQualityEvalRes.save(item, function (data) {
            if (angular.isDefined(item.FeeNo)) {
                utility.message("资料更新成功！");
                $scope.currentItem.Id = data.Data.Id;
            }
            else {
                //$scope.Data.subsidys.push(data.Data);
                //utility.message($scope.currentResident.Name + "的基本资料更新新成功！");
            }
        });
    };

    $scope.clear = function () {
        $scope.currentItem.EcologicalMap = "";
    }
    $scope.changeBirthday = function (newValue) {
        $scope.currentItem.Age = new Date().getFullYear() - new Date(newValue).getFullYear();
    }
    $scope.showHistory = function () {

        if (angular.isDefined($scope.FeeNo)) {
            $scope.options.search();
            $("#historyModal").modal("toggle");
        }
        else
            utility.message("您未选中住民!");
    }
    $scope.editEval = function (id) {
        dc_RegLifeQualityEvalRes.get({ id: id }, function (data) {

            if (data.Data != null) {
                $scope.currentItem = {};
                $scope.currentItem = data.Data;
            }

        });
        $("#historyModal").modal("toggle");
    }
    $scope.deleteEval = function (item) {
        if (confirm("您确定要删除该条记录吗?")) {

            dc_RegLifeQualityEvalRes.delete({ id: item.Id }, function (data) {

                if (data.$resolved) {
                    utility.message("资料删除成功！");
                    $scope.sarch();
                }
            });
            $("#historyModal").modal("toggle");
        }
    }
    $scope.cancelEdit = function () {
        $("#historyModal").modal("toggle");
    };
    $scope.PrintPreview = function (id) {

        if (angular.isDefined($scope.currentItem.Id)) {
            window.open('/DC_Report/Preview?templateName=DCS1.4家庭照顾者生活质量评估问卷&recId=' + $scope.currentItem.Id)
        } else {
            utility.message("未获取到个案评估记录,无法打印！");
        }

    }
    $scope.init();
}]);

