angular.module("sltcApp")
.controller("PersonListCtrl", ['$scope', '$http', '$location', '$timeout', '$state', '$filter', 'utility', 'resourceFactory', 'htlUserRes', function ($scope, $http, $location, $timeout, $state, $filter, utility, resourceFactory, htlUserRes) {
    var personRes = resourceFactory.getResource('persons');

    $scope.Persons = [];
    //查询选项
    $scope.options = {};
    $scope.options.params = {};

    //查询所有
    $scope.init = function () {
        $scope.options = {
            buttons: [],
            ajaxObject: personRes,
            params: { 'Data.PersonName': "" },
            success: function (data) {
                $scope.Persons = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        }
    }

    $scope.delete = function (item) {
        utility.confirm("确定删除该信息吗?", function (result) {
            if (result) {
                personRes.delete({ id: item.PersonID }, function (data) {
                    $scope.options.pageInfo.CurrentPage = 1;
                    $scope.options.search();
                    utility.message("刪除成功");
                });
                return false;
            }
        });
    };
    $scope.init();

    $scope.search = function () {
        $scope.options.pageInfo.CurrentPage = 1;
        $scope.options.search();
    }

    $scope.openAuthentication = function (item) {
        $scope.$broadcast('OpenAuthentication', item);
    }


    $scope.EditPerson = function (id) {
        $scope.$broadcast('OpenPersonEdit', id);
    }

    $scope.SetResident = function (item) {
        $scope.$broadcast('OpenSetResident', item);
    }

    $scope.$on('RefreshAfterSetOrg', function (e, data) {
        $('#modalSetResidentOrg').modal('hide');
        $scope.search();
    });


    $scope.$on('SavedPerson', function (e, data) {
        $('#modalPersonEdit').modal('hide');
        $scope.search();
    });
}])
.controller("PersonAuditCtrl", ['$scope', '$http', '$location', '$timeout', '$state', '$filter', 'utility', 'resourceFactory', 'htlUserRes', function ($scope, $http, $location, $timeout, $state, $filter, utility, resourceFactory, htlUserRes) {
    var personRes = resourceFactory.getResource('persons');

    //认证
    $scope.ErrorMsg = false;
    $scope.saveEdit = function (item) {
        item.Sex = item.Sex || "";
        item.Birthdate = item.Birthdate || "";
        htlUserRes.get({ IDNumber: item.IdCard, Name: item.Name, Gender: item.Sex, Birthdate: item.Birthdate.replace(/\-/g, "") }).$promise.then(function (data) {
            item.AuditState = data.Status == 0 ? 'A' : 'U';
            personRes.save(item, function (newItem) {
                if (item.AuditState=="A") {
                    utility.message(item.Name + "信息认证成功");
                    $scope.ErrorMsg = false;
                    $('#modalAuthentication').modal('hide');
                } else {
                    $scope.ErrorMsg = true;
                }
            });
        });
    };

    $scope.createBirthdate = function (IdNo) {
        if (IdNo != undefined && IdNo.length === 18) {
            $scope.auditItem.Birthdate = IdNo.substring(6, 10) + '-' + IdNo.substring(10, 12) + '-' + IdNo.substring(12, 14);
        }
    };

    $scope.$on('OpenAuthentication', function (e, data) {
        $scope.ErrorMsg = false;
        $scope.auditItem = data;
        $scope.HomeAddress = data.City + data.Address;
        $scope.auditItem.Birthdate = $filter("date")($scope.auditItem.Birthdate, "yyyy-MM-dd");
    });
}])
.controller("PersonProfileCtrl", ['$scope', '$http', '$location', '$stateParams', '$timeout', '$filter', 'utility', 'htlUserRes', 'htlExamRecordRes', 'resourceFactory', 'webUploader', function ($scope, $http, $location, $stateParams, $timeout, $filter, utility, htlUserRes, htlExamRecordRes, resourceFactory, webUploader) {
    $scope.activeTab = function (tabName) {
        var s = $location.absUrl();
        if (s.indexOf(tabName) != -1) {
            return true;
        } else {
            return false;
        }
    }

    var personRes = resourceFactory.getResource('persons');
        $scope.init = function () {
            if ($stateParams.id) {
                personRes.get({ id: $stateParams.id },function (data) {
                    $scope.PersonID = data.Data.PersonID;
                    $scope.PersonNo = data.Data.PersonNo;
                    $scope.PersonName = data.Data.Name;
                    $scope.ResidentID = data.Data.ResidentID;
                    $scope.IdCard = data.Data.IdCard;
                    if (data.Data.ResidentID == null || data.Data.ResidentID == 0 || data.Data.ResidentID == undefined) {
                        $scope.IsResident = false;
                    } else {
                        $scope.IsResident = true;
                    }
                });
            }
        }        

        $scope.init();
    }])
.controller("PersonEditCtrl", ['$scope', '$http', '$location', '$stateParams', '$timeout', '$filter', 'utility', 'htlUserRes', 'htlExamRecordRes', 'resourceFactory', 'webUploader', function ($scope, $http, $location, $stateParams, $timeout, $filter, utility, htlUserRes, htlExamRecordRes, resourceFactory, webUploader) {

    var personRes = resourceFactory.getResource('persons');

    $scope.init = function () {
        $scope.prePostData = {};
        if ($stateParams.id) {
            $scope.isAdd = true;
            personRes.get({ id: $stateParams.id }).$promise.then(function (data) {
                $scope.curItem = data.Data;
                $scope.AddressDetail = data.Data.City + data.Data.Address;
                $scope.curItem.Birthdate = $filter("date")($scope.curItem.Birthdate, "yyyy-MM-dd");
            });
        }
        else {
            $scope.InitPage();
        }
    }

    $scope.InitPage = function () {
        $scope.isAdd = false;
        $scope.curItem = {};
        var codeRuleRes = resourceFactory.getResource("codeRules");
        codeRuleRes.get({
            "CodeKey": "PersonCode",
            "GenerateRule": "YearMonthDay",
            "Prefix": "P",
            "SerialNumberLength": 4,
            "OrganizationID": $scope.$root.user.OrgId
        }, function (data) {
            $scope.curItem.PersonNo = data.Data;
        });
        $scope.AddressDetail = "";
    }

    

    $scope.SaveItem = function (item) {
        item.Sex = item.Sex || "";
        item.Birthdate = item.Birthdate || "";        

        htlUserRes.get({ IDNumber: item.IdCard, Name: item.Name, Gender: item.Sex, Birthdate: item.Birthdate.replace(/\-/g, "") }).$promise.then(function (data) {            
            item.AuditState = data.Status == 0 ? 'A' : 'U';

            if (!objEquals($scope.prePostData, item)) {
                angular.copy(item, $scope.prePostData);
            } else {
                utility.message("请不要重复提交数据");
                return;
            }
            personRes.save(item, function (newItem) {
                if (newItem.IsSuccess) {
                    utility.message("添加成功");
                    $scope.$emit("SavedPerson", newItem.Data);
                }
                else {
                    utility.message(newItem.ResultMessage);
                }
            });
        });       
    };

    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $scope.saveEdit = function (item) {
            if (!$scope.curItem.Lng) {
                var myGeo = new BMap.Geocoder();
                var addressDetail = $scope.curItem.City + $scope.curItem.Address + $scope.curItem.HouseNumber;
                myGeo.getPoint(addressDetail, function (point) {
                    if (point) {
                        item.Lng = point.lng;
                        item.Lat = point.lat;
                    }
                    $scope.SaveItem(item);
                }, $scope.curItem.City);
            } else {
                $scope.SaveItem(item);
            }
        };
    });


    $scope.getHltRecordInfo = function (idno) {
        if (idno) {
            htlUserRes.get({ idno: idno }, function (result) {
                if (result != null && result.Data != null) {
                    var data = result.Data;
                    data.Sex = data.Gender;
                    data.Birthdate = data.BirthDate == null ? "" : data.BirthDate.substring(0, 4) + '-' + data.BirthDate.substring(4, 6) + '-' + data.BirthDate.substring(6, 8);
                    data.PersonNo = $scope.curItem.PersonNo;
                    data.PhotoPath = data.ImgUrl;
                    angular.extend($scope.curItem, data);
                } else {
                    utility.message("健康档案里没有该身份证信息！");
                }

            });

        }

    }

    $scope.createBirthdate = function (IdNo) {
        if (IdNo != undefined && IdNo.length == 18) {
            $scope.curItem.Birthdate = IdNo.substring(6, 10) + '-' + IdNo.substring(10, 12) + '-' + IdNo.substring(12, 14);
        }
    };
    webUploader.init('#PicturePathPicker', { category: 'ResidentAvatar' }, '', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
        if (data.length > 0) {
            $scope.curItem.PhotoPath = data[0].SavedLocation;
            $scope.$apply();
        }
    },60);

    $scope.$on("OpenPersonEdit", function (event, id) {
        $scope.isAdd = false;
        personRes.get({ id: id },function (data) {
            $scope.curItem = data.Data;
            $scope.AddressDetail = data.Data.City + data.Data.Address;
            $scope.curItem.Birthdate = $filter("date")($scope.curItem.Birthdate, "yyyy-MM-dd");
        });
    });

    $('#modalPersonEdit').on('show.bs.modal',
    function () {
        $scope.InitPage();
    });


    $scope.addressInput = function (data) {
        if (data.Address) {
            $scope.AddressDetail = data.City + data.Address;
            $scope.curItem.City = data.City;
            $scope.curItem.Address = data.Address;
            $scope.curItem.HouseNumber = data.HouseNumber;
        }
        if (data.Lng) {            
            $scope.curItem.Lng = data.Lng;
            $scope.curItem.Lat = data.Lat;
        }
    };

    $scope.init();
}])
.controller("PersonInfoEditCtrl", ['$scope', '$http', '$location', '$stateParams', '$rootScope', '$timeout', '$filter', 'utility', 'htlUserRes', 'htlExamRecordRes', 'resourceFactory', '$q', 'webUploader', function ($scope, $http, $location, $stateParams, $rootScope, $timeout, $filter, utility, htlUserRes, htlExamRecordRes, resourceFactory, $q, webUploader) {
    //var monitortemplateRes = resourceFactory.getResource('monitortemplateRes');
    //var monitoritemRes = resourceFactory.getResource('monitoritemRes');
    //var monitorresultRes = resourceFactory.getResource('monitorresultRes');

    var personRes = resourceFactory.getResource("personRes");
    $scope.hasResident = false;
    //查询选项
    $scope.init = function () {
        if ($stateParams.id) {
            $scope.isAdd = true;
            personRes.get({ id: $stateParams.id }).$promise.then(function (data) {
                $scope.curItem = data.Data;
                $scope.curItem.Birthdate = $filter("date")($scope.curItem.Birthdate, "yyyy-MM-dd");
            });
        }
    }

    if ($stateParams.id) {
        $scope.isAdd = true;
        personRes.get({ id: $stateParams.id }).$promise.then(function (data) {
            $scope.curItem = data.Data;
            $scope.AddressDetail = data.Data.City + data.Data.Address;
            $scope.curItem.Birthdate = $filter("date")($scope.curItem.Birthdate, "yyyy-MM-dd");
        });

    } else {
        $scope.isAdd = false;
        $scope.curItem = {};
        var codeRuleRes = resourceFactory.getResource("codeRules");
        codeRuleRes.get({
            "CodeKey": "PersonCode",
            "GenerateRule": "YearMonthDay",
            "Prefix": "P",
            "SerialNumberLength": 4,
            "OrganizationID": $scope.$root.user.OrgId
        }, function (data) {
            $scope.curItem.PersonNo = data.Data;
        });
    }

    $scope.saveEdit = function (item) {
        item.City = getCity($scope);
        item.Address = getAddress($scope);
        var vals = $("#myAddress1").val();
        if (vals != "") {
            if (vals.split("-").length > 4) {
                var str = vals;
                var idx = 0;
                var count = 0;
                var tindex = 0;
                while (count != 3 && idx != -1) {
                    idx = str.indexOf('-');
                    str = str.substring(idx + 1);
                    count++;

                    if (count != 1) {
                        idx += 1;
                    }
                    if (idx != -1) {
                        tindex = tindex + idx;
                    }
                }
                item.City = vals.substring(0, tindex + 1);
                item.Address = vals.substring(tindex + 1, vals.length);

            } else {
                var lastIndex = vals.lastIndexOf("-");
                item.City = vals.substring(0, lastIndex + 1);
                item.Address = vals.substring(lastIndex + 1, vals.length);
            }
        }
        personRes.save(item, function (data) {
            if (data.IsSuccess) {

                utility.message("修改成功");
                $scope.$root.goBack();
            } else {
                utility.message(data.ResultMessage);
            }
        });
    };

    $scope.ListShow = true;
    $scope.ViewShow = false;
    $scope.WatchShow = function (type) {
        var list, view;
        if ($(".switch-on")[0]) {
            list = false;
            view = true;
        } else {
            list = true;
            view = false;
        }
        $scope.ListShow = list;
        $scope.ViewShow = view;
    };

    $(".switch-large").click(function () {
        var list, view;
        if ($(".switch-off")[0]) {
            list = false;
            view = true;
        } else {
            list = true;
            view = false;
        }
        $scope.ListShow = list;
        $scope.ViewShow = view;
        $scope.$apply();
    });



    $scope.createBirthdate = function (IdNo) {
        if (IdNo != undefined && IdNo.length == 18) {
            $scope.curItem.Birthdate = IdNo.substring(6, 10) + '-' + IdNo.substring(10, 12) + '-' + IdNo.substring(12, 14);
        }
    };

    webUploader.init('#PicturePathPicker', { category: 'ResidentAvatar' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
        if (data.length > 0) {
            $scope.curItem.PhotoPath = data[0].SavedLocation;
            $scope.$apply();
        }
    });

    $scope.init();
}]).controller("healthCtrl", ['$scope', '$http', '$location', '$stateParams', '$rootScope', '$timeout', '$filter', 'utility', 'htlUserRes', 'htlExamRecordRes', 'resourceFactory', '$q', 'webUploader', function ($scope, $http, $location, $stateParams, $rootScope, $timeout, $filter, utility, htlUserRes, htlExamRecordRes, resourceFactory, $q, webUploader) {
    //var monitortemplateRes = resourceFactory.getResource('monitortemplateRes');
    //var monitoritemRes = resourceFactory.getResource('monitoritemRes');
    //var monitorresultRes = resourceFactory.getResource('monitorresultRes');

    var personRes = resourceFactory.getResource("personRes");
    $scope.hasResident = false;
    //查询选项
    $scope.options = {};
    $scope.options.params = {};
    $scope.RecordList = [];
    $scope.options = {
        buttons: [],
        ajaxObject: htlExamRecordRes,
        params: { 'idno': $stateParams.idCard },
        success: function (data) {
            $scope.RecordList = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }
    $scope.init = function () {
        if ($stateParams.id) {
            personRes.get({ id: $stateParams.id },function (data) {
                $scope.curItem = data.Data;
                $scope.curItem.Birthdate = $filter("date")($scope.curItem.Birthdate, "yyyy-MM-dd");
            });
        }
    }
    $scope.showDate = function (date) {
        if (date != null) {
            var index = date.indexOf('T');
            if (index > -1) {
                return date.substring(0, index);
            }
        }
    };

    $scope.showDatetime = function (date) {
        if (date != null) {
            return date.substring(0, 16).replace('T', ' ').toString();
        }
    };

    $scope.getLocalTime = function (strTime) {
        if (strTime == null || strTime == "") {
            return "";
        }
        var date = new Date(strTime);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
    }
    //一体机体检结果
    $scope.popupResult = function (data) {

        var ExamId = data.ExamId + ',' + data.Doctor + ',' + $scope.showDate(data.ExamDate) + ',' + $scope.curItem.PersonID + ',' + $scope.curItem.IdCard;
        $("#CurrentExamId").val(ExamId);
        $("#modalResult").modal("show");
    }

    //一体机体检建议
    $scope.popupSuggest = function (data) {
        var ExamId = data.ExamId + ',' + data.Doctor + ',' + $scope.showDate(data.ExamDate) + ',' + $scope.curItem.PersonID + ',' + $scope.curItem.IdCard;
        $("#CurrentExamId").val(ExamId);
        $("#modalSuggest").modal("show");
    }

    $scope.init();
}])
.controller("ExamineResultCtrl", ["$scope", "$http", "$location", "$stateParams", "$state", "$rootScope", "utility", "htlExamRes", 'htlUserRes', "$timeout", "hltImgBase", function ($scope, $http, $location, $stateParams, $state, $rootScope, utility, htlExamRes, htlUserRes, $timeout, hltImgBase) {
    var today = new Date(),
        stateParams,
        Data, Info,
        params,
        ExamId;

    $scope.InitData = function () {
        stateParams = $("#CurrentExamId").val() || "";
        params = stateParams.replace(/null/g, "").replace(/undefined/g, "").split(",");
        ExamId = params[0], Data = {
            ExamId: params[0]
            , Doctor: params[1]
            , ExamDate: params[2]
            , PageID: params[3]
            , IdCard: params[4]
        };

        $scope.Data = Data;
        htlUserRes.get({ idno: Data.IdCard }, function (response) {
            var data = response.Data,
                match = /(\d{4})(\d{2})(\d{2})/.exec(data.BirthDate),
                today = new Date(),
                Age = today.getFullYear() - parseInt(match[1]);
            data.Sex = data.Gender;
            data.Age = Age;
            angular.extend($scope, { Info: data });
        });

        //一体机体检信息
        htlExamRes.get({ examId: ExamId }).$promise.then(function (obj) {
            //$scope.ListItems = obj.Data;
            var itemTemp = {}, labTemp = {};
            for (var i in obj.Data) {
                var data = obj.Data[i], wv, hv;
                switch (data.ItemId) {
                    case 566:
                        itemTemp.Temperature = data.Result + "℃"; break;
                    case 776:
                        itemTemp.bloodGlucose = data.Result + "mmol/L"; break;
                    case 554:
                        itemTemp.Systolic = data.Result + "mmhg"; break;
                    case 556:
                        itemTemp.Diastolic = data.Result + "mmhg"; break;
                    case 547:
                        wv = parseFloat(data.Result);
                        itemTemp.height = data.Result + "cm"; break;
                    case 568:
                        hv = parseFloat(data.Result);
                        itemTemp.weight = data.Result + "kg"; break;
                    case 15:
                        itemTemp.pulseRate = data.Result + "bpm"; break;
                    case 166:
                        itemTemp.heartRate = data.Result + "bpm"; break;
                    case 1000:
                        itemTemp.spO2 = data.Result + "bpm"; break;
                    case 868:
                        itemTemp.China_Med_Check = $scope.GetChinaMedCheck(data.Result); break;
                    case 799:
                        itemTemp.Chol = data.Result + "mmol/L"; break;
                    case 735:
                        itemTemp.UGLU = data.Result + "mmol/L"; break;
                    case 740:
                        itemTemp.UA = data.Result + "umol/L"; break;
                    case 8888:
                        itemTemp.Image = data.Result; break;
                    case 666:
                        itemTemp.Diagnosis = data.Result; break;
                    case 719:
                        labTemp.LEU = data.Result; break;
                    case 737:
                        labTemp.KET = data.Result; break;
                    case 1400:
                        labTemp.NIT = data.Result; break;
                    case 708:
                        labTemp.URO = data.Result; break;
                    case 800:
                        labTemp.BIL = data.Result; break;
                    case 724:
                        labTemp.PRO = data.Result; break;
                    case 736:
                        labTemp.GLU = data.Result; break;
                    case 720:
                        labTemp.SG = data.Result; break;
                    case 740:
                        labTemp.PH = data.Result; break;
                    case 731:
                        labTemp.BLD = data.Result; break;
                    case 1401:
                        labTemp.VC = data.Result; break;
                    case 1402:
                        labTemp.CRE = data.Result; break;
                    case 1403:
                        labTemp.CA = data.Result; break;

                }
            }
            itemTemp.BMI = $scope.GetBMI(wv, hv);
            $.extend($scope, {
                urlStart: hltImgBase || "",
                ListItems: itemTemp || {},
                LabListItems: labTemp || {}
            });
        });
    };

    //$scope.GoBack = function () {
    //    $state.go("PersonInfoEdit", { id: $scope.Data.PageID });
    //}
    $scope.GoPrint = function () {
        $JQprint("#myPrintArea", {
            globalStyles: true,
            mediaPrint: false,
            stylesheet: null,
            noPrintSelector: ".no-print",
            iframe: true,
            append: null,
            prepend: null,
            manuallyCopyFormValues: true,
            deferred: $.Deferred(),
            timeout: 250,
            title: '',
            doctype: '<!doctype html>'
        });
    }

    $scope.showDate = function (date) {
        if (date != null) {
            return date.split('T')[0];
        }
    };

    $scope.showItem = function (ItemId) {
        return ItemList[ItemId];
    };

    $scope.GetBMI = function (strHeight, strWeight) {
        if (strHeight && strWeight) {
            return parseFloat(strWeight / (strHeight * strHeight / 10000)).toFixed(1);
        }
        return parseFloat(strWeight / (strHeight * strHeight / 10000)).toFixed(1);
    }

    $scope.GetChinaMedCheck = function (Result) {
        var resultList = Result.split(',');
        var res, tmpValue;
        for (var i = 0; i < resultList.length - 1; i++) {
            tmpValue = parserInt(resultList[i]);
            res += ("," + (ChinaMedList[tmpValue] ? ChinaMedList[tmpValue] : "其他"));
        }
        return res ? res.substr(1) : "";
    }

    var ChinaMedList = "平和质,气虚质,阳虚质,阴虚质,痰湿质,湿热质,血瘀质,气郁质,特秉质".split(",");

    $('#modalResult').on('show.bs.modal',
    function () {
        $scope.InitData();
    });

}])
.controller("ExamineSuggestCtrl", ["$scope", "$http", "$location", "$stateParams", "utility", "htlExamRes", 'htlUserRes', "$timeout", function ($scope, $http, $location, $stateParams, utility, htlExamRes, htlUserRes, $timeout) {
    var today = new Date(),
        stateParams,
        Data, Info,
        params,
        ExamId;


    $scope.Data = Data;


    $scope.InitData = function () {

        stateParams = $("#CurrentExamId").val() || "";
        params = stateParams.replace(/null/g, "").replace(/undefined/g, "").split(",");
        ExamId = params[0], Data = {
            ExamId: params[0]
            , Doctor: params[1]
            , ExamDate: params[2]
            , PageID: params[3]
            , IdCard: params[4]
        };

        htlUserRes.get({ idno: Data.IdCard }, function (response) {
            var data = response.Data,
                match = /(\d{4})(\d{2})(\d{2})/.exec(data.BirthDate),
                today = new Date(),
                Age = today.getFullYear() - parseInt(match[1]);
            data.Sex = data.Gender;
            data.Age = Age;
            angular.extend($scope, { Info: data });
        });

        //一体机体检信息
        htlExamRes.get({ examId: ExamId }).$promise.then(function (obj) {
            //$scope.ListItems = obj.Data;
            var itemTemp = {};
            for (var i in obj.Data) {
                var data = obj.Data[i], wv, hv;
                switch (data.ItemId) {
                    case 566:
                        itemTemp.Temperature = data.Result; break;
                    case 776:
                        itemTemp.bloodGlucose = data.Result; break;
                    case 554:
                        itemTemp.Systolic = data.Result; break;
                    case 556:
                        itemTemp.Diastolic = data.Result; break;
                    case 547:
                        wv = parseFloat(data.Result);
                        itemTemp.height = data.Result; break;
                    case 568:
                        hv = parseFloat(data.Result);
                        itemTemp.weight = data.Result; break;
                    case 15:
                        itemTemp.pulseRate = data.Result; break;
                    case 166:
                        itemTemp.heartRate = data.Result; break;
                    case 1000:
                        itemTemp.spO2 = data.Result; break;
                }
            }
            itemTemp.BMI = $scope.GetBMI(wv, hv);

            if (itemTemp.BMI != null) {
                itemTemp.BMIRes = itemTemp.BMI + "kg/m2";
                if (parseFloat(itemTemp.BMI) >= 24 && parseFloat(itemTemp.BMI) <= 27.9) {
                    itemTemp.BMIType = "偏高（超重/肥胖）";
                    itemTemp.BMIDesc = "控制日常饮食总热量摄取，多吃粗粮、蔬菜，少吃油腻、高热食物，有计划地运动，减重至理想体重。定期复查，必要时就医诊疗。";
                }
                else if (parseFloat(itemTemp.BMI) >= 18.5 && parseFloat(itemTemp.BMI) <= 23.9) {
                    itemTemp.BMIType = "正常";
                    itemTemp.BMIDesc = "请予保持正常体重值，定期复查。";
                }
                else if (parseFloat(itemTemp.BMI) < 18.5) {
                    itemTemp.BMIType = "偏低";
                    itemTemp.BMIDesc = "请注意加强营养，适度锻炼，减少压力，保持足够的休息。定期复查，必要时就医诊疗。";
                }
            }

            if (itemTemp.Systolic != null && itemTemp.Diastolic != null) {
                itemTemp.BPRes = itemTemp.Systolic + "/" + itemTemp.Diastolic + "mmhg";
                if (itemTemp.Systolic >= 140 || itemTemp.Diastolic >= 90) {
                    itemTemp.BPType = "偏高";
                    itemTemp.BPDesc = "请注意低盐、低脂饮食、戒烟限酒，忌浓茶、咖啡，多吃粗粮、蔬菜水果，适当运动，生活规律，不熬夜，保证充足的睡眠，避免压力、紧张、焦虑、抑郁等不良情绪。控制体重，充分休息后复查血压，必要时就医诊疗。";
                }
                else if ((itemTemp.Systolic >= 120 && itemTemp.Systolic <= 139) || (itemTemp.Diastolic >= 80 && itemTemp.Diastolic <= 89)) {
                    itemTemp.BPType = "正常偏高";
                    itemTemp.BPDesc = "请注意低盐、低脂饮食、戒烟限酒，忌浓茶、咖啡，多吃粗粮、蔬菜水果，适当运动，生活规律，不熬夜，保证充足的睡眠，避免压力、紧张、焦虑、抑郁等不良情绪。控制体重，定期复查血压。";
                }
                else if ((itemTemp.Systolic >= 90 && itemTemp.Systolic <= 120) || (itemTemp.Diastolic >= 60 && itemTemp.Diastolic <= 80)) {
                    itemTemp.BPType = "正常";
                    itemTemp.BPDesc = "请予保持正常血压值，定期复查。";
                }
                else if (itemTemp.Systolic <= 90 || itemTemp.Diastolic < 60) {
                    itemTemp.BPType = "偏低";
                    itemTemp.BPDesc = "生活要有规律，防止过度疲劳，适当加强锻炼，提高身体素质，每餐不宜吃得过饱，适量饮茶。";
                }
            }

            if (itemTemp.bloodGlucose != null) {
                itemTemp.BGRes = itemTemp.bloodGlucose + "mmol/L";
                if (parseFloat(itemTemp.bloodGlucose) >= 7.0) {
                    itemTemp.BGType = "偏高";
                    itemTemp.BGDesc = "低糖低脂饮食，戒烟限酒，忌糖及甜饮料、罐头等含糖高的食品，多吃粗杂粮、新鲜蔬菜，少吃精米白面、油腻食物，适量食用水果，坚持长期适量运动。体重超标者减重至理想体重，有高血压病、高脂血症者应积极治疗。定期复查，必要时就医诊疗。";
                } else if (parseFloat(itemTemp.bloodGlucose) >= 6.1 && parseFloat(itemTemp.bloodGlucose) < 7.0) {
                    itemTemp.BGType = "正常偏高";
                    itemTemp.BGDesc = "低糖低脂饮食，戒烟限酒，忌糖及甜饮料、罐头等含糖高的食品，多吃粗杂粮、新鲜蔬菜，少吃精米白面、油腻食物，适量食用水果，坚持长期适量运动。体重超标者减重至理想体重，有高血压病、高脂血症者应积极治疗。定期复查。";
                }
                else if (parseFloat(itemTemp.bloodGlucose) <= 6.1 && parseFloat(itemTemp.bloodGlucose) > 3.9) {
                    itemTemp.BGType = "正常";
                    itemTemp.BGDesc = "请予保持正常血糖值，定期复查。";
                }
                else if (parseFloat(itemTemp.bloodGlucose) <= 3.9) {
                    itemTemp.BGType = "偏低";
                    itemTemp.BGDesc = "定时定量进餐，运动前应增加额外的碳水化合物摄入，避免酗酒和空腹饮酒。对于轻中度低血糖，口服糖水、含糖饮料，或进食糖果、饼干、面包、馒头等即可缓解。对于药物性低血糖，应及时停用相关药物。重者和疑似低血糖昏迷的患者及时就医诊疗。定期监测血糖，尤其在血糖波动大、环境、运动等因素改变时要密切监测血糖。糖尿病患者出现低血糖，应注意在专业医师指导下调整降糖方案：合理使用胰岛素或胰岛素促分泌剂。";
                }
            }

            if (itemTemp.Temperature != null) {
                itemTemp.TemperatureRes = itemTemp.Temperature + "℃";
                if (parseFloat(itemTemp.Temperature) > 37.8) {
                    itemTemp.TemperatureType = "偏高";
                    itemTemp.TemperatureDesc = "注意休息，多喝水，物理降温。如反复测量体温异常，请再使用医疗用体温计做进一步量测，必要时就医诊疗。";
                }
                else if (parseFloat(itemTemp.Temperature) >= 35.8 && parseFloat(itemTemp.Temperature) <= 37.8) {
                    itemTemp.TemperatureType = "正常";
                    itemTemp.TemperatureDesc = "请予保持正常体温值，定期复查。";
                }
            }

            if (itemTemp.spO2 != null) {
                itemTemp.spO2Res = itemTemp.spO2 + "%";
                if (itemTemp.spO2 > 98) {
                    itemTemp.spO2Type = "正常";
                    itemTemp.spO2Desc = "您的血氧属于正常血氧，但超出临床范围，建议复测。";
                }
                else if (itemTemp.spO2 >= 95 && itemTemp.spO2 <= 98) {
                    itemTemp.spO2Type = "正常";
                    itemTemp.spO2Desc = "您的血氧正常，请予保持。";
                }
                else if (itemTemp.spO2 >= 91 && itemTemp.spO2 <= 94) {
                    itemTemp.spO2Type = "偏低";
                    itemTemp.spO2Desc = "您的血氧偏低，请注意休息，清淡饮食，稳定情绪，调整好状态并复查血氧。如果复查结果仍为血氧偏低：（1）当您位于海拔3000米以下位置，请及时就医诊疗。（2）当你位于海拔3000米以上位置，请注意定期复查。";
                }
                else if (itemTemp.spO2 <= 90) {
                    itemTemp.spO2Type = "严重偏低";
                    itemTemp.spO2Desc = "您的血氧严重偏低，请及时吸氧，同时注意休息，清淡饮食，稳定情绪，调整好状态并复查血氧。如果复查结果仍为血氧严重偏低，请及时就医诊疗。";
                }
            }

            $scope.Item = itemTemp;

        });
    }

    //$scope.GoBack = function () {
    //    window.location.href = "/angular/PersonInfoEdit/" + $scope.Data.PageID + "#examination";
    //                    }

    $scope.GoPrint = function () {
        $JQprint("#myPrintArea", {
            globalStyles: true,
            mediaPrint: false,
            stylesheet: null,
            noPrintSelector: ".no-print",
            iframe: true,
            append: null,
            prepend: null,
            manuallyCopyFormValues: true,
            deferred: $.Deferred(),
            timeout: 250,
            title: '',
            doctype: '<!doctype html>'
        });
    }

    $scope.GetBMI = function (strHeight, strWeight) {
        if (strHeight == null || strWeight == null || strHeight == 0 || strWeight == 0) {
            return " ";
        }
        return parseFloat(parseFloat(strWeight) / (parseFloat(strHeight) * parseFloat(strHeight) / 10000)).toFixed(1);
    }

    $('#modalSuggest').on('show.bs.modal',
    function () {
        $scope.InitData();
    });

}]);


function getDic(myarr, pp) {
    var obj = {};
    if (myarr && myarr.length > 0) {
        $.each(myarr, function () {
            obj[this[pp]] = this;
        });
    }
    return obj;
};

//处理血压数据
function GetBloodPressureData(data1, data2) {
    var sp = [], x = [], dp = [];
    var Data2List = getDic(data2, "SNO");
    $.each(data1, function (i) {
        if (this.CollectType === "1") {
            var time = new Date(this.CollectTime);
            var utc = time.getFullYear().toString() + "/" + (time.getMonth() + 1).toString() + "/" + time.getDate().toString();
            sp.push(this.CollectData.sp);
            dp.push(Data2List[this.SNO].CollectData.dp);
            x.push(utc)
        }
    });
    return { sp: sp, dp: dp, x: x };
}

//处理血糖数据
function GetBloodSugarData(data) {
    var json = [], x = [];
    $.each(data, function () {
        if (this.CollectType === "4") {
            var time = new Date(this.CollectTime);
            var utc = time.getFullYear().toString() + "/" + (time.getMonth() + 1).toString() + "/" + time.getDate().toString();
            json.push(this.CollectData.bs);
            x.push(utc);
        }
    });
    return { bs: json, x: x };
}
//处理血氧数据
function GetBloodOxygenData(data) {
    var json = [], x = [];
    $.each(data, function () {
        if (this.CollectType === "5") {
            var time = new Date(this.CollectTime);
            var utc = time.getFullYear().toString() + "/" + (time.getMonth() + 1).toString() + "/" + time.getDate().toString();
            json.push(this.CollectData.bo);
            x.push(utc);
        }
    });
    return { bo: json, x: x };
}

//处理心率数据
function GetHeartRateData(data) {
    var json = [], x = [];
    $.each(data, function () {
        if (this.CollectType === "6") {
            var time = new Date(this.CollectTime);
            var utc = time.getFullYear().toString() + "/" + (time.getMonth() + 1).toString() + "/" + time.getDate().toString();
            json.push(this.CollectData.hr);
            x.push(utc);
        }
    });
    return { hr: json, x: x };
}


//血压图表
function InitBloodPressureChart(data1, data2) {
    var json = GetBloodPressureData(data1, data2);
    $('#bloodpressure').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: '血压信息'
        },
        subtitle: {
            text: '最近10次的血压量测记录'
        },
        exporting: {
            filename: '导出图表',
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: '导出PNG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出JPG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出PDF文件',
                        onclick: function () {
                            this.exportChart();
                        }
                    }]
                }
            }
        },
        xAxis: {
            categories: json.x
        },
        yAxis: {
            max: 180,
            min: 30,
            plotLines: [{
                color: '#FF0000',
                width: 1,
                value: 140,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }, {
                color: '#FF0000',
                width: 1,
                value: 60,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }, {
                color: '#FF0000',
                width: 1,
                value: 90,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }],
            title: {
                text: '血压 (mmHg)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '收缩压',
            data: json.sp
        }, {
            name: '舒张压',
            data: json.dp
        }]
    });
}

//血糖图表
function InitBloodSugarChart(data) {
    var json = GetBloodSugarData(data);
    $('#bloodsugar').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: '血糖信息'
        },
        subtitle: {
            text: '最近10次的血糖量测记录'
        }, exporting: {
            filename: '导出图表',
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: '导出PNG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出JPG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出PDF文件',
                        onclick: function () {
                            this.exportChart();
                        }
                    }]
                }
            }
        },
        xAxis: {
            categories: json.x
        },
        yAxis: {
            max: 250,
            min: 0,
            plotLines: [{
                color: '#FF0000',
                width: 1,
                value: 200,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    text: '超出血糖临界值',
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }, {
                color: '#FF0000',
                width: 1,
                value: 70,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    text: '超出血糖最低值',
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }],
            title: {
                text: '血糖 (mmol/L)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '血糖',
            data: json.bs
        }]
    });
}

//心率图表
function InitHeartRateChart(data) {
    var json = GetHeartRateData(data);
    $('#heartRate').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: '心率信息'
        },
        subtitle: {
            text: '最近10次的心率量测记录'
        }, exporting: {
            filename: '导出图表',
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: '导出PNG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出JPG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出PDF文件',
                        onclick: function () {
                            this.exportChart();
                        }
                    }]
                }
            }
        },
        xAxis: {
            categories: json.x
        },
        yAxis: {
            max: 200,
            min: 0,
            plotLines: [{
                color: '#FF0000',
                width: 1,
                value: 160,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    text: '超出心率临界值',
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }, {
                color: '#FF0000',
                width: 1,
                value: 40,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 300,//类比html中的z-index
                label: {
                    text: '超出心率最低值',
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }],
            title: {
                text: '心率 (次/分钟)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '心率',
            data: json.hr
        }]
    });
}

//血氧图表
function InitBloodOxygenChart(data) {
    var json = GetBloodOxygenData(data);
    $('#BloodOxygen').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: '血氧信息'
        },
        subtitle: {
            text: '最近10次的血氧量测记录'
        }, exporting: {
            filename: '导出图表',
            buttons: {
                contextButton: {
                    menuItems: [{
                        text: '导出PNG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出JPG图片',
                        onclick: function () {
                            this.exportChart();
                        }
                    }, {
                        text: '导出PDF文件',
                        onclick: function () {
                            this.exportChart();
                        }
                    }]
                }
            }
        },
        xAxis: {
            categories: json.x
        },
        yAxis: {
            max: 110,
            min: 70,
            plotLines: [{
                color: '#FF0000',
                width: 1,
                value: 98,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 30,//类比html中的z-index
                label: {
                    text: '超出血氧临界值',
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }, {
                color: '#FF0000',
                width: 1,
                value: 90,//需要注意这里的设置需要和对应的数据类型相匹配
                dashStyle: 'ShortDash',//定制警戒线样式,有虚线/实线...
                zIndex: 30,//类比html中的z-index
                label: {
                    text: '超出血氧最低值',
                    style: {
                        color: '#FF0000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        fontFamily: '微软雅黑, 黑体',
                    }
                }
            }],
            title: {
                text: '血氧 (%)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: '血氧',
            data: json.bo
        }]
    });
}


