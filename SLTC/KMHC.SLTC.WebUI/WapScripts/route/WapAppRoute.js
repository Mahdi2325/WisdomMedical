angular.module('sltcWapApp')
.config([
        '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

            $urlRouterProvider.when("/", "/wap/ResidentList").otherwise('/');

            $stateProvider.state('ResidentList', { url: '/wap/ResidentList', templateUrl: '/WapScripts/Views/ResidentList.html', controller: 'residentListCtrl' });
            $stateProvider.state('UserBaseInfo', { url: '/wap/UserBaseInfo/:id', templateUrl: '/WapScripts/Views/UserBaseInfo.html', controller: 'UserBaseInfoCtrl' });//基本信息
            $locationProvider.html5Mode(true);
        }
]);