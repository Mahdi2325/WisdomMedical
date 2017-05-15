/*
创建人:肖国栋
创建日期:2016-03-17
说明:常用语选择
*/
angular.module("extentComponent")
.directive("selectItems", ['$rootScope', '$templateRequest', '$compile', '$timeout', '$http', function ($rootScope, $templateRequest, $compile, $timeout, $http) {
    return {
        resctict: "A",
        require: ['ngModel'],
        scope: true,
        link: function (scope, element, attrs, ctrls) {
            var ngModel = ctrls[0];
            var commonUseWords = $rootScope.CommonUseWords;//缩写
            var tmpCommonUseWords = $rootScope.TmpCommonUseWords;
            var typeName = attrs["selectItems"];// 獲取查詢數據類型

            element.css('background-color', '#ededed');

            if (!angular.isDefined(commonUseWords[typeName])) {
                commonUseWords[typeName] = {};
                if (tmpCommonUseWords.length == 0) {
                    $timeout(function () {
                        $http.post('api/CommonUseWord', { TypeNames: tmpCommonUseWords }).success(function (response, status, headers, config) {
                            $.each(response.Data, function (key, value) {
                                commonUseWords[key] = response.Data[key];
                            });
                            tmpCommonUseWords.splice(0, tmpCommonUseWords.length);
                        });
                    }, 100);
                }
                tmpCommonUseWords.push(typeName);
            }

            // 添加雙擊事件
            element.dblclick(function () {
                // 初始化模態框數據
                $rootScope.selectItems.init(function (type, selectValue) {
                    var value = selectValue;
                    if (type == 'append' && angular.isDefined(ngModel.$modelValue) && ngModel.$modelValue!=null) { // 累加
                        value = ngModel.$modelValue + value;
                    }
                    element.val(value);
                    ngModel.$setViewValue(value);
                });
                var loadDataAndOpenModal = function () {
                    // 初始化表格選擇框為未遷
                    angular.forEach(commonUseWords[typeName], function (item) { item.checked = false });
                    $rootScope.selectItems.CommonUseWords = commonUseWords[typeName];
                    $("#selectItems").modal('toggle');
                    $rootScope.$apply();
                }
                if (!angular.isDefined(commonUseWords[typeName])) {
                    commonUserWordRes.get({ TypeName: typeName }, function (data) {
                        commonUseWords[typeName] = data.Data;
                        loadDataAndOpenModal();
                    });
                }
                else {
                    loadDataAndOpenModal();
                }
            });
        }
    }
}]).run(['$rootScope', '$templateRequest', '$compile', function ($rootScope, $templateRequest, $compile) {
    $rootScope.CommonUseWords = {};
    $rootScope.TmpCommonUseWords = [];
    //添加html模板，不採用在directive中用templateUrl方式，是為了同時存在多個標識時，不會多次加載模板
    var tplUrl = '/WebScripts/components/selectItems/selectItems.html';
    $templateRequest(tplUrl).then(function (tplContent) {
        var tplEl = angular.element(tplContent.trim());
        var mobileDialogElement = $compile(tplEl)($rootScope);// 通过$compile动态编译html
        angular.element(document.body).append(mobileDialogElement);

        $rootScope.selectItems = {};
        var scope = $rootScope.selectItems;
        scope.init = function (callback) {
            scope.chkall = false;
            scope.keyWord = "";
            scope.buttonText = "選擇全部";
            scope.callback = callback;
        };
        scope.init({});

        // 獲取選擇數據
        var getSelectValue = function () {
            var selectItems = [];
            scope.filterItems = $("#selectItems input[type=checkbox]");
            angular.forEach(scope.filterItems, function (value, key) {
                if (value.checked) {
                    selectItems.push(value.name);
                }
            });
            return selectItems.join('，');
        };
        scope.add = function () {
            scope.callback('add', getSelectValue());
            $('#selectItems').modal('hide');
        };
        scope.append = function () {
            scope.callback('append', getSelectValue());
            $('#selectItems').modal('hide');
        };
        // 全選事件
        scope.chkAll = function (checked) {
            scope.chkall = !scope.chkall;
            scope.buttonText = scope.chkall ? "取消選擇" : "選擇全部";
            angular.forEach(scope.CommonUseWords, function (value, key) {
                value.checked = scope.chkall;
            });
        };
    });
}]);
