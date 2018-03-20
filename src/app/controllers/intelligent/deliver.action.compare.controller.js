/**
 * Created by leiz on 2017/8/21 18:12.
 */
import daCompareTpl from '../../templates/modal-deliver-compare.html';

DeliverActionCompareController.$inject = ["$scope", "$uibModal", "$timeout", "$rootScope", "$filter", "$state", "$cookieStore", "DaCompareService", "toastr"];

function DeliverActionCompareController($scope, $uibModal, $timeout, $rootScope, $filter, $state, $cookieStore, DaCompareService, toastr) {
    let dateFilter = $filter('date');
    /**
     * ROI 权重
     */
    $scope.registerRoi = {
        value: 50,
        options: {
            floor: 0,
            ceil: 100,
            id: 'registerRoi-translate-slider',
            getPointerColor: function (value) {
                return '#37a884'
            },
            translate: function (value, id, which) {
                return value + "%";
            },
            onChange: function (id, newValue, highValue, pointerType) {
                $scope.investRoi.value = 100 - newValue;
            }
        }
    };
    $scope.investRoi = {
        value: 50,
        options: {
            floor: 0,
            ceil: 100,
            id: 'investRoi-translate-slider',
            getPointerColor: function (value) {
                return '#37a884'
            },
            translate: function (value, id, which) {
                return value + "%";
            },
            onChange: function (id, newValue, highValue, pointerType) {
                $scope.registerRoi.value = 100 - newValue;

            }
        }
    };

    /**
     * 新建投放对比--调用规则
     */
    $scope.createDaCompare = () => {
        let parent = $scope;
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: daCompareTpl,
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                /**本地化多选下拉框*/
                $scope.localLang = {
                    selectAll: "全选",
                    selectNone: "全不选",
                    reset: "重置",
                    search: "搜索...",
                    nothingSelected: "请选择"
                };
                $scope.registerRoi = parent.registerRoi;
                $scope.investRoi = parent.investRoi;
                //初始化
                let initDrop = () => {
                    //绑定渠道
                    $scope.refferal = {
                        refferalList: angular.copy(rList),
                        selectedRefferal: []
                    };
                    //绑定投放计划
                    $scope.deliverPlan = {
                        deliverPlanList: angular.copy(dList),
                        selectedDeliverPlanList: []
                    };
                    //绑定投放动作
                    $scope.deliver = {
                        deliverActionList: [],
                        selectedDeliverActionList: []
                    };
                    $scope.viewModel = {
                        isShowScoreRule: false
                    };
                    $scope.registerRoi.value = 50;
                    $scope.investRoi.value = 50;
                };

                let rList = parent.refferalList || [];
                let dList = parent.deliverPlanList || [];
                initDrop();
                /*tab click*/
                let tabType = "refferal"; //默认展示渠道对比tab
                $scope.tabClick = (type) => {
                    tabType = type;
                    /*每次切换tab重置输入框*/
                    $scope.formData = null;
                    initDrop();
                };
                $scope.refferalChange = () => {
                    let selectIds = [];
                    if (tabType === "refferal") {
                        angular.forEach($scope.refferal.selectedRefferal, (data) => {
                            selectIds.push(data.refferalId);
                        });
                    }
                    else {
                        angular.forEach($scope.deliverPlan.selectedDeliverPlanList, (data) => {
                            selectIds.push(data.id);
                        });
                    }
                    /*未选中任何渠道将投放动作置空*/
                    if (selectIds.length === 0) {
                        $scope.deliver.deliverActionList = [];
                        return;
                    }
                    /*获取投放动作*/
                    let d = {
                        selectIds: selectIds,
                        type: tabType
                    };
                    DaCompareService.getDeliverActionList(d)
                        .then((data) => {
                            if (data && data.code == 200) {
                                angular.forEach(data.result, (d, i, a) => {
                                    d.showIdForBtn = `投放动作ID:${d.id}`;
                                    d.showTextForDrop = `投放动作ID:${d.id}；投放计划：${d.campaignName}；渠道名称：${d.bizName}；广告位：${d.bannerName}；结算：${d.clearingFormValue}`;
                                });
                                $scope.deliver.deliverActionList = data.result;
                            }
                        });
                };

                /*日期控件*/
                $scope.popup = {
                    opened: false
                };
                $scope.open = function () {
                    $scope.popup.opened = true;
                };
                $scope.popup2 = {
                    opened: false
                };
                $scope.open2 = function () {
                    $scope.popup2.opened = true;
                };
                /*开始对比*/
                $scope.startCompare = () => {
                    $scope.viewModel.isShowScoreRule = true;
                };
                /*确定*/
                $scope.ok = () => {
                    //TODO 保存数据
                    let postData = angular.copy($scope.formData);
                    /*日期校验 理想值校验*/
                    if (DaCompareService.dataValid(postData)) {
                        //日期格式化
                        postData.starDate = $scope.formData.starDate ? dateFilter($scope.formData.starDate, "yyyy-MM-dd") : "";
                        postData.endDate = $scope.formData.endDate ? dateFilter($scope.formData.endDate, "yyyy-MM-dd") : "";
                        //追加投放ID
                        postData.publishIds = [];
                        angular.forEach($scope.deliver.selectedDeliverActionList, (item) => {
                            postData.publishIds.push(item.id);

                        });
                        //追加注册、投资权重值
                        postData.registerWeight = $scope.registerRoi.value;
                        postData.investWeight = $scope.investRoi.value;
                        abtCompare(postData, $scope.cancel);
                    }
                };
                $scope.cancel = () => {
                    $uibModalInstance.dismiss('cancel');
                };
            }]
        });
        modalInstance.opened.then(function () {
        });
        modalInstance.result.then(function (result) {
                //console.log(result);
            },
            function (reason) {
                //console.log(reason);
            });
    };

    /**
     * 评分规则--调用规则
     */
    $scope.isShow = false
    $scope.formData = {
        registerBestValue: '',
        investBestValue: ''
    };
    $scope.submitScoreRule = () => {
        let requestData = $scope.formData;
        //追加注册、投资权重值
        requestData.registerWeight = $scope.registerRoi.value;
        requestData.investWeight = $scope.investRoi.value;
        if (DaCompareService.dataValid(requestData)) {
            abtCompare(requestData, () => {
                //关闭规则面板
                $scope.isShow = false;
            });
        }
    };
    /**
     * 调用规则
     */
    let abtCompare = (postData, callback) => {
        DaCompareService.AddCompare(postData)
            .then((data) => {
                if (data) {
                    if (callback) {
                        callback();
                    }
                    //提示
                    toastr.success("操作成功！");
                    //刷新列表
                    getDaCompareList(1, 10, true);
                    //刷新规则显示
                    getLastOption();
                }
            });
    };

    /**
     * 列表查询
     */
    let getDaCompareList = (no, size, reInit, column, sort) => {
        let arg = "?pageNo=" + no + "&pageSize=" + size;
        if (column && sort) {
            arg += "&sort=" + column + "_" + sort;
        }
        return DaCompareService.getCompareList(arg)
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
    }
    /*reload pagination data*/
    $scope.$on("dr.comparePagination", function (event, no, size) {
        if ($scope.column && $scope.sort) {
            getDaCompareList(no, size, false, $scope.column, $scope.sort);
        }
        else {
            getDaCompareList(no, size, false, null, null);
        }
    });
    $scope.$on('sortEvent', function (event, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            getDaCompareList(pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            getDaCompareList(pageNo, pageSize, true, null, null);
        }
    });
    /**
     * 去投放
     * @param dpId  投放计划ID
     * @param daId  投放动作ID
     * @param campaignName  投放计划名称
     */
    $scope.toTouFang = (dpId, daId, campaignName) => {
        /*id:投放计划ID ,
            campaignName:投放计划名称，
            daId:投放动作ID(从投放计划列表进入时，默认0)，
            from:从哪里跳转到投放动作列表(dp:投放计划页面，dc:投放对比页面)
         */
        $cookieStore.put("daCompare", {daId: daId, from: 'dc'});
        $state.go('main.deliverplanmgr', {id: dpId, campaignName: campaignName});
    };

    /**
     * 获取渠道列表
     */
    let getRefferalList = () => {
        DaCompareService.getRefferalList()
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.refferalList = data.result;
                }
            });
    };
    /**
     * 获取投放计划列表
     */
    let getDeliverPlanList = () => {
        DaCompareService.getDeliverPlanList()
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.deliverPlanList = data.result;
                }
            });
    };
    /**
     * 获取评分规则
     * */
    let getLastOption = () => {
        DaCompareService.GetAbtLastOption()
            .then((data) => {
                $scope.showDefaultText = data && data.result ? data.result : "请选择评分规则";
            });
    };
    /**
     * 初始化投放对比
     * */
    let compareInit = () => {
        DaCompareService.compareInit()
            .then((data) => {
                if (data && data.code == 200) {
                    getDaCompareList(1, 10, true);
                    getLastOption();
                }
            });
    };
    $scope.initPage = () => {
        getRefferalList();
        getDeliverPlanList();
        compareInit();
        // $q.all([getDaCompareList(1, 10, true)])
        //     .then(() => {
        //         /*第一次加载如果没有数据，自动调用评分规则*/
        //         if ($scope.tableData.result.length === 0) {
        //             abtCompare({
        //                 registerBestValue: 30,
        //                 investBestValue: 100,
        //                 registerWeight: $scope.registerRoi.value,
        //                 investWeight: $scope.investRoi.value
        //             });
        //         }
        //     });
    };
    $scope.initPage();
};

angular.module('controller')
    .controller("DeliverActionCompareController", DeliverActionCompareController);