angular.module("sltcApp").controller("DCDayLifeCareCtrl", ['$rootScope', '$scope', 'dictionary', 'DCDayLifeCareRes', 'DCDayLifeCareList', 'DCDayLifeCareListA', 'utility', '$state', 'employeeRes',
    function ($rootScope, $scope, dictionary, DCDayLifeCareRes, DCDayLifeCareList, DCDayLifeCareListA, utility, $state, employeeRes) {
        $scope.FeeNo = 0;
        $scope.StrFeeNo = '';
        $scope.StrRegNo = '';
        $scope.btn_s = false;
        //控制是否可选控制是否可以输出
        $scope.OrgName = "";
        //有用
        $scope.DCshow1 = true;
        $scope.DCshow2 = true;
        $scope.DCshow3 = true;
        $scope.DCshow4 = true;
        $scope.DCshow5 = true;
        //根据时间控制可以修改
        $scope.DCtimedisabled1 = false;
        $scope.DCtimedisabled2 = false;
        $scope.DCtimedisabled3 = false;
        $scope.DCtimedisabled4 = false;
        $scope.DCtimedisabled5 = false;
        //有用
        $scope.num = 0;

        //控制星期checkbox选中

        $scope.fun = function (num) {
            switch (num) {
                case 1:
                    if ($scope.DCshow1 == true) {
                        //  $("input[name='Ditem1']").attr("disabled", false);

                        $scope.DCshow1 = false
                        $scope.DCWeekshow1 = false;
                    }
                    else {

                        // $("input[name='Ditem1']").attr("disabled", true);
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

        $scope.init = function () {
            //$scope.OrgName = $rootScope.Global.Organization;
            if ($scope.FeeNo == null || $scope.FeeNo == "") {
                $scope.btn_s = true;
            }
            //当前时间
            $scope.TdTime = "";
            //年份
            $scope.year = "";
            //周数
            $scope.yearDayOfWeek = "";
            //赋值给这个星期的第几周
            $scope.fristquery();
            //获取今年的年份
            $scope.getyear();
            // 这个是控制每次获得星期一到星期五的日期


            //设置初始值包含 日字号、姓名、性别
            $scope.ResNo = "";
            $scope.Rename = "";
            $scope.ReSex = "";
            $scope.GetDaytime();
            //初始时间
            weektime = weekdata($scope.num);

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

            // $scope.Showtoggle(weektime, $scope.TdTime);

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

        $scope.Showtoggle = function (TDtime, Ctime) {
            if (TDtime[0] > Ctime) {

                $("input:text", $("#TEA91")).attr("disabled", true)
            }
            else {
                //$("input[name='Ditem1']").removeAttr("disabled");
                $("input:text", $("#TEA91")).attr("disabled", false)
            }
            if (TDtime[1] > Ctime) {

                $("input[name='Ditem2']").attr("disabled", true);
            }
            else {

                $("input[name='Ditem2']").removeAttr("disabled");
            }

            if (TDtime[2] > Ctime) {
                $("input[name='Ditem3']").attr("disabled", true);
            }
            else {
                $("input[name='Ditem3']").removeAttr("disabled");

            }
            if (TDtime[3] > Ctime) {
                $("input[name='Ditem4']").attr("disabled", true);
            }
            else {

                $("input[name='Ditem4']").removeAttr("disabled");

            }
            if (TDtime[4] > Ctime) {
                $("input[name='Ditem5']").attr("disabled", true);
            }
            else {
                $("input[name='Ditem5']").removeAttr("disabled");

            }

            //$("input[name='Ditem1']").attr("disabled", true);

            // $("input[name='Ditem1']").attr("disabled", 'disabled');

            //$("#TEA91").attr("disabled", 'disabled');

            // $("input[name='Ditem1']").removeAttr("disabled");

            //$("#TEA91").attr("disabled", 'disabled');

        }


        //现在所属本年度的周数
        $scope.fristquery = function () {
            DCDayLifeCareRes.get({ "Data": {} }, function (obj) {
                //求现在的周数
                $scope.yearDayOfWeek = obj.PagesCount;
            });
        }
        //求现在的年限    
        $scope.getyear = function () {

            var today = new Date();

            $scope.year = today.getFullYear();
        }
        //$scope.onchange = function ()
        //{
        //    $scope.Addnew();
        //    var dates = document.getElementById('d122').value;
        //    var tt = document.getElementById('d122_1').value;

        //    $scope.changeyear(dates);

        //    $scope.num = tt;

        //   var weeknum = tt - $scope.todayweeknum;
        //   weektime = weekdata(weeknum);

        //   $scope.tt = weeknum;

        //   $scope.search($scope.currentResident.RegNo, $scope.year, tt);
        //}

        //选中住民
        $scope.residentSelected = function (resident) {
            //$scope.OrgName = $rootScope.Global.Organization;
            //$scope.num = 0;
            $scope.StrFeeNo = resident.ResidentNo;
            $scope.StrRegNo = resident.PersonNo;
            resident.FeeNo = utility.hashCode(resident.ResidentNo);
            resident.RegNo = utility.hashCode(resident.PersonNo);
            $scope.currentResident = resident;
            $scope.currentResident.OrgId = resident.OrgId;
            $scope.currentResident.RegNo = resident.RegNo;

            //住院信息
            $scope.FeeNo = resident.FeeNo

            if ($scope.FeeNo != null && $scope.FeeNo != "") {
                $scope.btn_s = false;
            }

            // 时间默认为0的时候，查询出现在的日期,根据现在的周数来进行时间的递减添加
            weektime = weekdata($scope.num);
            //这是每周某的开始时间
            $scope.endtime = weektime[0];
            $scope.item1 = {};
            $scope.item2 = {};
            $scope.item3 = {};
            $scope.item4 = {};
            $scope.item5 = {};
            $scope.DAYLIFE = {};
            //控制输入框是可以操作还是不可以操作
            //日字号
            $scope.ResNo = resident.ResidentNo;
            //姓名
            $scope.Rename = resident.PersonName;
            //性别
            $scope.ReSex = resident.Sex;
            ////默认是本周
            $scope.search($scope.FeeNo, $scope.year, $scope.yearDayOfWeek);

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

            DCDayLifeCareList.get({ FEENO: $scope.FeeNo }, function (obj) {

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
            $scope.DAYLIFE = {};
            $scope.DCWeekshow1 = false;
            $scope.DCWeekshow2 = false;
            $scope.DCWeekshow3 = false;
            $scope.DCWeekshow4 = false;
            $scope.DCWeekshow5 = false;

        }
        // 查询的东西
        $scope.search = function (FeeNo, year, num) {

            $scope.Addnew();
            DCDayLifeCareRes.get({ FeeNo: FeeNo, year: year, num: num }, function (obj) {
                // 这边判断这边的东西
                if (obj.Data.DayLifeCaredtl[0] != null) {
                    $scope.item1 = obj.Data.DayLifeCaredtl[0];
                    if (obj.Data.DayLifeCaredtl[0].TOILETTIME != null) {
                        $scope.arrlist(obj.Data.DayLifeCaredtl[0].TOILETTIME);
                        $scope.item1.TOILETTIME1 = $scope.arrToileTime[0];
                        $scope.item1.TOILETTIME2 = $scope.arrToileTime[1];
                        $scope.item1.TOILETTIME3 = $scope.arrToileTime[2];
                        $scope.item1.TOILETTIME4 = $scope.arrToileTime[3];
                        $scope.item1.TOILETTIME5 = $scope.arrToileTime[4];
                        $scope.item1.TOILETTIME6 = $scope.arrToileTime[5];
                    }
                }
                if (obj.Data.DayLifeCaredtl[1] != null) {
                    $scope.item2 = obj.Data.DayLifeCaredtl[1];
                    if (obj.Data.DayLifeCaredtl[1].TOILETTIME != null) {
                        $scope.arrlist(obj.Data.DayLifeCaredtl[1].TOILETTIME);
                        $scope.item2.TOILETTIME1 = $scope.arrToileTime[0];
                        $scope.item2.TOILETTIME2 = $scope.arrToileTime[1];
                        $scope.item2.TOILETTIME3 = $scope.arrToileTime[2];
                        $scope.item2.TOILETTIME4 = $scope.arrToileTime[3];
                        $scope.item2.TOILETTIME5 = $scope.arrToileTime[4];
                        $scope.item2.TOILETTIME6 = $scope.arrToileTime[5];
                    }
                }
                if (obj.Data.DayLifeCaredtl[2] != null) {
                    $scope.item3 = obj.Data.DayLifeCaredtl[2];

                    if (obj.Data.DayLifeCaredtl[2].TOILETTIME != null) {

                        $scope.arrlist(obj.Data.DayLifeCaredtl[2].TOILETTIME);
                        $scope.item3.TOILETTIME1 = $scope.arrToileTime[0];
                        $scope.item3.TOILETTIME2 = $scope.arrToileTime[1];
                        $scope.item3.TOILETTIME3 = $scope.arrToileTime[2];
                        $scope.item3.TOILETTIME4 = $scope.arrToileTime[3];
                        $scope.item3.TOILETTIME5 = $scope.arrToileTime[4];
                        $scope.item3.TOILETTIME6 = $scope.arrToileTime[5];
                    }
                }
                if (obj.Data.DayLifeCaredtl[3] != null) {

                    $scope.item4 = obj.Data.DayLifeCaredtl[3];
                    if (obj.Data.DayLifeCaredtl[3].TOILETTIME != null) {
                        $scope.arrlist(obj.Data.DayLifeCaredtl[3].TOILETTIME);
                        $scope.item4.TOILETTIME1 = $scope.arrToileTime[0];
                        $scope.item4.TOILETTIME2 = $scope.arrToileTime[1];
                        $scope.item4.TOILETTIME3 = $scope.arrToileTime[2];
                        $scope.item4.TOILETTIME4 = $scope.arrToileTime[3];
                        $scope.item4.TOILETTIME5 = $scope.arrToileTime[4];
                        $scope.item4.TOILETTIME6 = $scope.arrToileTime[5];
                    }
                }
                if (obj.Data.DayLifeCaredtl[4] != null) {

                    $scope.item5 = obj.Data.DayLifeCaredtl[4];
                    if (obj.Data.DayLifeCaredtl[4].TOILETTIME != null) {
                        $scope.arrlist(obj.Data.DayLifeCaredtl[4].TOILETTIME);
                        $scope.item5.TOILETTIME1 = $scope.arrToileTime[0];
                        $scope.item5.TOILETTIME2 = $scope.arrToileTime[1];
                        $scope.item5.TOILETTIME3 = $scope.arrToileTime[2];
                        $scope.item5.TOILETTIME4 = $scope.arrToileTime[3];
                        $scope.item5.TOILETTIME5 = $scope.arrToileTime[4];
                        $scope.item5.TOILETTIME6 = $scope.arrToileTime[5];
                    }
                }

                //显示时间的变化
                $scope.item1.DAYOFWEEK = weektime[0];
                $scope.item2.DAYOFWEEK = weektime[1];
                $scope.item3.DAYOFWEEK = weektime[2];
                $scope.item4.DAYOFWEEK = weektime[3];
                $scope.item5.DAYOFWEEK = weektime[4];
                $scope.DAYLIFE = obj.Data.DayLifeRec;

                $scope.DAYLIFE.RESIDENTNO = $scope.ResNo;

                $scope.DAYLIFE.REGNAME = $scope.Rename;
                $scope.DAYLIFE.SEX = $scope.ReSex;
                //控制显示隐藏的
                $scope.comparesize(weektime, $scope.TdTime);



            });
        };
        //保存
        $scope.saveForm = function (item1, item2, item3, item4, item5, DAYLIFE) {


            if ($scope.DCWeekshow1 == true) {
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
            //判断是否为空

            //如厕时间
            $scope.item1.TOILETTIME = $scope.item1.TOILETTIME1 + "," + $scope.item1.TOILETTIME2 + "|" + $scope.item1.TOILETTIME3 + "," + $scope.item1.TOILETTIME4 + "|" + $scope.item1.TOILETTIME5 + "," + $scope.item1.TOILETTIME6
            $scope.item2.TOILETTIME = $scope.item2.TOILETTIME1 + "," + $scope.item2.TOILETTIME2 + "|" + $scope.item2.TOILETTIME3 + "," + $scope.item2.TOILETTIME4 + "|" + $scope.item2.TOILETTIME5 + "," + $scope.item2.TOILETTIME6
            $scope.item3.TOILETTIME = $scope.item3.TOILETTIME1 + "," + $scope.item3.TOILETTIME2 + "|" + $scope.item3.TOILETTIME3 + "," + $scope.item3.TOILETTIME4 + "|" + $scope.item3.TOILETTIME5 + "," + $scope.item3.TOILETTIME6
            $scope.item4.TOILETTIME = $scope.item4.TOILETTIME1 + "," + $scope.item4.TOILETTIME2 + "|" + $scope.item4.TOILETTIME3 + "," + $scope.item4.TOILETTIME4 + "|" + $scope.item4.TOILETTIME5 + "," + $scope.item4.TOILETTIME6
            $scope.item5.TOILETTIME = $scope.item5.TOILETTIME1 + "," + $scope.item5.TOILETTIME2 + "|" + $scope.item5.TOILETTIME3 + "," + $scope.item5.TOILETTIME4 + "|" + $scope.item5.TOILETTIME5 + "," + $scope.item5.TOILETTIME6

            var item = [];
            item.push(item1);
            item.push(item2);
            item.push(item3);
            item.push(item4);
            item.push(item5);

            var DayLifeRec = {
                ID: $scope.DAYLIFE.ID,
                RESIDENTNO: DAYLIFE.RESIDENTNO,
                REGNAME: DAYLIFE.REGNAME,
                SEX: DAYLIFE.SEX,
                NURSEAIDES: DAYLIFE.NURSEAIDES,
                CONTACTMATTERS: DAYLIFE.CONTACTMATTERS,
                NURSEAIDES: DAYLIFE.NURSEAIDES,
                FAMILYMESSAGE: DAYLIFE.FAMILYMESSAGE,
                REGNO: $scope.currentResident.RegNo,
                ORGID: $scope.currentResident.ResidentOrg,
                FEENO: $scope.FeeNo,
                WEEKSTARTDATE: $scope.endtime,
                WEEKNUMBER: $scope.yearDayOfWeek,
            };
            var para = {

                DayLifeRec: DayLifeRec,
                DAYLIFECAREDTL: item

            }
            DCDayLifeCareRes.save(para, function (data) {

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

        //开始时间，结束时间数组的分离
        $scope.arrlist = function (Toiletime) {
            $scope.arrToileTime = [];
            var varToile = new Array();
            varToile = Toiletime.split("|");
            for (var i = 0; i < varToile.length; i++) {
                var arrToile = varToile[i].split(",");

                for (var t = 0; t < arrToile.length; t++) {
                    if (arrToile[t] != "undefined") {

                        $scope.arrToileTime.push(arrToile[t]);
                    }
                    else {

                        $scope.arrToileTime.push("");
                    }
                }
            }
        }
        //编辑历史记录
        $scope.editDayLife = function (list) {

            $("#historyModal").modal("toggle");

            $scope.Addnew();
            //编辑后的东西
            //当前周
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
            // var t =  t.replace(/-/g, "/");

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

        //js求出现在的年限
        $scope.changeyear = function (years) {

            var today = new Date(years);

            $scope.year = today.getFullYear();
        }
        //根据初始日期获得周末日期
        //删除的功能
        $scope.deleteReferral = function (id) {

            if (confirm("确定删除该信息吗?")) {
                DCDayLifeCareRes.delete({ id: id }, function (data) {

                    utility.message("删除成功");

                    $scope.showhistroy();
                    $scope.Addnew();
                    //删除后默认回到本周
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

        //打印
        $scope.PrintPreview = function () {
            if (angular.isDefined($scope.DAYLIFE.ID) && $scope.DAYLIFE.ID != 0) {

                window.open('/DC_Report/PreviewNurseCare?templateName=DCC1.2日常生活照顾记录表&recId=' + $scope.DAYLIFE.ID);
            } else {
                utility.message("未获取到日常生活照顾记录表,无法打印！");
            }
        }
        $scope.init();





    }])

