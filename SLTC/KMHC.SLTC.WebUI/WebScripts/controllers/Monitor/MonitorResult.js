angular.module("sltcApp")
.controller("MonitorResultCtrl", ['$scope', '$state', '$stateParams', '$filter', '$q', 'utility', 'resourceFactory', 'watchCheckBase', function ($scope, $state, $stateParams, $filter, $q, utility, resourceFactory, watchCheckBase) {
    var monitortemplateRes = resourceFactory.getResource('monitortemplateRes');
    var monitoritemRes = resourceFactory.getResource('monitoritemRes');
    var monitorresultRes = resourceFactory.getResource('monitorresultRes');
    var personRes = resourceFactory.getResource("personRes");
    var residentRes = resourceFactory.getResource("residentRes");

    $scope.loadBtn = "数据同步";

    $scope.init = function () {
        $scope.MonitorResult = [];
        var mi = monitoritemRes.query();
        var mt = monitortemplateRes.query();
        var mr = monitorresultRes.query();
        var pr = personRes.query();
        var rr = residentRes.query({ ResidentOrg: $scope.$root.user.curOrgNo, Status: "I" });
        var getDic = function (myarr, pp) {
            var obj = {};
            if (myarr && myarr.length > 0) {
                $.each(myarr, function () {
                    obj[this[pp]] = this;
                });
            }
            return obj;
        };
        $q.all([mi.$promise, mt.$promise, mr.$promise, pr.$promise, rr.$promise]).then(function (arr) {
            if (arr[0] && arr[0].length > 0
                && arr[1] && arr[1].length > 0
                && arr[2] && arr[2].length > 0
                && arr[3] && arr[3].length > 0) {
                var miDic = getDic(arr[0], "MINo");
                var mtDic = getDic(arr[1], "MTNo");
                var prDic = getDic(arr[3], "PersonNo");
                var rrDic = getDic(arr[4], "PersonNo");
                $.each(arr[2], function () {
                    var cp = this;
                    var cpr = prDic[cp.PersonNo];
                    var cprr = rrDic[cp.PersonNo];
                    var cmt = mtDic[cp.MTNo];
                    if (cpr && cmt && cprr) {
                        $.each(cp.MRItems, function () {
                            var cmi = miDic[this.MINo];
                            if (cmi) {
                                this.MIName = cmi.MIName;
                            }
                        });
                        cp.MTName = cmt.MTName;
                        cp.PersonName = cpr.Name;
                        cp.Idcard = cpr.Idcard;
                        $scope.MonitorResult.push(cp);
                    }
                });
            }
        });
    }

    $scope.LoadData = function () {
        residentRes.query({ ResidentOrg: $scope.$root.user.curOrgNo, Status: "I" }, function (res) {

            if (res && res.length > 0) {
                var promArr = [];
                var pDic = {};
                var bpUrl = [];//血压
                var bsUrl = [];//血糖
                var hrUrl = [];//心率
                var boUrl = [];//血氧

                var deferred = [$q.defer(), $q.defer(), $q.defer(), $q.defer()];
                $scope.loadBtn = "加载中···";
                $scope.loadState = true;

                $.each(res, function () {
                    var cp = this;
                    var gp = personRes.query({ PersonNo: cp.PersonNo }, function (plist) {
                        if (plist && plist.length > 0 && plist[0].Imei && plist[0].Imei != "") {
                            pDic[plist[0].Imei] = plist[0].PersonNo;
                            bpUrl.push(watchCheckBase + "kmhc-modem-restful/services/member/bp/" + plist[0].Imei + "?_type=json");
                            bsUrl.push(watchCheckBase + "kmhc-modem-restful/services/member/bs/" + plist[0].Imei + "?_type=json");
                            hrUrl.push(watchCheckBase + "kmhc-modem-restful/services/member/hr/" + plist[0].Imei + "?_type=json");
                            boUrl.push(watchCheckBase + "kmhc-modem-restful/services/member/bo/" + plist[0].Imei + "?_type=json");

                        }
                    }).$promise;
                    promArr.push(gp);
                });

                $q.all(promArr).then(function () {
                    var sendRequest = function (urlArr, cfun, defer) {
                        $.ajax({
                            type: "POST",
                            url: "/home/GetWatchRecord",
                            data: JSON.stringify({ list: urlArr }),
                            contentType: "application/json",
                            success: function (wr) {
                                if (wr.State && wr.Json && wr.Json.length > 0) {
                                    var result = [];
                                    $.each(wr.Json, function () {
                                        var j = JSON.parse(this);
                                        if (j.content && j.content.list && j.content.list.length > 0) {
                                            $.each(j.content.list, function () { result.push(this); });
                                        }
                                    });
                                    saveData(convertRecord(result, cfun), defer);
                                }
                            },
                            error: function () {
                                defer.resolve();
                            }
                        });

                    }
                    //血压数据
                    sendRequest(bpUrl, function (obj, cp) { obj.PersonNo = pDic[cp.imei]; obj.MTNo = "20101", obj.MRItems = [{ MINo: 212, Result: cp.hPressure }, { MINo: 213, Result: cp.lPressure }, { MINo: 215, Result: cp.puls }], obj.MRDatetime = new Date(cp.bpTime).format("yyyy-MM-dd hh:mm:ss") }, deferred[0]);
                    //血糖数据
                    sendRequest(bsUrl, function (obj, cp) { obj.PersonNo = pDic[cp.imei]; obj.MTNo = "30101", obj.MRItems = [{ MINo: 301, Result: cp.glu }], obj.MRDatetime = new Date(cp.bsTime).format("yyyy-MM-dd hh:mm:ss") }, deferred[1]);
                    //血氧数据
                    sendRequest(boUrl, function (obj, cp) { obj.PersonNo = pDic[cp.imei]; obj.MTNo = "40101", obj.MRItems = [{ MINo: 401, Result: cp.spo2 }, { MINo: 215, Result: cp.puls }], obj.MRDatetime = new Date(cp.oxyTime).format("yyyy-MM-dd hh:mm:ss") }, deferred[2]);
                    //心率数据
                    sendRequest(hrUrl, function (obj, cp) { obj.PersonNo = pDic[cp.imei]; obj.MTNo = "50101", obj.MRItems = [{ MINo: 501, Result: cp.heartRate }], obj.MRDatetime = new Date(cp.bsTime).format("yyyy-MM-dd hh:mm:ss") }, deferred[3]);

                    //加载完成回调
                    $q.all([deferred[0].promise, deferred[1].promise, deferred[2].promise, deferred[3].promise]).then(function (qarr) {

                        var qdarr = [];
                        var getQD = function (qdA, drA) {
                            if (drA && drA.length > 0) {
                                $.each(drA, function () { qdA.push(this.promise); });
                            }
                        }
                        getQD(qdarr, qarr[0]);
                        getQD(qdarr, qarr[1]);
                        getQD(qdarr, qarr[2]);
                        getQD(qdarr, qarr[3]);
                        $q.all(qdarr).then(function () {
                            $scope.loadBtn = "数据同步";
                            $scope.loadState = false;
                            $scope.init();
                        });
                    });
                });

            }
        });
    }

    var convertRecord = function (arr, fun) {
        var result = [];
        $.each(arr, function () {
            var cp = this;
            var json = {
                MRNo: uuid(8, 10),
                SNO: cp.sno,
                SourceType: 1//手表数据
            };
            fun(json, cp);
            result.push(json);
        });

        return result;
    }

    var saveData = function (list, def) {
        if (list && list.length > 0) {
            var defArr = [];
            $.each(list, function () {
                var q = $q.defer();
                var cp = this;
                if (cp.SNO && cp.SNO != "") {
                    monitorresultRes.query({ SourceType: 1, SNO: cp.SNO }, function (r) {
                        if (r.length == 0) {
                            monitorresultRes.save(cp, function () { q.resolve(); });
                        } else { q.resolve(); }
                    });
                }
                defArr.push(q);
            });
            def.resolve(defArr);
        }
        def.resolve();

    }


    $scope.init();
}])
.controller("MonitorResultAddCtrl", ['$scope', '$state', '$stateParams', '$filter', 'utility', 'resourceFactory', function ($scope, $state, $stateParams, $filter, utility, resourceFactory) {
    var monitortemplateRes = resourceFactory.getResource('monitortemplateRes');
    var monitoritemRes = resourceFactory.getResource('monitoritemRes');
    var monitorresultRes = resourceFactory.getResource('monitorresultRes');

    $scope.currentItem = {};
    $scope.Monitortemplate = [];
    $scope.MonitorItem = [];

    $scope.init = function () {
        monitortemplateRes.query({}, function (data) {
            $scope.Monitortemplate = data;
        });
        monitoritemRes.query({}, function (data) {
            $scope.MonitorItem = data;
        });
    };

    //选中住民
    $scope.personSelected = function (person) {
        if (person) {
            $scope.currentItem.PersonName = person.Name;
            $scope.currentItem.PersonNo = person.PersonNo;
            $scope.currentItem.Sex = person.Sex;
            $scope.currentItem.Idcard = person.Idcard;
        }
    }

    //选择监测模版
    $scope.selectMonitorTemplate = function (MTNo) {

        var mt = $filter('filter')($scope.Monitortemplate, { MTNo: MTNo }, true)[0];
        if (mt) {
            var filler = [];
            $.each(mt.Items, function () {
                var cp = this.toString();
                var mi = $filter('filter')($scope.MonitorItem, { MINo: cp }, true)[0];
                if (mi) {
                    filler.push(mi);
                }
            });
            $scope.currentItem.Items = filler;
        }

    }

    $scope.saveMonitorResult = function (result) {
        if (result && result.PersonNo && result.Items && result.Items.length > 0) {
            var items = [];
            $.each(result.Items, function () {
                items.push({ MINo: this.MINo, Result: this.Result });
            });
            var json = {
                MRNo: uuid(8, 10),
                PersonNo: result.PersonNo,
                MTNo: result.MTNo,
                MRItems: items,
                MRDatetime: new Date().format("yyyy-MM-dd hh:mm:ss"),
                SourceType: 0
            };
            monitorresultRes.save(json, function () {
                utility.message("监测结果保存成功!");
                $state.go("MonitorResult");
            });
        } else {           
            utility.message("监测结果数据不完整!");
        }
    };


    $scope.init();

}]);