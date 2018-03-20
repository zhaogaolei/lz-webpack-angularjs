/**
 * Created by LanYang on 2017/7/10.
 */
/*
 * 渠道ROI
 */
RoiController.$inject = ['$rootScope', '$scope','$state', '$timeout', '$filter', '$uibModal', 'toastr','RoiService'];
function RoiController($rootScope, $scope, $state, $timeout, $filter, $uibModal, toastr,RoiService) {
    let dateFilter = $filter('date');
    $scope.viewModel = {
        channel:"",
        channelSelected:"",
        startDate: "",
        endDate: "",
        channelId: ""
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
    $scope.btnName2 = "<i class='icon-icon-filter-outline'></i> 渠道选择 ";
    $scope.btnClassRoi = "btn btnSelect btnPadding";
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: $scope.btnName2
    };


    $scope.initPage = function () {
        getAllChannel();
        $scope.getRoiList(null, null, true);
    };

    /**
     * 查询渠道名称单选下拉框
     */
    let getAllChannel = function () {
        let p = {
            "dataType": [],
            "businessType": "dashboard_lender_100",
            "appType": ""
        };
        RoiService.getAllChannel(p).then(function (data) {
            if (data && data.code == '200') {
                //$scope.viewModel.channel = angular.copy(data.result);
                var channelData = [];
                angular.forEach(data.result, (item)=> {
                    if (item.id != "Null") {
                        channelData.push(item);
                    }
                });
                $scope.viewModel.channel = angular.copy(channelData);
            }
        });
    };

    /**
     * 获取ROI列表
     * */
    $scope.getRoiList = function (no, size, reInit, column, sort) {
        let postData = {
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
            "channelId": $scope.viewModel.channelId ? $scope.viewModel.channelId : "",
            "startDate": dateFilter($scope.viewModel.startDate, "yyyy-MM-dd"),
            "endDate": dateFilter($scope.viewModel.endDate, "yyyy-MM-dd")
        };
        if (column && sort) {
            postData.sortName = column;
            postData.sortOrder = sort;
        }
        //console.log(postData);
        RoiService.getRoiList(postData)
            .then((data)=> {
                if (data && data.code == 200) {
                    //绑定数据
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
    let pageSize = 10, pageNo = 1;
    $scope.$on("dr.reloadPagination", function (scope, no, size, state) {
        $scope.curPage = no;
        if ($scope.sort) {
            $scope.getRoiList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            $scope.getRoiList(no, size, false, null, null);
        }
    });

    $scope.$on('sortEvent', function (scope, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            $scope.getRoiList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            $scope.getRoiList(pageNo, pageSize, true, null, null);
        }
    });


    /*查询按钮*/
    $scope.queryData = function () {
        //console.log($scope.viewModel.channelSelected);
        if($scope.viewModel.channelSelected.length>0){
            $scope.viewModel.channelId = $scope.viewModel.channelSelected[0].id;
        }else{
            $scope.viewModel.channelId = "";
        }
        $scope.getRoiList(null, null, true);
    };

    /* 对账明细下载按钮*/
    $scope.exportList = function (data) {
        RoiService.exportDetailList(data)//data.publishId
            .then(function (result) {
                var linkElement = document.createElement('a');
                try {
                    //application/vnd.ms-excel
                    var fileName = data.refferlaName + data.publishId + "对账明细.xlsx";
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
    };
};

angular.module('controller')
    .controller("RoiController",RoiController);