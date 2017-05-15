/*
        创建人: 李林玉
        创建日期:2016-06-05
        说明: 入住机构设定
*/
angular.module("sltcApp")
.controller("residentSetOrgCtrl", ['$scope', 'utility', 'resourceFactory', function ($scope, utility, resourceFactory) {

    var residentRes = resourceFactory.getResource("residentRes");
    var areaRes = resourceFactory.getResource("area");
    var orgRes = resourceFactory.getResource("orgRes");

    $scope.Data = {};
    // 當前住民
    $scope.currentPerson = {}
    $scope.buttonShow = false;
    $scope.currentItem = { ResidentOrg: null };

    ////查询所有
    $scope.init = function () {
        //当前用户所属机构
        orgRes.get({ organizationID: $scope.$root.user.OrgId }, function (data) {
            if (data.Data) {
                $scope.Data.UserOrg = data.Data;
            }
        });

        areaRes.get({ currentPage: 1, pageSize: 1000 }, function (data) {
            if (data.Data) {
                $scope.Areas = data.Data;
            }
        });
    };

    $scope.$on('OpenSetResident', function (e, person) {
        $scope.currentItem = person;
        if (person.ResidentID!=0) {
            residentRes.get({ id: person.ResidentID }, function (data) {
                if (data.Data) {
                    $scope.currentItem.AreaID = data.Data.AreaID;
                    $scope.currentItem.ResidentType = data.Data.ResidentType;
                }
            });
        }
    });

 
    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $scope.saveItem = function (item) {
            if (!$scope.currentItem.IdCard) {
                return false;
            }
            var myGeo = new BMap.Geocoder();
            var city = "";
            var addressDetail = "";
            if (item.City != null && typeof (item.City) != "undefined" && item.City.indexOf("-") > 0) {
                city = item.City.split("-")[0];
            }
            if (item.Address != null && typeof (item.Address) != "undefined") {
                addressDetail = item.City.replace(/-/g, "") + item.Address;
            }

            var model = {
                PersonID: item.PersonID,
                AreaID: item.AreaID,
                ResidentType: item.ResidentType
            };

            if (addressDetail!="") {
                myGeo.getPoint(addressDetail, function (point) {
                    if (point) {
                        model.Lng = point.lng;
                        model.Lat = point.lat;
                    }
                    $scope.SaveData(model);
                }, city);
            } else {
                $scope.SaveData(model);
            }
        };
    });

    $scope.SaveData=function(model){
        residentRes.save(model, function (data) {
            if (data.IsSuccess) {
                utility.message("保存成功。");
                $scope.$emit('RefreshAfterSetOrg');
            } else {
                utility.message(data.ResultMessage);
            }
        });
    }
    $scope.init();
}]);
