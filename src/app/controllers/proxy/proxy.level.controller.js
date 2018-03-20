/**
 * Created by leiz on 2018/2/6.
 */
import commissionFactorTpl from '../../templates/proxy/modal-commission-factor.html';

ProxyLevelController.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$filter', '$uibModal', 'ProxyLevelService', 'toastr'];

function ProxyLevelController($rootScope, $scope, $state, $timeout, $filter, $uibModal, ProxyLevelService, toastr) {

    let getProxyLevelList = () => {
        ProxyLevelService.getProxyLevelList()
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.tableData = data.result;
                }
            });
    };

    //设置佣金系数
    $scope.setCommissionFactor = (row) => {
        let modalInstance = $uibModal.open({
            size: 'sm',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: commissionFactorTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.vm = {};
                $scope.vm.levelName = row.levelName;
                $scope.ok = () => {
                    let postData = {
                        "id": row.id,
                        "brokerageFactor": $scope.vm.commissionFactor,
                        "minInvestAmount": $scope.vm.minInvestAmount
                    };
                    ProxyLevelService.setCommissionFactor(postData)
                        .then(data => {
                            if (data && data.code == 200) {
                                getProxyLevelList();
                                $uibModalInstance.dismiss('cancel')
                            }
                        });
                };
                $scope.cancel = () => {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.result.then(function (result) {
            // console.log(result);
        }, function (reason) {
            // console.log(reason);
        });
    };
    //设置邀请权益
    $scope.setInviteRights = (row) => {
        $state.go("main.inviteright", {levelId: row.id, levelName: row.levelName});
    };

    $scope.initPage = () => {
        getProxyLevelList();
    };
    $scope.initPage();
};
angular.module('controller')
    .controller('ProxyLevelController', ProxyLevelController);