//DCevalsheetRes
//
angular.module('sltcApp')
.controller('RegQuestionEvalRecCtrl', ['$rootScope', '$scope', 'utility', '$state', 'dictionary', 'cloudAdminUi', 'residentRes', 'dc_RegQuestionEvalRecRes', 'personInfoRes',
    function ($rootScope, $scope, utility, $state, dictionary, cloudAdminUi, residentRes, dc_RegQuestionEvalRecRes, personInfoRes) {
        $scope.FeeNo = 0;
        $scope.StrFeeNo = '';
        $scope.StrRegNo = '';
        $scope.currentItem = {};
        $scope.buttonShow = true;
        $scope.Data = {};
        $scope.item1 = {};
        $scope.item2 = {};
        $scope.item3 = {};
        $scope.item4 = {};
        $scope.item5 = {};
        $scope.currentScore0 = 0;
        $scope.currentScore1 = 0;
        $scope.currentScore2 = 0;
        $scope.currentScore3 = 0;
        $scope.currentScore4 = 0;

        $scope.totalScore = 0;//总分值
        $scope.totalCheck1 = false;
        $scope.totalCheck2 = false;
        $scope.calculateType = 0;
        $scope.evalResult = "";
        $scope.currentItem.EvalRecId = 0;
        $scope.init = function () {
            //$scope.Org = $rootScope.Global.Organization;
            //如果选中住民需要加载最新一条记录.如果未选人，需要加所有问题列表(无值列表)
            if ($scope.FeeNo != "")
                $scope.buttonShow = false;
            $scope.search();
        }
        //选中住民
        $scope.residentSelected = function (resident) {
            $scope.StrFeeNo = resident.ResidentNo;
            $scope.StrRegNo = resident.PersonNo;
            resident.FeeNo = utility.hashCode(resident.ResidentNo);
            resident.RegNo = utility.hashCode(resident.PersonNo);
            $scope.currentResident = resident;

            $scope.Data = {};//清空编辑项

            if (angular.isDefined($scope.currentResident)) {
                $scope.buttonShow = false;
            }
            $scope.FeeNo = resident.FeeNo;
            //获得当前登陆用户信息
            //获得当前登陆用户信息
            $scope.curUser = { EmpNo: $scope.$root.user.id, EmpName: $scope.$root.user.EmpName }; //utility.getUserInfo();
            //$scope.currentItem.CreateBy = $scope.curUser.EmpNo;
            //加载选中住民基本数据
            $scope.getBaiscInfo();
            $scope.search();
        };
        $scope.search = function () {
            $scope.currentScore0 = 0;
            $scope.currentScore1 = 0;
            $scope.currentScore2 = 0;
            $scope.currentScore3 = 0;
            $scope.currentScore4 = 0;
            //加载所有问题及分类
            dc_RegQuestionEvalRecRes.get({ feeNo: $scope.FeeNo == "" ? 0 : $scope.FeeNo }, function (response) {
                $scope.Data = response.Data;

                $scope.currentItem.EvalRecId = $scope.Data[0].QuestionItem[0].EVALRECID;
                //统计各大项总分
                if (response.Data != null) {
                    for (var n = 0; n < response.Data.length; n++) {

                        for (var i = 0; i < response.Data[n].QuestionItem.length; i++) {
                            if (response.Data[n].QuestionItem[i].QUESTIONCODE == "1")
                                $scope.currentScore0 += response.Data[n].QuestionItem[i].ITEMVALUE;
                            if (response.Data[n].QuestionItem[i].QUESTIONCODE == "2")
                                $scope.currentScore1 += response.Data[n].QuestionItem[i].ITEMVALUE;
                            if (response.Data[n].QuestionItem[i].QUESTIONCODE == "3")
                                $scope.currentScore2 += response.Data[n].QuestionItem[i].ITEMVALUE;
                            if (response.Data[n].QuestionItem[i].QUESTIONCODE == "4")
                                $scope.currentScore3 += response.Data[n].QuestionItem[i].ITEMVALUE;
                            if (response.Data[n].QuestionItem[i].QUESTIONCODE == "5")
                                $scope.currentScore4 += response.Data[n].QuestionItem[i].ITEMVALUE;
                        }
                    }


                    $scope.calTotal();
                }

            });
            $scope.EVALDATE = new Date().format("yyyy年MM月dd日");
        }
        $scope.getBaiscInfo = function () {
            if (angular.isDefined($scope.currentResident.RegNo)) {
                residentRes.query({ ResidentNo: $scope.StrFeeNo }, function (data) {
                    if (data != null && data.length > 0) {
                        $scope.currentItem = data[0];
                        $scope.currentItem.BirthDate = new Date($scope.currentItem.Birthdate).format("yyyy-MM-dd");
                        $scope.currentItem.Age = (new Date().getFullYear() - new Date($scope.currentItem.Birthdate).getFullYear());
                        $scope.currentItem.RegName = $scope.currentItem.PersonName;
                        $scope.currentItem.Sex = $scope.currentItem.Sex;
                        $scope.currentItem.InDate = new Date($scope.currentItem.CheckinDate).format("yyyy-MM-dd");
                        $scope.currentItem.ORGID = $scope.currentItem.ResidentOrg;
                    }
                });

                //加载选中住民基本数据
                //dc_PersonBasicRes.get({ orgId: $scope.currentResident.OrgId, feeNo: $scope.FeeNo, idNo: '', name: '', currentPage: 1, pageSize: 10 }, function (data) {
                //    $scope.currentItem = data.Data[0];
                //    $scope.currentItem.BirthDate = new Date($scope.currentItem.BirthDate).format("yyyy-MM-dd");
                //    $scope.currentItem.InDate = new Date($scope.currentItem.InDate).format("yyyy-MM-dd");
                //    $scope.currentItem.Age = (new Date().getFullYear() - new Date($scope.currentItem.BirthDate).getFullYear());
                //});
            }
            else
                utility.message("您未选中住民！");
        }

        $scope.saveForm = function (item) {
            for (var n = 0; n < item.length; n++) {
                item[n].FeeNo = $scope.FeeNo;
                item[n].SCORE = parseFloat($scope._totalScore);
                item[n].EVALRESULT = $scope.evalResult;
                item[n].EVALRESULT = $scope.evalResult;
                item[n].ORGID = $scope.currentItem.ORGID;
                for (var i = 0; i < item[n].QuestionItem.length; i++) {
                    if (item[n].QuestionItem.QUESTIONID === 3) {
                        if (item[n].QuestionItem[i].ITEMVALUE === true) {
                            item[n].QuestionItem[i].ITEMVALUE = 1;
                        }
                        else
                            item[n].QuestionItem[i].ITEMVALUE = 0;
                    }

                }
            }
            if (angular.isDefined($scope.FeeNo)) {
                dc_RegQuestionEvalRecRes.save(item, function (data) {
                    if (data.ResultCode == 0) {
                        utility.message("资料储存成功！");

                        $scope.currentItem.EvalRecId = data.Data.EvalRecId;
                    }
                    else
                        utility.message("资料储存失败！");
                });
            }

        }
        $scope.addEval = function () {
            $scope.Data = {};
            $scope.currentScore0 = 0;
            $scope.currentScore1 = 0;
            $scope.currentScore2 = 0;
            $scope.currentScore3 = 0;
            $scope.currentScore4 = 0;
            $scope._totalScore = 0;//总分值
            dc_RegQuestionEvalRecRes.get({ feeNo: 0 }, function (response) {
                $scope.Data = response.Data;

            });

        }
        $scope.calScore0 = function (num) {
            $scope.currentScore0 = 0;
            for (var n = 0; n < $scope.Data[num].QuestionItem.length; n++) {

                $scope.currentScore0 += $scope.Data[num].QuestionItem[n].ITEMVALUE;
            }
            $scope.calculateType = 1;//如果这里产生分值将会使用第一种计总分方式
            //$scope.calTotal();
        }
        $scope.calScore1 = function (num) {
            $scope.currentScore1 = 0;
            for (var n = 0; n < $scope.Data[num].QuestionItem.length; n++) {

                $scope.currentScore1 += $scope.Data[num].QuestionItem[n].ITEMVALUE;
            }
            $scope.calculateType = 1;//如果这里产生分值将会使用第一种计总分方式
            $scope.calTotal();
        }
        $scope.selectVal = function (obj) {
            $scope.currentScore2 = 0;
            for (var n = 0; n < $scope.Data[2].QuestionItem.length; n++) {
                if ($scope.Data[2].QuestionItem[n].ITEMVALUE == true) {
                    $scope.currentScore2 += 1;
                }
            }
            $scope.calTotal();
        }
        $scope.calScore3 = function (num) {
            $scope.currentScore3 = 0;
            for (var n = 0; n < $scope.Data[num].QuestionItem.length; n++) {

                $scope.currentScore3 += $scope.Data[num].QuestionItem[n].ITEMVALUE;
            }
            $scope.calculateType = 2;
            $scope.calTotal();
        }
        $scope.calScore4 = function (num) {
            $scope.currentScore4 = 0;
            for (var n = 0; n < $scope.Data[1].QuestionItem.length; n++) {

                $scope.currentScore4 += $scope.Data[num].QuestionItem[n].ITEMVALUE;
            }
            $scope.calculateType = 2;
            $scope.calTotal();
        }
        //总分值计算
        $scope.calTotal = function () {
            $scope._totalScore = 0;

            if ($scope.calculateType == 1) {
                $scope._totalScore = ($scope.currentScore0 + $scope.currentScore1) * 0.5 + $scope.currentScore2 * 4 + $scope.currentScore3 * 0.5 + $scope.currentScore4 * 0.5;
            }
            else {
                $scope._totalScore = $scope.currentScore2 * 4 + $scope.currentScore3 + $scope.currentScore4;
            }

            if ($scope._totalScore < 80) {
                $scope.totalCheck1 = false;
                $scope.totalCheck2 = true;
                $scope.evalResult = "未适应(总分80分以下)，请拟订个案辅导计划(可邀请重要他人共同拟订)";
            }
            else if ($scope._totalScore >= 80) {
                $scope.totalCheck1 = true;
                $scope.totalCheck2 = false;
                $scope.evalResult = "已适应(总分80分以上)，按中心服务流程提供服务";
            }

        }
        $scope.showHistory = function () {
            if (angular.isDefined($scope.FeeNo)) {
                //获取历史记录
                dc_RegQuestionEvalRecRes.get({ feeNo: $scope.FeeNo, type: -1 }, function (evalItem) {
                    $scope.HistoryList = evalItem.Data;

                    for (var n = 0; n < $scope.HistoryList.length; n++) {
                        $scope.HistoryList[n].Name = $scope.currentResident.Name;
                    }
                    $("#historyModal").modal("toggle");
                });
            }
            else
                utility.message("您未选中住民!");
        }

        $scope.PrintPreview = function (id) {
            if (angular.isDefined(id) && id != null) {
                window.open('/DC_Report/Preview?templateName=DCS1.6受托长辈适应评估表&recId=' + id);
            } else {
                utility.message("未获取到个案评估记录,无法打印！");
            }

        }

        $scope.init();
    }]);

