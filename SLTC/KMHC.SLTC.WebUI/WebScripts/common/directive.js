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
                    option.min = laydate.now(min, 'YYYY-MM-DD hh:mm:ss');
                }
                var max = Number(attrs["max"]);
                if (angular.isNumber(max) && typeof (attrs["max"]) != "undefined") {
                    option.max = laydate.now(max, 'YYYY-MM-DD hh:mm:ss');
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
    }).directive('caDatePicker', [
            '$timeout', function ($timeout) {
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
                        if (angular.isNumber(min) && typeof (attrs["min"]) != "undefined") {
                            option.min = laydate.now(min);
                        }
                        var max = Number(attrs["max"]);
                        if (angular.isNumber(max) && typeof (attrs["max"]) != "undefined") {
                            option.max = laydate.now(max);
                        }
                        element.bind('click', function () {
                            laydate(option);
                        });
                        element.bind('change', function () {
                            var v = element.val();
                            var p = /\d{8}/g;
                            var r = new RegExp(p);
                            if (r.test(v)) {
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
                            if (angular.isDefined(newValue) && newValue != "" && newValue != null && isDate(newValue)) {
                                element.val(newDate(newValue).format("yyyy-MM-dd"));
                            }
                        });
                    }
                };
            }
    ]).directive('onFinishRepeatRender', [
            '$timeout', function ($timeout) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attr) {
                        if (scope.$last === true) {
                            scope.$emit('repeatFinished');
                        }
                    }
                };
            }
    ]).directive('caSelect', [
            '$timeout', function ($timeout) {
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
            }
    ]) .directive("caFullscreen", function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.click(function () {
                        if(jQuery(this).parents(".box").hasClass("full-screen")){
                            jQuery(this).parents(".box").removeClass("full-screen");
                            jQuery(this).children('i').removeClass("escfull-screen-img");
                            jQuery(this).children('i').addClass("full-screen-img");
                        } else {
                            jQuery(this).parents(".box").addClass("full-screen");
                            jQuery(this).children('i').removeClass("full-screen-img");
                            jQuery(this).children('i').addClass("escfull-screen-img");
                        }
                    });
                }
            };
        })
        .directive('uiDataTable', ['$http', '$parse', '$compile', function ($http, $parse, $compile) {
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
                        "<div id='pageFooter' class='panel clearfix'>" +
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

                    if (opt.customPageFooter && typeof (opt.customPageFooter) == "function") {
                        //通过$compile动态编译html
                        angular.element($elem.find("#pageFooter>div")).remove();//先清空原有Dom元素
                        var html = opt.customPageFooter();
                        var template = angular.element(html);
                        var dElement = $compile(template)($scope);
                        angular.element($elem.find("#pageFooter")).append(dElement);//添加自定义html
                    }

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
                        //debugger;
                        if (opt.ajaxObject == null) {
                            return;
                        }
                        pageSize = opt.pageInfo.PageSize;
                        var params = {};
                        $.extend(params, { currentPage: opt.pageInfo.CurrentPage, pageSize: pageSize }, opt.params);

                        opt.ajaxObject.get(params, function (response) {
                            opt.success(response);
                            pageSize = opt.pageInfo.PageSize;
                            var maxPage = parseInt(response.RecordsCount / opt.pageInfo.PageSize) + 1;
                            var mod = response.RecordsCount % opt.pageInfo.PageSize;
                            if (opt.pageInfo.CurrentPage > maxPage) {
                                if (mod === 0) {
                                    opt.pageInfo.CurrentPage = maxPage - 1;
                                }
                                else {
                                    opt.pageInfo.CurrentPage = maxPage;
                                }
                                $scope.search();
                                return;
                            }
                            //BobDu修改于2017-05-10，当返回数据为空时隐藏分页控件
                            if (response.RecordsCount <= opt.pageInfo.PageSize) {
                                $elem.find("#pageFooter").hide();
                            } else {
                                $elem.find("#pageFooter").show();
                            }
                            $scope.recordsCount = response.RecordsCount;
                            var pager = new Pager($elem.find("#datatable1_paginate"), opt.pageInfo.CurrentPage, response.PagesCount, function (currentPage) {
                                opt.pageInfo.CurrentPage = currentPage;
                                render();
                                $scope.search();
                            });
                            render();
                        });
                    };

                    $scope.changePageSize = function () {
                        opt.pageInfo.CurrentPage = 1;
                        $scope.search();
                    }

                    $scope.search();
                },
                controller: ['$scope', '$element', function ($scope, $element) {
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
        }]).directive('uiMapTable', ['$http', '$parse', '$compile', function ($http, $parse, $compile) {
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
                    return "<div ng-transclude></div>" +
                        "<div class='panel clearfix'>" +
                        "<div class='col-sm-12'><div class='dataTables_paginate paging_bs_full' id='datatable1_paginate'></div></div>" +
                        "</div>";
                },
                link: function ($scope, $elem, attrs) {

                    var opt = $scope.options,
                        pageSize = opt.pageInfo.PageSize;

                    var buttons = opt.buttons,
                        buttonsParent = $elem.find(".btnsArea");

                    if (opt.customPageFooter && typeof (opt.customPageFooter) == "function") {
                        //通过$compile动态编译html
                        angular.element($elem.find("#pageFooter>div")).remove();//先清空原有Dom元素
                        var html = opt.customPageFooter();
                        var template = angular.element(html);
                        var dElement = $compile(template)($scope);
                        angular.element($elem.find("#pageFooter")).append(dElement);//添加自定义html
                    }

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

                    opt.enterEvent = function(e) {
                        $scope.enterEvent(e);
                    };

                    var render = function() {
                        pageSize = opt.pageInfo.PageSize;
                        var rows = opt.pageInfo.CurrentPage * pageSize,
                            start = (rows - pageSize) + 1,
                            sum = $scope.recordsCount,
                            end = rows > sum ? sum : rows;
                        opt.pageIndexRender.start = start;
                        opt.pageIndexRender.end = end;
                        opt.pageIndexRender.sum = sum;
                    };

                    $scope.enterEvent = function(e) {
                        var keycode = window.event ? e.keyCode : e.which;
                        if (keycode == 13) {
                            $scope.search();
                        }
                    };

                    $scope.search = function () {
                        //debugger;
                        if (opt.ajaxObject == null) {
                            return;
                        }
                        pageSize = opt.pageInfo.PageSize;
                        var params = {};
                        $.extend(params, { currentPage: opt.pageInfo.CurrentPage, pageSize: pageSize }, opt.params);

                        opt.ajaxObject.get(params, function (response) {
                            opt.success(response);
                            pageSize = opt.pageInfo.PageSize;
                            var maxPage = parseInt(response.RecordsCount / opt.pageInfo.PageSize) + 1;
                            var mod = response.RecordsCount % opt.pageInfo.PageSize;
                            if (opt.pageInfo.CurrentPage > maxPage) {
                                if (mod === 0) {
                                    opt.pageInfo.CurrentPage = maxPage - 1;
                                }
                                else {
                                    opt.pageInfo.CurrentPage = maxPage;
                                }
                                $scope.search();
                                return;
                            }
                            //if (response.RecordsCount <= opt.pageInfo.PageSize) {
                            //    $elem.find("#pageFooter").hide();
                            //} else {
                            //    $elem.find("#pageFooter").show();
                            //}
                            $scope.recordsCount = response.RecordsCount;
                            var pager = new Pager($elem.find("#datatable1_paginate"), opt.pageInfo.CurrentPage, response.PagesCount, function (currentPage) {
                                opt.pageInfo.CurrentPage = currentPage;
                                render();
                                $scope.search();
                            });
                            render();
                        });
                    };

                    $scope.changePageSize = function () {
                        opt.pageInfo.CurrentPage = 1;
                        $scope.search();
                    }

                    $scope.search();
                },
                controller: ['$scope', '$element', function ($scope, $element) {
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
        }).directive("fex", ["w5cValidator", function () {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ctrl) {
                    var flag = element.attr("name");
                    var rule = {};
                    rule[flag] = {};
                    rule[flag]["fex"] = "输入传真号码格式不正确";
                    rule[flag]["required"] = "输入的传真号码不能为空";
                    w5cValidator.setRules(rule);
                    scope.$watch(attrs.ngModel, function (newValue, oldValue, scope) {
                        if (newValue != null && typeof (newValue) != "undefined") {
                            var b = /(^$)|(^0\d{2,3}-\d{7,8}$)/.test(newValue);
                            ctrl.$setValidity("fex", b);
                        } else {
                            ctrl.$setValidity("fex", true);
                        }
                    });
                }
            };
        }]).directive("phone", ["w5cValidator", function (w5cValidator) {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ctrl) {
                    var flag = element.attr("name");
                    var rule = {};
                    rule[flag] = {};
                    rule[flag]["phone"] = "输入电话格式不正确(例如010-83165220,15815599696)";
                    rule[flag]["required"] = "输入的电话不能为空";
                    w5cValidator.setRules(rule);
                    scope.$watch(attrs.ngModel, function (newValue, oldValue, scope) {
                        if (newValue != null && typeof (newValue) != "undefined") {
                            var b = /^((\s*)|(0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/.test(newValue);
                            ctrl.$setValidity("phone", b);
                        } else {
                            ctrl.$setValidity("phone", true);
                        }
                    });
                }
            };
        }]).directive("idcard", ["w5cValidator", function (w5cValidator) {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ctrl) {
                    var flag = element.attr("name");
                    var rule = {};
                    rule[flag] = {};
                    rule[flag]["idcard"] = "输入身份证格式不正确";
                    rule[flag]["required"] = "输入的身份证不能为空";
                    w5cValidator.setRules(rule);
                    scope.$watch(attrs.ngModel, function (newValue, oldValue, scope) {
                        if (newValue != null && typeof (newValue) != "undefined") {
                            var b = /^(^$)|(^[a-zA-Z][0-9]{9}$)|(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(newValue);
                            ctrl.$setValidity("idcard", b);
                        } else {
                            ctrl.$setValidity("idcard", true);
                        }
                    });
                }
            };
        }]).directive("email", ["w5cValidator", function (w5cValidator) {
            return {
                require: 'ngModel',
                restrict: 'A',
                link: function (scope, element, attrs, ctrl) {
                    var flag = element.attr("name");
                    var rule = {};
                    rule[flag] = {};
                    rule[flag]["email"] = "输入邮箱地址格式不正确";
                    rule[flag]["required"] = "输入的邮箱地址不能为空";
                    w5cValidator.setRules(rule);
                    scope.$watch(attrs.ngModel, function (newValue, oldValue, scope) {
                        if (newValue != null && typeof (newValue) != "undefined") {
                            var b = /^((\w)+(\.\w+)*@(\w)+((\.\w+)+))$/.test(newValue);
                            ctrl.$setValidity("email", b);
                        } else {
                            ctrl.$setValidity("email", true);
                        }
                    });
                }
            };
        }]).directive("twTimeFormat", function () {
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
                        } else {
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
                        var tr = $(element); //.parent();
                        tr.parent().children("tr").each(function () {
                            $(this).attr("class", "ng-scope");
                        });
                        tr.attr("class", "ng-scope active");
                    });
                }
            };
        })
        //确认密码
        .directive('pwCheck', [
            function () {
                return {
                    require: 'ngModel',
                    link: function (scope, elem, attrs, ctrl) {
                        var firstPassword = '#' + attrs.pwCheck;
                        elem.add(firstPassword).on('keyup', function () {
                            if (elem.val() != '' && $(firstPassword).val() != '') {
                                scope.$apply(function () {
                                    var v = elem.val() === $(firstPassword).val();
                                    ctrl.$setValidity('repeatpassword', v);
                                });
                            }
                        });
                    }
                }
            }
        ])
    .directive('tabs', function () {
        return {
            restrict: 'AE',
            transclude: true,
            scope: { gotopane: "@gotopane", fixedpane: "@fixedpane" },
            controller: ["$scope", function ($scope) {
                var panes = $scope.panes = [];
                $scope.select = function (pane) {
                    if (angular.isDefined($scope.fixedpane) && $scope.fixedpane == "true")
                    { } else {
                        angular.forEach(panes, function (pane) {
                            pane.selected = false;
                        });
                        pane.selected = true;
                    }
                }
                $scope.goto = function (num) {
                    angular.forEach(panes, function (pane) {
                        pane.selected = false;
                    });
                    if (panes.length > num) {
                        panes[num].selected = true;
                    }
                }

                this.addPane = function (pane) {
                    if (panes.length == 0) $scope.select(pane);
                    panes.push(pane);
                }
                $scope.$watch("fixedpane", function () {
                    $scope.fixed = $scope.fixedpane == "true";
                }
             );
                $scope.$watch("gotopane", function (num) {
                    if (angular.isDefined(num)) {
                        if (num < 0) { num = 0 };
                        $scope.goto(num);
                    }
                }
                );
            }],
            template:
              '<div class="tabbable" >' +
                '<ul class="nav nav-tabs">' +
                  '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' +
                    '<a href="" ng-class="{tab_disable:fixed}" ng-click="select(pane)">{{pane.title}}</a>' +
                  '</li>' +
                '</ul>' +
                '<div class="tab-content" ng-transclude></div>' +
              '</div>',
            replace: true
        };
    }).directive('pane', function () {
        return {
            require: '^tabs',
            restrict: 'E',
            transclude: true,
            scope: { title: '@' },
            link: function (scope, element, attrs, tabsCtrl) {
                tabsCtrl.addPane(scope);
            },
            template:
              '<div class="tab-pane" ng-class="{active: selected }" ng-transclude>' +
              '</div>',
            replace: true
        };
    }).directive('unique', ['$http', '$timeout', function ($http, $timeout) {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function (scope, elem, attr, ctrl) {
                var key = attr["uniqueKey"];
                var type = attr["uniqueType"];
                var param = attr["uniqueParam"];
                var cacheQuery = [];
                var completeTimeout;
                var vaild = function () {
                    var value = scope.$eval(attr.ngModel);
                    if (angular.isDefined(value) && value != "" && value != null) {
                        var cacheValue = null;
                        $.each(cacheQuery, function (i, v) {
                            if (v.checkValue == value) {
                                cacheValue = v.vaild;
                                return false;
                            }
                        });
                        if (cacheValue != null) {
                            ctrl.$setValidity(type, cacheValue);
                            scope.$apply();
                        } else {
                            $timeout.cancel(completeTimeout);

                            // Attempt to aggregate any start/complete calls within 500ms:
                            completeTimeout = $timeout(function () {
                                var keyValue = scope.$eval(key);
                                var url = '/api/common/{0}/{1}/{2}'.format(type, keyValue, value);
                                if (typeof (param) != 'undefined') {
                                    var ps = param.split(',');
                                    $.each(ps, function (i, name) {
                                        var value = scope.$eval(name);
                                        var c = "&";
                                        if (i == 0) {
                                            c = "?";
                                        }
                                        url += '{0}p{1}={2}'.format(c, i + 1, value)
                                    });
                                }
                                ctrl.$setValidity(attr.ngModel + "wait", false);
                                $.ajax({
                                    type: "POST",
                                    url: url,
                                    dataType: "json",
                                    async: false,
                                    success: function (data) {
                                        ctrl.$setValidity(type, !data);
                                        cacheQuery.push({ checkValue: value, vaild: !data });
                                    },
                                    complete: function (XMLHttpRequest, textStatus) {
                                        ctrl.$setValidity(attr.ngModel + "wait", true);
                                        scope.$apply();
                                    }
                                });
                            }, 500);
                        }
                    }
                    else {
                        ctrl.$setValidity(attr.ngModel + "wait", true);
                    }
                };
                elem.keyup(function () { vaild(); });
                elem.blur(function () { vaild(); });
            }
        }
    }]).directive('customValid', [function () {
        return {
            require: "ngModel",
            restrict: 'A',
            scope: { valid: '&' },
            link: function (scope, elem, attrs, ctrl) {
                var callFunction = function () {
                    scope.valid({
                        validity: function (name, v) {
                            ctrl.$setValidity(name, !v);
                        }
                    });
                };
                if (typeof (attrs.customValid) != "undefined") {
                    scope.$parent.$watch(attrs.customValid, function () {
                        callFunction();
                    });
                }
                scope.$parent.$watch(attrs.ngModel, function () {
                    callFunction();
                });
            }
        };
    }]).directive('mSelectMultiple', function () {
        return {
            restrict: 'A',
            require: ['ngModel'],
            link: function (scope, element, attrs, ctrls) {
                var ngModel = ctrls[0];
                var id = attrs['id'];
                var jsonData = attrs['selectData'];
                if (angular.isDefined(jsonData) && jsonData != "") {
                    var data = JSON.parse(jsonData);
                    var ms = $('#' + id).magicSuggest({
                        data: data,
                        //sortOrder: 'ItemCode',
                        displayField: 'ItemName',
                        valueField: 'ItemName',
                        //selectionPosition: 'bottom',
                        maxSelection: 1
                    });

                    $(ms).on('selectionchange', function (e, m) {
                        var arrayVals = this.getValue();
                        if (arrayVals.length > 0) {
                            var old = "", newValue = "";
                            if (angular.isDefined(ngModel.$viewValue)) {
                                old = ngModel.$viewValue;
                                newValue = old + '\n' + arrayVals[0];
                            } else {
                                newValue = arrayVals[0];
                            }
                            ngModel.$setViewValue(newValue);
                        }
                    });

                }
            }
        };
    }).directive("txtBubble", function () {
        return {
            restrict: 'AE',
            scope: {
                content: "@",
            },
            link: function (scope, element, attr) {
                element.bind("mouseenter", function (e) {
                    if (scope.content.trim().length > 10) {
                        //弹出框
                        $("body").append("<div id='bubble' class='bubble'></div>");
                        $("#bubble").text(scope.content);
                        $("#bubble").css("left", e.pageX).css("top", e.pageY);
                        $(".bubble-txt").css("cursor", "pointer");
                    }
                })

                element.bind("mouseleave", function () {
                    //移除
                    if ($("#bubble").hasClass("hide")) {
                        $("#bubble").addClass("hide");
                    }
                    $(".bubble-txt").css("cursor", "default ");
                    $("#bubble").remove();
                })
            }
        }
    })
    //  UI 权限控制
    .directive("uiPermission", function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (attr.uiPermission) {
                    scope.$watch("$root.MyMenus", function (newValue, oldValue) {
                        if (newValue && newValue.length > 0) {
                            var perm = false;
                            $.each(newValue, function () {
                                var cp = this;
                                $.each(cp.Functions, function () {
                                    var fun = this;
                                    if (fun.Url === attr.uiPermission) {
                                        perm = true;
                                    }
                                });
                            });
                            if (!perm) {
                                $(element).remove();
                            }
                        }
                    });
                }

            }
        }
    })
        .directive('onFinishRenderFilters', function () {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        element.ready(function () {
                            scope.$emit('ngRepeatFinished');
                            // CALL TEST HERE!
                        });
                    }
                }
            };
        }).directive("hoverPopup", function () {
            return {
                restrict: 'AE',
                scope: {
                    content: "@",
                },
                link: function (scope, element, attr) {
                    element.bind("mouseover", function (e) {
                        element.find(".popup-div").css("display","block");
                    })

                    element.bind("mouseout", function () {
                        element.find(".popup-div").css("display","none");
                    })
                }
            }
        })
        .directive('repeatDone',function(){
            return{
                link:function(scope,element,attr){
                    if(scope.$last){
                        scope.$eval(attr.repeatDone);
                    }
                }
            }
        })
        .directive('swiperTop3',['$timeout','$http',function($timeout,$http) {
            return {
                restrict: "AE",
                scope: {
                    timeOut:'@',
                    deptId: '@'
                },
                templateUrl: '/WebScripts/components/swiper/screenDisplayTop3.html',
                link:function($scope,element,attr){
                    $scope.getData =function () {
                        $http({
                            url:'api/ScreenDisplay/GetScreenDisplay',
                            params:{'deptid':$scope.deptId,'start':'0','leng':3},
                        }).then(function (data) {
                            if (!data.data.Data || !data.data.Data.length) {
                                $scope.dataSwiper = [];
                                return;
                            }
                            $scope.dataSwiperTop3 = data.data.Data[0].InfoList;
                            $timeout(function () {
                                $scope.getData();
                            },$scope.timeOut)
                        },function (err) {
                            
                        })
                    }
                    $scope.getData();
                }
            }
        }])
        .directive('swiper',['$timeout','$http',function($timeout,$http){
            return{
                restrict:"AE",
                scope:{
                    url:'@',
                    timeOut:'@',
                    listCount:'@',
                    deptId:'@',
                    isFullScreen:'@'
                },
                templateUrl:'/WebScripts/components/swiper/screenDisplay.html',
                link:function($scope,element,attr){
                    var FullScreenStatus = $scope.isFullScreen;
                    var getFullStatus = function () {
                        $timeout(function () {
                            if(($scope.isFullScreen != FullScreenStatus) && $scope.isFullScreen == 'true'){
                                element.css('height',$scope.listCount*72+"px");
                                FullScreenStatus = $scope.isFullScreen;
                            }
                            if(($scope.isFullScreen != FullScreenStatus) && $scope.isFullScreen == 'false'){
                                element.css('height',$scope.listCount*50+"px");
                                FullScreenStatus = $scope.isFullScreen;
                            }
                            getFullStatus();
                        },50)
                    }
                    getFullStatus();
                    element.css('height',$scope.listCount*50+"px");

                    $scope.getData =function () {
                        element.find(".swiper-wrapper").css('transform','translate3d(0px,0px,0px)')
                        if($scope.mySwiper){
                            $scope.mySwiper.destroy(true);
                        }
                        $http({
                            url:'api/ScreenDisplay/GetScreenDisplay',
                            params:{'deptid':$scope.deptId,'start':'0','leng':-1},
                        }).then(function (data) {
                            if(!data.data.Data || !data.data.Data.length){
                                $scope.dataSwiper =[];
                                return;
                            }
                            var ts = data.data.Data[0].InfoList;
                            // $scope.dataSwiper = _.chunk(ts,$scope.listCount);
                            $scope.dataSwiper = ts;
                            // $scope.dataSwiperPage = _.chunk($scope.dataSwiper,$scope.listCount).length;
                            if($scope.dataSwiper.length-$scope.listCount<=0){
                                $scope.dataSwiperPage =  1;
                            }else {
                                $scope.dataSwiperPage = $scope.dataSwiper.length-$scope.listCount+1;
                            }

                            $timeout(function () {
                                $scope.mySwiper = new Swiper(element, {
                                    direction : 'vertical',
                                    slidesPerView : $scope.listCount,//'auto'
                                    autoplay: $scope.timeOut,//可选选项，自动滑动
                                    loop:false,
                                    autoplayStopOnLast : true,
                                    // height: h,//你的slide高度
                                    // height:'auto',
                                    // autoHeight: true,
                                    observer:true,//修改swiper自己或子元素时，自动初始化swiper
                                    observeParents:true,//修改swiper的父元素时，自动初始化swiper
                                    autoplayDisableOnInteraction:true,//用户操作swiper之后是否禁止autoplay
                                })
                            },0)
                            $timeout(function () {
                                $scope.getData();
                            },($scope.dataSwiperPage)*($scope.timeOut))
                        },function (err) {

                        })

                    }
                    $scope.getData();

                }
            }
        }])
})();