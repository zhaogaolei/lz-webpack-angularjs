/**
 * Created by YundanChai on 2017/12/6.
 */
import accountTpl from '../../templates/modal-account-sem.html';
SemChannelAccountController.$inject = ['$scope', "$stateParams", '$uibModal', 'toastr', 'UpLoadService', '$timeout', '$rootScope', 'SemChannelAccountService'];

function SemChannelAccountController($scope, $stateParams, $uibModal, toastr, UpLoadService, $timeout, $rootScope,SemChannelAccountService) {

    $scope.viewModel = {
        pageTitle: $stateParams.channelname,
        accountList: {}
    };
    /**
     * 页面初始化
     * */
    $scope.initPage = function () {
        getAccountList(1, 10, true);
    };
    /**
     * 获取账户列表
     * */
    let getAccountList = function (no, size, reInit) {
        let data = {
            pageNo: no ? no : 1,
            pageSize: size ? size : 10,
            refferalId: $stateParams.id
        };

        SemChannelAccountService.getAccountList(data)
            .then(function (data) {
                if (data.code != 200) {
                    toastr.warning(data.msg, "Warning");
                    return;
                }
                //绑定数据
                $scope.viewModel.accountList = data.result;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            })
    };

    /*reload pagination data*/
    $scope.$on("dr.actPagination", function (scope, no, size) {
        getAccountList(no, size);
    });

    /**
     * 新增-编辑账户-modal
     * */
    $scope.openAccountModal = function (account) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: accountTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.formData={
                    id:"",
                    token:""
                }
                if (account) {
                    $scope.formData.id=account.id;
                    $scope.formData.account=account.account;
                    $scope.formData.token=account.token;
                }
                else {//新增
                    $scope.formData = null;
                }
                /**
                 * 新增/编辑广告位
                 * */
                $scope.saveAccount = function () {
                    $scope.formData.refferalId = $stateParams.id;
                    SemChannelAccountService.saveAccount($scope.formData)
                        .then(function (data) {
                            if (data && data.code == '200') {
                                toastr.success("保存成功！", "Success");
                                $uibModalInstance.dismiss('cancel');
                                getAccountList(1, 10, true);
                            }
                        });
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
}

angular.module('controller').controller("SemChannelAccountController", SemChannelAccountController);
