/**
 * Created by YundanChai on 2018/1/3.
 */
MgmSettleController.$inject = ["$scope", "$timeout", "$rootScope", "MgmReportService", "toastr", "$filter"];

function MgmSettleController($scope, $timeout, $rootScope, MgmReportService, toastr, $filter) {
    let dateFilter = $filter('date');

    let pageSize = 10, pageNo = 1;
    // $scope.query = () => {
    //     getSettleList(pageNo, pageSize, true, null, null);
    // };
    let getSettleList = (no, size, reInit, column, sort) => {
        let postData = {};
        // postData.mgmName=$scope.viewModel.mgmName;
        //postData.startDate= dateFilter($scope.viewModel.startDate, "yyyy-MM-dd HH:mm:ss");
        postData.pageNo = no;
        postData.pageSize = size;
        postData.sortName = column;
        postData.sortOrder = sort;
        MgmReportService.getMgmSettleReport(postData)
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
    $scope.$on("dr.mgmSettlePagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getSettleList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getSettleList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getSettleList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getSettleList(pageNo, pageSize, true, null, null);
        }
    });

    $scope.initPage = () => {
        getSettleList(pageNo, pageSize, true, null, null);
    };
    $scope.initPage();
}

MgmSettleDetailController.$inject = ["$scope", "$timeout", "$rootScope", "$stateParams", "MgmReportService", "toastr"];

function MgmSettleDetailController($scope, $timeout, $rootScope, $stateParams, MgmReportService, toastr) {
    let couponName = $stateParams.couponName;
    let mgmId = $stateParams.mgmId;
    let pageSize = 10, pageNo = 1;
    // $scope.query = () => {
    //     getSettleList(pageNo, pageSize, true, null, null);
    // };
    let getSettleList = (no, size, reInit, column, sort) => {
        let postData = {};
        postData.couponName = couponName;
        postData.mgmId = mgmId;
        postData.pageNo = no;
        postData.pageSize = size;
        postData.sortName = column;
        postData.sortOrder = sort;
        MgmReportService.getMgmSettleReportDetail(postData)
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
    $scope.$on("dr.mgmSettleDetailPagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getSettleList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getSettleList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getSettleList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getSettleList(pageNo, pageSize, true, null, null);
        }
    });

    $scope.initPage = () => {
        getSettleList(pageNo, pageSize, true, null, null);
    };
    $scope.initPage();
}

angular.module('controller')
    .controller("MgmSettleController", MgmSettleController)
    .controller("MgmSettleDetailController", MgmSettleDetailController);