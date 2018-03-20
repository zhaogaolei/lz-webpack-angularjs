/**
 * Created by leiz on 2018/1/9.
 */

MgmRewardGiveController.$inject = ["$scope", "$timeout", "$rootScope", "$stateParams", "MgmReportService", "toastr", "$state"];

function MgmRewardGiveController($scope, $timeout, $rootScope, $stateParams, MgmReportService, toastr, $state) {
    let mgmId = $stateParams.mgmId;
    let routeName = JSON.parse(localStorage.getItem("routeState")) || [];
    $scope.vm = new Object();
    $scope.vm.formData = {};
    /*发放状态*/
    let couponStatus = () => {
        MgmReportService.getCouponStatus()
            .then(data => {
                if (data && data.code == 200) {
                    $scope.vm.couponStatusList = data.result;
                }
            });
    };
    /*结算方式*/
    let settleType = () => {
        MgmReportService.getSettleType()
            .then(data => {
                if (data && data.code == 200) {
                    $scope.vm.settleTypeList = data.result;
                }
            });
    };

    /**
     * 列表查询
     */
    let pageSize = 10, pageNo = 1;
    $scope.query = () => {
        getGiveList(pageNo, pageSize, true, null, null);
    };

    let getGiveList = (no, size, reInit, column, sort) => {
        let postData = $scope.vm.formData;
        postData.mgmId = mgmId;
        postData.pageNo = no;
        postData.pageSize = size;
        postData.sortName = column;
        postData.sortOrder = sort;
        MgmReportService.getMgmAwardReport(postData)
            .then((data) => {
                if (data && data.code == 200) {
                    //重置全选状态，清空上次全选的数据
                    $scope.isAll = false;
                    $scope.vm.checked = false;
                    $scope.vm.multipleRecords = [];
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
    $scope.$on("dr.mgmAwardReportPagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getGiveList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getGiveList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getGiveList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getGiveList(pageNo, pageSize, true, null, null);
        }
    });

    /**
     * 处理全选、全不选
     * */
    $scope.vm.multipleRecords = [];
    $scope.allCheckSelect = (event) => {
        if (event.target.checked) {//选中
            $scope.vm.checked = true;
            //需要过滤掉已发放的数据
            $scope.vm.multipleRecords = $scope.tableData.result.filter(f => {
                return f.couponStatus != '发放成功';
            });
        } else {
            $scope.vm.checked = false;
            $scope.vm.multipleRecords = [];
        }
    };

    /**
     * 处理单选
     * */
    $scope.checkSelect = (row, event) => {
        if (event.target.checked) {//选中
            $scope.vm.multipleRecords.push(row);
        } else {//去除
            let multipleRecords = $scope.vm.multipleRecords.filter(f => {
                return f.id != row.id;
            });
            $scope.vm.multipleRecords = multipleRecords;
        }
    };

    $scope.batchSendAward = () => {
        /*批量参数处理*/
        let postData = {
            couponRequestList: []
        };
        angular.forEach($scope.vm.multipleRecords, (data) => {
            let coupon = {};
            coupon.activityId = data.activityId;
            coupon.couponName = data.couponName;
            coupon.userId = data.userId;
            coupon.mgmId = data.mgmId;
            coupon.id = data.id;
            postData.couponRequestList.push(coupon);
        });
        MgmReportService.mgmManualBatchSend(postData)
            .then(data => {
                if (data && data.code == 200) {
                    if (data.msg == "success") {
                        toastr.success("批量执行完成！");
                    }
                    else {
                        toastr.warning(data.msg);
                    }
                    getGiveList(pageNo, pageSize, true, null, null);
                }
            });
    };

    /**
     * 发放奖励
     * */
    $scope.sendAward = (row) => {
        let postData = {
            "activityId": row.activityId,
            "couponName": row.couponName,
            "userId": row.userId,
            "mgmId": row.mgmId,
            "id": row.id
        };
        MgmReportService.mgmManualSend(postData)
            .then(data => {
                if (data && data.code == 200) {
                    if (data.msg == "success") {
                        toastr.success("执行完成！");
                    }
                    else {
                        toastr.warning(data.msg);
                    }
                    getGiveList(pageNo, pageSize, true, null, null);
                }
            });
    };


    $scope.initPage = () => {
        couponStatus();
        settleType();
        getGiveList(pageNo, pageSize, true, null, null);
    };
    $scope.initPage();
    /*返回活动管理列表页*/
    $scope.gotoActivityPage = () => {
        $state.go(routeName.name);
    };
};

angular.module('controller')
    .controller("MgmRewardGiveController", MgmRewardGiveController);