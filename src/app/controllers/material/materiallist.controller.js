/**
 * Created by leiz on 2017/3/23.
 */
import * as constant from '../../constant';
MaterialListController.$inject = ['$scope', "$rootScope", "$timeout", 'toastr', 'MaterialService'];

function MaterialListController($scope, $rootScope, $timeout, toastr, MaterialService) {
    $scope.viewModel = {
        ShowInfoText: "素材状态",
        formData: {
            account: $rootScope.currentuser_email,
            taskState: "",
            condition: ""
        }
    };
    $scope.initPage = function () {
        getTaskState();
    };
    //获取字典数据
    let getTaskState = function () {
        MaterialService.getMaterialStatus()
            .then(function (data) {
                if (data && data.code == 200) {
                    $scope.viewModel.taskStateList = data.result;
                }
            });
    };

    let getMaterialTaskList = function (no, size, reInit) {
        let arg = "?pageNo=" + no + "&pageSize=" + size;
        let urlParas = arg + "&account=" + $scope.viewModel.formData.account + "&taskState=" + $scope.viewModel.formData.taskState + "&condition=" + $scope.viewModel.formData.condition;
        MaterialService.getMaterialList(urlParas)
            .then(function (data) {
                    if (data && data.code == 200) {
                        $scope.tableData = data.result
                        if (reInit) {
                            $timeout(function () {
                                $rootScope.$broadcast('modelInitialized', this);
                            }, 500);
                        }
                    }
                }
            );
    };
    let pageSize = 10, pageNo = 1;
    getMaterialTaskList(pageNo, pageSize, true);

    /*reload pagination data*/
    $scope.$on("dr.reloadPagination", function (scope, no, size) {
        getMaterialTaskList(no, size);
    });

    $scope.showInfoByTaskState = function (obj) {
        if (!angular.isObject(obj)) {
            $scope.viewModel.ShowInfoText = "素材状态";
            $scope.viewModel.formData.taskState = "";
        }
        else {
            $scope.viewModel.ShowInfoText = obj.taskName;
            $scope.viewModel.formData.taskState = obj.taskState;
        }
        getMaterialTaskList(pageNo, pageSize, true);

    };
    /**
     * 查询
     * */
    $scope.query = function () {
        getMaterialTaskList(pageNo, pageSize, true);
        //$state.go("main.materialdetail");
    };

}

angular.module('controller').controller("MaterialListController", MaterialListController);
