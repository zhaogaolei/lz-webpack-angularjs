/**
 * Created by leiz on 2018/2/6.
 */
ProxyRewardController.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$filter', 'ProxyRewardService', 'toastr'];

function ProxyRewardController($rootScope, $scope, $state, $timeout, $filter, ProxyRewardService, toastr) {
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
    $scope.formData = {
        proxyId: "",
        startDate: "",
        endDate: "",
        rewardStatus: ""
    };

    /*获取分页数据*/
    let pageSize = 10, pageNo = 1;
    let getProxyRewardList = (no, size, reInit, column, sort) => {
        let postData = {};
        postData.aid = $scope.formData.proxyId;
        postData.status = $scope.formData.rewardStatus;
        postData.beginTm = dateFilter($scope.formData.startDate, "yyyy-MM-dd");
        postData.endTm = dateFilter($scope.formData.endDate, "yyyy-MM-dd");
        postData.pageNo = no;
        postData.pageSize = size;
        /* postData.sortName = column;
         postData.sortOrder = sort;*/
        ProxyRewardService.getProxyRewardList(postData)
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
    $scope.$on("proxyRewardPaginationEvent", function (event, no, size) {
        getProxyRewardList(no, size, false, null, null);

    });
    //获取奖励状态字典
    let getRewardStatus = () => {
        ProxyRewardService.getRewardStatus()
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.rewardStatusList = data.result;
                }
            });
    };
    $scope.initPage = () => {
        getRewardStatus();
        getProxyRewardList(pageNo, pageSize, true, null, null);
    };
    $scope.initPage();

    //查询操作
    $scope.query = function () {
        getProxyRewardList(pageNo, pageSize, true, null, null);
    };

    //标为异常
    $scope.markException = (id) => {

    };
};
angular.module('controller')
    .controller('ProxyRewardController', ProxyRewardController);