import * as constant from '../../constant';
import bannerTpl from '../../templates/modal-banner-add.html';
AdListController.$inject = ['$scope', "$stateParams", '$uibModal', 'toastr', 'UpLoadService', '$timeout', '$rootScope', 'AdService'];

function AdListController($scope, $stateParams, $uibModal, toastr, UpLoadService, $timeout, $rootScope, AdService) {
    $scope.viewModel = {
        pageTitle: $stateParams.channelname,
        bannerList: {}
    };
    /**
     * 页面初始化
     * */
    $scope.initPage = function () {
        getBannerList(1, 10, true);
    };
    /**
     * 获取广告位列表
     * */
    let getBannerList = function (no, size, reInit) {
        let data = {
            pageNo: no ? no : 1,
            pageSize: size ? size : 10,
            refferalId: $stateParams.id
        };
        AdService.getBannerList(data)
            .then(function (data) {
                if (data.code != 200) {
                    toastr.warning(data.msg, "Warning");
                    return;
                }
                //绑定数据
                $scope.viewModel.bannerList = data.result;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            })
    };

    /*reload pagination data*/
    $scope.$on("dr.bannerPagination", function (scope, no, size) {
        getBannerList(no, size);
    });


    /**
     * 新增-编辑广告位-modal
     * */
    $scope.openBannerModal = function (bannerId) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: bannerTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                getBannnerTypelist($scope);
                getBannnerPositionlist($scope);
                if (bannerId) {//编辑
                    AdService.getBannerInfoById(bannerId)
                        .then(function (data) {
                            if (data && data.code == '200') {
                                $scope.formData = data.result;
                                // $scope.viewModel.bannerData.id = banner.id;
                                // $scope.viewModel.bannerData.bannerName = banner.bannerName;
                                // $scope.viewModel.bannerData.bannerType = banner.bannerType;
                                // $scope.viewModel.bannerData.bannerPosition = banner.bannerPosition;
                                // $scope.viewModel.bannerData.bannerPositionNote = banner.bannerPositionNote;
                                // $scope.viewModel.bannerData.bannerStandard = banner.bannerStandard;
                            }
                        });
                }
                else {//新增
                    $scope.formData = null;
                }
                /**
                 * 新增/编辑广告位
                 * */
                $scope.saveBanner = function () {
                    $scope.formData.refferalId = $stateParams.id; /** 渠道ID*/
                    AdService.saveBanner($scope.formData)
                        .then(function (data) {
                            if (data && data.code == '200') {
                                toastr.success("保存成功！", "Success");
                                $uibModalInstance.dismiss('cancel');
                                getBannerList(1, 10, true);
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

    /**
     * 获取广告位类型
     * */
    let getBannnerTypelist = function (scope) {
        AdService.getBannerType()
            .then(function (data) {
                if (data && data.code == '200') {
                    scope.bannerTypeList = data.result;
                }
            });
    };
    /**
     * 获取广告位置
     * */
    let getBannnerPositionlist = function (scope) {
        AdService.getBannerPosition()
            .then(function (data) {
                if (data && data.code == '200') {
                    scope.bannerPositionList = data.result;
                }
            });
    };

    /**
     * 下载模板
     * */
    $scope.downTemplate = function () {
        $scope.showProgress = true;
        AdService.downAdTemplate({busType: "sys_template_banner"})
            .then(function (result) {
                $scope.showProgress = false;
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, "banner-template.xlsx");
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", "banner-template.xlsx");
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
     * 导入广告位信息
     * */
    $scope.viewModel.selectFile = "";
    $scope.uploadFiles = function (file) {
        if ($scope.viewModel.selectFile == "") {
            toastr.warning("请先选择附件！", "Warning");
            return;
        }
        $scope.showProgress = true;
        let postData = {refferalId: $stateParams.id, file: file};
        UpLoadService.UpLoadFile(constant.AD_EXCEL_IMPORT_URL, postData)
            .then(function (response) {
                $scope.showProgress = false;
                if (response.code != 200) {
                    toastr.warning(response.msg, "Warning");
                    return;
                }
                toastr.success("导入成功！", "Success");
                $scope.viewModel.selectFile = "";
                document.querySelector("#btnCloseAdModal").click();
                getBannerList(1, 10, true);
            }, function (response) {
                console.log('Error status' + response.status);
            });
    };
}


angular.module('controller').controller("AdListController", AdListController);
