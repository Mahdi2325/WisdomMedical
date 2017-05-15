angular.module("sltcApp").controller("DCNurseRequirementEvalCtrl", ['$rootScope', '$scope', '$filter', 'DCNurseRequirementEvalRes', 'DCevalsheetRes', 'DCNursePlanRes2', 'DCNursePlanRes', 'DCNsCplGoalRes', 'DCNsCplActivityRes', 'DCAssessValueRes', 'utility', '$state',
    function ($rootScope, $scope, $filter, DCNurseRequirementEvalRes, DCevalsheetRes, DCNursePlanRes2, DCNursePlanRes, DCNsCplGoalRes, DCNsCplActivityRes, DCAssessValueRes, utility, $state) {
        $scope.FeeNo = 0;
        $scope.StrFeeNo = '';
        $scope.StrRegNo = '';
        $scope.Data = {};
        $scope.currentItem = {};
        $scope.FeeID = 0;
        $scope.CurrentFeeID = 0;
        $scope.CurrentEvalNumber = 0;
        $scope.IsAdd = true;
        $scope.init = function () {
            //$scope.OrgName = $rootScope.Global.Organization;
            $scope.buttonEditShow = true;
            $scope.buttonSaveShow = true;
            $scope.buttonHistoryShow = true;
            $scope.buttonPrintShow = true;
            $scope.showEval = false;
            $scope.paneNum = -1;
            $scope.fixedCurrentPage = true;
            $scope.showEvaluationValue = true;
            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: DCNurseRequirementEvalRes,//异步请求的res
                success: function (data) {//请求成功时执行函数
                    $scope.Data.medicineList = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                },
                params: {
                    feeNo: -1
                }

            }
            $scope.curUser = { EmpNo: $scope.$root.user.id, EmpName: $scope.$root.user.EmpName }; //utility.getUserInfo();
        }
        //选住民
        $scope.residentSelected = function (resident) {
            $scope.paneNum = -1;
            $scope.buttonEditShow = false;
            $scope.buttonSaveShow = false;
            $scope.buttonHistoryShow = false;
            $scope.buttonPrintShow = false;

            $scope.StrFeeNo = resident.ResidentNo;
            $scope.StrRegNo = resident.PersonNo;
            resident.FeeNo = utility.hashCode(resident.ResidentNo);
            resident.RegNo = utility.hashCode(resident.PersonNo);

            resident.Age = (new Date().getFullYear() - new Date(resident.Birthdate).getFullYear());
            resident.Name = resident.PersonName;

            $scope.currentResident = resident;
            $scope.currentResident.BirthDay = FormatDate(resident.Birthdate);

            //加载最近一笔数据到表单
            DCNurseRequirementEvalRes.get({ feeNo: resident.FeeNo }, function (data) {
                if (data.Data == null) {
                    $scope.currentItem = {};
                    $scope.currentItem.EvalNumber = "1";
                    $scope.showEval = false;
                    $scope.paneNum = 0;
                    $scope.fixedCurrentPage = true;
                    return;
                }
                //
                $scope.showEval = true;
                $scope.fixedCurrentPage = false;

                $scope.currentItem = data.Data;

                if ($scope.currentItem.Chinesedrugflag) {
                    $scope.currentItem.Chinesedrugflag = "true";
                }
                else {
                    $scope.currentItem.Chinesedrugflag = "false";
                }
                $scope.showChinesedrug();
                if ($scope.currentItem.Westerndrugflag) {
                    $scope.currentItem.Westerndrugflag = "true";
                }
                else {
                    $scope.currentItem.Westerndrugflag = "false";
                }
                $scope.showWesterndrug();
                if ($scope.currentItem.Fall1Year) {
                    $scope.currentItem.Fall1Year = "true";
                    if ($scope.currentItem.Injuredflag) {
                        $scope.currentItem.Injuredflag = "true";
                    }
                    else {
                        $scope.currentItem.Injuredflag = "false";
                    }
                }
                else {
                    $scope.currentItem.Fall1Year = "false";
                }
                $scope.showInjured();
                $scope.showInjuredPart();



                $scope.FeeID = $scope.currentItem.Id;
                $scope.CurrentFeeID = $scope.currentItem.Id;
                $scope.CurrentEvalNumber = $scope.currentItem.EvalNumber;
                DCevalsheetRes.get({ Id: $scope.FeeID, mark: "" }, function (response) {
                    $scope.RegQuestion = response.Data;
                    $scope.IsloadAdlEditInfo = true;
                    $scope.IsloadiAdlEditInfo = true;
                    $scope.IsloadMmseEditInfo = true;
                    $scope.IsloadGdsEditInfo = true;
                    if (response.Data != null) {
                        for (var i = 0; i < response.Data.length; i++) {
                            if (response.Data[i].QUESTIONCODE == "ADL") {
                                $scope.loadAdlEditInfo(resident, response.Data[i].RECORDID);
                                $scope.RegAdlQuestion.SCORE = response.Data[i].SCORE;
                                $scope.IsloadAdlEditInfo = false;
                            }
                            if (response.Data[i].QUESTIONCODE == "IADL") {
                                $scope.loadiAdlEditInfo(resident, response.Data[i].RECORDID);
                                $scope.RegiAdlQuestion.SCORE = response.Data[i].SCORE;
                                $scope.IsloadiAdlEditInfo = false;
                            }
                            if (response.Data[i].QUESTIONCODE == "MMSE") {
                                $scope.loadMmseEditInfo(resident, response.Data[i].RECORDID);
                                $scope.RegMmseQuestion.SCORE = response.Data[i].SCORE;
                                $scope.IsloadMmseEditInfo = false;
                            }
                            if (response.Data[i].QUESTIONCODE == "GDS") {
                                $scope.loadGdsEditInfo(resident, response.Data[i].RECORDID);
                                $scope.RegGdsQuestion.SCORE = response.Data[i].SCORE;
                                $scope.IsloadGdsEditInfo = false;
                            }
                        }
                    }
                    if ($scope.IsloadAdlEditInfo) {
                        $scope.loadAdlEditInfo(resident, "");
                    }
                    if ($scope.IsloadiAdlEditInfo) {
                        $scope.loadiAdlEditInfo(resident, "");
                    }
                    if ($scope.IsloadMmseEditInfo) {
                        $scope.loadMmseEditInfo(resident, "");
                    }
                    if ($scope.IsloadGdsEditInfo) {
                        $scope.loadGdsEditInfo(resident, "");
                    }
                });


                DCNursePlanRes.get({ feeNo: resident.FeeNo, Id: $scope.currentItem.Id, mark: "" }, function (data) {
                    if (data.Data == null) {
                        $scope.Data.regCplList = [];
                    }
                    else {
                        $scope.Data.regCplList = data.Data;
                    }

                })

            })
            //加载该住民所有历史记录
            $scope.Data.medicineList = {};
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.pageInfo.PageSize = 10;
            $scope.options.params.feeNo = resident.FeeNo;
            $scope.options.search();
        }
        //新增
        $scope.addPlanEval = function () {
            if ($scope.currentItem == {}) {

            }
            DCNursePlanRes.get({ Id: $scope.CurrentFeeID, feeNo: $scope.currentItem.FeeNo }, function (data) {
                if (data.Data == "1") {
                    utility.message("本次照顾计划有诊断未完成！");
                }
                else if (data.Data == "2") {
                    utility.message("照顾计划未做！");
                }
                else {
                    $scope.showEval = false;
                    if ($scope.paneNum == 0) {
                        $scope.paneNum = -1;
                    }
                    else {
                        $scope.paneNum = 0;
                    }
                    $scope.fixedCurrentPage = true;

                    var evalNum = $scope.CurrentEvalNumber + 1;
                    $scope.currentItem = {};
                    $scope.currentItem.EvalNumber = evalNum;
                }
            })
        }
        //查看历史资料
        $scope.showHistoryList = function () {
            $("#NursingList").modal("toggle");
        };
        //编辑历史资料
        $scope.PlanEvalSelected = function (item) {
            $scope.showEval = true;
            $scope.fixedCurrentPage = false;
            $scope.currentItem = item;
            if ($scope.currentItem.Chinesedrugflag) {
                $scope.currentItem.Chinesedrugflag = "true";
            }
            else {
                $scope.currentItem.Chinesedrugflag = "false";
            }
            $scope.showChinesedrug();
            if ($scope.currentItem.Westerndrugflag) {
                $scope.currentItem.Westerndrugflag = "true";
            }
            else {
                $scope.currentItem.Westerndrugflag = "false";
            }
            $scope.showWesterndrug();
            if ($scope.currentItem.Fall1Year) {
                $scope.currentItem.Fall1Year = "true";
                if ($scope.currentItem.Injuredflag) {
                    $scope.currentItem.Injuredflag = "true";
                }
                else {
                    $scope.currentItem.Injuredflag = "false";
                }
            }
            else {
                $scope.currentItem.Fall1Year = "false";
            }
            $scope.showInjured();
            $scope.showInjuredPart();

            $scope.FeeID = $scope.currentItem.Id;

            DCevalsheetRes.get({ Id: $scope.FeeID, mark: "" }, function (response) {
                $scope.RegQuestion = response.Data;
                $scope.IsloadAdlEditInfo = true;
                $scope.IsloadiAdlEditInfo = true;
                $scope.IsloadMmseEditInfo = true;
                $scope.IsloadGdsEditInfo = true;
                if (response.Data != null) {
                    for (var i = 0; i < response.Data.length; i++) {
                        if (response.Data[i].QUESTIONCODE == "ADL") {
                            $scope.loadAdlEditInfo($scope.currentResident, response.Data[i].RECORDID);
                            $scope.RegAdlQuestion.SCORE = response.Data[i].SCORE;
                            $scope.IsloadAdlEditInfo = false;
                        }
                        if (response.Data[i].QUESTIONCODE == "IADL") {
                            $scope.loadiAdlEditInfo($scope.currentResident, response.Data[i].RECORDID);
                            $scope.RegiAdlQuestion.SCORE = response.Data[i].SCORE;
                            $scope.IsloadiAdlEditInfo = false;
                        }
                        if (response.Data[i].QUESTIONCODE == "MMSE") {
                            $scope.loadMmseEditInfo($scope.currentResident, response.Data[i].RECORDID);
                            $scope.RegMmseQuestion.SCORE = response.Data[i].SCORE;
                            $scope.IsloadMmseEditInfo = false;
                        }
                        if (response.Data[i].QUESTIONCODE == "GDS") {
                            $scope.loadGdsEditInfo($scope.currentResident, response.Data[i].RECORDID);
                            $scope.RegGdsQuestion.SCORE = response.Data[i].SCORE;
                            $scope.IsloadGdsEditInfo = false;
                        }
                    }
                }
                if ($scope.IsloadAdlEditInfo) {
                    $scope.loadAdlEditInfo($scope.currentResident, "");
                }
                if ($scope.IsloadiAdlEditInfo) {
                    $scope.loadiAdlEditInfo($scope.currentResident, "");
                }
                if ($scope.IsloadMmseEditInfo) {
                    $scope.loadMmseEditInfo($scope.currentResident, "");
                }
                if ($scope.IsloadGdsEditInfo) {
                    $scope.loadGdsEditInfo($scope.currentResident, "");
                }
            });


            DCNursePlanRes.get({ feeNo: $scope.currentResident.FeeNo, Id: $scope.FeeID, mark: "" }, function (data) {
                if (data.Data == null) {
                    $scope.Data.regCplList = [];
                }
                else {
                    $scope.Data.regCplList = data.Data;
                }

            })

            $("#NursingList").modal("toggle");
        }
        //保存护理需求
        $scope.saveNursing = function (item) {
            if (!angular.isDefined($scope.currentItem.EvalDate)) {
                utility.msgwarning("请填写评估日期");
                return;
            }
            if (angular.isDefined($scope.currentResident)) {
                $scope.currentItem.FeeNo = $scope.currentResident.FeeNo;
                $scope.currentItem.RegNo = $scope.currentResident.RegNo;
                $scope.currentItem.RegName = $scope.currentResident.Name;
                $scope.currentItem.ResidentNo = $scope.currentResident.ResidentNo;
                $scope.currentItem.Sex = $scope.currentResident.Sex;
                $scope.currentItem.BirthDate = $scope.currentResident.BirthDay;
                $scope.currentItem.InDate = $scope.currentResident.InDate;
                DCNurseRequirementEvalRes.save(item, function (data) {
                    $scope.FeeID = data.Data.Id;
                    $scope.CurrentFeeID = data.Data.Id;
                    if (!angular.isDefined(item.Id)) {
                        $scope.CurrentEvalNumber = data.Data.EvalNumber;
                        //初始化量表
                        $scope.loadAdlEditInfo($scope.currentResident, "");
                        $scope.loadiAdlEditInfo($scope.currentResident, "");
                        $scope.loadMmseEditInfo($scope.currentResident, "");
                        $scope.loadGdsEditInfo($scope.currentResident, "");
                        //初始化照顾计划
                        $scope.Data.regCplList = [];
                    }
                    else if (item.Id == 0) {
                        $scope.CurrentEvalNumber = data.Data.EvalNumber;
                        //初始化量表
                        $scope.loadAdlEditInfo($scope.currentResident, "");
                        $scope.loadiAdlEditInfo($scope.currentResident, "");
                        $scope.loadMmseEditInfo($scope.currentResident, "");
                        $scope.loadGdsEditInfo($scope.currentResident, "");
                        //初始化照顾计划
                        $scope.Data.regCplList = [];
                    }
                    $scope.currentItem.Id = data.Data.Id;
                    $scope.showEval = true;
                    $scope.fixedCurrentPage = false;

                    $scope.Data.medicineList = {};
                    $scope.options.params.feeNo = $scope.currentResident.FeeNo;
                    $scope.options.search();
                    utility.message("储存成功！");
                })
            }
            else {
                utility.message("请选择住民");
            }

        }

        //打印
        $scope.PrintPreview = function () {
            if (angular.isDefined($scope.currentItem.Id)) {
                window.open('/DC_Report/PreviewNursingReport?templateName=DCN1.2护理需求评估及照顾计划&id=' + $scope.currentItem.Id);
            } else {
                utility.message("无打印数据！");
            }

        }

        /*ADL评估 Start */
        $scope.EvalAdlData = {};
        $scope.RegAdlQuestion = {};
        //加载照顾问题
        $scope.loadAdlEditInfo = function (item, recId) {
            var questionId = "12";
            if (recId == "") {
                $scope.RegAdlQuestion = {};
            }
            $scope.RegAdlQuestion.RECORDID = recId;
            $scope.RegAdlQuestion.REGNO = item.RegNo;
            $scope.RegAdlQuestion.FEENO = item.FeeNo;
            $scope.RegAdlQuestion.ID = $scope.FeeID;
            $scope.RegAdlQuestion.QUESTIONID = questionId;
            $scope.RegAdlQuestion.EVALDATE = $filter("date")(new Date(), "yyyy-MM-dd");
            DCevalsheetRes.get({ qId: questionId, regNo: item.RegNo, recordId: recId }, function (response) {
                $scope.EvalAdlData = response.Data;
            });

        }
        //保存ADL数据
        $scope.saveAdlEditInfo = function () {
            $scope.RegAdlQuestion.QuestionDataList = [];
            for (var i = 0; i < $scope.EvalAdlData.MakerItemList.length; i++) {
                var questionData = {};
                questionData.QUESTIONID = $scope.EvalAdlData.QUESTIONID;
                questionData.MAKERID = $scope.EvalAdlData.MakerItemList[i].MAKERID;
                questionData.LIMITEDVALUEID = $scope.EvalAdlData.MakerItemList[i].LIMITEDVALUEID;
                $scope.RegAdlQuestion.QuestionDataList.push(questionData);
            }
            $scope.RegAdlQuestion.EVALDATE = $scope.currentItem.EvalDate;
            $scope.RegAdlQuestion.EVALNUMBER = $scope.currentItem.EvalNumber;
            $scope.RegAdlQuestion.NEXTEVALDATE = addByTransDate($scope.RegAdlQuestion.EVALDATE, 90);
            $scope.RegAdlQuestion.QUESTIONCODE = "ADL";
            $scope.RegAdlQuestion.ORGID = $scope.currentResident.ResidentOrg;
            DCevalsheetRes.save($scope.RegAdlQuestion, function (data) {
                if (data.ResultCode == 0) {
                    utility.message("储存成功");
                } else {
                    utility.message(data.ResultMessage);
                }
            });

        }

        $scope.calcAdlResult = function (rightAnswer) {
            //var lScore = [];
            var score = 0;
            for (var i = 0; i < $scope.EvalAdlData.MakerItemList.length; i++) {
                var limitedValueId = $scope.EvalAdlData.MakerItemList[i].LIMITEDVALUEID;
                if (limitedValueId != null) {
                    for (var j = 0; j < $scope.EvalAdlData.MakerItemList[i].Answers.length; j++) {
                        if (limitedValueId == $scope.EvalAdlData.MakerItemList[i].Answers[j].LIMITEDVALUEID) {
                            score = score + $scope.EvalAdlData.MakerItemList[i].Answers[j].LIMITEDVALUE
                        }
                    }
                }
            }
            $scope.RegAdlQuestion.SCORE = score;
            //if ($scope.EvalAdlData.SCOREFLAG) {
            //    DCevalsheetRes.get({ l: lScore }, function (response) {
            //        $scope.RegAdlQuestion.SCORE = response.Data;

            //        //$scope.EvalResult = response;
            //        //$scope.RegAdlQuestion.SCORE = $scope.EvalResult.Score;
            //        //$scope.RegAdlQuestion.ENVRESULTS = $scope.EvalResult.Result;
            //        //$scope.Reference = $scope.EvalResult.Result;
            //    });
            //}
        }
        /*ADL评估 End */

        /*MMSE评估 Start */
        $scope.EvalMmseData = {};
        $scope.RegMmseQuestion = {};
        //加载
        $scope.loadMmseEditInfo = function (item, recId) {
            var questionId = "14";
            if (recId == "") {
                $scope.RegMmseQuestion = {};
            }
            $scope.RegMmseQuestion.RECORDID = recId;
            $scope.RegMmseQuestion.REGNO = item.RegNo;
            $scope.RegMmseQuestion.FEENO = item.FeeNo;
            $scope.RegMmseQuestion.ID = $scope.FeeID;
            $scope.RegMmseQuestion.QUESTIONID = questionId;
            $scope.RegMmseQuestion.EVALDATE = $filter("date")(new Date(), "yyyy-MM-dd");
            DCevalsheetRes.get({ qId: questionId, regNo: item.RegNo, recordId: recId }, function (response) {
                $scope.EvalMmseData = response.Data;
            });

        }
        //
        $scope.saveMmseEditInfo = function () {
            $scope.RegMmseQuestion.QuestionDataList = [];
            for (var i = 0; i < $scope.EvalMmseData.MakerItemList.length; i++) {
                var questionData = {};
                questionData.QUESTIONID = $scope.EvalMmseData.QUESTIONID;
                questionData.MAKERID = $scope.EvalMmseData.MakerItemList[i].MAKERID;
                questionData.LIMITEDVALUEID = $scope.EvalMmseData.MakerItemList[i].LIMITEDVALUEID;
                $scope.RegMmseQuestion.QuestionDataList.push(questionData);
            }
            $scope.RegMmseQuestion.EVALDATE = $scope.currentItem.EvalDate;
            $scope.RegMmseQuestion.EVALNUMBER = $scope.currentItem.EvalNumber;
            $scope.RegMmseQuestion.NEXTEVALDATE = addByTransDate($scope.RegMmseQuestion.EVALDATE, 90);
            $scope.RegMmseQuestion.QUESTIONCODE = "MMSE";
            $scope.RegMmseQuestion.ORGID = $scope.currentResident.ResidentOrg;

            DCevalsheetRes.save($scope.RegMmseQuestion, function (data) {
                if (data.ResultCode == 0) {
                    utility.message("储存成功");
                } else {
                    utility.message(data.ResultMessage);
                }
            });
        }

        $scope.calcMmseResult = function () {
            var score = 0;
            for (var i = 0; i < $scope.EvalMmseData.MakerItemList.length; i++) {
                var limitedValueId = $scope.EvalMmseData.MakerItemList[i].LIMITEDVALUEID;
                if (limitedValueId != null) {
                    for (var j = 0; j < $scope.EvalMmseData.MakerItemList[i].Answers.length; j++) {
                        if (limitedValueId == $scope.EvalMmseData.MakerItemList[i].Answers[j].LIMITEDVALUEID) {
                            score = score + $scope.EvalMmseData.MakerItemList[i].Answers[j].LIMITEDVALUE
                        }
                    }
                }
            }
            $scope.RegMmseQuestion.SCORE = score;
        }
        /*MMSE评估 End */

        /*iADL评估 Start */
        $scope.EvaliAdlData = {};
        $scope.RegiAdlQuestion = {};
        //加载照顾问题
        $scope.loadiAdlEditInfo = function (item, recId) {
            var questionId = "13";
            if (recId == "") {
                $scope.RegiAdlQuestion = {};
            }
            $scope.RegiAdlQuestion.RECORDID = recId;
            $scope.RegiAdlQuestion.REGNO = item.RegNo;
            $scope.RegiAdlQuestion.FEENO = item.FeeNo;
            $scope.RegiAdlQuestion.ID = $scope.FeeID;
            $scope.RegiAdlQuestion.QUESTIONID = questionId;
            $scope.RegiAdlQuestion.EVALDATE = $filter("date")(new Date(), "yyyy-MM-dd");
            DCevalsheetRes.get({ qId: questionId, regNo: item.RegNo, recordId: recId }, function (response) {
                $scope.EvaliAdlData = response.Data;
            });

        }
        //
        $scope.saveiAdlEditInfo = function () {
            $scope.RegiAdlQuestion.QuestionDataList = [];
            for (var i = 0; i < $scope.EvaliAdlData.MakerItemList.length; i++) {
                var questionData = {};
                questionData.QUESTIONID = $scope.EvaliAdlData.QUESTIONID;
                questionData.MAKERID = $scope.EvaliAdlData.MakerItemList[i].MAKERID;
                questionData.LIMITEDVALUEID = $scope.EvaliAdlData.MakerItemList[i].LIMITEDVALUEID;
                $scope.RegiAdlQuestion.QuestionDataList.push(questionData);
            }
            $scope.RegiAdlQuestion.EVALDATE = $scope.currentItem.EvalDate;
            $scope.RegiAdlQuestion.EVALNUMBER = $scope.currentItem.EvalNumber;
            $scope.RegiAdlQuestion.NEXTEVALDATE = addByTransDate($scope.RegiAdlQuestion.EVALDATE, 90);
            $scope.RegiAdlQuestion.QUESTIONCODE = "IADL";
            $scope.RegiAdlQuestion.ORGID = $scope.currentResident.ResidentOrg;
            DCevalsheetRes.save($scope.RegiAdlQuestion, function (data) {
                if (data.ResultCode == 0) {
                    utility.message("储存成功");
                } else {
                    utility.message(data.ResultMessage);
                }
            });

        }
        $scope.calciAdlResult = function () {
            var score = 0;
            for (var i = 0; i < $scope.EvaliAdlData.MakerItemList.length; i++) {
                var limitedValueId = $scope.EvaliAdlData.MakerItemList[i].LIMITEDVALUEID;
                if (limitedValueId != null) {
                    for (var j = 0; j < $scope.EvaliAdlData.MakerItemList[i].Answers.length; j++) {
                        if (limitedValueId == $scope.EvaliAdlData.MakerItemList[i].Answers[j].LIMITEDVALUEID) {
                            score = score + $scope.EvaliAdlData.MakerItemList[i].Answers[j].LIMITEDVALUE
                        }
                    }
                }
            }
            $scope.RegiAdlQuestion.SCORE = score;
        }
        /*iADL评估 End */

        /*GDS评估 Start */
        $scope.EvalGdsData = {};
        $scope.RegGdsQuestion = {};
        //加载照顾问题
        $scope.loadGdsEditInfo = function (item, recId) {
            var questionId = "15";
            if (recId == "") {
                $scope.RegGdsQuestion = {};
            }
            $scope.RegGdsQuestion.RECORDID = recId;
            $scope.RegGdsQuestion.REGNO = item.RegNo;
            $scope.RegGdsQuestion.FEENO = item.FeeNo;
            $scope.RegGdsQuestion.ID = $scope.FeeID;
            $scope.RegGdsQuestion.QUESTIONID = questionId;
            $scope.RegGdsQuestion.EVALDATE = $filter("date")(new Date(), "yyyy-MM-dd");
            DCevalsheetRes.get({ qId: questionId, regNo: item.RegNo, recordId: recId }, function (response) {
                $scope.EvalGdsData = response.Data;
            });

        }
        //
        $scope.saveGdsEditInfo = function () {
            $scope.RegGdsQuestion.QuestionDataList = [];
            for (var i = 0; i < $scope.EvalGdsData.MakerItemList.length; i++) {
                var questionData = {};
                questionData.QUESTIONID = $scope.EvalGdsData.QUESTIONID;
                questionData.MAKERID = $scope.EvalGdsData.MakerItemList[i].MAKERID;
                questionData.LIMITEDVALUEID = $scope.EvalGdsData.MakerItemList[i].LIMITEDVALUEID;
                $scope.RegGdsQuestion.QuestionDataList.push(questionData);
            }
            $scope.RegGdsQuestion.EVALDATE = $scope.currentItem.EvalDate;
            $scope.RegGdsQuestion.EVALNUMBER = $scope.currentItem.EvalNumber;
            $scope.RegGdsQuestion.NEXTEVALDATE = addByTransDate($scope.RegGdsQuestion.EVALDATE, 90);
            $scope.RegGdsQuestion.QUESTIONCODE = "GDS";
            $scope.RegGdsQuestion.ORGID = $scope.currentResident.ResidentOrg;
            DCevalsheetRes.save($scope.RegGdsQuestion, function (data) {
                if (data.ResultCode == 0) {
                    utility.message("储存成功");
                } else {
                    utility.message(data.ResultMessage);
                }
            });

        }
        $scope.calcGdsResult = function () {
            var score = 0;
            for (var i = 0; i < $scope.EvalGdsData.MakerItemList.length; i++) {
                var limitedValueId = $scope.EvalGdsData.MakerItemList[i].LIMITEDVALUEID;
                if (limitedValueId != null) {
                    for (var j = 0; j < $scope.EvalGdsData.MakerItemList[i].Answers.length; j++) {
                        if (limitedValueId == $scope.EvalGdsData.MakerItemList[i].Answers[j].LIMITEDVALUEID) {
                            if ($scope.EvalGdsData.MakerItemList[i].Answers[j].LIMITEDVALUE == 99) {
                                $scope.RegGdsQuestion.SCORE = 0;
                                return;
                            }
                            else {
                                score = score + $scope.EvalGdsData.MakerItemList[i].Answers[j].LIMITEDVALUE

                            }
                        }
                    }
                }
            }
            $scope.RegGdsQuestion.SCORE = score;
        }
        /*GDS评估 End */

        /*照顾计划 Start */
        //问题层面
        $scope.Data.problemList = {};
        //问题
        $scope.Data.diaPrList = {};
        //导因
        $scope.Data.causepList = {};
        //特征
        $scope.Data.prDataList = {};
        //目标
        $scope.Data.goalpList = {};
        //措施
        $scope.Data.activityList = {};
        //评值
        $scope.Data.assessvalueList = {};

        $scope.nursingPlanItem = {};
        $scope.Data.regCplList = [];
        //护理目标
        $scope.Data.nsCplGoalpList = [];
        $scope.goalpItem = {};
        //护理措施
        $scope.Data.nsCplActivityList = [];
        $scope.activityItem = {};
        //加载问题层面
        $scope.loadNpEditInfo = function () {
            DCNursePlanRes.get({ majorType: "护理" }, function (data) {
                $scope.Data.problemList = {};
                $scope.Data.problemList = data.Data;
            });
        }
        //加载诊断问题
        $scope.changeLevel = function (val) {
            DCNursePlanRes.get({ levelPr: val, majorType: "护理" }, function (data) {
                $scope.Data.diaPrList = {};
                $scope.Data.diaPrList = data.Data;
            });
        }

        $scope.$watch("CpDia", function (newValue, oldValule) {

        });
        $scope.changeDiaPr = function (val) {

            for (var i = 0; i < $scope.Data.diaPrList.length; i++) {
                if ($scope.Data.diaPrList[i].CpNo == val) {
                    $scope.nursingPlanItem.CpDia = $scope.Data.diaPrList[i].DiaPr;
                    $scope.nursingPlanItem.MajorType = $scope.Data.diaPrList[i].MajorType;
                    break;
                }
            }

            DCNursePlanRes.get({ cpNo: val, dirPr: "", mark: "导因" }, function (data) {
                $scope.Data.causepList = {};
                $scope.Data.causepList = data.Data;
                $scope.nursingPlanItem.NsDesc = "";
            });

            DCNursePlanRes.get({ cpNo: val, dirPr: "", mark: "特征" }, function (data) {
                $scope.Data.prDataList = {};
                $scope.Data.prDataList = data.Data;
                $scope.nursingPlanItem.CpReason = "";
            });
        }

        //选中护理措施
        $scope.selectPrDataItem = function (val) {
            if (angular.isDefined($scope.nursingPlanItem.NsDesc)) {
                if ($scope.nursingPlanItem.NsDesc == "") {
                    $scope.nursingPlanItem.NsDesc = val[0];
                }
                else {
                    $scope.nursingPlanItem.NsDesc = $scope.nursingPlanItem.NsDesc + "\r\n" + val[0];
                }
            }
        }
        $scope.selectCausepItem = function (val) {
            if (angular.isDefined($scope.nursingPlanItem.CpReason)) {
                if ($scope.nursingPlanItem.CpReason == "") {
                    $scope.nursingPlanItem.CpReason = val[0];
                }
                else {
                    $scope.nursingPlanItem.CpReason = $scope.nursingPlanItem.CpReason + "\r\n" + val[0];
                }
            }
        }
        //新增一笔照顾计划需求数据
        $scope.addNursingPlan = function () {
            $scope.nursingPlanItem = {};
            $scope.Data.causepList = {};
            $scope.Data.prDataList = {};
            $scope.Data.diaPrList = {};
            $scope.CpDia = "";
            $scope.loadNpEditInfo();
            $("#NursingPlanAdd").modal("toggle");
        }
        $scope.saveNursingAddPlan = function (item) {
            if (angular.isDefined($scope.NurseAddFrom.$error.required)) {
                for (var i = 0; i < $scope.NurseAddFrom.$error.required.length; i++) {
                    utility.msgwarning($scope.NurseAddFrom.$error.required[i].$name + "为必填项！");
                    if (i > 1) {
                        return;
                    }
                }
                return;
            }

            if (angular.isDefined($scope.NurseAddFrom.$error.maxlength)) {
                for (var i = 0; i < $scope.NurseAddFrom.$error.maxlength.length; i++) {
                    utility.msgwarning($scope.NurseAddFrom.$error.maxlength[i].$name + "超过设定长度！");
                    if (i > 1) {
                        return;
                    }
                }
                return;
            }
            if (angular.isDefined($scope.currentResident)) {
                $scope.nursingPlanItem.FeeNo = $scope.currentResident.FeeNo;
                $scope.nursingPlanItem.RegNo = $scope.currentResident.RegNo;
                $scope.nursingPlanItem.RegName = $scope.currentResident.Name;
                $scope.nursingPlanItem.ResidentNo = $scope.currentResident.ResidentNo;
                $scope.nursingPlanItem.Sex = $scope.currentResident.Sex;
                $scope.nursingPlanItem.BirthDate = $scope.currentResident.BirthDay;
                $scope.nursingPlanItem.ID = $scope.FeeID;
                DCNursePlanRes.save(item, function (data) {
                    item.OrgId = $scope.currentResident.ResidentOrg;
                    if (angular.isDefined(item.SeqNo)) {
                        $scope.nursingPlanItem = {};
                        $("#NursingPlanAdd").modal("toggle");
                    } else {
                        $scope.Data.regCplList.push(data.Data);
                        $scope.nursingPlanItem = {};
                        $scope.Data.diaList = {};
                        $scope.Data.activityList = {};
                        $scope.Data.problemList = {};
                        $("#NursingPlanAdd").modal("toggle");
                    }
                    utility.message("储存成功！");
                });
            }
            else {
                utility.message("请选择住民");
            }

        }
        $scope.cancelNursingAddPlan = function () {
            $("#NursingPlanAdd").modal("toggle");
        }
        $scope.saveNursingEditPlan = function (item) {
            if (angular.isDefined($scope.NurseEditFrom.$error.required)) {
                //var msg = "";
                for (var i = 0; i < $scope.NurseEditFrom.$error.required.length; i++) {
                    //msg = msg +$scope.NurseEditFrom.$error.required[i].$name + " ";
                    utility.msgwarning($scope.NurseEditFrom.$error.required[i].$name + "为必填项！");
                    if (i > 1) {
                        return;
                    }
                }
                //msg = msg + "为必填项！"
                //utility.msgwarning(msg);
                return;
            }

            if (angular.isDefined($scope.NurseEditFrom.$error.maxlength)) {
                for (var i = 0; i < $scope.NurseEditFrom.$error.maxlength.length; i++) {
                    utility.msgwarning($scope.NurseEditFrom.$error.maxlength[i].$name + "超过设定长度！");
                    if (i > 1) {
                        return;
                    }
                }
                return;
            }
            if (angular.isDefined($scope.currentResident)) {
                $scope.nursingPlanItem.FeeNo = $scope.currentResident.FeeNo;
                $scope.nursingPlanItem.RegNo = $scope.currentResident.RegNo;
                $scope.nursingPlanItem.RegName = $scope.currentResident.Name;
                $scope.nursingPlanItem.ResidentNo = $scope.currentResident.ResidentNo;
                $scope.nursingPlanItem.Sex = $scope.currentResident.Sex;
                $scope.nursingPlanItem.BirthDate = $scope.currentResident.BirthDay;
                $scope.nursingPlanItem.ID = $scope.FeeID;
                DCNursePlanRes.save(item, function (data) {
                    if (angular.isDefined(item.SeqNo)) {
                        $scope.nursingPlanItem = {};
                        $("#NursingPlanEdit").modal("toggle");
                    }
                    else {
                        $scope.Data.regCplList.push(data.Data);
                        $scope.nursingPlanItem = {};
                        $scope.Data.diaList = {};
                        $scope.Data.activityList = {};
                        $scope.Data.problemList = {};
                        $("#NursingPlanEdit").modal("toggle");
                    }
                    utility.message("储存成功！");
                })
            }
            else {
                utility.message("请选择住民");
            }

        }
        $scope.cancelNursingEditPlan = function () {
            $("#NursingPlanEdit").modal("toggle");
        }
        $scope.action = function () {
            $scope.actionShow = true;
        }
        $scope.editNursingPlan = function (item) {
            $scope.nursingPlanItem = {};
            $scope.nursingPlanItem = item;
            $("#NursingPlanEdit").modal("toggle");
        }
        $scope.getEndDateP = function (num) {
            if (num == "" || num == null) {
                return;
            }
            if (angular.isDefined($scope.nursingPlanItem.StartDate)) {
                if ($scope.nursingPlanItem.StartDate != "") {
                    $scope.nursingPlanItem.TargetDate = addDate($scope.nursingPlanItem.StartDate, num).substring(0, 10);
                }
            }
        }
        /*目标 Start*/
        $scope.currentSeqNo = 0;
        $scope.editNursingPlanGoal = function (item) {
            $scope.Data.nsCplGoalpList = [];
            DCNursePlanRes.get({ cpNo: 0, dirPr: item.CpDia, mark: "目标" }, function (data) {
                $scope.Data.goalpList = {};
                $scope.Data.goalpList = data.Data;
            });

            DCNsCplGoalRes.get({ seqNo: item.SeqNo }, function (data) {
                $scope.Data.nsCplGoalpList = data.Data;
            });
            $scope.currentSeqNo = item.SeqNo;
            $scope.showGoalpEdit = false;
            $("#NursingPlanGoal").modal("toggle");
        }
        $scope.addGoalpInfo = function () {
            $scope.showGoalpEdit = true;
        }
        $scope.saveGoalpInfo = function (item) {
            if (angular.isDefined($scope.goalpForm.$error.required)) {
                //var msg = "";
                for (var i = 0; i < $scope.goalpForm.$error.required.length; i++) {
                    utility.msgwarning($scope.goalpForm.$error.required[i].$name + "为必填项！");
                    //msg = msg + $scope.goalpForm.$error.required[i].$name + " ";
                    if (i > 1) {
                        return;
                    }
                }
                //msg = msg + "为必填项！"
                //utility.msgwarning(msg);
                return;
            }

            if (angular.isDefined($scope.goalpForm.$error.maxlength)) {
                for (var i = 0; i < $scope.goalpForm.$error.maxlength.length; i++) {
                    utility.msgwarning($scope.goalpForm.$error.maxlength[i].$name + "超过设定长度！");
                    if (i > 1) {
                        return;
                    }
                }
                return;
            }

            item.SeqNo = $scope.currentSeqNo;
            DCNsCplGoalRes.save(item, function (data) {
                $scope.Data.nsCplGoalpList.push(data.Data);
                $scope.goalpItem = {};
                $scope.showGoalpEdit = false;
                utility.message("储存成功");
            });

        }
        $scope.cancelEditGoalpInfo = function () {
            $scope.goalpItem = {};
            $scope.showGoalpEdit = false;
        }
        $scope.editGoalpInfo = function (item) {
            $scope.goalpItem = item;
            $scope.showGoalpEdit = true;
        }
        /*目标 End*/

        /*措施 Start*/
        $scope.editNursingPlanActivity = function (item) {
            $scope.Data.nsCplActivityList = [];
            DCNursePlanRes.get({ cpNo: 0, dirPr: item.CpDia, mark: "措施" }, function (data) {
                $scope.Data.activityList = {};
                $scope.Data.activityList = data.Data;
            });

            DCNsCplActivityRes.get({ seqNo: item.SeqNo }, function (data) {
                $scope.Data.nsCplActivityList = data.Data;
            });
            $scope.currentSeqNo = item.SeqNo;
            $scope.showActivityEdit = false;
            $("#NursingPlanActivity").modal("toggle");
        }
        $scope.addActivityInfo = function () {
            $scope.showActivityEdit = true;
        }
        $scope.saveActivityInfo = function (item) {
            if (angular.isDefined($scope.activityForm.$error.required)) {
                var msg = "";
                for (var i = 0; i < $scope.activityForm.$error.required.length; i++) {
                    //msg = msg +$scope.activityForm.$error.required[i].$name + " ";
                    utility.msgwarning($scope.activityForm.$error.required[i].$name + "为必填项！");
                    if (i > 1) {
                        return;
                    }
                }
                //msg = msg + "为必填项！"
                //utility.msgwarning(msg);
                return;
            }
            if (angular.isDefined($scope.activityForm.$error.maxlength)) {
                for (var i = 0; i < $scope.activityForm.$error.maxlength.length; i++) {
                    utility.msgwarning($scope.activityForm.$error.maxlength[i].$name + "超过设定长度！");
                    if (i > 1) {
                        return;
                    }
                }
                return;
            }
            item.SeqNo = $scope.currentSeqNo;
            DCNsCplActivityRes.save(item, function (data) {
                if (angular.isDefined(item.Id)) {
                    item = data.Data;
                }
                else {
                    $scope.Data.nsCplActivityList.push(data.Data);
                }
                $scope.activityItem = {};
                $scope.showActivityEdit = false;
                utility.message("储存成功");
            });
        }
        $scope.cancelEditActivityInfo = function () {
            $scope.activityItem = {};
            $scope.showActivityEdit = false;
        }
        $scope.editActivityInfo = function (item) {
            $scope.activityItem = item;
            $scope.showActivityEdit = true;
        }
        /*措施 End*/


        /*评值 Start*/
        $scope.editNursingPlanEval = function (item) {
            DCNursePlanRes.get({ cpNo: 0, dirPr: item.CpDia, mark: "评值" }, function (data) {
                $scope.assessItem = {};
                $scope.Data.assessvalueList = data.Data;
            });


            DCAssessValueRes.get({ seqNo: item.SeqNo }, function (data) {
                $scope.assessItem = data.Data;
                if ($scope.assessItem.RecordBy == null) {
                    $scope.assessItem.RecordBy = $scope.curUser.EmpNo;
                }
                $scope.currentSeqNo = item.SeqNo;
                $("#NursingPlanEval").modal("toggle");
            });
        }
        $scope.saveAssessValueInfo = function (item) {
            if (angular.isDefined($scope.AssessForm.$error.required)) {
                var msg = "";
                for (var i = 0; i < $scope.AssessForm.$error.required.length; i++) {

                    //msg = msg +$scope.AssessForm.$error.required[i].$name + " ";
                    utility.msgwarning($scope.AssessForm.$error.required[i].$name + "为必填项！");
                    if (i > 1) {
                        return;
                    }
                }
                //msg = msg + "为必填项！"
                //utility.msgwarning(msg);
                return;
            }

            if (angular.isDefined($scope.AssessForm.$error.maxlength)) {
                for (var i = 0; i < $scope.AssessForm.$error.maxlength.length; i++) {
                    utility.msgwarning($scope.AssessForm.$error.maxlength[i].$name + "超过设定长度！");
                    if (i > 1) {
                        return;
                    }
                }
                return;
            }

            item.SeqNo = $scope.currentSeqNo;
            DCAssessValueRes.save(item, function (data) {
                $scope.assessItem = {};
                utility.message("储存成功");
                $("#NursingPlanEval").modal("toggle");
            });
        }
        $scope.cancleAssessValueInfo = function () {
            $("#NursingPlanEval").modal("toggle");
        }
        /*评值 End*/

        //完成日期默认为当前日期
        $scope.getCurrentDate = function (val) {
            if (val == '目标') {
                if ($scope.goalpItem.FinishFlag) {
                    $scope.goalpItem.FinishDate = Dateformat(new Date());
                }
                else {
                    $scope.goalpItem.FinishDate = "";
                }
            }
            else if (val == '措施') {
                if ($scope.activityItem.FinishFlag) {
                    $scope.activityItem.FinishDate = Dateformat(new Date());
                }
                else {
                    $scope.activityItem.FinishDate = "";
                }
            }
            else if (val == '诊断') {
                if ($scope.nursingPlanItem.FinishFlag) {
                    $scope.nursingPlanItem.FinishDate = Dateformat(new Date());
                }
                else {
                    $scope.nursingPlanItem.FinishDate = "";
                }
            }
        }
        //刷新
        $scope.refresh = function (val) {
            if (val == '目标') {
                DCNsCplGoalRes.get({ seqNo: $scope.currentSeqNo }, function (data) {
                    $scope.Data.nsCplGoalpList = data.Data;
                });
            }
            else if (val == '措施') {
                DCNsCplActivityRes.get({ seqNo: $scope.currentSeqNo }, function (data) {
                    $scope.Data.nsCplActivityList = data.Data;
                });
            }
            else if (val == '诊断') {
                DCNursePlanRes.get({ feeNo: $scope.currentResident.FeeNo, Id: $scope.currentItem.Id, mark: "" }, function (data) {
                    if (data.Data == null) {
                        $scope.Data.regCplList = [];
                    }
                    else {
                        $scope.Data.regCplList = data.Data;
                    }

                })
            }

        }
        $scope.editEvaluationValue = function () {
            $scope.actionBtnShow = true;
            $scope.showEvaluationValue = false;
        }
        $scope.saveEvaluationValue = function () {
            DCNursePlanRes2.save($scope.Data.regCplList, function (data) {
                $scope.actionBtnShow = false;
                $scope.showEvaluationValue = true;
                utility.message("储存成功！");
            });
        }
        /*照顾计划 End */


        //日期格式化
        function FormatDate(strTime) {
            if (strTime == null || strTime == "") {
                return "";
            }
            var date = new Date(strTime);
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        //日期增加天数
        function addByTransDate(dateParameter, num) {
            var translateDate = "", dateString = "", monthString = "", dayString = "";
            translateDate = dateParameter.replace("-", "/").replace("-", "/");
            var newDate = new Date(translateDate);
            newDate = newDate.valueOf();
            newDate = newDate + num * 24 * 60 * 60 * 1000;
            newDate = new Date(newDate);
            //如果月份长度少于2，则前加 0 补位     
            if ((newDate.getMonth() + 1).toString().length == 1) {
                monthString = 0 + "" + (newDate.getMonth() + 1).toString();
            } else {
                monthString = (newDate.getMonth() + 1).toString();
            }
            //如果天数长度少于2，则前加 0 补位     
            if (newDate.getDate().toString().length == 1) {
                dayString = 0 + "" + newDate.getDate().toString();
            } else {
                dayString = newDate.getDate().toString();
            }
            dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString + " 00:00:00";
            return dateString;
        };
        $scope.checkVisitNum = function (num) {
            if (num < 0) {
                $scope.currentItem.VisitNumber = 0;
            }
        };
        $scope.checkLeftMuscle1 = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.LeftMuscle1 = "";
            }
            else {
                if (num >= 0 && num <= 5) {

                }
                else {
                    $scope.currentItem.LeftMuscle1 = "";
                }
            }
        }
        $scope.checkNum = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.RightMuscle1 = "";
            }
            else {
                if (num >= 0 && num <= 5) {

                }
                else {
                    $scope.currentItem.RightMuscle1 = "";
                }
            }
        }
        $scope.checkRightMuscle1 = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.RightMuscle1 = "";
            }
            else {
                if (num >= 0 && num <= 5) {

                }
                else {
                    $scope.currentItem.RightMuscle1 = "";
                }
            }
        }
        $scope.checkLeftMuscle2 = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.LeftMuscle2 = "";
            }
            else {
                if (num >= 0 && num <= 5) {

                }
                else {
                    $scope.currentItem.LeftMuscle2 = "";
                }
            }
        }
        $scope.checkRightMuscle2 = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.RightMuscle2 = "";
            }
            else {
                if (num >= 0 && num <= 5) {

                }
                else {
                    $scope.currentItem.RightMuscle2 = "";
                }
            }
        }
        $scope.checkLeftJoint1 = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.LeftJoint1 = "";
            }
            else {
                if (num >= 0 && num <= 4) {

                }
                else {
                    $scope.currentItem.LeftJoint1 = "";
                }
            }
        }
        $scope.checkRightJoint1 = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.RightJoint1 = "";
            }
            else {
                if (num >= 0 && num <= 4) {

                }
                else {
                    $scope.currentItem.RightJoint1 = "";
                }
            }
        }
        $scope.checkLeftJoint2 = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.LeftJoint2 = "";
            }
            else {
                if (num >= 0 && num <= 4) {

                }
                else {
                    $scope.currentItem.LeftJoint2 = "";
                }
            }
        }
        $scope.checkRightJoint2 = function (num) {
            if (isNaN(num)) {
                $scope.currentItem.RightJoint2 = "";
            }
            else {
                if (num >= 0 && num <= 4) {

                }
                else {
                    $scope.currentItem.RightJoint2 = "";
                }
            }
        }
        $scope.showChinesedrug = function () {
            if ($scope.currentItem.Chinesedrugflag == "true") {
                $scope.ChinesedrugShow = true;
            }
            else {
                $scope.ChinesedrugShow = false;
            }
        }
        $scope.showWesterndrug = function () {
            if ($scope.currentItem.Westerndrugflag == "true") {
                $scope.WesterndrugShow = true;
            }
            else {
                $scope.WesterndrugShow = false;
            }
        }
        $scope.showInjured = function () {
            if ($scope.currentItem.Fall1Year == "true") {
                $scope.showInj = true;
                $scope.showInjpart = false;
            }
            else {
                $scope.showInj = false;
                $scope.showInjpart = false;
            }
        }
        $scope.showInjuredPart = function () {
            if ($scope.currentItem.Injuredflag == "true") {
                $scope.showInjpart = true;
            }
            else {
                $scope.showInjpart = false;
            }
        }
        $scope.showAconuresis = function () {
            if ($scope.currentItem.AconuresisFlag == "true") {
                $scope.showAconuresisInfo = true;
            }
            else {
                $scope.showAconuresisInfo = false;
            }
        }

        $scope.checkHeight = function (val) {
            if (isNaN(val)) {
                $scope.currentItem.Height = "";
            }
            else {
                if (val >= 0 && val <= 250) {

                }
                else {
                    $scope.currentItem.Height = "";
                }
            }

            $scope.showBMI();
        }


        $scope.checkWeight = function (val) {
            if (isNaN(val)) {
                $scope.currentItem.Weight = "";
            }
            else {
                if (val >= 0 && val <= 250) {

                }
                else {
                    $scope.currentItem.Weight = "";
                }
            }

            $scope.showBMI();
        }

        $scope.checkWaistLine = function (val) {
            if (isNaN(val)) {
                $scope.currentItem.WaistLine = "";
            }
            else {
                if (val >= 0) {

                }
                else {
                    $scope.currentItem.WaistLine = "";
                }
            }
        }
        $scope.checkIdealWeight = function (val) {
            if (isNaN(val)) {
                $scope.currentItem.IdealWeight = "";
            }
            else {
                if (val >= 0) {

                }
                else {
                    $scope.currentItem.IdealWeight = "";
                }
            }
        }

        $scope.showBMI = function () {
            if (angular.isDefined($scope.currentItem.Height) && angular.isDefined($scope.currentItem.Weight)) {
                if ($scope.currentItem.Height != 0 && $scope.currentItem.Weight != 0) {
                    $scope.currentItem.BMI = (($scope.currentItem.Weight / ($scope.currentItem.Height * $scope.currentItem.Height)) * 10000).toFixed(1);
                }
            }

        }
        $scope.checkStartDate = function () {
            if (!checkDate($scope.nursingPlanItem.StartDate, $scope.nursingPlanItem.TargetDate)) {
                $scope.nursingPlanItem.StartDate = "";
                utility.msgwarning("开始日期不能大于结束日期");
            }
        }
        $scope.checkEndDate = function () {
            if (!checkDate($scope.nursingPlanItem.StartDate, $scope.nursingPlanItem.TargetDate)) {
                $scope.nursingPlanItem.TargetDate = "";
                utility.msgwarning("结束日期不能小于开始日期");
            }
        }
        $scope.checkFirstevalDate = function () {
            if (!checkDate($scope.currentItem.FirstevalDate, $scope.currentItem.EvalDate)) {
                $scope.currentItem.FirstevalDate = "";
                utility.message("初评日期不能大于评估日期");
            }
        }
        $scope.checkEvalDate = function () {
            if (!checkDate($scope.currentItem.FirstevalDate, $scope.currentItem.EvalDate)) {
                $scope.currentItem.EvalDate = "";
                utility.message("评估日期不能小于初评日期");
            }
        }

        $scope.staffSelected = function (item) {
            $scope.assessItem.ExecuteBy = item.EmpName;
        }


        $scope.init();


    }])
