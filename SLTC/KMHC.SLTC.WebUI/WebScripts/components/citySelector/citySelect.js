/****
 *
 *  区域选择器（JSON数据需要重新构架，目前只是样例）
 *  (注意：采用此控件之后，form提交需要将保存事件保存到btn上，而不能放到form中)
 *
 *  刘承（2016-06-14）
 *
 *
 ***/
angular.module("extentComponent")
.directive('citySelect', ['$http', '$q', '$compile', function ($http, $q, $compile) {
    var cityURL, delay, templateURL;
    delay = $q.defer();
    templateURL = '/WebScripts/components/citySelector/citySelect.html';
    cityURL = '/WebScripts/components/citySelector/city.js';
    $http.get(cityURL).success(function (data) {
        return delay.resolve(data);
    }).error(function (data, status, headers, config) {
        return;
    });

    return {
        restrict: 'A',
        scope: {
            p: '=',
            a: '=',
            c: '=',
            d: '=',
            ngModel: '='
        },
        link: function (scope, element, attrs) {
            var popup;
            popup = {
                element: null,
                backdrop: null,
                show: function () {
                    return this.element.addClass('active');
                },
                hide: function () {
                    this.element.removeClass('active');
                    return false;
                },
                resize: function () {
                    if (!this.element) {
                        return;
                    }
                    this.element.css({
                        top: -this.element.height() - 30,
                        //top: -this.element.height +300,
                        'margin-left': -this.element.width() / 2
                    });
                    return false;
                },
                focus: function () {
                    $('[ng-model="d"]').focus();
                    return false;
                },
                init: function () {
                    element.on('click keydown', function () {
                        popup.show();
                        event.stopPropagation();
                        return false;
                    });
                    $(window).on('click', (function (_this) {
                        return function () {
                            return _this.hide();
                        };
                    })(this));
                    this.element.on('click', function () {
                        return event.stopPropagation();
                    });
                    return setTimeout((function (_this) {
                        return function () {
                            _this.element.show();
                            return _this.resize();
                        };
                    })(this), 500);
                }
            };
            return delay.promise.then(function (data) {
                $http.get(templateURL).success(function (template) {
                    var $template;
                    $template = $compile(template)(scope);
                    $('body').append($template);
                    popup.element = $($template[2]);
                    scope.provinces = data;
                    return popup.init();
                });
                scope.aSet = {
                    p: function (p, pid) {
                        scope.p = p;
                        scope.pId = pid;
                        scope.c = null;
                        scope.cId = null;
                        scope.a = null;
                        scope.aId = null;
                        //scope.d = null;
                        //scope.dId = null;
                        return;
                    },
                    c: function (c, cid) {
                        scope.c = c
                        scope.cId = cid;
                        scope.a = null;
                        scope.aId = null;
                        //scope.d = null;
                        //scope.dId = null;
                        return;
                    },
                    a: function (a, aid) {
                        scope.a = a;
                        scope.aId = aid;
                        //scope.d = null;
                       // scope.dId = null;
                        return popup.focus();
                    }
                };
                scope.clear = function () {
                    scope.p = null;
                    scope.c = null;
                    scope.a = null;
                    scope.d = null;
                    scope.pId = null;
                    scope.cId = null;
                    scope.aId = null;
                    scope.dId = null;
                    return;
                };
                scope.changeData = function () {
                    return popup.hide();
                };
                
                
                scope.$watch('p', function (newV) {
                    var v, _i, _len, _results;
                    if (newV) {
                        _results = [];
                        for (_i = 0, _len = data.length; _i < _len; _i++) {
                            v = data[_i];
                            if (v.areaName === newV) {
                                _results.push(scope.cities = v.cities);
                            }
                        }
                        return _results;
                    } else {
                        return scope.cities = [];
                    }
                });
                scope.$watch('c', function (newV) {
                    var v, _i, _len, _ref, _results;
                    if (newV) {
                        _ref = scope.cities;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            v = _ref[_i];
                            if (v.areaName === newV) {
                                _results.push(scope.dists = v.counties);
                            }
                        }
                        return _results;
                    } else {
                        return scope.dists = [];
                    }
                });
                return scope.$watch(function () {
                    scope.ngModel = '';
                    if (scope.p) {
                        scope.ngModel += scope.p;
                    }
                    if (scope.c) {
                        scope.ngModel += " " + scope.c;
                    }
                    if (scope.a) {
                        scope.ngModel += " " + scope.a;
                    }
                    if (scope.d) {
                        scope.ngModel += " " + scope.d;
                    }
                    return popup.resize();
                });
            });
        }
    };
}]);

//获取城市名称集合
function getCity($scope) {
    var city = '';
    if ($scope.p) {
        city += $scope.p;
    }
    if ($scope.c) {
        city += " " + $scope.c;
    }
    if ($scope.a) {
        city += " " + $scope.a;
    }

    return city;

};
//获取城市ID集合
function getCityId($scope) {
    var CityId = '';
    if ($scope.pId) {
        CityId += $scope.pId;
    }
    if ($scope.cId) {
        CityId += " " + $scope.cId;
    }
    if ($scope.aId) {
        CityId += " " + $scope.aId;
    }

    return CityId;

};
//获取地址
function getAddress($scope) {
    if ($scope.d) {
        return $scope.d;
    }
};

function setAddress($scope, city, address) {
    var Area = angular.copy(address);
    if (!Area) {
        Area = "";
    }
    if (city) {
        Area = city;
    }
    if (address) {
        Area += " " + address;
    }
    parseAddress($scope, city, address);
};

//解析地址
function parseAddress($scope, city, address) {
    $scope.p = "";
    $scope.c = "";
    $scope.a = "";
    $scope.d = "";

    if (angular.isDefined(city)) {
        var tmp = city.split(" ");
        if (tmp.length >= 3) {
            $scope.a = tmp[2];
        }
        if (tmp.length >= 2) {
            $scope.c = tmp[1];
        }
        if (tmp.length >= 1) {
            $scope.p = tmp[0];
        }


    }
    if (angular.isDefined(address)) {
        $scope.d = address;
    }
};