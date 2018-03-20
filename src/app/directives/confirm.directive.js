/**
 * Created by leiz on 2017/5/2.
 */
angular.module('directives')
    .directive('ngConfirm', ['$uibModal', function ($uibModal) {
        return {
            restrict: 'A',
            scope: {
                ngConfirmMessage: '@',
                ngConfirm: '&'
            },
            link: function (scope, element) {
                element.bind('click', function () {
                    var modalInstance = $uibModal.open({
                        template: `<div class="modal-header">
                                        <h4 class="modal-title">操作提示</h4>
                                   </div>
                                   <div class="modal-body">
                                      <div style="padding: 20px 0 30px 20px;">
                                         {{confirmMessage}}
                                      </div>
                                    </div>
                                   <div class="modal-footer">
                                        <button class="btn btn-default btn-plr-35" type="button" ng-click="cancel()">取消</button>
                                        <button class="btn btn-primary btn-plr-35" type="button" ng-click="ok()">确认</button>
                                    </div>`,
                        controller: 'ConfirmController',
                        size: 'ml',
                        backdrop: 'static',
                        keyboard: false,
                        animation: true,
                        resolve: {
                            confirmClick: function () {
                                return scope.ngConfirm;
                            },
                            confirmMessge: function () {
                                return scope.ngConfirmMessage;
                            }
                        }
                    });
                    modalInstance.opened.then(function () {
                        //console.log('modal is opened');
                    });
                    modalInstance.result.then(function (result) {
                        //console.log(result);
                    }, function (reason) {
                        //console.log(reason);
                    });
                });
            }
        }
    }])
    .controller('ConfirmController', ['$scope', '$uibModalInstance', 'confirmClick', 'confirmMessge',
        function ($scope, $uibModalInstance, confirmClick, confirmMessge) {
            $scope.confirmMessage = confirmMessge;
            function closeModal() {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.ok = function () {
                confirmClick();
                closeModal();
            };

            $scope.cancel = function () {
                closeModal();
            };
        }]);