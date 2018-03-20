/**
 * Created by leiz on 2018/2/6.
 */
/**
 * 设置邀请权益
 * */
ProxyLevelInviteRightSetController.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$stateParams', '$uibModal', 'ProxyLevelService', 'toastr'];

function ProxyLevelInviteRightSetController($rootScope, $scope, $state, $timeout, $stateParams, $uibModal, ProxyLevelService, toastr) {
    $scope.vm = {};
    $scope.vm.levelName = $stateParams.levelName;
    let levelId = $stateParams.levelId;
    /*获取当前已选择的权益列表*/
    let getSelectedIrList = () => {
        ProxyLevelService.getProxyLevelIrByLevelId(levelId)
            .then(data => {
                if (data && data.code == 200) {
                    $scope.vm.selectedTableList = data.result;
                    angular.forEach($scope.vm.selectedTableList, (d) => {
                        d.selected = false;
                    });
                }
            });
    };
    /**
     * 处理全选/不选---已选集合
     * */
    $scope.vm.multipleRecordsForSelectedIr = [];
    $scope.allCheckSelect = (event) => {
        if (event.target.checked) {//选中
            angular.forEach($scope.vm.selectedTableList, (d) => {
                d.selected = true;
            });
            $scope.vm.multipleRecordsForSelectedIr = angular.copy($scope.vm.selectedTableList);
        } else {
            angular.forEach($scope.vm.selectedTableList, (d) => {
                d.selected = false;
            });
            $scope.vm.multipleRecordsForSelectedIr = [];
        }
    };

    /**
     * 处理单选
     * */
    $scope.checkSelect = (row, event) => {
        if (event.target.checked) {//选中
            $scope.vm.multipleRecordsForSelectedIr.push(row);
            row.selected = true;
        } else {//去除
            row.selected = false;
            let multipleRecords = $scope.vm.multipleRecordsForSelectedIr.filter(f => {
                return f.id != row.id;
            });
            $scope.vm.multipleRecordsForSelectedIr = multipleRecords;
        }
    };

    /*获取邀请权益池*/
    let getAllIrList = () => {
        ProxyLevelService.getProxyLevelIrList(levelId)
            .then(data => {
                if (data && data.code == 200) {
                    $scope.vm.unSelectedTableList = data.result;
                    angular.forEach($scope.vm.unSelectedTableList, (d) => {
                        d.selected = false;
                    });
                }
            });
    };
    /**
     * 处理全选/不选---权益池
     * */
    $scope.vm.multipleRecordsForUnSelectedIr = [];
    $scope.allCheckSelect1 = (event) => {
        if (event.target.checked) {//选中
            angular.forEach($scope.vm.unSelectedTableList, (d) => {
                d.selected = true;
            });
            $scope.vm.multipleRecordsForUnSelectedIr = angular.copy($scope.vm.unSelectedTableList);
        } else {
            angular.forEach($scope.vm.unSelectedTableList, (d) => {
                d.selected = false;
            });
            $scope.vm.multipleRecordsForUnSelectedIr = [];
        }
    };

    /**
     * 处理单选
     * */
    $scope.checkSelect1 = (row, event) => {
        if (event.target.checked) {//选中
            row.selected = true;
            $scope.vm.multipleRecordsForUnSelectedIr.push(row);
        } else {//去除
            row.selected = false;
            let multipleRecords = $scope.vm.multipleRecordsForUnSelectedIr.filter(f => {
                return f.id != row.id;
            });
            $scope.vm.multipleRecordsForUnSelectedIr = multipleRecords;
        }
    };

    /*移出*/
    $scope.moveOut = () => {
        //从已选集合移除
        let ids = $scope.vm.multipleRecordsForSelectedIr.map((data) => {
            return data.id;
        }).join(',');
        let selectedTableList = $scope.vm.selectedTableList.filter(f => {
            return !(ids.indexOf(f.id) != -1);
        });
        $scope.vm.selectedTableList = selectedTableList;
        //追加到权益池
        angular.forEach($scope.vm.multipleRecordsForSelectedIr, (data) => {
            data.selected = false;
            $scope.vm.unSelectedTableList.push(data);
        });
        $scope.vm.checked = false;//清空全选
        $scope.vm.checked1 = false;//清空全选
        $scope.vm.multipleRecordsForSelectedIr = [];//清空选中记录
    };
    /*移入*/
    $scope.moveIn = () => {
        //从权益池集合移除
        let ids = $scope.vm.multipleRecordsForUnSelectedIr.map((data) => {
            return data.id;
        }).join(',');
        let unSelectedTableList = $scope.vm.unSelectedTableList.filter(f => {
            return !(ids.indexOf(f.id) != -1);
        });
        $scope.vm.unSelectedTableList = unSelectedTableList;
        //追加到已选集合
        angular.forEach($scope.vm.multipleRecordsForUnSelectedIr, (data) => {
            data.selected = false;
            $scope.vm.selectedTableList.push(data);
        });
        $scope.vm.checked = false;//清空全选
        $scope.vm.checked1 = false;//清空全选
        $scope.vm.multipleRecordsForUnSelectedIr = [];
    };

    /*新增邀请权益*/
    $scope.inviteRightAdd = () => {
        $state.go("main.inviterightadd", {levelId: levelId, levelName: $scope.vm.levelName});
    };

    /*删除权益池单条记录*/
    $scope.deleteInviteRightById = (id) => {
        ProxyLevelService.deleteProxyLevelIr(id)
            .then(data=>{
               if(data&&data.code==200){
                   toastr.success("删除成功！");
                   //重新加载权益池
                   getAllIrList();
               }
            });
    };
    /*更新当前代理人权益*/
    $scope.updateProxyLevelIrCurrent = () => {
        let postData = [];
        angular.forEach($scope.vm.selectedTableList, (data) => {
            let objData = {
                "levelId": levelId,
                "equityId": data.id
            };
            postData.push(objData);
        });
        ProxyLevelService.updateProxyLevelIrCurrent(postData)
            .then(data => {
                if (data && data.code == 200) {
                    toastr.success("保存成功！");
                    //返回等级管理列表
                    $state.go("main.proxylevel");
                }
            });
    };

    $scope.initPage = () => {
        getSelectedIrList();
        getAllIrList();
    };
    $scope.initPage();
};

/**
 * 新增邀请权益
 * */
import rewardContentTpl from '../../templates/proxy/modal-proxy-reward-content-add.html';

ProxyLevelInviteRightAddController.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$stateParams', '$uibModal', 'ProxyLevelService', 'toastr'];

function ProxyLevelInviteRightAddController($rootScope, $scope, $state, $timeout, $stateParams, $uibModal, ProxyLevelService, toastr) {
    $scope.formData = new Object();
    $scope.formData.rewardList = new Array();

    /*添加奖励内容*/
    $scope.addRewardContent = () => {
        addRewardContent($scope);
    };
    let addRewardContent = (parent) => {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: rewardContentTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.viewModel = new Object();
                let getCouponPlanCouponName = () => {
                    ProxyLevelService.getCouponPlanCouponName()
                        .then(data => {
                            if (data && data.code == 200) {
                                $scope.couponPlanList = data.result;
                            }
                        });
                };
                $scope.couponPlanChange = () => {
                    let selectedCouponPlan = $scope.couponPlanList.filter(f => {
                        return f.id == $scope.viewModel.planId;
                    })[0];
                    $scope.couponTypeList = selectedCouponPlan ? selectedCouponPlan.templateList : [];
                };
                $scope.ok = function () {
                    let rewardUnit = $scope.viewModel;
                    //1、追加页面显示字段
                    rewardUnit.couponPlanName = $scope.couponPlanList.filter(f => {
                        return f.id == $scope.viewModel.planId;
                    })[0].planName;
                    rewardUnit.couponTemplateName = $scope.couponTypeList.filter(f => {
                        return f.couponName == $scope.viewModel.couponName;
                    })[0].templateName;

                    //2、追加到奖励内容集合
                    parent.formData.rewardList.push(rewardUnit);
                    $uibModalInstance.dismiss('cancel')
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.initAddRewardPage = () => {
                    getCouponPlanCouponName();
                };
            }]
        });
        modalInstance.result.then(function (result) {
            // console.log(result);
        }, function (reason) {
            // console.log(reason);
        });
    };

    /*删除已选奖励内容*/
    $scope.deleteRewardContent = (data) => {
        let rewardList = $scope.formData.rewardList.filter(f => {
            return JSON.stringify(f) != JSON.stringify(data);
        });
        $scope.formData.rewardList = rewardList;
    };

    //保存邀请权益
    $scope.saveInviteRight = () => {
        let postData = {
            equityName: $scope.formData.equityName,
            proxyEquityTickets: []
        };
        angular.forEach($scope.formData.rewardList, (data) => {
            let atom = {
                couponPlanId: data.planId,
                couponPlan: data.couponPlanName,
                couponName: data.couponName,
                couponTemplateName: data.couponTemplateName,
                couponNumber: data.couponNumber
            };
            postData.proxyEquityTickets.push(atom);
        });
        ProxyLevelService.addProxyLevelIr(postData)
            .then(data => {
                if (data && data.code == 200) {
                    toastr.success("保存成功！");
                    //返回权益设置页面
                    $scope.goBack();
                }
            });
    };

    /*返回上一页面*/
    $scope.goBack = () => {
        $state.go("main.inviteright", {levelId: $stateParams.levelId, levelName: $stateParams.levelName});
    };
};
angular.module('controller')
    .controller('ProxyLevelInviteRightSetController', ProxyLevelInviteRightSetController)
    .controller('ProxyLevelInviteRightAddController', ProxyLevelInviteRightAddController);