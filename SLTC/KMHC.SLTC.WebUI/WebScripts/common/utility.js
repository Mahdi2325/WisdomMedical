///创建人:张正泉
///创建日期:2015-08-03
///说明:
///各个模块公共类库和指令

//日期:20150817
//说明:公共模块中的静态数据和方法

///修改人:肖国栋
///修改日期:2016-03-01
///说明:修改成匿名函数方式

(function () {
    var app = angular.module("Utility", []);
    app.value("pattern", {
        phone: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
        Identity: /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/
    });


    //app.run(function($rootScope) {
    //    angular.extend($rootScope, {
    //        Dics: {},
    //        Dic: function(typeName) {
    //            if (typeName) {
    //                if (!($rootScope.Dics.hasOwnProperty(typeName) && $rootScope.Dics[typeName].length != 0)) {
    //                    $rootScope.Dics[typeName] = [];
    //                    $.ajax({
    //                        ulr: '/GetCode/GetCodes',
    //                        type: "POST",
    //                        dataType: "JSON",
    //                        async: false,
    //                        data: { ids: typeName },
    //                        success: function(data) {
    //                            $rootScope.timer = null;
    //                            if (data) {
    //                                $rootScope.Dics[typeName] = data;
    //                            }
    //                        }
    //                    });
    //                }
    //                return $rootScope.Dics[typeName];
    //            }
    //        },
    //        preLoad: function(types, callback) {
    //            if (types && types.length > 0) {
    //                var ids = [];
    //                for (var index = 0; index < types.length; index++) {
    //                    if (!$rootScope.Dics.hasOwnProperty(types[index])) {
    //                        ids.push(types[index]);
    //                    }
    //                }
    //                if (ids.length > 0) {
    //                    $http.post('/api/code', { ids: ids.join() }).success(function(data) {
    //                        for (var name in data) {
    //                            if (data.hasOwnProperty(name)) {
    //                                $rootScope.Dics[name] = data[name];
    //                            }
    //                        }
    //                        if (callback) {
    //                            callback($rootScope.Dics);
    //                        }
    //                    });
    //                }
    //            }
    //        }
    //    });
    //});

    app.factory("dictionary", ['$rootScope', '$http', function ($rootScope, $http) {
        return {
            get: function (types, callback) {
                if (types == undefined || types.length < 0) {
                    callback(null);
                    return;
                }
                var ids = "";
                if ($rootScope.Dics == undefined) {
                    $rootScope.Dics = {};
                    ids = types.join(",");
                } else {
                    for (var index = 0; index < types.length; index++) {
                        if (!$rootScope.Dics.hasOwnProperty(types[index])) {
                            ids += types[index] + ",";
                        }
                    }
                    if (ids === "") {
                        callback($rootScope.Dics);
                        return;
                    }
                    ids = ids.substr(0, ids.length - 1);
                }
                $http.get('/api/Code?itemType=' + ids.toString()).success(function (data) {
                    for (var name in data.Data) {
                        if (data.Data.hasOwnProperty(name)) {
                            $rootScope.Dics[name] = data.Data[name];
                        }
                    }
                    callback($rootScope.Dics);
                });
            }
        }
    }]);

    //日期:20150817
    //说明:该部分使用angularjs的指令扩展，定义了一些事件指令
    //

    //日期:20150817
    //说明:该部分定义了页面中使用相关第三方插件的对应扩展

    //日期控件
    app.directive('multiselect', function () {//多选控件
        return {
            restrict: 'A',
            priority: 2,
            replace: true,
            template: function (tElement, tAttrs) {
                var chirdrens = tElement.children();
                var style = tAttrs.style ? tAttrs.style : "";
                var tStr = '<div class="input-group"><input type="text" class="form-control" id="' + tAttrs.id + '" title="{{' + tAttrs.bind + '}}" multipleselect/><div class="input-group-btn"><button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">请选择<span class="caret"></span></button>'
                    + '<ul class="dropdown-menu dropdown-menu-right multiselect-container" style="overflow-y: auto;overflow-x: hidden;' + style + '">';
                for (var i = 0; i < chirdrens.length; i++) {
                    tStr += '<li><a tabindex="' + i + '"><label class="checkbox"><input id="' + tElement.attr("name") + i + '" name="' + tElement.attr("name") + '" type="checkbox" value="' + chirdrens[i].value + '"/>' + chirdrens[i].innerText + '</lable></a></li>';
                }
                tStr += '</ul></div></div>';
                return tStr;
            },
            compile: function (scope, element) {
                var curElement = element.$$element;
                var l = curElement.find("ul li").length;
                curElement.find("ul").width(curElement.width()).height(l >= 10 ? 25 * 10 : 25 * l);
                curElement.find("ul li").click(function (e) {
                    var curLi = $(this);
                    var text = $(this).text();
                    var s = curElement.find("input:text").val();
                    var curInput = $(this).find("input");
                    if (curLi.hasClass("active")) {
                        curInput[0].checked = false;
                        curLi.removeClass("active");
                        s = s.replace(text + ",", "").replace("," + text, "").replace(text, "");
                    } else {
                        curInput[0].checked = true;
                        curLi.addClass("active");

                        if (s == "") {
                            s = text;
                        } else {
                            s += "," + text;
                        }
                    }
                    curElement.find("input:text").val(s);
                    return false;
                });
            }
        };
    });


    app.directive('ensureUnique', ['$http', function ($http) {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                scope.$watch(attrs.ngModel, function (n) {
                    if (!n) return;
                    if (attrs.ngReadonly === "true") return;
                    $http({
                        method: 'POST',
                        url: '/Check/' + attrs.ensureUnique,
                        data: {
                            //field: attrs.ensureUnique,
                            value: n
                        }
                    }).success(function (data) {
                        c.$setValidity('unique', data);
                    }).error(function (data) {
                        c.$setValidity('unique', false);
                    });
                });
            }
        };
    }]);


    app.factory("utility", ['$cookies', '$rootScope', function ($cookies, $rootScope) {
        return {
            BMI: function (weight, height) {
                if (angular.isNumber(weight) && angular.isNumber(height) && height > 0 && weight > 0) {
                   return  Math.round(weight / ((height / 100) * (height / 100)) * 100) / 100;
                }
                return "";
            },
            BMIResult: function (ibm) {
                    if (ibm < 18.5) {
                        return "过轻";
                    }else if (ibm<=24.99) {
                        return "正常";
                    }else if (ibm <= 28) {
                        return "过重";
                    }else if (ibm <= 32) {
                        return "肥胖";
                    } else {
                        return "非常肥胖";
                    }
            },
            CountHeight: function (kneeLen, sex, age) {
                if (angular.isNumber(kneeLen) && angular.isNumber(age) && angular.isDefined(sex) && age > 0 && kneeLen > 0) {
                    if (sex === 'M') {
                        return Math.round(85.1 + 1.73 * kneeLen - 0.11 * age);
                    }
                    if (sex === 'F') {
                        return Math.round(91.45 + 1.53 * kneeLen - 0.16 * age);
                    }
                }
                return "";
            },
            XmlStrToJson: function (xmlStr) {
                var xml = this.XmlStrToXmlObj(xmlStr);
                return this.XmlToJson(xml);
            },
            XmlToJson: function (xml) {
                var obj = {};
                if (xml.nodeType == 1) { // element
                    // do attributes
                    if (xml.attributes.length > 0) {
                        obj["@attributes"] = {};
                        for (var j = 0; j < xml.attributes.length; j++) {
                            var attribute = xml.attributes.item(j);
                            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                        }
                    }
                } else if (xml.nodeType == 3) { // text
                    obj = xml.nodeValue;
                }

                // do children
                if (xml.hasChildNodes()) {
                    for (var i = 0; i < xml.childNodes.length; i++) {
                        var item = xml.childNodes.item(i);
                        var nodeName = item.nodeName;
                        if (typeof (obj[nodeName]) == "undefined") {
                            obj[nodeName] = this.XmlToJson(item);
                        } else {
                            if (typeof (obj[nodeName].length) == "undefined") {
                                var old = obj[nodeName];
                                obj[nodeName] = [];
                                obj[nodeName].push(old);
                            }
                            obj[nodeName].push(this.XmlToJson(item));
                        }
                    }
                }
                return obj;
            },
            JsonToXmlStr: function () { },
            XmlStrToXmlObj: function (xmlString) {
                var xmlDoc = null;
                //判断浏览器的类型
                //支持IE浏览器 
                if (!window.DOMParser && window.ActiveXObject) {   //window.DOMParser 判断是否是非ie浏览器
                    var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
                    for (var i = 0; i < xmlDomVersions.length; i++) {
                        try {
                            xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                            xmlDoc.async = false;
                            xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                            break;
                        } catch (e) {
                        }
                    }
                }
                    //支持Mozilla浏览器
                else if (window.DOMParser && document.implementation && document.implementation.createDocument) {
                    try {
                        /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                         * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                         * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                         * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                         */
                        domParser = new DOMParser();
                        xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
                    } catch (e) {
                    }
                }
                else {
                    return null;
                }
                return xmlDoc;
            },
            showNoData: function (id, msg) {
                var msgArea = id ? id : "#reportListTab";
                var msg = msg ? msg : "查询区间内暂无数据~";
                if ($(msgArea).length) {
                    $(msgArea).html("<div class='noData'><p class='nodata-text'>" + msg + "</p></div>")
                }
            },
            formatDate: function (date) {
                if (date == null) {
                    return "";
                }
                var index = date.indexOf("T");
                if (index === -1) {
                    return "";
                } else {
                    return date.substr(0, index);
                }
            },
            calculateAge: function (birthday) {
                if (birthday != null && birthday !== "") {
                    var aDate = birthday.split("-");
                    var birthdayYear = parseInt(aDate[0]);
                    var currentDate = new Date();
                    var currentYear = parseInt(currentDate.getFullYear());
                    return currentYear - birthdayYear;
                }
                return "";
            },
            isNum: function (s) {
                if (s != null && s !== "") {
                    return !isNaN(s);
                }
                return false;
            },
            showDicName: function (list, value) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].Value === value) {
                        return list[i].Name;
                    }
                }
                return "";
            },
            message: function (msg) {
                Messenger.options = {
                    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
                    theme: 'future'
                }
                //Call
                Messenger().post({
                    message: msg,
                    showCloseButton: true
                });
                setTimeout(function () {
                    $(".messenger-message-slot").modal("hide");
                }, 3000);
            },
            msgwarning: function (msg) {
                Messenger.options = {
                    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
                    theme: 'future'
                }
                Messenger().post({
                    message: msg,
                    type: 'error',
                    showCloseButton: true
                });
                setTimeout(function () {
                    $(".messenger-message-slot").modal("hide");
                }, 3000);
            },
            alert: function (msg) {
                bootbox.alert(msg);
            },
            confirm: function (msg, callbackfn) {
                bootbox.confirm(msg, function (result) {
                    callbackfn(result);
                });
            },
            getUserInfo: function () {
                return window.currentUser;
            },
            getClassType: function (d) {
                var h=d.getHours();
                if (h >= 8 && h < 16) {
                    return "D"
                } else if (h >= 16 && h < 20) {
                    return "E";
                } else {
                    return "N";
                }
            },
            hashCode: function (str) {
                if (str === undefined) return 0;
                var hash = 0;
                if (str.length === 0) return hash;
                for (var i = 0; i < str.length; i++) {
                    var char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return Math.abs(hash);
            }
        };
    }]);


    app.factory("cloudAdminUi", function () {
        return {
            initFormWizard: function () {
                FormWizard.init();
            },
            initDatepicker: function () {
                $(".datepicker").datepicker({
                    dateFormat: "yy-mm-dd",
                    changeMonth: true,
                    changeYear: true
                });
            },
            /*-----------------------------------------------------------------------------------*/
            /*	Handles the go to top button at the footer
            /*-----------------------------------------------------------------------------------*/
            handleGoToTop: function () {
                $('.footer-tools').on('click', '.go-top', function (e) {
                    App.scrollTo();
                    e.preventDefault();
                });
            },
            /*-----------------------------------------------------------------------------------*/
            /* Box tools
            /*-----------------------------------------------------------------------------------*/
            handleBoxTools: function () {
                //Collapse
                $('.box .tools .collapse, .box .tools .expand').click(function () {
                    var el = jQuery(this).parents(".box").children(".box-body");
                    if ($(this).hasClass("collapse")) {
                        $(this).removeClass("collapse").addClass("expand");
                        var i = $(this).children(".fa-chevron-up");
                        i.removeClass("fa-chevron-up").addClass("fa-chevron-down");
                        el.slideUp(200);
                    } else {
                        $(this).removeClass("expand").addClass("collapse");
                        var i = $(this).children(".fa-chevron-down");
                        i.removeClass("fa-chevron-down").addClass("fa-chevron-up");
                        el.slideDown(200);
                    }
                });
                /* Close */
                $('.box .tools a.remove').click(function () {
                    var removable = $(this).parents(".box");
                    if (removable.next().hasClass('box') || removable.prev().hasClass('box')) {
                        $(this).parents(".box").remove();
                    } else {
                        $(this).parents(".box").parent().remove();
                    }
                });
                /* Reload */
                $('.box .tools a.reload').click(function () {
                    var el = $(this).parents(".box");
                    App.blockUI(el);
                    window.setTimeout(function () {
                        App.unblockUI(el);
                    }, 1000);
                });
            },
            handleSidebarAndContentHeight : function () {
                var content = $('#content');
                var sidebar = $('#sidebar');
                var body = $('body');
                var height;

                if (body.hasClass('sidebar-fixed')) {
                    height = $(window).height() - $('#header').height() + 1;
                } else {
                    height = sidebar.height() + 20;
                }
                if (height >= content.height()) {
                    content.attr('style', 'min-height:' + height + 'px !important');
                }
            },
            handleSidebar: function() {
                jQuery('#ulMenu li').click(function () {
                    var last = jQuery('.has-sub.open', $('.sidebar-menu'));
                    last.removeClass("open");
                    jQuery('.arrow', last).removeClass("open");
                    jQuery('.sub', last).slideUp(200);

                    var thisElement = $(this);
                    var slideOffeset = -200;
                    var slideSpeed = 200;

                    var sub = jQuery(this).next();
                    if (sub.is(":visible")) {
                        jQuery('.arrow', jQuery(this)).removeClass("open");
                        jQuery(this).parent().removeClass("open");
                        sub.slideUp(slideSpeed, function () {
                            if ($('#sidebar').hasClass('sidebar-fixed') == false) {
                                App.scrollTo(thisElement, slideOffeset);
                            }
                            handleSidebarAndContentHeight();
                        });
                    } else {
                        jQuery('.arrow', jQuery(this)).addClass("open");
                        jQuery(this).parent().addClass("open");
                        sub.slideDown(slideSpeed, function () {
                            if ($('#sidebar').hasClass('sidebar-fixed') == false) {
                                App.scrollTo(thisElement, slideOffeset);
                            }
                            handleSidebarAndContentHeight();
                        });
                    }
                });

                // Handle sub-sub menus
                jQuery('.sidebar-menu .has-sub .sub .has-sub-sub > a').click(function () {
                    var last = jQuery('.has-sub-sub.open', $('.sidebar-menu'));
                    last.removeClass("open");
                    jQuery('.arrow', last).removeClass("open");
                    jQuery('.sub', last).slideUp(200);

                    var sub = jQuery(this).next();
                    if (sub.is(":visible")) {
                        jQuery('.arrow', jQuery(this)).removeClass("open");
                        jQuery(this).parent().removeClass("open");
                        sub.slideUp(200);
                    } else {
                        jQuery('.arrow', jQuery(this)).addClass("open");
                        jQuery(this).parent().addClass("open");
                        sub.slideDown(200);
                    }
                });
            }

        }
    });
    app.factory("webUploader", function () {
        return {
            init: function (id, data, title, extensions, mimeTypes, successCallback, width, multi, queueCompleteCallback) {
                multi = multi || false;
                queueCompleteCallback = queueCompleteCallback || undefined;
                width = width || 100;
                var fileTypeExts = "";
                $.each(extensions.split(","), function () {
                    fileTypeExts = fileTypeExts + "*." + this + ";";
                });
                if (fileTypeExts.length > 0) {
                    fileTypeExts = fileTypeExts.substring(0, fileTypeExts.length - 1);
                }
                $(id).uploadify({
                    'height': 27,
                    'width': width,
                    'buttonText': "上传" + title,
                    'swf': '/Content/uploadify/uploadify.swf',
                    'uploader': '/api/upload',
                    'formData': data,
                    'auto': true,
                    'multi': multi,
                    'removeCompleted': true,
                    'cancelImg': '/Content/uploadify/uploadify-cancel.png',
                    'fileTypeExts': fileTypeExts,
                    'fileSizeLimit': '10MB',
                    'onUploadSuccess': function (file, data, response) {
                        if (typeof (successCallback) != "undefined") {
                            successCallback(eval(data));
                        }
                    },
                    //加上此句会重写onSelectError方法【需要重写的事件】
                    'overrideEvents': ['onSelectError', 'onDialogClose'],
                    //返回一个错误，选择文件的时候触发
                    'onSelectError': function (file, errorCode, errorMsg) {
                        switch (errorCode) {
                            case -110:
                                alert("文件 [" + file.name + "] 大小超出系统限制的" + jQuery(id).uploadify('settings', 'fileSizeLimit') + "大小！");
                                break;
                            case -120:
                                alert("文件 [" + file.name + "] 大小异常！");
                                break;
                            case -130:
                                alert("文件 [" + file.name + "] 类型不正确！");
                                break;
                        }
                    },
                    'onQueueComplete': function (queueData) {
                        if (typeof (queueCompleteCallback) != "undefined") {
                            queueCompleteCallback(eval(queueData));
                        }
                    }
                });
            }
        }
    });

    
    app.factory("webUploader1", function () {
        return {
            //'#headPhotoPicker, #livingPhotoPicker, #PedigreeChartPicker'
            //{ category: 'HomePhoto' }
            //'Images'
            //'gif,jpg,jpeg,bmp,png'
            //'image/*'
            //$scope.HeadPhotoUrl
            init: function (id, data, title, extensions, mimeTypes, successCallback) {
                // 初始化Web Uploader
                this.uploader = WebUploader.create({
                    // 选完文件后，是否自动上传。
                    auto: true,
                    // swf文件路径
                    swf: '/Scripts/Uploader.swf',
                    // 文件接收服务端。
                    server: '/api/upload',
                    formData: data,
                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: id,
                    // 只允许选择图片文件。
                    accept: {
                        title: title,
                        extensions: extensions,
                        mimeTypes: mimeTypes
                    },
                    duplicate: true
                });

                var thumbnailWidth = 100, thumbnailHeight = 100;
                // 当有文件添加进来的时候
                //uploader.on('fileQueued', function (file) {
                //    var $li = $(
                //            '<div id="' + file.id + '" class="file-item thumbnail">' +
                //                '<img>' +
                //                '<div class="info">' + file.name + '</div>' +
                //            '</div>'
                //            ),
                //        $img = $li.find('img');


                //    // $list为容器jQuery实例
                //    var $list = $('fileList');
                //    $list.append($li);

                //    // 创建缩略图
                //    // 如果为非图片文件，可以不用调用此方法。
                //    // thumbnailWidth x thumbnailHeight 为 100 x 100
                //    uploader.makeThumb(file, function (error, src) {
                //        if (error) {
                //            $img.replaceWith('<span>不能预览</span>');
                //            return;
                //        }

                //        $img.attr('src', src);
                //    }, thumbnailWidth, thumbnailHeight);
                //});
                // 文件上传过程中创建进度条实时显示。
                this.uploader.on('uploadProgress', function (file, percentage) {
                    var $li = $('#' + file.id),
                        $percent = $li.find('.progress span');

                    // 避免重复创建
                    if (!$percent.length) {
                        $percent = $('<p class="progress"><span></span></p>')
                                .appendTo($li)
                                .find('span');
                    }

                    $percent.css('width', percentage * 100 + '%');
                });

                // 文件上传成功，给item添加成功class, 用样式标记上传成功。
                this.uploader.on('uploadSuccess', function (file, response) {
                    //FileName: "2.jpg"
                    //Message: null
                    //SavedLocation: "/Uploads/HomePhoto/201602/261101304959_0.jpg"
                    //Status: 1
                    if (typeof (successCallback) != "undefined") {
                        successCallback(response);
                    }
                    $('#' + file.id).addClass('upload-state-done');
                });

                // 文件上传失败，显示上传出错。
                this.uploader.on('uploadError', function (file) {

                    var $li = $('#' + file.id),
                        $error = $li.find('div.error');

                    // 避免重复创建
                    if (!$error.length) {
                        $error = $('<div class="error"></div>').appendTo($li);
                    }

                    $error.text('上传失败');
                });

                // 完成上传完了，成功或者失败，先删除进度条。
                this.uploader.on('uploadComplete', function (file) {
                    $('#' + file.id).find('.progress').remove();
                });

                this.uploader.on('error', function (type) {
                    switch (type) {
                        case "Q_TYPE_DENIED":
                            //utility.alert("文件类型不正确！");
                            alert("文件类型不正确！");
                            break;
                    }
                });
            }
        }
    });
})();