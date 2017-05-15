/*
创建人: 刘承（Alex）
创建日期:2016-06-04
说明: 区域管理
*/
angular.module("sltcApp")
.controller("areaListCtrl", ['$scope', '$http', '$location', '$state', 'resourceFactory', 'utility', function ($scope, $http, $location, $state, resourceFactory, utility) {
    $scope.Data = { Areas: [], Orgs: [] };
    //查询选项
    $scope.params = {};
    //资源实例化
    var areaRes = resourceFactory.getResource("area");

    $scope.init = function () {
        $scope.options = {
            buttons: [], //需要打印按钮时设置
            ajaxObject: areaRes, //异步请求的res
            params: { 'Data.AreaName': "" },
            success: function (data) { //请求成功时执行函数               
                $scope.Data.Areas = data.Data;
            },
            pageInfo: {
                //分页信息
                CurrentPage: 1,
                PageSize: 10
            }
        };
    };
    $scope.init();


    $scope.AreaEdit = function (item) {
        $scope.$broadcast('OpenAreaEdit', item);
    }

    $scope.$on('SavedArea', function (e, data) {
        $('#modalAreaEdit').modal('hide');
        $scope.options.search();
    });

    //删除
    $scope.Delete = function (item) {
        utility.confirm("您确定删除该信息吗?", function (result) {
            if (result) {
                areaRes.delete({ id: item.AreaID }, function (data) {
                    utility.message("删除成功");
                    $scope.Data.Areas.splice($scope.Data.Areas.indexOf(item), 1);
                });
            }
        });
    };

}])
.controller("areaEditCtrl", ['$scope', '$http', '$location', '$stateParams', '$timeout', 'utility', 'resourceFactory', function ($scope, $http, $location, $stateParams, $timeout, utility, resourceFactory) {

    //资源实例化
    var areaRes = resourceFactory.getResource("area");
    var orgRes = resourceFactory.getResource("orgs");

    //获取编辑对象
    $scope.editGetData = function (data) {
        $scope.prePostData = {};
        $scope.Data = { Area: {}, Orgs: [] };
        //获取机构数据
        orgRes.get({
            CurrentPage: 1,
            PageSize: 100,
            "Data.OrgIds": $scope.$root.user.OrgId
        }, function (data) {
            $scope.Data.Orgs = data.Data;
            $scope.Data.Area.OrganizationID = $scope.$root.user.OrgId;
        });

        if (data) {
            //获取机构数据
            $scope.Data.Area = data;
            $scope.AreaAddress = data.City + data.Address;
            $scope.isAdd = false;
        } else {
            $scope.isAdd = true;
            var codeRuleRes = resourceFactory.getResource("codeRules");
            codeRuleRes.get({
                "CodeKey": "AreaCode",
                "GenerateRule": "None",
                "Prefix": "A",
                "SerialNumberLength": 4,
                "OrganizationID": $scope.$root.user.OrgId
            }, function (data) {
                $scope.Data.Area.AreaNo = data.Data;
                $scope.AreaAddress = "";
            });
        }
    }

    //保存编辑内容
    $scope.save = function () {
        if (!objEquals($scope.prePostData, $scope.Data.Area)) {
            angular.copy($scope.Data.Area, $scope.prePostData);
        } else {
            utility.message("请不要重复提交数据");
            return;
        }

        areaRes.save($scope.Data.Area, function (data) {
            utility.message($scope.Data.Area.AreaName + "的信息保存成功！");
            $scope.$emit("SavedArea");
        });
    };

    $scope.$on("OpenAreaEdit", function (event, item) {
        $scope.editGetData(item);
    });

    $scope.addressInput = function (data) {
        if (data.Address) {

            $scope.AreaAddress = data.City + data.Address;
            $scope.Data.Area.City = data.City;
            $scope.Data.Area.Address = data.Address;
            $scope.Data.Area.HouseNumber = data.HouseNumber;
        }
        if (data.Lng) {
            $scope.Data.Area.Lng = data.Lng;
            $scope.Data.Area.Lat = data.Lat;
        }
    };

}])
.controller("areaBatchAddCtrl", ['$scope', '$filter', '$http', '$location', '$stateParams', 'utility', 'resourceFactory', function ($scope, $filter, $http, $location, $stateParams, utility, resourceFactory) {
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
        },
        reset: function () {
            $scope.info = '';
            $scope.error = '';
        }
    }

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

    $scope.saveItemBatch = function () {
        log.reset();//清空日志
        if (angular.isDefined($scope.content)) {

            try {
                $scope.items = angular.fromJson($scope.content);
            } catch (ex) {
                log.error("解析失败,请输入正确的JSON格式");
            }

            var areaRes = resourceFactory.getResource("area");
            areaRes.get({ "Data.OrganizationID": $scope.$root.user.OrgId }).$promise.then(function (data1) {
                var allArea = data1.Data;
                if (angular.isArray($scope.items)) {
                    //解析成功
                    angular.forEach($scope.items, function (e) {

                        if (angular.isDefined(e.AreaNo)//区域编号,必须
                            && angular.isDefined(e.AreaName)//区域名称,必须
                            && '' != e.AreaNo.trim()
                            && '' != e.AreaName.trim()
                            ) {
                            //TODO 如果已经存在的不添加,对接真实服务器后不用再判断
                            var area = $filter('filter')(allArea, { AreaNo: e.AreaNo })[0];
                            if (angular.isDefined(area)) {
                                log.error(e.AreaNo + " " + e.AreaName + "已存在");
                            } else {
                                areaRes.save({
                                    AreaNo: e.AreaNo,
                                    AreaName: e.AreaName,
                                    Description: e.Description,
                                    Address: e.Address,
                                    OrganizationID: $scope.$root.user.OrgId //机构编码取当前用户
                                }, function () {
                                    log.info(e.AreaNo + " " + e.AreaName + " 添加成功");
                                }, function (error) {
                                    //TODO 对接真实服务器要加返回错误的处理
                                });
                            }

                        } else {
                            log.error(e.AreaName + " 信息不完整,被丢弃");
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

