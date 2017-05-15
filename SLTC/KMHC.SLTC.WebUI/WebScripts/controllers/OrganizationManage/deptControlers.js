/*
创建人: 刘承
创建日期:2016-05-24
说明:楼层管理
*/

angular.module("sltcApp")
    .controller("deptListCtrl", ['$scope', '$http', '$location', '$state', 'resourceFactory', 'utility', function ($scope, $http, $location, $state, resourceFactory, utility) {
        var deptGetRes = resourceFactory.getResource('deptGetRes');
        $scope.Data = {};
        $scope.Data.Depts = {};

        //查询选项
        $scope.init = function () {
            $scope.options = {
                buttons: [], //需要打印按钮时设置
                ajaxObject: deptGetRes, //异步请求的res
                params: { 'Data.DeptName': "" },
                success: function (data) { //请求成功时执行函数               
                    $scope.Data.Depts = data.Data;
                },
                pageInfo: {
                    //分页信息
                    CurrentPage: 1,
                    PageSize: 10
                }
            };
        };
        $scope.init();

        $scope.DeptEdit = function (item) {
            $scope.$broadcast('OpenDeptEdit', item);
        }

        $scope.$on('SavedDept', function (e, data) {
            $('#modalDeptEdit').modal('hide');
            $scope.options.search();
        });

        //删除
        $scope.delete = function (item) {
            utility.confirm("您确定删除该部门吗?", function (result) {
                if (result) {
                    deptGetRes.delete({ id: item.DeptID }, function (data) {
                        utility.message("删除成功");
                        $scope.options.search();
                    });
                }
            });
        };
    }])
    .controller("deptEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'resourceFactory',  function ($scope, $location, $stateParams, utility, resourceFactory) {
        var deptGetRes = resourceFactory.getResource('deptGetRes');
        //获取编辑对象
        $scope.editGetData = function (data) {
            $scope.prePostData = {};
            $scope.Data = { Dept: {} };

            if (data) {
                //获取机构数据
                $scope.Data.Dept = data;
                $scope.isAdd = false;
            } else {
                $scope.isAdd = true;
                var codeRuleRes = resourceFactory.getResource("codeRules");
                codeRuleRes.get({
                    "CodeKey": "DeptCode",
                    "GenerateRule": "None",
                    "Prefix": "D",
                    "SerialNumberLength": 4,
                    "OrganizationID": $scope.$root.user.OrgId
                }, function (data) {
                    $scope.Data.Dept.DeptNo = data.Data;

                });
                $scope.Data.Dept.OrganizationID = $scope.$root.user.OrgId;
            }
        }

        //保存编辑内容
        $scope.save = function () {
            if (!objEquals($scope.prePostData, $scope.Data.Dept)) {
                angular.copy($scope.Data.Dept, $scope.prePostData);
            } else {
                utility.message("请不要重复提交数据");
                return;
            }

            deptGetRes.save($scope.Data.Dept, function (data) {
                utility.message("部门信息保存成功！");
                $scope.$emit("SavedDept");
            });
        };


        $scope.$on("OpenDeptEdit", function (event, item) {
            $scope.editGetData(item);
        });
    }]);