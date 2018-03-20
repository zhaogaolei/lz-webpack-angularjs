/**
 * Created by leiz on 2017/3/23.
 */
import * as constant from '../../constant';
MaterialDetailController.$inject = ['$scope', "$stateParams", "$state", "MaterialService", 'toastr', "UpLoadService"];

function MaterialDetailController($scope, $stateParams, $state, MaterialService, toastr, UpLoadService) {
    $scope.viewModel = {
        isShowAcceptBtn: true,
        isShowMateriallist: false,
        showProgress: false,
        isShowNotice: false
    }
    ;
    $scope.initPage = function () {
        getMaterialTaskById();
    };
    //http://ip:port/materialTask/selectMaterialTask/id
    let getMaterialTaskById = function () {
        MaterialService.getMaterialTaskById($stateParams.materialId)
            .then(function (data) {
                    if (data && data.code == '200') {
                        //绑定数据
                        $scope.selectMaterialTask = data.result;
                        if ($scope.selectMaterialTask.taskState == "publish_task_100") {
                            $scope.viewModel.isShowAcceptBtn = true;
                            $scope.viewModel.isShowMateriallist = false;
                        }
                        else {
                            $scope.viewModel.isShowAcceptBtn = false;
                            $scope.viewModel.isShowMateriallist = true;
                            $scope.viewModel.showCurrentTime = $scope.selectMaterialTask.recipientTime;
                            getMaterialList();
                        }
                    }
                }
            );
    };

    /**
     * 接受任务
     * */
    $scope.acceptTask = function () {
        MaterialService.acceptTask($stateParams.materialId)
            .then(function (data) {
                    if (data && data.code == '200') {
                        toastr.success("操作成功！", "Success");
                        /**
                         * 隐藏接受按钮
                         * 显示素材列表
                         * */
                        $scope.viewModel.showCurrentTime = data.result;
                        $scope.viewModel.isShowAcceptBtn = false;
                        $scope.viewModel.isShowMateriallist = true;
                        getMaterialList();
                    }
                }
            );
    };
    /**
     * 获取素材管理列表
     * */
    let getMaterialList = function () {
        let postData = {
            "busType": "task_matter",
            "materialTaskId": $stateParams.materialId
        };
        MaterialService.getMaterialDetailList(postData)
            .then(function (data) {
                    if (data && data.code == '200') {
                        $scope.MaterialManangeList = data.result;
                    }
                }
            );
    };
    /**
     * 获取操作记录
     * */
    $scope.getOperateRecord = function () {
        MaterialService.getOperateRecord($stateParams.materialId)
            .then(function (data) {
                    if (data && data.code == '200') {
                        //绑定数据
                        $scope.OperateRecordList = data.result;
                    }
                }
            );
    };

    let fId, optType; // 操作类型：materialUpload/materialDelete
    /**
     * 上传附件
     * */
    $scope.viewModel.attachmentFile = "";
    $scope.upload = function (file) {
        if ($scope.viewModel.attachmentFile) {
            $scope.uploadMsg = "";
            $scope.viewModel.showProgress = true;
            let ids = $stateParams.materialId;
            let postData = {bsType: "task_matter", materialTaskIds: ids, file: file};
            UpLoadService.UpLoadFile(constant.UPLOAD, postData)
                .then(function (data) {
                    $scope.viewModel.showProgress = false;
                    if (data && data.code != '200') {
                        $scope.uploadMsg = data.msg;
                        //toastr.warning(data.msg);
                        $scope.viewModel.attachmentFile = "";
                        return;
                    }
                    //清空选择文件
                    $scope.viewModel.attachmentFile = "";
                    //重新加载数据
                    getMaterialList();
                    fId = data.result.fileId;
                    optType = "materialUpload";
                    $scope.viewModel.isShowNotice = true;
                }, function (error) {
                    $scope.viewModel.showProgress = false;
                    console.log(error)
                })
        }
    };

    /**
     * 下载投放计划附件 --素材管理附件
     * */
    $scope.downLoadFile = function (id, fileId, contentType, fileName, busType) {
        var data = {
            busType: busType,
            id: id,
            materialId: fileId,
            materialTaskId: $stateParams.materialId
        };
        MaterialService.downLoadAttchFile(data)
            .then(function (data, status, headers, config) {
                var blob = new Blob([data], {type: contentType});
                if (window.navigator.msSaveOrOpenBlob) {
                    // for ie only
                    window.navigator.msSaveOrOpenBlob(blob, fileName);
                } else {
                    var a = document.createElement("a");
                    document.body.appendChild(a);
                    a.download = fileName;
                    a.href = URL.createObjectURL(blob);
                    a.click();
                }
            })
    };

    /**
     * 删除附件
     * */
    $scope.deleteFile = function (fileId) {
        MaterialService.deleteAttchFile(fileId)
            .then(function (data) {
                    if (data && data.code == '200') {
                        toastr.success("附件删除成功！", "Success");
                        //重新加载数据
                        getMaterialList();
                        fId = fileId;
                        optType = "materialDelete";
                        //显示邮件通知
                        $scope.viewModel.isShowNotice = true;
                    }
                }
            );
    };

    /**
     * 邮件通知
     * */
    $scope.noticeEmail = function () {
        let postData = {"id": fId, "operationType": optType};
        MaterialService.sendEmail(postData)
            .then(function (data) {
                    if (data && data.code == '200') {
                        toastr.success("邮件发送成功！", "Success");
                        $scope.viewModel.isShowNotice = false;
                    }
                }
            );
    };

    /**
     * 不用了
     * */
    $scope.notNotice = function () {
        $scope.viewModel.isShowNotice = false;
    };
}


angular.module('controller').controller("MaterialDetailController", MaterialDetailController);
