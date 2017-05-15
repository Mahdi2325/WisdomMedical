var homeApp = angular.module('sltcApp', [
        'ui.router',
        'ngResource',
        'ngCookies',
        'Utility',
        'extentDirective',
        'extentFilter',
        'extentComponent',
        'ngAnimate',
        'ngSanitize',
        'textAngular',
        'w5c.validator'
])
    .factory('sessionInjector', function () {
    var sessionInjector = {
        response: function (response) {
            if (typeof (response.data.ResultCode) != "undefined") {
                switch (response.data.ResultCode) {
                    case -2:
                        location.href = '/';
                        break;
                }
            }
            return response;
        }
    };
    return sessionInjector;
})
    .config(["$httpProvider", "$provide", "w5cValidatorProvider", function ($httpProvider, $provide, w5cValidatorProvider) {
        // 注入Session拦截器
        $httpProvider.interceptors.push('sessionInjector');

        $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) { // 初始化富文本框 工具栏
            taOptions.toolbar = [
                  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
                  ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
                  ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
                  ['html', 'insertImage', 'insertLink']
            ];
            return taOptions;
        }]);

        // 全局配置
        w5cValidatorProvider.config({
            blurTrig: true,
            showError: true,
            removeError: true

        });

        w5cValidatorProvider.setRules({
            email: {
                required: "输入的邮箱地址不能为空",
                email: "输入邮箱地址格式不正确"
            },
            username: {
                required: "输入的用户名不能为空",
                pattern: "用户名必须为长度5到18的数字或字母组合",
                w5cuniquecheck: "输入用户名已经存在，请重新输入"
            },
            password: {
                required: "密码不能为空",
                minlength: "密码长度不能小于{minlength}",
                maxlength: "密码长度不能大于{maxlength}"
            },
            repeatPassword: {
                required: "重复密码不能为空",
                repeat: "两次密码输入不一致"
            },
            number: {
                required: "数字不能为空"
            },
            customizer: {
                customizer: "自定义验证数字必须大于上面的数字"
            },
            dynamicName: {
                required: "动态Name不能为空"
            },
            dynamic: {
                required: "动态元素不能为空"
            }
        });
    }])
    //.provider('securityInterceptor', ["$location", "$q", function ($location, $q) {
    //    debugger
    //    this.$get = function ($location, $q) {
    //        debugger
    //        return function (promise) {
    //            return promise.then(null, function (response) {
    //                debugger
    //                if (response.status === 403 || response.status === 401) {
    //                    $location.path('/unauthorized');
    //                }
    //                return $q.reject(response);
    //            });
    //        };
    //    };
    //}])
    .run(['$rootScope', function ($rootScope) {
        $rootScope.curUser = { OrganizationID: 1 };
    }])
  .constant("twResourceBase", "http://localhost:8090/dc/") //台湾评估URL http://120.25.225.5:8667/
  .constant("authenticateUrl", "http://120.25.225.5:5500/users/login")
  .constant("currentUserUrl", "http://120.25.225.5:5500/users/me")
  .constant("logoutUrl", "http://120.25.225.5:5500/users/logout")
  .constant("resourceBase", "http://120.25.225.5:5500/")//192.168.10.32:6500
  .constant("hltImgBase", "http://120.25.225.5:8060/")//http://120.25.84.114:8126/  //http://120.25.225.5:8088/
  .constant("watchCheckBase", "http://120.25.84.114:8880/")
  .factory("getRequestUrl", ['resourceBase', function (resourceBase) { //设置请求路径
      var getUrl = function (url) {
          return resourceBase + url;
      }
      return getUrl;
  }])
  .factory("getWatchCheckUrl", ['watchCheckBase', function (watchCheckBase) { //设置请求路径 接手表量测数据zhangkai
      var getUrl = function (url) {
          return watchCheckBase + url;
      }
      return getUrl;
  }])
  .factory("commonRes", ['$resource', function ($resource) {
      return $resource("api/Common/:id", { id: "@id" });
  }])
  .factory("adminHandoversRes", ['$resource', function ($resource) {
      return $resource('api/AssignTask/:id', { id: '@id' });
  }])
  .factory("roleModuleRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {
      return $resource(getRequestUrl("module/:id"), { id: "@id" });
  }])
  .factory("functionRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {
      return $resource(getRequestUrl("function/:id"), { id: "@id" });
  }])
  .factory("personInfoRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {
      return $resource(getRequestUrl("persons/:id"), { id: "@id" });
  }])

  //=================================机构管理 start=======================================
  .factory("groupRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { // 集团管理
      return $resource(getRequestUrl('group/:id'), { id: '@id' });
  }])
  .factory("orgModuleRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { // 集团管理
      return $resource(getRequestUrl('orgmodule/:id'), { id: '@id' });
  }])

  .factory("orgRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {  // 机构管理
      return $resource(getRequestUrl('organizations/:id'), { id: "@id" });
  }])
     .factory("orgModuleRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { // 机构菜单
         return $resource(getRequestUrl("orgmodule/:id"), { id: "@id" });
     }])
    .factory("floorRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { // 楼宇管理
        return $resource(getRequestUrl("floor/:id"), { id: "@id" });
    }])
    .factory("roomRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    // 房间管理
        return $resource(getRequestUrl("room/:id"), { id: "@id" });
    }])
    .factory("bedRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {     // 床位管理
        return $resource(getRequestUrl("bed/:id"), { id: "@id" });
    }])
    .factory("codeFileRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    // 字典表管理
        return $resource('api/dictionary/:id', { id: '@id' });
        //return $resource(getRequestUrl("dictionary/:id"), { id: "@id" });
    }])
        .factory("dictionaryItemRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    // 字典表管理
            return $resource('api/DictionaryItem/:id', { id: '@id' });
            //return $resource(getRequestUrl("dictionary/:id"), { id: "@id" });
        }])
    .factory("deptRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {  //部门管理
        return $resource(getRequestUrl('department/:id'), { id: '@id' });
    }])
    .factory("employeeRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    //员工管理
        return $resource(getRequestUrl("employee/:id"), { id: "@id" });
    }])
     .factory("billSettingRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    //账单设定
         return $resource(getRequestUrl("billsetting/:id"), { id: "@id" });
     }])
     .factory("areaRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    //区域管理
         return $resource(getRequestUrl("area/:id"), { id: "@id" });
     }])

    //=================================机构管理 end=======================================


    //=================================团体活动 start=======================================
    .factory("groupActivityRes_old", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //团体活动
        //return $resource(resourceBase + 'group-activity/:id', { id: '@id' });
        return $resource(getRequestUrl('activity/:id'), { id: '@id' });
    }])
    .factory("groupActivityRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //团体活动
        //return $resource(resourceBase + 'group-activity/:id', { id: '@id' });
        return $resource(getRequestUrl('activity-new/:id'), { id: '@id' });
    }])
    .factory("evalSheetRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //团体活动
        //return $resource(resourceBase + 'group-activity/:id', { id: '@id' });
        return $resource(getRequestUrl('activityassessment/:id'), { id: '@id' });
    }])
    //=================================团体活动 end=======================================

    //=================================任务管理 start=======================================
    .factory("taskRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //任务
        //return $resource(resourceBase + 'group-activity/:id', { id: '@id' });
        return $resource(getRequestUrl('task/:id'), { id: '@id' });
    }])



    //=================================任务管理 end=======================================


//=================================费用管理 start=======================================
 .factory("chargeItemRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //收费项目
     return $resource(getRequestUrl("chargeitem/:id"), { id: "@id" });
 }])
 .factory("chargeGroupRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //收费组合
     return $resource(getRequestUrl("chargegroup/:id"), { id: "@id" });
 }])
 .factory("serviceGroupRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //服务套餐
     return $resource(getRequestUrl("servicegroup/:id"), { id: "@id" });
 }])

.factory("chargeGroupDetailRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //收费组合
    return $resource(getRequestUrl("groupitems/:hiddenId"), { hiddenId: "@hiddenId" });
}])
.factory("fixedChargeRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //固定费用设定
    return $resource(getRequestUrl("fixedcost/:id"), { id: "@id" });
}])
.factory("fixedChargeChargeGroupRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //固定费用设定
    return $resource(getRequestUrl("fixedcharges/:id"), { id: "@id" });
}])
.factory("chargeDetailRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {  //费用录入
    return $resource(getRequestUrl("feedetail/:id"), { id: "@id" });
}])
 .factory("prePaymentRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //預付款
     return $resource(getRequestUrl("deposit/:id"), { id: "@id" });
 }])
.factory("billRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {
    return $resource(getRequestUrl("bill/:id"), { id: "@id" });

}])
.factory("BillPayRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    //缴费记录
    return $resource(getRequestUrl("payment/:id"), { id: "@id" });
}])
//=================================费用管理 end=======================================



//================================服务管理start=======================================
.factory("servicegroupitemsRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    //服务组项目
    return $resource(getRequestUrl("servicegroupitems/:id"), { id: "@id" });
}])
.factory("serviceItemRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    //服务项目
    return $resource(getRequestUrl("serviceitem/:id"), { id: "@id" });
}])
.factory("serviceOrderRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    //服务订单
    return $resource(getRequestUrl("serviceorder/:id"), { id: "@id" });
}])
 .factory("serviceItemCategoryRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    //服务项目分类
     return $resource(getRequestUrl("serviceitemcategory/:id"), { id: "@id" });
 }])
//================================服务管理end=========================================

//=====================================   入住管理 Start  =====================================


     .factory("appointmentRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //预约登记
         return $resource(getRequestUrl('appointment/:id'), { id: '@id' });
     }])

    .factory("residentRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //住民信息
        return $resource(getRequestUrl('resident/:id'), { id: '@id' });
    }])

    .factory("visitRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //访探记录
        return $resource(getRequestUrl('residentvisit/:id'), { id: '@id' });
    }])

    .factory("transferRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //访探记录
        return $resource(getRequestUrl('residenttransfer/:id'), { id: '@id' });
    }])

    .factory("personRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //老人基本信息
        return $resource(getRequestUrl("persons/:id"), { id: "@id" });
    }])



//=====================================   入住管理 End  =======================================




//=====================================   用户管理 Start  =====================================

    .factory("userRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //访探记录
        return $resource(getRequestUrl('users/:id'), { id: '@id' });
    }])

    .factory("roleRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //角色管理
        return $resource(getRequestUrl('roles/:id'), { id: '@id' });
    }])
    .factory("funcRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //功能点管理
        return $resource(getRequestUrl('function/:id'), { id: '@id' });
    }])

//=====================================   用户管理 End  =======================================

//=====================================   连接健康档案 Start  =====================================

    .factory("htlUserRes", ['$resource', function ($resource) { //认证用户
        return $resource('/api/hlthrecord/Person/:idno', { id: "@idno" });
    }])

    .factory("htlExamRes", ['$resource', function ($resource) { //获取体检结果
        return $resource('/api/hlthrecord/ExamResult/:id', { id: '@id' });
    }])

     .factory("htlExamRecordRes", ['$resource', function ($resource) { //获取所有体检
         return $resource('/api/hlthrecord/ExamRecord/:id', { id: '@id' });
     }])
     .factory("caseHtlExamRecordRes", ['$resource', function ($resource) { //获取所有体检
         return $resource('/api/hlthrecord/ExamRecord_Case/:id', { id: '@id' });
     }])
    .factory("caseHtlExamRes", ['$resource', function ($resource) { //获取体检结果
        return $resource('/api/hlthrecord/ExamResult_Case/:id', { id: '@id' });
    }])
//=====================================   连接健康档案 End  =======================================

//=====================================   连接手表量测数据 Start  =====================================
    .factory("bsRecordRes", ['$resource', 'getWatchCheckUrl', function ($resource, getWatchCheckUrl) { //血糖
        return $resource(getWatchCheckUrl('kmhc-modem-restful/services/member/bs/:imei'), { id: "@imei" });
    }])
    .factory("bpRecordRes", ['$resource', 'getWatchCheckUrl', function ($resource, getWatchCheckUrl) { //血压
        return $resource(getWatchCheckUrl('kmhc-modem-restful/services/member/bp/:imei'), { id: '@imei' });
    }])
    .factory("hrRecordRes", ['$resource', 'getWatchCheckUrl', function ($resource, getWatchCheckUrl) { //心率
        return $resource(getWatchCheckUrl('kmhc-modem-restful/services/member/hr/:imei'), { id: '@imei' });
    }])
    .factory("boRecordRes", ['$resource', 'getWatchCheckUrl', function ($resource, getWatchCheckUrl) { //血氧
        return $resource(getWatchCheckUrl('kmhc-modem-restful/services/member/bo/:imei'), { id: '@imei' });
    }])
    .factory("setpRecordRes", ['$resource', 'getWatchCheckUrl', function ($resource, getWatchCheckUrl) { //计步值
        return $resource(getWatchCheckUrl('kmhc-modem-restful/services/member/step/:imei'), { id: '@imei' });
    }])
    .factory("watchRecordRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //手表演示
        return $resource(getRequestUrl('watchrecord/:id'), { id: '@id' });
    }])
//=====================================   连接手表量测数据 End  =======================================

//=====================================   评估管理 Start  =====================================

.factory("assessmentItemRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //评估项目
    return $resource(getRequestUrl('assessmentitem/:id'), { id: '@id' });
}])
.factory("assessmentTemplateRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //评估模板
    return $resource(getRequestUrl('assessmenttemplate/:id'), { id: '@id' });
}])

    .factory('evalsheetRes', ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + "api/nursing/:id", { id: "@id" });
    }])
    .factory('evaluationRes', ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + "api/evaluation/:id", { id: "@id" });
    }])
    .factory('evaluationHisRes', ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + "api/evaluationHis/:id", { id: "@id" });
    }])
 //.factory("dc_PersonBasicRes", ['$resource','twResourceBase',function ($resource, twResourceBase) { //
 //    return $resource(twResourceBase+'api/PersonBasic/:id', { id: '@id' });
 //}])
 .factory("dc_SwRegEvalPlan", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //社工个案评估及处遇计划表
     return $resource(twResourceBase + 'api/SwRegEvalPlan/:id', { id: '@id' });
 }])

 .factory("dc_TaskgoalsstrategyRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //社工个案评估及处遇计划表
     return $resource(twResourceBase + 'api/Taskgoalsstrategy/:id', { id: '@id' });
 }])
 .factory("dc_RegLifeQualityEvalRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //家庭照顧者生活品質評估問卷 　
     return $resource(twResourceBase + 'api/RegLifeQualityEval/:id', { id: '@id' });
 }])
 .factory("dc_RegQuestionEvalRecRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //受託長輩適應程度評估表 　
     return $resource(twResourceBase + 'api/RegQuestionEvalRec/:id', { id: '@id' });
 }])
 .factory("dc_RegQuestionEvalRecRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //受託長輩適應程度評估表 　
     return $resource(twResourceBase + 'api/RegQuestionEvalRec/:id', { id: '@id' });
 }])
    //需求护理评估
    .factory("DCNurseRequirementEvalRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
        return $resource(twResourceBase + 'api/DCNurseRequirementEval/:id', { id: '@id' });
    }])
    .factory('DCevalsheetRes', ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + "api/nursingSheet/:id", { id: "@id" });
    }])
    .factory("DCNursePlanRes2", ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + 'api/DC_REGCPL2/:id', { id: '@id' });
    }])
    .factory("DCNursePlanRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + 'api/DC_REGCPL/:id', { id: '@id' });
    }])
   .factory("DCNsCplGoalRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
       return $resource(twResourceBase + 'api/DC_NSCPLGOAL/:id', { id: '@id' });
   }])
   .factory("DCNsCplActivityRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
       return $resource(twResourceBase + 'api/DC_NSCPLACTIVITY/:id', { id: '@id' });
   }])
   .factory("DCAssessValueRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
       return $resource(twResourceBase + 'api/DC_ASSESSVALUE/:id', { id: '@id' });
   }])
 .factory("DCNurseCareLifeServiceRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
     return $resource(twResourceBase + 'api/NurseCareLifeService/:id', { id: '@id' });
 }])
   .factory("DCNurseCareLifeList", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
       return $resource(twResourceBase + 'api/DCNurseCareLifeList/:id', { id: '@id' });
   }])
    .factory("DCNurseCareLifeEdit", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
        return $resource(twResourceBase + 'api/DCNurseCareLifeEdit/:id', { id: '@id' });
    }])
 .factory("DCDayLifeCareRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
     return $resource(twResourceBase + 'api/DCDayLifeCareRes/:id', { id: '@id' });
 }])
  .factory("DCDayLifeCareList", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
      return $resource(twResourceBase + 'api/DCDayLifeCarelist/:id', { id: '@id' });
  }])
  .factory("DCDayLifeCareListA", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
      return $resource(twResourceBase + 'api/DCDayLifeCarelistA/:id', { id: '@id' });
  }])
  .factory("DCProfessionalteamRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
      return $resource(twResourceBase + 'api/DCProfessionalteamList/:id', { id: '@id' });
  }])
    .factory("DCProfessionalteamHisRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + 'api/DCProfessionalteamHis/:id', { id: '@id' });
    }])
     .factory("DCProfessionalteamExtRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) { //
         return $resource(twResourceBase + 'api/DCProfessionalteamExt/:id', { id: '@id' });
     }])
    .factory("dc_AssignJobsRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + 'api/AssignJobs/:id', { id: '@id' });
    }])
    .factory("dc_AssignTaskRes", ['$resource', 'twResourceBase', function ($resource, twResourceBase) {
        return $resource(twResourceBase + 'api/DC_AssignTask/:id', { id: '@id' });
    }])
    .factory("CasesTimelineRes", 'twResourceBase', ['$resource', function ($resource, twResourceBase) {
        return $resource(twResourceBase + 'api/casesTimeline/:id', { id: '@id' });
    }])

    .factory("paymentRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //缴费作业
        return $resource(getRequestUrl("payment/:id"), { id: "@id" });
    }])

    .factory("refundRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //退费作业
        return $resource(getRequestUrl("refund/:id"), { id: "@id" });
    }])
    .factory("dayReportTempManageRes", ['$resource', function ($resource) {
        return $resource("api/DayReportTempManage/:id", { id: "@id" });
    }])
    .factory("monthReportTempManageRes", ['$resource', function ($resource) {
        return $resource("api/MonthReportTempManage/:id", { id: "@id" });
    }])

/*
.factory("userService", ['$q', '$cacheFactory', 'userRes', 'roleRes', 'roleModuleRes', 'orgModuleRes', 'employeeRes', 'deptRes', 'orgRes', function ($q, $cacheFactory, userRes, roleRes, roleModuleRes, orgModuleRes, employeeRes, deptRes, orgRes) { //当前登录用户信息
    //检查是否登录
    var checkLogin = function () {
        if (!window.currentUser || !window.currentUser.UserId || window.currentUser.UserId === "") {
            window.location.replace("/home/login");
        }
    }

    //获取当前用户数据
    var getUserInfo = function () {
        checkLogin();
        var deferred = $q.defer();
        userRes.get({ id: window.currentUser.UserId }, function (user) {
            if (user) {
                deferred.resolve(user);
            } else {
                window.location.replace("/home/login");//UserId无效  跳转登录页面
            }
        });
        return deferred.promise;
    }

    //获取当前员工信息
    var getUserEmp = function () {
        var deferred = $q.defer();
        $q.when(getUserInfo()).then(function (user) {
            employeeRes.query({}, function (emp) {
                var employee;
                $.each(emp, function () {
                    if (this.EmpNo === user.EmpNo) {
                        employee = this;
                        return false;
                    }
                });
                deferred.resolve(employee);
            });
        });
        return deferred.promise;
    }

    //获取当前员工所属部门
    var getUserDepart = function () {
        var deferred = $q.defer();
        $q.when(getUserEmp()).then(function (emp) {
            if (emp) {
                deptRes.query({}, function (dps) {
                    var dept;
                    $.each(dps, function () {
                        if (this.DepartNo === emp.DepartNo) {
                            dept = this;
                            return false;
                        }
                    });
                    deferred.resolve(dept);
                });
            }
        });
        return deferred.promise;
    }

    //获取当前员工所属机构
    var getUserOrg = function () {
        var deferred = $q.defer();
        $q.when(getUserEmp()).then(function (emp) {
            if (emp) {
                orgRes.query({}, function (orgArr) {
                    var org;
                    $.each(orgArr, function () {
                        if (this.OrgNo === emp.OrgNo) {
                            org = this;
                            return false;
                        }
                    });
                    deferred.resolve(org);
                });
            }
        });
        return deferred.promise;
    }

    //获取用户菜单
    var getUserMenus = function () {
        var deferred = $q.defer();
        $q.when(getUserInfo()).then(function (user) {
            roleRes.query({}, function (roles) {
                if (roles && roles.length > 0) {
                    var arr = [];
                    $.each(roles, function (i, item) {
                        if (user.Roles.indexOf(this.RoleNo) >= 0) {
                            //$.each(this.Menus, function () {
                            //    arr.push(this.toString());
                            //});
                            arr = arr.concat(item.MenuItems);
                        }
                    });
                    //if (arr.length > 0) {
                    //    orgModuleRes.query({}, function (orgmodule) {
                    //        if (orgmodule && orgmodule.length > 0) {
                    //            var filter = new Array();
                    //            $.each(orgmodule, function () {
                    //                if (arr.indexOf(this.ModuleNo) >= 0) {
                    //                    filter[this.ModuleNo] = this;
                    //                }
                    //            });
                    //            roleModuleRes.query(function(rmr) {
                    //                var menus = [];
                    //                $.each(rmr, function () {
                    //                    var module = filter[this.ModuleId];
                    //                    if (module) {
                    //                        if (module.Alias && module.Alias !== "") {
                    //                            this.ModuleName = module.Alias;
                    //                        }
                    //                        this.Sort = Number(module.Sort);
                    //                        menus.push(this);
                    //                    }
                    //                });
                    //                deferred.resolve(menus);
                    //            });
                    //        }
                    //    });
                    //}
                    deferred.resolve(arr);
                }
            });
        });
        return deferred.promise;
    }

    return {
        currentUser: {
            UserInfo: $q.when(getUserInfo()),
            UserEmp: $q.when(getUserEmp()),
            //UserDepart: $q.when(getUserDepart()),
            UserOrg: $q.when(getUserOrg()),
            UserMenus: $q.when(getUserMenus())
        }
    };
}])
*/
//=====================================   评估管理 End  =======================================

;

