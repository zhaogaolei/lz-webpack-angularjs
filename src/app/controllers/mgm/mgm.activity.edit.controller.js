/**
 * Created by leiz on 2017/12/26.
 */
import mgmRuleTpl from '../../templates/mgm-rule-modal.html';
import mgmBehaviorTpl from '../../templates/mgm-rule-behavior-modal.html';

MgmActivityEditController.$inject = ['$rootScope', '$scope', 'MgmActivityEditService', '$state', 'ProxyLevelService', '$filter', 'toastr', '$uibModal', '$stateParams', '$sce'];

function MgmActivityEditController($rootScope, $scope, MgmActivityEditService, $state, ProxyLevelService, $filter, toastr, $uibModal, $stateParams, $sce) {
    let routeName = JSON.parse(localStorage.getItem("routeState")) || [];
    let dateFilter = $filter("date");
    $scope.mgmId = $stateParams.mgmId;
    $scope.copy = $stateParams.copyedit;
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

    /*获取部门*/
    let getDept = () => {
        MgmActivityEditService.getDept()
            .then(data => {
                if (data && data.code == 200) {
                    $scope.mgmDeptList = data.result;
                }
            });
    };

    /*投放渠道*/
    let getDeliverChannel = () => {
        MgmActivityEditService.getDeliverChannel()
            .then(data => {
                if (data && data.code == 200) {
                    $scope.mgmDeliverChannelList = data.result;
                }
            });
    };

    /*获取邀请方式*/
    let getInviteType = () => {
        MgmActivityEditService.getInviteType()
            .then(data => {
                if (data && data.code == 200) {
                    $scope.mgmInviteTypeList = data.result;
                }
            });
    };

    /*获取结算方式*/
    let getSettleType = () => {
        MgmActivityEditService.getSettleType()
            .then(data => {
                if (data && data.code == 200) {
                    $scope.mgmSettleTypeList = data.result;
                }
            });
    };

    /**
     * 根据mgmID 获取单条活动信息
     */
    let getMgmActivity = () => {
        if ($scope.mgmId == 0) {
            $scope.formData = {
                rules: []
            };
        } else {
            //编辑：根据mgmId获取活动信息
            MgmActivityEditService.queryByMgmId({"mgmId": $scope.mgmId})
                .then(data => {
                    if (data && data.code == 200) {
                        $scope.formData = data.result;
                        angular.forEach($scope.formData.rules, function (item) {
                            item.displayExpressionHtml = $sce.trustAsHtml(item.displayExpression); //编辑时，回显表达式
                        });
                        if ($scope.copy == 'copy') {
                            $scope.formData.mgmName += "副本";
                            $scope.formData.startTime = "";
                            $scope.formData.endTime = "";
                            $scope.formData.mgmId = null;
                            $scope.formData.activityStatus = "";
                            angular.forEach($scope.formData.rules, function (item) {
                                angular.forEach(item.atoms, function (rule) {
                                    rule.id = null;
                                });
                            });

                        }

                    }
                });
        }
    };
    $scope.initActivityEditPage = () => {
        getDept();
        getDeliverChannel();
        getInviteType();
        getSettleType();
        getMgmActivity();
    };
    $scope.initActivityEditPage();

    /**
     * 保存活动
     * */
    $scope.saveMgmActivity = () => {
        let postData = $scope.formData;
        //开始时间只能是当前时间或大于当前时间，结束时间只能大于等于开始时间
        let curDate = new Date();
        curDate.setHours(0);
        curDate.setMinutes(0);
        curDate.setSeconds(0);
        let start = new Date(dateFilter(postData.startTime, 'yyyy-MM-dd'));
        let end = new Date(dateFilter(postData.endTime, 'yyyy-MM-dd'));
        if (start < curDate) {
            toastr.error("开始时间必须大于等于当前时间！");
            return false;
        }
        if (end < start) {
            toastr.error("结束时间必须大于等于开始时间！");
            return false;
        }
        //如果是按频次结算，结算方式默认按天
        if (postData.settleType == 'settle_type_002') {
            postData.settleSubType = "settle_type_sub_004";  //
        }
        /*追加活动类型，用来区分MGM活动和代理人活动*/
        postData.activityType = routeName.activityType;
        if ($scope.mgmId && $scope.mgmId > 0 && $scope.copy != 'copy') {
            MgmActivityEditService.updateMgmActivity(postData)
                .then(data => {
                    if (data && data.code == 200) {
                        toastr.success("保存成功！");
                        $state.go(routeName.name);
                    }
                });
        } else {
            MgmActivityEditService.saveMgmActivity(postData)
                .then(data => {
                    if (data && data.code == 200) {
                        toastr.success("保存成功！");
                        $state.go(routeName.name);
                    }
                });
        }
    };

    /*删除规则-仅限界面*/
    $scope.deleteRule = (basicForm, item) => {
        let rules = $scope.formData.rules;
        $scope.formData.rules = rules.filter(f => {
            return JSON.stringify(f) != JSON.stringify(item);
        });
        basicForm.$dirty = true;
    };

    /**
     * 新增-编辑规则-modal
     * */
    $scope.openRuleModule = (basicForm) => {
        openRuleModule(basicForm, $scope);
    };
    let openRuleModule = function (basicForm, parent) {
        let modalInstance = $uibModal.open({
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: mgmRuleTpl,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.viewModel = {
                        productList: [],
                        productListSelected: [],
                        showInvest: false,
                        showAccept: false,
                        behaviorData: []
                    };
                    $scope.formData = new Object();
                    /*获取结算对象*/
                    let getSettleObject = () => {
                        MgmActivityEditService.getSettleObject()
                            .then(data => {
                                if (data && data.code == 200) {
                                    $scope.settleObjectList = data.result;
                                }
                            });
                    };
                    // /*获取奖励类型*/
                    // let getRewardType = () => {
                    //     MgmActivityEditService.getRewardType()
                    //         .then(data => {
                    //             if (data && data.code == 200) {
                    //                 $scope.rewardTypeList = data.result;
                    //             }
                    //         });
                    // };
                    /*获取奖励方式*/
                    let getRewardWay = () => {
                        MgmActivityEditService.getRewardWay()
                            .then(data => {
                                if (data && data.code == 200) {
                                    $scope.rewardWayList = data.result;
                                }
                            });
                    };
                    $scope.settleObjectChange = () => {
                        /*
                         * settle_object_001:邀请人
                         * settle_object_002：被邀请人
                         * settle_object_003：邀请人和被邀请人
                         * */
                        switch ($scope.formData.settleObject) {
                            case 'settle_object_001':
                                $scope.viewModel.showInvest = true;
                                $scope.viewModel.showAccept = false;
                                break;
                            case 'settle_object_002':
                                $scope.viewModel.showInvest = false;
                                $scope.viewModel.showAccept = true;
                                break;
                            case 'settle_object_003':
                                $scope.viewModel.showInvest = true;
                                $scope.viewModel.showAccept = true;
                                break;
                            default:
                                $scope.viewModel.showInvest = false;
                                $scope.viewModel.showAccept = false;
                                break;
                        }
                    };

                    //获取券计划、券类型
                    let getCouponPlanCouponName = () => {
                        ProxyLevelService.getCouponPlanCouponName()
                            .then(data => {
                                if (data && data.code == 200) {
                                    $scope.couponPlanList = data.result;
                                }
                            });
                    };
                    $scope.couponPlanChange = (planId) => {
                        let selectedCouponPlan = $scope.couponPlanList.filter(f => {
                            return f.id == planId;
                        })[0];
                        $scope.couponTypeList = selectedCouponPlan ? selectedCouponPlan.templateList : [];
                    };
                    /**
                     * 添加行为
                     * */
                    $scope.addBehaivor = () => {
                        openBhaviorModal($scope);
                    };
                    /**
                     * 删除行为
                     * */
                    $scope.deleteBehaivor = (row) => {
                        let behaviorData = $scope.viewModel.behaviorData;
                        $scope.viewModel.behaviorData = behaviorData.filter(f => {
                            return JSON.stringify(f) != JSON.stringify(row);
                        })
                    };
                    /**
                     * 结算对象梯度
                     * */
                    $scope.stage = new Object();
                    $scope.stage = {
                        investList: [{
                            provideSubType: "",
                            couponName: "",
                            receivableNum: ""
                        }],
                        acceptList: [{
                            provideSubType: "",
                            couponName: "",
                            receivableNum: ""
                        }],
                        // 初始化时梯度只有1条，不允许删除
                        canNotDeleteInvest: false,
                        canNotDeleteAccept: false,
                        addInvestStage: function (index) {
                            $scope.stage.investList.splice(index + 1, 0, {
                                provideSubType: "",
                                couponName: "",
                                receivableNum: ""
                            });
                            // 增加新的梯度后允许删除
                            $scope.stage.canNotDeleteInvest = true;
                        },
                        addAcceptStage: function (index) {
                            $scope.stage.acceptList.splice(index + 1, 0, {
                                provideSubType: "",
                                couponName: "",
                                receivableNum: ""
                            });
                            // 增加新的梯度后允许删除
                            $scope.stage.canNotDeleteAccept = true;
                        },
                        decreaseInvestStage: function (index) {
                            // 如果梯度大于1，删除被点击选项
                            if ($scope.stage.investList.length > 1) {
                                $scope.stage.investList.splice(index, 1);
                            }
                            // 如果梯度为1，不允许删除
                            if ($scope.stage.investList.length == 1) {
                                $scope.stage.canNotDeleteInvest = false;
                            }
                        },
                        decreaseAcceptStage: function (index) {
                            // 如果梯度大于1，删除被点击选项
                            if ($scope.stage.acceptList.length > 1) {
                                $scope.stage.acceptList.splice(index, 1);
                            }
                            // 如果梯度为1，不允许删除
                            if ($scope.stage.acceptList.length == 1) {
                                $scope.stage.canNotDeleteAccept = false;
                            }
                        }
                    };
                    /**
                     * 新增/编辑规则
                     * */
                    $scope.saveAccount = () => {
                        let rule = $scope.formData;
                        /*1、处理是否默认本次活动周期内注册作为前置条件*/
                        let atoms = [{
                            atomType: 'step_type_001',//(后端固定的code)
                            atomSubType: '',
                            dataList: '',
                            minValue: null,
                            maxValue: null,
                            atomCondition: 'in'
                        }];

                        /*2、循环生成原子对象和回显表达式*/
                        let displayExpression = ``;
                        angular.forEach($scope.viewModel.behaviorData, (data) => {
                            displayExpression += `<br/><b>行为</b>:${data.behaviorName}`;
                            if (data.productNames != "") {
                                displayExpression += `,<b>产品包含</b>:[${data.productNames}]`;
                            }
                            if (data.people.showPeopleCondition) {
                                let atom = {};
                                atom.atomType = data.behaviorCode;
                                atom.atomSubType = `${data.behaviorCode}_2`; //后端固定格式
                                atom.dataList = data.productCodes;
                                atom.minValue = data.people.peopleMinValue;
                                atom.maxValue = data.people.peopleMaxValue;
                                atom.atomCondition = data.people.peopleConditionCode;
                                atoms.push(atom);
                                displayExpression += `,${data.people.peopleExpression}`;
                            }
                            if (data.money.showMoneyCondition) {
                                let atom = {};
                                atom.atomType = data.behaviorCode;
                                atom.atomSubType = `${data.behaviorCode}_1`; //后端固定格式
                                atom.dataList = data.productCodes;
                                atom.minValue = data.money.moneyMinValue;
                                atom.maxValue = data.money.moneyMaxValue;
                                atom.atomCondition = data.money.moneyConditionCode;
                                atoms.push(atom);
                                displayExpression += `,${data.money.moneyExpression}`;
                            }
                        });

                        rule.displayExpression = displayExpression.slice(5); //移除第一个br
                        rule.displayExpressionHtml = $sce.trustAsHtml(displayExpression.slice(5));
                        rule.atoms = atoms;
                        /*4、处理邀请人和被邀请人梯度*/
                        if ($scope.viewModel.showInvest && !$scope.viewModel.showAccept) {
                            rule.inviteProvides = $scope.stage.investList;
                            // rule.acceptProvides = null;
                        }
                        if (!$scope.viewModel.showInvest && $scope.viewModel.showAccept) {
                            // rule.inviteProvides = null;
                            rule.acceptProvides = $scope.stage.acceptList;
                        }
                        if ($scope.viewModel.showInvest && $scope.viewModel.showAccept) {
                            rule.inviteProvides = $scope.stage.investList;
                            rule.acceptProvides = $scope.stage.acceptList;
                        }

                        /*5、将rule追加到parent.formData.rules中*/
                        parent.formData.rules.push(rule);

                        basicForm.$dirty = true;
                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = () => {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.initRuleModal = () => {
                        getSettleObject();
                        // getRewardType();
                        getRewardWay();
                        getCouponPlanCouponName();
                    };
                }]
            }
        );
        modalInstance.opened.then(function () {
            // console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
            // console.log(result);
        }, function (reason) {
            // console.log(reason);
        });
    };

    /**
     * 添加行为
     * @param scope
     */
    let openBhaviorModal = (scope) => {
        let modalInstance = $uibModal.open({
                size: 'ml',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: mgmBehaviorTpl,
                controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                    $scope.localLang = {
                        selectAll: "全选",
                        selectNone: "全不选",
                        reset: "重置",
                        search: "搜索...",
                        nothingSelected: "请选择"
                    };
                    $scope.viewModel = {
                        productList: [],
                        productListSelected: []
                    };
                    $scope.formData = new Object();
                    /*获取行为*/
                    let getBehaviorType = () => {
                        MgmActivityEditService.getBehaviorType()
                            .then(data => {
                                if (data && data.code == 200) {
                                    $scope.behaviorTypeList = data.result;
                                }
                            });
                    };
                    $scope.behaviorTypeChange = () => {
                        switch ($scope.viewModel.behaviorType) {
                            case '':
                            case undefined:
                                $scope.peopleCondition = false;
                                $scope.moneyCondition = false;
                                $scope.showProduct = false;
                                break;
                            case 'behavior_type_001': //注册人数
                                $scope.peopleCondition = true;
                                $scope.moneyCondition = false;
                                $scope.showProduct = false;
                                break;
                            case 'behavior_type_002': //首次投资人数
                                $scope.peopleCondition = true;
                                $scope.moneyCondition = false;
                                $scope.showProduct = true;
                                break;
                            case 'behavior_type_003':   //单个好友投资金额累计
                            case 'behavior_type_004':   //所有好友首投金额累计
                            case 'behavior_type_005':   //所有好友投资金额累计
                                $scope.peopleCondition = false;
                                $scope.moneyCondition = true;
                                $scope.showProduct = true;
                                break;
                            case 'behavior_type_006':  //单笔投资金额人数
                            case 'behavior_type_007':  //首次投资金额人数
                            case 'behavior_type_008':  //累计投资金额人数
                                $scope.peopleCondition = true;
                                $scope.moneyCondition = true;
                                $scope.showProduct = true;
                                break;
                            default:
                                $scope.peopleCondition = false;
                                $scope.moneyCondition = false;
                                $scope.showProduct = false;
                                break;
                        }
                    };
                    /*获取产品*/
                    let getProductList = () => {
                        MgmActivityEditService.getProductList()
                            .then(data => {
                                if (data && data.code == 200) {
                                    $scope.viewModel.productList = data.result;
                                }
                            });
                    };
                    /*获取数据条件*/
                    let getDataCondition = () => {
                        MgmActivityEditService.getDataCondition()
                            .then(data => {
                                if (data && data.code == 200) {
                                    $scope.dataConditionList = data.result;
                                }
                            });
                    };
                    $scope.dataConditionChange = () => {
                        switch ($scope.viewModel.atomCondition) {
                            case '':
                            case undefined:
                                $scope.showSingleInput = false;
                                $scope.showDoubleInput = false;
                                break;
                            case 'between':
                                $scope.showSingleInput = false;
                                $scope.showDoubleInput = true;
                                break;
                            default:
                                $scope.showSingleInput = true;
                                $scope.showDoubleInput = false;
                                break;
                        }
                    };
                    $scope.dataConditionChange1 = () => {
                        switch ($scope.viewModel.atomCondition1) {
                            case '':
                            case undefined:
                                $scope.showSingleInput1 = false;
                                $scope.showDoubleInput1 = false;
                                break;
                            case 'between':
                                $scope.showSingleInput1 = false;
                                $scope.showDoubleInput1 = true;
                                break;
                            default:
                                $scope.showSingleInput1 = true;
                                $scope.showDoubleInput1 = false;
                                break;
                        }
                    };

                    /**
                     * 保存行为
                     * */
                    $scope.saveAccount = () => {
                        let behaviorMetadata = {
                            behaviorCode: '',
                            behaviorName: '',
                            productCodes: '',
                            productNames: '',
                            people: {
                                showPeopleCondition: false,
                                peopleConditionCode: '',
                                peopleConditionName: '',
                                peopleMinValue: '',
                                peopleMaxValue: '',
                                peopleExpression: ''
                            },
                            money: {
                                showMoneyCondition: false,
                                moneyConditionCode: '',
                                moneyConditionName: '',
                                moneyMinValue: '',
                                moneyMaxValue: '',
                                moneyExpression: ''
                            }
                        };
                        let behaviorSelected = $scope.behaviorTypeList.filter(f => {
                            return f.dataCode == $scope.viewModel.behaviorType;
                        })[0];
                        let conditionSelected = $scope.dataConditionList.filter(f => {
                            return f.dataCode == $scope.viewModel.atomCondition;
                        })[0];
                        let conditionSelected1 = $scope.dataConditionList.filter(f => {
                            return f.dataCode == $scope.viewModel.atomCondition1;
                        })[0];
                        /*1、行为*/
                        behaviorMetadata.behaviorCode = behaviorSelected.dataCode;
                        behaviorMetadata.behaviorName = behaviorSelected.dataName;
                        /*2、适用产品*/
                        let productCode = [], productName = [];
                        angular.forEach($scope.viewModel.productListSelected, (data) => {
                            productCode.push(data.dataCode);
                            productName.push(data.dataName);
                        });
                        behaviorMetadata.productCodes = productCode.join(',');
                        behaviorMetadata.productNames = productName.join(',');
                        /*3、人数条件*/
                        if ($scope.peopleCondition) {
                            behaviorMetadata.people.showPeopleCondition = $scope.peopleCondition;
                            behaviorMetadata.people.peopleConditionCode = conditionSelected1.dataCode;
                            behaviorMetadata.people.peopleConditionName = conditionSelected1.dataName;
                            if (conditionSelected1.dataCode == "between") {
                                if ($scope.viewModel.minValue1 > $scope.viewModel.maxValue1) {
                                    toastr.warning(`最大值不能小于最小值！`);
                                    return;
                                }
                                behaviorMetadata.people.peopleMinValue = $scope.viewModel.minValue1;
                                behaviorMetadata.people.peopleMaxValue = $scope.viewModel.maxValue1;
                                behaviorMetadata.people.peopleExpression = `人数${conditionSelected1.dataName}[${$scope.viewModel.minValue1},${$scope.viewModel.maxValue1}]`;
                            } else {
                                behaviorMetadata.people.peopleMinValue = $scope.viewModel.minValue1;
                                behaviorMetadata.people.peopleExpression = `人数${conditionSelected1.dataName}${$scope.viewModel.minValue1}`;
                            }
                        }
                        /*4、金额条件*/
                        if ($scope.moneyCondition) {
                            behaviorMetadata.money.showMoneyCondition = $scope.moneyCondition;
                            behaviorMetadata.money.moneyConditionCode = conditionSelected.dataCode;
                            behaviorMetadata.money.moneyConditionName = conditionSelected.dataName;
                            if (conditionSelected.dataCode == "between") {
                                if ($scope.viewModel.minValue > $scope.viewModel.maxValue) {
                                    toastr.warning(`最大值不能小于最小值！`);
                                    return;
                                }
                                behaviorMetadata.money.moneyMinValue = $scope.viewModel.minValue;
                                behaviorMetadata.money.moneyMaxValue = $scope.viewModel.maxValue;
                                behaviorMetadata.money.moneyExpression = `金额${conditionSelected.dataName}[${$scope.viewModel.minValue},${$scope.viewModel.maxValue}]`;
                            } else {
                                behaviorMetadata.money.moneyMinValue = $scope.viewModel.minValue;
                                behaviorMetadata.money.moneyExpression = `金额${conditionSelected.dataName}${$scope.viewModel.minValue}`;
                            }
                        }

                        /*将行为数据追加到scope.viewModel.behaviorData中*/
                        scope.viewModel.behaviorData.push(behaviorMetadata);

                        $uibModalInstance.dismiss('cancel');
                    };
                    $scope.cancel = () => {
                        $uibModalInstance.dismiss('cancel');
                    };

                    $scope.initBehaviorModal = () => {
                        getBehaviorType();
                        getProductList();
                        getDataCondition();
                    };
                }]
            }
        );
        modalInstance.opened.then(function () {
            // console.log('modal is opened');
        });
        modalInstance.result.then(function (result) {
            // console.log(result);
        }, function (reason) {
            // console.log(reason);
        });
    };

    /*返回活动管理列表页*/
    $scope.gotoActivityPage = () => {
        $state.go(routeName.name);
    };
};

angular.module('controller')
    .controller('MgmActivityEditController', MgmActivityEditController);