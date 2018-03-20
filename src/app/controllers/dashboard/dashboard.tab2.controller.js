/**
 * Created by chengshuailiu on 17/4/10.
 */
DashboardController2.$inject = ['$scope', 'DashboardService', '$interval', "$q", "$rootScope"];

function DashboardController2($scope, DashboardService, $interval, $q, $rootScope) {

    $scope.config = {
        countup: {duration: 0.2}
    };
    $scope.btnName1 = "<i class='icon-icon-filter-outline'></i> 渠道类型 ";
    $scope.btnName2 = "<i class='icon-icon-filter-outline'></i> 选择渠道 ";
    $scope.joinChat = "+";
    $scope.btnClass2 = "btn btnSelect";
    $scope.localLang2 = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: $scope.btnName2
    };

    $scope.viewModel = {
        channel: [],
        channelSelect: [],
        chatData: {},
        chatNumber: {
            num1: 0,
            num2: 0
        },
        chatPvData: {},
        chatPvNumber: {
            num1: 0,
            num2: 0
        },
        chatUvData: {},
        chatUvNumber: {
            num1: 0,
            num2: 0
        },
        //新注册首投人数实时
        chatFirstInvestPerson: {},
        chatFirstInvestPersonNumber: {
            num1: 0,
            num2: 0
        },
        //新注册首投金额实时
        chatFirstInvestAmount: {},
        chatFirstInvestAmountNumber: {
            num1: 0,
            num2: 0
        },
        //新注册人均首投金额实时
        chatAvgFirstInvestAmount: {},
        chatAvgFirstInvestAmountNumber: {
            num1: 0,
            num2: 0
        },
        //新注册累计投資人数实时
        chatTotalInvestPerson: {},
        chatTotalInvestPersonNumber: {
            num1: 0,
            num2: 0
        },
        //新注册累计投资金额实时
        chatTotalInvestAmount: {},
        chatTotalInvestAmountNumber: {
            num1: 0,
            num2: 0
        },
        //新注册人均累计金额实时
        chatAvgTotalInvestAmount: {},
        chatAvgTotalInvestAmountNumber: {
            num1: 0,
            num2: 0
        },
        selectAddFlag:"common",
    };


    let getChannelByType = function () {
        let typeData = {
            "dataType": [],
            "businessType": "dashboard_lender",
        };
        return DashboardService.getChannelByType(typeData).then((data)=> {
            $scope.viewModel.channel = data;
            if ($scope.viewModel.channel.length > 0) {
                $scope.viewModel.channel[0].selected = true;
                $scope.changeChannel($scope.viewModel.channel[0].id);
            }

        });

    };

    $scope.getSelectAddFlag = function () {
        var isAddFlag= $scope.viewModel.selectAddFlag;
        var id=$scope.viewModel.channelSelect[0].id;
        $q.all([getNowChat1(id,isAddFlag),
            getUvNowChat1(id,isAddFlag),
            getPvNowChat1(id,isAddFlag),
            getFirstInvestPerson(id,isAddFlag),
            getFirstInvestAmount(id,isAddFlag),
            getAvgFirstInvestAmount(id,isAddFlag),
            getTotalInvestPerson(id,isAddFlag),
            getTotalInvestAmount(id,isAddFlag),
            getAvgTotalInvestAmount(id,isAddFlag)]
        ).then(()=> {

        });
    };
    $scope.changeChannel = function (id) {
       // $rootScope.isShowLoading = true;
        var isAddFlag= $scope.viewModel.selectAddFlag;
        $q.all([getNowChat1(id,isAddFlag),
                getUvNowChat1(id,isAddFlag),
                getPvNowChat1(id,isAddFlag),
                getFirstInvestPerson(id,isAddFlag),
                getFirstInvestAmount(id,isAddFlag),
                getAvgFirstInvestAmount(id,isAddFlag),
                getTotalInvestPerson(id,isAddFlag),
                getTotalInvestAmount(id,isAddFlag),
                getAvgTotalInvestAmount(id,isAddFlag)]
        ).then(()=> {
              //  $rootScope.isShowLoading = false;
            });
    };
    $scope.resetChannel = function () {
        if ($scope.viewModel.channel.length > 0) {
            $scope.changeChannel($scope.viewModel.channel[0].id);
        }
    };

    let getNowChat1 = function (id,isAddFlag) {
        return DashboardService.getNowChat1(id,isAddFlag).then(
            (data)=> {

                $scope.viewModel.chatData = data;
                $scope.viewModel.chatNumber.num1 = data.currentData;
                $scope.viewModel.chatNumber.num2 = data.relativeData;
            }
        );
    };

    let getPvNowChat1 = function (id,isAddFlag) {
        return DashboardService.getPvNowChat1(id,isAddFlag).then(
            (data)=> {
                $scope.viewModel.chatPvData = data;
                $scope.viewModel.chatPvNumber.num1 = data.currentData;
                $scope.viewModel.chatPvNumber.num2 = data.relativeData;
            }
        );
    };

    let getUvNowChat1 = function (id,isAddFlag) {
        return DashboardService.getUvNowChat1(id,isAddFlag).then(
            (data)=> {
                $scope.viewModel.chatUvData = data;
                $scope.viewModel.chatUvNumber.num1 = data.currentData;
                $scope.viewModel.chatUvNumber.num2 = data.relativeData;
            }
        );
    };


    let getFirstInvestAmount = function (id,isAddFlag) {
        return DashboardService.getFirstInvestAmount(id,isAddFlag).then(
            (data)=> {
                $scope.viewModel.chatFirstInvestAmount = data;
                $scope.viewModel.chatFirstInvestAmountNumber.num1 = data.currentData;
                $scope.viewModel.chatFirstInvestAmountNumber.num2 = data.relativeData;
            }
        );
    };

    let getFirstInvestPerson = function (id,isAddFlag) {
        return DashboardService.getFirstInvestPerson(id,isAddFlag).then(
            (data)=> {
                $scope.viewModel.chatFirstInvestPerson = data;
                $scope.viewModel.chatFirstInvestPersonNumber.num1 = data.currentData;
                $scope.viewModel.chatFirstInvestPersonNumber.num2 = data.relativeData;
            }
        );
    };

    let getAvgFirstInvestAmount = function (id,isAddFlag) {
        return DashboardService.getAvgFirstInvestAmount(id,isAddFlag).then(
            (data)=> {
                $scope.viewModel.chatAvgFirstInvestAmount = data;
                $scope.viewModel.chatAvgFirstInvestAmountNumber.num1 = data.currentData;
                $scope.viewModel.chatAvgFirstInvestAmountNumber.num2 = data.relativeData;
            }
        );
    };

    let getTotalInvestPerson = function (id,isAddFlag) {
        return DashboardService.getTotalInvestPerson(id,isAddFlag).then(
            (data)=> {
                $scope.viewModel.chatTotalInvestPerson = data;
                $scope.viewModel.chatTotalInvestPersonNumber.num1 = data.currentData;
                $scope.viewModel.chatTotalInvestPersonNumber.num2 = data.relativeData;
            }
        );
    };

    let getTotalInvestAmount = function (id,isAddFlag) {
        return DashboardService.getTotalInvestAmount(id,isAddFlag).then(
            (data)=> {
                $scope.viewModel.chatTotalInvestAmount = data;
                $scope.viewModel.chatTotalInvestAmountNumber.num1 = data.currentData;
                $scope.viewModel.chatTotalInvestAmountNumber.num2 = data.relativeData;
            }
        );
    };

    let getAvgTotalInvestAmount = function (id,isAddFlag) {
        return DashboardService.getAvgTotalInvestAmount(id,isAddFlag).then(
            (data)=> {
                $scope.viewModel.chatAvgTotalInvestAmount = data;
                $scope.viewModel.chatAvgTotalInvestAmountNumber.num1 = data.currentData;
                $scope.viewModel.chatAvgTotalInvestAmountNumber.num2 = data.relativeData;
            }
        );
    };


    $scope.newDate = new Date();

    let getServerData = function () {
        DashboardService.getCurrentTime().then((data)=> {
            $scope.newDate = new Date(data);
            $interval(()=>$scope.newDate = new Date($scope.newDate.getTime() + 1000), 1000);
        });
    };

    $scope.initPage = function () {
        getChannelByType();
        getServerData();
    }


}


angular.module('controller').controller("DashboardController2", DashboardController2);