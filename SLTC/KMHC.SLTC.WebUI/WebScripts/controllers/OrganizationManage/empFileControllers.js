/*
创建人:刘承
创建日期:2016-05-23
说明: 员工管理

修改人:郝元彦
修改日期:2016-7-02
说明:增加对登录账户的处理
*/
angular.module("sltcApp")
.controller("staffListCtrl", ['$scope', '$filter', '$location', '$state', 'utility', 'resourceFactory', function ($scope, $filter, $location, $state, utility, resourceFactory) {
    var empRes = resourceFactory.getResource("employees");
    $scope.Data = {
        Emps: [],
        Orgs: []
    };
    var qSelect = {};
    //TODO $scope.Data.IsRoot = $scope.$root.user.Role.RoleNo === "R000" ? true : false;//非超级用户，机构信息不具备删除和新增权限
    //TODO if (!$scope.Data.IsRoot) qSelect = { OrgNo: $scope.$root.user.curOrgNo };


    //初始化
    $scope.init = function () {
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: empRes,//异步请求的res
            params: { 'Data.EmpName': "" },
            success: function (data) {//请求成功时执行函数              
                $scope.Data.Emps = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        };
    };

    //删除
    $scope.StaffDelete = function (item) {
        utility.confirm("您确定删除该员工信息吗?", function (result) {
            if (result) {
                empRes.delete({ id: item.EmployeeID }, function (data) {
                    //TODO 在服务器端要加上删除员工同时删除用户的逻辑
                    $scope.Data.Emps.splice($scope.Data.Emps.indexOf(item), 1);
                    $scope.options.search();
                });
            }
        });
    }

    $scope.search = function () {
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.search();
    }


    $scope.StaffEdit = function (id) {
        $scope.$broadcast('OpenStaffEdit', id);
    }
    $scope.UserEdit = function (emp) {
        $scope.$broadcast('OpenUserEdit', emp);
    }
    $scope.$on('SavedStaff', function (e, data) {
        $scope.options.search();
    });

    $scope.$on('SavedUser', function (e, data) {
        $('#modalUserEdit').modal('hide');
    });

    $scope.init();
}])
.controller("staffEditCtrl", ['$scope', '$location', '$stateParams', '$timeout', '$filter', 'utility', 'resourceFactory', 'webUploader', function ($scope, $location, $stateParams, $timeout, $filter, utility, resourceFactory, webUploader) {
    var empRes = resourceFactory.getResource("employees");
    var orgRes = resourceFactory.getResource("orgs");
    var deptGetRes = resourceFactory.getResource('deptGetRes');

    //  $scope.Data.IsRoot = $scope.$root.user.Role.RoleNo === "R000" ? true : false;//非超级用户，机构信息不具备删除和新增权限
    //  if (!$scope.Data.IsRoot) qSelect = { OrgNo: $scope.$root.user.curOrgNo };

    $scope.InitStaff = function (id) {
        $scope.prePostData = {};
        $scope.Data = {
            Emp: {},
            User: {},
            Orgs: [],
            Roles: []
        };
        $scope.isadd = true;
        $scope.Info = {};
        var qSelect = {};
        $scope.Data.Emp.EmpState = "001";//默认员工状态为启用

        //初始化机构列表
        var gr = orgRes.get({
            "CurrentPage": 1,
            "PageSize": 100,
            "Data.OrgIds": $scope.$root.user.OrgId == -1 ? null : $scope.$root.user.OrgId
        }, function (data) {
            $scope.Data.Orgs = data.Data;
            $scope.Data.Emp.OrganizationID = $scope.$root.user.OrgId;
        });

        //初始化部门列表
        var gr = deptGetRes.get({
        }, function (data) {
            $scope.Data.Depts = data.Data;
        });

        if (id) {
            $scope.isadd = false;
            //加载员工基本信息
            empRes.get({ id: id }, function (data1) {
                var data = data1.Data;
                $scope.Data.Emp = data;
                $scope.StaffAddress = data.City + data.Address;
            });
        } else {
            $scope.isadd = true;
            $scope.GetEmpNo();
            $scope.StaffAddress = null;
        }

    }

    $scope.createBirthdate = function (IdNo) {
        if (IdNo != undefined && IdNo.length == 18) {
            $scope.Data.Emp.Birthdate = IdNo.substring(6, 10) + '-' + IdNo.substring(10, 12) + '-' + IdNo.substring(12, 14);
        } else {
            $scope.Data.Emp.Birthdate = "";
        }
    };

    $scope.GetEmpNo = function () {
        var codeRuleRes = resourceFactory.getResource("codeRules");

        codeRuleRes.get({
            "CodeKey": "EmployeeCode",
            "GenerateRule": "YearMonthDay",
            "Prefix": "E",
            "SerialNumberLength": 4,
            "OrganizationID": $scope.$root.user.OrgId
        }, function (data) {
            $scope.Data.Emp.EmpNo = data.Data;
        });
    }


    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $scope.save = function (item) {
            if (!item.Lng) {
                var myGeo = new BMap.Geocoder();
                var addressDetail = item.City + item.Address + item.HouseNumber;
                myGeo.getPoint(addressDetail, function (point) {
                    if (point) {
                        item.Lng = point.lng;
                        item.Lat = point.lat;
                    }
                    $scope.SaveItem(item);
                }, item.City);
            } else {
                $scope.SaveItem(item);
            }
        };
    });

    $scope.SaveItem = function (emp) {
        //组装员工基本信息     
        if (!objEquals($scope.prePostData, emp)) {
            angular.copy(emp, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }

        empRes.save(emp, function (data) {
            utility.message(emp.EmpName + "的基本信息保存成功！");
            $scope.$emit("SavedStaff");
            $("#btnClose").click();
        });
    }

    //通过身份证号计算出生日期
    $scope.$watch("Data.Emp.IdCard", function () {
        if ($scope.Data && $scope.Data.Emp) {
            var idcard = $scope.Data.Emp.Idcard;
            if (!idcard) return;
            if (idcard.length > 14 && !isNaN(idcard)) {
                var birth_year = idcard.substring(6, 10);
                var birth_month = idcard.substring(10, 12);
                var birth_day = idcard.substring(12, 14);
                $scope.Data.Emp.Birthdate = birth_year + "-" + birth_month + "-" + birth_day;
            } else {

            }
        }
    });

    webUploader.init('#PicturePathPicker', { category: 'EmpployeeAvatar' }, '', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
        if (data.length > 0) {
            $scope.Data.Emp.PhotoPath = data[0].SavedLocation;
            $scope.$apply();
        }
    },60);

    $scope.$on("OpenStaffEdit", function (event, id) {
        $scope.InitStaff(id);
    });

    $scope.addressInput = function (data) {
        if (data.Address) {
            $scope.StaffAddress = data.City + data.Address;
            $scope.Data.Emp.City = data.City;
            $scope.Data.Emp.Address = data.Address;
            $scope.Data.Emp.HouseNumber = data.HouseNumber;
        }
        if (data.Lng) {
            $scope.Data.Emp.Lng = data.Lng;
            $scope.Data.Emp.Lat = data.Lat;
        }
    };
}])
    //批量添加员工
.controller("staffBatchAddCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory', '$filter', function ($scope, $location, $stateParams, utility, resourceFactory, $filter) {
    var log = {
        info: function (message) {
            if (angular.isUndefined($scope.info)) {
                $scope.info = '';
            }
            $scope.info += 'Info:' + message + '\r\n';
        },
        error: function (message) {
            if (angular.isUndefined($scope.error)) {
                $scope.error = '';
            }
            $scope.error += 'ERROR:' + message + '\r\n';
        }
    }
    //初始化的时候获取机构数据，为了保证保存的时候不需要再次加载
    //批量导入默认机构是登录用户的机构 郝元彦 2016-7-6
    //$scope.init = function () {
    //    var organizationRes = resourceFactory.getResource("orgs");//机构资源

    //    organizationRes.query().$promise.then(function (data) {
    //        if (data && data.length <= 0) {
    //            $scope.error("请先添加机构.");
    //            return;
    //        }
    //        $scope.Orgs = data;
    //    });
    //}
    //$scope.init();

    //监听内容变化
    $scope.$watch("content", function () {
        var content = $scope.content;
        if (!angular.isDefined($scope.content) || $scope.content.trim() == "") {
            return;
        }
        $scope.content = $scope.content.trim().replace("[", "").replace("]", "");

        if ($scope.content.substring($scope.content.length - 1, $scope.content.length) === ",") {
            $scope.content = $scope.content.substring(0, $scope.content.length - 1);
        }
        $scope.content = "[" + $scope.content + "]";
    });

    $scope.saveStaffBatch = function () {
        if (angular.isDefined($scope.content)) {

            try {
                $scope.items = angular.fromJson($scope.content);
            } catch (ex) {
                log.error("解析失败,请输入正确的JSON格式");
                return;
            }

            var employeeRes = resourceFactory.getResource("employees");//员工资源
            employeeRes.get({ "Data.OrganizationID": $scope.$root.user.OrgId }).$promise.then(function (data1) {
                var result = data1.Data;
                if (angular.isArray($scope.items)) {
                    //解析成功
                    angular.forEach($scope.items, function (e) {

                        if (angular.isDefined(e.EmpNo)
                       && angular.isDefined(e.EmpName
                       )) {
                            //TODO 如果已经存在的不添加,对接真实服务器后不用再判断
                            if ($.grep(result, function (bp) { return bp.EmpNo == e.EmpNo && bp.EmpName == e.EmpName; }).length > 0) {
                                log.error(e.EmpNo + " " + e.EmpName + "已存在");
                            } else {
                                var employee = {
                                    EmpNo: e.EmpNo,
                                    EmpName: e.EmpName,
                                    Sex: e.Sex == "男" ? "1" : (e.Sex == "女" ? "2" : "0"),
                                    OrganizationID: $scope.$root.user.OrgId
                                };
                                employeeRes.save(employee, function () {
                                    log.info(e.EmpNo + " " + e.EmpName + " 添加成功");
                                }, function (error) {
                                    //TODO 对接真实服务器要加返回错误的处理
                                });
                            }

                        } else {
                            log.error(e.EmpName + " 信息不完整,被丢弃");
                        }
                    });
                } else {
                    log.error("录入数据非JSON数组格式,请检查输入");
                }
            });
        }
    }
}])
;
