angular.module("sltcApp")
.controller("taskDispatchCtrl", ['$scope', '$http', '$location', '$timeout', '$stateParams', '$filter', 'resourceFactory', 'utility',
    function ($scope, $http, $location,$timeout, $stateParams, $filter, resourceFactory, utility) {
        $scope.Data = {
            Tasks: [],
            Orders: [],
            ServiceItems: [],
            emps: [],
            Task: {},
            EmpTypeNo: '6124', //服务人员，如果编号发生改变，则这里也需要进行相应的改变
        };

        //查询选项
        $scope.options = {};
        $scope.options.params = {};

        var orgId = $scope.$root.user.OrgId;

        //资源实例化
        var taskRes = resourceFactory.getResource("taskRes");
        //var serviceorderRes = resourceFactory.getResource("serviceorderRes");
        //var serviceItemRes = resourceFactory.getResource("serviceItemRes");
        //var residentRes = resourceFactory.getResource("residentRes");
        var personRes = resourceFactory.getResource("persons");
        var employeeRes = resourceFactory.getResource("employees");

        $scope.filterObj = function (filterObj, condition) {
            return $filter('filter')(filterObj, condition)[0];
        }

        //获取服务人员信息
        employeeRes.get({ 'Data.OrgId': orgId, 'Data.JobTitle': '6124', 'pageSize': 0 }, function (emps) {
            $scope.Data.emps = emps.Data;
        });

        //初始化数据
        $scope.init = function () {
            $scope.options = {
                buttons: [],
                ajaxObject: taskRes,
                params: { 'Data.Name': "", 'Data.Status': ['Wait'], 'Data.IsCancel': false },
                success: function (data) {
                    $scope.Data.Tasks = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                }
            }
           
        };
        $scope.init();


        //Item点击事件
        $scope.ItemClick = function (item) {
            $scope.$broadcast('selTask', item);
            $('#modalDispatch').modal('show');
        }

        $scope.changeEmp = function (id) {
            var tmpEmp = $scope.filterObj($scope.Data.emps, { EmployeeID: id });//服务人员
            if (tmpEmp != null) {
                $scope.Data.Task.EmployeeName = tmpEmp.EmpName;
            }
        }

        $scope.TaskToShow = function (id) {
            $location.url('/angular/TaskEdit/' + id + '/0');
        }

        $scope.search = function () {
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.search();
        }

        $("#modalDispatch").on('hidden.bs.modal', function () {
            $("#btnSearch").click();
        })
    }]).controller("DispatchTaskCtrl", ['$scope', '$http', '$location', '$stateParams', '$filter', 'resourceFactory', 'utility',
    function ($scope, $http, $location, $stateParams, $filter, resourceFactory, utility) {
        $scope.Data = {
            Dates:[],
            emps: [],
            EmpTypeNo: '6124', //服务人员，如果编号发生改变，则这里也需要进行相应的改变
        };

        //查询选项
        $scope.options = {};
        $scope.options.params = {};

        var orgId = $scope.$root.user.OrgId;

        //资源实例化
        var taskRes = resourceFactory.getResource("taskRes");
        var employeeRes = resourceFactory.getResource("employees");
        var dispatchTaskRes = resourceFactory.getResource("dispatchTaskRes");
        
        $scope.filterObj = function (filterObj, condition) {
            return $filter('filter')(filterObj, condition)[0];
        }

        $scope.options = {
            buttons: [],
            ajaxObject: dispatchTaskRes,
            params: { 'Data.OrgId': orgId, 'Data.JobTitle': '6124', 'Data.CurrentDate': new Date().format("yyyy-MM-dd") },
            success: function (data) {
                $scope.Data.emps = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        }

        //初始化数据
        $scope.InitDispatch = function () {
            var curDate = newDate($scope.Data.SelTask.AppointmentTime).format("yyyy-MM-dd");
            if (curDate.replace(/-/g, "") * 1 < new Date().format("yyyyMMdd") * 1) {
                curDate = new Date().format("yyyy-MM-dd");
            }
            $scope.options.params['Data.CurrentDate'] = curDate;
            $scope.GetDateList();
            $scope.CurrentMinDate = new Date().dateAdd('n', 15).getTime();
            $scope.options.search();          
        };

        $scope.GetDateList = function () {
            $scope.Data.Dates = [];
            var show_day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
            var selDate = $scope.options.params['Data.CurrentDate'];

            var nowDate = newDate(selDate);
            for (var i = 0; i < 5; i++) {
                var strCurrentDate = nowDate.format("yyyy-MM-dd");
                $scope.Data.Dates.push(strCurrentDate + " " + show_day[nowDate.getDay()]);
                nowDate.dateAdd('d', 1);
            }
        }

        $scope.TdActive = function (date, tag) {
            if ($scope.Data.SelTask != undefined && $scope.Data.SelTask.AppointmentTime != undefined) {
                var selDate = newDate($scope.Data.SelTask.AppointmentTime);
                var selTag = 0;
                if (selDate.getHours()>13) {
                    selTag = 1;
                }
                var tdDate = newDate(date);
                if (tdDate.format("yyyy-MM-dd") == selDate.format("yyyy-MM-dd") && tag == selTag) {
                    return true;
                }
            }
            return false;
        }

        $('#modalDispatch').on('show.bs.modal',
         function () {
             $scope.InitDispatch();
         });


        $scope.$on('selTask', function (e, data) {
            $scope.Data.SelTask = data;
        });
        //提交派发信息
        $scope.Assign = function (date,empid,empname, flag) {
            var tdDate = newDate(date).format("yyyy-MM-dd");
            
            utility.confirm("安排【" + empname + "】在【" + tdDate + " " + (flag==0?"上午":"下午") + "】上门服务?", function (result) {
                if (result) {
                    $scope.Data.SelTask.OperatorId = $scope.$root.user.UserId; //当前登录人
                    $scope.Data.SelTask.Operator = $scope.$root.user.DisplayName; //当前登录人
                    var currentDate = new Date().format("yyyy-MM-dd hh:mm:ss");
                    $scope.Data.SelTask.EmployeeId = empid;
                    $scope.Data.SelTask.EmployeeName = empname;
                    $scope.Data.SelTask.AppointmentTime = tdDate + " " + (flag == 0 ? "8:00:00" : "13:00:00");
                    $scope.Data.SelTask.CreateDate = currentDate;
                    $scope.Data.SelTask.OperatorTime = currentDate;
                    $scope.Data.SelTask.Status = "Assign";
                    taskRes.save($scope.Data.SelTask, function (data) {
                        utility.message("指派完成.");
                        $('#modalDispatch').modal("hide");
                    });
                }
            });

        }
        $scope.search = function () {
            $scope.GetDateList();
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.search();
        }

    }])