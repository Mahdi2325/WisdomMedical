/*
        创建人: 李林玉
        创建日期:2016-06-03
        说明: 机构菜单
*/


angular.module("sltcApp")
    .controller("orgModuleCtrl", ['$scope', '$q', '$location', '$state', 'orgModuleRes', 'roleModuleRes', 'utility', function ($scope, $q, $location, $state, orgModuleRes, roleModuleRes, utility) {
        $scope.search = function () {
            roleModuleRes.query({}, function (modules) {
                if (modules && modules.length > 0) {
                    orgModuleRes.query({}, function (data) {                       
                        InitOrgModuleTreeGrid(modules, data);
                    });
                }
            });
        };
        $scope.saveResult = function (list) {
            if (list && list.length > 0) {
                var asyncObj = [];
                $.each(list, function () {
                    asyncObj.push(orgModuleRes.save(this, function () {
                    }));
                });
                $q.all(asyncObj).then(function () {
                    utility.message("保存成功！");
                });
            }
        };

        $scope.saveAll = function () {
            var rows = $("#menuTree").jqGrid("getRowData");
            if (rows && rows.length > 0) {
                var json = [];
                $.each(rows, function () {
                    var b = $("#" + this.id).find(".itmchk").prop("checked");
                    if (b || (this.OrgMenuNo && this.OrgMenuNo !== "")) {
                        json.push({ id: this.OrgMenuNo, Alias: this.Alias, Sort: this.Sort, ModuleNo: this.id, Status: b });
                    }

                });
                if (json.length > 0) {
                    $scope.saveResult(json);
                }
            }
        };


        $scope.search();
    }
    ]);


function GetOrgModuleData(menus, orgmd) {

    var json = { "response": [] };

    var dic = new Array();
    if (orgmd && orgmd.length > 0) {
        $.each(orgmd, function () {
            dic[this.ModuleNo] = this;
        });
    }

    $.each(menus, function () {

        if ((!this.ModuleId || this.ModuleId == '') || (!this.SuperModuleId || this.SuperModuleId == '')) {
            return true;
        }
        var obj = {
            id: this.ModuleId,
            ModuleName: this.ModuleName,
            level: this.SuperModuleId === "00" ? "0" : "1",
            parent: this.SuperModuleId === "00" ? "" : this.SuperModuleId,
            isLeaf: this.SuperModuleId === "00" ? false : true,
            expanded: false,
            loaded: true
        }
        if (dic[obj.id]) {
            obj.Alias = dic[obj.id].Alias;
            obj.Sort = dic[obj.id].Sort;
            obj.OrgMenuNo = dic[obj.id].id;
            obj.OrgMenuStatus = dic[obj.id].Status;
        }

        json.response.push(obj);
    });
    json.response.sort(function (a, b) {
        var x = a.id < 100 ? a.id * 1000 : a.id * 1;
        var y = b.id < 100 ? b.id * 1000 : b.id * 1;
        return x - y;
    });

    return json;
}

function InitOrgModuleTreeGrid(data, orgmd) {

    var json = GetOrgModuleData(data, orgmd);

    $("#menuTree").jqGrid({
        datastr: json,
        datatype: "jsonstring",
        multiselect: true,
        multiboxonly: true,
        height: "auto",
        loadui: "disable",
        colNames: ["id", "OrgMenuNo", "OrgMenuStatus", "菜单名称", "别名", "排序", "操作"],
        colModel: [
            {
                name: "id", key: true, sortable: false, width: '30', hidden: true

            },
            {
                name: "OrgMenuNo", sortable: false, width: '30', hidden: true

            },
            {
                name: "OrgMenuStatus", sortable: false, width: '30', hidden: true

            },
            {
                name: "ModuleName", sortable: false, width: 300, formatter: function (cellvalue, row, data) {
                    return "<input type='checkbox' class='itmchk' ><strong>" + $.jgrid.htmlEncode(cellvalue) + "</strong>";
                }
            },
            { name: "Alias", width: 100, editable: true, sortable: false, hidden: false },
            { name: "Sort", width: 100, editable: true, editrules: { number: true, minValue: 0 }, sortable: false, hidden: false },
            {
                name: "operat", width: 100, sortable: false, hidden: false, formatter: function (cellvalue, row, data) {
                    return '<div><button onclick="editRow(this,\'' + row.rowId + '\')">编辑</button></div><div style="display:none;"><button onclick="updateRow(this,\'' + row.rowId + '\')">保存</button><button onclick="cancelEdit(this,\'' + row.rowId + '\')">取消</button></div>';
                }
            }
        ],
        treeGrid: true,
        treeGridModel: "adjacency",
        ExpandColumn: "ModuleName",
        treeIcons: { plus: 'ui-icon-triangle-1-e', minus: 'ui-icon-triangle-1-s', leaf: 'ui-icon-document-b' },
        caption: "机构菜单列表",
        rowNum: -1,
        autowidth: true,
        //ExpandColClick: true,
        jsonReader: {
            repeatitems: false,
            root: "response"
        },
        beforeSelectRow: function (rowid, e) {
            var $this = $(this),
                isLeafName = $this.jqGrid("getGridParam", "treeReader").leaf_field,
                localIdName = $this.jqGrid("getGridParam", "localReader").id,
                localData,
                state,
                setChechedStateOfChildrenItems = function (children) {
                    $.each(children, function () {
                        $("#" + this[localIdName] + " input.itmchk").prop("checked", state);
                        if (!this[isLeafName]) {
                            setChechedStateOfChildrenItems($this.jqGrid("getNodeChildren", this));
                        }
                    });
                },
                setChechedStateOfParentItems = function (parent) {
                    if (parent && parent[localIdName]) {
                        var ps = $("#" + parent[localIdName] + " input.itmchk").prop("checked");
                        if (ps !== state) {
                            if (state) {
                                $("#" + parent[localIdName] + " input.itmchk").prop("checked", state);
                            } else {
                                var children = $this.jqGrid("getNodeChildren", parent);
                                var b = false;
                                $.each(children, function () {
                                    if ($("#" + this[localIdName] + " input.itmchk").prop("checked")) {
                                        b = true;
                                    }
                                });
                                if (!b) {
                                    $("#" + parent[localIdName] + " input.itmchk").prop("checked", state);
                                }
                            }
                            if (parent["parent"]) {
                                setChechedStateOfParentItems($this.jqGrid("getNodeParent", this));
                            }
                        }
                    }
                };
            if (e.target.nodeName === "INPUT" && $(e.target).hasClass("itmchk")) {
                state = $(e.target).prop("checked");
                localData = $this.jqGrid("getLocalRow", rowid);
                setChechedStateOfChildrenItems($this.jqGrid("getNodeChildren", localData), state);
                setChechedStateOfParentItems($this.jqGrid("getNodeParent", localData), state);
            }
        },
        gridComplete: function () {
            var obj = $("#menuTree").jqGrid("getRowData");
            $(obj).each(function () {
                if (this.OrgMenuStatus === "true") {
                    $("#" + this.id).find(".itmchk").prop("checked", true);
                }
            });
        }
    });

}

function editRow(obj, id) {
    $("#menuTree").editRow(id,
    {
        oneditfunc: function () {
            $(obj).parent().hide();
            $(obj).parent().next().show();
            return true;
        }
    });

}
function updateRow(obj, id) {
    $("#menuTree").saveRow(id,
    {
        successfunc: function (response) {
            $(obj).parent().hide();
            $(obj).parent().prev().show();
            return true;
        }, aftersavefunc: function (dd) {
            var scope = angular.element("#OrgModuleDiv").scope();
            if (scope && scope.saveResult) {
                scope.saveAll();
            }
        }
    });

}
function cancelEdit(obj, id) {
    $("#menuTree").restoreRow(id, function () {
        $(obj).parent().hide();
        $(obj).parent().prev().show();
    });
}