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
})();