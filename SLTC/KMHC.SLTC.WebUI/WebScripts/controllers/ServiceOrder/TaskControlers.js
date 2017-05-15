/*
创建人: 刘承
创建日期:2016-06-31
说明:任务管理
*/

angular.module("sltcApp")
    .controller("taskListCtrl", ['$scope', '$http', '$location', '$state', '$filter', 'resourceFactory', 'utility', function ($scope, $http, $location, $state, $filter, resourceFactory, utility) {
        $scope.Modal = { Task: {}, Evaluation: {}};//模态框数据操作
        $scope.isPhone = false;//非Pad操作
        //查询选项
        $scope.options = {};
        $scope.options.params = {};
        //资源实例化
        var taskRes = resourceFactory.getResource("taskRes");
        var employeeRes = resourceFactory.getResource("employees");
        var personRes = resourceFactory.getResource("persons");
        var taskChangeRes = resourceFactory.getResource("taskChangeRes");
        var evaluationRes = resourceFactory.getResource("evaluationRes");
        var orgId = $scope.$root.user.OrgId;
        $scope.Tasks = [];
        $scope.Emps = [];
        $scope.init = function () {
            $scope.options = {
                buttons: [],
                ajaxObject: taskRes,
                params: { 'Data.Name': "" },
                success: function (data) {
                    $scope.Tasks = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                }
            }
        };

        $scope.init();
        $scope.GetBack = function (item) {
            utility.confirm("您确定取消此次工单派遣吗?", function (result) {
                if (result) {
                    item.Status = 'Wait';
                    item.IsChange = null;
                    taskRes.save(item, function (data) {
                        utility.message("此次工单派遣已经取消。");
                        $scope.options.pageInfo.CurrentPage = 1;
                        $scope.options.search();
                    });
                }
            });

        }
        $scope.Change = function (item, flag) {
            $scope.Modal.Task = item;
            $scope.Modal.TaskRecord = null;
            $('#taskChange').modal("show");
        }
        $scope.Audit = function (item, flag) {
            $scope.Modal.Task = item;
            taskChangeRes.GetTaskChange({"TaskID":item.TaskID}, function (d) {
                if (d.IsSuccess && d.Data.length>0) {
                    $scope.Modal.TaskRecord = d.Data[0];
                    $scope.Modal.TaskRecord.IsAudit = null;
                }
                $('#taskAudit').modal("show");
            });
        }
        $scope.search = function () {
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.search();
        }

        /***
        *eg.
        *condition:{ PersonNo: $scope.Data.Persons.PersonNo }
        */
        $scope.filterObj = function (filterObj, condition) {
            return $filter('filter')(filterObj, condition)[0];
        }

        //获取服务人员信息
        employeeRes.get({ 'Data.OrgId': orgId, 'Data.JobTitle': '6124', 'pageSize': 0 }, function (emps) {
            $scope.Emps = emps.Data;
        });

        $scope.TaskEdit = function (Item, flag) {
            // 会员档案查询
            personRes.get({ 'id': Item.PersonID }, function (data) {
                $scope.Person = data.Data;
            });
            $scope.isCancel = false;
            $scope.EnableEdit = false;
            if ($scope.isPhone) {
                $location.url('/angular/TaskEdit/' + Item.TaskID + '/' + flag);
            } else {
                $scope.Modal.Task = Item;
                $scope.ServiceEmp = $scope.filterObj($scope.Emps, { EmployeeID: Item.EmployeeId });//服务人员//$scope.filterObj($scope.Emps, Item.EmployeeId);//服务人员
                if (Item.Status === "Cancel") {
                    $scope.isCancel = true;
                    $scope.Modal.Task.isCancel = true;
                }
                if (Item.Status=="Finish") {
                    $scope.EnableEdit = true;

                    evaluationRes.get({ 'Data.ServiceOrderID': Item.ServiceOrderID }, function (data) {
                        if (data.Data && data.Data.length>0) {
                            $scope.Modal.Evaluation = data.Data[0];
                            $scope.SelStar = $scope.Modal.Evaluation.Mark;
                        } else {
                            $scope.Modal.Evaluation = {};
                            $scope.SelStar = 0;
                        }
                    });
                }

                $('#modalCarryOut').modal("show");
            }
        }
        $scope.SelStar = 0;
        $scope.ClickStar = function (mark) {
            $scope.Modal.Evaluation.Mark = mark;
            $scope.SelStar = mark;
        }

        $scope.OnStar = function (mark) {
            $scope.Modal.Evaluation.Mark = mark;
        }

        $scope.LeaveStar = function () {
            $scope.Modal.Evaluation.Mark = $scope.SelStar;

        }

        //工单执行，由客服人员电话回访之后，填写保存
        $scope.TaskCarryOut = function () {
            //alert($scope.Modal.Task.isCancel);

            if (!$scope.Modal.Evaluation.Mark || $scope.Modal.Evaluation.Mark == 0) {
                utility.message("请选择会员满意度.");
                return;
            }
            $scope.Modal.Evaluation.EmployeeID = $scope.Modal.Task.EmployeeId;
            $scope.Modal.Evaluation.ServiceOrderID = $scope.Modal.Task.ServiceOrderID;
            $scope.Modal.Evaluation.CreateBy = $scope.Modal.Task.PersonID;
            $scope.Modal.Evaluation.CreateTime = new Date().format("yyyy-MM-dd hh:mm:ss");

            evaluationRes.save($scope.Modal.Evaluation, function (data) {
                utility.message("该工单评价信息保存成功.");
                $('#modalCarryOut').modal("hide");
            });
        }

        $scope.changeEmp = function () {
            var tmpEmp = $scope.filterObj($scope.Emps, { EmployeeID: $scope.Modal.Task.ExecutorId }); //$scope.filterObj($scope.Emps, $scope.Modal.Task.ExecutorId);//服务人员
            if (tmpEmp != null) {
                $scope.Modal.Task.Executor = tmpEmp.EmpName;
            }
        }

        $('#modalCarryOut').on('hidden.bs.modal', function (e) {
            $scope.options.search();
        });
        

        //保存改签
        $scope.SaveTaskChange = function () {
            //改签时间不能低于当前日期
            if (new Date().dateDiff('s', $scope.str2Date($scope.Modal.TaskRecord.AppointmentTime)) < 0) {
                utility.message("改签时间不能早于当前时间！");
                return false;
            }

            var json = {
                TaskID : $scope.Modal.Task.TaskID,
                AppointmentTime: $scope.Modal.TaskRecord.AppointmentTime,
                Result: $scope.Modal.TaskRecord.Reason,
                IsAudit : true
            };
            taskChangeRes.ChangeTask(json, function (d) {
                if (d.IsSuccess) {
                    utility.message("任务改签成功。");
                    $('#taskChange').modal("hide");
                    $scope.options.search();
                }                
            });
        }
        $scope.str2Date = function (datestr) {
            var date = null;
            if (datestr != null) {
                datestr = datestr.replace(/-/g, "/");
                date = new Date(datestr);
            }
            return date;
        }
        //保存改签审核意见
        $scope.SaveAudit = function () {
            var json = {
                ID: $scope.Modal.TaskRecord.ID,
                TaskID: $scope.Modal.Task.TaskID,
                AppointmentTime: $scope.Modal.TaskRecord.ServiceTime,
                IsAudit: $scope.Modal.TaskRecord.IsAudit=="1"?true:false
            };
            taskChangeRes.AuditTask(json, function (d) {
                if (d.IsSuccess) {
                    utility.message("任务改签已审核。");
                    $('#taskAudit').modal("hide");
                    $scope.options.search();
                }
            });
        }

        $scope.TaskToShow = function (id, flag) {
            var data = {id:id,flag:flag};
            $scope.$broadcast('OpenTask', data);
        }
    }])
   
    .controller("taskEditCtrl", ['$scope', '$http', '$location', '$stateParams', '$filter', 'resourceFactory', 'utility', function ($scope, $http, $location, $stateParams, $filter, resourceFactory, utility) {
        //任务签到
        //数据定义
        $scope.Data = { Task: {}, Order: {}, ServiceItem: {}, Resident: {}, ServicePerson: [], emp: {}, OrdersPersons: [], Address: {} };

        $scope.isPhone = false;//非Pad操作
        $scope.Task = {};
        //资源实例化
        var taskRes = resourceFactory.getResource("taskRes");
        //var serviceOrderRes = resourceFactory.getResource("serviceOrderRes");
        //var serviceItemRes = resourceFactory.getResource("serviceItemRes");
        //var residentRes = resourceFactory.getResource("residentRes");
        var personRes = resourceFactory.getResource("persons");
        var employeeRes = resourceFactory.getResource("employees");

        $scope.load = function (id,flag) {
            $scope.flag = flag;
            if ($scope.flag === 1) {
                $scope.isPhone = true;
            }

            if (id) {
                taskRes.get({ id: id }, function (data) {
                    $scope.Task = data.Data;
                    $scope.Task.AppointmentTime = $filter("timeFormat")($scope.Task.AppointmentTime);
                    $scope.Task.BeginTime = $filter("timeFormat")($scope.Task.BeginTime);
                    $scope.Task.OperatorTime = $filter("timeFormat")($scope.Task.OperatorTime);
                    if ($scope.Task.PersonID != null) {
                        personRes.get({ 'id': $scope.Task.PersonID }, function (data) {
                            $scope.Person = data.Data;
                        });
                    }
                    if ($scope.Task.EmployeeId != null) {
                        employeeRes.get({ 'id': $scope.Task.EmployeeId }, function (data) {
                            $scope.Employee = data.Data;
                        });
                    }
                    
                });
            }
        }
        /***
        *eg.
        *condition:{ PersonNo: $scope.Data.Persons.PersonNo }
        */
        $scope.filterObj = function (filterObj, condition) {
            return $filter('filter')(filterObj, condition)[0];
        }

        //personRes.query({}, function (persons) {
        //    $scope.Data.OrdersPersons = persons;
        //});


        //签到
        $scope.TaskSign = function () {
            //console.log($scope.Task.Status =="Execution" );
            if ($scope.Task.Status === "Cancel" || $scope.Task.Status === "Finish") {
                utility.message("工单已经完成.");
                return;
            }
            var curtime = new Date().format("yyyy-MM-dd hh:mm:ss");
            $scope.Task.BeginTime = curtime;
            $scope.Task.Status = 'Execution';
            taskRes.save($scope.Task, function (data) {
                if ($scope.flag === 0) {
                    $location.url("/angular/TaskList");
                } else if ($scope.flag === 1) {
                    $location.url("/angular/ProTaskManager");
                }

            });
        };

        //任务完成
        $scope.TaskComplate = function () {
            if ($scope.Task.ServiceType != 'Commodity' && ($scope.Task.BeginTime === "" || $scope.Task.BeginTime == undefined || $scope.Task.Status === "Wait" || $scope.Task.Status === "Assign")) {
                utility.message("请先开始签到");
                return;
            }
            var curtime = new Date().format("yyyy-MM-dd hh:mm:ss");
            $scope.Task.EndTime = curtime;
            $scope.Task.Status = 'Finish';
            taskRes.save($scope.Task, function (data) {
                //用于控制完成订单操作
                //console.log($scope.Data.Order);
                //$scope.Data.Order.OrderStutas = "订单完成";
                //serviceOrderRes.save($scope.Data.Order, function (order) {
                //    $location.url("/angular/TaskList");
                //});
                if ($scope.flag === 0) {
                    $location.url("/angular/TaskList");
                } else if ($scope.flag === 1) {
                    $location.url("/angular/ProTaskManager");
                }
            });
        }

        $scope.$on("OpenTask", function (event, data) {
            $scope.load(data.id,data.flag);
        });
    }])

    //个人工单管理
     .controller("proTaskManagerCtrl", ['$scope', '$http', '$location', '$state', '$filter', 'resourceFactory', 'utility', function ($scope, $http, $location, $state, $filter, resourceFactory, utility) {
         $scope.Data = {
             //Tasks: [],
             CurrentTasks: [],
             HistoryTasks: [],
             //Orders: [],
             //ServiceItems: [],
             //Residents: []
         };

         $scope.CurrentTask = {};

         //资源实例化
         var taskRes = resourceFactory.getResource("taskRes");
         //var serviceOrderRes = resourceFactory.getResource("serviceOrderRes");
         //var serviceItemRes = resourceFactory.getResource("serviceItemRes");
         //var residentRes = resourceFactory.getResource("residentRes");
         //var personRes = resourceFactory.getResource("persons");
         //var employeeRes = resourceFactory.getResource("employeeRes");
         //所属机构
         //var OrgNo = { OrgNo: $scope.$root.user.curOrgNo };
         var orgId = $scope.$root.user.OrgId;
         var empId = angular.isUndefined($scope.$root.user.EmpId) ? 0 : $scope.$root.user.EmpId;
         //查询选项
         $scope.options = {};
         $scope.options.params = {};

         $scope.init = function () {
             $scope.options = {
                 buttons: [],
                 ajaxObject: taskRes,
                 params: { 'Data.EmployeeId': empId, 'Data.Status': ['Assign', 'Execution'] },
                 success: function (data) {
                     $scope.Data.CurrentTasks = data.Data;
                 },
                 pageInfo: {//分页信息
                     CurrentPage: 1, PageSize: 10
                 }
             }
             $scope.HistoryOptions = {
                 buttons: [],
                 ajaxObject: taskRes,
                 params: { 'Data.EmployeeId': empId, 'Data.Status': ['Cancel', 'Finish'] },
                 success: function (data) {
                     $scope.Data.HistoryTasks = data.Data;
                 },
                 pageInfo: {//分页信息
                     CurrentPage: 1, PageSize: 10
                 }
             }
             ////服务项目
             //serviceItemRes.query({}, function (items) {
             //    $scope.Data.ServiceItems = items;
             //});
             ////住民信息查询
             //residentRes.query({}, function (residentDatas) {
             //    $scope.Data.Residents = residentDatas;
             //});
             ////任务查询
             //taskRes.query({ EmployeeNo: $scope.$root.user.Employee.EmpNo }, function (data) {
             //    $scope.Data.Tasks = data;
             //    serviceOrderRes.query({}, function (orderData) {
             //        $scope.Data.Orders = orderData;
             //        angular.forEach($scope.Data.Tasks, function (Item, i) {
             //            var order = $scope.filterObj(orderData, Item.SONo);
             //            $scope.Data.Tasks[i].orderItem = order;
             //        });
             //    });
             //    //历史工单
             //    $scope.Data.HistoryTasks = $filter("filter")($scope.Data.Tasks, function (a) {
             //        if (a.Status >= 3) {
             //            return true;
             //        } return false;
             //    });
             //    //当前工单
             //    $scope.Data.CurrentTasks = $filter("filter")($scope.Data.Tasks, function (a) {
             //        if (a.Status > 0 && a.Status < 3) {
             //            return true;
             //        } return false;
             //    });
             //});
         };

         $scope.init();

         $scope.search = function () {
             $scope.options.pageInfo.CurrentPage = 1;
             $scope.options.search();
         }

         /***
        *eg.
        *condition:{ PersonNo: $scope.Data.Persons.PersonNo }
        */
         $scope.filterObj = function (filterObj, condition) {
             return $filter('filter')(filterObj, condition)[0];
         }


         $scope.TaskToShow = function (id, flag) {
             var data = { id: id, flag: flag };
             $scope.$broadcast('OpenTask', data);
         }

         $scope.ServiceOrderInfo = function (item) {
             $scope.CurrentTask = item;
             //taskRes.get({ id: para_id }, function (data) {
             //    $scope.Data.Task = data;
             //    serviceOrderRes.query({ SONo: data.SONo }, function (orders) {
             //        $scope.Data.Order = orders[0];
             //        $scope.Data.Address = $scope.Data.Order.ServiceCity + "" + $scope.Data.Order.ServiceAddress

             //        //读取服务项目
             //        serviceItemRes.query({ SINo: $scope.Data.Order.SINo }, function (items) {
             //            $scope.Data.ServiceItem = items[0];

             //        });
             //        //读取所有住民信息
             //        residentRes.query({ ResidentNo: $scope.Data.Order.ResidentNo }, function (residents) {
             //            $scope.Data.Resident = residents[0];
             //            personRes.query({}, function (persons) {
             //                $scope.Data.Resident.Person = $scope.filterObj(persons, $scope.Data.Resident.PersonNo);
             //            });
             //        });
             //        //

             //    });

             //    //获取服务人员信息以及管理员信息
             //    employeeRes.query(OrgNo, function (emps) {
             //        $scope.Data.ServicePerson = $scope.filterObj(emps, $scope.Data.Task.EmployeeNo);
             //        $scope.Data.emp = $scope.filterObj(emps, $scope.Data.Task.Operator);
             //    });
             //});
         };

     }])
    

     .controller("taskSendCtrl", ['$scope', '$http', '$location', '$stateParams', '$filter', 'resourceFactory', 'utility', function ($scope, $http, $location, $stateParams, $filter, resourceFactory, utility) {

         //数据定义
         $scope.Data = { Task: {}, Order: {}, ServiceItem: {}, Resident: {}, ResidentArry: [], ServicePersons: [], emps: [] };

         //资源实例化
         var taskRes = resourceFactory.getResource("taskRes");
         var serviceOrderRes = resourceFactory.getResource("serviceOrderRes");
         var serviceItemRes = resourceFactory.getResource("serviceItemRes");
         var residentRes = resourceFactory.getResource("residentRes");
         var personRes = resourceFactory.getResource("persons");
         var employeeRes = resourceFactory.getResource("employees");

         //所属机构
         var OrgNo = { OrgNo: $scope.$root.user.curOrgNo };

         $scope.Data.EmpTypeNo = '63421';//护理人员，如果编号发生改变，则这里也需要进行相应的改变


         $scope.init = function () {
             if ($stateParams.id) {
                 taskRes.get({ id: $stateParams.id }, function (data) {
                     $scope.Data.Task = data;
                     serviceOrderRes.query({ SONo: data.SONo }, function (orders) {
                         $scope.Data.Order = orders[0];
                         $scope.Data.Order.ServiceAddress = $scope.Data.Order.ServiceCity + " " + $scope.Data.Order.ServiceAddress;
                         //循环获取指定的订单
                         //angular.forEach(orders, function (obj1, index1) {
                         //    if (obj1.SONo == orderId) {
                         //        $scope.Data.Order = obj1;
                         //        $scope.Data.Order.ServiceAddress = $scope.Data.Order.ServiceCity + " " + $scope.Data.Order.ServiceAddress;
                         //    }
                         //});
                         //读取服务项目
                         serviceItemRes.query({ SINo: $scope.Data.Order.SINo }, function (items) {
                             $scope.Data.ServiceItem = items[0];
                             //var itemId = $scope.Data.Order.SINo;
                             ////循环获取指定的服务项目
                             //angular.forEach(items, function (obj2, index2) {
                             //    if (obj2.SINo == itemId) {
                             //        $scope.Data.ServiceItem = obj2;
                             //    }
                             //});
                         });
                         //读取所有住民信息
                         residentRes.query({ ResidentNo: $scope.Data.Order.ResidentNo }, function (residents) {
                             $scope.Data.Resident = residents[0];
                             //$scope.Data.ResidentArry = residents;
                             //var residentNoId = $scope.Data.Order.ResidentNo;
                             ////循环获取指定的住民
                             //angular.forEach(residents, function (obj3, index3) {
                             //    if (obj3.ResidentNo == residentNoId) {
                             //        console.log(obj3);
                             //        $scope.Data.Resident = obj3;
                             //    }
                             //});
                         });
                         //

                     });
                 });

                 employeeRes.query({}, function (emps) {
                     $scope.Data.ServicePersons = $scope.Data.emps = emps;
                 });

             }
         }
         $scope.init();



         $scope.submit = function () {
             //console.log($scope.Data.Task);
             $scope.Data.Task.Status = 1;
             $scope.Data.Task.Operator = $scope.User.EmpNo;
             var curtime = new Date().format("yyyy-MM-dd hh:mm:ss");
             $scope.Data.Task.OperatorTime = curtime;
             taskRes.save($scope.Data.Task, function (data) {
                 $location.url("/angular/TaskList");
             });
         };
         //$scope.init();
     }])
    
//单页面，用于判断页面绑定数据加载完成操作，保证拖拽数据加载完成，在实例拖拽元素
.directive('onFinishRender', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                element.ready(function () {
                    $('.drag').draggable({
                        appendTo: 'body',
                        helper: 'clone'
                    });

                    $('#droptoggle').droppable({
                        activeClass: 'active',
                        hoverClass: 'hover',
                        accept: ":not(.ui-sortable-helper)", // Reject clones generated by sortable
                        drop: function (e, ui) {

                            var $el = $('<div class="drop-item">' + ui.draggable.find("[show='true']").text() + '[<span class="dempNp">' + ui.draggable.find("[idno='true']").text() + '</span>]</div>');
                            $el.append($('<span class="glyphicon glyphicon-trash" style="margin-left:5px;"></span>').click(function () { $(this).parent().detach(); }));
                            $(this).append($el);
                        }
                    }).sortable({
                        items: '.drop-item',
                        sort: function () {
                            // gets added unintentionally by droppable interacting with sortable
                            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
                            $(this).removeClass("active");
                        }
                    });
                });
            }
        }
    }
});
;
