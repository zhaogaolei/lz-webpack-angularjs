/**
 * Created by YundanChai on 2017/12/6.
 */
SemDeliverActionDetailController.$inject = ['$rootScope', '$scope', 'SemDeliverActionService', '$stateParams', '$q', 'toastr', '$timeout', '$uibModal'];
function SemDeliverActionDetailController($rootScope, $scope, SemDeliverActionService, $stateParams, $q, toastr, $timeout, $uibModal) {
    $scope.actionId = $stateParams.id;

    $scope.downloadDetail = function(){
        let postData = {"publishId":$scope.actionId};
        SemDeliverActionService.exportDetaiAction(postData)
            .then(function (result) {
                var linkElement = document.createElement('a');
                try {
                    //application/vnd.ms-excel
                    var fileName = $scope.actionId + "投放动作明细.xlsx";
                    var blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(clickEvent);
                    }
                } catch (ex) {
                    console.log(ex);
                }
            });
    }

    $scope.init = function () {
        queryInfo(1,10,true);
    };
    /*reload pagination data*/
    let pageSize = 10, pageNo = 1;
    $scope.$on("dr.reloadPagination", function (scope, no, size, state) {
        $scope.curPage = no;
        queryInfo( no,pageSize,false);
    });

    let queryInfo = function (no, size, reInit) {
        let data = {
            pageNo: no ? no : 1,
            pageSize: size ? size : 10,
            publishId: $scope.actionId
        };
        SemDeliverActionService.getActionDeatil(data)
            .then(function (data) {
                if (data.code != 200) {
                    toastr.warning(data.msg, "Warning");
                    return;
                }
                //绑定数据
                $scope.tableData = data.result;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            })
    };

    $scope.init();

    /**
     * 复制URL
     * */
    $scope.openUrlModal = (url) => {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: `<div class="modal-header">
                                        <h4 class="modal-title">URL链接</h4>
                                   </div>
                                   <div class="modal-body">
                                      <div style="padding: 20px 0 30px 20px;word-wrap: break-word;">
                                        <div >
                                            <div ng-bind="url"></div>
                                         </div>
                                      </div>
                                    </div>
                                   <div class="modal-footer">
                                        <button class="btn btn-default btn-plr-35" type="button" ng-click="cancel()">取消</button>
                                        <button class="btn btn-primary btn-plr-35" type="button" clipboard 
                                            supported="supported" 
                                            text="copyText" 
                                            on-copied="copySuccess()" 
                                            on-error="copyFail(err)">
                                                  复制
                                        </button>
                                    </div>`,
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                $scope.url = url;
                $scope.copyText = $scope.url;

                $scope.copySuccess = () => {
                    toastr.success("复制成功！");
                    $uibModalInstance.close();
                };
                $scope.copyFail = (err) => {
                    toastr.error(err);
                };
                $scope.cancel = () => {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {
            //console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
            //console.log(result);
        }, function (reason) {
            //console.log(reason);
        });
    };
}

angular.module('controller')
    .controller("SemDeliverActionDetailController", SemDeliverActionDetailController);