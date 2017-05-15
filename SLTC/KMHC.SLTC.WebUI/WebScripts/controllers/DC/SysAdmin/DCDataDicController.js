
/*
创建人: zhongyh
创建日期:2016-06-6
说明:日照字典管理
*/

angular.module("sltcApp")
    .controller("DCDataDicListCtrl", ['$scope', '$http', '$location', '$state', '$rootScope', 'DCDataDicEditRes', 'DCDataDicListRes', 'DCDataDicOrglistRes', 'utility', function ($scope, $http, $location, $state, $rootScope, DCDataDicEditRes, DCDataDicListRes, DCDataDicOrglistRes, utility) {
        
        //$scope.items = [ {ITEMTYPE: "DC01.001", TYPENAME: "身份別", MODIFYFLAG: "A", DESCRIPTION:"测试数据", ORGID: "001"} ];
        $scope.init = function () {
            $scope.items = {};
            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: DCDataDicListRes,//异步请求的res
                params: { keyword: "", keyword2: "", MODIFYFLAG: "", orgid:"" },
                success: function (data) {//请求成功时执行函数
                    $scope.items = data.Data
                   // $scope.options.params.orgid = data.Data.orgid;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                }

            }
            $scope.options.params.OrgISSelect = true;
            if ($rootScope.Global.MaximumPrivileges == "SuperAdmin")
            { $scope.options.params.OrgISSelect = false; }

            $scope.initorglist();
           
        };
        
        
        $scope.initorglist = function () {
            //机构数据 SuperAdmin
            DCDataDicListRes.get({ flag: "33" ,staus:0,datatyp:"1"}, function (data) {
                $scope.Orglist = data.Data;
            });
            

             
        }
        $scope.delete = function (ITEMTYPE) {
            if (confirm("确定删除该信息吗?")) {
                
                DCDataDicEditRes.delete({ itemtype: ITEMTYPE }, function (data) {
                    //$scope.options.pageInfo.CurrentPage = 1;
                    //$scope.options.search();
                    utility.message("刪除成功");
                });
            }
        };

        $scope.init();
    }])

.controller("DCDataDicEditCtrl", ['$scope', '$location', '$stateParams', '$rootScope', 'utility', 'DCDataDicListRes', 'DCDataDicEditRes', 'DCDataDicEditDtlRes', function ($scope, $location, $stateParams, $rootScope, utility, DCDataDicListRes, DCDataDicEditRes, DCDataDicEditDtlRes) {
    $scope.init = function () {
        $scope.isAdd = true;
        $scope.isItemAdd = true;
        $scope.curItem = {};
        $scope.items = [];
        $scope.itemEdit = {};
        $scope.isedit = false;

        if ($stateParams.id) {
            $scope.isAdd = false;
            DCDataDicListRes.get({ ITEMTYPE: $stateParams.id }, function (data) {
               
                if (data.Data.MODIFYFLAG == 'A' || data.Data.MODIFYFLAG == 'N')
                {
                    $scope.isedit = true;//子项编辑删除按钮权限
                }
                //超级管理员都可以编辑删除
                if ($rootScope.Global.MaximumPrivileges == "SuperAdmin") {
                    $scope.isedit = false;//子项编辑删除按钮权限
                }
                $scope.curItem = data.Data;

                
                $scope.itemEdit.ITEMTYPE = $scope.curItem.TYPENAME;
            });
            DCDataDicEditDtlRes.get({ ITEMTYPE: $stateParams.id,currentPage:'1',  pageSize :'20'}, function (data) {

                $scope.items = data.Data;
               
            });
             
            $scope.OrgISSelect = true;
            $scope.ModifyflagISSelect = true;
            //超级管理员都可以编辑
            if ($rootScope.Global.MaximumPrivileges == "SuperAdmin")
            {
                $scope.OrgISSelect = false;
                $scope.ModifyflagISSelect = false;
            }


            $scope.initorglist("edit");
            
        }
        else//新增
        {
            $scope.OrgISSelect = true;
            if ($rootScope.Global.MaximumPrivileges == "SuperAdmin")
            {
                $scope.OrgISSelect = false;//超级管理可以选择组织
               
            }
            $scope.ModifyflagISSelect = false;
            $scope.initorglist("add");
            $scope.isedit = false;
            
        }
    }


    $scope.initorglist = function (addtype) {
        DCDataDicListRes.get({ flag: "33", staus: 0, datatyp: "1" }, function (data)
        {

            $scope.Orglist = data.Data;
        });

        

        if (addtype == "add")
        {
            DCDataDicListRes.get({ flag: "33", staus: 0, datatyp: "3" }, function (data) {

                $scope.curItem.ORGID = data.Data[0].orgid;
            });
        }
    }

    $scope.save = function (item) {
 
        DCDataDicEditRes.save(item, function () {
            if ($scope.isAdd) {
                $scope.itemEdit.ITEMTYPE = item.TYPENAME;
            }
            utility.message("添加成功");
            $location.url("/dc/DCDataDicList/");
        });
    };
    $scope.edit = function (item) {
        $scope.isItemAdd = false;
        $scope.itemEdit = item;
    }
    $scope.reset = function () {
        $scope.isItemAdd = true;
        $scope.itemEdit = {};
        $scope.itemEdit.ITEMTYPE = $scope.curItem.TYPENAME;
    }
    $scope.saveItem = function (itemEdit) {
        if ($scope.itemEdit.ITEMTYPE === "") {
            utility.message("保存失败,请先保存大项字典。");
            return;
        }
        if (!angular.isDefined(itemEdit.ITEMCODE) && !angular.isDefined(ITEMNAME)) {
            utility.message("保存失败,必填项子项编码没有填！");
            return;
        }
        if ($scope.itemEdit.ITEMCODE.length <= 0 && $scope.itemEdit.ITEMNAME.length <= 0) {
            utility.message("保存失败,子项编码必填项没有填！");
            return;
        }
        if (angular.isString($scope.itemEdit.ITEMCODE) && $scope.itemEdit.ITEMCODE.length > 20 &&
            angular.isString($scope.itemEdit.ITEMNAME) && $scope.itemEdit.ITEMNAME.length > 100 &&
            angular.isString($scope.itemEdit.DESCRIPTION) && $scope.itemEdit.DESCRIPTION.length > 256) {
            utility.message("保存失败,字段过长！");
            return;
        };
        DCDataDicEditDtlRes.save(itemEdit, function () {
            
            $scope.itemEdit = {};
            $scope.itemEdit.ITEMTYPE = $scope.curItem.TYPENAME;
            utility.message("保存子项明细成功");
            //if ($scope.isItemAdd) {
            //    $scope.items.push(item);
            //}

        });
    };

    $scope.deleteItem = function (item) {
        if (confirm("确定删除该信息吗?")) {
            DCDataDicEditDtlRes.delete({ type: item.ITEMTYPE, code: item.ITEMCODE }, function (data) {
                utility.message("刪除成功");
                DCDataDicEditDtlRes.get({ ITEMTYPE: item.ITEMTYPE, currentPage: '1', pageSize: '20' }, function (data) {

                    $scope.items = data.Data;
                });
                $scope.items.splice(item.ITEMCODE);
            }
            );
        }
    };

    $scope.returnList = function () {
        $location.url('/dc/DCDataDicList/');
    };

    $scope.init();
}]);