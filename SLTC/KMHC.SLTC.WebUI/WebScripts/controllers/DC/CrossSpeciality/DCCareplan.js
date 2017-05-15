angular.module("sltcApp").controller("DCCareplanCtrl", ['$scope', 'DCCarePlanRes', 'utility', '$state', function ($scope, DCCarePlanRes, utility, $state) {

    $scope.FeeNo = $state.params.FeeNo;

    $scope.init = function () {

        $scope.NURSEAIDES = "";

        $scope.EVALDATE = "";

        $scope.MULTITEAM = {};
        $scope.MajType = [

         { "value": 0, "text": "健康醫療" },

         { "value": 1, "text": "日常功能照顧" },

         { "value": 2, "text": "社會資源/家庭支持" },
        ]
    };

    $scope.produceCode = function () {
        //獲得月份
        $scope.Multiteam = [];


        $scope.NURSEAIDES = "";

        $scope.EVALDATE = "";


        for (var t = 0; t < $scope.MajType.length ; t++) {
            var cd = {
                MAJORTYPE: t,
                QUESTIONTYPE: "",
                ACTIVITY: "",
                GOAL: "",
            };
            $scope.Multiteam.push(cd);
        }
    }
    //選中住民
    $scope.residentSelected = function (resident) {

        $scope.produceCode();

        $scope.currentResident = resident;


        $scope.Name = resident.Name;

        $scope.currentResident.OrgId = resident.OrgId;

        $scope.currentResident.RegNo = resident.RegNo;

        $scope.FeeNo = resident.FeeNo;

        $scope.sarch();
    }

    $scope.saveForm = function (Multiteam) {

        $scope.MULTITEAM = {
            SEQNO: $scope.SEQNO,
            FEENO: $scope.FeeNo,
            REGNO: $scope.currentResident.RegNo,
            NURSEAIDES: $scope.NURSEAIDES,
            EVALDATE: $scope.EVALDATE,
            CREATEDATE: $scope.CREATEDATE,
        };
        var par = {

            MultiteamCarePlanRe: $scope.MULTITEAM,
            MultiteamCar: Multiteam,
        };

        DCProfessionalteamList2.save(par, function (data) {
            alert("操作成功");
        });
    }
    $scope.init();
   
}])
