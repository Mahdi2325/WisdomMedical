var app = angular.module("sltcApp");

/*
RESTFul API资源工厂
所有需要注册的resource放在这里
controller只需要依赖这个resourceFactory就行了
*/
app.factory("resourceFactory", ['$http', '$resource', '$filter', 'resourceBase', function ($http, $resource, $filter, resourceBase) {

    //{ Rid: 'usersTest', Url: 'api/User/:id', actions: { "login": { method: 'POST' } } },//API 方法扩展

    //WebAPI列表
    var apis = [
        { Rid: 'codeRules', Url: 'CodeRule/:id' },
        { Rid: 'functions', Url: 'function/:id' },
        { Rid: 'dictionarys', Url: 'dictionary/:id' },
        { Rid: 'batchDictionarys', Url: 'dictionary/batch/:id' },
        { Rid: 'employees', Url: 'employee/:id', actions: { "GetUserByEmployeeID": { method: 'GET', url: "GetUserByEmployeeID" } } },

//=====================================   用户管理 Start  =====================================

        { Rid: 'roles', Url: 'Role/:id', actions: { "QueryRoles": { method: 'GET', url: "QueryRoles" } } },//角色
        { Rid: 'users', Url: 'user/:id' },//用户

        { Rid: 'contractRes', Url: 'contract/:id' },//合同
        { Rid: 'deviceRes', Url: 'device/:id' },//设备
        { Rid: 'familyRes', Url: 'family/:id' },//设备
        { Rid: 'habitRes', Url: 'habit/:id' },//设备
        { Rid: 'priorityRemarkRes', Url: 'priorityRemark/:id' },//设备
        { Rid: 'callInfoRes', Url: 'callInfo/:id' },//设备
        { Rid: 'addressRes', Url: 'address/:id' },//设备

//=====================================   用户管理 End  =======================================

//=====================================   入住管理 Start  =====================================

        {
            Rid: 'residentRes', Url: 'resident/:id', actions: {
                "GetServicePlan": { method: 'GET', url: "GetServicePlan" },
                "SetServicePlan": { method: 'POST', url: "SetServicePlan" },
                "GetSosData": { method: 'GET', url: "GetSosData/:id" },
                "GetResidentInfo": { method: 'GET', url: "GetResidentInfo" }
            }
        },//住民信息
        { Rid: 'residentServicePlanRes', Url: 'residentserviceplan/:id' },//入住服务套餐配置
        { Rid: 'residentGetSosData', Url: 'resident/GetSosData/:id' },
        { Rid: 'appointmentRes', Url: 'appointment/:id' },//预约登记
        { Rid: 'visitRes', Url: 'residentvisit/:id' },//访探记录
        { Rid: 'transferRes', Url: 'residenttransfer/:id' },//接送记录

//=====================================   入住管理 End  =======================================


//=====================================   监测管理 Start  =====================================

        { Rid: 'monitoritemRes', Url: 'monitoritem/:id' },//监测项目
        { Rid: 'monitortemplateRes', Url: 'monitortemplate/:id' },//监测模版
        { Rid: 'monitorresultRes', Url: 'monitorresult/:id' },//监测记录
        { Rid: 'taskMonitorRes', Url: 'task/Monitor/:id' },//任务监测

//=====================================   监测管理 End  =======================================

        { Rid: 'orgs', Url: 'organization/:id' },
        { Rid: 'orgRes', Url: 'organization/:organizationID' },
        { Rid: 'groups', Url: 'group/:id' },
        { Rid: 'chargeItem', Url: 'chargeitem/:id' },
        { Rid: 'area', Url: 'area/:id' },   //区域
        { Rid: 'chargeItemRes', Url: 'chargeitem/:id' },//收费项目
        { Rid: 'commodityItemRes', Url: 'commodityItem/:id' },//商品
        { Rid: 'serviceItemRes', Url: 'serviceitem/:id' },//服务项目
        { Rid: 'servicePlanItemRes', Url: 'serviceitem/QueryServiceItemWithServicePlan' },//套餐服务项目
        { Rid: 'serviceItemCategoryRes', Url: 'serviceitemcategory/:id' },//服务项目分类
        { Rid: 'commodityTypeRes', Url: 'commodityType/:id' },//商品分类
        { Rid: 'chargeGroupRes', Url: 'chargegroup/:id' },//收费组合
        { Rid: 'chargeDetailRes', Url: 'FeeDetail/:id' },//费用录入
        { Rid: 'serviceGroupRes', Url: 'servicegroup/:id' },//服务套餐
        { Rid: 'servicegroupitemsRes', Url: 'servicegroupitems/:id' }, //服务组项目
        {
            Rid: 'preOrderRes', Url: 'serviceApp/:id', actions: {
                "CancelApp": { method: 'Get', url: "CancelApp" },  //取消预约
                "GetPNCList": { method: 'Get', url: "GetPNCList" }  //取消预约
            }
        },//预约
        {
            Rid: 'serviceOrderRes', Url: 'serviceorder/:id', actions: {
                "ConfirmOrder": { method: 'Get', url: "ConfirmOrder" }, //确认收获
                "CancelOrder": { method: 'Get', url: "CancelOrder" },   //取消订单
                "GetAuditRefund": { method: 'Get', url: "GetAuditRefund" },   //获取需要审核的退款信息
                "SaveAudit": { method: 'Post', url: "SaveAudit" },   //保存审核
            }
        },//服务订单
        { Rid: 'serviceOrderDetailRes', Url: 'serviceOrder/Detail/:id' },//服务订单
        {
            Rid: 'comOrderRes', Url: 'comOrder/:id', actions: {
                "CancelOrder": { method: 'Get', url: "CancelOrder" },   //取消订单
                "SyncToCheckQueue": { method: 'Post', url: "SyncToCheckQueue" },   //保存审核
                "GetOrderItems": { method: 'Get', url: "GetOrderItems" },   //保存审核
            }
        },//医养驿站订单
        { Rid: 'tasks', Url: 'task/:id' },//工单管理
        {
            Rid: 'taskChangeRes', Url: 'task/:id', actions: {
                "ChangeTask": { method: 'POST', url: "ChangeTask" }, //保存改签
                "AuditTask": { method: 'POST', url: "AuditTask" },   //审核改签
                "GetTaskChange": { method: 'GET', url: "GetTaskChange" }, //获取改签信息
            }
        },//任务改签
        { Rid: 'persons', Url: 'persons/:id' },//会员档案管理
        { Rid: 'dispatchTaskRes', Url: 'task/GetDispatchTaskRecord' },//会员档案管理
        { Rid: 'evaluationRes', Url: 'evaluation/:id' },//评价
        { Rid: 'taskRes', Url: 'task/:id' },//任务
        { Rid: 'evaluatedTaskRes', Url: 'task/GetEvaluatedTask' },
        { Rid: 'personRes', Url: 'persons/:id' }, //老人基本信息
        { Rid: 'prePaymentRes', Url: 'deposit/:id' },//預付款
        { Rid: 'employeeRes', Url: 'employee/:id' },//员工管理
        { Rid: 'deptGetRes', Url: 'dept/:id' },//员工管理
        { Rid: 'billRes', Url: 'bill/:id' },//
        { Rid: 'bedRes', Url: 'bed/:id' },//
        { Rid: 'fixedChargeRes', Url: 'fixedcost/:id' },//
        { Rid: 'BillPayRes', Url: 'payment/:id' },//缴费记录
        {
            Rid: 'ChartRes', Url: 'Charts/:id', actions: {
                "GetOrgDanAnList": { method: 'GET', url: "GetOrgDanAnList" },
                "GetOrgHuiYuanList": { method: 'GET', url: "GetOrgHuiYuanList" },
                "GetOrgOrderList": { method: 'GET', url: "GetOrgOrderList" },
                "GetOrgTaskList": { method: 'GET', url: "GetOrgTaskList" },
                "GetOrgSexList": { method: 'GET', url: "GetOrgSexList" },
                "GetOrgAgeList": { method: 'GET', url: "GetOrgAgeList" },
            }
        },//统计信息
        {
            Rid: 'locationRes', Url: 'Location/:id', actions: {
                "StartTask": { method: 'GET', url: "StartTask" },
                "EndTask": { method: 'GET', url: "EndTask" },
            }
        },
        //统计信息搜索列
        { Rid: 'locationResStartTask', Url: 'Location/StartTask' },
        { Rid: 'locationResEndTask', Url: 'Location/EndTask' },
        //志愿者时间统计
         { Rid: 'volunteer', Url: 'Volunteer/:id' },
         //活动信息
         { Rid: 'activityRes', Url: 'activity/:id' },
         { Rid: 'GroupActivityCategoryRes', Url: 'GroupActivityCategory/:id' },
         {
             Rid: 'GroupActivityCategoryEditRes', Url: 'GroupActivityCategoryEdit/:id', actions: {
                 "SaveActivityItems": { method: 'POST', url: "SaveActivityItems" }
             }
         },
         //首页展示
         { Rid: 'homeInfo', Url: 'BriefInfo/GetBriefInfo/:organizationID' },
         { Rid: 'todayInfo', Url: 'BriefInfo/GetTodayInfo/:organizationID' },

         //报表管理
         { Rid: 'residentPercentageInfo', Url: 'MainStatistic/GetResidentPercentage/:organizationID' },
        { Rid: 'getTop10Service', Url: 'MainStatistic/GetTop10Service/:organizationID' },
        { Rid: 'paymentDistributeInfo', Url: 'MainStatistic/GetPaymentDistribute/:organizationID' },
        { Rid: 'residentAgeDistributeInfo', Url: 'MainStatistic/GetResidentAgeDistribute/:organizationID' },

        { Rid: 'orderSummaryInfo', Url: 'OrderStatistic/GetOrderSummary/:organizationID' },
        { Rid: 'personalOrderDistributeInfo', Url: 'OrderStatistic/GetPersonalOrderDistribute/:organizationID/:employeeId' },
        { Rid: 'orderTaskRate', Url: 'OrderStatistic/GetOrderTaskRate/:organizationID' },

        { Rid: 'evaluationSummaryInfo', Url: 'EvaluationStatistic/GetEvaluationSummary/:organizationID/:employeeId' },

        //排号管理
        //{ Rid: 'patientQueueInfo', Url: 'CallPatient/GetPatientQueue/:departmentId/:organizationID/:checkRoomId' },
        { Rid: 'patientQueueInfo', Url: 'CallPatient/GetPatientQueue' },

        {
            Rid: 'patientQueue', Url: 'CallPatient/', actions: {
                "UpdatePatientStatus": { method: 'POST', url: "UpdatePatientStatus" },
                "SetPatientExpired": { method: 'POST', url: "SetPatientExpired" },
                "SetPatientFinish": { method: 'POST', url: "SetPatientFinish" }
            }
        },
        { Rid: 'getPatientQueueForAdjustInfo', Url: 'SerialAdjustment/GetPatientQueueForAdjust' },
        { Rid: 'getExpiredPatientListInfo', Url: 'SerialAdjustment/GetExpiredPatientList' },
        {
            Rid: 'serialAdjustment', Url: 'SerialAdjustment/', actions: {
                "SetPatientNumberForward": { method: 'POST', url: "SetPatientNumberForward" },
                "SetPatientNumberBackward": { method: 'POST', url: "SetPatientNumberBackward" },
                "SetPatientNumberToFirst": { method: 'POST', url: "SetPatientNumberToFirst" },
                "AddExpiredPatientToQueue": { method: 'POST', url: "AddExpiredPatientToQueue" }
            }
        },
        { Rid: 'appointList', Url: 'appointList/GetappointStatistics/:dt' },
        { Rid: 'appointDtl', Url: 'appointDtl/GetappointDetail/:sevItem/:dt/:period' },

        { Rid: 'payments', Url: 'Payments/GetServiceOrder/:residentID/:serviceType' },
        { Rid: 'paymentsRec', Url: 'Payments/GetPayServiceOrder/:residentID/:serviceType' },

        {
            Rid: 'SavePayments', Url: 'Payments/', actions: {
                "SavePaymentByRsId": { method: 'POST', url: "SavePaymentByRsId/:baseRequest" }
            }
        },

        { Rid: 'paymentsPreAmount', Url: 'Payments/GetPreHasAmount/:residentID' },

        { Rid: 'refund', Url: 'Refund/GetServiceOrder/:residentID/:serviceType' },
        { Rid: 'refundRec', Url: 'Refund/GetRefundServiceOrder/:residentID/:serviceType' },

        {
            Rid: 'SaveRefund', Url: 'Refund/', actions: {
                "SaveRefundByRsId": { method: 'POST', url: "SaveRefundByRsId/:baseRequest" }
            }
        }




        // {
        //     Rid: 'PhoneRes', Url: 'Phone/:id', actions: {
        //         "QueryMyTaskList": { method: 'GET', url: "QueryMyTaskList" },
        //         "GetMyTaskInfo": { method: 'GET', url: "GetMyTaskInfo" },
        //         "BeginTask": { method: 'GET', url: "BeginTask" },
        //         "FinishTask": { method: 'GET', url: "FinishTask" },
        //     }
        // }

        //统计信息
        // 过滤期使用
        //{ Rid: 'employeesTemp', Url: 'employee/:id' },
        //{ Rid: 'orgsTemp', Url: 'organizations/:id' },
        //{ Rid: 'rolesTemp', Url: 'roles/:id' },
        //{ Rid: 'functionsTemp', Url: 'function/:id' }
    ];

    return {
        //根据id获取resource
        getResource: function (rid) {
            var api = $filter("filter")(apis, { Rid: rid }, true)[0];

            if (angular.isDefined(api)) {
                if (!angular.isDefined(api.Res)) {
                    //处理 actions 处理
                    if (api.actions) {
                        for (var item in api.actions) {
                            if (api.actions.hasOwnProperty(item)) {
                                var cp = api.actions[item];
                                var url = "";
                                if (cp.url) {
                                    url = cp.url;
                                } else {
                                    url = item;
                                }
                                url = "/" + url.replace(/\//g, '');
                                if (api.Url.lastIndexOf("/") > 0) {
                                    cp.url = "api/" + api.Url.substr(0, api.Url.lastIndexOf("/")) + url + api.Url.substr(api.Url.lastIndexOf("/"));
                                } else {
                                    //TODO
                                }
                            }
                        }
                    }

                    //如果还没有定义resource,这里定义
                    api.Res = $resource("api/" + api.Url, { id: "@id" }, api.actions);
                    //if(rid.indexOf('Temp') >- 1 ){
                    //    api.Res = $resource(resourceBase + api.Url, { id: "@id" }, api.actions);
                    //} else {
                    //    api.Res = $resource("api/" + api.Url, { id: "@id" }, api.actions);
                    //}

                }
                return api.Res;
            } else {
                console.log(rid + "资源不存在");
                //return $resource("http://10.10.10.10/id", { id: "@id" });
            }
        }
    }

}]);