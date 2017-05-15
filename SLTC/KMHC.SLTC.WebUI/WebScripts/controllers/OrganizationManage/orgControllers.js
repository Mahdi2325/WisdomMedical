/*
创建人: 刘承（Alex）
创建日期:2016-05-16
说明: 机构管理
*/
angular.module("sltcApp")
.controller("orgListCtrl", ['$scope', '$filter', '$location', 'utility', 'resourceFactory', function ($scope, $filter, $location, utility, resourceFactory) {
    var orgRes = resourceFactory.getResource("orgs");
    $scope.isCanDo = $scope.user.IsGroupAdmin;
    $scope.Data = {
        Orgs: [],
        Groups: [],
        IsRoot: false   // 判断是否权限用户
    };

    $scope.loadOrgs = function () {
        $scope.options = {
            buttons: [], //需要打印按钮时设置
            ajaxObject: orgRes, //异步请求的res
            params: { 'Data.OrgName': "" },
            success: function (data) { //请求成功时执行函数               
                $scope.Data.Orgs = data.Data;
            },
            pageInfo: {
                //分页信息
                CurrentPage: 1,
                PageSize: 10
            }
        };
    };
    $scope.loadOrgs();



    var qSelect = {};

    //查询所有
    $scope.init = function () {

        groupRes.query().$promise.then(function (result) {
            $scope.Data.Groups = result;
            orgRes.query(qSelect, function (result) {
                //TODO 对接真实服务端后不再需要自己获取集团名称
                //start
                angular.forEach(result, function (e) {
                    var group = $filter('filter')($scope.Data.Groups, { GroupNo: e.GroupNo || '' })[0];
                    e.GroupName = angular.isDefined(group) ? group.GroupName : e.GroupNo;
                });
                //end
                $scope.Data.Orgs = result;
            });
        });
    };

    //删除
    $scope.OrgDelete = function (org) {
        utility.confirm("您确定删除该机构信息吗?", function (result) {
            if (result) {
                orgRes.delete({ id: org.OrganizationID }, function (data) {
                    utility.message("删除成功");
                    $scope.Data.Orgs.splice($scope.Data.Orgs.indexOf(org), 1);
                    $scope.options.search();
                });
            }
        });
    };

}])
.controller("orgDtlCtrl", ['$scope', '$location', '$stateParams', '$filter', '$timeout', 'webUploader', 'utility', 'resourceFactory', function ($scope, $location, $stateParams, $filter, $timeout,webUploader, utility, resourceFactory) {
    var orgRes = resourceFactory.getResource("orgs");
    var groupRes = resourceFactory.getResource("groups");
    $scope.isCanDo = $scope.user.IsAdmin;
    $scope.Data = {
        Groups: [],
        Org: {},
        IsRoot: false   // 判断是否权限用户
    };

    $scope.filterObj = function (filterObj, condition) {
        return $filter('filter')(filterObj, condition)[0];
    }


    $scope.init = function () {
       
        //获取集团数据
        var gr = groupRes.get({
            CurrentPage: 1,
            PageSize: 100
        }).$promise.then(function (data) {
            $scope.Data.Groups = data.Data;
            if ($scope.user.IsGroupAdmin) {
                $scope.Data.Org.GroupID = $scope.user.GroupId;
            }
        });
        if ($stateParams.id) {
            //获取机构数据
            orgRes.get({ id: $stateParams.id }, function (data1) {
                var data = data1.Data;
                $scope.Data.Org = data;
                $scope.OrgAddressDetail = data.City + data.Address;
            });
        } else {
            var codeRuleRes = resourceFactory.getResource("codeRules");
            codeRuleRes.get({
                "CodeKey": "OrgCode",
                "GenerateRule": "None",
                "Prefix": "O",
                "SerialNumberLength": 4,
                "OrganizationID": $scope.$root.user.OrgId
            }, function (data) {
                $scope.Data.Org.OrgNo = data.Data;
            });
        }
    }

    //获取机构地理位置并保存机构信息。
    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $scope.saveOrganization = function (item) {
            if (!item.Lng) {
                var myGeo = new BMap.Geocoder();
                var addressDetail = item.City + item.Address + item.HouseNumber;
                myGeo.getPoint(addressDetail, function (point) {
                    if (point) {
                        item.Lng = point.lng;
                        item.Lat = point.lat;
                    }
                    saveOrgDataToDB(item);
                }, item.City);
            } else {
                saveOrgDataToDB(item);
            }
        };
    });

    function saveOrgDataToDB(item) {
        orgRes.save(item, function () {
            utility.message(item.OrgName + "的信息保存成功！");
            $location.url('/angular/OrgList');
        });
    }

    //保存编辑内容
    $scope.save = function () {
        $scope.saveOrganization($scope.Data.Org);
    };
    webUploader.init('#PicturePathPicker', { category: 'OrgLogo' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
        if (data.length > 0) {
            $scope.Data.Org.LogoPath = data[0].SavedLocation;
            $scope.$apply();
        }
    });

    $scope.addressInput = function (data) {
        if (data.Address) {
            $scope.OrgAddressDetail = data.City + data.Address;
            $scope.Data.Org.City = data.City;
            $scope.Data.Org.Address = data.Address;
            $scope.Data.Org.HouseNumber = data.HouseNumber;
        }
        if (data.Lng) {
            $scope.Data.Org.Lng = data.Lng;
            $scope.Data.Org.Lat = data.Lat;
        }
    };
    $scope.init();
}]);

