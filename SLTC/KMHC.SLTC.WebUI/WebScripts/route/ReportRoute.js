angular.module('sltcApp')
.config([
        '$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

            var defaultPage = window.sessionStorage["DefaultPage"];
            if (defaultPage) {
                $urlRouterProvider.when("/", defaultPage).otherwise('/');//TO-DO
            }

            //报表管理
            $stateProvider.state('HomeMap', { url: '/Report/HomeMap/:id', templateUrl: '/WebScripts/Views/Report/HomeMap.html', controller: 'homeMapCtrl' });
            $stateProvider.state('HomeStatistic', { url: '/Report/HomeStatistic/:id', templateUrl: '/WebScripts/Views/Report/HomeStatistic.html', controller: 'homeStatisticCtrl' });
            $stateProvider.state('AreaStatistic', { url: '/Report/AreaStatistic/:id', templateUrl: '/WebScripts/Views/Report/AreaStatistic.html' });
            $stateProvider.state('GeneralStatistic', { url: '/Report/GeneralStatistic/:id', templateUrl: '/WebScripts/Views/Report/GeneralStatistic.html' });
            $stateProvider.state('MemberStatistic', { url: '/Report/MemberStatistic/:id', templateUrl: '/WebScripts/Views/Report/MemberStatistic.html', controller: 'memberStatisticCtrl' });
            $stateProvider.state('CustomerStatistic1', { url: '/Report/CustomerStatistic1/:id', templateUrl: '/WebScripts/Views/Report/CustomerStatistic1.html', controller: 'customerStatistic1Ctrl' });
            $stateProvider.state('CareStatistic', { url: '/Report/CareStatistic/:id', templateUrl: '/WebScripts/Views/Report/CareStatistic.html', controller: 'careStatisticCtrl' });
            $stateProvider.state('StationStatistic', { url: '/Report/StationStatistic/:id', templateUrl: '/WebScripts/Views/Report/StationStatistic.html', controller: 'stationStatisticCtrl' });
            $stateProvider.state('WorksheetStatistic', { url: '/Report/WorksheetStatistic/:id', templateUrl: '/WebScripts/Views/Report/WorksheetStatistic.html', controller: 'worksheetStatisticCtrl' });
            $stateProvider.state('SOS_Statistic', { url: '/Report/SOS_Statistic/:id', templateUrl: '/WebScripts/Views/Report/SOS_Statistic.html', controller: 'SOS_StatisticCtrl' });
            $stateProvider.state('HypertensionStatistic', { url: '/Report/HypertensionStatistic/:id', templateUrl: '/WebScripts/Views/Report/HypertensionStatistic.html' });
            $stateProvider.state('FamilyDoctorStatistic', { url: '/Report/FamilyDoctorStatistic/:id', templateUrl: '/WebScripts/Views/Report/FamilyDoctorStatistic.html', controller: 'familyDoctorStatisticCtrl' });
            $stateProvider.state('ChinesemedicineStatistic', { url: '/Report/ChinesemedicineStatistic/:id', templateUrl: '/WebScripts/Views/Report/ChinesemedicineStatistic.html', controller: 'chinesemedicineStatisticCtrl' });
            $stateProvider.state('ChronicdiseaseStatistic', { url: '/Report/ChronicdiseaseStatistic/:id', templateUrl: '/WebScripts/Views/Report/ChronicdiseaseStatistic.html', controller: 'chronicdiseaseStatisticCtrl' });

            $locationProvider.html5Mode(true);
        }
]).run(['$rootScope', '$state', function ($rootScope, $state) {
    $rootScope.barWidth = 32;
    $rootScope.lineWidth = 8;
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $("#homeMapHeader").css("display", "none");
        $("#orgHomeHeader").css("display", "block");
        var nav = $("#orgHomeHeader ul:eq(0) a");
        if (nav.length > 0) {
            $.each(nav, function (i, v) {
                $(v).removeClass("action");
            });
        }
        switch (toState.name) {
            case "HomeMap":
                $("#homeMapHeader").css("display", "block");
                $("#orgHomeHeader").css("display", "none");
                break;
            case "HomeStatistic":
                $(nav[0]).addClass("action");
                break;
            case "MemberStatistic":
                $(nav[1]).addClass("action");
                break;
            case "CareStatistic":
                $(nav[2]).addClass("action");
                break;
            case "FamilyDoctorStatistic":
                $(nav[3]).addClass("action");
                break;
            case "ChinesemedicineStatistic":
                $(nav[4]).addClass("action");
                break;
            case "ChronicdiseaseStatistic":
                $(nav[5]).addClass("action");
                break;
            default:
                break;
        }
    });

    $rootScope.someFunction = function ($event, swipe) {
        var div = $($event.toElement).closest("div.drop");
        if (div.length > 0) { return; }
        switch ($state.current.name) {
            case "HomeStatistic":
                if (swipe == "left") { $state.go("MemberStatistic"); }
                if (swipe == "right") { $state.go("ChronicdiseaseStatistic"); }
                break;
            case "MemberStatistic":
                if (swipe == "left") { $state.go("CareStatistic"); }
                if (swipe == "right") { $state.go("HomeStatistic"); }
                break;
            case "CareStatistic":
                if (swipe == "left") { $state.go("ChinesemedicineStatistic"); }
                if (swipe == "right") { $state.go("MemberStatistic"); }
                break;
            case "FamilyDoctorStatistic":
                if (swipe == "left") { $state.go("ChinesemedicineStatistic"); }
                if (swipe == "right") { $state.go("CareStatistic"); }
                break;
            case "ChinesemedicineStatistic":
                if (swipe == "left") { $state.go("ChronicdiseaseStatistic"); }
                if (swipe == "right") { $state.go("FamilyDoctorStatistic"); }
                break;
            case "ChronicdiseaseStatistic":
                if (swipe == "left") { $state.go("HomeStatistic"); }
                if (swipe == "right") { $state.go("ChinesemedicineStatistic"); }
                break;
            default:
                break;
        }
    };
}]);