import jobAddTpl from '../../templates/modal-job-add.html';
import jobHistoryTpl from '../../templates/modal-job-history.html';
import jobErrorTpl from '../../templates/modal-job-error.html';

import '../../../lib/cron-generator/cronGen.css';
import '../../../lib/cron-generator/cronGen';

/**
 * 定时job控制器
 */
JobController.$inject = ['$rootScope', '$scope', 'JobService', '$uibModal', '$filter', 'toastr', '$timeout'];

function JobController($rootScope, $scope, JobService, $uibModal, $filter, toastr, $timeout) {
    /**
     * 新增计划任务
     */
    $scope.createJob = (optType, jobGroup, jobName) => {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: jobAddTpl,
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                $scope.formData = null;
                $scope.initAddJob = () => {
                    if (optType === "add") {
                        $("#cron").cronGen({
                            scope: $scope,
                            direction: 'right'
                        });
                    }
                };

                /*编辑状态下，jobGroup,jobName,jobClass ，不可编辑*/
                if (optType != "add") {
                    $scope.isDisabled = true;
                    /*查询单条job*/
                    JobService.getJobByGroupName(jobGroup, jobName)
                        .then((data) => {
                            if (data) {
                                $scope.formData = data.result;
                                $("#cron").cronGen({
                                    scope: $scope,
                                    direction: 'right'
                                });
                            }
                        });
                }
                $scope.ok = () => {
                    console.log($scope.formData);
                    JobService.jobSave(optType, $scope.formData)
                        .then((data) => {
                            if (data) {
                                toastr.success("保存成功！");
                                $uibModalInstance.dismiss('cancel');
                                getJobList();
                            }
                        });
                };
                $scope.cancel = () => {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {
            // console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
                //console.log(result);
            },
            function (reason) {
                //console.log(reason);
            });
    };

    /**
     * 获取列表
     */
    let getJobList = () => {
        JobService.getJobList()
            .then((data) => {
                if (data) {
                    //$scope.jobList = data.result;
                    /*过滤掉删除的记录*/
                    $scope.jobList = data.result.filter((d) => {
                        return d.jobStatus != "DELETE";
                    })
                }
            });
    };

    /**
     * 立即执行
     */
    $scope.jobExecute = (jobGroup, jobName) => {
        JobService.jobExecute(jobGroup, jobName)
            .then((data) => {
                if (data) {
                    toastr.success("执行成功！");
                    getJobList();
                }
            });
    };

    /**
     * 启动
     */
    $scope.jobStart = (jobGroup, jobName) => {
        JobService.jobStart(jobGroup, jobName)
            .then((data) => {
                if (data) {
                    toastr.success("启动成功！");
                    getJobList();
                }
            });
    };

    /**
     * 暂停
     */
    $scope.jobPause = (jobGroup, jobName) => {
        JobService.jobPause(jobGroup, jobName)
            .then((data) => {
                if (data) {
                    toastr.success("暂停成功！");
                    getJobList();
                }
            });
    };

    /**
     * 删除
     */
    $scope.jobDelete = (jobGroup, jobName) => {
        JobService.jobDelete(jobGroup, jobName)
            .then((data) => {
                if (data) {
                    toastr.success("删除成功！");
                    getJobList();
                }
            });
    };

    /**
     * 查询job执行历史
     * */
    $scope.viewJobHistory = (jobGroup, jobName) => {
        let modalInstance = $uibModal.open({
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: jobHistoryTpl,
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                //TODO 获取历史记录
                let getJobHistory = function (no, size, reInit) {
                    let postData = {
                        pageNo: no ? no : 1,
                        pageSize: size ? size : 10,
                        jobName: jobName,
                        jobGroup: jobGroup
                    };
                    JobService.getJobHistory(postData)
                        .then((data) => {
                            if (data) {
                                $scope.jobHistoryList = data.result;
                                if (reInit) {
                                    $timeout(function () {
                                        $rootScope.$broadcast('modelInitialized', this);
                                    }, 500);
                                }
                            }
                        });
                };
                getJobHistory(1, 10, true);
                /*reload pagination data*/
                $scope.$on("dr.jobHistoryPagination", function (scope, no, size) {
                    getJobHistory(no, size);
                });
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {
            // console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
                //console.log(result);
            },
            function (reason) {
                //console.log(reason);
            });
    };

    /**
     * 查询job异常信息
     * */
    $scope.viewJobError = (jobGroup, jobName) => {
        let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: jobErrorTpl,
                controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                    let getJobError = function () {
                        let postData = {
                            jobName: jobName,
                            jobGroup: jobGroup
                        };
                        JobService.getJobError(postData)
                            .then((data) => {
                                    if (data) {
                                        $scope.jobErrorList = data.result;
                                    }
                                }
                            );
                    };
                    getJobError();
                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };
                }]
            })
        ;
        modalInstance.opened.then(function () {
            // console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
                //console.log(result);
            },
            function (reason) {
                //console.log(reason);
            });
    };

    $scope.init = () => {
        getJobList();
    };
}

angular.module('controller')
    .controller("JobController", JobController);