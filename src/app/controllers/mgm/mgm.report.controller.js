/**
 * Created by leiz on 2017/12/26.
 */
/**
 * mgm主报表
 */
MgmReportController.$inject = ["$scope", "$timeout", "$rootScope", "$state", "MgmReportService", "toastr","$filter"];

function MgmReportController($scope, $timeout, $rootScope, $state, MgmReportService, toastr,$filter) {
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "请选择活动"
    };
    $scope.viewModel={
        /*activity:[
            { "id":"111","code":"code001","name":"活动1"},
            { "id":"112","code":"code002","name":"活动2"},
            { "id":"113","code":"code003","name":"活动3"}
        ],*/
        mgmName:'',
        /*startDate:'',
        endDate:'',*/
        activitySelected:[]
    }
    /**
     * 列表查询
     */
    let pageSize = 10, pageNo = 1;
    $scope.query = () => {
        getMainReportList(pageNo, pageSize, true, null, null);
    };

    let getMainReportList = (no, size, reInit, column, sort) => {
        let postData = {};
        postData.mgmName=$scope.viewModel.mgmName;
       /* postData.startDate= dateFilter($scope.viewModel.startDate, "yyyy-MM-dd HH:mm:ss");
        postData.endDate=dateFilter($scope.viewModel.endDate, "yyyy-MM-dd HH:mm:ss");*/
        postData.pageNo = no;
        postData.pageSize = size;
        postData.sortName = column;
        postData.sortOrder = sort;
        MgmReportService.getMgmReportMain(postData)
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
    $scope.$on("dr.mgmMainReportPagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getMainReportList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getMainReportList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getMainReportList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getMainReportList(pageNo, pageSize, true, null, null);
        }
    });


  /*  let dateFilter = $filter('date');
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
    };*/
    /**
     * 查看明细报表
     */
    $scope.viewDetailReport = () => {
        $state.go('main.mgmreportdetail');//refferalId: refferalId, accountId: accountId
    };

    let getPostData = () => {
        return {
            mgmName: $scope.viewModel.mgmName,
          /*  startDate: dateFilter($scope.viewModel.startDate, "yyyy-MM-dd HH:mm:ss"),
            endDate:dateFilter($scope.viewModel.endDate, "yyyy-MM-dd HH:mm:ss")*/
        }
    };
    /**
     * 导出主报表
     */
    $scope.exportMainReport = () => {
        let postData = getPostData();
       // postData.reportType = "main"; //标识导出主报表
        MgmReportService.mgmReportExport(postData)
            .then(function (result) {
                let linkElement = document.createElement('a');
                try {
                    let fileName = "MGM主报表.xlsx";
                    let blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
                        let clickEvent = new MouseEvent("click", {
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

    $scope.initPage = () => {
        getMainReportList(pageNo, pageSize, true, null, null);
    };
    $scope.initPage();
};

/**
 * sem明细报表
 */
MgmReportDetailController.$inject = ["$scope", "$timeout", "$rootScope", "$filter", "$state", "$stateParams", "MgmReportService", "toastr", "$uibModal"];

function MgmReportDetailController($scope, $timeout, $rootScope, $filter, $state, $stateParams, MgmReportService, toastr, $uibModal) {
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "请选择活动"
    };
    $scope.viewModel={
        mgmName:'',
        startDate:'',
        endDate:'',
        activitySelected:[]
    }
    /**
     * 列表查询
     */
    let pageSize = 10, pageNo = 1;
    $scope.query = () => {
        getDetailReportList(pageNo, pageSize, true, null, null);
    };
    let getPostData = () => {
        return {
            mgmName: $scope.viewModel.mgmName,
            startDate: dateFilter($scope.viewModel.startDate, "yyyy-MM-dd HH:mm:ss"),
            endDate:dateFilter($scope.viewModel.endDate, "yyyy-MM-dd HH:mm:ss")
        }
    };
    let getDetailReportList = (no, size, reInit, column, sort) => {
        let postData = getPostData();
        postData.pageNo = no;
        postData.pageSize = size;
        postData.sortName = column;
        postData.sortOrder = sort;
        MgmReportService.getMgmReportDetail(postData)
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
    $scope.$on("dr.mgmDetailReportPagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getDetailReportList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getDetailReportList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getDetailReportList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getDetailReportList(pageNo, pageSize, true, null, null);
        }
    });


    let dateFilter = $filter('date');
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

    /**
     * 导出明细
     */
    $scope.exportMainReport = () => {
        let postData = getPostData();
        MgmReportService.mgmDetailReportExport(postData)
            .then(function (result) {
                let linkElement = document.createElement('a');
                try {
                    let fileName = "MGM明细报表.xlsx";
                    let blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
                        let clickEvent = new MouseEvent("click", {
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


    /**
     * 导出明细报表
     */
    $scope.exportDetailReport = () => {
        let postData = getPostData();
        MgmReportService.mgmDetailReportExport(postData)
            .then(function (result) {
                let linkElement = document.createElement('a');
                try {
                    let fileName = "MGMM明细报表.xlsx";
                    let blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
                        let clickEvent = new MouseEvent("click", {
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

    /*返回主报表*/
    $scope.goToMgmReport = () => {
        $state.go("main.mgmreport");
    };

    $scope.query();
    $scope.initPage = () => {
        getDetailReportList(pageNo, pageSize, true, null, null);
    };
    $scope.initPage();
};

angular.module('controller')
    .controller("MgmReportController", MgmReportController)
    .controller("MgmReportDetailController", MgmReportDetailController);