///修改人:肖国栋
///修改日期:2016-03-01
///说明:修改成匿名函数方式
laydate.skin("danlan");
(function () {
    var app = angular.module("extentDirective", []);

    app.directive("caReload", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    var el = element.parents(".box");
                    jQuery(el).block({
                        message: '<img src="../Content/CloudAdmin/img/loaders/12.gif" align="absmiddle">',
                        css: {
                            border: 'none',
                            padding: '2px',
                            backgroundColor: 'none'
                        },
                        overlayCSS: {
                            backgroundColor: '#000',
                            opacity: 0.05,
                            cursor: 'wait'
                        }
                    });
                    window.setTimeout(function () {
                        jQuery(el).unblock({
                            onUnblock: function () {
                                jQuery(el).removeAttr("style");
                            }
                        });
                    }, 1000);
                });
            }
        };
    }).directive("caRemove", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    var removable = jQuery(this).parents(".box");
                    if (removable.next().hasClass('box') || removable.prev().hasClass('box')) {
                        jQuery(this).parents(".box").remove();
                    } else {
                        jQuery(this).parents(".box").parent().remove();
                    }
                });
            }
        };
    }).directive("caCollapse", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    var el = jQuery(this).parents(".box").children(".box-body");
                    if (jQuery(this).hasClass("collapse")) {
                        jQuery(this).removeClass("collapse").addClass("expand");
                        var i = jQuery(this).children(".fa-chevron-up");
                        i.removeClass("fa-chevron-up").addClass("fa-chevron-down");
                        el.slideUp(200);
                    } else {
                        jQuery(this).removeClass("expand").addClass("collapse");
                        var i = jQuery(this).children(".fa-chevron-down");
                        i.removeClass("fa-chevron-down").addClass("fa-chevron-up");
                        el.slideDown(200);
                    }
                });
            }
        };
    }).directive("caBtnModal", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function () {
                    var el = jQuery(this).attr("href");
                    if (el.indexOf("#") < 0) {
                        el = jQuery(this).attr("data-target");
                    }
                    $(el).modal();
                });
            }
        };
    }).directive('caDateTimePicker', function () {
        return {
            restrict: 'A',
            require: ['ngModel'],
            scope: {
                ngModel: '='
            },
            link: function (scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                var option = {
                    format: 'YYYY-MM-DD hh:mm:ss', //日期格式
                    istoday: true, //是否显示今天
                    istime: true,
                    issure: true, //是否显示确认
                    zIndex: 99999999, //css z-index
                    choose: function (dates) { //选择好日期的回调
                        element.val(dates);
                        ngModel.$setViewValue(dates);
                    }
                };
                var min = Number(attrs["min"]);
                if (angular.isNumber(min) && typeof (attrs["min"]) != "undefined") {
                    option.min = laydate.now(min);
                }
                var max = Number(attrs["max"]);
                if (angular.isNumber(max) && typeof (attrs["max"]) != "undefined")
                {
                    option.max = laydate.now(max);
                }
                element.bind('click', function () {
                    laydate(option);
                });
                //element.attr("readonly", "readonly");
                //element.datetimepicker({
                //    dateFormat: "yy-mm-dd",
                //    changeMonth: true,
                //    changeYear: true,
                //    timeFormat: "HH:mm:ss",
                //    dateFormat: "yy-mm-dd",
                //    dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                //    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六", "七"],
                //    daysMin: ["日", "一", "二", "三", "四", "五", "六", "七"],
                //    monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                //    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                //    prevText: '向前',
                //    nextText: '向后',
                //    closeText: "清空",
                //    currentText: "現在",
                //    timeText: "時間",
                //    hourText: "時",
                //    minuteText: "分",
                //    secondText: "秒"
                //});
                //if (!$("#ui-datepicker-div").data("click")) {
                //    $("#ui-datepicker-div").data("click", true);
                //    $("#ui-datepicker-div").on("click", function (e) {
                //        var $this = $(e.target);
                //        if ($this.hasClass("ui-datepicker-close")) {
                //            var $input = $($.datepicker._curInst.input[0]);
                //            $input.val('');
                //            $input.trigger('change');
                //        }
                //    });
                //}
                scope.$watch('ngModel', function (newValue, oldValue, scope) {
                    if (angular.isDefined(newValue) && newValue != "" && newValue != null && isDate(newValue)) {
                        element.val(newDate(newValue).format("yyyy-MM-dd hh:mm:ss"));
                    }
                });
            }
        };
    }).directive('caDatePicker', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            require: ['ngModel'],
            scope: {
                ngModel: '='
            },
            link: function (scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                var option = {
                    format: 'YYYY-MM-DD', //日期格式
                    istoday: true, //是否显示今天
                    issure: false, //是否显示确认
                    zIndex: 99999999, //css z-index
                    choose: function (dates) { //选择好日期的回调
                        element.val(dates);
                        ngModel.$setViewValue(dates);
                    }
                };
                var min = Number(attrs["min"]);
                if (angular.isNumber(min) && typeof(attrs["min"]) != "undefined") {
                    option.min = laydate.now(min);
                }
                var max = Number(attrs["max"]);
                if (angular.isNumber(max) && typeof (attrs["max"]) != "undefined") {
                    option.max = laydate.now(max);
                }
                element.bind('click', function(){
                    laydate(option);
                });
                element.bind('change', function () {
                    var v = element.val();
                    var p  = /\d{8}/g;
                    var r = new RegExp(p);
                    if(r.test(v))
                    {
                        var dates = v.toDateFormat();
                        element.val(dates);
                        ngModel.$setViewValue(dates);
                    }
                });
                //element.attr("readonly", "readonly");
                //element.datepicker({
                //    showButtonPanel: true,
                //    closeText: "清空",
                //    currentText: "今天",
                //    dateFormat: "yy-mm-dd",
                //    dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                //    dayNamesMin: ["日", "一", "二", "三", "四", "五", "六", "七"],
                //    daysMin: ["日", "一", "二", "三", "四", "五", "六", "七"],
                //    monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                //    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                //    prevText: '向前',
                //    nextText: '向后',
                //    changeMonth: true,
                //    changeYear: true
                //});
                //if (!$("#ui-datepicker-div").data("click")) {
                //    $("#ui-datepicker-div").data("click", true);
                //    $("#ui-datepicker-div").on("click", function (e) {
                //        var $this = $(e.target);
                //        if ($this.hasClass("ui-datepicker-close"))
                //        {
                //            var $input = $($.datepicker._curInst.input[0]);
                //            $input.val('');
                //            $input.trigger('change');
                //        }
                //    });
                //}
                scope.$watch('ngModel', function (newValue, oldValue, scope) {
                    if (angular.isDefined(newValue) && newValue != "" && newValue != null && isDate(newValue))
                    {
                        element.val(newDate(newValue).format("yyyy-MM-dd"));
                    }
                });
            }
        };
    }]).directive('onFinishRepeatRender', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        scope.$emit('repeatFinished');
                    }
                }
            };
    }]).directive('caSelect', ['$timeout', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {

                    function initAjaxSelect2() {
                        var url = element.attr("ajax-url");
                        element.select2({
                            ajax: {
                                url: url,
                                dataType: 'json',
                                delay: 1000,
                                data: function (params) {
                                    return {
                                        code: params
                                    };
                                },
                                results: function (data, params) {
                                    var results = [];
                                    $.each(data, function (index, item) {
                                        results.push({
                                            id: item.id,
                                            text: item.Code
                                        });
                                    });
                                    return {
                                        results: results
                                    };
                                },
                                cache: true
                            }
                        });
                    }

                    function initSelect2() {
                        var elm = element.select2();
                        elm.on('select2:select', function (v) {
                            var model = this.attr("ngModel");
                            if (model) {
                                scope.$parent[model] = value;
                            }
                        });
                    }

                    if (element[0].nodeName == "SELECT") {
                        scope.$on("repeatFinished", function () {
                            initSelect2();
                        });
                    } else {
                        initAjaxSelect2();
                    }
                }
            };
        }])
        .directive('uiDataTable', ['$http', '$parse', function ($http, $parse) {
            return {
                restrict: 'EA',
                transclude: true,
                /*
                template: function (tElement, tAttrs) {
                    return "<div><div class='panel clearfix'><div class='col-md-4'><div class='col-md-12'><label>顯示<select size='1' ng-model='options.pageInfo.PageSize' ng-options='t.Value as t.Text for t in options.selectRows.opt' aria-controls='datatable2' class='input-sm'>"
                        + "</select>行</label></div></div><div class='col-md-8' id='btnsArea' ng-click='options.buttonsClick($event)'></div></div><div ng-transclude>"
                        + "</div><div class='row'><div class='col-sm-12'> <div class='pull-left'><div class='dataTables_info' id='datatable1_info'>显示第 {{options.pageIndexRender.start}} 到 {{options.pageIndexRender.end}} 條 總共 {{options.pageIndexRender.sum}} 條</div></div>"
                        + "<div class='pull-right'><div class='dataTables_paginate paging_bs_full' id='datatable1_paginate'>"
                        + "<ul class='pagination' >"
                        + "<li ng-repeat='item in options.pageIndexRender.indexAry' class='{{item.cls.pl}}'><a href='#' class='{{item.cls.al}}' ng-click='changePage(item.params)'>{{item.Name}}</a></li>"
                        + "</ul>"
                        + "</div></div><div class='clearfix'></div></div></div><div>";
                },
                */
                scope: {
                    options: '='
                },
                template: function (tElement, tAttrs) {
                    //return "<div><div class='panel clearfix'><div class='col-md-4'><div class='col-md-12'><label>顯示<select size='1' ng-model='options.pageInfo.PageSize' ng-options='t.Value as t.Text for t in options.selectRows.opt' aria-controls='datatable2' class='input-sm' ng-change='changePageSize()' >"
                    //    + "</select>行</label></div></div><div class='col-md-8 btnsArea' ng-click='options.buttonsClick($event)'></div></div><div ng-transclude>"
                    //    + "</div><div class='panel clearfix'><div class='col-sm-12'> <div class='pull-left'><div class='dataTables_info' id='datatable1_info'>顯示第 {{options.pageIndexRender.start}} 到 {{options.pageIndexRender.end}} 條 總共 {{options.pageIndexRender.sum}} 條</div></div>"
                    //    + "<div class='pull-right'><div class='dataTables_paginate paging_bs_full' id='datatable1_paginate'>"
                    //    + "</div></div></div></div><div>";
                    return "<div ng-transclude></div>" +
                        "<div class='panel clearfix'>" +
                        "<div class='col-sm-2'><div class='dataTables_info'><label>显示<select size='1' ng-model='options.pageInfo.PageSize' ng-options='t.Value as t.Text for t in options.selectRows.opt' aria-controls='datatable2' class='input-sm' ng-change='changePageSize()' > </select>行</label></div></div>" +
                        "<div class='col-sm-4'><div class='dataTables_info' id='datatable1_info'>显示第 {{options.pageIndexRender.start}} 到 {{options.pageIndexRender.end}} 条 总共 {{options.pageIndexRender.sum}} 条</div></div>" +
                       "<div class='col-sm-6'><div class='dataTables_paginate paging_bs_full' id='datatable1_paginate'></div></div>" +
                        "</div>";
                },
                link: function ($scope, $elem, attrs) {
                    var opt = $scope.options,
                        pageSize = opt.pageInfo.PageSize;

                    var buttons = opt.buttons,
                        buttonsParent = $elem.find(".btnsArea");


                    function createBtn(btn) {
                        return "<a class='btn btn-default'><span>" + btn.btnType
                            + "</span><div><embed id='movie" + btn.btnType + "'"
                            + btn.btnType + "' src='/Content/CloudAdmin/js/datatables/extras/TableTools/media/swf/copy_csv_xls_pdf.swf' "
                            + "loop='false' menu='false' quality='best' bgcolor='#ffffff' width='39' height='29' name='movie" + btn.btnType + "'"
                            + "align='middle' allowscriptaccess='always' allowfullscreen='false' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' "
                            + "flashvars='id=2&amp;width=39&amp;height=29' wmode='transparent'></div></a>";
                    }

                    for (var i = buttons.length - 1; i > -1; i--) {
                        buttonsParent.append(createBtn(buttons[i]));
                    }

                    // 查詢按鈕事件
                    opt.search = function () {
                        $scope.search();
                    };

                    var render = function () {
                        pageSize = opt.pageInfo.PageSize;
                        var rows = opt.pageInfo.CurrentPage * pageSize,
                        start = (rows - pageSize) + 1,
                        sum = $scope.recordsCount,
                        end = rows > sum ? sum : rows;
                        opt.pageIndexRender.start = start;
                        opt.pageIndexRender.end = end;
                        opt.pageIndexRender.sum = sum;
                    }
  
                    $scope.search = function () {
                        if (opt.ajaxObject == null) {
                            return;
                        }
                        pageSize = opt.pageInfo.PageSize;
                        var params = {};
                        $.extend(params, { currentPage: opt.pageInfo.CurrentPage, pageSize: pageSize }, opt.params);
                        opt.ajaxObject.get(params, function (response) {
                            opt.success(response);
                            $scope.recordsCount = response.RecordsCount;
                            var pager = new Pager($elem.find("#datatable1_paginate"), opt.pageInfo.CurrentPage, response.PagesCount, function (currentPage) {
                                opt.pageInfo.CurrentPage = currentPage;
                                render();
                                $scope.search();
                            });
                            render();
                        });
                    };

                    $scope.changePageSize=function() {
                        opt.pageInfo.CurrentPage = 1;
                        $scope.search();
                    }

                    $scope.search();
                },
                controller: ['$scope','$element', function ($scope, $element) {
                    $scope.options = angular.extend({
                        pageInfo: {
                            CurrentPage: 1, PageSize: 10
                        },
                        ajaxObject: null,
                        success: function () { },
                        selectRows: {
                            opt: [{ Value: 10, Text: "10" }, { Value: 20, Text: "20" }, { Value: 30, Text: "30" }]
                        },
                        buttons: [
                            { btnType: 'copy' },
                            { btnType: 'print' },
                            { btnType: 'pdf' },
                            { btnType: 'excel' }
                        ],
                        //buttonsClick: function (e) {

                        //},
                        renderPage: 0,
                        pageIndexRender: { start: 1, end: 10, indexAry: [] },
                        sumInfo: {}
                    }, $scope.options);
                }]
            }
        }]).directive("onlyNumber", function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.blur(function () {
                        if (!/^(-?\d+)(\.\d+)?$/.test($(this).val())) { //替换非数字字符(只能输入正负整数、正负小数)  
                            $(element).val("");
                        }
                    });
                }
            };
        }).directive("onlyInt", function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.blur(function () {
                        if (!/^-?\d+$/.test($(this).val())) { //替换非数字字符(只能输入正负整数)  
                            $(element).val("");
                        }
                    });
                }
            };
        }).directive("twTimeFormat", function () {
            return {
                restrict: 'A',
                scope: {
                    inValue: '='
                },
                link: function (scope, element, attrs) {
                    element.change(function () {
                        var datetime = element.val().toTwDateFormat();
                        var arr = datetime.split('-');
                        if (arr.length == 3) {
                            var year = (parseInt(arr[0]) + 1911);
                            var month = arr[1].length == 1 ? "0" + arr[1] : arr[1];
                            var day = arr[2].length == 1 ? "0" + arr[2] : arr[2];
                            scope.inValue = year + "-" + month + "-" + day;
                        }
                        else {
                            scope.inValue = "";
                        }
                        scope.$apply();
                    });
                    scope.$watch('inValue', function (newValue, oldValue, scope) {
                        if (typeof (newValue) != "undefined" && newValue != null) {
                            element.val(newValue.toTwDate());
                        }
                    });
                }
            };
        }).directive("activeTr", function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.click(function () {
                        var tr = $(element);//.parent();
                        tr.parent().children("tr").each(function () {
                            $(this).attr("class", "ng-scope");
                        });
                        tr.attr("class", "ng-scope active");
                    });
                }
            };
        });
})();