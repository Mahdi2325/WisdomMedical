angular.module("extentComponent")
.directive("residentSelect", ['$q', '$rootScope', 'resourceFactory', function ($q, $rootScope, resourceFactory) {
    return {
        resctict: "EA",
        templateUrl: "/WebScripts/components/residentSelect/residentSelect.html",
        scope: {
            //value: "@value",
            callbackFn: "&callback"
        },
        controller: ['$scope', function ($scope) {
            $scope.currentResident = {
                ImgUrl: "/Images/0.png"
            }

            $scope.options = {};
            $scope.options.params = {};

            $scope.Filter = {};
            $scope.Filter.Residents = [];

            $scope.Commpent = {};
            $scope.Commpent.Residents = [];
            $scope.Commpent.Resident = {};

            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: resourceFactory.getResource("residentRes"),//异步请求的res
                params: { 'Data.Keywords': "", 'Data.Sex': "" },
                success: function (data) {//请求成功时执行函数
                    $scope.Commpent.Residents = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                },
                customPageFooter: function() {
                    return "<div class='col-sm-12'><div class='dataTables_info' style='padding-top: 5px;'><label>显示<select size='1' ng-model='options.pageInfo.PageSize' ng-options='t.Value as t.Text for t in options.selectRows.opt' aria-controls='datatable2' class='input-sm' ng-change='changePageSize()' > </select>行</label><label style='margin-left: 15px;'>总共 {{options.pageIndexRender.sum}} 条</label></div></div> ";
                }
            }
            $scope.$watch("options.params['Data.Sex']", function (newValue, oldVaule) {
                if ($scope.options.search) {
                    $scope.options.search();
                }
            });
            $scope.$watch("options.params['Data.Keywords']", function (newValue, oldVaule) {
                if ($scope.options.search) {
                    $scope.options.search();
                }
            });
            $rootScope.item = {};
            //点击事件
            $scope.rowClick = function (item, selTr) {
                var oObj = selTr.target;
                if (oObj.tagName.toLowerCase() == "td") {
                    var oTr = oObj.parentNode;
                    var oTable = oTr.parentNode;
                    for (var i = 0; i < oTable.rows.length; i++) {
                        oTable.rows[i].style.backgroundColor = "";
                        oTable.rows[i].tag = false;
                    }
                    oTr.style.backgroundColor = "#E1E9FD";
                    oTr.tag = true;
                }
                if ($rootScope.item == item) {
                    return;
                }
                $rootScope.item = item;
                //$scope.Commpent.Resident = angular.copy(item);
                $scope.Commpent.Resident = item;//设置ResidentCard的currentResident
                console.log("item" + item);
                $scope.Commpent.Resident.TotalConSpeMonth = 0;
                $scope.Commpent.Resident.Amount = 0;

                $q.when(getPrePaymentInfo()).then(function (info) {
                    info.RemainingMoney = info.Amount - info.TotalConSpeMonth;//余额     
                    $scope.callbackFn({ resident: info });//回调
                });
                return;
            };
            $scope.over = function (selTr) {
                var oObj = selTr.target;
                if (oObj.tagName.toLowerCase() == "td") {
                    var oTr = oObj.parentNode;
                    if (!oTr.tag) oTr.style.backgroundColor = "#E1E9FD";
                }
            };
            $scope.out = function (selTr) {
                var oObj = selTr.target;
                if (oObj.tagName.toLowerCase() == "td") {
                    var oTr = oObj.parentNode;
                    if (!oTr.tag) oTr.style.backgroundColor = "";
                }
            };
            $scope.$on("refreshPrePaymentInfo", function () {
                getPrePaymentInfo();
            });

            var getPrePaymentInfo = function () {
                var deferred = $q.defer();
                resourceFactory.getResource("prePaymentRes").get({ id: $scope.Commpent.Resident.ResidentID }, function (data1) {
                    var curData = $scope.Commpent.Resident;
                    var curdata = data1.Data;
                    if (data1 != null && data1.Data != null) {
                        if (!angular.isUndefined(curdata.TotalConSpeMonth)) {
                            $scope.Commpent.Resident.TotalConSpeMonth = curdata.TotalConSpeMonth;
                        };
                        if (!angular.isUndefined(curdata.Amount)) {
                            $scope.Commpent.Resident.Amount = curdata.Amount;
                        }
                        $scope.Commpent.Resident.RemainingMoney = $scope.Commpent.Resident.Amount - $scope.Commpent.Resident.TotalConSpeMonth;//余额                           
                        if (!$scope.Commpent.Resident.ImgUrl) {
                            if ($scope.Commpent.Resident.ImgUrl != "" && $scope.Commpent.Resident.ImgUrl != null)
                                $scope.Commpent.Resident.ImgUrl = $scope.Commpent.Resident.ImgUrl;//PhotoPath.PhotoPath;
                            else
                                $scope.Commpent.Resident.ImgUrl = "/Images/0.png";
                        }
                        curData = $scope.Commpent.Resident;
                    }
                    deferred.resolve(curData);
                });
                return deferred.promise;
            }


            var rowNo = -1;
            document.onkeydown = function (event) {
                var tElement = $("#tb tbody tr"), indis = -1, len = tElement.length;

                //Up,down事件的标识代码
                if ((event.keyCode == 38 && (rowNo = ((rowNo == 0 || rowNo == -1) ? len : rowNo)) > -2) || (event.keyCode == 40 && (indis = 1) && (rowNo = (rowNo == len - 1 ? -1 : rowNo)) > -2)) {

                    for (var k = 0; k < len; k++) {
                        tElement[k].style.backgroundColor = "lightgray";
                    }
                    tElement[rowNo += indis].style.backgroundColor = "#FFFFFF";
                }

                //Enter事件的标识代码
                if (event.keyCode == 13 && rowNo != -1) {
                    for (var k = 0; k < len; k++) {
                        if (rowNo == k) {
                            tElement[k].click();
                        }
                    }
                }
            }




        }]

        //,
        //link: function (scope, element, attrs) {
        //    if (attrs.layoutDirection) {
        //        if (attrs.layoutDirection == "horizontal") {
        //            element.find("#cardImgArea").removeClass("col-sm-12").addClass("col-sm-4");
        //            element.find("#cardInfoArea").removeClass("col-sm-12").addClass("col-sm-8");
        //        } else if (attrs.layoutDirection == "auto") {
        //            element.find("#cardImgArea").addClass("modal-card");
        //            element.find("#cardInfoArea").addClass("modal-card");
        //        }
        //    }
        //}
    }
}]);
