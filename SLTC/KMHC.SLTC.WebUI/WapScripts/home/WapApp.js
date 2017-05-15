var homeApp = angular.module('sltcWapApp', [
        'ui.router',
        'ngResource',
        'ngCookies',
        'Utility',
        'extentDirective',
        'extentFilter',
        'extentComponent',
        'extentService',
        'ngAnimate'
])
     .constant("resourceBase", "http://120.25.225.5:5500/")//120.25.225.5:6500
    .factory("getRequestUrl", ['resourceBase', function (resourceBase) { //设置请求路径
        var getUrl = function (url) {
            return resourceBase + url;
        }
        return getUrl;
    }])
    .factory("commonRes", ['$resource', function ($resource) {
        return $resource("api/Common/:id", { id: "@id" });
    }])
 .factory("adminHandoversRes", ['$resource', function ($resource) {
     return $resource('api/AssignTask/:id', { id: '@id' });
 }])
  .factory("roleModuleRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {
      return $resource(getRequestUrl("module/:id"), { id: "@id" });
  }])
    .factory("codeFileRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) {    // 字典表管理
        return $resource(getRequestUrl("dictionary/:id"), { id: "@id" });
    }])
    .factory("personRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //老人基本信息
        return $resource(getRequestUrl("persons/:id"), { id: "@id" });
    }])
    .factory("residentRes", ['$resource', 'getRequestUrl', function ($resource, getRequestUrl) { //住民信息
        return $resource(getRequestUrl('resident/:id'), { id: '@id' });
    }])