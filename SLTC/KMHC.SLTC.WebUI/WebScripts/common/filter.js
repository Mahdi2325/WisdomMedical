///创建人:肖国栋
///创建日期:2016-03-24
///说明:自定义filter

(function () {
    var app = angular.module("extentFilter", []);

    app.filter('dateFormat', function () {
        return function (input, capitalize_index, specified_char) {
            input = input || '';
            if (input == "" || input == null) {
                return "";
            }
            var output = (newDate(input)).format("yyyy-MM-dd");
            return output;
        };
    });

    app.filter('timeFormat', function () {
        return function (input, capitalize_index, specified_char) {
            input = input || '';
            if (input == "" || input == null) {
                return "";
            }
            var output = (newDate(input)).format("yyyy-MM-dd hh:mm:ss");
            return output;
        };
    });

    app.filter('VolunteerTimeFormat', function () {
        return function (input, capitalize_index, specified_char) {
            input = input || '';
            if (input == "" || input == null) {
                return "";
            }
            var output = (newDate(input)).format("yyyy.M");
            return output;
        };
    });

    app.filter('ageFormat', function () {
        return function (input, capitalize_index, specified_char) {
            input = input || '';
            if (input == "" || input == null) {
                return "";
            }
            var output = (new Date().getFullYear() - newDate(input).getFullYear());
            return output;
        };
    });

    app.filter('twTimeFormat', function () {
        return function (input, capitalize_index, specified_char) {
            return input.toTwDate();
        };
    });
    app.filter('codeText', ['$rootScope', '$timeout', '$http', function ($rootScope, $timeout, $http) {
        return function (input, codeId) {
            if (!angular.isDefined(input)) {
                return "";
            }
            if (!angular.isDefined(codeId)) {
                return input;
            }
            input = input || '';
            var output = '';
            var tmpDics = $rootScope.TmpDics;
            var dics = $rootScope.Dics;//缩写
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
            if (dics[codeId].length > 0) {
                if (angular.isDefined(dics[codeId])) {
                    var codeName = "";
                    var arrayVals = input.split(",");
                    angular.forEach(dics[codeId], function (e) {
                        angular.forEach(arrayVals, function (key) {
                            if (e.ItemCode === key) {
                                codeName += e.ItemName + ",";
                            }
                        });
                    });
                    if (codeName != "") {
                        codeName = codeName.substr(0, codeName.length - 1);
                    }
                    output = codeName === "" ? input : codeName;
                }
            }
            return output;
        };
    }]);


    /*
    郝元彦
    2016-6-27
    数据的unique filter
    */
    app.filter("unique", function () {
        return function (items, filterOn) {
            if (filterOn === false) {
                return items;
            }

            if ((filterOn || angular.isUndefined(filterOn)) || angular.isArray(items)) {
                var hashCheck = {}, newItems = [];

                var extractValueToCompare = function (item) {
                    if (angular.isObject(item) && angular.isString(filterOn)) {
                        return item[filterOn];
                    } else {
                        return item;
                    }
                }

                angular.forEach(items, function (item) {
                    var valueToCheck, isDuplicate = false;

                    for (var i = 0; i < newItems.length; i++) {
                        if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                            isDuplicate = true;
                            break;
                        }
                    }

                    if (!isDuplicate) {
                        newItems.push(item);
                    }
                });
                items = newItems;
            }

            return items;
        }
    });

    //身份证打码
    app.filter('idcardFormat', function () {
        return function (input, capitalize_index, specified_char) {
            if (input && input.length > 14) {
                var char = '*';
                var begin = 3;
                var end = input.length - 4;
                var fstStr = input.substring(0, begin);
                var scdStr = input.substring(begin, end);
                var lstStr = input.substring(end, input.length);
                var mm = fstStr + scdStr.replace(/\w/g, char) + lstStr;
                return mm;
            } else {
                return input;
            }

        };
    });

    app.filter('PaymentTypeFormat', [function () {
        return function (input) {
            var output = "";
            switch (input) {
                case "1":
                    output = "现金";
                    break;
                case "2":
                    output = "支付宝";
                    break;
                case "3":
                    output = "微信";
                    break;
                case "4":
                    output = "刷卡";
                    break;
                default:
            }
            return output;
        }
    }]);

    app.filter('ResidentServicePlanItemIDFormat', [function () {
        return function (input) {
            var output = "";
            if (input) {
                output = "是";
            } else {
                output = "否";
            }
            return output;
        }
    }]);
    
})();
