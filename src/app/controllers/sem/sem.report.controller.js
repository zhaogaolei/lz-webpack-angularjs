/**
 * Created by leiz on 2017/12/4.
 */
/**
 * sem主报表
 */
SemReportController.$inject = ["$scope", "$timeout", "$rootScope", "$state", "SemReportService", "toastr"];

function SemReportController($scope, $timeout, $rootScope, $state, SemReportService, toastr) {
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "请选择渠道"
    };
    $scope.defaultFieldText = "<i class='icon-icon-filter-outline'></i> 选择字段 ";
    $scope.defaultAccountText = "请选择账户";
    $scope.btnClass = "btn dropdown-toggle";
    $scope.viewModel = {
        semChannel: {
            channel: [],
            channelSelected: []
        },
        semAccount: {
            account: [],
            accountSelected: []
        },
        isShowTable: true,
        field: [
            {key: 'accountNo', value: '账户', selected: true},
            {key: 'campaignName', value: '推广计划名称', selected: true},
            {key: 'adgroupName', value: '推广单元名称', selected: true},
            {key: 'matchType', value: '匹配模式', selected: true},
            {key: 'cost', value: '消费', selected: true},
            {key: 'avgClickPrice', value: '平均点击价格', selected: true},
            {key: 'click', value: '点击', selected: true},
            {key: 'shows', value: '展现', selected: true},
            {key: 'clickRate', value: '点击率', selected: true},
            {key: 'costShowMille', value: '千次展现消费', selected: true},
            {key: 'registerNum', value: '注册数', selected: true},
            {key: 'investFirstNum', value: '首投人数', selected: true},
            {key: 'investFirstAmount', value: '首投金额', selected: true},
            {key: 'investNum', value: '投资人数', selected: true},
            {key: 'investAmount', value: '投资金额', selected: true}

        ],
        fieldSelected: []
    };

    /**
     * 字段过滤
     */
    $scope.fieldChange = () => {
        if ($scope.viewModel.fieldSelected.length === 0) {
            $scope.viewModel.isShowTable = false;
        } else {
            $scope.viewModel.isShowTable = true;
        }
    };
    $scope.filterField = (field) => {
        let fieldArray = $scope.viewModel.fieldSelected.filter(f => {
            return f.key === field;
        });
        if (fieldArray.length > 0) {
            return true;
        } else {
            return false;
        }
    };


    /**
     * 获取sem渠道和账户
     */
    let getSemRefferalAccount = () => {
        SemReportService.getSemRefferalAccount()
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.viewModel.semChannel.channel = data.result;
                }
            });
    };
    /**
     * 获取sem渠道对应的账户
     */
    $scope.semChannelChange = () => {
        let channelSelected = $scope.viewModel.semChannel.channelSelected[0];
        $scope.viewModel.semAccount.account = channelSelected.semAccountList;
    };
    $scope.semChannelReset = () => {
        $scope.viewModel.semAccount.account = [];
    };

    /**
     * 列表查询
     */
    let pageSize = 10, pageNo = 1;
    $scope.query = () => {
        getMainReportList(pageNo, pageSize, true, null, null);
    };
    let getPostData = () => {
        let channelSelected = $scope.viewModel.semChannel.channelSelected;
        let accountSelected = $scope.viewModel.semAccount.accountSelected;
        let accountIdArray = [];
        angular.forEach(accountSelected, (data) => {
            accountIdArray.push(data.id);
        });
        return {
            refferalId: channelSelected.length > 0 ? channelSelected[0].id : "",
            accountId: accountIdArray
        }
    };
    let getMainReportList = (no, size, reInit, column, sort) => {
        let postData = getPostData();
        postData.pageNo = no;
        postData.pageSize = size;
        postData.sortName = column;
        postData.sortOrder = sort;
        SemReportService.getSemReportMain(postData)
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
    $scope.$on("dr.mainReportPagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getMainReportList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getMainReportList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getMainReportList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getMainReportList(pageNo, pageSize, true, null, null);
        }
    });

    /**
     * 查看明细报表
     */
    $scope.viewDetailReport = (row) => {
        $rootScope.refferalId = row.refferalId;
        $rootScope.accountNo = row.accountNo;
        $rootScope.campaignName = row.campaignName;
        $rootScope.adgroupName = row.adgroupName;
        $rootScope.matchCode = row.matchTypeCode;

        $state.go('main.semreportdetail', {id:row.accountId});//refferalId: refferalId, accountId: accountId
    };

    /**
     * 导出主报表
     */
    $scope.exportMainReport = () => {
        let postData = getPostData();
        postData.reportType = "main"; //标识导出主报表
        //追加导出字段
        let reportFieldsArray = [];
        angular.forEach($scope.viewModel.fieldSelected, (data) => {
            reportFieldsArray.push(data.key);
        });
        postData.reportFields = reportFieldsArray;
        SemReportService.semReportExport(postData)
            .then(function (result) {
                let linkElement = document.createElement('a');
                try {
                    let fileName = "SEM主报表.xlsx";
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

    $scope.initPage = () => {
        getSemRefferalAccount();
    };
    $scope.initPage();
};

/**
 * sem明细报表
 */
SemReportDetailController.$inject = ["$scope", "$timeout", "$rootScope", "$filter", "$state", "$stateParams", "SemReportService", "toastr","$uibModal"];

function SemReportDetailController($scope, $timeout, $rootScope, $filter, $state, $stateParams, SemReportService, toastr,$uibModal) {
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
    $scope.formData = {
        keyword: '',
        startDate: '',
        endDate: ''
    };
    $scope.defaultFieldText = "<i class='icon-icon-filter-outline'></i> 选择字段 ";
    $scope.btnClass = "btn dropdown-toggle";
    $scope.viewModel = {
        isShowTable: true,
        field: [
            {key: "accountNo", value: "账户", selected: true},
            {key: "campaignName", value: "推广计划名称", selected: true},
            {key: "adgroupName", value: "推广单元名称", selected: true},
            {key: "keyword", value: "关键词名称", selected: true},
            {key: "matchType", value: "匹配模式", selected: true},
            {key: "price", value: " 出价", selected: true},
            {key: "pcUrl", value: " 访问URL", selected: true},
            {key: "mobileUrl", value: "移动访问URL", selected: true},
            {key: "pause", value: "启动/暂停", selected: true},
            {key: "status", value: "关键词状态", selected: true},
            {key: "cost", value: "消费", selected: true},
            {key: "avgClickPrice", value: "平均点击价格", selected: true},
            {key: "click", value: "点击", selected: true},
            {key: "shows", value: "展现", selected: true},
            {key: "clickRate", value: "点击率", selected: true},
            {key: "costShowMille", value: "千次展现消费", selected: true},
            {key: 'registerNum', value: '注册数', selected: true},
            {key: 'investFirstNum', value: '首投人数', selected: true},
            {key: 'investFirstAmount', value: '首投金额', selected: true},
            {key: 'investNum', value: '投资人数', selected: true},
            {key: 'investAmount', value: '投资金额', selected: true}
        ],
        fieldSelected: []
    };
    /**
     * 字段过滤
     */
    $scope.fieldChange = () => {
        if ($scope.viewModel.fieldSelected.length === 0) {
            $scope.viewModel.isShowTable = false;
        } else {
            $scope.viewModel.isShowTable = true;
        }
    };
    $scope.filterField = (field) => {
        let fieldArray = $scope.viewModel.fieldSelected.filter(f => {
            return f.key === field;
        });
        if (fieldArray.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 明细列表查询
     * */
    let pageSize = 10, pageNo = 1;
    $scope.query = () => {
        getDetailReportList(pageNo, pageSize, true, null, null);
    };
    let getPostData = () => {
        let refferalId =  $rootScope.refferalId;
        let accountId = $stateParams.id;
        let accountNo = $rootScope.accountNo;
        let campaignName = $rootScope.campaignName;
        let adgroupName = $rootScope.adgroupName;
        let matchCode = $rootScope.matchCode;
        return {
            refferalId: refferalId,
            accountId: [accountId],
            accountNo:accountNo,
            campaignName:campaignName,
            adgroupName:adgroupName,
            matchType:matchCode,
            keyword: $scope.formData.keyword,
            startDate: dateFilter($scope.formData.startDate, "yyyy-MM-dd"),
            endDate:dateFilter($scope.formData.endDate, "yyyy-MM-dd")
        }
    };
    let getDetailReportList = (no, size, reInit, column, sort) => {
        let postData = getPostData();
        postData.pageNo = no;
        postData.pageSize = size;
        postData.sortName = column;
        postData.sortOrder = sort;
        SemReportService.getSemReportDetail(postData)
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
    $scope.$on("dr.detailReportPagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getDetailReportList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getDetailReportList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getDetailReportList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getDetailReportList(pageNo, pageSize, true, null, null);
        }
    });

    /**
     * 导出明细报表
     */
    $scope.exportDetailReport = () => {
        let postData = getPostData();
        postData.reportType = "detail"; //标识导出明细报表
        //追加导出字段
        let reportFieldsArray = [];
        angular.forEach($scope.viewModel.fieldSelected, (data) => {
            reportFieldsArray.push(data.key);
        });
        postData.reportFields = reportFieldsArray;
        SemReportService.semReportExport(postData)
            .then(function (result) {
                let linkElement = document.createElement('a');
                try {
                    let fileName = "SEM明细报表.xlsx";
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

    /*返回主报表*/
    $scope.goToSemReport = () => {
        $state.go("main.semreport");
    };

    $scope.query();
};

angular.module('controller')
    .controller("SemReportController", SemReportController)
    .controller("SemReportDetailController", SemReportDetailController);