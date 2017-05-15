angular.module("sltcApp")
.controller("nursingNavigateCtrl", ['$scope', '$state', '$location', function ($scope, $state, $location) {
    $scope.Data = {};
    var residentInfo = {};
    $scope.residentSelected = function (resident) {
        residentInfo = resident;
    }

    $scope.NavigateLink = function (name) {
        var url = '';
        switch (name) {
            case 'NurseRequirementEval': //护理需求评估及照顾计划
                url = '/dc/DCNurseRequirementEval/';
                break;
            case 'RegMedcine': //个案药品管理
                url = '/dc/DCregMedcine/';
                break;
            case 'NursingDiag':  //个案护理诊断，问题一览表
                url = '/dc/DCRegNursingDiag/';
                break;
            case 'AdjuvantTherapy':  //个别化活动需求评估及计划表
                url = '/dc/DCAdjuvantTherapy/';
                break;
            case 'DCBasicDataArrangement':  //個案基本資料彙整表
                url = '/dc/DCBasicDataArrangement/';
                break; 
        }
        if (angular.isDefined(residentInfo.FeeNo)) {
            url += residentInfo.FeeNo;
        }
        $location.url(url);

    }

   
}])