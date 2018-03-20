/**
 * Created by leiz on 2017/4/21.
 */
import activityHistoryTpl from "../../templates/modal-activity-history.html";
ActivityController.$inject = ['$rootScope', '$scope', 'ActivityService', '$state', '$timeout', '$filter', 'toastr'];
function ActivityController($rootScope, $scope, ActivityService, $state, $timeout, $filter, toastr) {
    let dateFilter = $filter('date');
    $scope.formData = {
        activeType: "",
        activeName: "",
        effectiveTime: "",
        invalidTime: "",
        activeStatus: "",
        materialAttId:""
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

    $scope.init = function () {
        getActivityType();
        getActivityStatus();
        $scope.getActivityList(null, null, true);
    };
    /**
     * 获取活动类型
     * */
    let getActivityType = function () {
        ActivityService.getActivityType()
            .then((data)=> {
                $scope.activityTypeList = data.result;
            });
    };
    /**
     * 获取状态
     * */
    let getActivityStatus = function () {
        ActivityService.getActivityStatus()
            .then((data)=> {
                $scope.activityStatusList = data.result;
            });
    };

    /**
     * 获取活动列表
     * */
    $scope.getActivityList = function (no, size, reInit, column, sort) {
        let postData = {
            "activeType": $scope.formData.activeType,
            "activeName": $scope.formData.activeName,
            "effectiveTime": dateFilter($scope.formData.effectiveTime, "yyyy-MM-dd HH:mm:ss"),
            "invalidTime": dateFilter($scope.formData.invalidTime, "yyyy-MM-dd HH:mm:ss"),
            "activeStatus": $scope.formData.activeStatus,
            "pageNo": no ? no : 1,
            "pageSize": size ? size : 10,
        };
        if (column && sort) {
            postData.sortName = column;
            postData.sortOrder = sort;
        }
        ActivityService.getActivityList(postData)
            .then((data)=> {
                $scope.tableData = data.result;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            });
    };

    /*reload pagination data*/
    let pageSize = 10, pageNo = 1;
    $scope.$on("dr.activityPagination", function (scope, no, size, state) {
        $scope.curPage = no;
        if ($scope.sort) {
            $scope.getActivityList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            $scope.getActivityList(no, size, false, null, null);
        }
    });

    $scope.$on('sortEvent', function (scope, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            $scope.getActivityList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            $scope.getActivityList(pageNo, pageSize, true, null, null);
        }
    });

    /*状态帅筛选*/
    $scope.statusChange = function () {
        $scope.formData.activeType = "";
        $scope.formData.activeName = "";
        $scope.formData.effectiveTime = "";
        $scope.formData.invalidTime = "";
        $scope.getActivityList(null, null, true);
    };
    /*查询按钮*/
    $scope.queryData = function () {
        $scope.getActivityList(null, null, true);
    };

    /**
     * 新建活动
     * */
    $scope.createActivity = function () {
        $state.go("main.activityEdit", {activityId: "", activityName: ""});
    };


}
;

ActivityEditController.$inject = ['$stateParams', '$scope', 'ActivityService', '$timeout', '$location', '$uibModal', 'toastr', '$rootScope'];
function ActivityEditController($stateParams, $scope, ActivityService, $timeout, $location, $uibModal, toastr, $rootScope) {
    $scope.viewModel = {
        activityName: $stateParams.activityName,
        formData: []
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

    $scope.initPage = function () {
        getActivityType();
        getActivityInfoById($stateParams.activityId)
    };
    /**
     * 获取活动类型
     * */
    let getActivityType = function () {
        ActivityService.getActivityType()
            .then((data) => {
                $scope.activityTypeList = data.result
            });
    };
    /**
     * 获取活动信息 by  id
     * */
    let getActivityInfoById = function (id) {
        if (id == "") {
            return;
        }
        ActivityService.getActivityInfoById(id)
            .then((data) => {
                $scope.viewModel.formData = data.result;
                if (!$scope.viewModel.formData.file) {
                    $scope.viewModel.formData.file = {};
                }
                $scope.materialAttId = data.result.materialAttId;
                console.log( $scope.viewModel.formData);
                $scope.viewModel.formData.file.name = data.result.materialName;
                if ($scope.viewModel.formData.masterTrackingCode) {
                    let masterTrackingCode = $scope.viewModel.formData.masterTrackingCode.split(',');
                    angular.forEach(masterTrackingCode, function (data, index) {
                        $scope.checkBoxResult.push(data);
                    });
                }
            });
    };

    /**
     * 插入主站ID
     * */
    $scope.insertTrackId = function () {
        $scope.viewModel.formData.masterTrackingId = "a20c274701ec9918";
    };
    /**
     * checkbox处理
     * */
    $scope.checkBoxResult = [];
    $scope.checkSelect = function (code, event) {
        if (event.target.checked) {//选中，就添加
            if ($scope.checkBoxResult.indexOf(code) == -1) {//不存在就添加
                $scope.checkBoxResult.push(code);
            }
        } else {//去除就删除result
            var idx = $scope.checkBoxResult.indexOf(code);
            if (idx != -1) {//不存在就添加
                $scope.checkBoxResult.splice(idx, 1);
            }
        }
    };
    //被选中条件：ng-checked的结果为true
    $scope.isCheckBoxSelected = function (code) {
        if ($scope.viewModel.formData.masterTrackingCode) {
            //只要返回的结果为true，则对应的checkbox就会被选中，
            return $scope.viewModel.formData.masterTrackingCode.indexOf(code) != -1;
        }
    };
    /**
     * 保存活动信息
     * */
    $scope.saveActivity = function () {
        $scope.viewModel.formData.masterTrackingCode = $scope.checkBoxResult.join(',');
        let formData = {
            "id": $scope.viewModel.formData.id,
            "activeName": $scope.viewModel.formData.activeName,
            "activeType": $scope.viewModel.formData.activeType,
            "effectiveTime": $scope.viewModel.formData.effectiveTime,
            "invalidTime": $scope.viewModel.formData.invalidTime,
            "file": $scope.viewModel.formData.file,
            "masterTrackingCode": $scope.viewModel.formData.masterTrackingCode,
            "masterTrackingId": $scope.viewModel.formData.masterTrackingId,
            "materialId": $scope.viewModel.formData.materialId,
            // "initialUrl":$scope.viewModel.formData.initialUrl,
            "directory": $scope.viewModel.formData.directory,
            "describes": $scope.viewModel.formData.describes
        };
        if (ActivityService.dateTimeValid($scope.viewModel.formData.effectiveTime, $scope.viewModel.formData.invalidTime)) {
            ActivityService.saveActivity(formData)
                .then((data) => {
                    if (data && data.code == '200') {
                        $location.path("/main/activity").replace();
                    }
                })
        }
    };
    /**
     * 打开操作记录
     * */
    $scope.openHistory = function () {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: activityHistoryTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.historyList = {};
                //TODO 获取历史记录
                let getActivityHistory = function (no, size, reInit) {
                    let postData = {
                        pageNo: no ? no : 1,
                        pageSize: size ? size : 10,
                        activeId: $stateParams.activityId
                    };
                    ActivityService.getActivityHistory(postData)
                        .then((data) => {
                            $scope.historyList = data.result;
                            if (reInit) {
                                $timeout(function () {
                                    $rootScope.$broadcast('modelInitialized', this);
                                }, 500);
                            }
                        });
                };
                getActivityHistory(1, 10, true);
                /*reload pagination data*/
                $scope.$on("dr.activityHistoryPagination", function (scope, no, size) {
                    getActivityHistory(no, size);
                });
                $scope.close = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {
            console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
            console.log(result);
        }, function (reason) {
            console.log(reason);
        });
    };

    /**
     * 取消
     * */
    $scope.cancel = function () {
        $location.path("/main/activity").replace();
    };

    $scope.hdDownloadFile = function () {
        if($scope.materialAttId==null||$scope.materialAttId==""){
            return;
        }
        var d = {
            id: $scope.materialAttId,
        }
        ActivityService.hdDownloadFile(d)
            .then(function (data, status, headers, config) {
                var blob = new Blob([data.data], {type:"application/x-zip-compressed"});
                var fileName = $scope.viewModel.formData.file.name ;
                if (window.navigator.msSaveOrOpenBlob) {
                    // for ie only
                    window.navigator.msSaveOrOpenBlob(blob, fileName);
                } else {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.download = fileName;
                    a.href = URL.createObjectURL(blob);
                    a.click();
                }
            })
    };
};
angular.module('controller')
    .controller('ActivityController', ActivityController)
    .controller('ActivityEditController', ActivityEditController);