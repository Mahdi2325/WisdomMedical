///创建人:肖國棟
///创建日期:2016-06-00
///说明:健康記錄追蹤

angular.module("sltcApp")
.controller('regCheckRecordDtlCtrl', ['$scope', '$location', '$state', '$filter', 'utility', 'DCResidentRes', 'regCheckRecordRes', 'checkTemplateRes',
    function ($scope, $location, $state, $filter, utility, DCResidentRes, regCheckRecordRes, checkTemplateRes) {
        var regNo = $state.params.RegNo;
        $scope.resident = {};
        checkTemplateRes.get({ "Data": {} }, function (data) {
            $scope.checkTemplateList = data.Data;
        });
        if (regNo && regNo != "0") {
            DCResidentRes.get({ id: regNo }, function (data) {
                $scope.resident = data.Data;
            });
            var date = new Date();
            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: regCheckRecordRes,//异步请求的res
                params: { startDate: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).format("yyyy-MM-dd"), endDate: date.format("yyyy-MM-dd"), displayType: "1", checkTemplateCode: "01", regNo: regNo },
                success: function (data) {//请求成功时执行函数
                    $scope.RegCheckRecordDtlList = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                }
            }
        }
        $scope.edit = function (item) {
            regCheckRecordRes.save({ RecordId: item.RecordId, TraceStatus: true }, function (data) {
                item.TraceStatus = true;
            });
        }
        $scope.backTo = function () {
            $state.go('RegCheckRecordList');
        }
    }])
.controller("regCheckRecordListCtrl", ['$scope', '$http', '$state', '$location', 'utility', 'regCheckRecordRes', function ($scope, $http, $state, $location, utility, regCheckRecordRes) {
    var date = new Date();
    
    $scope.options = {
        buttons: [],//需要打印按钮时设置
        ajaxObject: regCheckRecordRes,//异步请求的res
        params: { startDate: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).format("yyyy-MM-dd"), endDate: date.format("yyyy-MM-dd"), displayType: "1", traceStatus: "1", idNo: "", regName: "" },
        success: function (data) {//请求成功时执行函数
            $scope.RegCheckRecordList = data.Data;
        },
        pageInfo: {//分页信息
            CurrentPage: 1, PageSize: 10
        }
    }
  
    $scope.edit = function (type, item) {
        switch (type) {
            case "check":
                $state.go('RegCheckRecordDtl', { RegNo: item.RegNo });
                $state.stateName = "RegCheckRecordDtl";
                break;
            case "note":
                $state.go('RegNoteRecord', { RegNo: item.RegNo });
                $state.stateName = "RegNoteRecord";
                break;
            case "visit":
                $state.go('RegVisitRecord', { RegNo: item.RegNo });
                $state.stateName = "RegVisitRecord";
                break;
        }
    }
}])
.controller('regNoteRecordCtrl', ['$scope', '$location', '$state', '$filter', 'utility', 'DCResidentRes', 'regNoteRecordRes', 'noteRes',
    function ($scope, $location, $state, $filter, utility, DCResidentRes, regNoteRecordRes, noteRes) {
        $scope.displayMode = 'record';
        var regNo = $state.params.RegNo;
        var date = new Date();
        $scope.Data = { NoteDate: date.format("yyyy-MM-dd"), ActionUserName: currentUser.EmpName };
        var loadNoteData = function () {
            noteRes.get({ noteName: '', isShow: 1, currentPage: 1, pageSize: 100 }, function (data) {
                $scope.SelectNoteList = data.Data;
            });
        }

        if (regNo && regNo != "0") {
            DCResidentRes.get({ id: regNo }, function (data) {
                $scope.resident = data.Data;
            });
            loadNoteData();
            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: regNoteRecordRes,//异步请求的res
                params: { startDate: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).format("yyyy-MM-dd"), endDate: date.format("yyyy-MM-dd"), regNo: regNo },
                success: function (data) {//请求成功时执行函数
                    $scope.RegNoteRecordList = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                }
            };
            $scope.noteOptions = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: noteRes,//异步请求的res
                params: { noteName: '' },
                success: function (data) {//请求成功时执行函数
                    $scope.NoteList = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                }
            };
        }
        $scope.openModal = function (id, item) {
            if (item) {
                $scope.Data = item;
                if (id == 'noteRecordModal') {
                    regNoteRecordRes.save({
                        id: item.RecordId,
                    }, function (data) {
                        item.ViewStatus = 1;
                    });
                }
                if (id == 'noteModal') {
                    $scope.Data.IsShow = $scope.Data.IsShow == 1;
                }
            }
            else {
                $scope.Data = { NoteDate: date.format("yyyy-MM-dd"), ActionUserName: currentUser.EmpName };
            }
            $("#" + id).modal('toggle');
        };
        $scope.save = function (id, item) {
            if (id == 'noteRecordModal') {
                regNoteRecordRes.save({
                    RecordId: item.RecordId,
                    RegNo: regNo,
                    NoteDate: item.NoteDate,
                    NoteContent: item.NoteContent,
                    ActionUserCode: currentUser.EmpNo
                }, function (data) {
                    $scope.options.search();
                    $("#" + id).modal('toggle');
                });
            }
            else if (id == 'noteModal')
            {
                noteRes.save({
                    NoteId: item.NoteId,
                    RegNo: regNo,
                    ShowNumber: item.ShowNumber,
                    IsShow: item.IsShow,
                    NoteName: item.NoteName,
                    NoteContent: item.NoteContent,
                    ActionUserCode: currentUser.EmpNo
                }, function (data) {
                    $scope.noteOptions.search();
                    loadNoteData();
                    $("#" + id).modal('toggle');
                });
            }
        }
        $scope.delete = function (type, item) {
            if (type == 'record') {
                regNoteRecordRes.delete({
                    id: item.RecordId,
                }, function (data) {
                    $scope.options.search();
                    utility.message("信息删除成功！");
                });
            }
            else if( type == 'note')
            {
                noteRes.delete({
                    id: item.NoteId,
                }, function (data) {
                    $scope.noteOptions.search();
                    loadNoteData();
                    utility.message("信息删除成功！");
                });
            }
        }
        $scope.toggleDisplayMode = function () {
            $scope.displayMode = $scope.displayMode == 'record' ? 'note' : 'record';
        }
        $scope.change = function (item) {
            $scope.Data.NoteContent = item.NoteContent;
        }
        $scope.backTo = function () {
            $state.go('RegCheckRecordList');
        }
    }])
.controller('regVisitRecordCtrl', ['$scope', '$location', '$state', '$filter', 'utility', 'DCResidentRes', 'regVisitRecordRes',
    function ($scope, $location, $state, $filter, utility, DCResidentRes, regVisitRecordRes) {
        var regNo = $state.params.RegNo;
        var date = new Date();
        $scope.Data = { VisitDate: date.format("yyyy-MM-dd"), ActionUserName: currentUser.EmpName };
        if (regNo && regNo != "0") {
            DCResidentRes.get({ id: regNo }, function (data) {
                $scope.resident = data.Data;
            });
            $scope.options = {
                buttons: [],//需要打印按钮时设置
                ajaxObject: regVisitRecordRes,//异步请求的res
                params: { startDate: new Date(date.getFullYear(), date.getMonth() - 1, date.getDate()).format("yyyy-MM-dd"), endDate: date.format("yyyy-MM-dd"), regNo: regNo },
                success: function (data) {//请求成功时执行函数
                    $scope.RegVisitRecordList = data.Data;
                },
                pageInfo: {//分页信息
                    CurrentPage: 1, PageSize: 10
                }
            }
        }
        $scope.openModal = function (item) {
            if (item) {
                $scope.Data = item;
            }
            else {
                $scope.Data = { VisitDate: date.format("yyyy-MM-dd"), ActionUserName: currentUser.EmpName };
            }
            $("#visitModal").modal('toggle');
        };
        $scope.save = function (item) {
            regVisitRecordRes.save({
                RecordId: item.RecordId,
                RegNo: regNo,
                VisitDate: item.VisitDate,
                VisitContent: item.VisitContent,
                ActionUserCode: currentUser.EmpNo
            }, function (data) {
                $scope.options.search();
                $("#visitModal").modal('toggle');
            });
        }
        $scope.delete = function (item) {
            regVisitRecordRes.delete({
                id: item.RecordId,
            }, function (data) {
                $scope.options.search();
                utility.message("信息删除成功！");
            });
        }
        $scope.backTo = function () {
            $state.go('RegCheckRecordList');
        }
    }]);