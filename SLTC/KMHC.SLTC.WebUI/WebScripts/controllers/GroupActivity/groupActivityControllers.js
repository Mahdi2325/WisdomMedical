/*
创建人:刘承
创建日期:2016-05-23
说明: 团体活动 groupActivityRes
      成员个别化评估 memberAssessRes
*/
angular.module("sltcApp")
.controller("groupActivityListCtrl", ['$scope', '$http', '$location', '$state', 'utility', 'groupActivityRes', function ($scope, $http, $location, $state, utility, groupActivityRes) {

    $scope.Data = {};
    $scope.Data.GAS = {};

    //查询选项
    $scope.options = {};
    $scope.options.params = {};

    //查询所有
    $scope.init = function () {
        groupActivityRes.query({}, function (data) {
            $scope.Data.GAS = data;
        });
    }


    ////查询
    //$scope.options.search = function () {
    //    $scope.Data.Gas.length = 0;
    //    groupActivityRes.query({}, function (data) {
    //        if ($scope.options.params.activityName == undefined || $scope.options.params.activityName == "") {
    //            $scope.Data.Gas = data;
    //            return false;
    //        }
    //        angular.forEach(data, function (obj, index) {
    //            if (obj.ActivityName == $scope.options.params.activityName) {
    //                $scope.Data.Gas.push(obj);
    //            }
    //        });
    //    });
    //};

    //删除活动项目
    $scope.ItemDelete = function (item) {
        utility.confirm("您确定删除该信息吗?", function (result) {
            if (result) {
                groupActivityRes.delete({ id: item.id }, function () {
                    $scope.Data.GAS.splice($scope.Data.GAS.indexOf(item), 1);
                    utility.message($scope.GATitle + " 信息已刪除！");
                });
            }
        });
    };
    $scope.init();
}])
.controller("groupActivityEditCtrl", ['$scope', '$http', '$location', '$stateParams', '$timeout', 'utility', 'groupActivityRes', 'employeeRes', 'orgRes', 'webUploader',
    function ($scope, $http, $location, $stateParams, $timeout, utility, groupActivityRes, employeeRes, orgRes, webUploader) {
        $scope.Data = {};
        $scope.Data.Ga = {};

        //页面状态
        $scope.Status = {}
        $scope.state = 0;//活动状态: 0:草稿；1：发布；3：进行中(活动开始到结束)；4：完成；5：取消
        $scope.Status.btnState = -1;//按钮状态

        //提示
        $scope.tips = "";

        if ($stateParams.id) {
            groupActivityRes.get({ id: $stateParams.id }, function (data) {
                $scope.Data.Ga = data;
                $scope.AddressDetail = data.City + data.Address;
                $timeout(function () {
                    $("#myAddress1").citypicker("refresh");
                }, 1);

                $scope.Status.state = $scope.Data.Ga.Status;
                //alert($scope.Data.Ga.isDelay)
                if (data.Helpers && data.Helpers != null) {
                    qr.$promise.then(function () {
                        ms.setValue(data.Helpers);
                        $('#selEmps').attr("style", "height: 34px;");
                    });
                }

                $scope.stateSelect();
            });

        } else {
            $scope.isAdd = true;
        }

        $scope.stateSelect = function () {
            $scope.isAdd = false;
            if (!$scope.isAdd && $scope.Data.Ga.Status == 0) {
                $scope.Status.btnState = 0;
            } else if (!$scope.isAdd && $scope.Data.Ga.Status == 1) {
                $scope.Status.btnState = 1;

                var currentTime = new Date().getTime();
                if ($scope.Data.Ga.isDelay) {
                    var preSTime = $scope.str2Date($scope.Data.Ga.DelayStartTime).getTime();
                    var preETime = $scope.str2Date($scope.Data.Ga.DelayEndTime).getTime();

                    if (currentTime > preSTime && currentTime < preETime) {
                        $scope.Status.btnState = 3;
                        alert($scope.Status.btnState);
                    }
                } else {
                    var preSTime = $scope.str2Date($scope.Data.Ga.StartTime).getTime();
                    var preETime = $scope.str2Date($scope.Data.Ga.EndTime).getTime();
                    if (currentTime > preSTime && currentTime < preETime) {
                        $scope.Status.btnState = 3;
                        alert($scope.Status.btnState);
                    }
                }
            } else if (!$scope.isAdd && $scope.Data.Ga.Status == 3) {
                $scope.Status.btnState = 3;
            } else if (!$scope.isAdd && $scope.Data.Ga.Status == 4) {
                $scope.Status.btnState = 4;
            } else if (!$scope.isAdd && $scope.Data.Ga.Status == 5) {
                $scope.Status.btnState = 5;
            }
            //alert($scope.Status.btnState);
        }

        //获取机构
        orgRes.query({}, function (data) {
            $scope.Data.Orgs = data;
        });

        //选择协助人员   
        var ms = $('#selEmps').magicSuggest({
            placeholder: "请选择",
            displayField: 'EmpName',
            style: "height: 34px;",
            valueField: "EmpNo",
            editable: false
        });
        var qr = employeeRes.query({}, function (obj) {
            ms.setData(obj);
        });


        //保存
        $scope.basesave = function () {
            console.log("save")
            $scope.Data.Ga.Helpers = ms.getValue();

            var vals = $("#myAddress1").val();
            if (vals != "") {
                var lastIndex = vals.lastIndexOf("-");
                $scope.Data.Ga.City = vals.substring(0, lastIndex + 1);
                $scope.Data.Ga.Address = vals.substring(lastIndex + 1, vals.length);
            }
            if (!angular.isDefined($scope.Data.Ga.isDelay)) {
                $scope.Data.Ga.isDelay = true;
            }
            groupActivityRes.save($scope.Data.Ga, function (data) {
                $location.url('/angular/GroupActivityList');
                utility.message($scope.Data.Ga.GATitle + $scope.tips);
            });
        }
        //保存为草稿
        $scope.saveItem = function () {
            $scope.Data.Ga.Status = 0;
            $scope.Data.Ga.isDelay = false;
            $scope.tips = " 保存成功！";
            $scope.basesave();
        }
        //发布
        $scope.pubSub = function () {
            $scope.Data.Ga.Status = 1;
            $scope.Data.Ga.isDelay = false;
            $scope.tips = " 发布成功！";
            $scope.basesave();
        }
        //完成
        $scope.complate = function () {
            $scope.Data.Ga.Status = 4;
            $scope.tips = " 活动圆满结束！";
            $scope.basesave();
        }
        //取消
        $scope.cancel = function () {
            $scope.Data.Ga.Status = 5;
            $scope.tips = " 成功取消！";
            $scope.basesave();
        }
        //修改
        $scope.update = function () {
            $scope.tips = " 修改成功！";
            $scope.basesave();
        }

        $scope.saveItemDelay = function () {
            if (!angular.isDefined($scope.Data.Ga.isDelay) || $scope.Data.Ga.isDelay == "") {
                utility.message("请选择是否延期");
                return;
            }

            if (!angular.isDefined($scope.Data.Ga.DelayStartTime) || !angular.isDefined($scope.Data.Ga.DelayEndTime)) {
                utility.message("请选择延期时间");
                return;
            }

            $scope.basesave();
        }



        //选择填写人员（根据员工选择员工名称）
        $scope.staffSelected = function (item, type) {
            if (type === "Leader") {
                $scope.Data.Ga.Organizer = item.EmpNo;
            }
        };

        $scope.checked = function () {

            if (($scope.Data.Ga.isDelay == "") && !$scope.isAdd) {

                $scope.Data.Ga.isDelay = false;
            } else {
                $scope.Data.Ga.isDelay = true;

            }

        };

        $scope.str2Date = function (datestr) {
            //var str ='2015-03-16 17:13:15';
            datestr = datestr.replace(/-/g, "/");
            var date = new Date(datestr);
            return date;
        }


        webUploader.init('#Picture1PathPicker', { category: 'HomePhoto' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
            if (data.length > 0) {
                $scope.Data.Ga.Picture1 = data[0].SavedLocation;
                $scope.$apply();
            }
        });
        webUploader.init('#Picture2PathPicker', { category: 'HomePhoto' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
            if (data.length > 0) {
                $scope.Data.Ga.Picture2 = data[0].SavedLocation;
                $scope.$apply();
            }
        });
    }])
//.controller("memberAssessCtrl", ['$scope', '$stateParams', 'utility', 'memberAssessRes', function ($scope, $stateParams, utility, memberAssessRes) {
//    //$stateParams.id
//    $scope.Data = {};
//    $scope.currentItem = {};
//    // 當前住民
//    $scope.currentResident = {}
//    $scope.buttonShow = false;
//    if ($stateParams.id) {
//        //加載所選活動的成員個別化活動評估
//        memberAssessRes.query({ GAID: $stateParams.id }, function (data) {
//            $scope.Data.AssessList = data;
//        });
//    }

//    //選中住民
//    $scope.residentSelected = function (resident) {
//        $scope.currentResident = resident;//獲取當前住民信息
//        if (angular.isDefined($scope.currentResident.id)) {
//            $scope.buttonShow = true;
//        }
//    }

//    //刪除活動評估記錄
//    $scope.deleteItem = function (item) {
//        if (confirm("您確定要刪除該住民的個別化活動評估記錄嗎?")) {
//            item.$delete().then(function () {
//                $scope.Data.AssessList.splice($scope.Data.AssessList.indexOf(item), 1);
//            });
//            utility.message(item.ResidentName + "的活動評估記錄已刪除！");
//        }
//    };


//    $scope.createItem = function (item) {
//        //新增零用金收支記錄，得到住民ID
//        $scope.currentItem.ResidentId = $scope.currentResident.id;
//        $scope.currentItem.ResidentName = $scope.currentResident.Name;
//        $scope.currentItem.GAID = $stateParams.id;
//        memberAssessRes.save($scope.currentItem, function (data) {
//            $scope.Data.AssessList.push(data);

//        });
//    };

//    $scope.updateItem = function (item) {
//        item.$save();
//    };


//    $scope.rowSelect = function (item) {
//        $scope.currentItem = item;
//        if (angular.isDefined(item.id)) {
//            $scope.buttonShow = true;
//        }
//    };

//    $scope.saveEdit = function (item) {
//        var showName = "";
//        if (angular.isDefined(item.id)) {
//            $scope.updateItem(item);
//            showName = item.ResidentName;
//        } else {
//            $scope.createItem(item);
//            showName = $scope.currentResident.Name;
//        }
//        utility.message(showName + "的活動評估記錄保存成功！");
//        $scope.currentItem = {};
//        $scope.buttonShow = false;
//    };




//}])

    .controller("groupActivityResList", ['$scope', '$http', '$location', '$stateParams', 'utility', 'groupActivityRes', 'residentRes', function ($scope, $http, $location, $stateParams, utility, groupActivityRes, residentRes) {
        $scope.Data = {};
        $scope.Data.Ga = {};
        $scope.Data.Ga.Participants = [];
        // $scope.Data.Participants=[]
        $scope.Data.Residents = [];

        if ($stateParams.id) {
            groupActivityRes.get({ id: $stateParams.id }, function (data) {
                $scope.Data.Ga = data;
                var items = data.Participants;
                residentRes.query({}, function (residents) {

                    angular.forEach($scope.Data.Ga.Participants, function (item, index1) {
                        var itemNo = item.PersonNo;
                        angular.forEach(residents, function (resident, index2) {
                            if (resident.PersonNo == itemNo) {
                                $scope.Data.Ga.Participants[index1].item = {};
                                $scope.Data.Ga.Participants[index1].item = angular.copy(resident);
                            }
                        })
                    });

                });
            });
        }

        //选中住民回调函数
        $scope.residentSelected = function (item) {
            //此处如果不判断则回调会返回一次空对象过来。
            if (!angular.isDefined(item)) {
                return;
            }
            $scope.CurResident = item;//设置当前住民
        }


        //保存数据
        $scope.submit = function () {
            if (!angular.isDefined($scope.CurResident)) {
                utility.message("请先选择VIP客户.");
                return;
            }
            var istrue = false;
            angular.forEach($scope.Data.Ga.Participants, function (obj, index) {
                if (obj.PersonNo == $scope.CurResident.PersonNo) {
                    istrue = true;
                    return;
                }
            });

            if (istrue) {
                utility.message("项目已存在");
                return;
            }
            if (!angular.isDefined($scope.Data.Ga.Participants)) {
                $scope.Data.Ga.Participants = [];
            }
            $scope.Data.Ga.Participants.push($scope.CurResident);
            $scope.Data.Ga.ParticNum = $scope.Data.Ga.Participants.length;
            groupActivityRes.save($scope.Data.Ga, function () {
                utility.message("保存成功.");
                $scope.CurResident = "";
            });
        }
        //删除
        $scope.delete = function (item) {
            if (!angular.isDefined(item)) {
                utility.message("请先选择VIP客户.");
                return;
            }

            var index = -1;
            angular.forEach($scope.Data.Ga.Participants, function (obj, sort) {

                if (obj.PersonNo == item.PersonNo) {
                    index = sort;
                    return;
                }
            });

            utility.confirm("确定删除该人员信息吗?", function (result) {
                if (result) {
                    $scope.Data.Ga.Participants.splice(index, 1);
                    $scope.Data.Ga.ParticNum = $scope.Data.Ga.Participants.length;
                    groupActivityRes.save($scope.Data.Ga, function () {
                        utility.message("删除成功.");
                    });
                }

            });



        }

    }])
.controller("ResidentTestlistCtrl", ['$scope', '$http', '$location', '$stateParams', 'webUploader', 'utility', 'groupActivityRes',
    function ($scope, $http, $location, $stateParams, webUploader, utility, groupActivityRes) {
        //选中住民回调函数
        $scope.residentSelected = function (resident) {           
            $scope.curResident = resident;//设置当前住民
        }


    }])
//.controller("activityPhotoCtrl", ['$scope', '$http', '$location', '$stateParams', 'webUploader', 'utility', 'groupActivityRes',
//    function ($scope, $http, $location, $stateParams, webUploader, utility, groupActivityRes) {
//        $scope.Detail = {};
//        $scope.save = function () {
//            groupActivityRes.save($scope.Detail, function (data) {
//                $location.url('/angular/GroupActivityList');
//                utility.message($scope.Data.Detail.GAName + "的團體活動圖片信息保存成功！");
//            });
//        }

//        $scope.init = function () {
//            if ($stateParams.id) {
//                groupActivityRes.get({ id: $stateParams.id }, function (data) {
//                    $scope.Detail = data;
//                    if (!data.GAPicture || data.GAPicture.length == 0) {
//                        $scope.Detail.GAPicture = [];
//                        for (var i = 0; i < 3; i++) {
//                            $scope.Detail.GAPicture.push({
//                                index: i + 1,
//                                PhotoUrl: "",
//                                PhotoName: ""
//                            });
//                        }
//                    }
//                });
//            }

//            //seajs.use(['/Scripts/webuploader', '/Content/webuploader.css'], function () {
//            webUploader.init('#PhotoPicker1', { category: 'HomePhoto' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
//                if (data.length > 0) {
//                    $scope.Detail.GAPicture[0].PhotoUrl = data[0].SavedLocation;
//                    $scope.Detail.GAPicture[0].PhotoName = data[0].FileName;
//                    $scope.$apply();
//                }
//            });

//            webUploader.init('#PhotoPicker2', { category: 'HomePhoto' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
//                if (data.length > 0) {
//                    $scope.Detail.GAPicture[1].PhotoUrl = data[0].SavedLocation;
//                    $scope.Detail.GAPicture[1].PhotoName = data[0].FileName;
//                    $scope.$apply();
//                }
//            });

//            webUploader.init('#FilePicker', { category: 'HomePhoto' }, '文件', 'doc,docx', 'doc/*', function (data) {
//                if (data.length > 0) {
//                    $scope.Detail.GAPicture[2].PhotoUrl = data[0].SavedLocation;
//                    $scope.Detail.GAPicture[2].PhotoName = data[0].FileName;
//                    $scope.$apply();
//                }
//            });
//        }

//        $scope.clear = function (type) {
//            switch (type) {
//                case "PhotoPicker1":
//                    $scope.Detail.GAPicture[0].PhotoUrl = "";
//                    $scope.Detail.GAPicture[0].PhotoName = "";
//                    break;
//                case "PhotoPicker2":
//                    $scope.Detail.GAPicture[1].PhotoUrl = "";
//                    $scope.Detail.GAPicture[1].PhotoName = "";
//                    break;
//                case "FilePicker":
//                    $scope.Detail.GAPicture[2].PhotoUrl = "";
//                    $scope.Detail.GAPicture[2].PhotoName = "";
//                    break;
//            }
//        }

//        $scope.init();

//    }])




