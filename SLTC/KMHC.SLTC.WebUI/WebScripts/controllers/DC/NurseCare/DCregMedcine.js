angular.module("sltcApp").controller("DCregMedcineCtrl", ['$rootScope', '$scope', 'DrugManageRes', 'utility', '$state', function ($rootScope, $scope, DrugManageRes, utility, $state) {

    $scope.FeeNo = $state.params.FeeNo;
    $scope.Data = {};
    $scope.Data.items = {};
    $scope.currentItem = {};
    $scope.currentResident = {};
    $scope.IsEdit = false;

    //var tabConent = document.getElementById("tabConent");
    //加载数据
    $scope.init = function () {
        $scope.OrgName = $rootScope.Global.Organization;

        $scope.editItem = true;

        //編輯按鈕不可操作
        $scope.buttonEditShow = true;

        //取消編輯按鈕不可操作
        $scope.buttonCancelEditShow = true;

        //保存按鈕不可操作
        $scope.buttonSaveShow = true;
        
        $scope.buttonPrintShow = true;
    };

    //加载个案药品信息
    $scope.Load = function (FeeNo) {
        DrugManageRes.get({ feeNo: FeeNo }, function (data) {
            if (data.Data == null) {
                $scope.Data.items = {};
                return;
            }
            $scope.Data.items = data.Data;         
        });

    };

    //選擇住民
    $scope.residentSelected = function (resident) {
        $scope.buttonPrintShow = false;

        //如果是选中的是当前选中的居民则不工作
        if ($scope.currentResident == resident) {
            return;
        }
        resident.Age = (new Date().getFullYear() - new Date(resident.BirthDate).getFullYear());
        $scope.currentResident = resident;

        //帶出人員信息
        $scope.residentNo = resident.ResidentNo;
        $scope.residentName = resident.Name;
        $scope.sex = resident.Sex;
        $scope.birthDate = FormatDate(resident.BirthDate);
        $scope.age = resident.Age;

        $scope.editItem = true;
        $scope.currentItem = {
        };

        //取消編輯按鈕不可操作
        $scope.buttonCancelEditShow = true;


        //編輯按鈕可操作
        $scope.buttonEditShow = false;


        //保存按鈕不可操作
        $scope.buttonSaveShow = true;

        //加載個案藥品信息
        $scope.Load(resident.FeeNo);
    };

    $scope.addItem = function () {
        $scope.currentItem = {};
        $scope.editItem = false;
        $scope.buttonCancelEditShow = false;
        $scope.buttonSaveShow = false;

    }

    //取消编辑
    $scope.cancelEdit = function () {

        $scope.editItem = true;
        $scope.currentItem = {
        };

        //取消编辑按钮不可操作
        $scope.buttonCancelEditShow = true;

        //保存按鈕不可操作
        $scope.buttonSaveShow = true;
    };

    //储存数据
    $scope.save = function (item) {
        if (angular.isDefined($scope.medForm.$error.required)) {
            for (var i = 0; i < $scope.medForm.$error.required.length; i++) {
                utility.msgwarning($scope.medForm.$error.required[i].$name + "為必填項！");
                if (i > 1) {
                    return;
                }
            }
            return;
        }

        if (angular.isDefined($scope.medForm.$error.maxlength)) {
            for (var i = 0; i < $scope.medForm.$error.maxlength.length; i++) {
                utility.msgwarning($scope.medForm.$error.maxlength[i].$name + "超過設定長度！");
                if (i > 1) {
                    return;
                }
            }
            return;
        }
        if ($scope.medForm.$valid) {

            if (angular.isDefined(item.Id)) {
                DrugManageRes.save(item, function (data) {
                    $scope.editItem = true;

                    $scope.currentItem = {
                    };

                    //保存按鈕不可操作
                    $scope.buttonSaveShow = true;

                    //取消編輯按鈕不可操作
                    $scope.buttonCancelEditShow = true;

                    utility.message("儲存成功！");
                });
            } else {
                item.FeeNo = $scope.currentResident.FeeNo;
                item.RegNo = $scope.currentResident.RegNo;
                item.RegName = $scope.currentResident.Name;
                item.ResidentNo = $scope.currentResident.ResidentNo;
                item.Sex = $scope.currentResident.Sex;
                item.BirthDate = $scope.currentResident.BirthDate;
                item.InDate = $scope.currentResident.InDate;
                DrugManageRes.save(item, function (data) {
                    $scope.Data.items.push(data.Data);

                    $scope.editItem = true;

                    $scope.currentItem = {};

                    //保存按鈕不可操作
                    $scope.buttonSaveShow = true;

                    //取消編輯按鈕不可操作
                    $scope.buttonCancelEditShow = true;

                    utility.message("儲存成功！");
                });

            }
        }

    };

    //編輯
    $scope.rowSelect = function (item) {
        $scope.currentItem = item;
        $scope.editItem = false;
        $scope.buttonCancelEditShow = false;
        $scope.buttonSaveShow = false;
    };

    //刪除
    $scope.deleteItem = function (item) {
        if (confirm("您確定要刪除該住民的藥品記錄嗎?")) {
          
            DrugManageRes.delete({ id: item.Id }, function () {
                $scope.Data.items.splice($scope.Data.items.indexOf(item), 1);
            });
        }
    };


    $scope.PrintPreview = function () {
        if (angular.isDefined($scope.currentResident.FeeNo)) {
            if ($scope.Data.items == null || $scope.Data.items.length == 0) {
                utility.message("無打印數據");
                return;
            }
            window.open('/DC_Report/PreviewNursingReport?templateName=DCN1.1個案藥品管理&feeNo=' + $scope.currentResident.FeeNo);
        } else {
            utility.message("無打印數據");
        }
    }

    $scope.checkStartDate = function () {
        if (!checkDate($scope.currentItem.StartDate, $scope.currentItem.EndDate)) {
            $scope.currentItem.StartDate = "";
            utility.msgwarning("開始日期不能大於結束日期");
        }
    }
    $scope.checkEndDate = function () {
        if (!checkDate($scope.currentItem.StartDate, $scope.currentItem.EndDate)) {
            $scope.currentItem.EndDate = "";
            utility.msgwarning("結束日期不能小於開始日期");
        }
    }
   
    ////編輯
    //$scope.edit = function () {
    //    //標示為可以編輯
    //    $scope.IsEdit = true;

    //    //取消編輯按鈕不可操作
    //    $scope.buttonCancelEditShow = false;

    //    //保存按鈕可操作
    //    $scope.buttonSaveShow = false;

    //    //可以增減行數
    //    $scope.fActionShow = true;

    //    //可以編輯
    //    EditTables(tabConent);
    //};
    ////新增一行
    //$scope.add = function () {
    //    var lastRow = tabConent.rows[tabConent.rows.length - 1];
    //    var newRow = lastRow.cloneNode(true);
    //    newRow.cells[0].innerText = "#" + tabConent.rows.length;
    //    newRow.cells[1].innerText = "";
    //    newRow.cells[2].innerText = "";
    //    newRow.cells[3].innerText = "";
    //    newRow.cells[4].innerText = "";
    //    newRow.cells[5].innerText = "";
    //    newRow.cells[6].innerText = "";
    //    newRow.cells[7].innerText = "";
    //    newRow.cells[8].innerText = "";
    //    newRow.cells[9].innerText = "";
    //    newRow.cells[10].innerText = "";
    //    newRow.cells[11].innerText = "";
    //    tabConent.tBodies[0].appendChild(newRow);
    //    SetRowCanEdit(newRow);
    //    return newRow;
    //};

    ////删除一行
    //$scope.delete = function () {
    //    if (tabConent.rows.length > 2) {
    //        tabConent.deleteRow(tabConent.rows.length - 1);
    //    }
    //};

    ////设置多个表格可编辑
    //function EditTables() {
    //    for (var i = 0; i < arguments.length; i++) {
    //        SetTableCanEdit(arguments[i]);
    //    }
    //};

    ////设置表格是可编辑的
    //function SetTableCanEdit(table) {
    //    for (var i = 1; i < table.rows.length; i++) {
    //        SetRowCanEdit(table.rows[i]);
    //    }
    //};

    //function SetRowCanEdit(row) {
    //    for (var j = 0; j < row.cells.length; j++) {

    //        //如果当前单元格指定了编辑类型，则表示允许编辑
    //        var editType = row.cells[j].getAttribute("EditType");
    //        if (!editType) {
    //            //如果当前单元格没有指定，则查看当前列是否指定
    //            editType = row.parentNode.rows[0].cells[j].getAttribute("EditType");
    //        }
    //        if (editType) {
    //            row.cells[j].onclick = function () {
    //                this.parentNode.readonly = "readonly"
    //                EditCell(this);
    //            }
    //        }
    //    }

    //};

    ////设置指定单元格可编辑
    //function EditCell(element, editType) {
    //    if ($scope.IsEdit == false) {
    //        return;
    //    }
    //    var editType = element.getAttribute("EditType");
    //    if (!editType) {
    //        //如果当前单元格没有指定，则查看当前列是否指定
    //        editType = element.parentNode.parentNode.rows[0].cells[element.cellIndex].getAttribute("EditType");
    //    }

    //    switch (editType) {
    //        case "TextBox":
    //            CreateTextBox(element, element.innerHTML);
    //            break;
    //        case "Date":
    //            CreateDateText(element, element.innerHTML);
    //            break;
    //        case "DropDownList":
    //            CreateDropDownList(element);
    //            break;
    //        default:
    //            break;
    //    }
    //};

    ////为单元格创建可编辑输入框
    //function CreateTextBox(element, value) {
    //    //检查编辑状态，如果已经是编辑状态，跳过
    //    var editState = element.getAttribute("EditState");
    //    if (editState != "true") {
    //        //创建文本框
    //        var textBox = document.createElement("INPUT");
    //        textBox.type = "text";
    //        textBox.className = "form-control";

    //        //设置文本框当前值
    //        if (!value) {
    //            value = element.getAttribute("Value");
    //        }
    //        textBox.value = value;

    //        //设置文本框的失去焦点事件
    //        textBox.onblur = function () {
    //            CancelEditCell(this.parentNode, this.value);
    //        }
    //        //向当前单元格添加文本框
    //        ClearChild(element);
    //        element.appendChild(textBox);
    //        textBox.focus();
    //        textBox.select();

    //        //改变状态变量
    //        element.setAttribute("EditState", "true");
    //        element.parentNode.parentNode.setAttribute("CurrentRow", element.parentNode.rowIndex);
    //    }

    //};

    //function CreateDateText(element, value) {
    //    //检查编辑状态，如果已经是编辑状态，跳过
    //    var editState = element.getAttribute("EditState");
    //    if (editState != "true") {
    //        //创建文本框
    //        var textBox = document.createElement("INPUT");
    //        textBox.id = "dateID";
    //        textBox.type = "text";
    //        textBox.className = "form-control date";

    //        //设置文本框当前值
    //        if (!value) {
    //            value = element.getAttribute("Value");
    //        }
    //        textBox.value = value;
    //        var onClickWp = false;
    //        //设置文本框的失去焦点事件
    //        textBox.onblur = function () {
    //            //CancelEditCell(this.parentNode, this.value);
    //        }
    //        textBox.onfocus = function () {
    //            WdatePicker(
    //                {
    //                    skin: 'default',
    //                    minDate: '1990-01-01',
    //                    maxDate: '2200-12-29',
    //                    onpicked: function (dp) {
    //                        CancelEditCell(this.parentNode, textBox.value);
    //                    },
    //                    oncleared: function (dp) {
    //                        CancelEditCell(this.parentNode, textBox.value);
    //                    }
    //                })
    //        }
    //        //向当前单元格添加文本框
    //        ClearChild(element);
    //        element.appendChild(textBox);
    //        textBox.focus();
    //        textBox.select();

    //        //改变状态变量
    //        element.setAttribute("EditState", "true");
    //        element.parentNode.parentNode.setAttribute("CurrentRow", element.parentNode.rowIndex);
    //    }

    //};

    ////为单元格创建选择框
    //function CreateDropDownList(element, value) {
    //    //检查编辑状态，如果已经是编辑状态，跳过
    //    var editState = element.getAttribute("EditState");
    //    if (editState != "true") {
    //        //创建下接框
    //        var downList = document.createElement("Select");
    //        downList.className = "EditCell_DropDownList";

    //        //添加列表项
    //        var items = element.getAttribute("DataItems");
    //        if (!items) {
    //            items = element.parentNode.parentNode.rows[0].cells[element.cellIndex].getAttribute("DataItems");
    //        }

    //        if (items) {
    //            items = eval("[" + items + "]");
    //            for (var i = 0; i < items.length; i++) {
    //                var oOption = document.createElement("OPTION");
    //                oOption.text = items[i].text;
    //                oOption.value = items[i].value;
    //                downList.options.add(oOption);
    //            }
    //        }

    //        //设置列表当前值
    //        if (!value) {
    //            value = element.getAttribute("Value");
    //        }
    //        downList.value = value;

    //        //设置创建下接框的失去焦点事件
    //        downList.onblur = function () {
    //            CancelEditCell(this.parentNode, this.value, this.options[this.selectedIndex].text);
    //        }

    //        //向当前单元格添加创建下接框
    //        ClearChild(element);
    //        element.appendChild(downList);
    //        downList.focus();

    //        //记录状态的改变
    //        element.setAttribute("EditState", "true");
    //        element.parentNode.parentNode.setAttribute("LastEditRow", element.parentNode.rowIndex);
    //    }

    //};

    ////取消单元格编辑状态
    //function CancelEditCell(element, value, text) {
    //    element.setAttribute("Value", value);
    //    if (text) {
    //        element.innerHTML = text;
    //    } else {
    //        element.innerHTML = value;
    //    }
    //    element.setAttribute("EditState", "false");

    //    //检查是否有公式计算
    //    CheckExpression(element.parentNode);
    //};

    ////清空指定对象的所有字节点
    //function ClearChild(element) {
    //    element.innerHTML = "";
    //};

    ////带勾选框的批量删除
    //function DeleteRow(table, index) {
    //    for (var i = table.rows.length - 1; i > 0; i--) {
    //        var chkOrder = table.rows[i].cells[0].firstChild;
    //        if (chkOrder) {
    //            if (chkOrder.type = "CHECKBOX") {
    //                if (chkOrder.checked) {
    //                    //执行删除
    //                    table.deleteRow(i);
    //                }
    //            }
    //        }
    //    }
    //};

    ////提取表格的值,JSON格式
    //function GetTableData(table) {
    //    var tableData = new Array();
    //    alert("行数：" + table.rows.length);
    //    for (var i = 1; i < table.rows.length; i++) {
    //        tableData.push(GetRowData(tabConent.rows[i]));
    //    }

    //    return tableData;

    //};

    ////提取指定行的数据，JSON格式
    //function GetRowData(row) {
    //    var rowData = {};
    //    for (var j = 0; j < row.cells.length; j++) {
    //        name = row.parentNode.rows[0].cells[j].getAttribute("Name");
    //        if (name) {
    //            var value = row.cells[j].getAttribute("Value");
    //            if (!value) {
    //                value = row.cells[j].innerHTML;
    //            }

    //            rowData[name] = value;
    //        }
    //    }
    //    //alert("ProductName:" + rowData.ProductName);
    //    //或者这样：alert("ProductName:" + rowData["ProductName"]);
    //    return rowData;

    //};

    ////检查当前数据行中需要运行的字段
    //function CheckExpression(row) {
    //    for (var j = 0; j < row.cells.length; j++) {
    //        expn = row.parentNode.rows[0].cells[j].getAttribute("Expression");
    //        //如指定了公式则要求计算
    //        if (expn) {
    //            var result = Expression(row, expn);
    //            var format = row.parentNode.rows[0].cells[j].getAttribute("Format");
    //            if (format) {
    //                //如指定了格式，进行字值格式化
    //                row.cells[j].innerHTML = formatNumber(Expression(row, expn), format);
    //            } else {
    //                row.cells[j].innerHTML = Expression(row, expn);
    //            }
    //        }

    //    }
    //};

    ////计算需要运算的字段
    //function Expression(row, expn) {
    //    var rowData = GetRowData(row);
    //    //循环代值计算
    //    for (var j = 0; j < row.cells.length; j++) {
    //        name = row.parentNode.rows[0].cells[j].getAttribute("Name");
    //        if (name) {
    //            var reg = new RegExp(name, "i");
    //            expn = expn.replace(reg, rowData[name].replace(/\,/g, ""));
    //        }
    //    }
    //    return eval(expn);
    //};

    //function formatNumber(num, pattern) {
    //    var strarr = num ? num.toString().split('.') : ['0'];
    //    var fmtarr = pattern ? pattern.split('.') : [''];
    //    var retstr = '';

    //    // 整数部分  
    //    var str = strarr[0];
    //    var fmt = fmtarr[0];
    //    var i = str.length - 1;
    //    var comma = false;
    //    for (var f = fmt.length - 1; f >= 0; f--) {
    //        switch (fmt.substr(f, 1)) {
    //            case '#':
    //                if (i >= 0) retstr = str.substr(i--, 1) + retstr;
    //                break;
    //            case '0':
    //                if (i >= 0) retstr = str.substr(i--, 1) + retstr;
    //                else retstr = '0' + retstr;
    //                break;
    //            case ',':
    //                comma = true;
    //                retstr = ',' + retstr;
    //                break;
    //        }
    //    }
    //    if (i >= 0) {
    //        if (comma) {
    //            var l = str.length;
    //            for (; i >= 0; i--) {
    //                retstr = str.substr(i, 1) + retstr;
    //                if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
    //            }
    //        }
    //        else retstr = str.substr(0, i + 1) + retstr;
    //    }

    //    retstr = retstr + '.';
    //    // 处理小数部分  
    //    str = strarr.length > 1 ? strarr[1] : '';
    //    fmt = fmtarr.length > 1 ? fmtarr[1] : '';
    //    i = 0;
    //    for (var f = 0; f < fmt.length; f++) {
    //        switch (fmt.substr(f, 1)) {
    //            case '#':
    //                if (i < str.length) retstr += str.substr(i++, 1);
    //                break;
    //            case '0':
    //                if (i < str.length) retstr += str.substr(i++, 1);
    //                else retstr += '0';
    //                break;
    //        }
    //    }
    //    return retstr.replace(/^,+/, '').replace(/\.$/, '');
    //};

    //日期格式转换
    function FormatDate(strTime) {
        if (strTime == null || strTime == "") {
            return "";
        }
        var date = new Date(strTime);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }

    $scope.init();

}])

