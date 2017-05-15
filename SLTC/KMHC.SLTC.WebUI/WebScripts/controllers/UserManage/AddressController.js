/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp")
.controller("AddressListCtrl", ['$scope', '$rootScope', '$http', '$state', '$stateParams', '$location', 'utility', 'resourceFactory', function ($scope, $rootScope, $http, $state, $stateParams, $location, utility, resourceFactory) {

    var addressRes = resourceFactory.getResource('addressRes');

    $scope.InitAddressList = function () {

        addressRes.get({ "residentID": $stateParams.residentId }, function (data) {
            $scope.AddressList = data.Data;
        });
    }

    $scope.AddressEdit = function (item) {
        $scope.$emit('OpenAddressEdit_ToParent', item);
    }

    $scope.$on('SavedAddress', function (e, data) {
        $('#modalEditAddress').modal('hide');
        $scope.InitAddressList();
    });

    $scope.AddressDelete = function (Item) {
        utility.confirm("您确定删除该地址吗?", function (result) {
            if (result) {
                addressRes.delete({ id: Item.AddressID }, function (data) {
                    $scope.InitAddressList();
                });
            }
        });
    }

    $scope.SelAddress = function (address) {
        $scope.$emit('SelAddress_ToParent', address);
    }

    $scope.InitAddressList();
}])
.controller("AddressEditCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'webUploader', 'utility', 'resourceFactory', function ($scope, $state, $stateParams,$timeout, webUploader, utility, resourceFactory) {

    var addressRes = resourceFactory.getResource('addressRes');

    var map;
    var myValue;
    var ac;
    $scope.InitAddressData = function (Data) {
        $scope.curAddress = {IsUsed:false};

        if (Data) {
            $scope.isAdd = false;
            $scope.curAddress = Data;
            $scope.AddressDetail = Data.City + Data.Address;
        } else {
            $scope.isAdd = true;
            $scope.curAddress.residentID = $stateParams.residentId
        }
    }

    $scope.saveEdit = function () {
        addressRes.save($scope.curAddress, function (newItem) {
            if (newItem.IsSuccess) {
                utility.message("地址保存成功");
                $scope.$emit('SavedAddress_ToParent');
            }
            else {
                utility.message(newItem.ResultMessage);
            }
        });
    };

    $scope.addressInput = function (data) {
        if (data.Address) {
            $scope.AddressDetail = data.City + data.Address;
            $scope.curAddress.City = data.City;
            $scope.curAddress.Address = data.Address;
            $scope.curAddress.HouseNumber = data.HouseNumber;
        }

        if (data.Lng) {
            $scope.curAddress.Lng = data.Lng;
            $scope.curAddress.Lat = data.Lat;
        }
    };

    $scope.HideModal = function () {
        $("#modalEditAddress").modal("hide");
    };

    $scope.$on("OpenAddressEdit", function (event, data) {
        $scope.InitAddressData(data);
    });

}]).controller("AddressInputCtrl", ['$scope', '$state', '$stateParams', '$timeout', 'webUploader', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, $timeout, webUploader, utility, resourceFactory) {

    var map;
    var myValue;
    var ac;

    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        map = new BMap.Map("l-map");
        map.centerAndZoom('北京', 12);                   // 初始化地图,设置城市和地图级别。

        ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
                "input": "suggest"
            , "location": map
            });

        //var geolocation = new BMap.Geolocation();
        //var gc = new BMap.Geocoder();
        //geolocation.getCurrentPosition(function (r) {
        //    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        //        var pt = r.point;
        //        gc.getLocation(pt, function (rs) {
        //            var addComp = rs.addressComponents;
        //            var city = addComp.city;
        //            map.centerAndZoom(city, 12);                   // 初始化地图,设置城市和地图级别。
        //        })
        //    }
        //});
        ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
            var str = "";
            var _value = e.fromitem.value;
            var value = "";
            if (e.fromitem.index > -1) {
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province + _value.city + _value.district + _value.street + _value.business;
            }
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            $("#searchResultPanel").html(str);
        });

        ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            $("#searchResultPanel").html("onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue);
            $scope.InputAddress.City = _value.city;
            $scope.InputAddress.Address = _value.district + _value.street + _value.business;
            $scope.InputAddress.HouseNumber = _value.streetNumber;
            $("#searchResultPanel").hide();
            setPlace();
        });
    });


    function setPlace() {
        map.clearOverlays();    //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            map.centerAndZoom(pp, 18);
            map.addOverlay(new BMap.Marker(pp));    //添加标注
            $scope.InputAddress.Lng = pp.lng;
            $scope.InputAddress.Lat = pp.lat;
            $scope.$apply();
        }
        var local = new BMap.LocalSearch(map, { //智能搜索
            onSearchComplete: myFun
        });
        local.search(myValue);
    }

    $scope.InitAddressInput = function (address) {
        $scope.InputAddress = {};

        if (address) {
            $scope.InputAddress = address;
            $scope.Suggest = address.City + address.Address;
            myValue = $scope.Suggest;
            setPlace();
        }
    }

    $scope.saveEdit = function () {
        $scope.$emit("HasInputAddress", $scope.InputAddress);
        $("#modalInputAddress").modal("hide");
    };


    $scope.HideModal = function () {
        $("#modalInputAddress").modal("hide");
    };

    $scope.$on("OpenInputAddress", function (event, address) {
        $scope.InitAddressInput(address);
        $timeout(function () {
            if (document.getElementsByClassName("tangram-suggestion-main") != undefined) {
                document.getElementsByClassName("tangram-suggestion-main")[0].style.display = 'none';
            }
        }, 500);
    });

}]);
