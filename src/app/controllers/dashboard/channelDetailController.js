/**
 * Created by YundanChai on 2017/8/17.
 */
ChannelDetailController.$inject = ['$rootScope', '$scope','$state', '$timeout', '$filter', '$uibModal', 'toastr','ChannelDetailService','$q'];
const startday = new Date().setDate(new Date().getDate() - 30);
const yesterday = new Date().setDate(new Date().getDate() - 1);
function ChannelDetailController($rootScope, $scope, $state, $timeout, $filter, $uibModal, toastr,ChannelDetailService,$q) {
    let dateFilter = $filter('date');
    $scope.viewModel = {
        startDate: startday,
        endDate: yesterday,
        channel:{},
        channelSelected:[],
        channelId: [],
        datatype:[],
        datatypeSelect:[],
        loading:false
    };
    $scope.theadlist=[];
    $scope.tableList=[];
    $scope.btnName2 = "<i class='icon-icon-filter-outline'></i> 渠道选择 ";
    $scope.btnClass = "btn btnSelect ";
    $scope.joinChat = "+";
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "选择渠道"
    };
    $scope.localLang2 = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "选择数据指标"
    };
    $scope.popup1 = {
        opened: false
    };
    $scope.open1 = function () {
        $scope.popup1.opened = true;
    };
    $scope.popup2 = {
        opened: false
    };
    $scope.open2 = function () {
        $scope.popup2.opened = true;
    };
    $scope.queryData = function () {
        //查询钱进行重置
        //$rootScope.$broadcast('modelClear');
        getQueryData(null,null,true);
    };


    let checkDate = function () {
        $scope.checkFlag=false;
        let start = new Date($scope.viewModel.startDate);
        let end = new Date($scope.viewModel.endDate);
        let startDay=start.getTime();
        let endDay= end.getTime();
        let days=Math.floor((endDay-startDay)/(24*3600*1000));
        if($scope.viewModel.startDate==null ||$scope.viewModel.endDate==null){
            toastr.warning("开始时间或者结束时间不能为空！");
        }else {
            if(start>end){
                toastr.warning("开始时间不能大于结束时间！");
            }
            else if(days >= 30){
                toastr.warning("时间区间仅支持30日内！")
            }else if($scope.channelFlag==true && $scope.viewModel.channelSelected.length<1){
                toastr.warning("请至少选择一个渠道！");
            }else if($scope.viewModel.datatypeSelect.length<1) {
                toastr.warning("请至少选择一个数据指标！");
            }else if($scope.channelFlag==false){
                toastr.warning("暂无渠道！");
            }else{
                $scope.checkFlag=true;
            }
        }

    }

    $scope.downloadData = function () {
        checkDate();
        if( $scope.checkFlag){
        let channelIds = getPropList($scope.viewModel.channelSelected, "id");
        let statisticsTypes = getPropList($scope.viewModel.datatypeSelect,"dataCode");
        let p ={
            "startDate": dateFilter($scope.viewModel.startDate, "yyyy-MM-dd"),
            "endDate": dateFilter($scope.viewModel.endDate, "yyyy-MM-dd"),
            "channelIds":channelIds,
            "statisticsTypes":statisticsTypes
        };

        ChannelDetailService.downLoadChannelDetail(p)
            .then(function (result) {
                var linkElement = document.createElement('a');
                try {
                    //application/vnd.ms-excel
                    var fileName = "渠道明细报表.xlsx";
                    var blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(clickEvent);
                    }
                } catch (ex) {
                    console.log(ex);
                }
            });

        }
    };

    //私有方法
    let getPropList = function (arr, prop) {
        let result1 = [];
        angular.forEach(arr, (item) => {
            result1.push(item[prop]);
        });
        return result1;
    };
    let getAllDataTpye = function () {
            //借用渠道趋势的dataType
            return ChannelDetailService.getChatTypeData("refferal_trend").then((data) => {
                var result = [];
                angular.forEach(data, (item, index) => {
                    item.selected = false;
                    if (item.dataCode == "data_type_100") {
                        item.selected = true;
                        result.push(item);
                    }
                });
                $scope.viewModel.datatypeSelect = angular.copy(result);
                $scope.viewModel.datatype = angular.copy(data)
            });

    }

    $scope.channelFlag=true;//有渠道为true
    //获取所有渠道
    let getAllChannel = function () {
        let p = {
            "dataType": [],
            "businessType": "dashboard_lender",
            "appType": "dashboard_lender_100"
        };
      return   ChannelDetailService.getAllChannels(p).then(function (data) {
            if (data && data.code == '200') {
                var channelData = [];
                var selectData=[];
                angular.forEach(data.result, (item)=> {
                    /*if (item.id != "Null") {
                        channelData.push(item);
                    }*/
                    channelData.push(item);
                });
                if(channelData.length==0){
                   toastr.warning("暂无渠道！");
                    $scope.channelFlag=false;
                }else{
                    channelData[0].selected=true;
                    $scope.viewModel.channel = angular.copy(channelData);
                    selectData.push(channelData[0]);
                    $scope.viewModel.channelSelected = angular.copy(selectData);
                }
            }
        });
    };

    /*reload pagination data*/
    /* let pageSize = 10, pageNo = 1;
   $scope.$on("dr.reloadPagination", function (scope, no, size, state) {
        $scope.curPage = no;
        getQueryData(no,size,false);

    });*/

    let getQueryData = function () {
        checkDate();
        if( $scope.checkFlag) {
            $scope.viewModel.loading = true;
            let channelIds = getPropList($scope.viewModel.channelSelected, "id");
            let statisticsTypes = getPropList($scope.viewModel.datatypeSelect, "dataCode");
            let p = {
                "startDate": dateFilter($scope.viewModel.startDate, "yyyy-MM-dd"),
                "endDate": dateFilter($scope.viewModel.endDate, "yyyy-MM-dd"),
                "channelIds": channelIds,
                "statisticsTypes": statisticsTypes
            };
            return ChannelDetailService.getChannelDetail(p).then((data) => {
                $scope.tableList = angular.copy(data);
                if ($scope.viewModel.datatypeSelect.length == 0) {
                    $scope.theadlist = $scope.viewModel.datatype;
                } else {
                    $scope.theadlist = $scope.viewModel.datatypeSelect;
                }
                /*if (reInit) {
                        $rootScope.$broadcast('modelInitialized',  $scope.tableList);
                }*/
                $scope.viewModel.loading = false;
            });
        }else{
            $scope.tableList = [];
        }
    }
    $scope.initPage = function () {
       return  $q.all([
           getAllDataTpye(),
           getAllChannel()
       ]).then(function () {
           if($scope.channelFlag==true){
               getQueryData(null, null, true);
           }

       });

    };
}

angular.module('controller').controller("ChannelDetailController", ChannelDetailController);