/*
        创建人: 李林玉
        创建日期:2016-05-26
        说明: 入住列表
*/

angular.module("sltcWapApp")
.controller("residentListCtrl", ['$scope', '$http', '$state', '$location', 'residentRes', 'personRes', function ($scope, $http, $state, $location, residentRes, personRes) {
    $scope.showBtn = true;
    $scope.search = $scope.reload = function (condition) {
        var today = new Date();
        residentRes.query({}, function (data) {
            $scope.residents = [];
            var row = [];
            if (data && data.length > 0) {
                var filter = function (f) { return true; }
                if (condition) {
                    filter = function (f) {
                        var r = true;
                        if (condition.Name && condition.Name != '') {
                            r = r && (f.PersonName.indexOf(condition.Name) >= 0);
                        }
                        if (condition.Sex) {
                            r = r && (f.Sex === condition.Sex);
                        }
                        if (condition.BedNo && condition.BedNo != '') {
                            r = r && (f.BedNo === condition.BedNo);
                        }
                        if (condition.Carer && condition.Carer !== '') {
                            r = r && (f.Carer === condition.Carer);
                        }
                        return r;
                    }
                }
                $.each(data, function () {
                    if (this.Status === "I" && filter(this)) {
                        if (this.Birthdate != null) {
                            var birthdate = new Date(this.Birthdate);
                            this.Age = today.getFullYear() - birthdate.getFullYear();
                        } else {
                            this.Age = "";
                        }
                        row.push(this);
                        if (row.length === 4) {
                            var cp = row;
                            $scope.residents.push(cp);
                            row = [];
                        }
                    }
                });
                if (row.length > 0) {
                    if ($scope.residents.length === 0) {
                        var l = 4 - row.length;
                        for (var i = 0; i < l; i++) {
                            row.push(null);
                        }
                    }
                    $scope.residents.push(row);
                }
            }

        });
    };

    $scope.showCondition = function () {

        $('#condition').modal({
            backdrop: true,
            keyboard: true,
            show: true
        });
    };


    $scope.edit = function (item) {
        personRes.query({}, function (data) {
            if (data && data.length > 0) {
                $.each(data, function () {
                    if (this.PersonNo === item.PersonNo) {
                        $state.go('UserBaseInfo', { id: this.id });
                        return false;
                    }
                });
            }
        });

    }
    $scope.search();
}])