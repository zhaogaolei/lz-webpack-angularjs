/**
 * Created by leiz on 2017/12/26.
 */
import mgmRuleDetailTpl from '../../templates/mgm-rule-detail-modal.html';

MgmActivityController.$inject = ['$rootScope', '$scope', 'MgmActivityService', '$state', '$timeout', '$filter', 'toastr', '$uibModal'];

function MgmActivityController($rootScope, $scope, MgmActivityService, $state, $timeout, $filter, toastr, $uibModal) {
    /**
     * 区分mgm活动和代理人活动
     * mgm活动：stateName:main.mgmactivity    activityType：MGM
     * vip活动：stateName:main.proxyactivity  activityType：VIP
     * */
    let routeState = {
        name: $state.current.name,
        activityType: $state.current.activityType
    };
    localStorage.setItem("routeState", JSON.stringify(routeState));
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
        mgmActivityName: '',
        dept: [],
        startDate: '',
        endDate: '',
        deptSelect: ''
    };

    /*获取分页数据*/
    let pageSize = 10, pageNo = 1;
    let getActivityList = (no, size, reInit, column, sort) => {
        let postData = {};
        postData.mgmName = $scope.formData.mgmActivityName;
        postData.dept = $scope.formData.deptSelect;
        postData.startTime = dateFilter($scope.formData.startDate, "yyyy-MM-dd");
        postData.endTime = dateFilter($scope.formData.endDate, "yyyy-MM-dd");
        postData.pageNo = no;
        postData.pageSize = size;
        postData.activityType = routeState.activityType;  //区分mgm，代理人
        /* postData.sortName = column;
         postData.sortOrder = sort;*/
        MgmActivityService.getActivityList(postData)
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
    $scope.$on("dr.mgmActivtyPagination", function (event, no, size) {
        getActivityList(no, size, false, null, null);

    });

    let getAllDept = function () {
        MgmActivityService.getDept()
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.formData.dept = data.result;

                }
            });
    }
    //新增活动
    $scope.editMgmActivity = (mgmId, copy) => {
        $state.go("main.mgmactivityedit", {mgmId: mgmId, copyedit: copy});
    };
    $scope.initPage = () => {
        getAllDept();
        getActivityList(pageNo, pageSize, true, null, null);
    };
    $scope.initPage();

    $scope.queryActivityList = function () {
        getActivityList(pageNo, pageSize, true, null, null);
    }

    //停止活动
    $scope.stopMgmActivity = (id) => {
        let postData = {};
        postData.mgmId = id;
        MgmActivityService.stopMgmActivity(postData).then(function (data) {
            if (data && data.code == '200') {
                toastr.success('停止MGM活动成功!');
                getActivityList(pageNo, pageSize, true, null, null);
            }
        });
    };
    //删除活动
    $scope.deleteMgmActivity = (id) => {
        let postData = {};
        postData.mgmId = id;
        MgmActivityService.deleteMgmActivity(postData).then(function (data) {
            if (data && data.code == '200') {
                toastr.success('删除MGM活动成功!');
                getActivityList(pageNo, pageSize, true, null, null);
            }
        });
    };
    $scope.copyMgmActivity = (id, copy) => {
        $state.go("main.mgmactivityedit", {mgmId: id, copyedit: copy});
    };
    //显示详细规则
    $scope.showRuleDetail = (expressions) => {
        let modalInstance = $uibModal.open({
                size: 'ml',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: mgmRuleDetailTpl,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.expressions = expressions;
                    $scope.cancel = () => {
                        $uibModalInstance.dismiss('cancel');
                    };
                }]
            }
        );
        modalInstance.opened.then(function () {
            // console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
            // console.log(result);
        }, function (reason) {
            // console.log(reason);
        });
    };
};
angular.module('controller')
    .controller('MgmActivityController', MgmActivityController);