/*
创建人:张有军
创建日期:2016-11-22
说明: 活动 activityRes
*/
angular.module("sltcApp")
.controller("SelectMemberModalPopuCtrl", ['$scope', '$http', '$state', '$location', 'utility', 'resourceFactory', function ($scope, $http, $state, $location, utility, resourceFactory) {
    var residentRes = resourceFactory.getResource("residentRes");
    $scope.Data = {
        Residents: [],
        Orgs: [],
        SelectedResidents: []
    };
    
    $scope.init = function () {
        $scope.Data.SelectedResidents = [];
        SetSelectedMembers();
        $scope.options = {
            buttons: [],//需要打印按钮时设置
            ajaxObject: residentRes,//异步请求的res
            params: { 'Data.PersonName': "", "Data.OrganizationID": $scope.$root.user.OrgId },
            success: function (data) {//请求成功时执行函数
                $scope.Data.Residents = data.Data;
            },
            pageInfo: {//分页信息
                CurrentPage: 1, PageSize: 10
            }
        }
    }

    function SetSelectedMembers() {
        if ($scope.activity.MemberIDs != "" && $scope.activity.MemberIDs != null && $scope.activity.MemberIDs != undefined) {
            var selIdArr = $scope.activity.MemberIDs.split(",");
            var selNameArr = $scope.activity.MemberNames.split(",");
            for (var i = 0; i < selIdArr.length; i++) {
                var selObj = new Object();
                selObj.PersonName = selNameArr[i];
                selObj.ResidentID = selIdArr[i];
                $scope.Data.SelectedResidents.push(selObj);
            }
        }
    }

    //初始化
    $scope.searchMember = function () {
        $scope.options.search();
    };

    function GetSelectedMembers() {
        var mb = new Object();
        var strIds = "";
        var strNames = "";
        var schar = "";
        for (var i = 0; i < $scope.Data.SelectedResidents.length; i++) {
            strIds += schar + $scope.Data.SelectedResidents[i].ResidentID;
            strNames += schar + $scope.Data.SelectedResidents[i].PersonName;
            schar = ",";
        }
        mb.MemberIDs = strIds;
        mb.MemberNames = strNames;
        return mb;
    }

    $scope.memberRowClick = function (item) {
        var selectedMembers = $scope.Data.SelectedResidents;
        var isExist = false;
        for (var i = 0; i < selectedMembers.length; i++) {
            if (selectedMembers[i].ResidentID == item.ResidentID) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            var selObj = new Object();
            selObj.PersonName = item.PersonName;
            selObj.ResidentID = item.ResidentID;
            $scope.Data.SelectedResidents.push(selObj);
        }
    };

    $scope.delMemberSelected = function (item) {
        $scope.Data.SelectedResidents.splice($scope.Data.SelectedResidents.indexOf(item), 1);
    };

    $('#modalSelectMemberItem').on('show.bs.modal',
    function () {
        $scope.Data.SelectedResidents = [];
        SetSelectedMembers();
    });
    $scope.SubmitMemberSelect = function () {
        if ($scope.Data.SelectedResidents.length > 0) {
            var rd = GetSelectedMembers();
            $scope.activity.MemberIDs = rd.MemberIDs;
            $scope.activity.MemberNames = rd.MemberNames;
            $scope.activity.MemberCount = $scope.Data.SelectedResidents.length;
            $('#modalSelectMemberItem').modal('hide');
        } else {
            utility.message("尚未选择会员。");
        }
    };
    $scope.init();
}]);





