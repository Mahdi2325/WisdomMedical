angular.module("sltcApp")
.controller("demo1Ctrl", ['$scope', '$state', 'commWordRes', 'utility', function ($scope, $state, commWordRes, utility) {
    $scope.residentInfo = {};
    $scope.FeeNo = $state.params.FeeNo;
    $scope.Data = { Test: "001,002,008", Language: '台语,國語', Plan: '123' };
    $scope.IsInvalid = false;
    $scope.jsonData = [{ "ItemCode": "002", "ItemType": "DC01.002", "ItemName": "手输语" },{ "ItemCode": "002", "ItemType": "DC01.002", "ItemName": "國語" }, { "ItemCode": "002", "ItemType": "DC01.002", "ItemName": "台语" }, { "ItemCode": "002", "ItemType": "DC01.002", "ItemName": "？週後，傷口能縮小至      ×     cm" }, { "ItemCode": "002", "ItemType": "DC01.002", "ItemName": "溝通對飲食的喜好(或許需要使用溝通書寫板)" }, { "ItemCode": "002", "ItemType": "DC01.002", "ItemName": "言語溝通的能力改善，每天由口攝取2-3公升液體和75﹪的食物" }];
    $scope.TestId = "ASS";
    var jsonData = [];
    var cities = 'New York,Los Angeles,Chicago,Houston,Paris,Marseille,Toulouse,Lyon,Bordeaux,Philadelphia,Phoenix,San Antonio,San Diego,Dallas,San Jose,Jacksonville'.split(',');
    for (var i = 0; i < cities.length; i++) jsonData.push({ id: i, name: cities[i], status: '<table class="selecttable"><tr><th>主题 </th><th>项目</th></tr></table>', coolness: Math.floor(Math.random() * 10) + 1 });

    var ms1 = $('#ms1').magicSuggest({
        renderer: function (city) {
            return '<table class="selecttable"><tr><td>' + city.name + ' </td><td>' + city.coolness + '</td></tr></table>';
        },
        groupBy: 'status',
        resultAsString: true,
        maxSelection: 1,
        data: jsonData
    });

    $scope.residentSelected = function (resident) {
        var ret = resident;
    }

    $scope.getErrorMessage = function (error) {
        var errorMsg = '';
        if (angular.isDefined(error)) {
            if (error.required) {
                $.each(error.required, function (n, value) {
                    var name = value.$name;
                    errorMsg += name + '为必填项!\n' 
                });
            }
            else if (error.email) {
                $.each(error.email, function (n, value) {
                    var name = value.$name;
                    errorMsg += name + '验证失败!\n'
                });
            } else if (error.number) {
                $.each(error.number, function (n, value) {
                    var name = value.$name;
                    errorMsg += name + '必须为数字!\n'
                });
            }
            return errorMsg;
        }
    };
    $scope.Save = function (invalid) {
     
        if (invalid) {
            //show error msg
            $scope.IsInvalid = true;
        } else {
            //submit your request
        }
    
    }

    $scope.alert = function (msg) {
        utility.msgwarning(msg);
    }

}])