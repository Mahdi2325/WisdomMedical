angular.module("sltcApp").controller("dcTransdisciplinaryPlanCtrl", ['$rootScope', '$scope', 'DCProfessionalteamRes', 'DCProfessionalteamHisRes', 'DCProfessionalteamExtRes', 'employeeRes', 'utility', '$state', '$filter',
    function ($rootScope, $scope, DCProfessionalteamRes, DCProfessionalteamHisRes, DCProfessionalteamExtRes, employeeRes, utility, $state, $filter) {
        $scope.FeeNo = 0;
        $scope.StrFeeNo = '';
        $scope.StrRegNo = '';

        $scope.btn_s = true;
        $scope.enterDel = false;
        $scope.showRemarks = false;
        $scope.filter = { feeNo: -1 };
        $scope.init = function () {
            $scope.residentInfo = {};
            $scope.Data = {};
            $scope.paneNum = 0;
            if ($scope.FeeNo == null || $scope.FeeNo == "") {
                $scope.btn_s = true;
            }
            employeeRes.query({}, function (response) {
                $scope.NurseAides = response;
            });

            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: DCProfessionalteamHisRes,//异步请求的res
                params: $scope.filter,
                success: function (obj) {//请求成功时执行函数
                    $scope.TransdisciplinaryHis = obj.Data;
                    if ($scope.TransdisciplinaryHis == null || $scope.TransdisciplinaryHis.length == 0) {
                        if ($scope.enterDel) { $scope.btn_s = true; }
                    }
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                },
            }

        };
        //选中住民
        $scope.residentSelected = function (resident) {
            $scope.Data = {};
            $scope.StrFeeNo = resident.ResidentNo;
            $scope.StrRegNo = resident.PersonNo;
            resident.FeeNo = utility.hashCode(resident.ResidentNo);
            resident.RegNo = utility.hashCode(resident.PersonNo);
            $scope.residentInfo = resident;
            $scope.residentInfo.Name = resident.PersonName;
            $scope.FeeNo = resident.FeeNo;
            if ($scope.FeeNo != null && $scope.FeeNo != "") {
                $scope.btn_s = false;
            }
            $scope.Search();
        }


        $scope.Search = function () {
            $scope.showRemarks = false;
            DCProfessionalteamRes.get({ feeNo: $scope.residentInfo.FeeNo }, function (obj) {
                $scope.Data = obj.Data;
                if (obj.Data == null) { //自动带入 评估资料
                    $scope.AddPlanEval();
                }
            });
        };

        $scope.AddPlanEval = function () {
            var showRemarks = true;
            DCProfessionalteamExtRes.get({ feeNo: $scope.residentInfo.FeeNo }, function (obj) {
                $scope.Data = obj.Data;
                $scope.Data.EVALDATE = $filter("date")(new Date(), "yyyy-MM-dd");
                if (angular.isDefined($scope.Data.SWEvalDate) && $scope.Data.SWEvalDate != null && $scope.Data.SWEvalDate != "") {
                    $scope.Remarks = "当前获取为最新社工" + $scope.Data.SWEvalDate;
                    if ($scope.Data.SWEvalNum != null) {
                        $scope.Remarks += ",第" + $scope.Data.SWEvalNum + "次照顾计划;"
                    }
                } else {
                    $scope.Remarks = "社工尚未创建照顾计划;"
                }
                if (angular.isDefined($scope.Data.NurEvalDate) && $scope.Data.NurEvalDate != null && $scope.Data.NurEvalDate != "") {
                    $scope.Remarks += "当前获取为最新护理" + $scope.Data.NurEvalDate;
                    if ($scope.Data.NurEvalNum != null) {
                        $scope.Remarks += ",第" + $scope.Data.NurEvalNum + "次照顾计划;"
                    }
                } else {
                    if ($scope.Data.CarePlan != null && $scope.Data.CarePlan.length > 0) {
                    } else {
                        $scope.Remarks += "护理尚未创建照顾计划;"
                    }
                }
                $scope.showRemarks = showRemarks;
                utility.message("已带入各专业最新照顾计划！");
            });
        }

        $scope.ShowHistoryList = function () {
            $scope.showRemarks = false;
            $("#transdisciplinaryHis").modal("toggle");
            if (angular.isDefined($scope.residentInfo.FeeNo)) {
                $scope.options.params.feeNo = $scope.residentInfo.FeeNo;
                $scope.options.search();
            }
        };
        //历史记录中的编辑
        $scope.EditSelectedHis = function (seqNo) {
            $("#transdisciplinaryHis").modal("toggle");
            DCProfessionalteamHisRes.get({ seqNo: seqNo, feeNo: -1 }, function (obj) {
                $scope.Data = obj.Data;
            });
        };
        $scope.Save = function () {
            if ($scope.Data == null) {
                utility.message("请先新增资料！");
            } else {
                if (angular.isDefined($scope.myForm.$error.required)) {
                    var msg = "";
                    for (var i = 0; i < $scope.myForm.$error.required.length; i++) {
                        msg = msg + $scope.myForm.$error.required[i].$name + " ";
                    }
                    msg = msg + "为必填项！";
                    utility.msgwarning(msg);
                    return;
                }

                if (angular.isDefined($scope.myForm.$error.maxlength)) {
                    var msg = "";
                    for (var i = 0; i < $scope.myForm.$error.maxlength.length; i++) {
                        msg = msg + $scope.myForm.$error.maxlength[i].$name + " ";
                    }
                    msg = msg + "超过设定长度！";
                    utility.msgwarning(msg);
                    return;
                }

                $scope.Data.FEENO = $scope.residentInfo.FeeNo;
                $scope.Data.REGNO = $scope.residentInfo.RegNo;
                DCProfessionalteamRes.save($scope.Data, function (data) {
                    $scope.Data.SEQNO = data.Data.SEQNO;
                    utility.message("储存成功");
                });
            }
        }

        //删除
        $scope.DeleteTransHis = function (seqNo) {
            if (confirm("确定删除该信息吗?")) {
                DCProfessionalteamHisRes.delete({ seqNo: seqNo }, function (data) {
                    utility.message("删除成功");
                    $scope.options.search();
                    $scope.enterDel = true;
                });
            }
        }

        $scope.init();

        $scope.PrintPreview = function () {
            if ($scope.Data != null && angular.isDefined($scope.Data.SEQNO) && $scope.Data.SEQNO != null && $scope.Data.SEQNO > 0) {
                window.open('/DC_Report/PreviewNurseCare?templateName=DCC3.0跨专业团队照顾计划表&seqNo=' + $scope.Data.SEQNO);
            } else {
                utility.message("无打印数据");
            }
        }
    }])

