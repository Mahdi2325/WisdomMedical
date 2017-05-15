/*
创建人:刘承
创建日期:2016-05-23
说明: 团体活动 groupActivityRes
      成员个别化评估 memberAssessRes
*/
angular.module("sltcApp")
.controller("groupActivityListCtrl_old", ['$scope', '$http', '$location', '$state', 'utility', 'groupActivityRes', function ($scope, $http, $location, $state, utility, groupActivityRes) {
    
    $scope.Data = {};
    $scope.Data.Gas = {};

    //查询选项
    $scope.options = {};
    $scope.options.params = {};

    //查询所有
    $scope.init = function () {
        groupActivityRes.query({}, function (data) {          
            $scope.Data.Gas = data;
        });
    }


    //查询
    $scope.options.search = function () {
        $scope.Data.Gas.length = 0;
        groupActivityRes.query({}, function (data) {
            if ($scope.options.params.activityName == undefined || $scope.options.params.activityName == "") {
                $scope.Data.Gas = data;
                return false;
            }
            angular.forEach(data, function (obj, index) {
                if (obj.ActivityName == $scope.options.params.activityName) {
                    $scope.Data.Gas.push(obj);
                }
            });
        });
    };

    //删除活动项目
    $scope.ItemDelete = function (item) {
        utility.confirm("您确定删除该员工信息吗?", function (result) {
            if (result) {
                groupActivityRes.delete({ id: item.id }, function () {
                    $scope.Data.Gas.splice($scope.Data.Gas.indexOf(item), 1);
                    utility.message($scope.ActivityName + "的团体活动信息已刪除！");
                });
            }
        });
    };
    $scope.init();
}])
.controller("groupActivityEditCtrl_old", ['$scope', '$http', '$location', '$stateParams', 'utility', 'groupActivityRes', 'webUploader', function ($scope, $http, $location, $stateParams, utility, groupActivityRes, webUploader) {
    $scope.Data = {};
    $scope.Data.Ga = {};

    if ($stateParams.id) {
        groupActivityRes.get({ id: $stateParams.id }, function (data) {
            $scope.Data.Ga = data;
        });
    }

    $scope.save = function () {
        groupActivityRes.save($scope.Data.Ga, function (data) {
            $location.url('/angular/GroupActivityList');
            utility.message($scope.Data.Ga.ActivityName + "的团体活动信息保存成功！");
        });
    }

    //选择填写人员（根据员工选择员工名称）
    $scope.staffSelected = function (item, type) {
        if (type === "Leader") {
            $scope.Data.Ga.LeaderName = item.EmpNo;
        } else if (type === "Leader1") {
            $scope.Data.Ga.LeaderName1 = item.EmpNo;
        } else if (type === "Leader2") {
            $scope.Data.Ga.LeaderName2 = item.EmpNo;
        } else if (type === "InputName") {
            $scope.Data.Ga.Operator = item.EmpNo;
        }
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
.controller("memberAssessCtrl_old", ['$scope', '$stateParams', 'utility', 'memberAssessRes', function ($scope, $stateParams, utility, memberAssessRes) {
    //$stateParams.id
    $scope.Data = {};
    $scope.currentItem = {};
    // 當前住民
    $scope.currentResident = {}
    $scope.buttonShow = false;
    if ($stateParams.id) {
        //加載所選活動的成員個別化活動評估
        memberAssessRes.query({ GAID: $stateParams.id }, function (data) {
            $scope.Data.AssessList = data;
        });
    }

    //選中住民
    $scope.residentSelected = function (resident) {
        $scope.currentResident = resident;//獲取當前住民信息
        if (angular.isDefined($scope.currentResident.id)) {
            $scope.buttonShow = true;
        }
    }
    
    //刪除活動評估記錄
    $scope.deleteItem = function (item) {
        if (confirm("您確定要刪除該住民的個別化活動評估記錄嗎?")) {
            item.$delete().then(function () {
                $scope.Data.AssessList.splice($scope.Data.AssessList.indexOf(item), 1);
            });
            utility.message(item.ResidentName + "的活動評估記錄已刪除！");
        }
    };


    $scope.createItem = function (item) {
        //新增零用金收支記錄，得到住民ID
        $scope.currentItem.ResidentId = $scope.currentResident.id;
        $scope.currentItem.ResidentName = $scope.currentResident.Name;
        $scope.currentItem.GAID = $stateParams.id;
        memberAssessRes.save($scope.currentItem, function (data) {
            $scope.Data.AssessList.push(data);
            
        });
    };

    $scope.updateItem = function (item) {
        item.$save();
    };


    $scope.rowSelect = function (item) {
        $scope.currentItem = item;
        if (angular.isDefined(item.id)) {
            $scope.buttonShow = true;
        }
    };

    $scope.saveEdit = function (item) {
        var showName = "";
        if (angular.isDefined(item.id)) {
            $scope.updateItem(item);
            showName = item.ResidentName;
        } else {
            $scope.createItem(item);
            showName = $scope.currentResident.Name;
        }
        utility.message(showName + "的活動評估記錄保存成功！");
        $scope.currentItem = {};
        $scope.buttonShow = false;
    };




}])
.controller("activityPhotoCtrl_old", ['$scope', '$http', '$location', '$stateParams', 'webUploader', 'utility', 'groupActivityRes',
    function ($scope, $http, $location, $stateParams, webUploader, utility, groupActivityRes) {
    $scope.Detail = {};
    $scope.save = function () {
        groupActivityRes.save($scope.Detail, function (data) {
            $location.url('/angular/GroupActivityList');
            utility.message($scope.Data.Detail.GAName + "的團體活動圖片信息保存成功！");
        });
    }

    $scope.init = function () {
        if ($stateParams.id) {
            groupActivityRes.get({ id: $stateParams.id }, function (data) {
                $scope.Detail = data;
                if (!data.GAPicture || data.GAPicture.length == 0) {
                    $scope.Detail.GAPicture = [];
                    for (var i = 0; i < 3; i++) {
                        $scope.Detail.GAPicture.push({
                            index: i + 1,
                            PhotoUrl: "",
                            PhotoName: ""
                        });
                    }
                }
            });
        }
        
        //seajs.use(['/Scripts/webuploader', '/Content/webuploader.css'], function () {
        webUploader.init('#PhotoPicker1', { category: 'HomePhoto' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
            if (data.length > 0) {
                $scope.Detail.GAPicture[0].PhotoUrl = data[0].SavedLocation;
                $scope.Detail.GAPicture[0].PhotoName = data[0].FileName;
                $scope.$apply();
            }
        });

        webUploader.init('#PhotoPicker2', { category: 'HomePhoto' }, '图片', 'gif,jpg,jpeg,bmp,png', 'image/*', function (data) {
            if (data.length > 0) {
                $scope.Detail.GAPicture[1].PhotoUrl = data[0].SavedLocation;
                $scope.Detail.GAPicture[1].PhotoName = data[0].FileName;
                $scope.$apply();
            }
        });

        webUploader.init('#FilePicker', { category: 'HomePhoto' }, '文件', 'doc,docx', 'doc/*', function (data) {
            if (data.length > 0) {
                $scope.Detail.GAPicture[2].PhotoUrl = data[0].SavedLocation;
                $scope.Detail.GAPicture[2].PhotoName = data[0].FileName;
                $scope.$apply();
            }
        });
    }

    $scope.clear = function (type) {
        switch (type) {
            case "PhotoPicker1":
                $scope.Detail.GAPicture[0].PhotoUrl = "";
                $scope.Detail.GAPicture[0].PhotoName = "";
                break;
            case "PhotoPicker2":
                $scope.Detail.GAPicture[1].PhotoUrl = "";
                $scope.Detail.GAPicture[1].PhotoName = "";
                break;
            case "FilePicker":
                $scope.Detail.GAPicture[2].PhotoUrl = "";
                $scope.Detail.GAPicture[2].PhotoName = "";
                break;
        }
    }

    $scope.init();

}])