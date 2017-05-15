angular.module("sltcApp").controller("NurseCareLifeServiceCtrl", ['$rootScope', '$scope', 'dictionary', 'DCNurseCareLifeServiceRes', 'DCNurseCareLifeList', 'DCNurseCareLifeEdit', 'utility', '$state', 'employeeRes',
    function ($rootScope, $scope, dictionary, DCNurseCareLifeServiceRes, DCNurseCareLifeList, DCNurseCareLifeEdit, utility, $state, employeeRes) {
        $scope.FeeNo = 0;
        $scope.StrFeeNo = '';
        $scope.StrRegNo = '';
        $scope.btn_s = false;

        $scope.CodeCy = "";
        // 控制是否可选
        $scope.DCshow1 = false;
        $scope.DCshow2 = false;
        $scope.DCshow3 = false;
        $scope.DCshow4 = false;
        $scope.DCshow5 = false;
        //根据时间控制可以修改
        $scope.DCtimedisabled1 = false;
        $scope.DCtimedisabled2 = false;
        $scope.DCtimedisabled3 = false;
        $scope.DCtimedisabled4 = false;
        $scope.DCtimedisabled5 = false;
        //控制星期checkbox选中

        $scope.addcode = function () {
            DCNurseCareLifeEdit.get({}, function (data) {

                $scope.CodeCy = data.Data;

            });
        }
        $scope.fun = function (num) {
            switch (num) {
                case 1:
                    if ($scope.DCshow1 == true) {

                        $scope.DCshow1 = false
                        $scope.DCWeekshow1 = false;
                    }
                    else {
                        $scope.DCshow1 = true;

                        $scope.DCWeekshow1 = true;
                    }

                    break;
                case 2:
                    if ($scope.DCshow2 == true) {
                        $scope.DCWeekshow2 = false;
                        $scope.DCshow2 = false;
                    }
                    else {
                        $scope.DCWeekshow2 = true;
                        $scope.DCshow2 = true;
                    }

                    break;
                case 3:
                    if ($scope.DCshow3 == true) {
                        $scope.DCWeekshow3 = false;
                        $scope.DCshow3 = false;
                    }
                    else {
                        $scope.DCWeekshow3 = true;
                        $scope.DCshow3 = true;
                    }

                    break;
                case 4:
                    if ($scope.DCshow4 == true) {
                        $scope.DCWeekshow4 = false;
                        $scope.DCshow4 = false;
                    }
                    else {
                        $scope.DCWeekshow4 = true;
                        $scope.DCshow4 = true;
                    }

                    break;
                case 5:
                    if ($scope.DCshow5 == true) {
                        $scope.DCWeekshow5 = false;
                        $scope.DCshow5 = false;
                    }
                    else {
                        $scope.DCWeekshow5 = true;
                        $scope.DCshow5 = true;
                    }

                    break;
            }
        }

        //根据时间来控制不可以输入
        $scope.comparesize = function (TDtime, Ctime) {
            if (TDtime[0] > Ctime) {

                $scope.DCshow1 = true;
                $scope.DCtimedisabled1 = true;
            }
            else {
                if ($scope.item1.HOLIDAYFLAG == "True") {
                    $scope.DCshow1 = true;
                    $scope.DCWeekshow1 = true;
                    $scope.DCtimedisabled1 = false;
                }
                else {
                    $scope.DCtimedisabled1 = false;
                    $scope.DCshow1 = false;
                }
            }
            if (TDtime[1] > Ctime) {
                $scope.DCshow2 = true;
                $scope.DCtimedisabled2 = true;
            }
            else {
                if ($scope.item2.HOLIDAYFLAG == "True") {

                    $scope.DCshow2 = true;
                    $scope.DCWeekshow2 = true;
                    $scope.DCtimedisabled2 = false;
                }
                else {
                    $scope.DCtimedisabled2 = false;
                    $scope.DCshow2 = false;
                }
            }

            if (TDtime[2] > Ctime) {
                $scope.DCshow3 = true;
                $scope.DCtimedisabled3 = true;
            }
            else {
                if ($scope.item3.HOLIDAYFLAG == "True") {
                    $scope.DCshow3 = true;
                    $scope.DCWeekshow3 = true;
                    $scope.DCtimedisabled3 = false;
                }
                else {
                    $scope.DCtimedisabled3 = false;
                    $scope.DCshow3 = false;
                }
            }

            if (TDtime[3] > Ctime) {

                $scope.DCshow4 = true;
                $scope.DCtimedisabled4 = true;
            }
            else {
                if ($scope.item4.HOLIDAYFLAG == "True") {
                    $scope.DCshow4 = true;
                    $scope.DCWeekshow4 = true;
                    $scope.DCtimedisabled4 = false;
                }
                else {
                    $scope.DCtimedisabled4 = false;
                    $scope.DCshow4 = false;
                }
            }
            if (TDtime[4] > Ctime) {
                $scope.DCtimedisabled5 = true;
                $scope.DCshow5 = true;
            }
            else {
                if ($scope.item5.HOLIDAYFLAG == "True") {
                    $scope.DCshow5 = true;
                    $scope.DCWeekshow5 = true;
                    $scope.DCtimedisabled5 = false;
                }
                else {
                    $scope.DCtimedisabled5 = false;
                    $scope.DCshow5 = false;
                }
            }
        }
        $scope.CheckCodeList = [];
        $scope.init = function () {

            //$scope.OrgName = $rootScope.Global.Organization;
            if ($scope.FeeNo == null || $scope.FeeNo == "") {
                $scope.btn_s = true;
            }

            $scope.addcode();
            //年份
            $scope.year = "";
            //周数
            $scope.yearDayOfWeek = "";
            //赋值给这个星期的第几周
            $scope.fristquery();
            //获取今年的年份
            $scope.getyear();
            // 这个是控制每次获得星期一到星期五的日期
            $scope.num = 0;

            //设置初始值包含 日字号、姓名、性别
            $scope.ResNo = "";
            $scope.Rename = "";
            $scope.ReSex = "";
            $scope.GetDaytime();

        };
        //现在所属本年度的周数
        $scope.fristquery = function () {
            DCNurseCareLifeServiceRes.get({ "Data": {} }, function (obj) {
                //求现在的周数
                $scope.yearDayOfWeek = obj.PagesCount;
            });
        }
        //求现在的年限
        $scope.getyear = function () {

            var today = new Date();

            $scope.year = today.getFullYear();
        }
        //选中住民
        $scope.residentSelected = function (resident) {
            $scope.StrFeeNo = resident.ResidentNo;
            $scope.StrRegNo = resident.PersonNo;
            resident.FeeNo = utility.hashCode(resident.ResidentNo);
            resident.RegNo = utility.hashCode(resident.PersonNo);
            //$scope.OrgName = $rootScope.Global.Organization;
            //$scope.num = 0;
            $scope.currentResident = resident;
            $scope.currentResident.OrgId = resident.OrgId;
            $scope.currentResident.RegNo = resident.RegNo;

            //住院信息
            $scope.FeeNo = resident.FeeNo;

            if ($scope.FeeNo != null && $scope.FeeNo != "") {
                $scope.btn_s = false;
            }

            // 时间默认为0的时候，查询出现在的日期,根据现在的周数来进行时间的递减添加
            weektime = weekdata($scope.num);
            //这是每周某的开始时间
            $scope.endtime = weektime[0];
            $scope.Addnew();

            //日字号
            $scope.ResNo = resident.ResidentNo;
            //姓名
            $scope.Rename = resident.PersonName;
            //性别
            $scope.ReSex = resident.Sex;
            ////默认是本周

            employeeRes.query({}, function (response) {
                $scope.NurseNoData = response;
                $scope.CarerData = response;
                $scope.NutritionistData = response;
                $scope.PhysiotherapistData = response;
                $scope.DoctorData = response;
                $scope.NurseAides = response;
                //var dest = getEmpMemberByGroup(response.Data);
                //if (!isEmpty(dest)) {
                //    for (var i = 0; i < dest.length; i++) {
                //        if (dest[i].EmpGroup == "001") {
                //            $scope.NurseNoData = dest[i].data;
                //        } else if (dest[i].EmpGroup == "002") {
                //            $scope.CarerData = dest[i].data;
                //        } else if (dest[i].EmpGroup == "003") {
                //            $scope.NutritionistData = dest[i].data;
                //        } else if (dest[i].EmpGroup == "005") {
                //            $scope.PhysiotherapistData = dest[i].data;
                //        } else if (dest[i].EmpGroup == "006") {
                //            $scope.DoctorData = dest[i].data;
                //        } else if (dest[i].EmpGroup == "009") {//9对应照服员
                //            $scope.NurseAides = dest[i].data;
                //        }
                //    }
                //}
            });

            $scope.search($scope.FeeNo, $scope.year, $scope.yearDayOfWeek);

        }
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
        //本周
        $scope.week = function () {


            $scope.Addnew();

            $scope.num = 0;

            weektime = weekdata($scope.num);


            $scope.endtime = weektime[0];

            //获取本周的时间跟周数
            $scope.changeyear(weektime[0]);

            $scope.yearDayOfWeek = weekofyear(weektime[0]);

            $scope.search($scope.FeeNo, $scope.year, $scope.yearDayOfWeek);
        }
        //上周
        $scope.lastweek = function () {


            $scope.Addnew();

            $scope.num--;

            weektime = weekdata($scope.num);
            $scope.endtime = weektime[0];
            //获取现在的年数
            $scope.changeyear(weektime[0]);

            $scope.yearDayOfWeek = weekofyear(weektime[0]);

            $scope.search($scope.FeeNo, $scope.year, $scope.yearDayOfWeek);
        }
        //历史记录
        $scope.showhistroy = function () {
            $("#historyModal").modal("toggle");
            $scope.HistoryList = [];

            DCNurseCareLifeList.get({ FEENO: $scope.FeeNo }, function (obj) {

                for (var i = 0; i < obj.Data.length; i++) {

                    var tt = {

                        data: obj.Data[i],
                        num: $scope.weekenddata(obj.Data[i].WEEKSTARTDATE),
                    };
                    $scope.HistoryList.push(tt);
                }

            });
        };
        // 下周
        $scope.nextweek = function () {

            $scope.Addnew();

            $scope.num++;

            weektime = weekdata($scope.num);

            $scope.endtime = weektime[0];

            $scope.changeyear(weektime[0]);


            $scope.yearDayOfWeek = weekofyear(weektime[0]);

            $scope.search($scope.FeeNo, $scope.year, $scope.yearDayOfWeek);
        }
        // 滞空
        $scope.Addnew = function () {

            $scope.item1 = {};
            $scope.item2 = {};
            $scope.item3 = {};
            $scope.item4 = {};
            $scope.item5 = {};
            $scope.NURSE = {};
            $scope.CheckCodeA = "";
            $scope.CheckCodeB = "";
            $scope.CheckCodeC = "";
            $scope.CheckCodeD = "";
            $scope.CheckCodeE = "";
            $scope.CheckCodeF = "";
            $scope.CheckCodeG = "";
            $scope.CheckCodeH = "";
            $scope.CheckCodeI = "";
            $scope.CheckCodeJ = "";
            $scope.CheckCodeK = "";
            $scope.CheckCodeL = "";
            $scope.CheckCodeN = "";
            $scope.CheckCodeM = "";
            $scope.CheckCodeO = "";
            $scope.CheckCodeP = "";
            $scope.CheckCodeQ = "";
            $scope.CheckCodeR = "";
            $scope.CheckCodeS = "";
            $scope.CheckCodeT = "";
            $scope.CheckCodeU = "";
            $scope.CheckCodeV = "";
            $scope.CheckCodeW = "";
            $scope.CheckCodeX = "";
            $scope.CheckCodeY = "";
            $scope.DCWeekshow1 = false;
            $scope.DCWeekshow2 = false;
            $scope.DCWeekshow3 = false;
            $scope.DCWeekshow4 = false;
            $scope.DCWeekshow5 = false;
        }
        // 查询的东西
        $scope.search = function (FeeNo, year, num) {

            DCNurseCareLifeServiceRes.get({ FeeNo: FeeNo, year: year, num: num }, function (obj) {

                if (obj.Data.NurseingLifeCareEDTL[0] != null) {

                    $scope.item1 = obj.Data.NurseingLifeCareEDTL[0];
                    //一个值
                    var arrlist = $scope.arrlist($scope.item1.ACTIVITY9)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item1.ACTIVITY9)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item1.CheckA = arrlist[2];

                    $scope.item1.ACTIVITY9 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item1.Checkcy1 = checkcode;

                    //两个值
                    var arrlist = $scope.arrlist($scope.item1.ACTIVITY11)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item1.ACTIVITY11)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item1.CheckF = arrlist[2];

                    $scope.item1.ACTIVITY11 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item1.Checkcy2 = checkcode;

                    //三值
                    var arrlist = $scope.arrlist($scope.item1.ACTIVITY14)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item1.ACTIVITY14)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item1.CheckK = arrlist[2];

                    $scope.item1.ACTIVITY14 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item1.Checkcy3 = checkcode;

                    //四值
                    var arrlist = $scope.arrlist($scope.item1.ACTIVITY15)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item1.ACTIVITY15)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item1.CheckP = arrlist[2];

                    $scope.item1.ACTIVITY15 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item1.Checkcy4 = checkcode;

                    //五值
                    var arrlist = $scope.arrlist($scope.item1.ACTIVITY16)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item1.ACTIVITY16)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item1.CheckU = arrlist[2];

                    $scope.item1.ACTIVITY16 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item1.Checkcy5 = checkcode;
                }

                if (obj.Data.NurseingLifeCareEDTL[1] != null) {

                    $scope.item2 = obj.Data.NurseingLifeCareEDTL[1];
                    var arrlist = $scope.arrlist($scope.item2.ACTIVITY9)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item2.ACTIVITY9)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item2.CheckB = arrlist[2];

                    $scope.item2.ACTIVITY9 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item2.Checkcy1 = checkcode;

                    //两个值
                    var arrlist = $scope.arrlist($scope.item2.ACTIVITY11)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item2.ACTIVITY11)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item2.CheckG = arrlist[2];

                    $scope.item2.ACTIVITY11 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item2.Checkcy2 = checkcode;

                    //三值
                    var arrlist = $scope.arrlist($scope.item2.ACTIVITY14)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item2.ACTIVITY14)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item2.CheckL = arrlist[2];

                    $scope.item2.ACTIVITY14 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item2.Checkcy3 = checkcode;

                    //四值
                    var arrlist = $scope.arrlist($scope.item2.ACTIVITY15)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item2.ACTIVITY15)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item2.CheckQ = arrlist[2];

                    $scope.item2.ACTIVITY15 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item2.Checkcy4 = checkcode;

                    //五值
                    var arrlist = $scope.arrlist($scope.item2.ACTIVITY16)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item2.ACTIVITY16)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item2.CheckV = arrlist[2];

                    $scope.item2.ACTIVITY16 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item2.Checkcy5 = checkcode;

                }

                if (obj.Data.NurseingLifeCareEDTL[2] != null) {

                    $scope.item3 = obj.Data.NurseingLifeCareEDTL[2];
                    var arrlist = $scope.arrlist($scope.item3.ACTIVITY9)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item3.ACTIVITY9)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item3.CheckC = arrlist[2];

                    $scope.item3.ACTIVITY9 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item3.Checkcy1 = checkcode;

                    //两个值
                    var arrlist = $scope.arrlist($scope.item3.ACTIVITY11)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item3.ACTIVITY11)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item3.CheckH = arrlist[2];

                    $scope.item3.ACTIVITY11 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item3.Checkcy2 = checkcode;

                    //三值
                    var arrlist = $scope.arrlist($scope.item3.ACTIVITY14)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item3.ACTIVITY14)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item3.CheckN = arrlist[2];

                    $scope.item3.ACTIVITY14 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item3.Checkcy3 = checkcode;

                    //四值
                    var arrlist = $scope.arrlist($scope.item3.ACTIVITY15)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item3.ACTIVITY15)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item3.CheckR = arrlist[2];

                    $scope.item3.ACTIVITY15 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item3.Checkcy4 = checkcode;

                    //五值
                    var arrlist = $scope.arrlist($scope.item3.ACTIVITY16)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item3.ACTIVITY16)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item3.CheckW = arrlist[2];

                    $scope.item3.ACTIVITY16 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item3.Checkcy5 = checkcode;
                }
                if (obj.Data.NurseingLifeCareEDTL[3] != null) {

                    $scope.item4 = obj.Data.NurseingLifeCareEDTL[3];

                    var arrlist = $scope.arrlist($scope.item4.ACTIVITY9)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item4.ACTIVITY9)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item4.CheckD = arrlist[2];

                    $scope.item4.ACTIVITY9 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item4.Checkcy1 = checkcode;

                    //两个值
                    var arrlist = $scope.arrlist($scope.item4.ACTIVITY11)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item4.ACTIVITY11)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item4.CheckI = arrlist[2];

                    $scope.item4.ACTIVITY11 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item4.Checkcy2 = checkcode;

                    //三值
                    var arrlist = $scope.arrlist($scope.item4.ACTIVITY14)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item4.ACTIVITY14)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item4.CheckM = arrlist[2];

                    $scope.item4.ACTIVITY14 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item4.Checkcy3 = checkcode;

                    //四值
                    var arrlist = $scope.arrlist($scope.item4.ACTIVITY15)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item4.ACTIVITY15)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item4.CheckS = arrlist[2];

                    $scope.item4.ACTIVITY15 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item4.Checkcy4 = checkcode;

                    //五值
                    var arrlist = $scope.arrlist($scope.item4.ACTIVITY16)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item4.ACTIVITY16)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item4.CheckX = arrlist[2];

                    $scope.item4.ACTIVITY16 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item4.Checkcy5 = checkcode;

                }
                if (obj.Data.NurseingLifeCareEDTL[4] != null) {

                    $scope.item5 = obj.Data.NurseingLifeCareEDTL[4];

                    var arrlist = $scope.arrlist($scope.item5.ACTIVITY9)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item5.ACTIVITY9)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item5.CheckE = arrlist[2];

                    $scope.item5.ACTIVITY9 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item5.Checkcy1 = checkcode;

                    //两个值
                    var arrlist = $scope.arrlist($scope.item5.ACTIVITY11)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item5.ACTIVITY11)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item5.CheckJ = arrlist[2];

                    $scope.item5.ACTIVITY11 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item5.Checkcy2 = checkcode;

                    //三值
                    var arrlist = $scope.arrlist($scope.item5.ACTIVITY14)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item5.ACTIVITY14)[1];

                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item5.CheckO = arrlist[2];

                    $scope.item5.ACTIVITY14 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item5.Checkcy3 = checkcode;

                    //四值
                    var arrlist = $scope.arrlist($scope.item5.ACTIVITY15)[0].split(",");

                    var checkcode = $scope.arrlist($scope.item5.ACTIVITY15)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item5.CheckT = arrlist[2];

                    $scope.item5.ACTIVITY15 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item5.Checkcy4 = checkcode;

                    //五值
                    var arrlist = $scope.arrlist($scope.item5.ACTIVITY16)[0].split(",");
                    var checkcode = $scope.arrlist($scope.item5.ACTIVITY16)[1];
                    $scope.GetTeamAct(parseInt(arrlist[0]), arrlist[2]);

                    $scope.item5.CheckY = arrlist[2];

                    $scope.item5.ACTIVITY16 = arrlist[0] + "," + arrlist[1] + "," + arrlist[2];

                    $scope.item5.Checkcy5 = checkcode;
                }

                ////显示时间的变化
                $scope.item1.DAYOFWEEK = weektime[0];
                $scope.item2.DAYOFWEEK = weektime[1];
                $scope.item3.DAYOFWEEK = weektime[2];
                $scope.item4.DAYOFWEEK = weektime[3];
                $scope.item5.DAYOFWEEK = weektime[4];
                $scope.NURSE = obj.Data.NurseingLifeCareREC;
                $scope.NURSE.RESIDENTNO = $scope.ResNo;

                $scope.NURSE.REGNAME = $scope.Rename;
                $scope.NURSE.SEX = $scope.ReSex;
                //控制是否能够读取
                $scope.comparesize(weektime, $scope.TdTime);
            });
        };
        //截取所有子符的组成
        $scope.arrlist = function (str) {

            var varToile = new Array();

            varToile = str.split("|");

            if (varToile[1] === "undefined") {
                varToile[1] = "";
            }
            return varToile;
        }

        //保存
        $scope.saveForm = function (item1, item2, item3, item4, item5, NURSE) {
            var item = [];


            if ($scope.DCWeekshow1 === true) {
                item1.HOLIDAYFLAG = "True";

            }
            else {
                item1.HOLIDAYFLAG = "False";
            }

            if ($scope.DCWeekshow2 == true) {

                item2.HOLIDAYFLAG = "True";
            }
            else {
                item2.HOLIDAYFLAG = "False";

            }
            if ($scope.DCWeekshow3 == true) {
                item3.HOLIDAYFLAG = "True";

            }
            else {
                item3.HOLIDAYFLAG = "False";

            }
            if ($scope.DCWeekshow4 == true) {
                item4.HOLIDAYFLAG = "True";

            }
            else {
                item4.HOLIDAYFLAG = "False";

            }
            if ($scope.DCWeekshow5 == true) {
                item5.HOLIDAYFLAG = "True";

            }
            else {
                item5.HOLIDAYFLAG = "False";

            }
            // item.push(item1);

            ////这边这个是全区的变量

            // item1.ACTIVITY9 = item1.ACTIVITY9 + "|" + item1.Checkcy1;

            // item1.ACTIVITY11 = item1.ACTIVITY11 + "|" + item1.Checkcy2;
            // item1.ACTIVITY14 = item1.ACTIVITY14 + "|" + item1.Checkcy3;
            // item1.ACTIVITY15 = item1.ACTIVITY15 + "|" + item1.Checkcy4;
            // item1.ACTIVITY16 = item1.ACTIVITY16 + "|" + item1.Checkcy5;

            // item.push(item2);

            // item2.ACTIVITY9 = item2.ACTIVITY9 + "|" + item2.Checkcy1;
            // item2.ACTIVITY11 = item2.ACTIVITY11 + "|" + item2.Checkcy2;
            // item2.ACTIVITY14 = item2.ACTIVITY14 + "|" + item2.Checkcy3;
            // item2.ACTIVITY15 = item2.ACTIVITY15 + "|" + item2.Checkcy4;
            // item2.ACTIVITY16 = item2.ACTIVITY16 + "|" + item2.Checkcy5;

            // item.push(item3);

            // item3.ACTIVITY9 = item3.ACTIVITY9 + "|" + item3.Checkcy1;
            // item3.ACTIVITY11 = item3.ACTIVITY11 + "|" + item3.Checkcy2;
            // item3.ACTIVITY14 = item3.ACTIVITY14 + "|" + item3.Checkcy3;
            // item3.ACTIVITY15 = item3.ACTIVITY15 + "|" + item3.Checkcy4;
            // item3.ACTIVITY16 = item3.ACTIVITY16 + "|" + item3.Checkcy5;

            // item.push(item4);

            // item4.ACTIVITY9 = item4.ACTIVITY9 + "|" + item4.Checkcy1;
            // item4.ACTIVITY11 = item4.ACTIVITY11 + "|" + item4.Checkcy2;
            // item4.ACTIVITY14 = item4.ACTIVITY14 + "|" + item4.Checkcy3;
            // item4.ACTIVITY15 = item4.ACTIVITY15 + "|" + item4.Checkcy4;
            // item4.ACTIVITY16 = item4.ACTIVITY16 + "|" + item4.Checkcy5;
            // item.push(item5);

            // item5.ACTIVITY9 = item5.ACTIVITY9 + "|" + item5.Checkcy1;
            // item5.ACTIVITY11 = item5.ACTIVITY11 + "|" + item5.Checkcy2;
            // item5.ACTIVITY14 = item5.ACTIVITY14 + "|" + item5.Checkcy3;
            // item5.ACTIVITY15 = item5.ACTIVITY15 + "|" + item5.Checkcy4;
            // item5.ACTIVITY16 = item5.ACTIVITY16 + "|" + item5.Checkcy5;


            //保存数据，能储存数据
            var Titem1 = {
                NurseingLifeCare: item1,
                Checkcy1: item1.Checkcy1,
                Checkcy2: item1.Checkcy2,
                Checkcy3: item1.Checkcy3,
                Checkcy4: item1.Checkcy4,
                Checkcy5: item1.Checkcy5,
            }
            item.push(Titem1);

            var Titem2 = {
                NurseingLifeCare: item2,
                Checkcy1: item2.Checkcy1,
                Checkcy2: item2.Checkcy2,
                Checkcy3: item2.Checkcy3,
                Checkcy4: item2.Checkcy4,
                Checkcy5: item2.Checkcy5,
            }
            item.push(Titem2);

            var Titem3 = {

                NurseingLifeCare: item3,
                Checkcy1: item3.Checkcy1,
                Checkcy2: item3.Checkcy2,
                Checkcy3: item3.Checkcy3,
                Checkcy4: item3.Checkcy4,
                Checkcy5: item3.Checkcy5,
            }
            item.push(Titem3);

            var Titem4 = {

                NurseingLifeCare: item4,
                Checkcy1: item4.Checkcy1,
                Checkcy2: item4.Checkcy2,
                Checkcy3: item4.Checkcy3,
                Checkcy4: item4.Checkcy4,
                Checkcy5: item4.Checkcy5,
            }
            item.push(Titem4);

            var Titem5 = {

                NurseingLifeCare: item5,
                Checkcy1: item5.Checkcy1,
                Checkcy2: item5.Checkcy2,
                Checkcy3: item5.Checkcy3,
                Checkcy4: item5.Checkcy4,
                Checkcy5: item5.Checkcy5,
            }
            item.push(Titem5);

            var NurseingLifeCareREC = {
                ID: $scope.NURSE.ID,
                RESIDENTNO: NURSE.RESIDENTNO,
                REGNAME: NURSE.REGNAME,
                SEX: NURSE.SEX,
                NURSEAIDES: NURSE.NURSEAIDES,
                SECURITYMEASURES: NURSE.SECURITYMEASURES,
                ARTICLESCARRIED: NURSE.ARTICLESCARRIED,
                MEDICATIONINSTRUCTIONS: NURSE.MEDICATIONINSTRUCTIONS,
                ACTIVITYSUMMARY: NURSE.ACTIVITYSUMMARY,
                QUESTIONBEHAVIOR: NURSE.QUESTIONBEHAVIOR,
                REMARKS: NURSE.REMARKS,
                REGNO: $scope.currentResident.RegNo,
                ORGID: $scope.currentResident.ResidentOrg,
                FEENO: $scope.FeeNo,
                WEEKSTARTDATE: $scope.endtime,
                WEEKNUMBER: $scope.yearDayOfWeek,
            };

            var para = {
                NurseingLifeCareREC: NurseingLifeCareREC,
                NurseingLifeCareEDTL: item
            }
            DCNurseCareLifeServiceRes.save(para, function (data) {

                utility.message("存储成功");

                $scope.search($scope.FeeNo, $scope.year, $scope.yearDayOfWeek);

            });
        }
        //根据现在时间的周数，求出下一周，上一周的日期数
        function weekdata(t) {
            //获得星期一到星期五的时间
            var timerar = [];

            var today = new Date();

            var weekday = today.getDay();


            for (var i = 1; i <= 5; i++) {
                //获取上一周，下一周的时间
                var times = new Date(1000 * 60 * 60 * 24 * (i + t * 7 - weekday) + today.getTime());

                var year = times.getFullYear();

                var month = times.getMonth() + 1;
                var day = times.getDate();

                if (month < 10) {

                    month = "0" + month;
                }
                if (day < 10) {

                    day = "0" + day;
                }
                var time = year + "-" + month + "-" + day;
                timerar.push(time);
            }
            return timerar;
        }
        //求星期下的第几周

        function weekofyear(sdate) {
            var d = new Date(sdate);
            var myYear = d.getFullYear();
            var firstDate = new Date(myYear + "-01-01");
            var dayofyear = 0;
            for (var i = 0; i < d.getMonth() ; i++) {
                switch (i) {
                    case 0:
                    case 2:
                    case 4:
                    case 6:
                    case 7:
                    case 9:
                        dayofyear += 31;
                        break;
                    case 1:
                        if (isLeapYear(d)) {
                            dayofyear += 29;
                        }
                        else {
                            dayofyear += 28;
                        }
                        break;
                    case 3:
                    case 5:
                    case 8:
                    case 10:
                        dayofyear += 30;
                        break;
                }
            }
            dayofyear += d.getDate() + 1;
            var week = firstDate.getDay();
            var dayNum = dayofyear - (7 - week);
            var weekNum = 1;
            weekNum = weekNum + (dayNum / 7);
            if (dayNum % 7 != 0)
                weekNum = weekNum + 1;


            return parseInt(weekNum);
        }
        function isLeapYear(date) {
            return (0 == date.getFullYear() % 4 && ((date.getFullYear() % 100 != 0) || (date.getFullYear() % 400 == 0)));
        }
        //编辑历史记录
        $scope.editNurseing = function (list) {

            $("#historyModal").modal("toggle");
            //编辑后的东西
            //当前周
            $scope.Addnew();
            $scope.yearDayOfWeek = weekofyear(list.WEEKSTARTDATE);
            $scope.changeyear(list.WEEKSTARTDATE);

            var tt = WeeksBetw(list.WEEKSTARTDATE, new Date());

            $scope.num = tt;

            weektime = weekdata($scope.num);

            $scope.endtime = weektime[0];

            $scope.search($scope.FeeNo, $scope.year, $scope.yearDayOfWeek);
        };
        //获取一周的最后一天时间
        $scope.weekenddata = function (t) {
            //获得星期一到星期五的时间
            //var t = t.replace(/-/g, "/");

            var today = new Date(t);

            var weekday = today.getDay();

            //获取上一周，下一周的时间
            var times = new Date(1000 * 60 * 60 * 24 * (5 - weekday) + today.getTime());

            var year = times.getFullYear();

            var month = times.getMonth() + 1;
            var day = times.getDate();

            if (month < 10) {

                month = "0" + month;
            }
            if (day < 10) {

                day = "0" + day;
            }

            var time = year + "-" + month + "-" + day;

            return time;
        }
        //js求出现在的年限
        $scope.changeyear = function (years) {

            var today = new Date(years);

            $scope.year = today.getFullYear();
        }

        $scope.change = function (num, code) {

            $scope.GetTeamAct(num, code);
        }

        $scope.GetTeamAct = function (num, code) {
            DCNurseCareLifeEdit.get({ code: code }, function (data) {

                switch (num) {
                    case 1:
                        if (code == "a") {
                            $scope.CheckCodeA = data.Data;
                        }
                        else {
                            $scope.CheckCodeA = data.Data;
                        }
                        break;
                    case 2:
                        if (code == "a") {

                            $scope.CheckCodeB = data.Data;
                        }
                        else {
                            $scope.CheckCodeB = data.Data;
                        }
                        break;
                    case 3:
                        if (code == "a") {

                            $scope.CheckCodeC = data.Data;
                        }
                        else {
                            $scope.CheckCodeC = data.Data;
                        }
                        break;
                    case 4:
                        if (code == "a") {

                            $scope.CheckCodeD = data.Data;
                        }
                        else {
                            $scope.CheckCodeD = data.Data;
                        }
                        break;
                    case 5:
                        if (code == "a") {

                            $scope.CheckCodeE = data.Data;
                        }
                        else {
                            $scope.CheckCodeE = data.Data;
                        }
                        break;
                    case 6:
                        if (code == "a") {

                            $scope.CheckCodeF = data.Data;
                        }
                        else {
                            $scope.CheckCodeF = data.Data;
                        }
                        break;
                    case 7:
                        if (code == "a") {

                            $scope.CheckCodeG = data.Data;
                        }
                        else {
                            $scope.CheckCodeG = data.Data;
                        }
                        break;
                    case 8:
                        if (code == "a") {

                            $scope.CheckCodeH = data.Data;
                        }
                        else {
                            $scope.CheckCodeH = data.Data;
                        }
                        break;
                    case 9:
                        if (code == "a") {

                            $scope.CheckCodeI = data.Data;
                        }
                        else {
                            $scope.CheckCodeI = data.Data;
                        }
                        break;
                    case 10:
                        if (code == "a") {

                            $scope.CheckCodeJ = data.Data;
                        }
                        else {
                            $scope.CheckCodeJ = data.Data;
                        }
                        break;
                    case 11:
                        if (code == "a") {

                            $scope.CheckCodeK = data.Data;
                        }
                        else {
                            $scope.CheckCodeK = data.Data;
                        }
                        break;
                    case 12:
                        if (code == "a") {

                            $scope.CheckCodeL = data.Data;
                        }
                        else {
                            $scope.CheckCodeL = data.Data;
                        }
                        break;
                    case 13:
                        if (code == "a") {

                            $scope.CheckCodeN = data.Data;
                        }
                        else {
                            $scope.CheckCodeN = data.Data;
                        }
                        break;
                    case 14:
                        if (code == "a") {

                            $scope.CheckCodeM = data.Data;
                        }
                        else {
                            $scope.CheckCodeM = data.Data;
                        }
                        break;
                    case 15:
                        if (code == "a") {

                            $scope.CheckCodeO = data.Data;
                        }
                        else {
                            $scope.CheckCodeO = data.Data;
                        }
                        break;
                    case 16:
                        if (code == "a") {

                            $scope.CheckCodeP = data.Data;
                        }
                        else {
                            $scope.CheckCodeP = data.Data;
                        }
                        break;
                    case 17:
                        if (code == "a") {

                            $scope.CheckCodeQ = data.Data;
                        }
                        else {
                            $scope.CheckCodeQ = data.Data;
                        }
                        break;
                    case 18:
                        if (code == "a") {

                            $scope.CheckCodeR = data.Data;
                        }
                        else {
                            $scope.CheckCodeR = data.Data;
                        }
                        break;
                    case 19:
                        if (code == "a") {

                            $scope.CheckCodeS = data.Data;
                        }
                        else {
                            $scope.CheckCodeS = data.Data;
                        }
                        break;
                    case 20:
                        if (code == "a") {

                            $scope.CheckCodeT = data.Data;
                        }
                        else {
                            $scope.CheckCodeT = data.Data;
                        }
                        break;
                    case 21:
                        if (code == "a") {

                            $scope.CheckCodeU = data.Data;
                        }
                        else {
                            $scope.CheckCodeU = data.Data;
                        }
                        break;
                    case 22:
                        if (code == "a") {

                            $scope.CheckCodeV = data.Data;
                        }
                        else {
                            $scope.CheckCodeV = data.Data;
                        }
                        break;
                    case 23:
                        if (code == "a") {
                            $scope.CheckCodeW = data.Data;
                        }
                        else {
                            $scope.CheckCodeW = data.Data;
                        }
                        break;
                    case 24:
                        if (code == "a") {

                            $scope.CheckCodeX = data.Data;
                        }
                        else {
                            $scope.CheckCodeX = data.Data;
                        }
                        break;
                    case 25:
                        if (code == "a") {

                            $scope.CheckCodeY = data.Data;
                        }
                        else {
                            $scope.CheckCodeY = data.Data;
                        }
                        break;
                }
            });
        }
        //根据初始日期获得周末日期
        //删除的功能
        $scope.deleteReferral = function (id) {

            if (confirm("确定删除该信息吗?")) {
                DCNurseCareLifeServiceRes.delete({ id: id }, function (data) {

                    utility.message("删除成功");

                    $scope.showhistroy();
                    //删除后默认回到本周
                    $scope.Addnew();
                    $scope.week();

                });
            }
        }
        //返回两个时间之间相差的周数
        function WeeksBetw(date1) {

            s1 = new Date(date1);
            s2 = new Date();
            var days = s1.getTime() - s2.getTime();

            return Math.ceil(days / (1000 * 60 * 60 * 24 * 7))
        }
        //获取当前时间(判断每周的东西是不是可以输入)
        $scope.GetDaytime = function () {
            var today = new Date();

            var year = today.getFullYear();

            var month = today.getMonth() + 1;

            var day = today.getDate();
            if (month < 10) {

                month = "0" + month;
            }
            if (day < 10) {

                day = "0" + day;
            }
            var time = year + "-" + month + "-" + day;
            $scope.TdTime = time;
        }
        //打印
        $scope.PrintPreview = function () {
            if (angular.isDefined($scope.NURSE.ID) && $scope.NURSE.ID != 0) {

                window.open('/DC_Report/PreviewNurseCare?templateName=DCC1.1护理及生活照顾服务记录表&recId=' + $scope.NURSE.ID);

            } else {
                utility.message("未获取到护理及生活照顾服务记录表,无法打印！");
            }
        }
        $scope.init();

    }])

