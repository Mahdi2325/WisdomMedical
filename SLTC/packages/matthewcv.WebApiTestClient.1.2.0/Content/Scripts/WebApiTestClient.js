(function() {

    var apiDescription = null;
    var currentId = 0;
    var currentHeaderId = 0;
    var descCache = {};
    var templates = {};
    var siteRoot = null;

    function getSiteRoot() {
        if (siteRoot == null) {
            var ss = document.getElementsByTagName("script");
            [].forEach.call(ss, function(s) {
                if (s.src.toLowerCase().indexOf("webapitestclient.js") >= 0) {
                    siteRoot = s.src;
                    siteRoot = siteRoot.replace(window.location.origin, "");
                    siteRoot = siteRoot.substr(0, siteRoot.toLowerCase().indexOf("/scripts"));
                }
            });


            siteRoot = siteRoot + "/";
        }

        return siteRoot;
    }


    function nextId(desc, isHeader) {
        if (isHeader) {
            currentHeaderId++;
        } else {
            currentId++;
        }


        desc.id = (isHeader? "h-" + currentHeaderId : currentId.toString());
        descCache[desc.id] = desc;
    }
    
    function getComplexType(desc) {
        var typeName = desc.TypeName || desc.ValueTypeName;

        var found = apiDescription.ComplexTypes.filter(function(t) {
            return t.Name == typeName;
        });

        if (found.length) {
            return found[0];
        }
        return null;
    }

    function clone(thing) {
        return JSON.parse(JSON.stringify(thing));
    }

    //the name of the api is the last segment of the url. 
    var apiId = window.location.pathname.split('/').pop();

    //go get the meta data for this API
    getJson(getSiteRoot() + "_WebApiTestClient?ApiName=" + apiId, getReadyToUseTestClient);


    //callback from getting meta data.
    function getReadyToUseTestClient(data) {
        window.apiDescription = apiDescription = data;
        window.descCache = descCache;

        dom.el("link", { "href": getSiteRoot() + "Content/WebApiTestClient.styles.css", "rel": "stylesheet", "type": "text/css" }, document.head);
        dom.el("script", { "src": "//cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0/handlebars.min.js", "type": "text/javascript" }, document.head);
        makeActivatorButton();
    }

    //take the metadata and extend the objects a bit to help out with the handlebars templates
    function setUpApiDescForUi() {
        apiDescription.Headers = [];
        apiDescription.Origin = window.location.origin;
        apiDescription.SiteRoot = getSiteRoot();
        apiDescription.QueryParameters.forEach(function(p) {
            nextId(p);
        });
        apiDescription.RouteParameters.forEach(function(p) {
            nextId(p);
        });

        if (apiDescription.BodyParameter) {
            if (apiDescription.BodyParameter.IsDictionary) {
                setUpDictionary(apiDescription.BodyParameter);
            } else {
                setUpProperties(apiDescription.BodyParameter);
            }
        }

        getInitialDataFromStorage();

    }

    function getInitialDataFromStorage() {
        var headers = storage.get(storage.names.headers);

        if (headers) {
            headers.forEach(function(h) {
                var item = makeHeaderItem();
                item.Name.Value = h.Name;
                item.Value.Value = h.Value;
            });
        }
    }

    function makeHeaderItem() {
        var item = {
            Name: { TypeName: "System.String" },
            Value: { TypeName: "System.String" }
        }
        nextId(item,true);
        nextId(item.Name, true);
        nextId(item.Value, true);
        apiDescription.Headers.push(item);

        return item;
    }


    function setUpDictionary(desc) {
        if (!desc.IsSimple) {
            return null;
        }
        if (!desc.id) {
            nextId(desc);
        }

        var item = {
            Key: { TypeName: desc.KeyTypeName },
            Value: {TypeName: desc.ValueTypeName }
        }

        nextId(item.Key);
        nextId(item.Value);

        if (!desc.Items) {
            desc.Items = [];
        }

        desc.Items.push(item);

        return item;
    }

    function addComplexItemToList(parent, ct) {
        var item = clone(ct);
        nextId(item);
        if (!parent.Items) {
            parent.Items = [];
        }
        parent.Items.push(item);
        item.Properties.forEach(function (p) {
            nextId(p);
        });
        return item;
    }

    function setUpProperties(desc) {
        if (!desc.id) {
            nextId(desc);
        }
            
        var ct = getComplexType(desc);

        
        if (ct) {
            if (desc.IsList) {
                addComplexItemToList(desc,ct);

            } else {
                desc.Properties = clone(ct.Properties);
                desc.Properties.forEach(function(p) {
                    nextId(p);
                });
            }
        }
        
    }

    //put the button on the screen that the user will click to activate the test client.
    function makeActivatorButton() {
        var a = dom.el("A", {'class':"watc-activator","href": "#test"}, document.body);

        dom.text(a, "Test this API");

        a.addEventListener("click", function (ev) {
            ev.preventDefault();
            getTemplate(showUi);
            a.parentNode.removeChild(a);

        });

    }


    //callback from the ajax call that gets the template HTML
    function showUi() {
        configHandlebars();
        setUpApiDescForUi();

        var html = templates['container'](apiDescription);
        dom.html(html, document.body);

        window.scroll(0, document.body.scrollHeight);

        var panel = dom.gid('watc-panel');
        panel.addEventListener("click", clickHandler);

    }


    //handles any click event from within the panel that contains the test client
    function clickHandler(ev) {
        var cmd = ev.target.getAttribute("data-cmd");
        if (cmd && commands[cmd]) {
            ev.preventDefault();
            commands[cmd](ev.target);
        }
    }

    //set up handlebars.  
    function configHandlebars() {

        //Get all the templates, compile each one, cache the compiled template and register it as a partial
        [].forEach.call(document.querySelectorAll("script[type='text/html']"), function(t) {

            var name = t.getAttribute("id").replace("tpl-watc-", "");

            templates[name] = Handlebars.compile(t.innerHTML);
            Handlebars.registerPartial(name, templates[name]);
        });

        //this is a helper that will output a unique value sutibale for an id attribute for a dom element.
        var id = 1;
        Handlebars.registerHelper("uniqueId", function() {
            return "idx-" + id++;
        });

    }


    function getSimpleValue(desc) {
        
        var input = document.querySelectorAll("input[name=input-" + desc.id + "]");

        var val = [].map.call(input,function (i) {
            return i.value;
        });
        if (desc.TypeName == "System.DateTime" || desc.TypeName == "System.DateTimeOffset") {
            val = val.map(function(v) {
                return new Date(v);
            });
        }
        else if (desc.TypeName == "System.Int32" || desc.TypeName == "System.Int16" || desc.TypeName == "System.Int64") {
            val = val.map(function (v) {
                v = parseInt(v);
                if (isNaN(v)) {
                    return null;
                }
                return v;
            });
        }
        else if (desc.TypeName == "System.Decimal" || desc.TypeName == "System.Double" || desc.TypeName == "System.Single") {
            val = val.map(function (v) {
                v = parseFloat(v);
                if (isNaN(v)) {
                    return null;
                }
                return v;
            });
        }
        else if (desc.TypeName == "System.Boolean") {
            val = val.map(function (v) {
                v = v.toLowerCase();
                if (v == 'true') return true;
                if (v == 'false') return false;
                return null;
            });
        }

        if (desc.IsList) {
            return val;
        }
        return val[0];
    }

    function getComplexObjectValue(desc) {
        if (desc.Properties) {
            var obj = {};
            desc.Properties.forEach(function (p) {
                var nullInput = document.querySelector("input[name=prop-excl-" + p.id + "]");
                if (!(nullInput && nullInput.checked)) {
                    obj[p.Name] = getValue(p);
                    
                }


            });

            return obj;
        }
        return null;
    }

    function getComplexObjectListValue(desc) {
        if (desc.Items) {
            var list = desc.Items.map(function(i) {
                return getComplexObjectValue(i);

            });
            return list;
        }
        return [];
    }

    function getDictionaryValue(desc) {
        if (desc.Items && desc.Items.length) {
            var obj = {};
            desc.Items.forEach(function(i) {
                obj[getSimpleValue(i.Key)] = getSimpleValue(i.Value);
            });

            return obj;
        }
        return null;
    }


    function getValue(desc) {
        var nullInput = document.querySelector("input[name=prop-null-" + desc.id + "]");
        if (nullInput && nullInput.checked) {
            return null;
        }

        if (desc.IsDictionary) {
            return getDictionaryValue(desc);
        } else if (desc.IsSimple) {
                return getSimpleValue(desc);
        }else if (desc.IsList) {
            return getComplexObjectListValue(desc);

        } else {
            return getComplexObjectValue(desc);
        }
    }

    var storage = {
        set: function(name, value) {
            if (localStorage) {
                localStorage.setItem(apiDescription.Name + "::" + name, JSON.stringify(value));
            }
        },
        get: function (name) {
            var item = null;
            if (localStorage) {
                item = localStorage.getItem(apiDescription.Name + "::" + name);
                if (item) {
                    try {
                        item = JSON.parse(item);
                    } catch (e) {
                        
                    }
                }
            }
            return item;
        },
        names: {
            headers:"headers"
        }
    }
    

    function dateAsStringOrSelf(d) {
        if (d && d.toISOString) {
            try {
                return d.toISOString();
            } catch (e) {
                return "";
            }
        }
        return d;
    }


    function buildUrl() {
        var url = apiDescription.Route;

        apiDescription.RouteParameters.forEach(function (p) {
            var v = getValue(p);
            
            url = url.replace("{" + p.Name + "}", v);
        });

        apiDescription.QueryParameters.forEach(function(p,i) {
            if (i == 0) {
                url = url + "?";
            } else {
                url = url + '&';
            }
            var v = dateAsStringOrSelf( getValue(p));
            //v = v || "";
            if (p.IsList) {
                v = v.filter(isValue);
                v.forEach(function (vi, vii) {
                    vi = dateAsStringOrSelf(vi);
                    //vi = vi || "";
                    if (vii > 0) {
                        url = url + "&";
                    }

                    url = url + p.Name + "[" + vii + "]=" + encodeURIComponent(vi);
                });
            } else {
                if (isValue(v)) {
                    url = url + p.Name + "=" + encodeURIComponent(v);
                }
            }

        });


        return cleanUrl( getSiteRoot() + url);
    }
    
    ///looks to see if a thing is an actual value and not just a truey value
    function isValue(vv) {
        if (vv === 0 || vv === false) {  //these are falsey values that are a value
            return true;
        }

        //everything else is a value if it's truey and not a value if it's falsey
        return (!!vv);
    }

    function cleanUrl(url) {

        while (url.indexOf('&&') >= 0) {
            url = url.replace('&&', '&');
        }

        if (url.indexOf('?&') >= 0) {
            url = url.replace('?&', '?');
        }

        var idx = url.lastIndexOf("&");
        if (idx == url.length - 1) {
            url = url.substring(0, idx);
        }

        idx = url.indexOf("?");
        if (idx == url.length - 1) {
            url = url.substring(0, idx);
        }
        return url;
    }

    function setHeaders(xhr) {
        var headers = [];
        apiDescription.Headers.forEach(function (h) {
            h = {
                Name : getSimpleValue(h.Name),
                Value:getSimpleValue(h.Value)
            }
            headers.push(h);
            xhr.setRequestHeader(h.Name,h.Value );
        });

        storage.set(storage.names.headers, headers);

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json");
    }

    function getBody() {
        if (apiDescription.BodyParameter) {
            var b = getValue(apiDescription.BodyParameter);;
            return JSON.stringify(b);
        }
        return "";
    }




    //commands that respond to various buttons that could be clicked by the user.  functions correspond to data-cmd attribute values in links and buttons in the templates.  
    var commands = {
        sendRequest: function() {
            dom.text('response-data', '', true);
            progresser.start();
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("load", function () {
                var formattedResponse = xhr.status + " - " + xhr.statusText + "\n";
                formattedResponse += xhr.getAllResponseHeaders() + "\n";

                try {
                    var data = JSON.parse(xhr.response);
                    formattedResponse += JSON.stringify(data, null, 5);
                } catch (e) {
                    formattedResponse += xhr.response;
                }


                dom.text('response-data', formattedResponse, true);
                window.scroll(0, document.body.scrollHeight);

                progresser.stop();
            });
            xhr.open(apiDescription.Method, buildUrl());

            setHeaders(xhr);

            xhr.send(getBody());

        },

        headerAdd: function () {
            var container = dom.gid('headers-container');

            var item = makeHeaderItem();

            var html = templates['header-item'](item);
            dom.html(html, container);
        },

        headerRemove:function(el) {
            var id = el.getAttribute("data-id");
            var elem = dom.gid('header-' + id);

            elem.parentNode.removeChild(elem);

            apiDescription.Headers.every(function(h, i) {
                if (h.id == id) {
                    apiDescription.Headers.splice(i, 1);
                    return false;
                }
                return true;
            });
        },

        inputListRemove:function(el) {
            var id = el.getAttribute("data-id");
            var container = dom.gid('input-list-' + id);
            var inputs = dom.childs(container, 'span');
            if (inputs.length) {
                container.removeChild(inputs[inputs.length - 1]);
            }
        },

        inputListAdd:function(el) {
            var id = el.getAttribute("data-id");
            var desc = descCache[id];
            var html = templates['simple-input'](desc);

            var container = dom.gid('input-list-' + id);

            dom.html(html, container);

        },

        complexListAdd:function(el) {

            var id = el.getAttribute("data-id");

            var container = dom.gid('list-container-' + id);
            var desc = descCache[id];
            var item = getComplexType(desc);
            item = addComplexItemToList(desc, item);
            var html = templates['complex-object-list-item'](item);
            dom.html(html, container);

        },

        complexListRemove: function (el) {
            var id = el.getAttribute("data-id");

            var container = dom.gid('list-container-' + id);
            var desc = descCache[id];

            var items = dom.childs(container, 'span');

            if (items.length != desc.Items.length) {
                throw "complex list UI and model don't match: " + id;
            }

            if (items.length) {
                container.removeChild(items.pop());
                desc.Items.pop();
            }

        },

        dictionaryRemove:function(el) {
            var id = el.getAttribute("data-id");
            var desc = descCache[id];
            var container = dom.gid('dictionary-' + id);
            var items = dom.childs(container, 'div');

            if (items.length != desc.Items.length) {
                throw "complex list UI and model don't match: " + id;
            }

            if (items.length) {
                container.removeChild(items.pop());
                desc.Items.pop();
            }

        },

        dictionaryAdd: function (el) {
            var id = el.getAttribute("data-id");
            var desc = descCache[id];
            var item = setUpDictionary(desc);
            var container = dom.gid('dictionary-' + id);
            var html = templates['dictionary-item'](item);
            dom.html(html, container);

        },

        complexObjectSetValue: function (el) {

            var id = el.getAttribute("data-id");


            var prop = descCache[id];

            setUpProperties(prop);


            var toReplace = dom.gid('property-' + id);
            toReplace.removeAttribute('id');

            var container = toReplace.parentNode;

            var html = templates['named-property'](prop);
            dom.html(html, container, toReplace);
            container.removeChild(toReplace);


        }
    }

    //dom manipulation utilities
    var dom = {
        //get an element by ID
        gid: function(id) {
            return document.getElementById(id);
        },

        //add text to an element or replace the contents of the node with text
        text: function (el, text, repl) {
            el = typeof (el) == "string" ? this.gid(el) : el;

            if (repl) {
                while (el.lastChild) {
                    el.removeChild(el.lastChild);
                }
            }

            el.appendChild(document.createTextNode(text));
        },

        //create an element
        el: function(nodeType, attrs, parent) {
            var el = document.createElement(nodeType);
            if (attrs) {
                for (var attr in attrs) {
                    el.setAttribute(attr, attrs[attr]);
                }
            }
            if (parent) {
                parent.appendChild(el);
            }
            return el;
        },

        //append html to an element or insert it before
        html:function(html, parent, insertPoint) {
            var d = this.el('div');
            d.innerHTML = html;
            while (d.firstChild) {
                if (insertPoint) {
                    parent.insertBefore(d.firstChild, insertPoint);
                } else {
                    parent.appendChild(d.firstChild);
                }
            }
        },


        //get the child nodes of a node or optionally by a specific node name
        childs: function (node, nodeName) {

            var childs = [].filter.call(node.childNodes, function (n) {
                return !nodeName || n.nodeName.toLowerCase() == nodeName.toLowerCase();
            });

            return childs;
        }
    }

    var progresser = {
        el: null,
        btn:null,
        token: null,

        progress: function () {
            dom.text(this.el, " >");
        },
        start: function () {

            if (!this.el) {
                this.el = dom.gid('progress');
            }
            if (!this.btn) {
                this.btn = dom.gid('sendRequestBtn');
            }

            this.btn.disabled = true;

            if (this.token == null) {
                this.progress();
                this.token = window.setInterval(this.progress.bind(this), 500);
            }

        },

        stop: function () {
            window.clearInterval(this.token);
            this.token = null;
            dom.text(this.el, "", true);
            this.btn.disabled = false;

        }
    }


    //ajax to get the template html
    function getTemplate(callback) {

        var xhr = new XMLHttpRequest();

        xhr.onload = function () {

            if (xhr.status == 200) {

                var templates = document.createElement("DIV");
                templates.innerHTML = xhr.response;
                document.body.appendChild(templates);
                callback();

            } else {
                console.log("AJAX ERROR getTemplate");
                console.dir(xhr);
            }

        }

        xhr.open("GET", getSiteRoot() + "Content/WebApiTestClient.views.html");
        xhr.send();
    }


    //ajax to get a json object form the server
    function getJson(url, callback) {

        var xhr = new XMLHttpRequest();

        xhr.onload = function () {

            if (xhr.status == 200) {
                var data = JSON.parse(xhr.response);

                callback(data);
            } else {
                console.log("AJAX ERROR getJson");
                console.dir(xhr);
            }

        }

        xhr.open("GET", url);
        xhr.send();
    }





})();