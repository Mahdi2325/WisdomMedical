
/*

        创建人: 李林玉
        创建日期:2016-05-18
        说明: 入住登记

        001	E00.013	護理
        002	E00.013	社工
        003	E00.013	營養
        004	E00.013	職能治療
        005	E00.013	物理治療
        006	E00.013	醫師
        007	E00.013	心理
        008	E00.013	共同
        009	E00.013	其他
*/
angular.module("sltcApp")
.controller('regResidentCtrl', ['$scope', '$state', 'utility', 'cloudAdminUi', '$filter', 'resourceFactory',function ($scope, $state, utility, cloudAdminUi, $filter, resourceFactory) {
            var residentRes = resourceFactory.getResource("residentRes");
            var employeeRes = resourceFactory.getResource("employeeRes");
            var serviceGroupRes = resourceFactory.getResource("serviceGroupRes");
            var bedRes = resourceFactory.getResource("bedRes");
            var fixedChargeRes = resourceFactory.getResource("fixedChargeRes");
            var serviceItemRes = resourceFactory.getResource("serviceItemRes");
            var personRes = resourceFactory.getResource("personRes");

            $scope.init = function () {
                $(".uniform").uniform();
                cloudAdminUi.initFormWizard();
                //cloudAdminUi.initDatepicker();
                $scope.person = {};
                $scope.resident = {};
                $scope.resident.CheckinDate = $filter("date")(new Date(), "yyyy-MM-dd");
                $scope.resident.ResidentType = 1;
                $scope.selectResident = {};
                $scope.sameIdPerson = {};
                $scope.IsExistsName = false;
                $scope.choosePerson = false;
                $scope.WaitAsync = false;
                serviceGroupRes.query(function (data) {
                    $scope.chargeGroups = data;
                });
                employeeRes.query({}, function (response) {
                    var dest = getEmpMemberByGroup(response);
                    if (!isEmpty(dest)) {
                        for (var i = 0; i < dest.length; i++) {
                            if (dest[i].Position == "6122") {
                                $scope.CarerData = dest[i].data;
                            }
                        }
                    }
                });

            }

            $scope.init();


            $scope.ResidentSelected = function (item, IsExistsName) {
                if (!isEmpty(item)) {
                    $scope.person.PersonNo = item.PersonNo;
                    $scope.person.Sex = item.Sex;
                    $scope.person.Idcard = item.Idcard;
                    $scope.person.Birthdate = item.Birthdate;
                    $scope.person.Name = item.Name;
                    $scope.selectResident = item;
                }
                $scope.IsExistsName = IsExistsName;
            }

            $scope.savePerson = function () {
                var name = $('#residentName').val();
                $scope.person.Name = name;
                //if ($scope.IpdFlag == "I" || $scope.IpdFlag == "N") {
                //    utility.message("該個案已辦理入院,請不要重複入院！");
                //    $state.go('regResident', null, {
                //        reload: true
                //    });
                //    return false;
                //} else if ($scope.IpdFlag == "O" || $scope.IpdFlag == "D") {

                //    utility.confirm("個案信息存在結案記錄,請確定是否重新開案?", function (result) {
                //        if (!result) {
                //            $scope.person = {};
                //            return false;
                //        }
                //    });

                //} else {
                //    if ($scope.IsExistsName) {

                //        utility.confirm("個案姓名重複,請確認是否真的要輸入此筆記錄?", function (result) {
                //            if (!result) {
                //                $state.go('regResident', null, {
                //                    reload: true
                //                });
                //                return false;
                //            }
                //        })
                //        return false;
                //    }

                //    if (!isEmpty($scope.sameIdPerson.IdNo) && isEmpty($scope.IpdFlag)) {
                //        utility.message("已入院院民中存在相同身份證編號,不能重複入院,請核對!");
                //        return false;
                //    }
                //}
            };

            $scope.$watch("person.Idcard", function () {
                personRes.query({}, function (data) {
                    var filtered;
                    angular.forEach(data, function (item) {
                        if (item.Idcard === $scope.person.Idcard) {
                            filtered = item;
                        }
                    });
                    if (filtered) {
                        residentRes.query({}, function (arr) {
                            if (arr && arr.length > 0) {
                                for (var i = 0; i < arr.length; i++) {
                                    if (arr[i].PersonNo === filtered.PersonNo && arr[i].Status === "I") {
                                        utility.message("该档案已办理入院,请不要重复入院！");
                                        $scope.WaitAsync = true;
                                        return false;
                                    }
                                }
                            };

                        });

                    } else {
                        $scope.sameIdPerson = {};
                    }
                    $scope.WaitAsync = false;
                });
            });


            $scope.saveIpdreg = function () {
                //if ($scope.choosePerson) {
                //    residentRes.get({ regNo: $scope.person.RegNo, type: 0 }, function (data) {                   
                //        if (data.Data) {
                //              utility.message("入住信息保存失败！该住民已经登记了！");
                //              return false;
                //          } else {
                //             return $scope.saveResident();
                //          }
                //    });
                //} 
                return $scope.saveResident();

            };

            $scope.saveResident = function () {
                if ($scope.resident.ResidentType === 2) {
                    $scope.resident.BedData = null;
                }
                $scope.resident.ResidentNo = $scope.person.Idcard.substr(0, 16), //入住编号 先用身份证号码 (depoyd查询最大长度为16)
                $scope.resident.PersonNo = $scope.person.PersonNo;
                $scope.resident.Status = "I";
                $scope.resident.PersonName = $scope.person.Name;
                $scope.resident.Birthdate = $scope.person.Birthdate;
                $scope.resident.Sex = $scope.person.Sex;
                residentRes.save($scope.resident, function (data) {
                    if ($scope.resident.BedData) {
                        $scope.resident.BedData.BedState = 'N';
                        bedRes.save($scope.resident.BedData, function () {

                        });
                    }
                    if ($scope.resident.ServicePlan && $scope.resident.ServicePlan !== '') {
                        serviceGroupRes.get({ id: $scope.resident.ServicePlan }, function (data1) {
                            $.each(data1.GroupItems, function (i, data) {
                                //服务项目编号
                                var SINo = data.SINo;
                                //通过服务项目编号去找服务项目
                                serviceItemRes.query(function (serviceitems) {
                                    angular.forEach(serviceitems, function (data, index, array) {
                                        if (data.SINo == SINo) {                                         
                                            var chargeItems = data.ChargeItem;
                                            angular.forEach(chargeItems, function (chargeItem, index, array) {
                                                chargeItem.ResidentNo = $scope.curResident.ResidentNo;
                                                chargeItem.Status = 1;
                                                fixedChargeRes.save(chargeItem, function (d) {
                                                    console.log("保存成功");
                                                });
                                            });
                                        }
                                    });

                                });
                            });
                        });

                    }
                    utility.message("入住信息保存成功！");
                    $state.go('ServiceResidentList');
                });

            }


            $scope.KeyPress = function ($event) {
                if (window.event && window.event.keyCode == 13) {
                    window.event.returnValue = false;
                }
            }


            $scope.choosePerson = function () {
                $('#modalPerson').modal({
                    backdrop: true,
                    keyboard: true,
                    show: true
                });
            };

            $scope.$on("choosePerson", function (event, data) {
                $scope.choosePerson = true;
                $scope.person = data;
            });
            $scope.chooseBed = function () {
                $('#modalBed').modal({
                    backdrop: true,
                    keyboard: true,
                    show: true
                });
            };
            $scope.$on("chooseBed", function (event, data) {
                if (data.BedState == "E") {
                    $scope.resident.RoomNo = data.RoomNo;
                    $scope.resident.BedNo = data.BedNo;
                    $scope.resident.BedName = data.BedName;
                    $scope.resident.Category = data.Category;
                    $scope.resident.BedType = data.BedType;
                    $scope.resident.BedData = data;
                    $('#modalBed').modal('hide');
                }
            });
            $scope.chooseFile = function () {
                $("#Contract").trigger("click");
            };

}])
.controller("serviceResidentListCtrl", ['$scope', '$http', '$state', '$location', 'resourceFactory',function ($scope, $http, $state, $location, resourceFactory) {
            var residentRes = resourceFactory.getResource("residentRes");
            $scope.residents = [];
            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: residentRes,//异步请求的res
                params: { 'Data.PersonName': "", "Data.OrganizationID": $scope.$root.user.OrgId },
                success: function (data) {//请求成功时执行函数
                    $scope.residents = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 25
                },
                selectRows: {
                    opt: [{ Value: 25, Text: 25 }, { Value: 50, Text: 50 }, { Value: 100, Text: 100 }]
                }
            }

            // 跳转到个人档案信息界面
            $scope.goPersonInfo = function (item) {
                $state.go("PersonProfile.BasicInfo", { id: item.PersonID });
                return false;
            }


}])
.controller('regResidentEditCtrl', ['$scope', '$state', 'utility', '$stateParams', 'cloudAdminUi', '$filter', 'resourceFactory',function ($scope, $state, utility, $stateParams, cloudAdminUi, $filter, resourceFactory) {

            var residentRes = resourceFactory.getResource("residentRes");
            var employeeRes = resourceFactory.getResource("employeeRes");
            var serviceGroupRes = resourceFactory.getResource("serviceGroupRes");
            var bedRes = resourceFactory.getResource("bedRes");
            var fixedChargeRes = resourceFactory.getResource("fixedChargeRes");
            var serviceItemRes = resourceFactory.getResource("serviceItemRes");
            var orgRes = resourceFactory.getResource("orgs");
            var areaRes = resourceFactory.getResource("area");
            var personRes = resourceFactory.getResource("personRes");

            $scope.resident = {};
            if ($stateParams.id) {
                residentRes.get({ id: $stateParams.id }, function (data) {
                    if (data) {
                        $scope.resident = data;
                        orgRes.query({
                        }, function (data) {
                            $scope.Orgs = data;
                        });

                        areaRes.query({
                        }, function (data) {
                            $scope.Areas = data;
                        });
                        bedRes.query({}, function (beds) {
                            if (beds && beds.length > 0) {
                                $.each(beds, function () {
                                    if (this.BedNo === data.BedNo) {
                                        $scope.resident.RoomNo = this.RoomNo;
                                        $scope.resident.BedNo = this.BedNo;
                                        $scope.resident.BedName = this.BedName;
                                        $scope.resident.Category = this.Category;
                                        $scope.resident.BedType = this.BedType;
                                        $scope.resident.BedData = this;
                                        $scope.oldBed = this;
                                    }
                                });
                            }
                        });
                        personRes.query({}, function (pres) {
                            var filtered;
                            $.each(pres, function () {
                                if (this.PersonNo === data.PersonNo) {
                                    filtered = this;
                                }
                            });
                            $scope.person = filtered;
                        });
                    } else {
                        utility.message("入住Id(" + $stateParams.id + ")无效!");
                        $state.go('regResident');
                    }
                });
            } else {
                $state.go('regResident');
            }
            $scope.init = function () {

                serviceGroupRes.query(function (data) {
                    $scope.chargeGroups = data;
                });
                employeeRes.query({}, function (response) {
                    var dest = getEmpMemberByGroup(response);
                    if (!isEmpty(dest)) {
                        for (var i = 0; i < dest.length; i++) {
                            if (dest[i].Position == "6122") {
                                $scope.CarerData = dest[i].data;
                            }
                        }
                    }
                });

            }

            $scope.init();


            $scope.saveResident = function () {
                if ($scope.resident.ResidentType === 2) {
                    $scope.resident.BedData = null;
                }
                residentRes.save($scope.resident, function (data) {
                    if ($scope.resident.BedData) {
                        $scope.resident.BedData.BedState = 'N';
                        bedRes.save($scope.resident.BedData, function () {
                            $scope.oldBed.BedState = 'E';
                            bedRes.save($scope.oldBed, function () {

                            });
                        });
                    }
                    utility.message("入住信息保存成功！");
                    $state.go('ServiceResidentList');
                });

            }

            $scope.chooseBed = function () {
                $('#modalBed').modal({
                    backdrop: true,
                    keyboard: true,
                    show: true
                });
            };
            $scope.$on("chooseBed", function (event, data) {
                if (data.BedState == "E") {
                    $scope.resident.RoomNo = data.RoomNo;
                    $scope.resident.BedNo = data.BedNo;
                    $scope.resident.BedName = data.BedName;
                    $scope.resident.Category = data.Category;
                    $scope.resident.BedType = data.BedType;
                    $scope.resident.BedData = data;
                    $('#modalBed').modal('hide');
                }
            });

            $scope.chooseFile = function () {
                $("#Contract").trigger("click");
            };
}])
.controller("LeaveNursingCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {

        var residentRes = resourceFactory.getResource("residentRes");
        var employeeRes = resourceFactory.getResource("employeeRes");
        var chargeGroupRes = resourceFactory.getResource("chargeGroupRes");
        var bedRes = resourceFactory.getResource("bedRes");

        $scope.Data = {};

        $scope.currentItem = {};

        $scope.buttonShow = false;

        //選中住民
        $scope.residentSelected = function (resident) {
            //獲取當前住民信息
            residentRes.get({ id: resident.id }, function (data) {
                $scope.currentItem = data;
                if (data.Status === "I") {
                    $scope.buttonShow = true;
                } else {
                    $scope.buttonShow = false;
                }
                chargeGroupRes.get({ id: data.ServicePlan }, function (cgr) {
                    $scope.chargeGroups = cgr;
                });
                bedRes.query({}, function (bed) {
                    var filtered;
                    angular.forEach(bed, function (item) {
                        if (item.BedNo === data.BedNo) {
                            filtered = item;
                        }
                    });
                    $scope.Bed = filtered;
                });
                employeeRes.query({}, function (emp) {
                    var filtered;
                    angular.forEach(emp, function (item) {
                        if (item.Carer === data.EmpNo) {
                            filtered = item;
                        }
                    });
                    $scope.emp = filtered;
                });
            });

        }


        $scope.saveLeaveNursing = function (item) {
            item.Status = "D";
            residentRes.save(item, function (data) {
                $scope.Bed.BedState = "E";
                bedRes.save($scope.Bed, function () {
                    $scope.buttonShow = false;
                    utility.message($scope.item.PersonName + "退住院成功！");
                });
            });
        }

    }
]);

function residentSelectFile(id) {
    var scope = angular.element(id).scope();
    if (scope && scope.resident) {
        scope.resident.Contract = $("#Contract").val();
        scope.$apply();
    }
};

function getEmpMemberByGroup(arr) {
    var map = {}, dest = [];
    for (var i = 0; i < arr.length; i++) {
        var ai = arr[i];
        if (!map[ai.Position]) {
            dest.push({ Position: ai.Position, data: [ai] });
            map[ai.Position] = ai;
        } else {
            for (var j = 0; j < dest.length; j++)
            { var dj = dest[j]; if (dj.Position == ai.Position) { dj.data.push(ai); break; } }
        }
    }
    return dest;
}

function isEmpty(n) { return n == null || n == "" || n == "undefined" || n == "null" ? !0 : n == "" ? !0 : !1 }