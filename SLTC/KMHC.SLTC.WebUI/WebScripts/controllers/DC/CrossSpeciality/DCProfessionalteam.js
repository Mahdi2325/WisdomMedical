angular.module("sltcApp").controller("DCProfessionalteamCtrl", ['$scope', 'DCProfessionalteamList', 'DCProfessionalteamHis', 'utility', '$state', function ($scope, DCProfessionalteamList, DCProfessionalteamHis, utility, $state) {
    $scope.FeeNo = $state.params.FeeNo;
    $scope.btn_s = false;

    $scope.init = function () {
    
        $scope.MULTITEAM = {};

        if ($scope.FeeNo == null || $scope.FeeNo == "") {
            $scope.btn_s = true;
        }

    };

    //選中住民
    $scope.residentSelected = function (resident) {
        $scope.MULTITEAM = {};
       $scope.currentItem = resident;

       $scope.currentItem.RegNo = resident.RegNo;

       $scope.currentItem.FeeNo = resident.FeeNo;

       $scope.FeeNo = resident.FeeNo

       if ($scope.FeeNo != null && $scope.FeeNo != "") {
           $scope.btn_s = false;
       }

       $scope.Name = resident.Name
        $scope.sarch();
    }

    $scope.sarch = function () {
        
        DCProfessionalteamList.get({ feeono: $scope.currentItem.FeeNo }, function (obj) {
            $scope.MULTITEAM.ECOLOGICALMAP = obj.Data.ECOLOGICALMAP;
            $scope.MULTITEAM.PERSONALHISTORY = obj.Data.PERSONALHISTORY;
            $scope.MULTITEAM.PHYSIOLOGY = obj.Data.PHYSIOLOGY;
            $scope.MULTITEAM.PSYCHOLOGY = obj.Data.PSYCHOLOGY;
            $scope.MULTITEAM.FAMILYSUPPORT = obj.Data.FAMILYSUPPORT;
            $scope.MULTITEAM.SOCIALRESOURCES = obj.Data.SOCIALRESOURCES;
            $scope.MULTITEAM.DISEASEINFO = obj.Data.DISEASEINFO;
            $scope.MULTITEAM.ECONOMICCAPACITY = obj.Data.ECONOMICCAPACITY;
            $scope.MULTITEAM.MMSESCORE = obj.Data.MMSE;
            $scope.MULTITEAM.IADLSCORE = obj.Data.IADL;
            $scope.MULTITEAM.ADLSCORE = obj.Data.ADL;
            $scope.MULTITEAM.NURSEAIDES = obj.Data.NURSEAIDES;

        });
    };

    $scope.showhistroy = function () {
        $("#historyModal").modal("toggle");
        DCProfessionalteamList.get({ REGNO: $scope.currentItem.RegNo }, function (obj) {

            $scope.HistoryList = obj.Data;
        });
    };
    //歷史記錄中的編輯
    $scope.editDayLife = function (list) {

        $("#historyModal").modal("toggle");
        
        DCProfessionalteamHis.get({ID:list.ID}, function (obj) {


            $scope.MULTITEAM = obj.Data;

        });
    };

    $scope.saveForm = function (MULTITEAM) {

        //添加一些屬性
        $scope.MULTITEAM.FEENO = $scope.currentItem.FeeNo;
        $scope.MULTITEAM.REGNO = $scope.currentItem.RegNo;

       DCProfessionalteamList.save(MULTITEAM, function (data) {

            alert("操作成功");
        });
    }
     
    //删除
    $scope.deleteReferral = function (id) {
        if (confirm("确定删除该信息吗?")) {
            DCProfessionalteamList.delete({ id: id }, function (data) {

                $scope.MULTITEAM = {};

                utility.message("刪除成功");

                $scope.showhistroy();

            });
        }
    }
    $scope.init();

}])
