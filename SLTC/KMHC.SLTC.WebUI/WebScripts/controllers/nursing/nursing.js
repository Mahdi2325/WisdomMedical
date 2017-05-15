/*****************************************************************************
 * Filename: nursing
 * Creator:	Lei Chen
 * Create Date: 2016-03-01 13:34:19
 * Modifier:
 * Modify Date:
 * Description:评估表
 ******************************************************************************/
angular.module("sltcApp").controller("evaluationSheetCtrl", ['$scope', '$http', '$location', '$state', 'utility', '$filter', 'cloudAdminUi', 'evalsheetRes', 'evaluationRes', 'employeeRes', 'evaluationHisRes',
    function ($scope, $http, $location, $state, utility, $filter, cloudAdminUi, evalsheetRes, evaluationRes, employeeRes, evaluationHisRes) {
        var baseUrl = 'http://120.25.225.5:8667'; //'http://localhost:8060'
        $scope.QuestionName = '巴氏量表';// $state.params.qName;
        $scope.QuestionCode = 'ADL';// $state.params.qCode;
        var currentUrl = $state.current.url.split('/');
        if (currentUrl.length > 2) {
            $scope.QuestionName = currentUrl[currentUrl.length - 1];
            $scope.QuestionCode = currentUrl[currentUrl.length - 2];
        }
        $scope.IsNewCreate = false;
        $scope.RegQuestion = {};
        $scope.EvalResult = {};
        $scope.Data = {};
        $scope.EmpList = {};
        $scope.Data.MakerItemList = {};
        $scope.Data.MakerItemList.Answers = {};
        $scope.MakerItemByCategory = {};
        $scope.init = function () {
            $scope.maxErrorTips = 3;
            cloudAdminUi.handleGoToTop();
            evalsheetRes.get({ Code: $scope.QuestionCode }, function (response) {
                $scope.Data = response.Data;
                if (response.Data == null && response.ResultMessage != '') {
                    utility.message(response.ResultMessage);
                    return;
                }
                $scope.Code = $scope.Data.CODE;
                $scope.MakerItemByCategory = getMakerItemListByCategory($scope.Data.MakerItemList);
                employeeRes.query({}, function (data) {
                    $scope.EmpList = data;
                });
                $scope.RegQuestion.QUESTIONID = $scope.Data.QUESTIONID;
                $scope.RegQuestion.EVALDATE = $filter("date")(new Date(), "yyyy-MM-dd");
            });

        }
        var hashCode = function (str) {
            var hash = 0;
            if (str.length === 0) return hash;
            for (var i = 0; i < str.length; i++) {
                var char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return Math.abs(hash);
        }
        $scope.init();//初始化

        //選中住民
        $scope.residentSelected = function (resident) {
            $scope.currentResident = resident;
            var feeNo = hashCode(resident.ResidentNo);//转化int
            var regNo = hashCode(resident.PersonNo);//转化int
            $scope.currentResident.FeeNo = feeNo;
            $scope.RegQuestion.FEENO = feeNo;
            $scope.RegQuestion.REGNO = regNo;
            if (angular.isDefined($scope.currentResident)) {
                $scope.buttonShow = true;
            }
            $scope.currentItem = {};
            $scope.init();

            $scope.GetHistory();
            $scope.RegQuestion.NEXTEVALDATE = "";
            $scope.RegQuestion.Gap = '';

        };

        $scope.GetHistory = function () {
            evaluationHisRes.get({ QuestionId: $scope.RegQuestion.QUESTIONID, FeeNo: $scope.currentReside2nt.FeeNo }, function (response) {
                $scope.QuestionList = response.Data;
                if (response.Data != null && response.Data.length > 0) {
                    $scope.IsNewCreate = true;
                }
            });

        }


        $scope.calcResult = function (rightAnswer) {
            if (angular.isDefined($scope.currentResident) && $scope.currentResident != null && angular.isDefined($scope.currentResident.FeeNo) && $scope.currentResident.FeeNo != '') {
                if ($scope.Data.SCOREFLAG) {
                    $scope.Data.FEENO = $scope.currentResident.FeeNo;
                    $scope.Data.REGNO = $scope.currentResident.RegNo;
                    $.ajax({
                        url: baseUrl+'/Evaluation/CalcResult',
                        crossDomain: true,
                        method: "POST",
                        data: { question: JSON.stringify($scope.Data) },
                        dataType: "json",
                        success: function (response) {
                                $scope.EvalResult = response;
                                $scope.RegQuestion.SCORE = $scope.EvalResult.Score;
                                $scope.RegQuestion.ENVRESULTS = $scope.EvalResult.Result;
                                $scope.Reference = $scope.EvalResult.Result;
                        }
                       });
                    //evaluationRes.save($scope.Data, function (response) {
                    //    $scope.EvalResult = response;
                    //    $scope.RegQuestion.SCORE = $scope.EvalResult.Score;
                    //    $scope.RegQuestion.ENVRESULTS = $scope.EvalResult.Result;
                    //    $scope.Reference = $scope.EvalResult.Result;
                    //});
                }
            } else {
                utility.message("請先選擇住民!");
            }
        }

        var DateDiff = function (NEXTEVALDATE, EVALDATE)
        {
            if (angular.isString(NEXTEVALDATE) && angular.isString(EVALDATE)) {
                 var startDate = new Date(EVALDATE);
                 var endDate = new Date(NEXTEVALDATE);
                 return startDate.dateDiff('d', endDate);
            }
            return 0;
        }

        $scope.Edit = function (item) {
            evalsheetRes.get({ qId: item.QUESTIONID, regNo: $scope.RegQuestion.REGNO, recordId: item.RECORDID }, function (response) {
                $scope.Data = response.Data;
                $scope.Code = $scope.Data.CODE;
                $scope.MakerItemByCategory = getMakerItemListByCategory($scope.Data.MakerItemList);
                $scope.RegQuestion.QUESTIONID = $scope.Data.QUESTIONID;
            });
            evalsheetRes.get({ recordId: item.RECORDID }, function (response) {
                $scope.RegQuestion = response.Data;
                $scope.RegQuestion.Gap = DateDiff($scope.RegQuestion.NEXTEVALDATE, $scope.RegQuestion.EVALDATE);
                var envResult = $scope.RegQuestion.ENVRESULTS;
                $scope.Reference = envResult;
                //$scope.RegQuestion.EVALDATE = transferDate($scope.RegQuestion.EVALDATE);
            });
        }

        $scope.Delete = function (Item) {
            if (confirm("确定删除该评估记录吗?")) {
                $.ajax({
                    url: baseUrl + '/Evaluation/Delete?recId=' + Item.RECORDID,
                    crossDomain: true,
                    type: 'GET',
                    dataType: "json",
                    success: function (data) {
                        if (data.ResultCode === 0) {
                            $scope.init();
                            $scope.GetHistory();
                            //$scope.QuestionList.splice($scope.QuestionList.indexOf(Item), 1);
                        }
                    }
                });
                //evaluationHisRes.delete({ recId: Item.RECORDID }, function (data) {
                //    if (data.ResultCode == 0) {
                //        $scope.QuestionList.splice($scope.QuestionList.indexOf(Item), 1);
                //    }
                //});
            }
        }

        $scope.GetLatestEvlRecord = function () {
            evaluationRes.get({ 'feeNo': $scope.currentResident.FeeNo, 'quetionId': $scope.RegQuestion.QUESTIONID }, function (response) {
                if (response.Data.RECORDID > 0) {
                    $scope.RegQuestion = response.Data;
                    $scope.RegQuestion.Gap = DateDiff($scope.RegQuestion.NEXTEVALDATE, $scope.RegQuestion.EVALDATE);
                    var envResult = $scope.RegQuestion.ENVRESULTS;
                    $scope.Reference = envResult;
                    evalsheetRes.get({ qId: $scope.RegQuestion.QUESTIONID, regNo: $scope.RegQuestion.REGNO, recordId: $scope.RegQuestion.RECORDID }, function (response) {
                        $scope.Data = response.Data;
                        $scope.MakerItemByCategory = getMakerItemListByCategory($scope.Data.MakerItemList);
                    });
                    $scope.RegQuestion.RECORDID = 0;
                    $scope.RegQuestion.EVALDATE = $filter("date")(new Date(), "yyyy-MM-dd");
                    utility.message("帶入最新評估歷史記錄成功!");
                } else {
                    utility.message("没有最新數據導入!");
                }
            });
        }

        $scope.Save = function () {
            if (angular.isDefined($scope.currentResident) && $scope.currentResident != null && angular.isDefined($scope.currentResident.FeeNo) && $scope.currentResident.FeeNo != '') {
                if (!$scope.Validation()) { return; }
                $scope.RegQuestion.QuestionDataList = [];
                $scope.Data.MakerItemList = [];
                for (var j = 0; j < $scope.MakerItemByCategory.length; j++) {
                    $scope.Data.MakerItemList = $scope.Data.MakerItemList.concat($scope.MakerItemByCategory[j].data);
                }
                for (var i = 0; i < $scope.Data.MakerItemList.length; i++) {
                    var questionData = {};
                    questionData.QUESTIONID = $scope.Data.QUESTIONID;
                    questionData.MAKERID = $scope.Data.MakerItemList[i].MAKERID;
                    questionData.LIMITEDVALUEID = $scope.Data.MakerItemList[i].LIMITEDVALUEID;
                    $scope.RegQuestion.QuestionDataList.push(questionData);
                }
                $.ajax({
                    url: baseUrl+'/Evaluation/Record',
                    crossDomain: true,
                    method: "POST",
                    data: { question: JSON.stringify($scope.RegQuestion) },
                    dataType: "json",
                    success: function (data) {
                            if (data.ResultCode === 0) {
                                $scope.init();
                                $scope.GetHistory();
                                utility.message("儲存成功");

                            } else {
                                utility.message(data.ResultMessage);
                            }
                    }
                });
                //evalsheetRes.save($scope.RegQuestion, function (data) {
                //    if (data.ResultCode == 0) {
                //        $scope.init();
                //        $scope.GetHistory();
                //        utility.message("儲存成功");

                //    } else {
                //        utility.message(data.ResultMessage);
                //    }
                //});
            } else {
                utility.message("請先選擇住民!");
            }
        }
        $scope.setNextValDate = function (gap) {
            if (isNumber(gap)) {
                if (gap > 0) {
                    var currentDate = $scope.RegQuestion.EVALDATE;
                    currentDate = currentDate.substring(0, 10);
                    $scope.RegQuestion.NEXTEVALDATE = GetNextEvalDate(currentDate, gap);
                } else if (gap < 0) {
                    $scope.RegQuestion.Gap = '';
                    utility.message("間隔天數不能為負數");
                }
            }
        }

        $scope.ChangeNextEvalDate = function () {
            if (angular.isString($scope.RegQuestion.NEXTEVALDATE) && angular.isString($scope.RegQuestion.EVALDATE)) {
                var startDate = new Date($scope.RegQuestion.EVALDATE);
                var endDate = new Date($scope.RegQuestion.NEXTEVALDATE);
                var days = startDate.dateDiff('d', endDate);
                if (days < 0) {
                    $scope.RegQuestion.NEXTEVALDATE = "";
                    $scope.RegQuestion.Gap = '';
                    utility.message("下次评估日期不能小于本次评估日期！");
                    return;
                }
                else {
                    $scope.RegQuestion.Gap = days;
                }
            }
        };

        $scope.Validation = function () {
            var errorTips = 0;
            //    if (angular.isDefined($scope.myForm.$error.required)) {
            //        var msg = "";
            //        for (var i = 0; i < $scope.myForm.$error.required.length; i++) {
            //            msg = $scope.myForm.$error.required[i].$name + " 為必填項";
            //            utility.msgwarning(msg);
            //            errorTips++;
            //            if (errorTips >= $scope.maxErrorTips) {
            //                return false;
            //            }
            //        }
            //    }

            //    if (angular.isDefined($scope.myForm.$error.maxlength)) {
            //        var msg = "";
            //        for (var i = 0; i < $scope.myForm.$error.maxlength.length; i++) {
            //            msg = $scope.myForm.$error.maxlength[i].$name + "超過設定長度 ";
            //            utility.msgwarning(msg);
            //            errorTips++;
            //            if (errorTips >= $scope.maxErrorTips) {
            //                return false;
            //            }
            //        }
            //    }

            if (errorTips > 0) { return false; }
            return true;
        }

    }
]);







function transferDate(originalDate) {
    if (!isEmpty(originalDate)) {
        var d = new Date(Date.parse(originalDate)).format("yyyy-MM-dd");;
        return d;
    }
}

function isEmpty(value) {
    if (value == null || value == "" || value == "undefined" || value == undefined || value == "null") { return true; } else {  //value = value.replace(/\s/g, "");
        if (value == "") {
            return true;
        }
        return false;
    }
}
function isNumber(value) {
    if (isNaN(value)) {
        return false;
    }
    else {
        return true;
    }
}



function getScore(makerItemList) {
    var score = 0;
    $.each(makerItemList, function (i, item) {
        if (isNumber(item.LIMITEDVALUEID)) {
            for (var j = 0; j < item.Answers.length; j++) {
                if (item.Answers[j].LIMITEDVALUEID == item.LIMITEDVALUEID) {
                    score += item.Answers[j].LIMITEDVALUE;
                    break;
                }
            }
        }
    })
    return score;
}
function getEvalResult(evalSheet, score) {
    var result = "";
    $.each(evalSheet, function (i, item) {
        if (score >= item.LOWBOUND && score <= item.UPBOUND) {
            result = item.RESULTNAME; return false;
        }
    })
    return result
}

function getRightAnswerCount(answers, rightAnswer) {
    var result = 0;
    $.each(answers, function (i, item) {
        if (rightAnswer == item.MakerValue) {
            result++;
        }
    })
    return result
}

function getMakerItemListByCategory(arr) {
    var map = {}, dest = [];
    for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.CATEGORY]) {
            dest.push({ CATEGORY: ai.CATEGORY, data: [ai] });
            map[ai.CATEGORY] = ai;
        } else {
            for (var j = 0; j < dest.length; j++)
            { var dj = dest[j]; if (dj.CATEGORY == ai.CATEGORY) { dj.data.push(ai); break; } }
        }
    }
    return dest;
}

function getValidateMsg(name) {
    switch (name) {
        case '身高': case '體重': case '體溫': case '脈搏次數': case '呼吸次數': case '血壓/收縮': case '血壓/舒張': return '必須為非負數字！'; break;
    }
}







