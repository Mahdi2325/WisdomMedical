/*
 * 描述：社工个案评估及处遇计划表
 * 创建人：杨金高
 * 创建日期：2016-05-24
 */
angular.module("sltcApp")
.controller('swregevalplanCtrl', ['$rootScope', '$scope', 'utility', '$state', 'dictionary', 'cloudAdminUi', 'residentRes', 'dc_SwRegEvalPlan', 'DCNursePlanRes', 'dc_TaskgoalsstrategyRes', 'personInfoRes',
    function ($rootScope, $scope, utility, $state, dictionary, cloudAdminUi, residentRes, dc_SwRegEvalPlan, DCNursePlanRes, dc_TaskgoalsstrategyRes, personInfoRes) {
        $scope.FeeNo = 0; //utility.hashCode('341122195006062035');//utility.hashCode($state.params.FeeNo);
        $scope.StrFeeNo = '';//'341122195006062035';
        $scope.StrRegNo = '';
        //$scope.Org =$rootScope.Global.Organization;
        //存储需求类别
        $scope.problemList = {};
        //当前窗体项
        $scope.currentItem = {};
        //当前选中住民基本信息
        $scope.currentBaisc = {};
        //住民当前评估计划项
        $scope.currentEval = {};
        //填写当前评估中的计划项
        $scope.currentPlan = {};
        //执行成效无法执行原因
        $scope.showReason = false;
        //当前操作的评估ID默认值
        $scope.currentItem.EVALPLANID = '';

        //控制当前页面功能按纽可见
        $scope.buttonShow = true;
        //控制当前Tab标签的可见
        $scope.isShowTab2 = true;
        $scope.isShowTab3 = true;
        //存放历史记录
        $scope.HistoryList = {};
        //$scope.hasPlan = true;
        //$scope.hasEvalVal = true;


        $scope.init = function () {


            //$(".uniform").uniform();
            //cloudAdminUi.initFormWizard();

            //获取需求类别(大类);cpNo=13代表获取的是社工部分
            DCNursePlanRes.get({ levelPr: "心理社会层面", majorType: '社工' }, function (data) {
                $scope.problemList = data.Data;
            });
            if ($scope.FeeNo != "") {
                //如果第一次的话需要加载基本资料表信息,填充当前窗体部分数据
                // $scope.loadBasicInfo();
                $scope.search(0);
            }

            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: dc_SwRegEvalPlan,//异步请求的res
                success: function (data) {//请求成功时执行函数

                    $scope.HistoryList = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                },
                params: { feeNo: $scope.FeeNo }
            }

        };
        //选中住民
        $scope.residentSelected = function (resident) {
            $scope.StrFeeNo = resident.ResidentNo;
            $scope.StrRegNo = resident.PersonNo;
            resident.FeeNo = utility.hashCode(resident.ResidentNo);
            resident.RegNo = utility.hashCode(resident.PersonNo);
            $scope.currentResident = resident;
            $scope.FeeNo = $scope.currentResident.FeeNo;
            $scope.currentEval = {};
            $scope.currentItem = {};//清空编辑项
            $scope.currentPlan = {};
            $scope.QuestionTypeItem = {};

            if (angular.isDefined($scope.currentResident)) {
                $scope.buttonShow = false;
            }

            $scope.currentItem.RegNo = resident.RegNo;
            //获得当前登陆用户信息
            $scope.curUser = { EmpNo: $scope.$root.user.id, EmpName: $scope.$root.user.EmpName }; //utility.getUserInfo();

            $scope.currentItem.CreateBy = $scope.curUser.EmpNo;
            $scope.ORGNAME = resident.OrgName;

            //每次重新选人后重置一下显示tab页的状态值
            $scope.hasPlan = false;
            $scope.hasEvalVal = false;


            $scope.HistoryList = {};
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.pageInfo.PageSize = 10;
            $scope.options.params.feeNo = $scope.FeeNo;

            $scope.search(0);//查询所选住民最新一条记录
        };
        $scope.search = function (id) {


            if (angular.isDefined($scope.FeeNo)) {
                //$scope.loadBasicInfo();
                //加载社工个案评估,最新一条记录
                dc_SwRegEvalPlan.get({ feeNo: $scope.FeeNo, evalPlanId: id }, function (data) {
                    if (data.Data.swRegEvalPlanModel.EVALPLANID == 0) {
                        $scope.currentItem.EVALNUMBER = 1;
                        $scope.currentItem.EVALPLANID = 0;
                        //第一次评估的话默认是只显示一,三两个tab页
                        $scope.isShowTab2 = false;
                        $scope.isShowTab3 = true;
                        $scope.hasEvalVal = true;
                        //如果是第一次做评估，则需要加载护理部分的评估值ＭＭＳＥ,ＡＤＬ,ＩＡＤＬ
                        //$scope.getEvalQuestionVal();
                        $scope.currentItem.EvalDate = new Date();
                    }
                    else {

                        $scope.isShowTab2 = true;
                        $scope.isShowTab3 = true;

                        $scope.currentItem = data.Data.swRegEvalPlanModel;


                        $scope.currentItem.EVALPLANID = data.Data.swRegEvalPlanModel.EVALPLANID;

                        $scope.setEvalList($scope.currentItem.EVALPLANID);//加载当前评估的计划及评值

                        $scope.calculateDate($scope.currentItem.EVALDATE, 3);
                        if ($scope.currentItem.EVALPLANID != "" && $scope.currentItem.EVALPLANID != undefined) {
                            if (data.Data.TaskGoalsStrategyModel.length > 0) {
                                for (var n = 0; n < data.Data.TaskGoalsStrategyModel.count; n++) {
                                    if (data.Data.TaskGoalsStrategyModel[n].EVALUATIONVALUE == null || data.Data.TaskGoalsStrategyModel[n].EVALUATIONVALUE == "") {//如果有评估需求，但没有评值，则不可再次新增评估
                                        $scope.hasEvalVal = true;//如果有过计划，但还有部分没评值，直接不可以再次新增评估
                                        break;
                                    }
                                }
                            }
                            else
                                $scope.hasEvalVal = true;//如果有过计划，但还有部分没评值，直接不可以再次新增评估
                        }
                    }
                });
                $scope.loadBasicInfo();

            }
            else {
                utility.message("未获取到住民！");
            }
        }

        $scope.getEvalQuestionVal = function () {
            dc_SwRegEvalPlan.get({ feeNo: $scope.FeeNo, num: $scope.currentItem.EVALNUMBER, type: '1' }, function (data) {
                if (data.Data != null) {
                    $scope.currentItem.ADL = data.Data.ADL;
                    $scope.currentItem.IADL = data.Data.IADL;
                    $scope.currentItem.MMSE = data.Data.MMSE;
                    $scope.currentItem.GDS = data.Data.GDS;
                }
                else
                    utility.message("未匹配到护理计划第" + $scope.currentItem.EVALNUMBER + "笔数据！");
            });
        }
        //计算下次评估日期，此项评估是３个月评估一次，默认加３个月
        $scope.calculateDate = function (oldVal, mth) {
            var tmpDate = new Date(oldVal);
            var startY = tmpDate.getFullYear();
            var startM = tmpDate.getMonth();
            var startD = tmpDate.getDate();
            var disDate = new Date(startY, startM + mth, startD);
            $scope.currentItem.NEXTEVALDATE = disDate.format("yyyy-MM-dd");
        }
        //保存评估窗体数据
        $scope.saveForm = function (item) {
            if ($scope.socialForm.$valid) {//判断验证通过后才可以保存

                $scope.currentItem.FeeNo = $scope.currentResident.FeeNo;
                dc_SwRegEvalPlan.save(item, function (data) {

                    if (angular.isDefined(item.FeeNo)) {
                        utility.message("数据储存成功！");
                    }

                    $scope.currentItem.EVALPLANID = data.Data.EVALPLANID;
                });
            }
            else {
                //验证没有通过
                $scope.getErrorMessage($scope.socialForm.$error);
                $scope.errs = $scope.errArr.reverse();
                var count = 0;
                for (var n = $scope.errs.length; n--;) {
                    utility.msgwarning($scope.errs[n]);
                    count++;
                    if (count > 2) break;
                }
            }
        };
        //保存评值
        $scope.saveEval = function (items) {
            if ($scope.zxForm.$valid) {

                var count = 0;
                for (var n = 0; n < items.length; n++) {
                    items[n].EVALPLANID = $scope.currentItem.EVALPLANID;

                    if (items[n].EVALUATIONVALUE != "" && items[n].EVALUATIONVALUE != null) {
                        dc_TaskgoalsstrategyRes.save(items[n], function (data) {
                            if (data.ResultCode == 0) {
                                utility.message(data.Data.QUESTIONTYPE + "   评值成功！");
                                items[n].EVALUATIONVALUE = data.Data.EVALUATIONVALUE;
                                count++;
                            }
                        });
                    }


                }
                for (var i = 0; i < items.length; i++) {
                    if (items[i].EVALUATIONVALUE == null) {
                        utility.message("您还有部分计划未进行评值！");
                        $scope.hasEvalVal = true;
                        break;
                    }
                    $scope.hasEvalVal = false;
                }

            }
            else {
                //验证没有通过
                $scope.getErrorMessage($scope.zxForm.$error);
                $scope.errs = $scope.errArr.reverse();
                var count = 0;
                for (var n = $scope.errs.length; n--;) {
                    utility.msgwarning($scope.errs[n]);
                    count++;
                    if (count > 2) break;
                }
            }

        }
        //初评估日期变化事件，同时更新下次默认评估日期
        $scope.changeEvalDate = function (oldDate) {
            $scope.calculateDate(oldDate, 3);
        }
        //工作目标中的需求类别更改事件
        $scope.changLevel = function (item) {

            $scope.currentPlan.QUESTIONTYPE = item.DiaPr;
            DCNursePlanRes.get({ cpNo: item.CpNo, dirPr: '', mark: "导因" }, function (data) {
                $scope.activityList = data.Data;

            });
        };
        //执行成效评值事件，如选'无法执行'需要填写原因
        $scope.changEvalVal = function (val) {
            if (val == "004") {
                $scope.showReason = true;
            }
        }
        $scope.editPlan = function (item) {
            $scope.eidt = item;
            $("#editModal").modal("toggle");
        };
        $scope.deletePlan = function (item) {
            if (confirm("您确定要删除该条计划吗?")) {

                dc_TaskgoalsstrategyRes.delete({ id: item.ID }, function (data) {
                    if (data.$resolved) {
                        var whatIndex = null;
                        angular.forEach($scope.currentEval, function (cb, index) {
                            if (cb.id = item.ID) whatIndex = index;
                        });

                        if (data.ResultCode == 0)
                            utility.message("数据删除成功！");
                        // $scope.currentEval.splice(whatIndex, 1);
                        $scope.setEvalList($scope.currentItem.EVALPLANID);
                    }
                });
            }
        }
        $scope.saveEdit = function (edit) {

            // plan.EVALPLANID = $scope.currentItem.EVALPLANID;
            dc_TaskgoalsstrategyRes.save(edit, function (data) {
                if (data.ResultCode == 0) {
                    utility.message("计划更新成功！");
                }
                else
                    utility.message("计划更新失败！");
                $("#editModal").modal("toggle");
            });
        }
        //新增评估
        $scope.addEval = function () {

            dc_SwRegEvalPlan.get({ feeNo: $scope.FeeNo, evalPlanId: 0 }, function (data) {

                if (data.Data.swRegEvalPlanModel.EVALPLANID === 0) {
                    $scope.currentItem.EVALNUMBER = 1;

                    //第一次评估的话默认是只显示一,三两个tab页
                    $scope.isShowTab2 = false;
                    $scope.isShowTab3 = true;
                    $scope.hasEvalVal = true;
                    //如果是第一次做评估，则需要加载护理部分的评估值ＭＭＳＥ,ＡＤＬ,ＩＡＤＬ
                    //  $scope.getEvalQuestionVal();
                    var count = $scope.currentItem.EVALNUMBER;
                    var tmpEDate = $scope.currentItem.EVALDATE;
                    var IDate = $scope.currentItem.INDATE;
                    var rId = $scope.currentItem.RESIDENTNO;

                    DCNursePlanRes.get({ levelPr: "心理社会层面", majorType: '社工' }, function (data) {
                        $scope.problemList = data.Data;
                    });
                    $scope.loadBasicInfo();
                    $scope.calculateDate($scope.currentItem.EVALDATE, 3);
                    $scope.currentItem.EVALDATE = tmpEDate;
                    $scope.currentItem.INDATE = IDate;
                    $scope.currentItem.RESIDENTNO = rId;
                    $scope.calculateDate(tmpEDate, 3);
                    $scope.currentItem.EVALPLANID = 0;

                    $scope.hasPlan = true;
                    $scope.hasEvalVal = false;

                }
                else {

                    $scope.isShowTab2 = true;
                    $scope.isShowTab3 = true;
                    $scope.currentItem = data.Data.swRegEvalPlanModel;
                    $scope.ORGNAME = $scope.currentItem.ORGNAME;
                    $scope.currentItem.EVALPLANID = data.Data.swRegEvalPlanModel.EVALPLANID;
                    $scope.calculateDate($scope.currentItem.EVALDATE, 3);
                    if ($scope.currentItem.EVALPLANID != "" && $scope.currentItem.EVALPLANID != undefined) {

                        if (data.Data.TaskGoalsStrategyModel != null && data.Data.TaskGoalsStrategyModel.length > 0) {
                            for (var n = 0; n < data.Data.TaskGoalsStrategyModel.length; n++) {
                                if (data.Data.TaskGoalsStrategyModel[n].EVALUATIONVALUE == null || data.Data.TaskGoalsStrategyModel[n].EVALUATIONVALUE == "") {
                                    utility.message("您当前有计划未评值，不可以新增评估！");
                                    $scope.hasEvalVal = true;//如果有过计划，但还有部分没评值，直接不可以再次新增评估
                                    break;
                                }

                            }
                            if (!$scope.hasEvalVal) {
                                var count = $scope.currentItem.EVALNUMBER;
                                var tmpEDate = $scope.currentItem.EVALDATE;
                                var IDate = $scope.currentItem.INDATE;
                                var rId = $scope.currentItem.RESIDENTNO;
                                $scope.currentItem = {};
                                $scope.currentEval = {};
                                $scope.activityList = {};
                                $scope.problemList = {};
                                DCNursePlanRes.get({ levelPr: "心理社会层面", majorType: '社工' }, function (data) {
                                    $scope.problemList = data.Data;
                                });
                                $scope.loadBasicInfo();
                                $scope.calculateDate($scope.currentItem.EVALDATE, 3);
                                $scope.currentItem.EVALNUMBER = parseInt(count) + 1;
                                $scope.currentItem.EVALDATE = tmpEDate;
                                $scope.currentItem.INDATE = IDate;
                                $scope.currentItem.RESIDENTNO = rId;
                                $scope.calculateDate(tmpEDate, 3);
                                $scope.currentItem.EVALPLANID = 0;
                                $scope.hasPlan = true;
                                $scope.hasEvalVal = false;
                            }

                        }
                        else
                            utility.message("您当前还未做计划，不可以新增评估！");
                    }
                    else
                        utility.message("您当前有计划未评值，不可以新增评估！");//$scope.hasEvalVal = true;//如果有过计划，但还有部分没评值，直接不可以再次新增评估
                }

            });

        }

        //加载评估计划
        $scope.getEvalPlan = function (evalplanid) {
            if (evalplanid != "" && evalplanid != undefined) {
                //根据评估EvalPlanId获取相应的上次评估项/值
                dc_TaskgoalsstrategyRes.get({ id: evalplanid, feeNo: $scope.FeeNo }, function (evalItem) {

                    $scope.currentEval = evalItem.Data;
                });

            }
        }
        //保存社工下一步计划
        $scope.addPlan = function (plan) {
            if ($scope.currentItem.EVALPLANID != "" && $scope.currentItem.EVALPLANID != undefined) {
                plan.EVALPLANID = $scope.currentItem.EVALPLANID;
                dc_TaskgoalsstrategyRes.save(plan, function (data) {

                    if (angular.isDefined(plan.EVALPLANID)) {
                        utility.message("计划储存成功！");
                        $scope.currentPlan = {};

                        DCNursePlanRes.get({ levelPr: "心理社会层面", majorType: '社工' }, function (data) {
                            $scope.problemList = data.Data;
                        });
                        $scope.activityList = {};
                        $scope.hasEvalVal = true;
                        $scope.isShowTab2 = true;
                        $scope.setEvalList($scope.currentItem.EVALPLANID);
                    }
                    else {
                        //$scope.Data.subsidys.push(data.Data);
                        //utility.message($scope.currentResident.Name + "的基本资料更新新成功！");
                    }
                });
            }
            else
                utility.message("您当前未进行评估，无法填写下步计划操作!");
        }
        $scope.setEvalList = function (evalPlanId) {

            $scope.currentEval = {};
            //根据评估EvalPlanId获取相应的上次评估项/值
            dc_TaskgoalsstrategyRes.get({ id: evalPlanId, feeNo: $scope.FeeNo }, function (evalItem) {
                $scope.currentEval = evalItem.Data;
                for (var n = 0; n < $scope.currentEval.length; n++) {
                    if ($scope.currentEval[n].EVALUATIONVALUE == null || $scope.currentEval[n].EVALUATIONVALUE == "") {
                        $scope.tabShow = false;
                        break;
                    }
                    else
                        $scope.tabShow = true;
                }
            });
        }
        $scope.loadBasicInfo = function () {
            if ($scope.StrFeeNo != "") {
                residentRes.query({ ResidentNo: $scope.StrFeeNo }, function (data) {
                    if (data.length > 0) {
                        $scope.currentBaisc = data[0];
                        $scope.currentItem.RESIDENTNO = $scope.currentBaisc.ResidentNo;
                        $scope.currentItem.REGNAME = $scope.currentBaisc.PersonName;
                        //$scope.currentItem.IDNO = $scope.currentBaisc.IdNo;
                        $scope.currentItem.SEX = $scope.currentBaisc.Sex;
                        $scope.currentItem.BIRTHDATE = $scope.currentBaisc.Birthdate;
                        //$scope.currentItem.CONTACTNAME = $scope.currentBaisc.SuretyName;
                        //$scope.currentItem.CONTACTMOBILE = $scope.currentBaisc.SuretyMobile;
                        $scope.currentItem.CONTACTPHONE = $scope.currentBaisc.SuretyPhone;
                        //$scope.currentItem.LIVINGADDRESS = $scope.currentBaisc.LivingAddress;
                        $scope.currentItem.PTYPE = $scope.currentBaisc.PType;
                        $scope.currentItem.OBSTACLEMANUAL = $scope.currentBaisc.ObstacleManual;
                        //$scope.currentItem.SERVICETYPE = $scope.currentBaisc.ServiceType;
                        $scope.currentItem.SOURCETYPE = $scope.currentBaisc.SourceType;
                        $scope.currentItem.DISEASEINFO = $scope.currentBaisc.DiseaseInfo;
                        $scope.currentItem.ECOLOGICALMAP = $scope.currentBaisc.EcologicalMap;
                        $scope.currentItem.EVALDATE = new Date();
                        $scope.currentItem.INDATE = new Date($scope.currentBaisc.CheckinDate).format("yyyy-MM-dd");
                        $scope.calculateDate($scope.currentItem.EVALDATE, 3);
                        $scope.currentItem.EVALDATE = new Date($scope.currentItem.EVALDATE).format("yyyy-MM-dd");
                        $scope.currentItem.ORGID = $scope.currentBaisc.ResidentOrg;
                        //$scope.ORGNAME = $scope.currentBaisc.ORGNAME;
                    }
                });
                personInfoRes.query({ PersonNo: $scope.StrRegNo }, function (data) {
                    if (data.length > 0) {
                        $scope.currentBaisc = data[0];
                        //$scope.currentItem.REGNAME = $scope.currentBaisc.PersonName;
                        $scope.currentItem.IDNO = $scope.currentBaisc.Idcard;
                        //$scope.currentItem.SEX = $scope.currentBaisc.Sex;
                        //$scope.currentItem.BIRTHDATE = $scope.currentBaisc.Birthdate;
                        $scope.currentItem.CONTACTNAME = $scope.currentBaisc.ContactName1;
                        $scope.currentItem.CONTACTMOBILE = $scope.currentBaisc.Phone;
                        $scope.currentItem.CONTACTPHONE = $scope.currentBaisc.ContactName1;
                        $scope.currentItem.LIVINGADDRESS = $scope.currentBaisc.City + $scope.currentBaisc.Address;
                    }
                });

                //dc_PersonBasicRes.get({ orgId: '', feeNo: $scope.FeeNo, idNo: '', name: '', currentPage: 1, pageSize: 10 }, function (data) {
                //    if (data.Data[0] != null) {
                //        $scope.currentBaisc = data.Data[0];

                //        $scope.currentItem.RESIDENTNO = $scope.currentBaisc.ResidentNo;
                //        $scope.currentItem.REGNAME = $scope.currentBaisc.RegName;
                //        $scope.currentItem.IDNO = $scope.currentBaisc.IdNo;
                //        $scope.currentItem.SEX = $scope.currentBaisc.Sex;
                //        $scope.currentItem.BIRTHDATE = $scope.currentBaisc.BirthDate;
                //        $scope.currentItem.CONTACTNAME = $scope.currentBaisc.SuretyName;
                //        $scope.currentItem.CONTACTMOBILE = $scope.currentBaisc.SuretyMobile;
                //        $scope.currentItem.CONTACTPHONE = $scope.currentBaisc.SuretyPhone;
                //        $scope.currentItem.LIVINGADDRESS = $scope.currentBaisc.LivingAddress;
                //        $scope.currentItem.PTYPE = $scope.currentBaisc.PType;
                //        $scope.currentItem.OBSTACLEMANUAL = $scope.currentBaisc.ObstacleManual;
                //        //$scope.currentItem.SERVICETYPE = $scope.currentBaisc.ServiceType;
                //        $scope.currentItem.SOURCETYPE = $scope.currentBaisc.SourceType;
                //        $scope.currentItem.DISEASEINFO = $scope.currentBaisc.DiseaseInfo;
                //        $scope.currentItem.ECOLOGICALMAP = $scope.currentBaisc.EcologicalMap;
                //        $scope.currentItem.EVALDATE = new Date();
                //        $scope.currentItem.INDATE = new Date($scope.currentBaisc.InDate).format("yyyy-MM-dd");
                //        $scope.calculateDate($scope.currentItem.EVALDATE, 3);
                //        $scope.currentItem.EVALDATE = new Date($scope.currentItem.EVALDATE).format("yyyy-MM-dd");
                //        //$scope.ORGNAME = $scope.currentBaisc.ORGNAME;
                //    }
                //});
            }
            else {
                utility.message("您未选中住民!");
            }
        }
        $scope.showHistory = function () {

            if (angular.isDefined($scope.FeeNo)) {
                //dc_SwRegEvalPlan.get({ feeNo: $scope.FeeNo, currentPage: 1, pageSize: 10 }, function (data) {

                //    $scope.HistoryList = data.Data;
                //});
                $scope.options.search();
                $("#historyModal").modal("toggle");
            }
            else
                utility.message("您未选中住民!");
        }
        $scope.editEval = function (id) {
            $scope.search(id);
            $("#historyModal").modal("toggle");
        }


        //验证信息提示
        $scope.getErrorMessage = function (error) {
            $scope.errArr = new Array();
            if (angular.isDefined(error)) {
                if (error.required) {
                    $.each(error.required, function (n, value) {
                        $scope.errArr.push(value.$name + "不能为空");
                    });
                }
                if (error.email) {
                    $.each(error.email, function (n, value) {
                        $scope.errArr.push(value.$name + "邮箱验证失败");
                    });
                }

                if (error.min, function (n, value) {
                    $scope.errArr.push(value.$name + "只能录入数字");
                });
                if (error.minlength) {
                    $.each(error.minlength, function (n, value) {
                        $scope.errArr.push(value.$name + "录入长度过短");
                    });

                }
                //debugger;
                if (error.maxlength) {
                    $.each(error.maxlength, function (n, value) {

                        $scope.errArr.push(value.$name + "录入长度过长");
                    });
                }
                if (error.pattern) {
                    $.each(error.pattern, function (n, value) {

                        $scope.errArr.push(value.$name + "只能录入正整数");
                    });
                }
            }

        };
        //删除
        $scope.deleteEval = function (item) {
            if (confirm("您确定要删除该条记录吗?")) {

                dc_SwRegEvalPlan.delete({ id: item.EVALPLANID }, function (data) {

                    if (data.$resolved) {
                        utility.message("资料删除成功！");

                        $scope.options.search();
                        $("#historyModal").modal("toggle");
                    }

                });

            }
        }
        //窗口关闭操作
        $scope.cancelEdit = function () {
            $("#historyModal").modal("toggle");
        };
        $scope.cancelEdit1 = function () {
            $("#editModal").modal("toggle");
        };
        $scope.PrintPreview = function (id) {
            if (angular.isDefined(id) && id != null && id > 0) {
                window.open('/DC_Report/Preview?templateName=DCS1.9社工个案评估及处遇计划表&recId=' + id + "&feeNo=" + $scope.FeeNo);
            } else {
                utility.message("未获取到个案评估记录,无法打印！");
            }

        }
        $scope.init();
    }]);

