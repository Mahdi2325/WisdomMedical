angular.module("sltcApp")
.controller("crossNavigateCtrl", ['$scope', '$state', '$location', function ($scope, $state, $location) {
    $scope.Data = {};
    var residentInfo = {};
    $scope.residentSelected = function (resident) {
        residentInfo = resident;
    }

    $scope.NavigateLink = function (name) {
        var url = '';
        switch (name) {
            case 'Careplan': //照顧計劃表
                url = '/dc/DCCareplanCtrl/';
                break;
            case 'NurseCareLife': //護理及生活照顧服務紀錄表
                url = '/dc/NurseCareLifeService/';
                break;
            case 'DCDayLife': //日常生活照顧記錄表
                url = '/dc/DCDayLifeCare/';
                break;
            case 'DCProblem': //護理及生活照顧服務紀錄表
                url = '/dc/DCProblemBehavior/';
                break;
            case 'DCplan': //照顾计划表
                url = '/dc/DCTransdisciplinaryPlan/';
                break;
        }
        if (angular.isDefined(residentInfo.FeeNo)) {
            url += residentInfo.FeeNo;
        }
        $location.url(url);

    }

   
}])