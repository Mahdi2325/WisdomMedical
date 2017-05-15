/*
        创建人: 李林玉
        创建日期:2016-05-17
        说明: 预约登记
*/

angular.module("sltcApp")

.controller('appointmentCtrl', ['$scope', 'resourceFactory', 'utility', function ($scope, resourceFactory, utility) {
    var appointmentRes = resourceFactory.getResource("appointmentRes");
    //顯示列表頁
    $scope.displayMode = "list";
    //初始化Data
    $scope.Data = {}
    //初始化編輯Ietm
    $scope.currentItem = {};
    //
    $scope.Info = {};
    $scope.TextShow = false;
    //
    $scope.init = function () {
        appointmentRes.query(function (data) {
            $scope.Data.priepedList = data;
        });

    };

    $scope.change = function (x) {
        if (x == "D") {
            $scope.TextShow = true;
        }
        else {
            $scope.TextShow = false;
        }
    };
    $scope.keyup = function (x) {
        var l = x.length;
        if (l == 1) {
            var regx = /^[A-Za-z]/;
            var rs = regx.exec(x);
            if (rs == null) {
                $scope.currentItem.IdNo = "";
            }
        }
        else if (l > 1 && l <= 10) {

            var c = x.substring(l - 1)
            var regx = /[0-9]/;
            var rs = regx.exec(c);
            if (rs == null) {
                $scope.currentItem.IdNo = x.substring(0, l - 1)
            }

        }
        else {
            $scope.currentItem.IdNo = x.substring(0, 10)
        }
    };

    function checkOut(card) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(card) === false) {
            return false;
        }
        return true;
    }
    //新建資料編輯頁
    $scope.CreatePreipd = function () {
        $scope.currentItem = { Audit: '0', SourceType: '1', Sex: 'M' };
        $scope.recStatus = true;
        $scope.TextShow = false;
        $scope.displayMode = "edit";
    };

    //編輯修改
    $scope.rowSelect = function (item) {
        $scope.recStatus = false;
        if (item.RecStatus == "D") {
            $scope.TextShow = true;
        }
        else {
            $scope.TextShow = false;
        }
        $scope.currentItem = item;
        $scope.displayMode = "edit";
    };

    //編輯保存
    $scope.savePreipd = function (item) {
        if (item.Idcard != "" && checkOut(item.Idcard) == false) {
            utility.message("请确保身份证格式正确!");
        }
        else {
            if (angular.isDefined(item.id)) {
                $scope.updateItem(item);
            } else {
                $scope.createItem(item);
            }
            $scope.currentItem = {};
            $scope.displayMode = "list";
        }
    };

    //修改保存
    $scope.updateItem = function (item) {
        appointmentRes.save(item, function (data) {
            utility.message("保存成功！");
        });
    };

    //創建保存
    $scope.createItem = function (item) {
        item.RANo = "使用Id 替换";
        $scope.currentItem.RecStatus = "P";
        appointmentRes.save($scope.currentItem, function (data) {
            $scope.Data.priepedList.push(data);
            utility.message("保存成功！");
        });
        $scope.displayMode = "list";
    };

    //刪除
    $scope.deleteItem = function (item) {
        if (confirm("您确定要删除改预约登记信息吗?")) {
            appointmentRes.delete({ id: item.id }, (function () {
                utility.message("" + item.Name + "的预约信息已删除！");
                $scope.Data.priepedList.pop(item);
            }));
        }
    };

    //取消編輯返回列表頁
    $scope.cancelPreipd = function () {
        $scope.displayMode = "list";
    };

    $scope.init();
}]);