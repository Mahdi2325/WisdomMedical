/*
创建人:张有军
创建日期:2016-11-22
说明: 活动 activityRes
*/
angular.module("sltcApp")
.controller("SelectedMemberModal", ['$scope', '$http', '$state', '$location', 'utility', 'resourceFactory', function ($scope, $http, $state, $location, utility, resourceFactory) {
    var residentRes = resourceFactory.getResource("residentRes");
    $scope.Member = {
        Residents: []
    };
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: residentRes,//异步请求的res
        params: {},
        success: function (data) {//请求成功时执行函数    
            $scope.Member.Residents = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    };
    $('#modalSelectedMember').on('show.bs.modal',
        function () {
            var selMembers = [];
            $scope.Member.Residents = [];

            var params = {};
            if ($scope.SelectedActivity == undefined || $scope.SelectedActivity == null) {
                return;
            }
            if ($scope.SelectedActivity.MemberIDs != undefined && $scope.SelectedActivity.MemberIDs != "" && $scope.SelectedActivity.MemberIDs != null) {
                selMembers = $scope.SelectedActivity.MemberIDs.split(',');
            } else {
                return;
            }
            for (var i = 0; i < selMembers.length; i++) {
                params['Data.ResidentIDs[' + i + ']'] = selMembers[i];
            }
            $scope.options.pageInfo.CurrentPage = 1;
            $scope.options.params = params;
            $scope.options.search();
        });
}])
;





