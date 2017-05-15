/*
        创建人: 李林玉
        创建日期:2016-05-19
        说明: 用户信息
*/
angular.module("sltcApp").
controller("HomePosCtrl", ['$scope','$stateParams','resourceFactory', function ($scope, $stateParams,resourceFactory) {

    var personRes = resourceFactory.getResource("personRes");
    var myChart = echarts.init(document.getElementById('personLocation'));
    $.getScript("http://api.map.baidu.com/getscript?v=2.0&ak=ZUONbpqGBsYGXNIYHicvbAbM&services=&t=20160708193109", function () {
        $.getScript("/Content/echarts/extension/bmap.min.js", function () {
            myChart.showLoading();
            var option = {
                animation: true,
                tooltip: {
                    trigger: 'item',
                    formatter: function (param) {
                        return param.name + "(" + param.value[2] + ")</br>" + param.value[3];
                    }
                },
                bmap: {
                    //center: firstPoint,
                    zoom: 10,
                    roam: true,
                },
                series: [
                    {
                        name: '会员所在位置',
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        symbolSize: function (val) {
                            return 30;
                        },
                        pointSize: 5,
                        blurSize: 6,
                        symbol: "image://Images/Report/home/home_position.png"
                    }
                ]
            };

            myChart.setOption(option);
            LoadData();
        });
    });

    function LoadData() {
        if (myChart == undefined) {
            return;
        }
        var option = myChart.getOption();
        if (option != undefined) {
            var res = [];
            var points = [];
            personRes.get({ id: $stateParams.id },function (data) {
                myChart.hideLoading();
                if (data.Data) {
                    var point = new BMap.Point(data.Data.Lng, data.Data.Lat);
                    points.push(point);

                    res.push({
                        name: data.Data.Name,
                        value: [data.Data.Lng, data.Data.Lat, data.Data.Phone, data.Data.Address]
                    });
                } 

                option.series[0].data = res;
                myChart.setOption(option);
                myChart.getModel().getComponent('bmap').getBMap().setViewport(points);
            });
        }
    }
}])
;
