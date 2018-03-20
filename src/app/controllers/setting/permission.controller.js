import * as constant from '../../constant';
import roleTpl from '../../templates/modal-role.html';


/*
 * 权限管理控制器
 */
PermissionController.$inject = ['$rootScope', '$scope', 'PermissionService', '$uibModal', '$filter', 'toastr', '$timeout'];

function PermissionController($rootScope, $scope, PermissionService, $uibModal, $filter, toastr, $timeout) {
    
    
    /*
     *查询所有权限-分页
     * id-campaignId, no-pageNO, size-pageSize, reInit-reSetPage
     */
    $scope.getPermissionListByPage = function (no, size, reInit, username) {
        // clear selected first
        $scope.unSelectedAll && $scope.unSelectedAll();

        let arg = {
            pageNo: no ? no : 1,
            pageSize: size ? size : 10
        }
        if (username) {
            arg.name = username;
        }
        PermissionService.queryPaginationList(arg).then(function (data) {
            $scope.permissionList = data.result;

            if (reInit) {
                $timeout(function () {
                    $rootScope.$broadcast('modelInitialized', this);
                }, 500);
            }
        });
    }
    let pageSize = 10;
    $scope.getPermissionListByPage(1, pageSize, true);

    /*reload pagination data*/
    $scope.$on("dr.reloadPagination", function (scope, no, size, state) {
        $scope.currentNo = no;
        if ($scope.username)
            $scope.getPermissionListByPage(no, size, false, $scope.username);
        else
            $scope.getPermissionListByPage(no, size, false);
    });

    /*refresh pagination data*/
    $scope.refreshPermissionList = function() {
        if ($scope.username)
            $scope.getPermissionListByPage($scope.currentNo ? $scope.currentNo : 1, pageSize, false, $scope.username);
        else
            $scope.getPermissionListByPage($scope.currentNo ? $scope.currentNo : 1, pageSize, false);
    }

    /*查询用户*/
    $scope.queryUser = function(name) {
        if ($scope.username) {
            $scope.getPermissionListByPage(1, pageSize, true, $scope.username);
        } else {
            $scope.getPermissionListByPage(1, pageSize, true);
        }
    }


    /*已选择的行*/
    $scope.count = 0;//已选择数量
    $scope.selectData = [];//已选对象
    /*全选*/
    $scope.changeAll = function () {
        angular.forEach($scope.permissionList.result, function (item) {
            item.checked = $scope.selectAll;
        });
        $scope.count = $scope.selectAll ? $scope.permissionList.result.length : 0;
        if ($scope.selectAll) {
            $scope.selectData = $scope.permissionList.result;
        } else {
            $scope.selectData = [];
        }
    };
    $scope.unSelectedAll = function(){
        $scope.count = 0;
        $scope.selectData = [];
        $scope.selectAll=null;
    }
    /*单选*/
    $scope.changeCurrent = function (current, $event) {
        $scope.count += current.checked ? 1 : -1;
        //判断是否全选，选数量等于数据长度为true
        $scope.selectAll = $scope.count === $scope.permissionList.result.length;
        //统计已选对象
        $scope.selectData = [];
        angular.forEach($scope.permissionList.result, function (item) {
            if (item.checked) {
                $scope.selectData[$scope.selectData.length] = item;
            }
        });
        $event.stopPropagation();
    };

    $scope.setPermission = function(json, callback) {
        PermissionService.setPermission(json).then(function(data){
            $scope.refreshPermissionList();
            callback();
            toastr.success('权限设置成功!');
        })
    }

    $scope.openSetPermission = function(row) {
        if ($scope.count > 0 || row) {
            PermissionService.getRoles().then(function(data){
                openPermissionModal($scope, data.result, row);
            })
        }
    }

    /*权限设置弹层*/
    var openPermissionModal = function (pscope, roles, row) {
        var modalInstance = $uibModal.open({
            size: 'ml',
            animation: true,
            template: roleTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.roles = roles;

                if (row) {
                    angular.forEach($scope.roles, function(v,i){
                        if (v.dataName === row.dataRole) {
                            // set default selected status.
                            v.code = v.dataCode;
                            v.checked = true;
                        }
                    })
                }

                $scope.ok = function () {
                    let selected = $scope.getSelected();
                    if (selected) {
                        var data = {
                            ids: row ? [row.id] : _.map(pscope.selectData, 'id'),
                            dataRole: selected.dataCode
                        }
                        pscope.setPermission(data, function () {
                            $uibModalInstance.close();
                        });
                    }
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.getSelected = function(){
                    let result = null;
                    angular.forEach($scope.roles, function(v,i){
                        if (v.checked) {
                            result = v;
                        }
                    })
                    return result;
                }

                $scope.selectRow = function(row) {
                    angular.forEach($scope.roles, function(v,i){
                        if (v.dataCode === row.dataCode) {
                            // set selected status.
                            v.checked = true;
                        } else {
                            v.checked = false;
                        }
                    })
                }
                
            }]
        });
        modalInstance.opened.then(function () {
            // update attr checked of adData
        });

        modalInstance.result.then(function (result) {
            // console.log(result); //result关闭是回传的值
        }, function (reason) {
            // console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
        });
    };

    


    
}


angular.module('controller')
    .controller("PermissionController", PermissionController);