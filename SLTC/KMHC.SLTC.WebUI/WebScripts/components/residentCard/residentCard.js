angular.module("extentComponent")
.directive("residentCard", ['prePaymentRes', function (prePaymentRes) {
    return {
        resctict: "EA",
        templateUrl: "/WebScripts/components/residentCard/residentCard.html",
        scope: {
            //value: "@value",
            callbackFn: "&callback"
        },
        controller: ['$scope', function ($scope) {
            $scope.currentResident = {
                ImgUrl: "/Images/0.png"
            }
            $scope.afterSelected = function (item) {
                $scope.currentResident = item;//设置ResidentCard的currentResident
                $scope.currentResident.TotalConSpeMonth = 0;
                $scope.currentResident.Amount = 0;
                prePaymentRes.query(function (data) {
                    angular.forEach(data, function (curdata, index, array) {
                        if (curdata.ResidentNo == $scope.currentResident.ResidentNo) {
                            var TotalConSpeMonth = 0;
                            if (curdata.TotalConSpeMonth) {
                                TotalConSpeMonth = curdata.TotalConSpeMonth;
                            }
                            $scope.currentResident.TotalConSpeMonth = TotalConSpeMonth;
                            $scope.currentResident.Amount = curdata.Amount;
                        }
                    });
                });
                if (!$scope.currentResident.ImgUrl) {
                    if (item.ImgUrl != "" && item.ImgUrl != null)
                        $scope.currentResident.ImgUrl = item.ImgUrl;//PhotoPath.PhotoPath;
                    else
                        $scope.currentResident.ImgUrl = "/Images/0.png";
                }
                $scope.callbackFn({ resident: item });//回调
            }
        }],
        link: function (scope, element, attrs) {
            if (attrs.layoutDirection) {
                if (attrs.layoutDirection == "horizontal") {
                    element.find("#cardImgArea").removeClass("col-sm-12").addClass("col-sm-4");
                    element.find("#cardInfoArea").removeClass("col-sm-12").addClass("col-sm-8");
                } else if (attrs.layoutDirection == "auto") {
                    element.find("#cardImgArea").addClass("modal-card");
                    element.find("#cardInfoArea").addClass("modal-card");
                }
            }
        }
    }
}]);
