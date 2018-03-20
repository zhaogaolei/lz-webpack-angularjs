/**
 * Created by leiz on 2018/2/6.
 */
import proxyUserTpl from '../../templates/proxy/modal-proxy-user-add.html';

ProxyUserController.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$filter', '$uibModal', 'ProxyUserService', 'toastr'];

function ProxyUserController($rootScope, $scope, $state, $timeout, $filter, $uibModal, ProxyUserService, toastr) {
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
    $scope.formData = {};

    /*获取分页数据*/
    let pageSize = 10, pageNo = 1;
    let getProxyUserList = (no, size, reInit, column, sort) => {
        let postData = {};
        postData.proxyId = $scope.formData.proxyId;
        postData.userName = $scope.formData.userName;
        postData.userLevel = $scope.formData.userLevel;
        postData.classify = $scope.formData.classify;
        postData.startTime = dateFilter($scope.formData.startDate, "yyyy-MM-dd");
        postData.endTime = dateFilter($scope.formData.endDate, "yyyy-MM-dd");
        postData.pageNo = no;
        postData.pageSize = size;
        /* postData.sortName = column;
         postData.sortOrder = sort;*/
        ProxyUserService.getProxyUserList(postData)
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
    $scope.$on("proxyUserPaginationEvent", function (event, no, size) {
        getProxyUserList(no, size, false, null, null);

    });

    //获取代理人等级
    let getProxyLevel = () => {
        ProxyUserService.getProxyLevel()
            .then(data => {
                if (data && data.code == 200) {
                    $scope.proxyLevelList = data.result;
                }
            });
    };

    //获取代理人类型
    let getProxyType = () => {
        ProxyUserService.getProxyType()
            .then(data => {
                if (data && data.code == 200) {
                    $scope.proxyTypeList = data.result;
                }
            });
    };

    //查询操作
    $scope.query = function () {
        getProxyUserList(pageNo, pageSize, true, null, null);
    };
    //清除条件
    $scope.reset = () => {
        $scope.formData = new Object();
    };

    //添加、修改代理人
    $scope.addEditProxy = (rowData) => {
        addEditProxy($scope, rowData);
    };
    let addEditProxy = (parent, rowData) => {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: proxyUserTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.formData = {};
                $scope.isEditProxy = rowData ? true : false;
                if ($scope.isEditProxy) {
                    $scope.formData.aid = rowData.aid;
                    $scope.formData.userName = rowData.userName;
                    $scope.formData.phone = rowData.phone;
                    $scope.formData.classify = rowData.classify;
                }
                $scope.proxyTypeList = parent.proxyTypeList;
                $scope.ok = function () {
                    if ($scope.isEditProxy) {
                        let postData = {
                            proxyId: rowData.id,
                            userName: $scope.formData.userName,
                            phone: $scope.formData.phone,
                            classify: $scope.formData.classify
                        };
                        ProxyUserService.proxyUpdate(postData)
                            .then(data => {
                                if (data && data.code == 200) {
                                    toastr.success("保存成功！");
                                    //刷新列表
                                    getProxyUserList(pageNo, pageSize, true, null, null);
                                    $uibModalInstance.dismiss('cancel')
                                }
                            });
                    } else {
                        ProxyUserService.proxyAdd($scope.formData)
                            .then(data => {
                                if (data && data.code == 200) {
                                    toastr.success("保存成功！");
                                    //刷新列表
                                    getProxyUserList(pageNo, pageSize, true, null, null);
                                    $uibModalInstance.dismiss('cancel')
                                }
                            });
                    }
                };
                $scope.cancel = function () {
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

    //行操作-冻结
    $scope.proxyFreeze = (id) => {
        ProxyUserService.proxyFreeze({proxyId: id})
            .then(data => {
                if (data && data.code == 200) {
                    toastr.success("操作成功！");
                    //刷新列表
                    getProxyUserList(pageNo, pageSize, true, null, null);
                }
            });
    };
    //行操作-取消冻结
    $scope.proxyUnfreeze = (id) => {
        ProxyUserService.proxyUnfreeze({proxyId: id})
            .then(data => {
                if (data && data.code == 200) {
                    toastr.success("操作成功！");
                    //刷新列表
                    getProxyUserList(pageNo, pageSize, true, null, null);
                }
            });
    };

    //行操作-删除
    $scope.proxyDelete = (id) => {
        ProxyUserService.proxyDelete({proxyId: id})
            .then(data => {
                if (data && data.code == 200) {
                    toastr.success("操作成功！");
                    //刷新列表
                    getProxyUserList(pageNo, pageSize, true, null, null);
                }
            });
    };

    $scope.initPage = () => {
        getProxyLevel();
        getProxyType();
        getProxyUserList(pageNo, pageSize, true, null, null);
    };
    $scope.initPage();
};
angular.module('controller')
    .controller('ProxyUserController', ProxyUserController);