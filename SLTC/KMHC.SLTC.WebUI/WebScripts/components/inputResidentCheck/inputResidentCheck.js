/*
创建人:陳磊
创建日期:2016-03-29
说明:用於入住登記模塊 校驗入住用戶姓名
*/
angular.module("extentComponent")
.directive("inputResidentCheck", ['resourceFactory', '$timeout', function (resourceFactory, $timeout) {
    return {
        resctict: "E",
        templateUrl: "/WebScripts/components/inputResidentCheck/inputResidentCheck.html",
        scope: {
            value: "@value",
            callbackFn: "&callback",
            required: "@required"
        },
        controller: ['$scope', function ($scope) {
            $scope.searchWords = "";
            var personRes = resourceFactory.getResource('personRes');
            $scope.keySearch = function () {
                $scope.showList = false;
                if (angular.isDefined($scope.searchWords) && $scope.searchWords != "") {
                    personRes.get({ "Data.SearchKey": $scope.searchWords, "Data.AuditState": "" }, function (data) {//过滤掉未认证用户档案
                        if (data.Data) {
                            $scope.showList = true;
                            $scope.Selected = false;
                            $scope.residents = data.Data;
                        }
                    });
                }
            }

            $scope.blur = function () {
                $timeout.cancel($scope.t1);
                $scope.t1 = $timeout(function () {
                    $scope.showList = false;
                }, 150)
            }

            $scope.focus = function () {
                if (!$scope.Selected) {
                    $scope.keySearch();
                }
            }

            $scope.KeyPress = function ($event) {
                if (window.event && window.event.keyCode == 13) {
                    window.event.returnValue = false;
                }
            }


            $scope.rowClick = function (item) {
                $scope.Selected = true;
                $scope.value = item.Name;
                $scope.searchWords = item.Name;//输入框显示选择的编码
                $scope.callbackFn({ item: item });//回调函数
                $scope.showList = false;//隐藏列表
                return false;
            };

            //按鍵盤
            var rowNo = -1;
            document.onkeydown = function (event) {
                var tElement = $("#tb tbody tr"), indis = 1;

                //Up事件的标识代码
                if (event.keyCode == 38 || (event.keyCode == 40 && (indis = -1))) {
                    for (var k = 0; k < tElement.length; k++) {
                        tElement[k].style.backgroundColor = "lightgray";
                    }
                    if (rowNo == 0) {
                        rowNo = tElement.length;
                    }
                    if (tElement[rowNo + indis]) {
                        tElement[rowNo += indis].style.backgroundColor = "#FFFFFF";
                    }
                }


                //Enter事件的标识代码
                if (event.keyCode == 13) {
                    for (var k = 0; k < tElement.length; k++) {
                        if (rowNo == k) {
                            tElement[k].click();
                        }
                    }
                }
            }
        }]
    }
}]);
