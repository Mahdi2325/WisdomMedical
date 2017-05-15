
angular.module('sltcApp')
.controller('DCActivityCtrl', ['$scope', '$http', 'utility', '$state', 'DCActivityRes', '$rootScope', 'DCDataDicListRes', function ($scope, $http, utility, $state, DCActivityRes,$rootScope, DCDataDicListRes) {
    //顯示列表頁
    $scope.displayMode = "list";
    $scope.TextShow = true;
    $scope.Data = {};
    //初始化編輯Ietm
    $scope.currentItem = {};

    $scope.Data.priepedList = [];
    //  { id: "1", seqno: "1", titlename: "酸甜苦辣", itemname: "感官/春霖" },
    //  { id: "2", seqno: "1", titlename: "春節", itemname: "懷舊" },
    //]; 

    $scope.options = {
        
            buttons: [],//需要打印按钮时设置
            ajaxObject: DCActivityRes,//异步请求的res
            params: { keyWord: "", Activecode: "", orgid: "" },
            success: function (data) {//请求成功时执行函数

                $scope.Data.priepedList = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
    
    };

    
    $scope.initorglist = function () {
        //机构数据 SuperAdmin
        DCDataDicListRes.get({ flag: "33", staus: 0, datatyp: "1" }, function (data) {
            $scope.Orglist = data.Data;
        });
        
        $scope.OrgISSelect = true;
        if ($rootScope.Global.MaximumPrivileges == "SuperAdmin")
        { $scope.OrgISSelect = false; }
    };

    $scope.save = function (currentItem) {

        DCActivityRes.save($scope.currentItem, function (data) {

            $scope.options.search();
        });
        utility.message("添加成功");
        $scope.TextShow = true;
        $scope.displayMode = "list";
    };

    $scope.Delete = function (item) {

        if (confirm("您确定删除该活动信息吗?")) {

            DCActivityRes.delete({ id: item.ID }, function (data) {
                $scope.options.search();

            })
            utility.message("删除成功");
        }
    }

    //新建編輯頁
    $scope.CreatePreipd = function () {
        //$scope.recStatus = true;
        //$scope.TextShow = false;
        $scope.currentItem = {};
        $scope.displayMode = "edit";
        $scope.TextShow = false;
    };

    //編輯修改
    $scope.rowSelect = function (item) {
        $scope.recStatus = false;
        $scope.currentItem = item;
        $scope.TextShow = false;
        $scope.displayMode = "edit";

    };
 

    //修改保存
    $scope.updateItem = function (item) {
        //item.$save();
        /*  DCActivityRes.save($scope.currentItem, function (data) {
            utility.message("儲存成功！");
        });
        $scope.currentItem = {};*/
        $scope.displayMode = "edit";
    };

    //修改保存
    $scope.radioclick = function () {
        // item.$save();
        /*  DCActivityRes.save($scope.currentItem, function (data) {
              utility.message("儲存成功！");
          });
          $scope.currentItem = {};*/
        //$scope.currentItem.typename = "(小组活动)";
    };

 
    //取消編輯返回列表頁
    $scope.cancelPreipd = function () {

        /*$scope.options.search();
        $scope.currentItem = {};*/
        $scope.displayMode = "list";
        $scope.TextShow = true;
    };

    $scope.initorglist();
}]);
