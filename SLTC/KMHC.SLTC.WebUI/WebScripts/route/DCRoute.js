angular.module('sltcApp')
.config([
        '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
            //cfpLoadingBarProvider.spinnerTemplate = '<div class="loading"><span class="fa fa-spinner">加載中...</span></div>';
            //cfpLoadingBarProvider.latencyThreshold = 800;

            var defaultPage = window.sessionStorage["DefaultPage"];
            if (defaultPage) {
                $urlRouterProvider.when("/", defaultPage).otherwise('/');//TO-DO
            }
            //$urlRouterProvider.when("/", '/angular/charge/chargeitem').otherwise('/');

            //设置版本号 (为了解决angularjs自动缓存页面模版的问题,发布时需要修改对应的版本)
            var version = "v1";
            var states = {};
            var setVersion = function (obj) {
                if (obj) {
                    for (var s in obj) {
                        var item = obj[s];
                        if (item && item.templateUrl) {
                            item.templateUrl = item.templateUrl + "?version=" + version;
                        }
                        $stateProvider.state(s, item);
                    }
                }
            }

            //首页
            states['HomePage'] = { url: '/angular/Index', templateUrl: '/WebScripts/views/Home/Index.html', controller: 'homeCtrl' };

            //集团属性
            states['GroupList'] = { url: '/angular/GroupList', templateUrl: '/WebScripts/views/OrganizationManage/GroupList.html', controller: 'groupListCtrl' };
            states['GroupAdd'] = { url: '/angular/GroupEdit', templateUrl: '/WebScripts/views/OrganizationManage/GroupEdit.html', controller: 'groupEditCtrl' };
            states['GroupEdit'] = { url: '/angular/GroupEdit/:id', templateUrl: '/WebScripts/views/OrganizationManage/GroupEdit.html', controller: 'groupEditCtrl' };

            //机构管理
            states['OrgList'] = { url: '/angular/OrgList', templateUrl: '/WebScripts/views/OrganizationManage/OrgList.html', controller: 'orgListCtrl' };
            states['OrgAdd'] = { url: '/angular/OrgDtl', templateUrl: '/WebScripts/views/OrganizationManage/OrgDtl.html', controller: 'orgDtlCtrl' };
            states['OrgEdit'] = { url: '/angular/OrgDtl/:id', templateUrl: '/WebScripts/views/OrganizationManage/OrgDtl.html', controller: 'orgDtlCtrl' };

            //区域管理
            states['AreaList'] = { url: '/angular/AreaList', templateUrl: '/WebScripts/views/OrganizationManage/AreaList.html', controller: 'areaListCtrl' };
            states['AreaAdd'] = { url: '/angular/AreaEdit', templateUrl: '/WebScripts/views/OrganizationManage/AreaEdit.html', controller: 'areaEditCtrl' };
            states['AreaEdit'] = { url: '/angular/AreaEdit/:id', templateUrl: '/WebScripts/views/OrganizationManage/AreaEdit.html', controller: 'areaEditCtrl' };
            states['AreaBatchAdd'] = { url: '/angular/AreaBatchAdd', templateUrl: '/WebScripts/Views/OrganizationManage/AreaBatchAdd.html', controller: 'areaBatchAddCtrl' };

            //机构菜单
            states['OrgModule'] = { url: '/angular/OrgModule', templateUrl: '/WebScripts/views/OrganizationManage/OrgModule.html', controller: 'orgModuleCtrl' };

            //楼层管理
            states['FloorList'] = { url: '/angular/FloorList', templateUrl: '/WebScripts/views/OrganizationManage/FloorList.html', controller: 'floorListCtrl' };
            states['FloorAdd'] = { url: '/angular/FloorEdit', templateUrl: '/WebScripts/views/OrganizationManage/FloorEdit.html', controller: 'floorEditCtrl' };
            states['FloorEdit'] = { url: '/angular/FloorEdit/:id', templateUrl: '/WebScripts/views/OrganizationManage/FloorEdit.html', controller: 'floorEditCtrl' };

            //房间管理
            states['RoomList'] = { url: '/angular/RoomList', templateUrl: '/WebScripts/views/OrganizationManage/RoomList.html', controller: 'roomListCtrl' };
            states['RoomAdd'] = { url: '/angular/RoomEdit', templateUrl: '/WebScripts/views/OrganizationManage/RoomEdit.html', controller: 'roomEditCtrl' };
            states['RoomEdit'] = { url: '/angular/RoomEdit/:id', templateUrl: '/WebScripts/views/OrganizationManage/RoomEdit.html', controller: 'roomEditCtrl' };

            //床位管理
            states['BedList'] = { url: '/angular/BedList', templateUrl: '/WebScripts/views/OrganizationManage/BedList.html', controller: 'bedListCtrl' };
            states['BedAdd'] = { url: '/angular/BedEdit', templateUrl: '/WebScripts/views/OrganizationManage/BedEdit.html', controller: 'bedEditCtrl' };
            states['BedEdit'] = { url: '/angular/BedEdit/:id', templateUrl: '/WebScripts/views/OrganizationManage/BedEdit.html', controller: 'bedEditCtrl' };

            //部门管理
            states['DeptList'] = { url: '/angular/DeptList', templateUrl: '/WebScripts/Views/OrganizationManage/DeptList.html', controller: 'deptListCtrl' };

            //员工管理
            states['StaffList'] = { url: '/angular/StaffList', templateUrl: '/WebScripts/Views/OrganizationManage/StaffList.html', controller: 'staffListCtrl' };
            states['StaffAdd'] = { url: '/angular/StaffEdit', templateUrl: '/WebScripts/Views/OrganizationManage/StaffEdit.html', controller: 'staffEditCtrl' };
            states['StaffEdit'] = { url: '/angular/StaffEdit/:id', templateUrl: '/WebScripts/Views/OrganizationManage/StaffEdit.html', controller: 'staffEditCtrl' };
            states['StaffBatchAdd'] = { url: '/angular/StaffBatchAdd/', templateUrl: '/WebScripts/Views/OrganizationManage/StaffBatchAdd.html', controller: 'staffBatchAddCtrl' };

            //字典管理
            states['CodeList'] = { url: '/angular/CodeList', templateUrl: '/WebScripts/Views/OrganizationManage/CodeList.html', controller: 'codeListCtrl' };
            states['CodeAdd'] = { url: '/angular/CodeEdit', templateUrl: '/WebScripts/Views/OrganizationManage/CodeEdit.html', controller: 'codeEditCtrl' };
            states['CodeEdit'] = { url: '/angular/CodeEdit/:id', templateUrl: '/WebScripts/Views/OrganizationManage/CodeEdit.html', controller: 'codeEditCtrl' };
            states['CodeBatchAdd'] = { url: '/angular/CodeBatchAdd', templateUrl: '/WebScripts/Views/OrganizationManage/CodeBatchAdd.html', controller: 'codeBatchAddCtrl' };

            //系统功能管理
            states['Functions'] = { url: '/angular/Functions', templateUrl: '/WebScripts/Views/SystemManage/Functions.html', controller: 'FunctionsCtrl' };
            states['FunctionAdd'] = { url: '/angular/FunctionAdd', templateUrl: '/WebScripts/Views/SystemManage/FunctionEdit.html', controller: 'FunctionEditCtrl' };
            states['FunctionBatchAdd'] = { url: '/angular/FunctionBatchAdd', templateUrl: '/WebScripts/Views/SystemManage/FunctionBatchAdd.html', controller: 'functionBatchAddCtrl' };
            states['FunctionEdit'] = { url: '/angular/FunctionEdit/:id', templateUrl: '/WebScripts/Views/SystemManage/FunctionEdit.html', controller: 'FunctionEditCtrl' };
            states['RemoveOrgTotally'] = { url: '/angular/RemoveOrgTotally', templateUrl: '/WebScripts/Views/SystemManage/RemoveOrgTotally.html', controller: 'removeOrgTotallyCtrl' };

            //账单设定
            states['BillSettingList'] = { url: '/angular/BillSettingList', templateUrl: '/WebScripts/Views/OrganizationManage/BillSettingList.html', controller: 'billSettingListCtrl' };
            states['BillSettingAdd'] = { url: '/angular/BillSettingEdit', templateUrl: '/WebScripts/Views/OrganizationManage/BillSettingEdit.html', controller: 'billSettingEditCtrl' };
            states['BillSettingEdit'] = { url: '/angular/BillSettingEdit/:id', templateUrl: '/WebScripts/Views/OrganizationManage/BillSettingEdit.html', controller: 'billSettingEditCtrl' };

            //团体活动 GroupActivity
            states['GroupActivityList'] = { url: '/angular/GroupActivityList', templateUrl: '/WebScripts/Views/GroupActivity/GroupActivityList.html', controller: 'groupActivityListCtrl' };
            states['GroupActivityAdd'] = { url: '/angular/GroupActivityAdd', templateUrl: '/WebScripts/Views/GroupActivity/GroupActivityEdit.html', controller: 'groupActivityEditCtrl' };
            states['GroupActivityEdit'] = { url: '/angular/GroupActivityEdit/:id', templateUrl: '/WebScripts/Views/GroupActivity/GroupActivityEdit.html', controller: 'groupActivityEditCtrl' };
            states['GroupActivityResList'] = { url: '/angular/GroupActivityList/:id/', templateUrl: '/WebScripts/Views/GroupActivity/GroupActivityResList.html', controller: 'groupActivityResList' };

            states['ResidentTestlist'] = { url: '/angular/ResidentTestlist/:id/', templateUrl: '/WebScripts/Views/GroupActivity/ResidentTestlist.html', controller: 'ResidentTestlistCtrl' };

            //团体活动评估 EvalSheet
            states['EvalSheetList'] = { url: '/angular/EvalSheetList', templateUrl: '/WebScripts/Views/GroupActivity/EvalSheetList.html', controller: 'evalSheetListCtrl' };
            states['EvalSheetAdd'] = { url: '/angular/EvalSheetAdd/:rid/:pname', templateUrl: '/WebScripts/Views/GroupActivity/EvalSheetEdit.html', controller: 'evalSheetEditCtrl' };
            states['EvalSheetEdit'] = { url: '/angular/EvalSheetEdit/:id/:rid/:pname', templateUrl: '/WebScripts/Views/GroupActivity/EvalSheetEdit.html', controller: 'evalSheetEditCtrl' };


            //任务管理
            states['TaskList'] = { url: '/angular/TaskList', templateUrl: '/WebScripts/Views/ServiceOrder/TaskList.html', controller: 'taskListCtrl' };
            states['TaskSend'] = { url: '/angular/TaskSend/:id', templateUrl: '/WebScripts/Views/ServiceOrder/TaskSend.html', controller: 'taskSendCtrl' };
            //states['TaskEdit'] = { url: '/angular/TaskEdit/:id/:flag', templateUrl: '/WebScripts/Views/ServiceOrder/TaskEdit.html', controller: 'taskEditCtrl' };
            states['TaskDispatch'] = { url: '/angular/TaskDispatch/:id', templateUrl: '/WebScripts/Views/ServiceOrder/TaskDispatch.html', controller: 'taskDispatchCtrl' };//taskDispatchCtrl
            states['ProTaskManager'] = { url: '/angular/ProTaskManager', templateUrl: '/WebScripts/Views/ServiceOrder/ProTaskManager.html', controller: 'proTaskManagerCtrl' };

            //states['MyTaskList'] =  { url: '/angular/CodeEdit/:id', templateUrl: '/WebScripts/Views/ServiceOrder/CodeEdit.html', controller: 'codeEditCtrl' };

            //团体活动评估
            //states['EvaluationList'] =  { url: '/angular/EvaluationList/:qId/:qName', templateUrl: '/Views/Nursing/EvaluationList.html', controller: 'evaluationListCtr' };
            //states['EvalSheetTemp'] =  { url: '/angular/EvalSheetTemp/:regNo/:feeNo/:qId/:regName/:recId/:qName', templateUrl: '/Views/Nursing/EvalSheetTemp.html', controller: 'evaluationSheetCtr' };
            //states['EvalSheetHistory'] =  { url: '/angular/EvalSheetHistory/:qId/:feeNo/:regName/:qName', templateUrl: '/Views/Nursing/EvalSheetHistory.html', controller: 'evalSheetHistoryCtr' };

            //费用管理
            states['ChargeItem'] = { url: '/angular/charge/chargeitem', templateUrl: '/WebScripts/views/Charges/ChargeItemList.html', controller: "chargeItemCtrl" };
            states['ChargeItemAdd'] = { url: '/angular/charge/chargeitemedit', templateUrl: '/WebScripts/views/Charges/ChargeItemEdit.html', controller: "chargeItemEditCtrl" };
            states['ChargeItemBatchAdd'] = { url: '/angular/charge/chargeItemBatchAdd', templateUrl: '/WebScripts/Views/Charges/ChargeItemBatchAdd.html', controller: "chargeItemBatchAddCtrl" };
            states['ChargeItemEdit'] = { url: '/angular/charge/chargeitemedit/:id', templateUrl: '/WebScripts/views/Charges/ChargeItemEdit.html', controller: "chargeItemEditCtrl" };
            states['ChargeGroup'] = { url: '/angular/charge/chargegroup', templateUrl: '/WebScripts/views/Charges/ChargeGroupList.html', controller: "chargeGroupCtrl" };
            states['ChargeGroupAdd'] = { url: '/angular/charge/chargegroupadd', templateUrl: '/WebScripts/views/Charges/ChargeGroupEdit.html', controller: "chargeGroupEditCtrl" };
            states['ChargeGroupEdit'] = { url: '/angular/charge/chargegroupadd/:id', templateUrl: '/WebScripts/views/Charges/ChargeGroupEdit.html', controller: "chargeGroupEditCtrl" };
            states['FixChargeSetting'] = { url: '/angular/charge/fixedchargesetting', templateUrl: '/WebScripts/views/Charges/FixedChargeSettings.html', controller: "fixedChargeCtrl" };
            //states['ChargeInput'] = { url: '/angular/charge/chargeinput', templateUrl: '/WebScripts/views/Charges/ChargeInput.html', controller: "chargeInputCtrl" };
            //states['PrePayment'] = { url: '/angular/PrePayment', templateUrl: '/WebScripts/views/Charges/PrePaymentEdit.html', controller: 'prePaymentEditCtrl' };
            //states['BillList'] = { url: '/angular/billList', templateUrl: '/WebScripts/views/Charges/BillList.html', controller: "billListCtrl" };
            states['PayBills'] = { url: '/angular/PayBills', templateUrl: '/WebScripts/views/Charges/PayBills.html', controller: "payBillsCtrl" };

            //商品管理
            states['CommodityItem'] = { url: '/angular/charge/commodityitem', templateUrl: '/WebScripts/views/Charges/CommodityItemList.html', controller: "commodityItemCtrl" };
            //states['CommodityItemAdd'] = { url: '/angular/charge/commodityitemedit', templateUrl: '/WebScripts/views/Charges/CommodityItemEdit.html', controller: "commodityItemEditCtrl" };
            //states['CommodityItemEdit'] = { url: '/angular/charge/commodityitemedit/:id', templateUrl: '/WebScripts/views/Charges/CommodityItemEdit.html', controller: "commodityItemEditCtrl" };
            states['CommodityType'] = { url: '/angular/charge/CommodityType', templateUrl: '/WebScripts/views/Charges/CommodityTypeList.html', controller: "commodityTypeCtrl" };
            //帳單繳費


            //服务管理
            states['ServiceItemList'] = { url: '/angular/ServiceItemList', templateUrl: '/WebScripts/views/Service/ServiceItemList.html', controller: "ServiceItemListCtrl" };
            //states['ServiceItemAdd'] = { url: '/angular/ServiceItemEdit', templateUrl: '/WebScripts/views/Service/ServiceItemEdit.html', controller: "ServiceItemEditCtrl" };
            //states['ServiceItemBatchAdd'] = { url: '/angular/ServiceItemBatchAdd', templateUrl: '/WebScripts/Views/Service/ServiceItemBatchAdd.html', controller: "ServiceItemBatchAddCtrl" };
            //states['ServiceItemEdit'] = { url: '/angular/ServiceItemEdit/:id', templateUrl: '/WebScripts/views/Service/ServiceItemEdit.html', controller: "ServiceItemEditCtrl" };
            states['ServiceOrderList'] = { url: '/angular/ServiceOrderList', templateUrl: '/WebScripts/views/Service/ServiceOrderList.html', controller: "ServiceOrderListCtrl" };
            states['ServiceOrderAdd'] = { url: '/angular/ServiceOrderAdd', templateUrl: '/WebScripts/views/Service/ServiceOrderEdit.html', controller: "ServiceOrderEditCtrl" };
            states['ServiceOrderAdd.PriorityRemark'] = { url: '/PriorityRemark/:id', templateUrl: '/WebScripts/views/UserManage/PriorityRemarkList.html' };
            states['ServiceOrderAdd.CallInfo'] = { url: '/CallInfo/:id', templateUrl: '/WebScripts/views/Service/CallInfoList.html' };
            states['ServiceOrderAdd.PersonOrder'] = { url: '/PersonOrder/:id,:residentId', templateUrl: '/WebScripts/views/Service/PersonOrderList.html' };
            //states['ServiceOrderAdd.Contract'] = { url: '/Contract/:id', templateUrl: '/WebScripts/views/UserManage/ContractList.html' };
            states['ServiceOrderAdd.ServicePlan'] = { url: '/ServicePlan/:residentId', templateUrl: '/WebScripts/views/Resident/ServicePlanList.html' };
            states['ServiceOrderAdd.Device'] = { url: '/Device/:id', templateUrl: '/WebScripts/views/UserManage/DeviceList.html' };
            states['ServiceOrderAdd.Family'] = { url: '/Family/:id', templateUrl: '/WebScripts/views/UserManage/FamilyList.html' };
            states['ServiceOrderAdd.HealthManage'] = { url: '/HealthManage/:id,:idCard', templateUrl: '/WebScripts/views/UserManage/HealthManage.html' };
            states['ServiceOrderAdd.Habit'] = { url: '/Habit/:id', templateUrl: '/WebScripts/views/UserManage/HabitList.html' };
            states['ServiceOrderAdd.HomePos'] = { url: '/HomePos/:id', templateUrl: '/WebScripts/views/UserManage/HomePos.html' };

            states['ServiceOrderEdit'] = { url: '/angular/ServiceOrderEdit/:id', templateUrl: '/WebScripts/views/Service/ServiceOrderEdit.html', controller: "ServiceOrderEditCtrl" };
            states['CommodityOrderList'] = { url: '/angular/CommodityOrderList', templateUrl: '/WebScripts/views/Service/CommodityOrderList.html', controller: "CommodityOrderListCtrl" };
            states['CommodityOrderAdd'] = { url: '/angular/CommodityOrderAdd', templateUrl: '/WebScripts/views/Service/CommodityOrderEdit.html', controller: "CommodityOrderEditCtrl" };
            states['CommodityOrderEdit'] = { url: '/angular/CommodityOrderEdit/:id', templateUrl: '/WebScripts/views/Service/CommodityOrderEdit.html', controller: "CommodityOrderEditCtrl" };
            //states['ServiceOrderInfo'] = { url: '/angular/ServiceOrderInfo/:id', templateUrl: '/WebScripts/views/Service/ServiceOrderInfo.html', controller: "ServiceOrderInfoCtrl" };

            states['ServiceGroup'] = { url: '/angular/ServiceGroup', templateUrl: '/WebScripts/views/Service/ServiceGroupList.html', controller: "ServiceGroupCtrl" };
            //states['ServiceGroupAdd'] = { url: '/angular/ServiceGroupAdd', templateUrl: '/WebScripts/views/Service/ServiceGroupEdit.html', controller: "ServiceGroupEditCtrl" };
            //states['ServiceGroupEdit'] = { url: '/angular/ServiceGroupEdit/:id', templateUrl: '/WebScripts/views/Service/ServiceGroupEdit.html', controller: "ServiceGroupEditCtrl" };
            //states['ServiceGroupItemInfo'] = { url: '/angular/ServiceGroupItemInfo', templateUrl: '/WebScripts/views/Service/ServiceGroupItems.html', controller: "ServiceGroupItemsCtrl" };
            states['ServiceGroupItemBatchAdd'] = { url: '/angular/ServiceGroupItemBatchAdd', templateUrl: '/WebScripts/Views/Service/ServiceGroupItemBatchAdd.html', controller: "ServiceGroupItemBatchAddCtrl" };
            states['serviceitemcategoryList'] = { url: '/angular/serviceitemcategoryList', templateUrl: '/WebScripts/views/Service/ServiceItemCategoryList.html', controller: "ServiceItemCategoryListCtrl" };
            states['serviceitemcategoryAdd'] = { url: '/angular/serviceitemcategoryAdd', templateUrl: '/WebScripts/views/Service/ServiceItemCategoryEdit.html', controller: "ServiceitemcategoryEditCtrl" };
            states['serviceitemcategoryEdit'] = { url: '/angular/serviceitemcategoryEdit/:id', templateUrl: '/WebScripts/views/Service/ServiceItemCategoryEdit.html', controller: "ServiceitemcategoryEditCtrl" };
            states['SICategoryBatchAdd'] = { url: '/angular/SICategoryBatchAdd', templateUrl: '/WebScripts/views/Service/SICategoryBatchAdd.html', controller: 'sicategoryBatchAdd' };

            //入住管理
            states['Appointment'] = { url: '/angular/Appointment', templateUrl: '/WebScripts/views/Resident/Appointment.html', controller: 'appointmentCtrl' };//预约登记

            states['regResident'] = { url: '/angular/regResident', templateUrl: '/WebScripts/Views/Resident/regResident.html', controller: 'regResidentCtrl' };    //入住登记-分步
            states['regResidentEdit'] = { url: '/angular/regResidentEdit/:id', templateUrl: '/WebScripts/Views/Resident/regResidentEdit.html', controller: 'regResidentEditCtrl' };    //入住登记-更新
            states['ServiceResidentList'] = { url: '/angular/ResidentList', templateUrl: '/WebScripts/Views/Resident/ServiceResidentList.html', controller: "serviceResidentListCtrl" };
            states['LeaveNursing'] = { url: '/angular/LeaveNursing', templateUrl: '/WebScripts/Views/Resident/LeaveNursing.html', controller: 'LeaveNursingCtrl' };//退住院
            states['ResidentStatus'] = { url: '/angular/ResidentStatus', templateUrl: '/WebScripts/Views/Resident/ResidentStatus.html', controller: 'residentStatusCtrl' };
            states['BloodPressDetail'] = { url: '/angular/ResidentStatusDetail/:id', templateUrl: '/WebScripts/Views/Resident/BloodPressDetail.html', controller: 'bloodPressDetailCtrl' };
            states['BloodSugarDetail'] = { url: '/angular/ResidentStatusDetail/:id', templateUrl: '/WebScripts/Views/Resident/BloodSugarDetail.html', controller: 'bloodSugarDetailCtrl' };

            states['VisitRec'] = { url: '/angular/VisitRec', templateUrl: '/WebScripts/views/Resident/VisitRec.html', controller: "visitRecCtrl" }; //访探记录

            states['TransferRec'] = { url: '/angular/TransferRec', templateUrl: '/WebScripts/views/Resident/TransferRec.html', controller: "transferRecCtrl" }; //接送记录
            states['ResidentSetOrg'] = { url: '/angular/ResidentSetOrg', templateUrl: '/WebScripts/views/Resident/ResidentSetOrg.html', controller: "residentSetOrgCtrl" }; //入住机构设定
            //states['SetServicePlan'] = { url: '/angular/SetServicePlan', templateUrl: '/WebScripts/views/Resident/SetServicePlan.html', controller: "residentServicePlanCtrl" }; //入住服务套餐选择


            //用户管理
            states['UserList'] = { url: '/angular/UserList', templateUrl: '/WebScripts/Views/UserManage/UserList.html', controller: 'userListCtrl' };
            states['UserAdd'] = { url: '/angular/UserEdit', templateUrl: '/WebScripts/Views/UserManage/UserEdit.html', controller: 'userEditCtrl' };
            states['UserEdit'] = { url: '/angular/UserEdit/:id', templateUrl: '/WebScripts/Views/UserManage/UserEdit.html', controller: 'userEditCtrl' };
            states['AdminUserEdit'] = { url: '/angular/AdminUserEdit/:orgID', templateUrl: '/WebScripts/Views/UserManage/UserEdit.html', controller: 'userEditCtrl' };
            states['AdminUserEditbygroup'] = { url: '/angular/AdminUserEditbygroup/:GroupID', templateUrl: '/WebScripts/Views/UserManage/UserEdit.html', controller: 'userEditCtrl' };

            states['PersonProfile'] = { url: '/angular/PersonProfile/:id', templateUrl: '/WebScripts/Views/UserManage/PersonProfile.html', controller: 'PersonProfileCtrl' };
            states['PersonProfile.BasicInfo'] = { url: '/BasicInfo/:id', templateUrl: '/WebScripts/views/UserManage/PersonEdit.html' };
            //states['PersonProfile.Contract'] = { url: '/Contract', templateUrl: '/WebScripts/views/UserManage/ContractList.html' };
            states['PersonProfile.ServicePlan'] = { url: '/ServicePlan/:residentId', templateUrl: '/WebScripts/views/Resident/ServicePlanList.html' };
            states['PersonProfile.PrePayment'] = { url: '/PrePayment/:residentId', templateUrl: '/WebScripts/views/Charges/PrePaymentList.html' };
            states['PersonProfile.ConsumerDetail'] = { url: '/ConsumerDetail/:residentId', templateUrl: '/WebScripts/views/Charges/ChargeInput.html' };
            states['PersonProfile.BillList'] = { url: '/BillList/:residentId', templateUrl: '/WebScripts/views/Charges/BillList.html' };
            states['PersonProfile.Device'] = { url: '/Device/:id', templateUrl: '/WebScripts/views/UserManage/DeviceList.html' };
            states['PersonProfile.Family'] = { url: '/Family/:id', templateUrl: '/WebScripts/views/UserManage/FamilyList.html' };
            states['PersonProfile.HealthManage'] = { url: '/HealthManage/:id,:idCard', templateUrl: '/WebScripts/views/UserManage/HealthManage.html' };
            states['PersonProfile.Habit'] = { url: '/Habit/:id', templateUrl: '/WebScripts/views/UserManage/HabitList.html' };
            states['PersonProfile.PriorityRemark'] = { url: '/PriorityRemark/:id', templateUrl: '/WebScripts/views/UserManage/PriorityRemarkList.html' };
            states['PersonProfile.AddressList'] = { url: '/AddressList/:residentId', templateUrl: '/WebScripts/views/UserManage/AddressList.html' };

            states['PersonList'] = { url: '/angular/PersonList', templateUrl: '/WebScripts/Views/UserManage/PersonList.html', controller: 'PersonListCtrl' };
            states['PersonAdd'] = { url: '/angular/PersonAdd', templateUrl: '/WebScripts/Views/UserManage/PersonEdit.html', controller: 'PersonEditCtrl' };
            states['PersonEdit'] = { url: '/angular/PersonEdit/:id', templateUrl: '/WebScripts/Views/UserManage/PersonEdit.html', controller: 'PersonEditCtrl' };
            states['PersonInfoEdit'] = { url: '/angular/PersonInfoEdit/:id', templateUrl: '/WebScripts/Views/UserManage/PersonInfoEdit.html', controller: 'PersonInfoEditCtrl' };
            states['PersonInfoBackExa'] = { url: '/angular/PersonInfoEdit/:id/:tab', templateUrl: '/WebScripts/Views/UserManage/PersonInfoEdit.html', controller: 'PersonInfoEditCtrl' };
            states['ExamineResult'] = { url: '/angular/ExamineResult/:id', templateUrl: '/WebScripts/Views/UserManage/ExamineResult.html', controller: 'ExamineResultCtrl' };
            states['ExamineSuggest'] = { url: '/angular/ExamineSuggest/:id', templateUrl: '/WebScripts/Views/UserManage/ExamineSuggest.html', controller: 'ExamineSuggestCtrl' };
            //states['WatchResult'] =  { url: '/angular/WatchResult/:imei/:type', templateUrl: '/WebScripts/Views/UserManage/WatchResult.html', controller: 'WatchResultCtrl' };
            states['ContractList'] = { url: '/angular/ContractList', templateUrl: '/WebScripts/Views/UserManage/ContractList.html', controller: 'ContractListCtrl' };
            states['ContractAdd'] = { url: '/angular/ContractEdit', templateUrl: '/WebScripts/Views/UserManage/ContractEdit.html', controller: 'ContractEditCtrl' };
            states['ContractEdit'] = { url: '/angular/ContractEdit/:id', templateUrl: '/WebScripts/Views/UserManage/ContractEdit.html', controller: 'ContractEditCtrl' };

            //账户设置
            states['AccountSet'] = { url: '/angular/AccountSet', templateUrl: '/WebScripts/Views/UserManage/AccountSet.html', controller: 'acountSetCtrl' };
            states['UserBasicInfoSet'] = { url: '/angular/UserBasicInfoSet', templateUrl: '/WebScripts/Views/UserManage/UserBasicInfoSet.html', controller: 'UserBasicInfoSetCtrl' };

            //角色管理
            states['RoleList'] = { url: '/angular/RoleList', templateUrl: '/WebScripts/Views/UserManage/RoleList.html', controller: 'roleListCtrl' };
            states['RoleAdd'] = { url: '/angular/RoleEdit', templateUrl: '/WebScripts/Views/UserManage/RoleEdit.html', controller: 'roleEditCtrl' };
            states['RoleBatchAdd'] = { url: '/angular/RoleBatchAdd', templateUrl: '/WebScripts/Views/UserManage/RoleBatchAdd.html', controller: 'roleBatchAddCtrl' };
            states['RoleEdit'] = { url: '/angular/RoleEdit/:id', templateUrl: '/WebScripts/Views/UserManage/RoleEdit.html', controller: 'roleEditCtrl' };

            //评估管理
            states['AssessmentItemList'] = { url: '/angular/assessment/assessmentitem', templateUrl: '/WebScripts/Views/Assessment/AssessmentItemList.html', controller: 'assessmentItemCtrl' };
            states['AssessmentItemAdd'] = { url: '/angular/assessment/assessmentitemedit', templateUrl: '/WebScripts/Views/Assessment/AssessmentItemEdit.html', controller: "assessmentItemEditCtrl" };
            states['AssessmentItemBatchAdd'] = { url: '/angular/assessment/assessment-item-batch-add', templateUrl: '/WebScripts/Views/Assessment/AssessmentItemBatchAdd.html', controller: "assessmentItemBatchAddCtrl" };
            states['AssessmentItemEdit'] = { url: '/angular/assessment/assessmentitemedit/:id', templateUrl: '/WebScripts/Views/Assessment/AssessmentItemEdit.html', controller: "assessmentItemEditCtrl" };

            states['AssessmentTemplateList'] = { url: '/angular/assessment/assessmenttemplate', templateUrl: '/WebScripts/Views/Assessment/AssessmentTemplateList.html', controller: 'assessmentTemplateCtrl' };
            states['AssessmentTemplateAdd'] = { url: '/angular/assessment/assessmenttemplateedit', templateUrl: '/WebScripts/Views/Assessment/AssessmentTemplateEdit.html', controller: "assessmentTemplateEditCtrl" };
            states['AssessmentTemplateEdit'] = { url: '/angular/assessment/assessmenttemplateedit/:id', templateUrl: '/WebScripts/Views/Assessment/AssessmentTemplateEdit.html', controller: "assessmentTemplateEditCtrl" };
            states['AssessmentTemplatePreview'] = { url: '/angular/assessment/assessmenttemplatepreview/:id', templateUrl: '/WebScripts/Views/Assessment/AssessmentTemplatePreview.html', controller: "assessmentTemplatePreviewCtrl" };

            //问卷评估 
            states['QuestionADL'] = { url: '/angular/EvalSheetTemp/ADL/巴氏量表', templateUrl: '/WebScripts/Views/Nursing/EvalSheetTemp.html', controller: "evaluationSheetCtrl" };
            states['QuestionIADL'] = { url: '/angular/EvalSheetTemp/IADL/工具性日常生活功能量表', templateUrl: '/WebScripts/Views/Nursing/EvalSheetTemp.html', controller: "evaluationSheetCtrl" };
            states['QuestionMMSE'] = { url: '/angular/EvalSheetTemp/MMSE/失智量表', templateUrl: '/WebScripts/Views/Nursing/EvalSheetTemp.html', controller: "evaluationSheetCtrl" };
            states['QuestionGDS'] = { url: '/angular/EvalSheetTemp/GDS/忧郁评估', templateUrl: '/WebScripts/Views/Nursing/EvalSheetTemp.html', controller: "evaluationSheetCtrl" };

            states['SocialEval'] = { url: '/angular/SocialEval', templateUrl: '/WebScripts/Views/DC/SocialWorker/dc_SocialEval.html', controller: 'swregevalplanCtrl' };//社工個案評估及處遇計畫表
            states['RegLifeQualityEval'] = { url: '/angular/RegLifeQualityEval', templateUrl: '/WebScripts/Views/DC/SocialWorker/dc_RegLifeQualityEval.html', controller: 'regLifeQualityEval' };//家庭照顧者生活品質評估問卷
            states['RegQuestionEvalRec'] = { url: '/angular/RegQuestionEvalRec', templateUrl: '/WebScripts/Views/DC/SocialWorker/dc_RegQuestionEvalRec.html', controller: 'RegQuestionEvalRecCtrl' };//受託長輩適應程度評估表
            states['DCNurseRequirementEval'] = { url: '/angular/DCNurseRequirementEval', templateUrl: '/WebScripts/Views/DC/NurseCare/DCNurseRequirementEval.html', controller: 'DCNurseRequirementEvalCtrl' };//護理需求評估及照顧計畫表
            states['DCNurseCareLifeService'] = { url: '/angular/NurseCareLifeService', templateUrl: '/WebScripts/Views/DC/CrossSpeciality/DCNurseCareLifeService.html', controller: 'NurseCareLifeServiceCtrl' };//護理及生活照顧服務紀錄表
            states['DCDayLifeCare'] = { url: '/angular/DCDayLifeCare', templateUrl: '/WebScripts/Views/DC/CrossSpeciality/DCDayLifeCare.html', controller: 'DCDayLifeCareCtrl' };//日常生活照顧記錄表
            states['DCTransdisciplinaryPlan'] = { url: '/dc/DCTransdisciplinaryPlan', templateUrl: '/WebScripts/Views/DC/CrossSpeciality/DCTransdisciplinaryPlan.html', controller: 'dcTransdisciplinaryPlanCtrl' };//照顾计划表
            states['DCIndex'] = { url: '/angular/DCIndex', templateUrl: '/WebScripts/Views/DC/Resident/ResidentNavigate.html', controller: 'residentNavigateCtrl' };//residentNavigateCtrl
            states['CasesTimeline'] = { url: '/angular/DCTransdisciplinaryTimeline', templateUrl: '/WebScripts/Views/DC/CasesWorkStation/TransdisciplinaryTimeline.html', controller: 'transdisciplinaryTimelineCtrl' };
            //报表管理
            states['AreaStatistic'] = { url: '/angular/Report/AreaStatistic/:id', templateUrl: '/WebScripts/Views/Report/AreaStatistic.html' };
            states['GeneralStatistic'] = { url: '/angular/Report/GeneralStatistic/:id', templateUrl: '/WebScripts/Views/Report/GeneralStatistic.html' };
            states['CustomerStatistic'] = { url: '/angular/Report/CustomerStatistic/:id', templateUrl: '/WebScripts/Views/Report/CustomerStatistic.html', controller: 'customerStatisticCtrl' };
            states['CustomerStatistic1'] = { url: '/angular/Report/CustomerStatistic1/:id', templateUrl: '/WebScripts/Views/Report/CustomerStatistic1.html', controller: 'customerStatistic1Ctrl' };
            states['EvaluationStatistic'] = { url: '/angular/Report/EvaluationStatistic/:id', templateUrl: '/WebScripts/Views/Report/EvaluationStatistic.html', controller: 'evaluationStatisticCtrl' };
            states['StationStatistic'] = { url: '/angular/Report/StationStatistic/:id', templateUrl: '/WebScripts/Views/Report/StationStatistic.html', controller: 'stationStatisticCtrl' };
            states['WorksheetStatistic'] = { url: '/angular/Report/WorksheetStatistic/:id', templateUrl: '/WebScripts/Views/Report/WorksheetStatistic.html', controller: 'worksheetStatisticCtrl' };
            states['SOS_Statistic'] = { url: '/angular/Report/SOS_Statistic/:id', templateUrl: '/WebScripts/Views/Report/SOS_Statistic.html', controller: 'SOS_StatisticCtrl' };
            states['HypertensionStatistic'] = { url: '/angular/Report/HypertensionStatistic/:id', templateUrl: '/WebScripts/Views/Report/HypertensionStatistic.html' };
            states['ReportIndex'] = { url: '/angular/ReportIndex', templateUrl: '/WebScripts/Views/Report/ReportIndex.html' };
            //states['CasesTimeline'] = { url: '/angular/CaseTimeLine', templateUrl: '/WebScripts/Views/Report/caseManagement.html', controller: 'caseManagementCtrl' };

            //监测管理
            states['MonitorItems'] = { url: '/angular/MonitorItems', templateUrl: '/WebScripts/Views/Monitor/MonitorItems.html', controller: 'MonitorItemsCtrl' };//监测项目
            states['MonitorItemAdd'] = { url: '/angular/MonitorItemAdd', templateUrl: '/WebScripts/Views/Monitor/MonitorItemEdit.html', controller: 'MonitorItemEditCtrl' };//监测项目
            states['MonitorItemEdit'] = { url: '/angular/MonitorItemEdit/:id', templateUrl: '/WebScripts/Views/Monitor/MonitorItemEdit.html', controller: 'MonitorItemEditCtrl' };//监测项目

            states['MonitorTemplates'] = { url: '/angular/MonitorTemplates', templateUrl: '/WebScripts/Views/Monitor/MonitorTemplates.html', controller: 'MonitorTemplatesCtrl' };//监测模版
            states['MonitorTemplateAdd'] = { url: '/angular/MonitorTemplateAdd', templateUrl: '/WebScripts/Views/Monitor/MonitorTemplateEdit.html', controller: 'MonitorTemplateEditCtrl' };//监测模版
            states['MonitorTemplateEdit'] = { url: '/angular/MonitorTemplateEdit/:id', templateUrl: '/WebScripts/Views/Monitor/MonitorTemplateEdit.html', controller: 'MonitorTemplateEditCtrl' };//监测模版

            states['MonitorResult'] = { url: '/angular/MonitorResult', templateUrl: '/WebScripts/Views/Monitor/MonitorResult.html', controller: 'MonitorResultCtrl' };//监测结果
            states['MonitorResultAdd'] = { url: '/angular/MonitorResultAdd', templateUrl: '/WebScripts/Views/Monitor/MonitorResultAdd.html', controller: 'MonitorResultAddCtrl' };//监测结果

            states['ServiceCenter'] = { url: '/angular/ServiceCenter', templateUrl: '/WebScripts/Views/Monitor/ServiceCenter.html', controller: 'serviceCenterCtrl' };//服务中心
            states['ResidentLocation'] = { url: '/angular/ResidentLocation', templateUrl: '/WebScripts/Views/Monitor/ResidentLocation.html', controller: 'residentLocationCtrl' };//会员位置
            states['StartTaskLocation'] = { url: '/angular/StartTaskLocation', templateUrl: '/WebScripts/Views/Monitor/StartTaskLocation.html', controller: 'startTaskLocationCtrl' };//任务开始时位置
            states['EndTaskLocation'] = { url: '/angular/EndTaskLocation', templateUrl: '/WebScripts/Views/Monitor/EndTaskLocation.html', controller: 'endTaskLocationCtrl' };//任务结束时位置
            states['MonitorSOS'] = { url: '/angular/MonitorSOS', templateUrl: '/WebScripts/Views/Monitor/MonitorSOS.html', controller: 'MonitorSOSCtrl' };//监控SOS信息

            //前台工作站
            states['PreOrderList'] = { url: '/angular/PreOrderList', templateUrl: '/WebScripts/Views/GuestService/PreOrderList.html', controller: 'PreOrderListCtrl' };//预约服务
            states['ComOrderList'] = { url: '/angular/ComOrderList', templateUrl: '/WebScripts/Views/GuestService/ComOrderList.html', controller: 'ComOrderListCtrl' };//社区服务订单管理


            //排号管理
            states['CallPatient'] = { url: '/angular/CallPatient', templateUrl: '/WebScripts/Views/Sequence/CallPatient.html', controller: 'CallPatientCtrl' };//叫号管理

            states['SerialAdjustment'] = { url: '/angular/SerialAdjustment', templateUrl: '/WebScripts/Views/Sequence/SerialAdjustment.html', controller: 'SerialAdjustmentCtrl' };//叫号管理
            states['ScreenDisplay'] = { url: '/angular/ScreenDisplay', templateUrl: '/WebScripts/Views/Sequence/ScreenDisplay.html', controller: 'ScreenDisplayCtrl' };
            

            states['SerialAdjustment'] = { url: '/angular/SerialAdjustment', templateUrl: '/WebScripts/Views/Sequence/SerialAdjustment.html' };//叫号管理
            states['ScreenDisplay'] = { url: '/angular/ScreenDisplay', templateUrl: '/WebScripts/Views/Sequence/ScreenDisplay.html' , controller: 'ScreenDisplayCtrl'};

            states['AppointStatistics'] = { url: '/angular/AppointStatistics', templateUrl: '/WebScripts/Views/Sequence/AppointList.html', controller: 'appointListCtrl' };
            //收费作业
            states['Payment'] = { url: '/angular/Payment', templateUrl: '/WebScripts/Views/DC/FinancialManagement/Payment.html', controller: 'PaymentCtrl' };//缴费作业
            states['Refund'] = { url: '/angular/Refund', templateUrl: '/WebScripts/Views/DC/FinancialManagement/Refund.html', controller: 'RefundCtrl' };//退费作业

            states['DayReport'] = { url: '/angular/DayReport', templateUrl: '/WebScripts/Views/Report/DayReportTempManage.html', controller: 'dayReportTempManageCtrl' };
            states['MonthReport'] = { url: '/angular/MonthReport', templateUrl: '/WebScripts/Views/Report/MonthReportTempManage.html', controller: 'monthReportTempManageCtrl' };

            //统计
            states['GroupLookBI'] = { url: '/angular/GroupLookBI', templateUrl: '/WebScripts/Views/BI/GroupLookBI.html', controller: 'GroupLookBICtrl' };
            states['GroupLookSqBI'] = { url: '/angular/GroupLookSqBI', templateUrl: '/WebScripts/Views/BI/GroupLookSqBI.html', controller: 'GroupLookSqBICtrl' };

            states['ComprehensiveStatistics'] = { url: '/angular/ComprehensiveStatistics', templateUrl: '/WebScripts/Views/BI/ComprehensiveStatistics.html', controller: 'ComprehensiveStatisticsCtrl' };//综合统计
            states['FileStatistics'] = { url: '/angular/FileStatistics', templateUrl: '/WebScripts/Views/BI/FileStatistics.html', controller: 'FileStatisticsCtrl' };//档案统计
            states['MembershipStatistics'] = { url: '/angular/MembershipStatistics', templateUrl: '/WebScripts/Views/BI/MembershipStatistics.html', controller: 'MembershipStatisticsCtrl' };//会员统计
            states['ServiceOrderStatistics'] = { url: '/angular/ServiceOrderStatistics', templateUrl: '/WebScripts/Views/BI/ServiceOrderStatistics.html', controller: 'ServiceOrderStatisticsCtrl' };//服务订单统计
            states['WorkOrderStatistics'] = { url: '/angular/WorkOrderStatistics', templateUrl: '/WebScripts/Views/BI/WorkOrderStatistics.html', controller: 'WorkOrderStatisticsCtrl' };//工单统计

            states['MainReport'] = { url: '/angular/MainReport', templateUrl: '/WebScripts/views/Report/MainStatistic.html' };//综合报表
            states['OrderReport'] = { url: '/angular/OrderReport', templateUrl: '/WebScripts/views/Report/OrderStatistic.html', controller: 'OrderStatisticCtrl' };//工单报表
            states['EvaluationReport'] = { url: '/angular/EvaluationReport', templateUrl: '/WebScripts/views/Report/EvaluationStatistic.html', controller: 'EvaluationStatisticCtrl' };//评价报表

            states['FlowChart'] = { url: '/angular/FlowChart', templateUrl: '/WebScripts/Views/FlowChart/chart.html', controller: '' };//流程图测试

            states['TimeStatistics'] = { url: '/angular/TimeStatistics', templateUrl: '/WebScripts/Views/ActivityManage/TimeStatistics.html', controller: 'timeStatisticsCtrl' };//志愿者时间银行
            //活动 Activity
            states['ActivityList'] = { url: '/angular/ActivityList', templateUrl: '/WebScripts/Views/ActivityManage/ActivityList.html', controller: 'activityListCtrl' };
            states['ActivityAdd'] = { url: '/angular/ActivityAdd', templateUrl: '/WebScripts/Views/ActivityManage/ActivityEdit.html', controller: 'activityEditCtrl' };
            states['ActivityEdit'] = { url: '/angular/ActivityEdit/:id', templateUrl: '/WebScripts/Views/ActivityManage/ActivityEdit.html', controller: 'activityEditCtrl' };
            states['GroupActivityCategory'] = { url: '/angular/GroupActivityCategory', templateUrl: '/WebScripts/Views/ActivityManage/GroupActivityCategory.html', controller: 'GroupActivityCategoryCtrl' };//团体活动分类
            states['GroupActivityCategoryEdit'] = { url: '/angular/GroupActivityCategoryEdit/:ID', templateUrl: '/WebScripts/Views/ActivityManage/GroupActivityCategoryEdit.html', controller: 'GroupActivityCategoryEditCtrl' };//团体活动分类编辑
            setVersion(states);
            $locationProvider.html5Mode(true);

            $("#content").addClass("content-default-img");   //内容区设置默认背景
        }
]).run(['$rootScope', '$log', '$filter', '$state', 'resourceFactory', function ($rootScope, $log, $filter, $state, resourceFactory) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        //var isAuthenticated = false;
        //$.each($rootScope.MyMenus, function (i, v) {
        //    if ($.grep(v.Functions, function (item) { return item.Url == toState.name; }).length == 0) {
        //        isAuthenticated = true;
        //        return false;
        //    }
        //});
        //if (!isAuthenticated) {
        //    $state.go(fromState.name);
        //    utility.message("没有权限访问该页面");
        //    return;
        //}
        var data = $rootScope.MyMenus;
        angular.forEach(data, function (e) {
            angular.forEach(e.Functions, function (fun) {
                if (fun.Url === toState.name) {              
                    $rootScope.currentMenu = fun;
            }
        });
        });

        var height = $(window).height();
        //$("#sidebar").height(height - 67);
        $("#content").height(height - 67);
        $("#content").removeClass("content-default-img");   //清除内容区设置默认背景

        switch (toState.name) {
            case "ServiceCenter":
                $("#content").children("div:eq(0)").hide();
                $("html").css("overflow","hidden");
                $("body").css("overflow","hidden");
                $(window).scrollTop(0);
                break;
            default:
                $("#content").children("div:eq(0)").show();
                $("html").css("overflow","auto");
                $("body").css("overflow","auto");
                break;
        }
        $rootScope.previousState_name = fromState.name;
        $rootScope.previousState_params = fromParams;
    });
    $rootScope.goBack = function (defaultState) {//实现返回的函数
        if ($rootScope.previousState_name) {
            $state.go($rootScope.previousState_name, $rootScope.previousState_params);
        } else {
            $state.go(defaultState);
        }

    };
}]);
