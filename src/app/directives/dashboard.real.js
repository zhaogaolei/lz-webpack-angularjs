/**
 * Created by chengshuailiu on 17/4/12.
 */
import temp from "../templates/dashboard-real.html"

/*
 *
 * chart-data="chat1.data" chart-labels="chat1.labels"
 chart-options="chat1Options"
 chart-dataset-override="chat1.datasetOverride"
 chart-series="chat1.series">
 * */

angular.module('directives')
    .directive('dashboardReal', [function () {
        return {
            restrict: 'E',
            scope: {
                chatName: "@",
                chatTip: "@",
                chatNumber: "=",
                chatPointRed: "=",
                chatData: "=",
                chatLabels: "=",
                chartSeries: "=",
            },
            template: temp,
            link: function ($scope, element, attrs) {
                $scope.$watch('chatData', function (newVal, oldVal) {

                    if (newVal == {} || !newVal || !newVal.data) {
                        $scope.chat.data = [[0], [0]];
                    }
                    else {


                        //当前周期和上一周期时间交换
                        var mydata = [];
                        mydata.push(newVal.data[1]);
                        mydata.push(newVal.data[0]);
                        $scope.chat.data = mydata;
                    }

                });

                $scope.$watch('chatLabels', function (newVal, oldVal) {
                   if($scope.chatLabels){
                       $scope.chat.labels=$scope.chatLabels;
                   }

                });   

                $scope.chat = {
                    labels: [],
                    series: ["当前周期", "上一周期"],
                    data: $scope.chatData,
                    datasetOverride: [
                        {
                            fill: true,
                            lineTension: 0,
                            pointBackgroundColor: "transparent",
                            pointBorderColor: "transparent",
                            pointHoverBorderColor: "transparent",
                            pointHoverBackgroundColor: "transparent",
                        },
                        {
                            fill: false,
                            lineTension: 0,
                            pointBackgroundColor: "transparent",
                            pointBorderColor: "transparent",
                            pointHoverBorderColor: "transparent",
                            pointHoverBackgroundColor: "transparent",
                        }
                    ]
                };
                $scope.chatOptions = {
                    legend: {display: true},
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                beginAtZero: true
                            }
                        }],

                        xAxes: [{
                            stacked: true,
                            ticks: {
                                userCallback: (dataLabel, index)=> {
                                    let lb = ["04:00", "08:00", "12:00", "16:00", "20:00", "00:00"];
                                    if (lb.indexOf(dataLabel) != -1) {
                                        return dataLabel
                                    }
                                    if (dataLabel.indexOf("/") != -1) {
                                        return dataLabel;
                                    }


                                }
                            }
                        }]

                    }
                }
                let addLength = (text)=> {
                    if (text.toString().length < 2) {
                        return "0" + text.toString();
                    }
                    else {
                        return text.toString();
                    }
                }

                let getDate = (add)=> {
                    let now = new Date();
                    let str = (now.getMonth() + 1) + "/" + now.getDate();
                    return str;
                }
                let getDateNext = ()=> {
                    let now = new Date(new Date().setDate(new Date().getDate() + 1));
                    let str = (now.getMonth() + 1) + "/" + now.getDate();
                    return str;
                }
                for (let h = 0; h <=24; h++) {
                    //for (let m = 0; m <= 55; m += 5) {
                         var lab = "";
                        if(h==24){
                            lab="00:00";
                            $scope.chat.labels.push(getDateNext());

                        }

                        lab += addLength(h);
                        lab += ":00";
                        //lab += addLength(m);
                        $scope.chat.labels.push(lab);

                    //}
                }
                $scope.chat.labels[0] = getDate();
                //$scope.chat.labels.push(getDateNext());


            }
        };
    }]);