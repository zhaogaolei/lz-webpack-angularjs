import deliverTpl from '../../templates/modal-deliver-add.html';

/**
 * 投放计划列表控制器
 */
DeliverPlanListController.$inject = ['$rootScope', '$scope', 'DeliverService', '$state', '$timeout', '$filter', '$uibModal', 'toastr'];

function DeliverPlanListController($rootScope, $scope, DeliverService, $state, $timeout, $filter, $uibModal, toastr) {
    let dateFilter = $filter('date');
    $scope.seachType = "";
    $scope.seachName = "";
    /*
     *查询所有投放计划
     */
    let queryPaginationList = function (no, size, reInit, column, sort) {
        let arg = "?pageNo=" + no + "&pageSize=" + size;
        arg += '&searchType=' + $scope.seachType + '&campaignName=' + $scope.seachName;
        if (column && sort) {
            arg += "&sort=" + column + "_" + sort;
        }
        DeliverService.queryPaginationList(arg).then(function (data) {
            if (data && data.code == '200') {
                $scope.tableData = data.result
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            }
        });
    }

    let pageSize = 10, pageNo = 1;

    queryPaginationList(pageNo, pageSize, true);
    $scope.seachData = function () {
        queryPaginationList(pageNo, pageSize, true);
    };
    $scope.seachKeyup = function (e) {
        var keycode = window.event ? e.keyCode : e.which;//获取按键编码
        if (keycode == 13) {
            $scope.seachData();//如果等于回车键编码执行方法
        }
    }

    /*reload pagination data*/
    $scope.$on("dr.reloadPagination", function (scope, no, size) {
        if ($scope.column && $scope.sort) {
            queryPaginationList(no, size, false, $scope.column, $scope.sort);
        } else {
            queryPaginationList(no, size);
        }
    });


    $scope.$on('sortEvent', function (scope, column, sort) {
        let pageSize = 10, pageNo = 1;
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            queryPaginationList(pageNo, pageSize, true, column, sort);
        } else {
            $scope.column = null;
            $scope.sort = null;
            queryPaginationList(pageNo, pageSize, true);
        }
    });


    /**
     * 新建、编辑投放计划-model
     * */
    $scope.openDeliverModal = function (planId) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: deliverTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                if (planId) {//编辑
                    $scope.semType=false;
                    $scope.disableType=true;
                    DeliverService.getDeliverInfoById(planId).then(function (data) {
                        if (data && data.code == '200') {
                            // reload
                            $scope.formData = data.result;
                            if (data.result && data.result.campaignStart) {
                                $scope.formData.campaignStart = new Date(data.result.campaignStart)
                            }
                            if (data.result && data.result.campaignEnd) {
                                $scope.formData.campaignEnd = new Date(data.result.campaignEnd)
                            }
                            if($scope.formData.campaignType=="publish_type_102"){
                                $scope.semType=true;
                            }
                            getBusinessProduct($scope, $scope.formData.businessType);
                        }
                    });
                    $scope.isShowUpdateBtn = true;
                }
                else {//新增
                    $scope.formData = null;
                    $scope.isShowUpdateBtn = false;
                    $scope.disableType=false;
                }
                
                $scope.deliverTypeChange = function () {
                    if($scope.formData.campaignType=="publish_type_102"){
                        $scope.formData.businessType="lender";
                        $scope.semType=true;
                        getBusinessProduct($scope, $scope.formData.businessType);
                    }else{
                        $scope.formData.businessType="";
                        $scope.semType=false;

                    }

                }
                $scope.popup = {
                    opened: false
                };
                $scope.open = function () {
                    $scope.popup.opened = true;
                };
                $scope.popup2 = {
                    opened: false
                };
                $scope.open2 = function () {
                    $scope.popup2.opened = true;
                };
                getDeliverType($scope);
                // getBannerProperty($scope);
                $scope.businessTypeChange = function () {
                    getBusinessProduct($scope, $scope.formData.businessType);
                };
                /**
                 * 创建投放计划
                 * */
                $scope.createPlan = function (basicForm) {
                    if ($scope.formData && basicInfoValid($scope)) {
                        var data = angular.copy($scope.formData);
                        if ($scope.formData.campaignStart)
                            data.campaignStart = dateFilter($scope.formData.campaignStart, 'yyyy-MM-dd HH:mm:ss');
                        if ($scope.formData.campaignEnd)
                            data.campaignEnd = dateFilter($scope.formData.campaignEnd, 'yyyy-MM-dd HH:mm:ss');
                        DeliverService.createPlan(data).then(function (data) {
                            if (data) {
                                $scope.formData.id = data.result.id;
                                $scope.formData.status = data.result.status;
                                $uibModalInstance.dismiss('cancel');
                                basicForm.$setPristine();//重置表单纯净状态
                                //添加成功跳转到添加渠道页面
                                //$state.go('main.deliverplanmgr', {id: $scope.formData.id});
                                if($scope.formData.campaignType!="publish_type_102"){
                                    $state.go('main.deliverplanmgr', {id: $scope.formData.id});
                                }else{
                                    $state.go('main.semdeliveraction', {id: $scope.formData.id});
                                }
                                toastr.success("保存成功！");
                            }
                        });
                    }
                };
                /**
                 * 更新投放计划
                 * */
                $scope.updatePlan = function (basicForm) {
                    if ($scope.formData && basicInfoValid($scope)) {
                        var data = angular.copy($scope.formData);
                        if ($scope.formData.campaignStart)
                            data.campaignStart = dateFilter($scope.formData.campaignStart, 'yyyy-MM-dd HH:mm:ss');
                        if ($scope.formData.campaignEnd)
                            data.campaignEnd = dateFilter($scope.formData.campaignEnd, 'yyyy-MM-dd HH:mm:ss');
                        DeliverService.updatePlan(data).then(function (data) {
                            if (data && data.code != '200') {
                                toastr.warning(data.msg);
                                return;
                            }
                            $uibModalInstance.dismiss('cancel');
                            basicForm.$setPristine();//重置表单纯净状态
                            queryPaginationList(1, 10, true);
                            toastr.success("保存成功！")
                        });
                    }
                };

                $scope.cancel = function () {
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
     * 投放类型
     * */
    let getDeliverType = function (scope) {
        DeliverService.getDeliverType().then(function (data) {
            if (data && data.code == '200') {
                console.log("deliverType",data.result);
                scope.deliverType = data.result;
            }
        });
    };

    /**
     * 业务产品
     * */
    let getBusinessProduct = function (scope, businessType) {
        DeliverService.getBusinessProduct(businessType).then(function (data) {
            if (data && data.code == '200') {
                scope.businessProduct = data.result;
            }
        });
    };

    /*投放计划基本信息页验证*/
    let basicInfoValid = function (scope) {
        //投放周期开始时间只能是当前时间或大于当前时间，结束时间只能大于等于开始时间
        let curDate = new Date();
        curDate.setHours(0);
        curDate.setMinutes(0);
        curDate.setSeconds(0);
        if (scope.formData.campaignStart) {
            var campaignStart = new Date(dateFilter(scope.formData.campaignStart, 'yyyy-MM-dd'));
            if (campaignStart < curDate) {
                toastr.error("开始时间必须大于等于当前时间！")
                return false;
            }
        }
        if (scope.formData.campaignEnd) {
            var campaignEnd = new Date(dateFilter(scope.formData.campaignEnd, 'yyyy-MM-dd'));
            if (campaignEnd < campaignStart) {
                toastr.error("结束时间只能大于等于开始时间！")
                return false;
            }
        }
        return true;
    };

    /**
     * 复制投放计划
     * */
    $scope.copyPlan = function (id) {
        DeliverService.copyPlan(id).then(function (data) {
            if (data && data.code != '200') {
                toastr.warning(data.msg);
                return;
            }
            queryPaginationList(1, 10, true);
            toastr.success("复制完成！")
        });
    };
    /**
     * 删除投放计划
     * */
    $scope.deletePlan = function (id) {
        DeliverService.deletePlan(id).then(function (data) {
            if (data && data.code != '200') {
                toastr.warning(data.msg);
                return;
            }
            queryPaginationList(1, 10, true);
            toastr.success("删除完成！")
        });
    };
    /**
     * 进入投放计划
     * */
    $scope.entryPlan = function (row) {
        console.log(row.campaignType);
        //非sem类型
        if(row.campaignType!=="publish_type_102"){
            $state.go('main.deliverplanmgr', {id: row.id,rowcampaignName: row.campaignName});
        }else{
            $state.go('main.semdeliveraction', {id: row.id,campaignName: row.campaignName});
        }

    };
}

angular.module('controller')
    .controller("DeliverPlanListController", DeliverPlanListController);