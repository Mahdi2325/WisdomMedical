angular.module("sltcApp").controller("DCProfessionalteamS2Ctrl", ['$scope', 'DCProfessionalteamList2','DCProfessionalteamHisList2', 'utility', '$state', function ($scope, DCProfessionalteamList2,DCProfessionalteamHisList2,utility, $state) {

    $scope.FeeNo = $state.params.FeeNo;

    $scope.init = function () {

        $scope.NURSEAIDES = "";

        $scope.EVALDATE = "";

        $scope.MULTITEAM = {};
        $scope.MajType = [

         { "value": 0, "text": "社工" },

         { "value": 1, "text": "護士" },

         { "value": 2, "text": "營養師" },

         { "value": 3, "text": "職能治療師" },

         { "value": 4, "text": "物理治療師" },
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
                TRACEDESC:"",
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
    //查询最新的一笔 
    $scope.sarch = function () {
        
        $scope.Multiteam = [];

        DCProfessionalteamList2.get({ FeeNo: $scope.FeeNo }, function (obj) {
     
            $scope.NURSEAIDES = obj.Data.MultiteamCarePlanRe.NURSEAIDES;

            $scope.SEQNO = obj.Data.MultiteamCarePlanRe.SEQNO;

            $scope.EVALDATE = obj.Data.MultiteamCarePlanRe.SEQNO;

            $scope.CREATEDATE = obj.Data.MultiteamCarePlanRe.SEQNO;

            //记录时间
            $scope.EVALDATE = obj.Data.MultiteamCarePlanRe.EVALDATE;
            for (var t = 0; t < obj.Data.MultiteamCar.length ; t++) {
                var cd = {
                    ID: obj.Data.MultiteamCar[t].ID,
                    MAJORTYPE: obj.Data.MultiteamCar[t].MAJORTYPE,
                    QUESTIONTYPE: obj.Data.MultiteamCar[t].QUESTIONTYPE,
                    ACTIVITY: obj.Data.MultiteamCar[t].ACTIVITY,
                };
                $scope.Multiteam.push(cd);  
            }
        });
    };
    //这边是保存的信息
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
    //历史记录
    $scope.showhistroy = function () {
        $("#historyModal").modal("toggle");
        DCProfessionalteamList2.get({ REGNO:$scope.currentResident.RegNo }, function (obj) {
            $scope.HistoryList = obj.Data;
        });
    };


    $scope.editDayLife = function (id) {

        $scope.Multiteam = [];
        $("#historyModal").modal("toggle");

        DCProfessionalteamHisList2.get({ID: id }, function (obj) {

 
            $scope.NURSEAIDES = obj.Data.MultiteamCarePlanRe.NURSEAIDES;

            $scope.SEQNO = obj.Data.MultiteamCarePlanRe.SEQNO;

            $scope.EVALDATE = obj.Data.MultiteamCarePlanRe.SEQNO;

            //记录时间
            $scope.EVALDATE = obj.Data.MultiteamCarePlanRe.EVALDATE;
            for (var t = 0; t < obj.Data.MultiteamCar.length ; t++) {
                var cd = {
                    ID: obj.Data.MultiteamCar[t].ID,
                    MAJORTYPE: obj.Data.MultiteamCar[t].MAJORTYPE,
                    QUESTIONTYPE: obj.Data.MultiteamCar[t].QUESTIONTYPE,
                    ACTIVITY: obj.Data.MultiteamCar[t].ACTIVITY,
                };
                $scope.Multiteam.push(cd);
            }

        });
    };

    $scope.deleteReferral = function (id) {

        if (confirm("确定删除该信息吗?")) {
            DCProfessionalteamList2.delete({ id: id }, function (data) {

                $scope.Multiteam = [];

                utility.message("刪除成功");

                $scope.showhistroy();

            });
        }
    }

    $scope.init();


}])
