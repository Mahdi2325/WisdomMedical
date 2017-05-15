/*
说明:長照字典表多選手輸 Lei
*/
angular.module("extentComponent")
.directive("selectMultipleValue", ['$rootScope', '$timeout', '$http', function ($rootScope, $timeout, $http) {
    return {
        resctict: "A",
        require: '?ngModel',
        link: function (scope, element, attrs, ngModel) {
            var id = attrs["id"];
            var hold = false;
            var editSelection = false;
            if (angular.isDefined(attrs["hold"])) {
                hold=true;
            }
            if (angular.isDefined(attrs["edit"])) {
                editSelection = true;
            }
            if (!ngModel || angular.isUndefined(id)) return;
            var tmpDics = $rootScope.TmpWord;
            var dics = $rootScope.TmpLCWord;//缩写
            var codeId = attrs["selectMultipleValue"];
            var defaultFirst = attrs["defaultFirst"];
            var ms = $('#' + id).magicSuggest({
                displayField: 'ItemName',
                valueField: 'ItemName',
                allowFreeEntries: false,
                maxSelection: 100,
                resultAsString: true,
                autoCollapse: hold,
                allowEdit: editSelection
            });
            $(ms).on('selectionchange', function (e, m) {
                var arrayVals = this.getValue();
                var arrlength = arrayVals.length;
                if (arrlength > 0) {
                    var newValue = arrayVals.join(',');
                    if (angular.isDefined(attrs["ngMaxlength"]) && attrs["ngMaxlength"] != "") {
                        var maxlength = attrs["ngMaxlength"];
                        if(maxlength<newValue.length){
                            ms.clear();
                            ms.setValue(arrayVals.slice(0, arrlength-1));
                        } else {
                            ngModel.$setViewValue(newValue);
                        }
                    } else {
                        ngModel.$setViewValue(newValue);
                    }
                } else {
                    ngModel.$setViewValue("");
                }
            });
            ngModel.$render = function () {
                if (angular.isString(ngModel.$viewValue)) {
                    var oldVal = ms.getValue();
                    var newVal = ngModel.$viewValue.split(',');
                    newVal= $.grep(newVal, function (n) { return $.trim(n).length > 0; })
                    if (oldVal.sort().toString() != newVal.sort().toString()) {
                        ms.clear();
                        ms.setValue(newVal);
                    }
                } else {
                    ms.clear();
                }
                ms.collapse();
            };
            var initControl = function () {
                ms.setData(dics[codeId]);
                if (angular.isDefined(scope.$parent.$eval(defaultFirst))) {
                    if (dics[codeId].length > 0) {
                      ms.setValue(dics[codeId][0].ItemName.split(','));
                    }
                }
            }
            if (!angular.isDefined(dics[codeId])) {
                dics[codeId] = {};
                if (tmpDics.length === 0) {
                    $timeout(function () {
                        $http.post("api/Code", { ItemTypes: tmpDics }).success(function (response, status, headers, config) {
                            $.each(response.Data, function (key, value) {
                                dics[key] = response.Data[key];
                            });
                            tmpDics.splice(0, tmpDics.length);
                        });
                    }, 100);
                }
                tmpDics.push(codeId);
            }
            scope.$watch(function () {
                return dics[codeId].length;
            }, function () {
                if (dics[codeId].length > 0) {
                    initControl();
                }
            });
        }
    }
}]);
