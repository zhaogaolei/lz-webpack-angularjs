/**
 * Created by leiz on 2017/12/20.
 */
ActivityDataController.$inject = ['$scope', '$filter', 'ActivityDataService'];

function ActivityDataController($scope, $filter, ActivityDataService) {
    let dateFormat = $filter("date");
    $scope.vm = {};
    /*部分导出*/
    $scope.exportActivityDataByPageId = () => {
        let postData = {
            "pageId": $scope.vm.pageId || ""
        };
        ActivityDataService.activityDataExportByPageId(postData)
            .then(function (result) {
                let linkElement = document.createElement('a');
                try {
                    let fileName = `活动数据${dateFormat(new Date(), "yyyyMMddHHmmss")}.xlsx`;
                    let blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
                        let clickEvent = new MouseEvent("click", {
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

    /*导出所有*/
    $scope.exportActivityData = () => {
        ActivityDataService.activityDataExport()
            .then(function (result) {
                let linkElement = document.createElement('a');
                try {
                    let fileName = `活动数据${dateFormat(new Date(), "yyyyMMddHHmmss")}.xlsx`;
                    let blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        let url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
                        let clickEvent = new MouseEvent("click", {
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

};

angular.module('controller')
    .controller('ActivityDataController', ActivityDataController);