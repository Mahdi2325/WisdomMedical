angular.module("sltcApp").controller("DCProblemBehaviorCtrl", ['$rootScope', '$scope', 'DCProblemBehaviorList', 'DCProblemBehaviorHisList', 'utility', '$state', 'empFileRes', function ($rootScope,$scope, DCProblemBehaviorList, DCProblemBehaviorHisList, utility, $state, empFileRes) {
    $scope.FeeNo = $state.params.FeeNo;
    $scope.btn_s = false;

    $scope.tt = [];

    $scope.AB = {};
    $scope.item = {};
    $scope.currentResident = {};
    $scope.monthData = [];
    $scope.fixedMonth = [];
    $scope.orlFixedData = [];
    $scope.orlData = [];
    $scope.fixcur = [];
    $scope.cursor = [];
    $scope.newTdCnt = 0;

   

    //當前年
    $scope.selectValue = "";

    $scope.init = function () {
        $scope.OrgName = $rootScope.Global.Organization;
        if ($scope.FeeNo == null || $scope.FeeNo == "") {
            $scope.btn_s = true;
        }
        $scope.year = 0;
        //當前月
        $scope.month = 0;
        //求當前月
        $scope.NO = "";

        $scope.Name = "";
        $scope.sex = "";
        
        $scope.changeyear();
        $scope.initFixedMonth();

        empFileRes.get({ empNo: '', empName: '', empGroup: '', currentPage: 0, pageSize: 0 }, function (response) {
            var dest = getEmpMemberByGroup(response.Data);
            if (!isEmpty(dest)) {
                for (var i = 0; i < dest.length; i++) {
                    if (dest[i].EmpGroup == "001") {
                        $scope.NurseNoData = dest[i].data;
                    } else if (dest[i].EmpGroup == "002") {
                        $scope.CarerData = dest[i].data;
                    } else if (dest[i].EmpGroup == "003") {
                        $scope.NutritionistData = dest[i].data;
                    } else if (dest[i].EmpGroup == "005") {
                        $scope.PhysiotherapistData = dest[i].data;
                    } else if (dest[i].EmpGroup == "006") {
                        $scope.DoctorData = dest[i].data;
                    } else if (dest[i].EmpGroup == "009") {//9對應照服員
                        $scope.NurseAides = dest[i].data;
                    }
                }
            }
        });
   


        $scope.search();
    };
    function getEmpMemberByGroup(arr) {
        var map = {}, dest = [];
        for (var i = 0; i < arr.length; i++) {
            var ai = arr[i];
            if (!map[ai.EmpGroup]) {
                dest.push({ EmpGroup: ai.EmpGroup, data: [ai] });
                map[ai.EmpGroup] = ai;
            } else {
                for (var j = 0; j < dest.length; j++)
                { var dj = dest[j]; if (dj.EmpGroup == ai.EmpGroup) { dj.data.push(ai); break; } }
            }
        }
        return dest;
    };

    function isEmpty(value) {
        if (value == null || value == "" || value == "undefined" || value == undefined || value == "null") { return true; } else {  //value = value.replace(/\s/g, "");
            if (value == "") {
                return true;
            }
            return false;
        }
    }

    $scope.initFixedMonth = function () {

        $scope.fixedMonth = [];
        $scope.fixcur = [];

        for (var t = 1; t <= 28 ; t++) {
            var cd = {
                DELUSION: "",
                VISUALILLUSION: "",
                MISDEEM: "",
                REPEATASKING: "",
                REPEATLANGUAGE: "",
                REPEATBEHAVIOR: "",
                VERBALATTACK: "",
                BODYATTACK: "",
                GETLOST: "",
                VERBALATTACK: "",
                BODYATTACK: "",
                GETLOST: "",
                ROAM: "",
                SLEEPDISORDER: "",
                FORGETEAT: "",
                REFUSALTOEAT: "",
                EXPOSEDBODYPARTS: "",
                NOTWEARCLOTHES: "",
                INAPPROPRIATETOUCH: "",
                COLLECTION: "",
                IRRITABILITY: "",
                COMPLAIN: "",
                NOTCOOPERATE: "",
                REFUSEHYGIENE: "",
                NOINTEREST: "",
                RESIDENTNO: "",
                FEENO: "",
            };

            $scope.fixedMonth.push(cd);
          
            $scope.fixcur.push(t - 1);
        }
        $scope.orlFixedData = angular.copy($scope.fixedMonth);

       
    }

  

    function getDaysInOneMonth(year, month){  
           month = parseInt(month, 10);  
           var d= new Date(year, month, 0);  
           return d.getDate();  
    }
    //獲得當前年份跟月份
    $scope.changeyear = function () {
        var today = new Date();
        $scope.year = today.getFullYear();
        $scope.month = today.getMonth() + 1;
    }
    //上個月
    $scope.lastmonth = function ()
    {
        
       // $scope.monthData = [];
        $scope.month--;
        if ($scope.month==0)
        {
            $scope.year--;
            $scope.month = 12;
        }
       
        $scope.search();
    }
    //下個月
    $scope.nextmonth = function () {
  

        $scope.month++;
        if ($scope.month == 12) {
            $scope.year++;
            $scope.month = 1;
        }
        $scope.search();

    }
    $scope.residentSelected = function (resident) {
        $scope.OrgName = $rootScope.Global.Organization;
        $scope.monthData = [];
        //$scope.num = 0;
        //$scope.currentResident = resident;
        $scope.currentResident.RegNo = resident.RegNo;

        $scope.AB.RESIDENTNO = resident.ResidentNo;
        $scope.AB.NURSEAIDES = "";
        $scope.FeeNo = resident.FeeNo

        if ($scope.FeeNo != null && $scope.FeeNo != "") {
            $scope.btn_s = false;
        }

        $scope.AB.REGNAME = resident.Name;

        $scope.AB.SEX = resident.Sex;
        //默認是本週
        $scope.search();
    }

    $scope.search = function () {
        //每次去修改裡面的值
        $scope.initFixedMonth();

        var FeeNo=$scope.FeeNo;
        var year=$scope.year;
        var month = $scope.month;
        var range = getDaysInOneMonth(year, month);
 
        var newTdCnt = range - 28;

        if (angular.isDefined(FeeNo) && FeeNo!="") {
            DCProblemBehaviorList.get({ FeeNo: FeeNo, year: year, month: month }, function (obj) {
                if ( obj.Data!=null&& obj.Data.AbNormaleMotionlist.length > 0) {
                    $scope.monthData = obj.Data.AbNormaleMotionlist;
                    $scope.fixedMonth = obj.Data.AbNormaleMotionlist.slice(0, 28);
                    $scope.AB.NURSEAIDES = obj.Data.AbNormaleMotionlist[0].NURSEAIDES;
                    if ($scope.newTdCnt != newTdCnt) {
                        $scope.newTdCnt = newTdCnt;
                        $scope.cursor = [];
                        for (var t = 1; t <= newTdCnt ; t++) {
                            $scope.cursor.push(t - 1);
                        }
                    }
                    $scope.monthData = obj.Data.AbNormaleMotionlist.slice(28, range);
                } else {
                       //刪除完后點擊添加物數據，歷史記錄會保存；
                     $scope.fixedMonth = $scope.orlFixedData;

  
                    $scope.FillEmptyMonthData(newTdCnt);
                }
            })
        } else {
            $scope.fixedMonth = $scope.orlFixedData;
           // newTdCnt = range；
            $scope.FillEmptyMonthData(newTdCnt);
            }
    };

    $scope.FillEmptyMonthData = function (newTdCnt) {
  
        if ($scope.newTdCnt != newTdCnt) {
            $scope.newTdCnt = newTdCnt;
            $scope.cursor = [];
            $scope.monthData = [];
            for (var t = 1; t <= newTdCnt ; t++) {
                var cd = {
                    DELUSION: "",
                    VISUALILLUSION: "",
                    MISDEEM: "",
                    REPEATASKING: "",
                    REPEATLANGUAGE: "",
                    REPEATBEHAVIOR: "",
                    VERBALATTACK: "",
                    BODYATTACK: "",
                    GETLOST: "",
                    VERBALATTACK: "",
                    BODYATTACK: "",
                    GETLOST: "",
                    ROAM: "",
                    SLEEPDISORDER: "",
                    FORGETEAT: "",
                    REFUSALTOEAT: "",
                    EXPOSEDBODYPARTS: "",
                    NOTWEARCLOTHES: "",
                    INAPPROPRIATETOUCH: "",
                    COLLECTION: "",
                    IRRITABILITY: "",
                    COMPLAIN: "",
                    NOTCOOPERATE: "",
                    REFUSEHYGIENE: "",
                    NOINTEREST: "",
                    RESIDENTNO: "",
                    FEENO: "",
                };
                $scope.monthData.push(cd);
                $scope.cursor.push(t - 1);
            }
            $scope.orlData = angular.copy($scope.monthData);
        } else {
            $scope.monthData = $scope.orlData;
        }
    }
    //本月的東西
    $scope.Tmonth = function () {
        $scope.monthData = [];
        $scope.changeyear();
        $scope.search();
    }
    //保存
    $scope.saveForm = function (ab)
    {
        //這次每次添加數據都是後面加兩條
        var item = [];
        item=$scope.fixedMonth.concat($scope.monthData);  
     //   item = $scope.fixedMonth;

        var sc = item;
        var tt = {
            REGNAME:ab.REGNAME,
            RESIDENTNO: ab.RESIDENTNO,
            NURSEAIDES: ab.NURSEAIDES,
            SEX:ab.SEX,
            REGNO: $scope.currentResident.RegNo,
            year:$scope.year,
            month: $scope.month,
            FEENO: $scope.FeeNo,
        }
        var par = {
            ab: tt,
            AbNormaleMotionlist: sc
        };

        DCProblemBehaviorList.save(par, function (data) {
            utility.message("存儲成功");

        });   
    }
    // 歷史記錄
    $scope.showhistroy = function () {
        $("#historyModal").modal("toggle");
        DCProblemBehaviorHisList.get({ FeeNo: parseInt($scope.FeeNo) }, function (obj) {
            $scope.HistoryList = obj.Data;
        });
    };
    $scope.editDayLife = function (list) {
        $("#historyModal").modal("toggle");
        $scope.year = list.year;
        $scope.month = list.month;
        $scope.FeeNo= list.FEENO;
        $scope.search();
    };
    //批量删除的东西
    $scope.deleteReferral = function (regno, year, month) {
        if (confirm("确定删除该信息吗?")) {
            DCProblemBehaviorList.delete({ regno: $scope.FeeNo, year: year, month: month }, function (data) {
                    utility.message("刪除成功");
                    $scope.showhistroy();
                    $scope.Tmonth();
                });
        }
    }
    //打印
    $scope.PrintPreview = function () {
        if (angular.isDefined($scope.FeeNo) && angular.isDefined($scope.year) && angular.isDefined($scope.month)) {

            window.open('/DC_Report/PreviewNurseCare?templateName=DCC1.3問題行為與異常情緒記錄表&FeeNo=' + $scope.FeeNo + '&year=' + $scope.year + '&month=' + $scope.month + '');

        } else {
            utility.message("未獲取問題行為與異常情緒記錄表,无法打印！");
        }
    }

    $scope.init();
}])
