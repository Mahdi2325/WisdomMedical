/*
创建人: 刘承
创建日期:2016-05-24
说明:字典管理
*/

angular.module("sltcApp")
    .controller("codeListCtrl", ['$scope', '$http', '$location', '$state', 'codeFileRes', 'utility', function ($scope, $http, $location, $state, codeFileRes, utility) {
        $scope.Data = {};
        $scope.Data.Dictionaries = [];

        //查询选项
        $scope.options = {};
        $scope.options.params = {};

        //查询所有
        $scope.init = function () {
            $scope.options = {
                buttons: [],
                ajaxObject: codeFileRes,
                params: { 'Data.keywords': "" },
                success: function (data) {
                    $scope.Data.Dictionaries = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                }
            }
        }
        //删除
        $scope.delete = function (id) {
            utility.confirm("确定删除该信息吗?", function (result) {
                if (result) {
                    codeFileRes.delete({ id: id }, function (data) {
                        $scope.options.pageInfo.CurrentPage = 1;
                        $scope.options.search();
                        utility.message("刪除成功");
                    });
                }
            });

        };

        $scope.init();
    }])
.controller("codeEditCtrl", ['$scope', '$location', '$stateParams', 'utility', 'codeFileRes', 'dictionaryItemRes', function ($scope, $location, $stateParams, utility, codeFileRes, dictionaryItemRes) {
    //标题列表
    $scope.Data = {};
    $scope.Data.CurItem = {};
    $scope.Data.ChildItems = [];
    //子类项目添加
    //$scope.isAdd = true;
    $scope.isItemAdd = true;

    //$scope.items = [];
    $scope.itemEdit = {};

    $scope.init = function () {
        if ($stateParams.id) {
            //$scope.isAdd = false;
            codeFileRes.get({ id: $stateParams.id }, function (data) {
                $scope.Data.CurItem = data.Data;
                dictionaryItemRes.get({ dictionaryID: $stateParams.id }, function (data) {
                    $scope.Data.ChildItems = data.Data;
                    if ($scope.Data.ChildItems == undefined) {
                        $scope.Data.ChildItems = [];
                    }
                });
            });
        }
    }
    $scope.save = function (item) {
        codeFileRes.save(item, function (data) {
            $scope.Data.CurItem = data.Data;
            utility.message("操作成功");
        });
    };

    $scope.edit = function (item) {
        $scope.isItemAdd = false;
        $scope.itemEdit = item;
    }
    $scope.reset = function () {
        $scope.isItemAdd = true;
        $scope.itemEdit = {};
    }

    $scope.saveItem = function (item) {
        //console.log(item.TypeName + ";" + item.ItemCode + ":" + item.ORDERSEQ + ":" + item.Description);
        item.DictionaryID = $scope.Data.CurItem.DictionaryID;
        if ($scope.itemEdit.DictionaryID === undefined) {
            utility.message("保存失败,请先保存大项字典。");
            return;
        }
        if (!angular.isDefined($scope.itemEdit.ItemCode) && !angular.isDefined($scope.itemEdit.ItemName)) {
            utility.message("保存失败,必填项没有填！");
            return;
        }
        if ($scope.itemEdit.ItemCode.length <= 0 && $scope.itemEdit.ItemName.length <= 0) {
            utility.message("保存失败,必填项没有填！");
            return;
        }
        if (angular.isString($scope.itemEdit.ItemCode) && $scope.itemEdit.ItemCode.length > 20 &&
            angular.isString($scope.itemEdit.ItemName) && $scope.itemEdit.ItemName.length > 20 &&
            angular.isString($scope.itemEdit.Description) && $scope.itemEdit.Description.length > 200) {
            utility.message("保存失败,字段过长！");
            return;
        };
        
        dictionaryItemRes.save(item, function () {
            utility.message("保存成功");
            $scope.itemEdit = {};
            if ($scope.isItemAdd) {
                $scope.Data.ChildItems.push(item);
            }
        });

    };

    $scope.deleteItem = function (item) {
        if (confirm("确定删除该信息吗?")) {
            dictionaryItemRes.delete({ id: item.DictionaryItemID }, function (data) {
                utility.message("刪除成功");
                $scope.Data.ChildItems.splice($scope.Data.ChildItems.indexOf(item), 1);
            });
        }
    };

    $scope.returnList = function () {
        $location.url('/angular/CodeList');
    };

    $scope.init();
}])
.controller("codeBatchAddCtrl", ['$scope', '$location', '$filter', '$stateParams', 'utility', 'resourceFactory', function ($scope, $location, $filter, $stateParams, utility, resourceFactory) {
    var dictionaryRes = resourceFactory.getResource("dictionarys");
    var batchDictionaryRes = resourceFactory.getResource("batchDictionarys");
    
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
            var jsonList = {};
            if (angular.isArray($scope.items)) {
                //解析成功
                angular.forEach($scope.items, function (e) {

                    if (angular.isDefined(e.ItemType)//字典编号,必须
                        && angular.isDefined(e.TypeName)//字典名称,必须
                        && angular.isDefined(e.ItemCode)//子项编号,必须
                        && angular.isDefined(e.ItemName)//子项名称,必须
                        ) {
                        var json = {};
                        json = jsonList[e.ItemType];
                        if (!json) { json = { Dictionary: null, Items: {} }; jsonList[e.ItemType] = json; }
                        if ('' == e.TypeName.trim()) {
                            if ('' != e.ItemName.trim() && '' != e.ItemCode.trim()) {
                                json.Items[e.ItemCode] = {
                                    ItemCode: e.ItemCode.trim(),
                                    TypeName: e.TypeName.trim(),
                                    ORDERSEQ: e.ItemSort,
                                    Description: e.ItemDescription
                                };
                            }
                        } else {

                            json.Dictionary = {
                                ItemType: e.ItemType.trim(),
                                TypeName: e.TypeName.trim(),
                                ModifyFlag: e.ModifyFlag,
                                Description: e.TypeName
                            }
                            if ('' != e.TypeName.trim() && '' != e.ItemCode.trim()) {
                                json.Items[e.ItemCode] = {
                                    ItemCode: e.ItemCode.trim(),
                                    TypeName: e.TypeName.trim(),
                                    ORDERSEQ: e.ItemSort,
                                    Description: e.ItemDescription
                                };
                            }
                        }

                    } else {
                        log.error(e.ItemType + " " + e.TypeName + " 信息不完整,被丢弃");
                    }
                });

                //保存数据
                var sendRequest = function (Obj) {

                    dictionaryRes.get({ 'Data.ItemType': Obj.ItemType }, function (result) {
                        if (result.RecordsCount > 0) {
                            log.error(Obj.ItemType + " " + Obj.TypeName + "已存在");
                        } else {
                            var postData = [];
                            postData.push(Obj);
                            batchDictionaryRes.save(postData, function () {
                                log.info(Obj.ItemType + " " + Obj.TypeName + " 添加成功");
                            }, function (error) {
                                //TODO 对接真实服务器要加返回错误的处理
                            });
                        }
                    });

                };
                //解析成功
                for (var item in jsonList) {
                    var json = jsonList[item];
                    if (json && json.Items) {
                        var arr = [];
                        for (var obj in json.Items) {
                            arr.push(json.Items[obj]);
                        }
                        json.Dictionary.items = arr;
                        sendRequest(angular.copy(json.Dictionary));
                    }
                }

            } else {
                log.error("录入数据非JSON数组格式,请检查输入");
            }



        }


    }

}]);