/*
创建人: 刘承
创建日期:2016-05-23
说明: 
*/
angular.module("sltcApp")
    .controller("evalSheetListCtrl", ['$scope', '$location', '$filter', 'utility', 'evalSheetRes', function ($scope, $location, $filter, utility, evalSheetRes) {
        $scope.Data = {};
        $scope.Data.Evals = [];


        //查询住民
        $scope.search = function () {
            
            evalSheetRes.query({}, function (data) {
                //console.log(data);
                angular.forEach(data, function (obj, index) {
                    if (obj.ResidentNo === $scope.curResident.ResidentNo) {
                        $scope.Data.Evals.push(obj);
                    }
                });
                //console.log($scope.Data.Evals);
            });
        };



        $scope.Delete = function (item) {
            //console.log(item.id);
            utility.confirm("确定删除该信息吗?", function (result) {
                if (result) {
                    evalSheetRes.delete({ id: item.id }, function (data) {
                        var whatIndex = null;
                        angular.forEach($scope.Data.Evals, function (cb, index) {
                            whatIndex = $scope.Data.Evals.indexOf(cb);
                        });
                        $scope.Data.Evals.splice(whatIndex, 1);
                        utility.message("刪除成功");
                    });
                }

            });
        }

        //选中住民回调函数
        $scope.residentSelected = function (resident) {
            $scope.curResident = resident;//设置当前住民
            $scope.search();//加载住民固定费用设置
            //$scope.init();//初始化住民团体评估记录
            if (angular.isDefined($scope.curResident.ResidentNo)) {
                $scope.buttonShow = true;
            }
        }


    }])
    .controller("evalSheetEditCtrl", ['$scope', '$location', '$stateParams', '$filter', 'utility', 'evalSheetRes', 'codeFileRes', 'employeeRes',
        function ($scope, $location, $stateParams, $filter, utility, evalSheetRes, codeFileRes, employeeRes) {
            $scope.initEdit = function () {

            $scope.Data = {};
            $scope.RegQuestion = {};
            $scope.RegQuestion.items = [];//存储集合对象（题目）
            $scope.Data.resident = { "id": $stateParams.rid, "name": $stateParams.pname };
            $scope.EmpList = {};

            //页面转换数据
            $scope.Data.QAs = [];
            $scope.Data.QuestionResult = {};
            $scope.Tmp = {};

            //静态数据
            $scope.Tmp.Questions = ['F00.049', 'F00.050', 'F00.051', 'F00.052', 'F00.053'];//题目
            var ResultCa = 'F00.054';//结果集
            $scope.EvalDateGap = [{ ITEMNAME: "7", ITEMCODE: 7 }, { ITEMNAME: "30", ITEMCODE: 30 }, { ITEMNAME: "60", ITEMCODE: 60 }, { ITEMNAME: "90", ITEMCODE: 90 }];
            var defaultLimitValue = "001";

            //获取评估编辑数据
            if ($stateParams.id) {
                evalSheetRes.get({ id: $stateParams.id }, function (data) {
                    $scope.RegQuestion = data;
                    $scope.Reference = $scope.RegQuestion.Reference;
                });
            }

            //字典表加载
            codeFileRes.query({}, function (data) {
                angular.forEach(data, function (item, index) {
                    var dicNo = item.itemtype;
                    angular.forEach($scope.Tmp.Questions, function (code, index) {
                        if (dicNo === code) {
                            if (!angular.isDefined(item.LIMITEDVALUEID)) {
                                item.LIMITEDVALUEID = defaultLimitValue;
                            }
                                
                            if (!$stateParams.id) {
                                $scope.Data.arg = { "id": item.itemtype, defaultLimitValue: "", "score": "0", "item": item, "result": item.ITEMNAME };
                                $scope.RegQuestion.items.push($scope.Data.arg);
                            } else {
                                angular.forEach($scope.RegQuestion.items, function (obj, index2) {
                                    if (obj.id == code) {
                                        $scope.RegQuestion.items[index2].item.LIMITEDVALUEID = item.LIMITEDVALUEID = obj.LIMITEDVALUEID;
                                    }
                                });
                            }
                            $scope.Data.QAs.push(item);
                                
                        }
                    });
                    if (dicNo === ResultCa) {
                        $scope.Data.QuestionResult = item;
                    }
                });
                //console.log($scope.Data.QAs);
            })

            //员工加载
            employeeRes.query({}, function (data) {
                $scope.EmpList = data;
            });
        }

        $scope.initEdit();


        $scope.setNextValDate = function (gap) {
            var currentDate = $scope.RegQuestion.Evaldate;
            currentDate = currentDate.substring(0, 10);
            $scope.RegQuestion.Nextevaldate = GetNextEvalDate(currentDate, gap);
        }


        $scope.Save = function () {
            if (!angular.isDefined($stateParams.rid)) {
                utility.message("请选择老人");
                return false;
            }
            $scope.RegQuestion.ResidentNo = $stateParams.rid;
            $scope.RegQuestion.QuestionResult = $scope.Data.QuestionResult;
            $scope.RegQuestion.Reference = $scope.Reference;
            evalSheetRes.save($scope.RegQuestion, function (data) {
                $location.url("/angular/EvalSheetList");
                utility.message('评估数据保存成功');
            });
        }

        $scope.calcResult = function (obj, itemId) {
            var ix = $scope.Data.QAs.indexOf(obj);
            var scoreCount = 0;
            //保存分数
            angular.forEach($scope.RegQuestion.items[ix].item.items, function (data, index) {

                if (data.ITEMCODE === itemId) {
                    $scope.RegQuestion.items[ix].score = data.ORDERSEQ;
                    $scope.RegQuestion.items[ix].result = data.ITEMNAME;
                        
                    $scope.RegQuestion.items[ix].item.LIMITEDVALUEID = itemId;
                    $scope.RegQuestion.items[ix].LIMITEDVALUEID = itemId;
                }
            });
            //统计分数
            angular.forEach($scope.RegQuestion.items, function (data, index) {
                //console.log("单项分数：" + $scope.RegQuestion.items[index].score);
                scoreCount += parseFloat($scope.RegQuestion.items[index].score);
            });
            $scope.RegQuestion.Score = scoreCount;
            if (scoreCount > 0 && scoreCount <= 3) {
                $scope.RegQuestion.Envresults = $scope.Data.QuestionResult.items[0].ITEMNAME;
                $scope.Reference = $scope.Data.QuestionResult.items[0].ITEMCODE;
            } else if (scoreCount > 3 && scoreCount <= 7) {
                $scope.RegQuestion.Envresults = $scope.Data.QuestionResult.items[1].ITEMNAME;
                $scope.Reference = $scope.Data.QuestionResult.items[1].ITEMCODE;
            } else if (scoreCount > 7 && scoreCount <= 11) {
                $scope.RegQuestion.Envresults = $scope.Data.QuestionResult.items[2].ITEMNAME;
                $scope.Reference = $scope.Data.QuestionResult.items[2].ITEMCODE;
            } else {
                $scope.RegQuestion.Envresults = $scope.Data.QuestionResult.items[3].ITEMNAME;
                $scope.Reference = $scope.Data.QuestionResult.items[3].ITEMCODE;
            }

        };

    }])
;
//下次评估日期
function GetNextEvalDate(currentDate, gap) {
    if (!isEmpty(currentDate) && !isEmpty(gap)) {
        var d = new Date(Date.parse(currentDate.replace(/-/g, "/")));
        d.setDate(d.getDate() + gap * 1);
        return d.format("yyyy-MM-dd");
    }
};


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

