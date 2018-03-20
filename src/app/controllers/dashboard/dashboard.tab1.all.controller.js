/**
 * Created by chengshuailiu on 17/4/10.
 */
DashboardController1All.$inject = ['$scope', 'DashboardService', '$filter', "$q", "toastr","$stateParams","$state"];
const yesterday = new Date().setDate(new Date().getDate() - 1);
function DashboardController1All($scope, DashboardService, $filter, $q, toastr, $stateParams, $state) {
    let dateFilter = $filter('date');
    $scope.config = {
        countup: {duration: 0.2}
    };
    $scope.btnName1 = "<i class='icon-icon-filter-outline'></i> 渠道类型 ";
    $scope.btnName2 = "<i class='icon-icon-filter-outline'></i> 选择渠道 ";
    $scope.btnName3 = "<i class='icon-icon-filter-category'></i> 漏斗类型 ";
    $scope.joinChat = "+";
    $scope.btnClass = "btn btnSelect dropdown-toggle";
    $scope.btnClass2 = "btn btnSelect";
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "请选择"
    };
    $scope.localLang2 = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: $scope.btnName2
    };

    $scope.viewModel = {
        //概览数据相关Model
        overview: {
            selectDay: 1,
            text: "相比前七天平均",
            loading: false
        },
        //概览数据
        overViewData: JSON.parse(localStorage.getItem("myData")) || [],
        channel: {},
        datatype: {},
        channeltype: [],
        chat1: {
            loading: false,
            datatype: [],
            datatypeSelect: [],
            channelType: [],
            channelTypeSelect: [],
            channel: [],
            channelSelect: [],
            startDate: new Date().setDate((new Date()).getDate() - 30),
            endDate: yesterday,
            seachChannel: (first)=> {
                //TODO将chat1中"选择渠道"选项清空
                //$scope.viewModel.chat1.channel=[];

                //TODO将"选择渠道"和"渠道类型"对应起来
                if (first) {
                    return getChannelByType($scope.viewModel.chat1.channelTypeSelect, "chat1", ()=> {
                    });
                }
                var leg = $scope.viewModel.chat1.channelTypeSelect.length;
                if (leg == 1) {
                    return getChannelByType($scope.viewModel.chat1.channelTypeSelect, "chat1");
                }
                else if (leg == 0) {
                    return getChannelByType($scope.viewModel.chat1.channelTypeSelect, "chat1", ()=> $scope.chat1Seach(true, true));

                }
                else {
                    return getChannelByType($scope.viewModel.chat1.channelTypeSelect, "chat1", ()=>$scope.chat1Seach(true, false));
                }

            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            maxTicksLimit: 0,
                        }
                    }]
                }
            }
        },
        chat2: {
            dataShow:true,
            loading: false,
            datatype: [],
            datatypeSelect: [],
            channelType: [],
            channelTypeSelect: [],
            channel: [],
            channelSelect: [],
            startDate: new Date().setDate((new Date()).getDate() - 30),
            endDate: yesterday,
            seachChannel: (first)=> {
                //TODO将"选择渠道"和"渠道类型"对应起来
                if (first) {
                    return getChannelByType($scope.viewModel.chat2.channelTypeSelect, "chat2", ()=> {
                    });
                }
                var leg = $scope.viewModel.chat2.channelTypeSelect.length;
                if (leg == 1) {
                    return getChannelByType($scope.viewModel.chat2.channelTypeSelect, "chat2");
                }
                else if (leg == 0) {
                    return getChannelByType($scope.viewModel.chat2.channelTypeSelect, "chat2", ()=>$scope.chat2Seach(true, true));
                }
                else {
                    //return $scope.chat2Seach(true, false);
                    return getChannelByType($scope.viewModel.chat2.channelTypeSelect, "chat2", ()=>$scope.chat2Seach(true, false));
                }
            },
        },
        chat3: {
            loading: false,
            channel: [],
            channelSelect: [],
            funnelTypeInit: [
                {dataCode: "funnel_type_a", dataName: "常用转换漏斗A", selected: true},
                {dataCode: "funnel_type_b", dataName: "常用转换漏斗B", selected: false},
                {dataCode: "funnel_type_c", dataName: "常用转换漏斗C", selected: false},
                {dataCode: "", dataName: "自定义转化漏斗", selected: false}
            ],
            datatype: [],
            datatypeSelect: ["funnel_type_a"],
            channeltype: [],
            channeltypeSelect: [],
            endDate: yesterday,
            startDate: new Date().setDate((new Date()).getDate() - 30),
            seachChannel: ()=> {
                getChannelByType($scope.viewModel.chat3.channeltypeSelect, "chat3", ()=>$scope.chat3Seach());
            },
        },
        chat4: {
            loading: false,
            startDate: new Date().setDate((new Date()).getDate() - 30),
            endDate: yesterday,
            datatype: [],
            datatypeSelect: [],
            title: "新注册",
            show: true,
        }
    };

    $scope.getNowViewDataText = function (data) {
        var nowDate = new Date();
        let yesterday = nowDate.setDate(nowDate.getDate() - 1);
        if ($scope.viewModel.overview.selectDay == 1) {
            return dateFilter(yesterday, "yyyy/MM/dd");
        }
        else {
            var lastDate = new Date().setDate(new Date().getDate() - $scope.viewModel.overview.selectDay);
            return dateFilter(lastDate, "yyyy/MM/dd") + "-" + dateFilter(yesterday, "yyyy/MM/dd");
        }
    };


    $scope.changeSelectDay = function (day) {
        $scope.viewModel.overview.selectDay = day;
        if (day == 1) {
            $scope.viewModel.overview.text = "相比前7天平均"
        }
        if (day == 7) {
            $scope.viewModel.overview.text = "相比前7天"
        }
        if (day == 30) {
            $scope.viewModel.overview.text = "相比前30天"
        }
        asyncGetViewData();
    };

    /*
     * 概要数据获取
     * */
    let asyncGetViewData = function () {
        $scope.viewModel.overview.loading = true;
        return DashboardService.getOverViewData($scope.viewModel.overview.selectDay, $scope.bizType, $scope.appType).then((data)=> {
            $scope.viewModel.overViewData = data;
            localStorage.setItem("myData", JSON.stringify(data));
            $scope.viewModel.overview.loading = false;
        });
    };
    //borrow和lender下, 渠道对比/渠道趋势 ChatType默认设置"新注册"
    let initChatType = function (inputArr, data_type) {
        var result = [];
        angular.forEach(inputArr, (item)=> {
            item.selected = false;
            if (item.dataCode == data_type) {
                item.selected = true;
                result.push(item);
            }
        });
        return result;
    }
    //获取ChatType
    let getChatType = function () {
        let result = [];
        if ($scope.borrowFlag == true) {
            //渠道对比
            result.push(DashboardService.getChatTypeDataBorrow().then((data)=> {
                $scope.viewModel.chat1.datatype = angular.copy(data);
                $scope.viewModel.chat1.datatypeSelect = initChatType($scope.viewModel.chat1.datatype, "data_type_borrow_102");
            }));

            //渠道趋势
            result.push(DashboardService.getChatTypeDataBorrow().then((data)=> {
                $scope.viewModel.chat2.datatype = angular.copy(data);
                $scope.viewModel.chat2.datatypeSelect = initChatType($scope.viewModel.chat2.datatype, "data_type_borrow_102");
            }));
        } else {
            //渠道对比
            result.push(DashboardService.getChatTypeData("refferal_compare").then((data)=> {
                $scope.viewModel.chat1.datatype = angular.copy(data);
                $scope.viewModel.chat1.datatypeSelect = initChatType($scope.viewModel.chat1.datatype, "data_type_100");
            }));

            //渠道趋势
            result.push(DashboardService.getChatTypeData("refferal_trend").then((data)=> {
                $scope.viewModel.chat2.datatype = angular.copy(data);
                $scope.viewModel.chat2.datatypeSelect = initChatType($scope.viewModel.chat2.datatype, "data_type_100");
            }));
        }

        //渠道转化率
        result.push(DashboardService.getFunnelTypeData($scope.bizType).then((data)=> {
            $scope.viewModel.chat3.datatype = angular.copy(data);
            if ($scope.borrowFlag == true) {
                $scope.viewModel.chat3.funnelTypeInit = [
                    {dataCode: "", dataName: "自定义转化漏斗", selected: true}
                ];
                let funnelTypes = [];
                angular.forEach($scope.viewModel.chat3.datatype, (data)=> {
                    data.selected = true;
                    funnelTypes.push(data.dataCode);

                });
                $scope.viewModel.chat3.datatypeSelect = funnelTypes;
                $scope.chat3Seach();
            } else {
                $scope.viewModel.chat3.funnelTypeInit = [
                    {dataCode: "funnel_type_a", dataName: "常用转换漏斗A", selected: true},
                    {dataCode: "funnel_type_b", dataName: "常用转换漏斗B", selected: false},
                    {dataCode: "funnel_type_c", dataName: "常用转换漏斗C", selected: false},
                    {dataCode: "", dataName: "自定义转化漏斗", selected: false}
                ];
                $scope.showMultipleFunnelType = false;
                $scope.funnelTypeClick($scope.viewModel.chat3.funnelTypeInit[0], 'single');
            }
        }));

        //排行榜
        result.push(DashboardService.getChatTypeData("refferal_rank").then((data)=> {
            $scope.viewModel.chat4.datatype = angular.copy(removeActive(data,"data_type_116"));
        }));
        return $q.all(result);
    };

    //过滤掉某一类下拉框
    let removeActive = function (inputArr, data_type) {
        var result = [];
        angular.forEach(inputArr, (item) => {
            if (item.dataCode != data_type) {
            result.push(item);
        }
    });
        return result;
    }
    let getChannelType = function () {
        return DashboardService.getChannelTypeData().then((data)=> {
            $scope.viewModel.chat1.channeltype = angular.copy(data);
            $scope.viewModel.chat2.channeltype = angular.copy(data);
            $scope.viewModel.chat3.channeltype = angular.copy(data);
            // if ($scope.viewModel.chat3.channeltype.length > 0) {
            //     $scope.viewModel.chat3.channeltype[0].selected = true;
            // }
        });

    };
    let getChannelByType = function (inputScope, outPut, seach = null) {
        let typeData = {
            "dataType": getPropList(inputScope, "dataCode"), //渠道类型
            "businessType": $scope.bizType,
            "appType": $scope.appType,
        };

        return DashboardService.getChannelByType(typeData).then((data)=> {
            if (data.length == 0) {
                toastr.warning("该渠道类型下面没有渠道!", "Warning");
            }
            $scope.viewModel[outPut].channel = data;

            let channelSelectCopy = angular.copy($scope.viewModel[outPut].channelSelect);
            $scope.viewModel[outPut].channelSelect = [];
            angular.forEach(channelSelectCopy, (item1)=> {
                angular.forEach($scope.viewModel[outPut].channel, (item2)=> {
                    if($scope.viewModel[outPut].channelTypeSelect.length>1){
                        item2.selected = false;
                    }else if (item1.selected == true && item1.id == item2.id){
                        item2.selected = true;
                        $scope.viewModel[outPut].channelSelect.push(item2);
                    }
                });
            });
            if (outPut != "chat3") {
                // $scope.viewModel[outPut].channelSelect = data;
            }
            if (!seach) {
                $scope[outPut + "Seach"]();
            }
            else {
                seach();
            }

        });

    };
    let getAllChannel = function () {
        let p = {
            "dataType": [],
            "businessType": $scope.bizType,
            "appType": $scope.appType,
        };
        return DashboardService.getChannelByType(p).then((data)=> {
            //return DashboardService.getAllChannel().then((data)=> {
            // angular.forEach(data, (item)=> {
            //     item.selected = true;
            // });
            $scope.viewModel.chat1.channel = angular.copy(data);
            $scope.viewModel.chat2.channel = angular.copy(data);
            $scope.viewModel.chat3.channel = angular.copy(data);
        });
    };

    //私有方法
    let getPropList = function (arr, prop) {
        let result1 = [];
        angular.forEach(arr, (item)=> {
            result1.push(item[prop]);
        });
        return result1;
    };

    $scope.chat1Seach = function (byType = false, first = false) {
        $scope.viewModel.chat1.loading = true;
        //默认新注册
        let dataTypes = getPropList($scope.viewModel.chat1.datatypeSelect, "dataCode");
        let p = {
            "dataType": dataTypes,
            "startDate": dateFilter($scope.viewModel.chat1.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.chat1.endDate, 'yyyy-MM-dd'),
            "refferalIds": getPropList($scope.viewModel.chat1.channelSelect, "id"), //渠道-output
            "showWay": byType ? "refferal_type" : "refferal",
            "refferalTypes": getPropList($scope.viewModel.chat1.channelTypeSelect, "dataCode"),//渠道类型-output
            "businessType": $scope.bizType,
            "appType": $scope.appType,
        };
        if (p.refferalIds.length == 0 && p.refferalTypes.length == 1) {
            p.showWay = "refferal_type";
        }
        else if (p.refferalIds.length > 0 && p.refferalTypes.length != 1) {
            p.showWay = "refferal";
        }
        else if (byType) {//通过渠道类型
            p.refferalIds = [];
        }
        else {//通过渠道
            p.refferalTypes = [];
        }
        if (p.refferalIds.length == 0 && p.refferalTypes.length == 0) {
            p.refferalTypes = getPropList($scope.viewModel.chat1.channeltype, "dataCode");
            p.showWay = "refferal_type";
        }
        return DashboardService.getChat1(p).then((chatData)=> {
            $scope.chat1 = chatData;
            $scope.chat1Options = {
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            //labelString: '人数(天)'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
            $scope.viewModel.chat1.loading = false;

        });
    }

    $scope.chat2Seach = function (byType = false, first = false) {
        $scope.viewModel.chat2.loading = true;
        //默认新注册
        let dataTypes = getPropList($scope.viewModel.chat2.datatypeSelect, "dataCode");

        let p = {
            "dataType": dataTypes,
            "startDate": dateFilter($scope.viewModel.chat2.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.chat2.endDate, 'yyyy-MM-dd'),
            "refferalIds": getPropList($scope.viewModel.chat2.channelSelect, "id"),
            "showWay": byType ? "refferal_type" : "refferal",
            "refferalTypes": getPropList($scope.viewModel.chat2.channelTypeSelect, "dataCode"),
            "businessType": $scope.bizType,
            "appType": $scope.appType,
        }
        if (first) {//第一次的时候传递所有渠道
            p.refferalTypes = getPropList($scope.viewModel.chat2.channeltype, "dataCode")
        }
        if (p.refferalIds.length == 0 && p.refferalTypes.length == 1) {
            p.showWay = "refferal_type";
        }
        else if (p.refferalIds.length > 0 && p.refferalTypes.length != 1) {
            p.showWay = "refferal";
        }
        else if (byType) {//通过渠道类型
            p.refferalIds = [];
        }
        else {//通过渠道
            p.refferalTypes = [];
        }
        if (p.refferalIds.length == 0 && p.refferalTypes.length == 0) {
            p.refferalTypes = getPropList($scope.viewModel.chat2.channeltype, "dataCode");
            p.showWay = "refferal_type";
        }
        return DashboardService.getChat2(p).then((chatData)=> {
            $scope.chat2 = chatData;
            if(chatData.series.length==0&& chatData.data.length==0){
                $scope.viewModel.chat2.dataShow=false;
            }else{
                $scope.viewModel.chat2.dataShow=true;
            };
            $scope.chat2DatasetOverride = [];
            angular.forEach(chatData.series, (item)=> {
                $scope.chat2DatasetOverride.push({
                    fill: false,
                    lineTension: 0,
                });
            });
            $scope.chat2Options = {
                legend: {display: true},
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }
            };
            $scope.viewModel.chat2.loading = false
        });
    };

    $scope.showMultipleFunnelType = false;
    $scope.funnelTypeClick = function (selectData, selectType) {
        let funnelTypes = [];
        if (selectType == "single") {
            angular.forEach($scope.viewModel.chat3.funnelTypeInit, (item)=> {
                if (item.dataCode == selectData.dataCode) {
                    selectData.selected = true;
                } else {
                    item.selected = false;
                }
            });
            if (selectData.dataCode == "") {
                $scope.showMultipleFunnelType = true;
                angular.forEach($scope.viewModel.chat3.datatype, (data)=> {
                    data.selected = true;
                    funnelTypes.push(data.dataCode);
                });
            }
            else {
                $scope.showMultipleFunnelType = false;
                funnelTypes.push(selectData.dataCode);
            }
        }
        if (selectType == "multiple") {
            if (selectData.dataCode == "regist_num") {
                selectData.selected = true;
            } else {
                if (selectData.selected) {
                    selectData.selected = false;
                }
                else {
                    selectData.selected = true;
                }
            }
            angular.forEach($scope.viewModel.chat3.datatype, (data)=> {
                if (data.selected) {
                    funnelTypes.push(data.dataCode);
                }
            });
        }

        $scope.viewModel.chat3.datatypeSelect = funnelTypes;
        $scope.chat3Seach();
    };
    $scope.chat3Seach = function () {
        $scope.viewModel.chat3.loading = true;
        let p = {
            "funnelTypes": $scope.viewModel.chat3.datatypeSelect,
            "startDate": dateFilter($scope.viewModel.chat3.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.chat3.endDate, 'yyyy-MM-dd'),
            "refferalTypes": getPropList($scope.viewModel.chat3.channeltypeSelect, "dataCode"),
            "refferalIds": getPropList($scope.viewModel.chat3.channelSelect, "id"),
            "businessType": $scope.bizType,
            "appType": $scope.appType,
        };

        if (p.refferalIds.length > 0) {
            p.refferalTypes = []
        }

        return DashboardService.getChat3(p).then((data)=> {

            try {
                let funnelData = [];
                let value = 30 * data.refferalConvertRatio.length;
                angular.forEach(data.refferalConvertRatio, (data)=> {
                    angular.forEach(data, (obj, title)=> {
                        /**
                         * 转化率定义：据视觉稿图为例 顶部那个漏斗是没有转化率值的，
                         * 第二个漏斗的转化率值=注册用户数／访客数；
                         * 第三个漏斗转化率值=绑卡用户／注册用户，以此类推。
                         * 用户注册数(10000人)，转化率100%
                         * */
                        let tpl = '{0}({1})';
                        let tplWithRatio = '\n转化率{2}\n{0}({1})';
                        let name = "";
                        if (typeof(obj.convertRatio) == "undefined") {
                            name = tpl.replace("{0}", title).replace("{1}", obj.count);
                        }
                        else {
                            name = tplWithRatio.replace("{0}", title).replace("{1}", obj.count).replace("{2}", obj.convertRatio);
                        }
                        let arr = {
                            value: value,//obj.count,
                            name: name
                        };
                        funnelData.push(arr);
                        value = value - 30;
                    });
                });
                let option = {
                    series: [
                        {
                            name: '漏斗图',
                            type: 'funnel',
                            x: '10%',
                            width: '65%',
                            minSize: '0%',
                            maxSize: '100%',
                            sort: 'descending',
                            data: funnelData
                        }
                    ]
                };
                $scope.chat3Option = option;
                $scope.viewModel.chat3.loading = false;
            }
            catch (error) {

            }

        });
    };
    /**
     * 排行榜
     */
    $scope.chat4Seach = function () {
        $scope.viewModel.chat4.loading = true;
        //默认新注册
        let dataTypes = getPropList($scope.viewModel.chat4.datatypeSelect, "dataCode").length > 0 ? getPropList($scope.viewModel.chat4.datatypeSelect, "dataCode") : ["data_type_100"];
        let dataNames = getPropList($scope.viewModel.chat4.datatypeSelect, "dataName").length > 0 ? getPropList($scope.viewModel.chat4.datatypeSelect, "dataName") : ["新注册"];
        $scope.viewModel.chat4.title = dataNames.join();
        let postData = {
            "dataType": dataTypes,
            "startDate": dateFilter($scope.viewModel.chat4.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.chat4.endDate, 'yyyy-MM-dd'),
        };
        return DashboardService.getChat4(postData).then((result)=> {
            let option = {
                color: ['#89cff0'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '3%',
                    top: '10%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01],
                    position: 'top'
                },
                yAxis: {
                    type: 'category',
                    data: result.series.reverse(),
                    position: 'left'
                },
                series: [
                    {
                        name: dataNames.join(),
                        type: 'bar',
                        data: result.data.reverse()
                    }
                ]
            };

            $scope.chat4Option = option;
            $scope.viewModel.chat4.loading = false;
        });
    };

    $scope.bizType = "";
    $scope.appType = "";
    $scope.borrowFlag = false;

    $scope.initPage = function () {
        angular.forEach($scope.$parent.viewModel.channel, (item)=> {
            item.selected=false;
        });
        $scope.$parent.viewModel.channelSelected=[];
        if($stateParams.bizType && $stateParams.appType){
            $scope.bizType = $stateParams.bizType;
            $scope.appType = $stateParams.appType;
        }else{
            $state.go('main.dashboard.tab1.all',{bizType:"dashboard_lender", appType:"dashboard_lender_100"});
            return;
        };
        if ($scope.bizType != 'dashboard_lender') {
            $scope.borrowFlag = true;
            $scope.viewModel.chat4.show = false;
            $scope.showMultipleFunnelType = true;
        } else {
            $scope.borrowFlag = false;
            $scope.viewModel.chat4.show = true;
            $scope.showMultipleFunnelType = false;
        };
         $q.all([
                    getChatType(),
                    getChannelType(),
                    getAllChannel(),
                    $scope.viewModel.chat1.seachChannel(true),
                    $scope.viewModel.chat2.seachChannel(true),
                    $scope.viewModel.overview.selectDay = 1,
                    $scope.viewModel.chat1.startDate =  new Date().setDate((new Date()).getDate() - 30),
                    $scope.viewModel.chat1.endDate=yesterday,
                    $scope.viewModel.chat2.startDate = new Date().setDate((new Date()).getDate() - 30),
                    $scope.viewModel.chat2.endDate=yesterday,
                    $scope.viewModel.chat3.startDate =  new Date().setDate((new Date()).getDate() - 30),
                    $scope.viewModel.chat3.endDate=yesterday,
                    $scope.viewModel.chat4.startDate = new Date().setDate((new Date()).getDate() - 30),
                    $scope.viewModel.chat4.endDate=yesterday,
                ]).then(function () {
                    return $q.all([
                        asyncGetViewData(),
                        $scope.chat1Seach(true, true),
                        $scope.chat2Seach(true, true),
                        $scope.chat3Seach(),
                        $scope.chat4Seach(),
                    ]).then(()=> {
                        $scope.$parent.selectLoading = false;
                    });
                });


    };



}


angular.module('controller').controller("DashboardController1All", DashboardController1All);
export default DashboardController1All;