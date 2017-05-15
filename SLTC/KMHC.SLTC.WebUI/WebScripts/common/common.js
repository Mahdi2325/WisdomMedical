///创建人:刘美方
///创建日期:2016-02-22
///说明:公共信息
(function () {
    Array.prototype.toText = function (v) {
        if (this.length > 0 && v != null) {
            for (var i = this.length - 1; i > -1; i--) {
                if (this[i]["Value"] == v) return this[i].Name;
            }
        }
    };
    Array.prototype.indexObject = function (v) {
        if (this.length > 0 && v != null) {
            for (var i = this.length - 1; i > -1; i--) {
                if (this[i]["Value"] == v) return this[i];
            }
        }
    };

    /* 得到日期年月日等加数字后的日期 */
    Date.prototype.dateAdd = function (interval, number) {
        var d = this;
        var k = {
            'y': 'FullYear',
            'q': 'Month',
            'm': 'Month',
            'w': 'Date',
            'd': 'Date',
            'h': 'Hours',
            'n': 'Minutes',
            's': 'Seconds',
            'ms': 'MilliSeconds'
        };
        var n = {
            'q': 3,
            'w': 7
        };
        eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
        return d;
    };
    /* 计算两日期相差的日期年月日等 */
    Date.prototype.dateDiff = function (interval, objDate2) {
        var d = this,
            i = {},
            t = d.getTime(),
            t2 = objDate2.getTime();
        i['y'] = objDate2.getFullYear() - d.getFullYear();
        i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
        i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
        i['ms'] = objDate2.getTime() - d.getTime();
        i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
        i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
        i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
        i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
        i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
        return i[interval];
    };
    // 对Date的扩展，将 Date 转化为指定格式的String 
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
    // 例子： 
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    Date.prototype.currentTime = function () {
        var now = new Date();

        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日

        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分

        var clock = year + "-";

        if (month < 10)
            clock += "0";

        clock += month + "-";

        if (day < 10)
            clock += "0";

        clock += day + " ";

        if (hh < 10)
            clock += "0";

        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm;
        return (clock);
    };
    Date.prototype.currentDate = function () {
        var now = new Date();

        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日

        var clock = year + "-";

        if (month < 10)
            clock += "0";

        clock += month + "-";

        if (day < 10)
            clock += "0";

        clock += day;
        return (clock);
    };
    String.prototype.format = function (args) {
        if (arguments.length > 0) {
            var result = this;
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    var arg = arguments[i];
                    if (arg == undefined || arg == null) {
                        arg = "";
                    }
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arg);
                }
            }
            return result;
        }
        else {
            return this;
        }
    }
    String.prototype.toDateFormat = function () {
        var reg = /^\d{8}$/;
        var datetime = this;
        if (reg.test(datetime)) {
            return datetime.substring(0, 4) + "-" + datetime.substring(4, 6) + "-" + datetime.substring(6, 8);
        }
        else {
            return datetime;
        }
    }
    String.prototype.toTwDateFormat = function () {
        var reg = /^\d{6}$/;
        var datetime = this;
        if (reg.test(datetime)) {
            return datetime.substring(0, 2) + "-" + datetime.substring(2, 4) + "-" + datetime.substring(4, 6);
        }
        else {
            return datetime;
        }
    }

    String.prototype.toTwDate = function () {
        var input = this;
        if (input == "" || input == null) {
            return "";
        }
        var time = newDate(input);
        var year = (time.getFullYear() - 1911).toString();
        var month = (time.getMonth() + 1).toString();
        var day = time.getDate().toString();
        if (year.length == 1) {
            year = "0" + year;
        }
        if (month.length == 1) {
            month = "0" + month;
        }
        if (day.length == 1) {
            day = "0" + day;
        }
        var output = year + "-" + month + "-" + day;
        return output;
    }

    String.prototype.toUtf8 = function () {
        var str = this;
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            } else if (c > 0x07FF) {
                out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            } else {
                out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
            }
        }
        return out;
    }

    //UUID 生成
    window.uuid = function (len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    }
})();

(function ($) {
    var opt;

    $.fn.jqprint = function (options) {
        opt = $.extend({}, $.fn.jqprint.defaults, options);

        var $element = (this instanceof jQuery) ? this : $(this);

        if (opt.operaSupport && typeof ($.browser) != "undefined" && $.browser.opera) {
            var tab = window.open("", "jqPrint-preview");
            tab.document.open();

            var doc = tab.document;
        }
        else {
            var $iframe = $("<iframe  />");

            if (!opt.debug) { $iframe.css({ position: "absolute", width: "0px", height: "0px", left: "-600px", top: "-600px" }); }

            $iframe.appendTo("body");
            var doc = $iframe[0].contentWindow.document;
        }

        if (opt.importCSS) {
            if ($("link[media=print]").length > 0) {
                $("link[media=print]").each(function () {
                    doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' media='print' />");
                });
            }
            else {
                $("link").each(function () {
                    doc.write("<link type='text/css' rel='stylesheet' href='" + $(this).attr("href") + "' />");
                });
            }
        }

        if (opt.printContainer) { doc.write($element.outer()); }
        else { $element.each(function () { doc.write($(this).html()); }); }

        doc.close();

        (opt.operaSupport && typeof ($.browser) != "undefined" && $.browser.opera ? tab : $iframe[0].contentWindow).focus();
        setTimeout(function () { (opt.operaSupport && typeof ($.browser) != "undefined" && $.browser.opera ? tab : $iframe[0].contentWindow).print(); if (tab) { tab.close(); } }, 1000);
    }

    $.fn.jqprint.defaults = {
        debug: false,
        importCSS: true,
        printContainer: true,
        operaSupport: true
    };


    // Thanks to 9__, found at http://users.livejournal.com/9__/380664.html
    jQuery.fn.outer = function () {
        return $($('<div></div>').html(this.clone())).html();
    }
})(jQuery);

function newDate(str) {
    if (str.indexOf('T') > 0) {
        str = str.split('T');
    }
    else {
        str = str.split(' ');
    }
    var date = new Date();
    var dateArr = str[0].split('-');
    var timeArr = [0, 0, 0];
    if (str.length == 2) {
        timeArr = str[1].split(':');
    }
    date.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2]);
    date.setHours(timeArr[0], timeArr[1], timeArr[2], 0);
    return date;
}

function isDate(val) {
    var a = /^(\d{4})-(\d{2})-(\d{2})T?(\d{2}):(\d{2}):(\d{2})$/
    if (!a.test(val)) {
        return false
    }
    else
        return true
}

function TreeHelper(res, id, param, filter) {
    this.$tree = $(id);
    this.res = res;
    this.param = param;
    this.filter = filter;
}

TreeHelper.prototype = {
    loadTree: function () {
        var self = this;
        this.res.query(this.param, function (data) {
            var localdata = [];
            if (self.filter && typeof self.filter == 'function') {
                localdata = self.filter(data);
            } else {
                localdata = data.Data;
            }
            self.$tree.treeview({ showCheckbox: true, data: localdata });

            self.$tree.on('nodeChecked', function (event, data) {
                self.checkParent($(event.currentTarget), data, true);
                self.checkChild($(event.currentTarget), data, true);
            });

            self.$tree.on('nodeUnchecked ', function (event, data) {
                self.checkParent($(event.currentTarget), data, false);
                self.checkChild($(event.currentTarget), data, false);
            });

            self.collapseAll();
        });
    },
    checkParent: function (tree, node, checked) {
        var self = this;
        if (typeof (node.parentId) != "undefined") {
            if (checked) {
                tree.treeview('checkNode', [node.parentId, { silent: true }]);
            }
            else {
                //tree.treeview('uncheckNode', [node.parentId, { silent: true }]);
            }
            var parentNode = tree.treeview('getNode', [node.parentId, { silent: true }]);
            self.checkParent(tree, parentNode, checked);
        }
    },
    checkChild: function (tree, node, checked) {
        var self = this;
        if (typeof (node.nodes) != "undefined" && node.nodes != null) {
            $.each(node.nodes, function (key, childNode) {
                if (checked) {
                    tree.treeview('checkNode', [childNode.nodeId, { silent: true }]);
                }
                else {
                    tree.treeview('uncheckNode', [childNode.nodeId, { silent: true }]);
                }
                self.checkChild(tree, childNode, checked);
            });
        }
    },
    expandAll: function () {
        this.$tree.treeview('expandAll', { silent: true });
    },
    collapseAll: function () {
        this.$tree.treeview('collapseAll', { silent: true });
    },
    getChecked: function () {
        return this.$tree.treeview("getChecked", { silent: true });
    },
    setParam: function (param) {
        this.param = param;
    }
}

//判断开始日期和结束日期
function checkDate(startDate, endDate) {
    var _startDate = formatDate(startDate)
    var _endDate = formatDate(endDate)
    if (_startDate != "" && _endDate != "") {
        if (_startDate > _endDate) {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

function formatDate(strTime) {
    if (strTime == null || strTime == "") {
        return "";
    }
    var date = new Date(strTime);
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    if (month.length == 1) {
        month = "0" + month;

    }
    var day = date.getDate().toString();
    if (day.length == 1) {
        day = "0" + day;

    }
    return year + month + day;
}
function Dateformat(strTime) {
    if (strTime == null || strTime == "") {
        return "";
    }
    var date = new Date(strTime);
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    if (month.length == 1) {
        month = "0" + month;

    }
    var day = date.getDate().toString();
    if (day.length == 1) {
        day = "0" + day;

    }
    return year + "-" + month + "-" + day;
}
function addDate(dateParameter, num) {
    var translateDate = "", dateString = "", monthString = "", dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/");
    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate + num * 24 * 60 * 60 * 1000;
    newDate = new Date(newDate);
    //如果月份长度少于2，则前加 0 补位     
    if ((newDate.getMonth() + 1).toString().length == 1) {
        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
        monthString = (newDate.getMonth() + 1).toString();
    }
    //如果天数长度少于2，则前加 0 补位     
    if (newDate.getDate().toString().length == 1) {
        dayString = 0 + "" + newDate.getDate().toString();
    } else {
        dayString = newDate.getDate().toString();
    }
    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString + " 00:00:00";
    return dateString;
}

function objEquals (source,obj) {
    if (source == obj)
        return true;
    if (typeof (obj) == "undefined" || obj == null || typeof (obj) != "object")
        return false;
    var length = 0;
    var length1 = 0;
    for (var ele in source) {
        length++;
    }
    for (var ele in obj) {
        length1++;
    }
    if (length != length1)
        return false;
    if (obj.constructor == source.constructor) {
        for (var ele in source) {
            if (typeof (source[ele]) == "object") {
                if (!objEquals(source[ele], obj[ele]))
                    return false;
            } else if (typeof (source[ele]) == "function") {
                if (source[ele].toString()!=obj[ele].toString())
                    return false;
            } else if (source[ele] != obj[ele])
                return false;
        }
        return true;
    }
    return false;
}
