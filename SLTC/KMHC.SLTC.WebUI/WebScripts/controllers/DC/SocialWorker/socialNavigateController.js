angular.module("sltcApp")
.controller("socialNavigateCtrl", ['$http', '$scope', '$state', '$location', function ($http, $scope, $state, $location) {
    $scope.Data = {};
    var residentInfo = {};
    $scope.residentSelected = function (resident) {
        residentInfo = resident;
    }
    $scope.NavigateLink = function (name) {
        var url = '';
        switch (name) {
            case 'IpdregIn': //收案
                url = '/dc/IpdregIn/';
                break;
            case 'PersonBasicInfor': //個案基本資料
                url = '/dc/PersonBasicInfor/';
                break;
            case 'PersonLifeHistory': //個案生活史
                url = '/dc/PersonLifeHistory/';
                break;
            case 'OneDayLife':  //一天的生活
                url = '/dc/OneDayLife/';
                break;
            case 'SocialEval':  //社工個案評估及處於計劃表
                url = '/dc/SocialEval/';
                break;
            case 'PersonReferral':  //個案轉介單
                url = '/dc/PersonReferral/';
                break;
            case 'RegLifeQualityEval': //收案
                url = '/dc/RegLifeQualityEval/';
                break;
            case 'IpdregOut': //收案
                url = '/dc/IpdregOut/';
                break;
            case "RegQuestionEvalRec"://受託長輩適應程度評估表
                url = '/dc/RegQuestionEvalRec/';
                break;
        }
        if (angular.isDefined(residentInfo.FeeNo)) {
            url += residentInfo.FeeNo;
        }
        $location.url(url);
    }

   
}])