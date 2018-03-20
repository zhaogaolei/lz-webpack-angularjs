/**
 * Created by leizhao on 17/9/27.
 */
AbtRoiController.$inject = ['$scope', 'AbtRoiService', '$timeout', "$q", "$rootScope", "$filter"];

function AbtRoiController($scope, AbtRoiService, $timeout, $q, $rootScope, $filter) {
    let formatNum = $filter("number");
    $scope.viewModel = {
        selectLoading: true,
        selectedRoiDic: 'reinvested_60d_roi',  //默认筛选60天内结果
        kLoading: false,
        qLoading: false
    };
    //默认 1页 10条记录
    $scope.table = {
        pageNo: 1,
        pageSize: 10
    };

    let getRoiDic = () => {
        return AbtRoiService.getRefferalRoiDic()
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.viewModel.selectLoading = false;
                    $scope.refferalListDic = data.result;
                }
            });
    };
    /**
     * roi 分布图
     * */
    let roiDistribution = () => {
        $scope.viewModel.kLoading = true;
        let postData = {dataType: $scope.viewModel.selectedRoiDic};
        AbtRoiService.getRefferalRoiK(postData)
            .then((data) => {
                if (data && data.code == 200) {
                    let endPoint = data.result.endPoint;
                    let startPoint = data.result.startPoint;
                    let kData = data.result.data;
                    let markLineOpt = {
                        animation: true,
                        label: {
                            normal: {
                                formatter: 'ROI基准',
                                textStyle: {
                                    align: 'right'
                                }
                            }
                        },
                        lineStyle: {
                            normal: {
                                type: 'solid',
                                color: '#1C1C1C',
                                opacity: 0.5
                            }
                        },
                        tooltip: {
                            formatter: 'ROI基准'
                        },
                        data: [[{
                            coord: startPoint,//[0, 0], k线起点
                            symbol: 'none'
                        }, {
                            coord: endPoint,//[20, 13], k线终点
                            symbol: 'none'
                        }]]
                    };
                    let option = {
                        title: {
                            text: 'ROI K线图',
                            x: 'left'
                        },
                        // grid: [
                        //     {x: '7%', y: '7%', width: 'auto', height: 'auto'}
                        // ],
                        tooltip: {
                            formatter:function (params) {
                                if (params.value.length > 1) {
                                    return params.seriesName + ' :<br/>'
                                        + '成本：' + formatNum(params.value[0], 2) + '元， '
                                        + '产出：' + formatNum(params.value[1], 2) + '元 ';
                                }
                                else {
                                    return '{a}: ({c})'
                                }
                            },//'{a}: ({c})',
                            axisPointer: {
                                show: true,
                                type: 'cross',
                                lineStyle: {
                                    type: 'dashed',
                                    width: 1
                                }
                            }
                        },
                        xAxis: [
                            {
                                gridIndex: 0,
                                // min: 'dataMin',//0,
                                max: 'dataMax',//20,
                                type: 'value',
                                name: '成本',
                                nameLocation: 'end',
                                nameGap: 30,
                                nameTextStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bold'
                                },
                                scale: false,
                                axisLabel: {
                                    formatter: '{value} 元'
                                },
                                splitLine: {
                                    show: false
                                }
                            }
                        ],
                        yAxis: [
                            {
                                gridIndex: 0,
                                // min: 'dataMin',//0,
                                max: 'dataMax',//15,
                                type: 'value',
                                name: '产出',
                                nameLocation: 'end',
                                nameGap: 15,
                                nameTextStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bold'
                                },
                                scale: false,
                                axisLabel: {
                                    formatter: '{value} 元'
                                },
                                splitLine: {
                                    show: false
                                }
                            }
                        ],
                        color: ['#4682B4'],
                        series: [
                            {
                                type: 'scatter',
                                markLine: markLineOpt
                            },
                            {
                                name: 'ROI',
                                type: 'scatter',
                                data: kData
                            }
                        ]
                    };
                    $scope.roiDistributionOption = option;
                    $scope.viewModel.kLoading = false;
                }
            });
    };

    /**
     * roi 象限图
     * */
    let roiQuadrant = () => {
        $scope.viewModel.qLoading = true;
        let postData = {dataType: $scope.viewModel.selectedRoiDic};
        AbtRoiService.getRefferalRoiQ(postData)
            .then((data) => {
                if (data && data.code == 200) {
                    let pointList = data.result.data;
                    let refferalNames = data.result.refferals;
                    let outAvg = data.result.outAvg;
                    let roiAvg = data.result.roiAvg;
                    let seriesArray = [
                        {
                            name: 'ROI',
                            type: 'scatter',
                            markLine: {
                                lineStyle: {
                                    normal: {
                                        type: 'dotted',
                                        color: '#000000',
                                        opacity: 0.5
                                    }
                                },
                                data: [
                                    {type: 'average', name: 'ROI基准', xAxis: roiAvg},
                                    {type: 'average', name: '产出平均值', yAxis: outAvg}
                                ]
                            }
                        }
                    ];
                    angular.forEach(pointList, (data) => {
                        let series = {
                            name: data.name,
                            type: 'scatter',
                            data: [data.list]
                        };
                        seriesArray.push(series);
                    });
                    let option = {
                        // color:["#0000cd","#cd0000","#37a884","#ee00ee","#8e388e"],
                        title: {
                            text: 'ROI=产出/成本',
                            // subtext: '抽样调查来自: 点融'
                            x: 'left'
                        },
                        // grid: {
                        //     left: '3%',
                        //     right: '7%',
                        //     bottom: '3%',
                        //     containLabel: true
                        // },
                        tooltip: {
                            // trigger: 'axis',
                            showDelay: 0,
                            formatter: function (params) {
                                if (params.value.length > 1) {
                                    return params.seriesName + ' :<br/>'
                                        + 'ROI：' + formatNum(params.value[0], 2) + '， '
                                        + '产出：' + formatNum(params.value[1], 2) + '元 ';
                                }
                                else {
                                    return params.seriesName + ' :<br/>'
                                        + params.name + ' : '
                                        + formatNum(params.value, 2);
                                }
                            },
                            axisPointer: {
                                show: true,
                                type: 'cross',
                                lineStyle: {
                                    type: 'dashed',
                                    width: 1
                                }
                            }
                        },
                        legend: {
                            type: 'scroll',
                            width: '60%',
                            orient: 'horizontal',//默认水平
                            data: refferalNames,//['渠道1', '渠道2'],
                            left: 'center',
                            icon: 'roundRect'  //设置图标的形状
                        },
                        xAxis: [
                            {
                                type: 'value',
                                name: 'ROI',
                                nameLocation: 'end',
                                nameGap: 30,
                                nameTextStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bold'
                                },
                                scale: false,
                                axisLabel: {
                                    formatter: '{value}'
                                },
                                splitLine: {
                                    show: false
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                name: '产出',
                                nameLocation: 'end',
                                nameGap: 15,
                                nameTextStyle: {
                                    fontSize: 12,
                                    fontWeight: 'bold'
                                },
                                scale: false,
                                axisLabel: {
                                    formatter: '{value} 元'
                                },
                                splitLine: {
                                    show: false
                                }
                            }
                        ],
                        series: seriesArray
                    };
                    $scope.roiQuadrantOption = option;
                    $scope.viewModel.qLoading = false;
                }
            });
    };

    /**
     * table
     */
    let getRefferalRoiList = (no, size, reInit, column, sort) => {
        let arg = `?pageNo=${no}&pageSize=${size}&dataType=${$scope.viewModel.selectedRoiDic}`;
        if (column && sort) {
            arg += `&sort=${column}_${sort}`;
        }
        AbtRoiService.getRefferalRoiList(arg)
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.tableData = data.result;
                    if (reInit) {
                        $timeout(function () {
                            $rootScope.$broadcast('modelInitialized', this);
                        }, 500);
                    }
                }
            });
    };
    /*reload pagination data*/
    $scope.$on("dr.refferalRoiPagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getRefferalRoiList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getRefferalRoiList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getRefferalRoiList($scope.table.pageNo, $scope.table.pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getRefferalRoiList($scope.table.pageNo, $scope.table.pageSize, true, null, null);
        }
    });

    $scope.initAbtPage = () => {
        $q.all([getRoiDic()]).then(() => {
            roiDistribution();
            roiQuadrant();
            getRefferalRoiList($scope.table.pageNo, $scope.table.pageSize, true);
        });
    };
    $scope.selectChange = () => {
        roiDistribution();
        roiQuadrant();
        getRefferalRoiList($scope.table.pageNo, $scope.table.pageSize, true);
    };
}

angular.module('controller').controller("AbtRoiController", AbtRoiController);