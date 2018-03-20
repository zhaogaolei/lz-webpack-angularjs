import * as constant from '../../constant';
import deleteTpl from '../../templates/modal-delete.html';
import mainDataTpl from '../../templates/modal-maindata.html';


/*
 * maindata控制器
 */
MainDataController.$inject = ['$rootScope', '$scope', 'MainDataService', '$stateParams', '$state', '$timeout'];

function MainDataController($rootScope, $scope, MainDataService, $stateParams, $state, $timeout) {
    /*
     *查询maindata by pagination
     */
    $scope.queryPaginationList = function (no, size, reInit) {
        let arg = {
            pageNo: no,
            pageSize: size ? size : 20
        }
        MainDataService.queryPaginationList(arg).then(function (data) {
            if (data && data.code == '200') {
                $scope.mainData = data.result;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            }
        });
    }

    let pageSize = 10, pageNo = 1;
    $scope.queryPaginationList(pageNo, pageSize, true);


    /*reload pagination data*/
    $scope.$on("dr.mainDataPagination", function (scope, no, size) {
        $scope.queryPaginationList(no, size);
    });

    $scope.go = function (id, code, name) {
        $state.go('main.maindataedit', {id: id, code: code, name: name});
    }
}


/*
 * maindataedit控制器
 */
MainDataEditController.$inject = ['$scope', 'MainDataService', '$stateParams', '$uibModal', 'toastr', 'UpLoadService'];

function MainDataEditController($scope, MainDataService, $stateParams, $uibModal, toastr, UpLoadService) {
    $scope.mainDataName = $stateParams.name;
    $scope.isShowExcelImport = ($stateParams.code == "banner_place"
    || $stateParams.code == "banner_type"
    || $stateParams.code === "refferal_type") ? true : false;
    /*
     *查询maindataedit
     */
    $scope.queryList = function () {
        if ($stateParams.code && $stateParams.name) {
            $scope.title = $stateParams.name;
            //SEM需求改造，为了保持dashboard一致，默认查询非SEM的，1查询所有的，2非SEM的，3只SEM的
            if($stateParams.code=="refferal_type"){
                $stateParams.code="refferal_type?range=1";
            }
            MainDataService.getSubDataByCode($stateParams.code).then(function (data) {
                if (data && data.code == '200') {
                    $scope.mainSubData = data.result;
                }
            });
        }
    }
    $scope.queryList();
    /*添加主-子数据*/
    $scope.addMainData = function () {
        modalForData($scope, $scope.title, $stateParams.code, $stateParams.id);
    }
    /*更新主-子数据*/
    $scope.updateMainData = function (row) {
        modalForData($scope, $scope.title, null, null, row);
    }
    /*删除主-子数据*/
    $scope.removeMainData = function (id) {
        if (id) {
            MainDataService.removeSubData(id).then(function (data) {
                if (data && data.code == '200') {
                    $scope.queryList();
                    if ($stateParams.code == "banner_place"
                        || $stateParams.code == "banner_type"
                        || $stateParams.code === "refferal_type") {
                        toastr.success('删除成功,请上传更新对应模板!');
                    } else {
                        toastr.success('删除成功!');
                    }
                }
            });
        }
    }


    $scope._addMainData = function (arg, callback) {
        if (arg) {
            if ($stateParams.id) arg.parentId = $stateParams.id;
            MainDataService.addSubData(arg).then(function (data) {
                if (data && data.code == '200') {
                    if ($stateParams.code == "banner_place"
                        || $stateParams.code == "banner_type"
                        || $stateParams.code === "refferal_type") {
                        toastr.success('添加成功,请上传更新对应模板!');
                    } else {
                        toastr.success('添加成功!');
                    }
                    callback();
                    $scope.queryList();
                }
            });
        }
    }

    $scope._updateMainData = function (arg, callback) {
        MainDataService.updSubData(arg).then(function (data) {
            if (data && data.code == '200') {
                if ($stateParams.code == "banner_place"
                    || $stateParams.code == "banner_type"
                    || $stateParams.code === "refferal_type") {
                    toastr.success('修改成功,请上传更新对应模板!');
                } else {
                    toastr.success('修改成功!');
                }
                callback();
                $scope.queryList();
            }
        });
    }

    let modalForData = function (pscope, title, mainDataCode, id, row) {
        var modalInstance = $uibModal.open({
            size: 'ml',
            animation: true,
            template: mainDataTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.title = title;
                $scope.isShowBussinessType = $stateParams.code == "business_product" ? true : false;
                $scope.data = {
                    dataCode:"",
                    dataName:"",
                    dataType:""
                };
                if (row) {
                    $scope.data = _.clone(row);
                }

                /*生成主数据code*/
                $scope.generateCode = function (title, dataName) {
                    if (dataName && !row) {
                        MainDataService.getSubDataCode(mainDataCode + "/" + id).then(function (data) {
                            if (data && data.code == '200') {
                                $scope.data.dataCode = data.result;
                            }
                        });
                    }
                }
                /*移除非法字符：/*/
                $scope.removeInvalidChar = function () {
                    if ($scope.data.dataName) {
                        $scope.data.dataName = $scope.data.dataName.replace(/\//g, '');
                    }
                }

                $scope.ok = function () {
                    if ($scope.isShowBussinessType && !$scope.data.dataType) {
                        toastr.error("适用业务不能为空！")
                        return;
                    }
                    if ($scope.data.dataName && $scope.data.dataCode) {
                        if (row) {
                            pscope._updateMainData($scope.data, function () {
                                $uibModalInstance.dismiss('cancel');
                            });
                        } else {
                            pscope._addMainData($scope.data, function () {
                                $uibModalInstance.dismiss('cancel');
                            });
                        }
                    } else {
                        toastr.error("名称和代码不能为空！")
                    }
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.changeData = function (row, event) {
                    //console.log(row.checked, row.id)
                }
            }]
        });
        modalInstance.opened.then(function () {
            //console.log('modal is opened');

        });

        modalInstance.result.then(function (result) {
        }, function (reason) {
        });
    }

    $scope.removeMainDataModal = function (id) {
        modalForDel($scope, id);
    }
    let modalForDel = function (pscope, id) {
        var modalInstance = $uibModal.open({
            size: 'sm',
            animation: true,
            template: deleteTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {

                $scope.ok = function () {
                    pscope.removeMainData(id);
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {

        });

        modalInstance.result.then(function (result) {
        }, function (reason) {
        });
    }

    /**
     * 下载广告位模板
     * */
    $scope.downTemplate = function () {
        let data = {};
        let downloadFileName = "";
        if ($stateParams.code == "banner_place"
            || $stateParams.code == "banner_type") {
            data.busType = "sys_template_banner";
            downloadFileName = "banner-template.xlsx";
        } else if ($stateParams.code === "refferal_type") {
            data.busType = "sys_template_refferal";
            downloadFileName = "refferal-template.xlsx";
        }
        $scope.showProgress = true;
        MainDataService.downloadFile(data) // DOWNLOAD AD_TEMPLATE_DOWNLOAD
            .then(function (result) {
                $scope.showProgress = false;
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, downloadFileName);
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", downloadFileName);
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
    };

    /**
     * 上传广告位模板
     * */
    $scope.selectFile = "";
    $scope.uploadFiles = function (file) {
        if ($scope.selectFile == "" || $scope.selectFile == null) {
            toastr.warning("请先选择附件！", "Warning");
            return;
        }
        $scope.showProgress = true;
        let postData = {file: file};
        if ($stateParams.code == "banner_place"
            || $stateParams.code == "banner_type") {
            postData.bsType = "sys_template_banner";
        } else if ($stateParams.code === "refferal_type") {
            postData.bsType = "sys_template_refferal";
        }
        UpLoadService.UpLoadFile(constant.UPLOAD, postData)
            .then(function (response) {
                $scope.showProgress = false;
                if (response.code != 200) {
                    toastr.warning(response.msg, "Warning");
                    return;
                }
                toastr.success("上传成功！", "Success");
                $scope.selectFile = "";
            }, function (response) {
                $scope.showProgress = false;
                console.log('Error status' + response.status);
            });
    };


}


angular.module('controller')
    .controller("MainDataController", MainDataController)
    .controller("MainDataEditController", MainDataEditController);



