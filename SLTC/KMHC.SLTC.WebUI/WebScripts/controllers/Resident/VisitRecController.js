/*
        创建人: 李林玉
        创建日期:2016-05-18
        说明: 访探记录
*/
angular.module("sltcApp")
.controller("visitRecCtrl", ['$scope', 'dictionary', 'utility', 'resourceFactory', function ($scope, dictionary, utility, resourceFactory) {
    var visitRes = resourceFactory.getResource("visitRes");
    $scope.Data = {};
    // 當前住民
    $scope.currentResident = {}
    $scope.buttonShow = false;
    $scope.curUser = utility.getUserInfo();
    if (typeof ($scope.curUser) != 'undefined') {
        $scope.currentItem = { Operator: $scope.curUser.EmpNo };
    }

    //選中住民
    $scope.residentSelected = function (resident) {
        $scope.currentResident = resident;//獲取當前住民信息
        $scope.listItem($scope.currentResident);//加載當前住民的親友訪視記錄
        $scope.currentItem = {}//清空編輯項
        if (angular.isDefined($scope.currentResident.ResidentNo)) {
            $scope.buttonShow = true;
        }
    }
    $scope.change = function () {
        var o = $(event.srcElement).find("option:selected");
        if (o.length > 0) {
            $scope.currentItem.BloodRelationship = o.attr("kinship");
            $scope.currentItem.Appellation = o.attr("contrel");
        }
    }
    //获取住民的访探记录
    $scope.listItem = function (resident) {
        $scope.Data.RegVisitRecs = {};
        visitRes.query({}, function (data) {
            if (data && data.length > 0) {
                var filtered = [];
                angular.forEach(data,function (item) {
                    if (item.ResidentNo === resident.ResidentNo) {
                        filtered.push(item);
                    }
                });
                $scope.Data.RegVisitRecs = filtered;
            }
        });
    }
    //刪除親友訪視記錄
    $scope.deleteItem = function (item) {
        if (confirm("您确定要删除该住民的亲友访探记录吗?")) {
            visitRes.delete({ id: item.id }, function () {
                $scope.Data.RegVisitRecs.pop(item);
                utility.message($scope.currentResident.PersonName + "的访探记录刪除成功！");
            });
        }
    };

    $scope.createItem = function (item) {
        //新增親友訪視記錄，得到住民ID
        $scope.currentItem.ResidentNo = $scope.currentResident.ResidentNo;
        visitRes.save($scope.currentItem, function (data) {
            $scope.Data.RegVisitRecs.push(data);
        });
        $scope.currentItem = {};
    };


    $scope.updateItem = function (item) {        
        visitRes.save(item, function (data) {
            $scope.currentItem = {};
        });
    };

    $scope.rowSelect = function (item) {
        $scope.currentItem = item;
    };

    $scope.saveEdit = function (item) {
        if (angular.isDefined(item.id)) {
            $scope.updateItem(item);
        } else {
            $scope.createItem(item);
        }
        utility.message($scope.currentResident.PersonName + "的亲友访探信息保存成功！");
    };




}]);