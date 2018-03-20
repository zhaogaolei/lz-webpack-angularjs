import * as constant from '../../constant';
import allocationTpl from '../../templates/modal-allocation.html';
import materialTpl from '../../templates/modal-material.html';
import channelTpl from '../../templates/modal-channel.html';
import historyTpl from '../../templates/modal-history.html';
import deliverActionTpl from '../../templates/modal-deliver-action.html';

/**
 * 投放计划管理控制器
 */
DeliverPlanMgrController.$inject = ['$rootScope', '$scope', 'DeliverService', '$uibModal', '$stateParams', '$q', 'toastr', '$timeout', '$cookieStore', '$filter', 'UpLoadService', 'ChannelService'];

function DeliverPlanMgrController($rootScope, $scope, DeliverService, $uibModal, $stateParams, $q, toastr, $timeout, $cookieStore, $filter, UpLoadService, ChannelService) {
    $scope.campaignName = $stateParams.campaignName;
    let dateFilter = $filter('date');
    /**
     * tab切换
     */
    $scope.showChannel = true;
    // 是否显示查询列表
    $scope.isShowSearchList = false;
    $scope.changeTab = function (arg) {
        if (arg === 'channel') {
            $scope.showChannel = true;
            $scope.showMaterial = false;
            // fetch all channel and deliver action
            $scope.$emit('fetchChannelDeliver');
        }
        if (arg === 'material') {
            $scope.showChannel = false;
            $scope.showMaterial = true;
            // fetch material info
            $scope.$emit('fetchMaterial');
        }
    };
    /**================================================================================
     * ↓↓↓↓↓↓↓↓↓↓↓↓以下投放动作模块↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
     * ================================================================================*/
    /**
     * 新增编辑投放动作
     * */
    $scope.openDeliverModal = (opType, id, formStatus) => {
        openDeliverModal($scope, opType, id, formStatus);
    };
    let openDeliverModal = (parent, opType, id, formStatus) => {
            let modalInstance = $uibModal.open({
                    size: 'ml',
                    backdrop: 'static',
                    keyboard: false,
                    animation: true,
                    template: deliverActionTpl,
                    controller: ['$scope', '$uibModalInstance', '$interval', function ($scope, $uibModalInstance, $interval) {
                        /*新增和即将开始：表单所有项可以编辑；已开始：表单除结算方式外，只读*/
                        $scope.isDisabledForm = formStatus == 'formDisabled';
                        /*init*/
                        $scope.settleModeType = {
                            isShowInputMoney: false,
                            isShowRegRealName: false,
                            isShowInvest: false
                        };
                        $scope.product = {
                            productList: [],
                            selectedProduct: []
                        };
                        /**本地化多选下拉框*/
                        $scope.localLang = {
                            selectAll: "全选",
                            selectNone: "全不选",
                            reset: "重置",
                            search: "搜索...",
                            nothingSelected: "请选择"         //default-label is deprecated and replaced with this.
                        };
                        $scope.publishList = [];
                        $scope.publishWay = "";
                        $scope.keywordFile = "";
                        $scope.IsAPI = "true";

                        /*已选择的渠道 */
                        $scope.selectedChannel = [];
                        /*获取渠道选择数据*/
                        $scope.channelData = parent.channelData;
                        /*获取代理商选择数据*/
                        $scope.agentData = parent.agentData;
                        /*获取广告位属性*/
                        $scope.bannerProperty = parent.bannerProperty;
                        /*获取结算方式*/
                        $scope.settleModeList = parent.settleModeList;
                        /*结算方式change事件*/
                        $scope.settleModeChange = function () {
                            $scope.formData.clearingForm.money = "";
                            $scope.formData.clearingForm.regRealName = "";
                            $scope.formData.clearingForm.investForm = "";
                            // $scope.formData.clearingForm.moneySatisfy = "";
                            switch ($scope.formData.clearingForm.clearingForm) {
                                /*CPC,CPT*/
                                case "refferal_payment_100":
                                case "refferal_payment_101":
                                    $scope.settleModeType.isShowInputMoney = true;
                                    $scope.settleModeType.isShowRegRealName = false;
                                    $scope.settleModeType.isShowInvest = false;
                                    break;
                                /*CPA*/
                                case "refferal_payment_102":
                                    $scope.settleModeType.isShowInputMoney = false;
                                    $scope.settleModeType.isShowRegRealName = true;
                                    $scope.settleModeType.isShowInvest = false;
                                    break;
                                /*CPS*/
                                case "refferal_payment_103":
                                    $scope.settleModeType.isShowInputMoney = false;
                                    $scope.settleModeType.isShowRegRealName = false;
                                    $scope.settleModeType.isShowInvest = true;
                                    ChannelService.getProduct()
                                        .then(function (data) {
                                            if (data && data.code == 200) {
                                                angular.forEach(data.result, function (data, index, array) {
                                                    data.selected = false;
                                                });
                                                $scope.product.productList = data.result;
                                            }
                                        });
                                    break;
                                default:
                                    $scope.settleModeType.isShowInputMoney = false;
                                    $scope.settleModeType.isShowRegRealName = false;
                                    $scope.settleModeType.isShowInvest = false;
                                    break;
                            }
                        };
                        /*获取初始URL*/
                        $scope.activityUrlList = parent.activityUrlList;

                        /*选择渠道*/
                        $scope.showChannelOrAgent = () => {
                            openChannelModal(parent, $scope);
                        };

                        /*加载广告位信息*/
                        $scope.loadBannerInfo = function () {
                            //console.log($scope.selectedChannel);
                            DeliverService.getBannerInfoByRefferalId($scope.selectedChannel.id)
                                .then((data) => {
                                    if (data.code != 200) {
                                        toastr.warning(data.msg, "Warning");
                                        return;
                                    }
                                    $scope.bannerInfoList = data.result;
                                });
                        };
                        /*上传关键字*/
                        $scope.uploadKeyword = function () {
                            if ($scope.keywordFile) {
                                $rootScope.isShowLoading = true;
                                UpLoadService.UpLoadFile(
                                    constant.GET_KEYWORD,
                                    {file: $scope.keywordFile}
                                ).then(function (data) {
                                    $rootScope.isShowLoading = false;
                                    //{"code":"200","msg":"success","result":["abc","efdfsa","fasfasf"]}
                                    if (data.code == "200") {
                                        toastr.success("上传成功");
                                        $scope.formData.banner.keywords = data.result;
                                    }
                                    else {
                                        toastr.error("文件上传错误:" + data.msg);
                                    }
                                });
                            }
                            else {
                                return;
                            }
                        };
                        /*编辑-获取信息*/
                        getDeliverActionInfo($scope, opType, id);

                        /*URL可达性校验*/
                        $scope.isShowTipMsg = false;
                        $scope.validUrl = function () {
                            $scope.isShowTipMsg = false;
                            let postData = {"urlStr": $scope.formData.banner.landingPage};
                            /**
                             * 广告位录入链接需做可达性校验，若该链接404或无效需在输入框下红色文字提示，5s后消失：
                             * 该链接可能无效！
                             * */
                            DeliverService.checkAdUrl(postData)
                                .then(function (data) {
                                    if (data && data.code == '200') {
                                        if (data.result == "fail") {
                                            let time = 5;
                                            $interval(function () {
                                                $scope.isShowTipMsg = true;
                                                time--;
                                                if (time == 0) {
                                                    $scope.isShowTipMsg = false;
                                                    time = 5;
                                                }
                                            }, 1000, time);
                                        }
                                    }
                                });
                        };
                        getPublishWay($scope);
                        //投放方式按钮选中事件
                        $scope.radiocheckSelect = function (data) {
                            $scope.publishWay = data;

                            /*angular.forEach($scope.publishList, (item)=> {
                                item.selected = false;
                                if($scope.publishWay == item.dataCode){
                                    item.checked=true;
                                }
                            });*/
                            if ($scope.publishWay == "publish_way_101") {
                                $scope.IsAPI = false;
                            } else {
                                $scope.IsAPI = true;

                            }
                        }
                        //初始URL下拉change
                        $scope.initialUrlChange = function () {
                            $scope.formData.banner.landingPage = $scope.initialUrl;
                        };
                        /*保存投放动作按钮*/
                        $scope.ok = function () {
                            //追加bannerName
                            $scope.formData.banner.bannerName = $scope.bannerInfoList.filter((b) => {
                                return b.id == $scope.formData.banner.id;
                            })[0].bannerName;
                            //追加投放计划ID
                            $scope.formData.campaignId = $stateParams.id;
                            // 追加publish参数
                            $scope.formData.publish.refferalId = $scope.selectedChannel.id;
                            $scope.formData.publish.refferalName = $scope.selectedChannel.refferalName;
                            $scope.formData.publish.agentId = $scope.selectedChannel.agentId ? $scope.selectedChannel.agentId : '';
                            $scope.formData.publish.agentName = $scope.selectedChannel.agentName ? $scope.selectedChannel.agentName : '';
                            $scope.formData.publish.refferalType = $scope.selectedChannel.refferalType;
                            $scope.formData.publish.publishWay = $scope.publishWay;
                            // $scope.formData.publish.secretKey = $scope.formData.publish.secretKey;

                            //追加结算方式
                            if ($scope.formData.clearingForm.clearingForm == "refferal_payment_103") {
                                let productCodeList = $scope.product.selectedProduct;
                                if (productCodeList.length == 0) {
                                    toastr.warning("请选择产品！");
                                    return;
                                }
                                let productArr = [];
                                angular.forEach(productCodeList, function (data, index, array) {
                                    productArr.push(data.loanId);
                                });
                                $scope.formData.clearingForm.productCode = productArr.join();
                                $scope.formData.clearingForm.stageList = $scope.stage.stageList;
                            }

                            //校验金额
                            //正数正则表达式
                            let numberRegex = /^\d+(?=\.{0,1}\d+$|$)/;
                            //正整数或一位小数或者两位小数的正则表达式
                            let twoDecimalRegex = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                            //大于等于0的整数(非负整数)
                            let numberRegexInt = /^(0|[1-9]\d*)$/;
                            //素材数量
                            if ($scope.formData.banner.amount) {
                                if (numberRegexInt.test($scope.formData.banner.amount)) {
                                    if ($scope.formData.banner.amount > 999) {
                                        toastr.error("素材数量不得大于3位数！");
                                        return false;
                                    }
                                } else {
                                    toastr.error("请输入正确的素材数量！");
                                    return false;
                                }
                            }
                            //非资产分销，保持之前逻辑不变
                            if ($scope.formData.clearingForm.investForm != 2) {
                                if (!numberRegex.test($scope.formData.clearingForm.money) && $scope.formData.clearingForm.money != "") {
                                    toastr.error("请输入正确的金额！");
                                    return false;
                                }
                                if ($scope.formData.clearingForm.money != "") {
                                    let money = Math.round($scope.formData.clearingForm.money * 100) / 100;
                                    if (money >= 100000 || money < 0) {
                                        toastr.error("单价必须在 0.00-99999.99之间！");
                                        return false;
                                    }
                                }
                                // if (!numberRegex.test($scope.formData.clearingForm.moneySatisfy) && $scope.formData.clearingForm.moneySatisfy != "") {
                                //     toastr.error("请输入正确的金额！");
                                //     return false;
                                // }
                                //格式化金额,四舍五入
                                $scope.formData.clearingForm.money = Math.round($scope.formData.clearingForm.money * 100) / 100;
                                // $scope.formData.clearingForm.moneySatisfy = Math.round($scope.formData.clearingForm.moneySatisfy * 100) / 100;
                            }
                            //资产分销，返点输入框限制输入两位小数，不能超过100%
                            if ($scope.formData.clearingForm.investForm === 2) {
                                if (!twoDecimalRegex.test($scope.formData.clearingForm.money) && $scope.formData.clearingForm.money != "") {
                                    toastr.error("返点必须是正数且最多两位小数！");
                                    return false;
                                }
                                if ($scope.formData.clearingForm.money > 100) {
                                    toastr.error("返点必须在0.00-100.00之间！");
                                    return false;
                                }
                            }
                            //日期控制,修改日期：20171123
                            if (!$scope.isDisabledForm) {
                                let curDate = new Date(dateFilter(new Date(), 'yyyy-MM-dd 00:00:00'));
                                let refferalStartTime = new Date(dateFilter($scope.formData.publish.refferalStartTime, 'yyyy-MM-dd'));
                                let refferalEndTime = new Date(dateFilter($scope.formData.publish.refferalEndTime, 'yyyy-MM-dd'));
                                if (refferalStartTime.getTime() < curDate.getTime()) {
                                    toastr.error("投放开始时间必须大于等于当前时间！");
                                    return false;
                                }
                                if (refferalEndTime.getTime() < refferalStartTime.getTime()) {
                                    toastr.error("投放结束时间只能大于等于投放开始时间！");
                                    return false;
                                }
                            }
                            let isFromDc = $cookieStore.get("daCompare") && $cookieStore.get("daCompare").from == "dc";
                            if (opType === "edit" && !isFromDc) {
                                DeliverService.updDeliverAction($scope.formData).then(function (data) {
                                    if (data && data.code == '200') {
                                        if (data.msg == 'success') {
                                            toastr.success('保存成功!');
                                        } else {
                                            toastr.warning(data.msg);
                                        }
                                        $uibModalInstance.close();
                                        parent.getAllDeliverAction($stateParams.id, parent.curPage, null, true);
                                    }
                                });
                            } else {
                                //新增投放动作，将ID 置空,避免主键冲突
                                // $scope.formData.banner.id = "";
                                $scope.formData.publish.id = "";
                                $scope.formData.clearingForm.id = "";
                                DeliverService.addDeliverAction($scope.formData).then(function (data) {
                                    if (data && data.code == '200') {
                                        if (data.msg == 'success') {
                                            toastr.success('保存成功!');
                                        } else {
                                            toastr.warning(data.msg);
                                        }
                                        $uibModalInstance.close()
                                        $cookieStore.remove("daCompare");
                                        parent.getAllDeliverAction($stateParams.id, null, null, true);
                                    }
                                });
                            }
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss('cancel');
                            $cookieStore.remove("daCompare");
                        };
                        /*产品多选下拉是否有变动校验*/
                        $scope.productChangeValid = (basicForm) => {
                            basicForm.$dirty = true;
                        };

                        /**
                         * CPS 梯度处理
                         * 修改日期：20171121
                         * */
                        $scope.stage = new Object();
                        $scope.stage.stageList = [{
                            fromMoney: "",
                            toMoney: "",
                            money: ""
                        }];
                        // 初始化时梯度只有1条，不允许删除
                        $scope.stage.canNotDelete = false;
                        // 增加梯度
                        $scope.stage.addStage = function (index) {
                            $scope.stage.stageList.splice(index + 1, 0, {fromMoney: "", toMoney: "", money: ""});
                            // 增加新的梯度后允许删除
                            $scope.stage.canNotDelete = true;
                        };
                        // 减少梯度
                        $scope.stage.decreaseStage = function (basicForm, index) {
                            // 如果梯度大于1，删除被点击选项
                            if ($scope.stage.stageList.length > 1) {
                                $scope.stage.stageList.splice(index, 1);
                            }
                            // 如果梯度为1，不允许删除
                            if ($scope.stage.stageList.length == 1) {
                                $scope.stage.canNotDelete = false;
                            }
                            /*编辑状态下是否有删除梯度校验*/
                            if (opType == "edit") {
                                basicForm.$dirty = true;
                            }
                        };
                        /*验证输入，只能输入两位小数*/
                        $scope.stage.validateInput = function (basicForm, input) {
                            //正整数或一位小数或者两位小数的正则表达式
                            let twoDecimalRegex = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
                            if (!twoDecimalRegex.test(input) && input != "" && input != null) {
                                toastr.error("金额只允许两位小数！");
                                basicForm.$dirty = false;
                            } else {
                                basicForm.$dirty = true;
                            }
                        };
                    }]
                }
            );
            modalInstance.opened.then(function () {
                //console.log('modal is opened');
            });
            modalInstance.result.then(function (result) {
                //console.log(result); //result关闭是回传的值
            }, function (reason) {
                //console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
            });
        }
    ;
    //投放方式
    let getPublishWay = function (dataScope) {
        DeliverService.getPbulishWay().then(function (data) {
            let resultArr =[];
            angular.forEach(data.result, (item)=> {
             if(item.dataCode!="publish_way_102"){
                 resultArr.push(item);
             }
             });
            dataScope.publishList = resultArr;
        });
    };
    let getDeliverActionInfo = function (scope, opType, id) {
            scope.secret = false;
            if (opType === "add") {

                scope.secret = false;
                return;
            }
            if (opType === "edit") {
                scope.secret = true;
                /*根据ID获取投放动作信息*/
                DeliverService.getDevilerInfoById(id)
                    .then(function (data) {
                        if (data && data.code != 200) {
                            toastr.warning(data.msg, "Warning");
                            return;
                        }
                        //赋值操作
                        let result = data.result;
                        scope.formData = data.result;
                        //2.3.1需求改造后，加入以下判断是为了兼顾历史数据
                        if (scope.formData.banner) {
                            scope.formData.banner.id = scope.formData.banner.id.toString();
                        }
                        //加载渠道广告信息
                        scope.selectedChannel.refferalName = scope.formData.publish.refferalName;
                        scope.selectedChannel.id = scope.formData.publish.refferalId;
                        scope.selectedChannel.interfaceSecret = scope.formData.publish.secretKey;
                        scope.publishWay = scope.formData.publish.publishWay;
                        if (scope.publishWay == "publish_way_101") {
                            scope.IsAPI = false;

                        } else {
                            scope.IsAPI = true;

                        }
                        scope.loadBannerInfo();
                        //2.3.1需求改造后，加入以下判断是为了兼顾历史数据
                        if (scope.formData.clearingForm) {
                            switch (scope.formData.clearingForm.clearingForm) {
                                case "refferal_payment_100":
                                case "refferal_payment_101":
                                    scope.settleModeType.isShowInputMoney = true;
                                    scope.settleModeType.isShowRegRealName = false;
                                    scope.settleModeType.isShowInvest = false;
                                    //赋值
                                    //formData.clearingForm.money = result.money;
                                    break;
                                case "refferal_payment_102":
                                    scope.settleModeType.isShowInputMoney = false;
                                    scope.settleModeType.isShowRegRealName = true;
                                    scope.settleModeType.isShowInvest = false;
                                    //赋值
                                    //scope.viewModel.postData.regRealName = result.regRealName;
                                    //scope.viewModel.postData.money = result.money;
                                    break;
                                case "refferal_payment_103":
                                    scope.settleModeType.isShowInputMoney = false;
                                    scope.settleModeType.isShowRegRealName = false;
                                    scope.settleModeType.isShowInvest = true;
                                    //赋值
                                    //scope.viewModel.postData.invest = result.invest;
                                    ChannelService.getProduct()
                                        .then(function (data) {
                                            if (data && data.code == 200) {
                                                angular.forEach(data.result, function (data, index, array) {
                                                    data.selected = scope.formData.clearingForm.productCode.indexOf(data.loanId) >= 0;
                                                });
                                                scope.product.productList = data.result;
                                            }
                                        });
                                    /*资产分销*/
                                    if (scope.formData.clearingForm.assetForm !== null && scope.formData.clearingForm.assetForm !== "") {
                                        scope.formData.clearingForm.assetForm = scope.formData.clearingForm.assetForm.toString();
                                    }
                                    /*梯度绑值处理*/
                                    scope.stage.stageList = scope.formData.clearingForm.stageList.length==0?scope.stage.stageList:scope.formData.clearingForm.stageList;
                                    if (scope.stage.stageList.length == 1) {
                                        scope.stage.canNotDelete = false;
                                    } else {
                                        scope.stage.canNotDelete = true;
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        //需求要求，从投放对比过来，清空日期
                        let isFromDc = $cookieStore.get("daCompare") && $cookieStore.get("daCompare").from == "dc";
                        if (isFromDc) {
                            scope.formData.publish.refferalStartTime = "";
                            scope.formData.publish.refferalEndTime = "";
                        }
                    });
            }
        }
    ;
    /*处理shortLink*/
    $scope.getShortLink = function (urls) {
        let urlArr = [];
        if (angular.isObject(urls)) {
            angular.forEach(urls, (row) => {
                if (row.shortLink) {
                    urlArr.push(row.shortLink);
                }
            });
        }
        if (urlArr.length === 0) {
            urlArr = ["暂无短链"];
        }
        return urlArr;
    };

    /**
     * 复制URL
     * */
    $scope.openUrlModal = (urlList) => {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: `<div class="modal-header">
                                        <h4 class="modal-title">URL短链接</h4>
                                   </div>
                                   <div class="modal-body">
                                      <div style="padding: 20px 0 30px 20px;">
                                        <div ng-repeat="item in urlList track by $index">
                                            <div ng-bind="item.shortLink"></div>
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
                $scope.urlList = urlList;
                let urlArr = [];
                angular.forEach($scope.urlList, (item) => {
                    urlArr.push(item.shortLink);
                });
                $scope.copyText = urlArr.join();

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
    /**
     * 移除投放动作
     */
    $scope.removeDeliverAction = (id) => {
        let deliverId = $stateParams.id ? $stateParams.id : $scope.formData.id;
        if (id) {
            var data = {"campaignId": deliverId, "publishId": id};
            DeliverService.delDeliverAction(data).then(function (data) {
                if (data && data.code == '200') {
                    $scope.getAllDeliverAction(deliverId, $scope.curPage, null, true);
                    toastr.success('删除投放动作成功!');
                    // reset channelAgentDataValid
                    $scope.channelAgentDataValid = _.clone($scope.channelAgentDataValidCopy);
                }
            });
        } else {
            //console.log(row, index);
        }
    };
    /**
     * 停止投放动作
     */
    $scope.stopDeliverAction = (id) => {
        let deliverId = $stateParams.id ? $stateParams.id : $scope.formData.id;
        DeliverService.stopDeliverAction(id).then(function (data) {
            if (data && data.code == '200') {
                toastr.success('停止投放动作成功!');
                $scope.getAllDeliverAction(deliverId, $scope.curPage, null, true);
            }
        });
    };

    /**
     * 查询所有投放动作-分页
     * id-campaignId, no-pageNO, size-pageSize, reInit-reSetPage
     */
    $scope.getAllDeliverAction = function (id, no, size, reInit, column, sort) {
        let arg = {
            pageNo: no ? no : 1,
            pageSize: size ? size : 10,
            campaignId: id
        };
        if (column && sort) {
            arg.sortName = column;
            arg.sortOrder = sort;
        }
        DeliverService.getAllDeliverAction(arg).then(function (data) {
            if (data && data.code == '200') {
                $scope.deliverAction = data.result;

                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
                //get all data for filter
                $scope.getAllDeliverNoPage(id);
            }
        });
    };

    /**
     * 查询所有投放动作-不分页
     * id-campaignId, no-pageNO, size-pageSize, reInit-reSetPage
     */
    $scope.getAllDeliverNoPage = function (id) {
        DeliverService.getAllDeliverNoPage(id).then(function (data) {
            if (data && data.code == '200') {
                $scope.deliverActionAll = data.result;

                // 过滤:如已加入 (A渠道 A渠道-代理商A, A渠道-代理商B), 三种只能有一种
                _.forEach($scope.deliverActionAll, function (v) {
                    if (v && v.refferalName && v.agentName) {
                        // 排除 A渠道 A渠道-代理商B
                        let refferalAgents = _.filter($scope.channelAgentDataValid, function (o) {
                            return o.refferalName == v.refferalName && o.agentName != v.agentName;
                        });
                        if (refferalAgents && refferalAgents.length > 0) {
                            $scope.channelAgentDataValid = _.filter($scope.channelAgentDataValid, function (o) {
                                return !_.find(refferalAgents, o);
                            });
                        }
                    }
                    if (v && v.refferalName && !v.agentName) {
                        // 排除 A渠道-*
                        let agents = _.filter($scope.channelAgentDataValid, function (o) {
                            return o.refferalName == v.refferalName && o.agentName;
                        });
                        if (agents && agents.length > 0) {
                            $scope.channelAgentDataValid = _.filter($scope.channelAgentDataValid, function (o) {
                                return !_.find(agents, o);
                            });
                        }
                    }
                });
            }
        });
    };

    /*reload pagination data*/
    $scope.$on("dr.channelPagination", function (scope, no, size, state) {
        $scope.curPage = no;
        if ($scope.sort) {
            $scope.getAllDeliverAction($stateParams.id, no, size, false, $scope.column, $scope.sort);
        }
        else {
            $scope.getAllDeliverAction($stateParams.id, no, size, false, null, null);
        }
    });

    let pageSize = 10, pageNo = 1;
    $scope.$on('sortEvent', function (scope, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            $scope.getAllDeliverAction($stateParams.id, pageNo, pageSize, true, column, sort);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            $scope.getAllDeliverAction($stateParams.id, pageNo, pageSize, true, null, null);
        }
    });

    /**
     * 查询所有单渠道, 弹出选择渠道用
     */
    let getAllChannel = function () {
        return DeliverService.getAllChannel(2).then(function (data) {
            if (data && data.code == '200') {
                $scope.channelData = data.result;

            }
        });
    };

    /**
     * 查询所有代理商,弹出选择渠道用
     */
    let getAllAgent = function () {
        return DeliverService.getAllAgent().then(function (data) {
            if (data && data.code == '200') {
                $scope.agentData = data.result;

            }
        });
    };

    /**
     * 获取广告位属性,新增/编辑投放动作用
     * */
    let getBannerProperty = function () {
        return DeliverService.getBannerProperty().then(function (data) {
            if (data && data.code == '200') {
                $scope.bannerProperty = data.result;
            }
        });
    };

    /**
     * 获取结算方式,新增/编辑投放动作用
     * */
    let getSettleModeList = function () {
        return ChannelService.getSettleMode()
            .then(function (data) {
                if (data && data.code == 200) {
                    $scope.settleModeList = data.result;
                }
            });
    };

    /**
     * 获取初始URL,新增/编辑投放动作用
     */
    let getActivityUrlList = function () {
        DeliverService.getActivityUrlList()
            .then(function (data) {
                if (data && data.code == '200') {
                    $scope.activityUrlList = data.result;
                }
            });
    };

    /**
     * 判断是否移除：渠道广告位信息、开始时间、结束时间均为空时，则可以移除
     * */
    $scope.isEnableForDel = function (ads, startTime, endTime) {
        if ((!ads || ads.length == 0 ) && !startTime && !endTime) {
            return true;
        }
        return false;
    };

    /**
     * 弹出渠道选择框
     * */
    let openChannelModal = function (grandparent, parent) {
        var modalInstance = $uibModal.open({
                size: 'ml',
                backdrop: 'static',
                keyboard: false,
                animation: true,
                template: channelTpl,
                controller: ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
                    /*init*/
                    $scope.currentTab = 'channel';
                    $scope.data = parent.channelData;
                    $scope.agentData = parent.agentData;
                    /*根据代理商查询渠道*/
                    $scope.getChannelByAngentID = function (id, name) {
                        $scope.curAgentId = id;
                        $scope.curAgentName = name;
                        DeliverService.getBannerByAgent(id).then(function (data) {
                            if (data && data.code == '200') {
                                $scope.channelOfAgent = data.result;

                            }
                        });
                    };

                    // default show first agent
                    if ($scope.agentData && $scope.agentData.length > 0) {
                        $scope.getChannelByAngentID($scope.agentData[0].agentId, $scope.agentData[0].agentName);
                    }
                    /*处理单选*/
                    let selectedData = [];
                    $scope.getSelectData = (row) => {
                        if (!$scope.currentTab || $scope.currentTab === 'channel') {
                            angular.forEach($scope.data, (data) => {
                                if (data.id === row.id) {
                                    row.selected = true;
                                }
                                else {
                                    data.selected = false;
                                }
                            });
                        }
                        else {
                            row.agentId = $scope.curAgentId ? $scope.curAgentId : "";
                            row.agentName = $scope.curAgentName ? $scope.curAgentName : "";
                            angular.forEach($scope.channelOfAgent, (data) => {
                                if (data.id === row.id) {
                                    row.selected = true;
                                }
                                else {
                                    data.selected = false;
                                }
                            });
                        }
                        selectedData = row;
                    };
                    $scope.ok = function () {
                        parent.selectedChannel = selectedData;
                        if (!(typeof (parent.formData) === "undefined")) {
                            parent.formData.banner.id = "";
                        }
                        parent.loadBannerInfo();
                        /*选择完毕，清除选中项*/
                        selectedData.selected = false;
                        $uibModalInstance.close();
                    };

                    $scope.cancel = function () {
                        $uibModalInstance.dismiss('cancel');
                    };

                    /*选择渠道时，清空代理商选择，反之*/
                    $scope.clearSelect = function (tabname) {
                        $scope.currentTab = tabname;
                        if (tabname === 'channel') {
                            _.forEach($scope.channelOfAgent, function (v) {
                                v.selected = false;
                            });
                        }
                        if (tabname === 'agent') {
                            _.forEach($scope.data, function (v) {
                                v.selected = false;
                            });
                        }
                    };

                    // 过滤:如已加入 (A渠道 A渠道-代理商A, A渠道-代理商B), 三种只能有一种
                    $scope.checkboxFilter = function (row, type) {
                        let result = false;
                        _.forEach(grandparent.deliverActionAll, function (v) {
                            if (type === 'channel') {
                                // 禁用 A渠道
                                if (v.refferalName === row.refferalName && v.agentName) {
                                    result = true;
                                }
                            }
                            if (type === 'agent') {
                                // 禁用 A渠道-代理商B
                                if (v.refferalName === row.refferalName
                                    && v.agentName !== $scope.curAgentName
                                    && v.publishStatusName !== '已停止') {
                                    result = true;
                                }
                            }
                        });
                        return result;
                    };
                }]
            }
        );
        modalInstance.opened.then(function () {
        });
        modalInstance.result.then(function (result) {
            //console.log(result); //result关闭是回传的值
        }, function (reason) {
            //console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
        });
    };

    /**
     * 导出投放URL列表
     * */
    $scope.exportUrlList = function () {
        DeliverService.exportUrls($stateParams.id)
            .then(function (result) {

                var linkElement = document.createElement('a');
                try {
                    //application/vnd.ms-excel
                    var fileName = $stateParams.campaignName + "投放URL.xlsx";
                    var blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
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
     * 查询所有的渠道和投放动作
     * */
    let queryInfo = function () {
        $q.all([getAllChannel(), getAllAgent(), getBannerProperty(), getSettleModeList()])
            .then(() => {
                /**
                 * 从投放对比进来，默认打开投放动作编辑页面,此时点击保存类似新增
                 * */
                if ($cookieStore.get("daCompare") && $cookieStore.get("daCompare").from == "dc") {
                    openDeliverModal($scope, 'edit', $cookieStore.get("daCompare").daId, 'formUnDisabled');
                }
            });
        getActivityUrlList();
        if ($stateParams.id) {
            $scope.getAllDeliverAction($stateParams.id, null, null, true);
        }
    };
    $scope.$on('fetchChannelDeliver', function () {
        queryInfo();
    });
    $scope.init = function () {
        queryInfo();
    };
    $scope.init();

    /**================================================================================
     * ↓↓↓↓↓↓↓↓↓↓↓↓以下分配素材模块↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
     * ================================================================================*/

    /*查询所有素材任务: no-首页数, size-一页x条, state-过滤code, reInit-重初始化分页*/
    $scope.getMaterialTask = function (no, size, state, reInit) {
        // unselected all
        $scope.unSelectedAll && $scope.unSelectedAll();
        if ($stateParams.id || $scope.formData) {
            let arg = {
                pageNo: no,
                pageSize: size ? size : 10,
                taskState: state ? state : null,
                campaignId: $stateParams.id ? $stateParams.id : $scope.formData.id
            };
            DeliverService.getMaterialTaskList(arg).then(function (data) {
                if (data && data.code == '200') {
                    $scope.materialTaskData = data.result;
                    if (reInit) {
                        $timeout(function () {
                            $rootScope.$broadcast('modelInitialized', this);
                        }, 500);
                    }
                }
            });
        }
    };
    /*reload pagination data*/
    $scope.$on("dr.reloadPagination", function (scope, no, size, state) {
        $scope.getMaterialTask(no, size, state);
    });

    /*素材类型*/
    $scope.getMaterialType = function () {
        DeliverService.getMaterialType().then(function (data) {
            if (data && data.code == '200') {
                $scope.materialType = data.result;
            }
        });
    };
    /*查询分配素材数据*/
    $scope.$on('fetchMaterial', function () {
        // 获取素材过滤类型
        $scope.getMaterialType();
        // 获取素材任务列表
        $scope.getMaterialTask(1, 10, null, true);
    });


    $scope.$watch('taskState', function (newValue, oldValue) {
        $scope.getMaterialTask(1, 10, newValue);
    });

    /*分配任务*/
    $scope.allocationTask = function (row) {
        if (row || $scope.count > 0) {
            openTaskModal($scope, row);
        }

    };

    /*素材*/
    $scope.materialTask = function (row) {
        if (row || $scope.count > 0) {
            openMaterialModal($scope, row);
        }
    };

    /*已选择的行*/
    $scope.count = 0;//已选择数量
    $scope.selectData = [];//已选对象
    /*全选*/
    $scope.changeAll = function () {
        console.log($scope.selectAll);
        angular.forEach($scope.materialTaskData.result, function (item) {
            item.checked = $scope.selectAll;
        });
        $scope.count = $scope.selectAll ? $scope.materialTaskData.result.length : 0;
        if ($scope.selectAll) {
            $scope.selectData = $scope.materialTaskData.result;
        } else {
            $scope.selectData = [];
        }
    };
    $scope.unSelectedAll = function () {
        $scope.count = 0;
        $scope.selectData = [];
        $scope.selectAll = null;
    };
    /*单选*/
    $scope.changeCurrent = function (current, $event) {
        $scope.count += current.checked ? 1 : -1;
        //判断是否全选，选数量等于数据长度为true
        $scope.selectAll = $scope.count === $scope.materialTaskData.result.length;
        //统计已选对象
        $scope.selectData = [];
        angular.forEach($scope.materialTaskData.result, function (item) {
            if (item.checked) {
                $scope.selectData[$scope.selectData.length] = item;
            }
        });
        $event.stopPropagation();
    };

    /*分配任务*/
    var openTaskModal = function (pscope, row) {
        var modalInstance = $uibModal.open({
            size: 'ml',
            animation: true,
            template: allocationTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.allocation = {};
                // 行素材和素材任务
                $scope.allocation.ids = row ? [row.id] : _.map(pscope.selectData, 'id');
                $scope.allocation.refferalNames = row ? [row.refferalName] : _.map(pscope.selectData, 'refferalName');

                var load = function (row) {
                    DeliverService.getMaterialTaskById(row.id).then(function (data) {
                        if (data && data.code == '200') {
                            $scope.allocation.recipient = data.result.recipient;
                            $scope.allocation.stopTime = data.result.stopTime;
                            $scope.allocation.description = data.result.description;
                        }
                    });
                };
                if (row) {
                    load(row);
                }

                $scope.ok = function () {
                    var data = {
                        ids: $scope.allocation.ids,
                        recipient: $scope.allocation.recipient,
                        stopTime: $scope.allocation.stopTime,
                        description: $scope.allocation.description
                    };
                    $scope.alloca(data, function () {
                        $uibModalInstance.close();
                    });
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                // 分配用户
                $scope.getUser = function () {
                    DeliverService.getUser().then(function (data) {
                        if (data && data.code == '200') {
                            $scope.userList = data.result;
                        }
                    });
                };
                $scope.getUser();

                $scope.getFiles = function () {
                    var d = {
                        busType: "task_attach",
                        materialTaskIds: $scope.allocation.ids
                    };
                    DeliverService.getAttachFiles(d).then(function (data) {
                        if (data && data.code == '200') {
                            $scope.uploadedfiles = data.result;
                        }
                    });
                };
                $scope.getFiles();

                // 验证表单
                let isValid = function () {
                    let result = true;
                    let curDate = new Date();
                    curDate.setHours(0);
                    curDate.setMinutes(0);
                    curDate.setSeconds(0);
                    curDate.setMilliseconds(0);
                    let curTime = curDate.getTime();
                    curDate.setTime(curTime + 1000 * 60 * 60 * 24);
                    let selectedDate = new Date($scope.allocation.stopTime.replace(/-/g, "/"));
                    // 选择时间需大于等于 day+1
                    if (selectedDate.getTime() < curDate.getTime()) {
                        toastr.warning('选择日期需大于当前日期!');
                        result = false;
                    }
                    return result;
                };

                //描述限制输入200字以内中英文符号组合
                $scope.checkTextArea = function () {
                    if ($scope.allocation.description && $scope.allocation.description.length > 200) {
                        $scope.allocation.description = $scope.allocation.description.substring(0, 200);
                    }
                };

                // 分配
                $scope.alloca = function (data, fun) {
                    if (isValid()) {
                        DeliverService.assignMaterial(data).then(function (data) {
                            if (data && data.code == '200') {
                                fun();
                                toastr.success('分配成功!');
                                pscope.getMaterialTask(1, 10);
                            }
                        });
                    }
                };
                $scope.upload = function () {
                    // 允许上传的类型
                    //let types = ['image', 'js', 'css', 'svg', 'apk', 'zip', 'json', 'ipa', 'plist', 'pdf', 'mp3', 'mp4', 'ogg'];
                    if ($scope.allocation.ids && $scope.allocation.ids.length > 0 && $scope.allocation.file) {
                        let filename = $scope.allocation.file.name;
                        if (filename && filename.length > 50) {
                            toastr.warning('文件名称过长!');
                            return;
                        }
                        //let fileend = filename.substring(filename.indexOf('.'));

                        $scope.showProgress = true;
                        var ids = $scope.allocation.ids.join(',');
                        UpLoadService.UpLoadFile(
                            constant.UPLOAD,
                            {file: $scope.allocation.file, bsType: "task_attach", materialTaskIds: ids}
                        ).then(function (data) {
                            //console.log(data)
                            // remove origin file.
                            $scope.allocation.file = null;
                            if (data && data.code == '200') {
                                $scope.errormsg = "";
                                var d = {
                                    materialName: data.result.materialName,
                                    materialSize: data.result.materialSize,
                                    materialId: data.result.materialId
                                };
                                // 显示上传的文件
                                if ($scope.uploadedfiles && _.isArray($scope.uploadedfiles)) {
                                    $scope.uploadedfiles.push(d);
                                } else {
                                    $scope.uploadedfiles = [d];
                                }
                            }
                            // exists
                            if (data && data.code == '400') {
                                $scope.errormsg = data.msg;
                            }
                            $scope.showProgress = false;
                        });
                    }
                };
                $scope.removeFile = function (row) {
                    var d = {
                        materialId: row.materialId,
                        materialTaskIds: $scope.allocation.ids
                    };
                    DeliverService.removeAttach(d).then(function (data) {
                        if (data && data.code == '200') {
                            $scope.uploadedfiles = _.filter($scope.uploadedfiles, function (o) {
                                return o.materialId != row.materialId;
                            });
                        }
                    });
                };
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

    /*素材任务*/
    var openMaterialModal = function (pscope, row) {
        var modalInstance = $uibModal.open({
            size: 'ml',
            animation: true,
            template: materialTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.selectedMaterialName = row.refferalName;
                $scope.materialTaskId = row.id;
                $scope.material = {};
                // 行素材和素材任务
                $scope.material.ids = [row.id];
                //$scope.material.ids = row ? [row.id] : _.map(pscope.selectData, 'id');
                //$scope.material.refferalNames = row ? [row.refferalName] : _.map(pscope.selectData, 'refferalName');

                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
                // 查询素材列表
                $scope.getFiles = function () {
                    var d = {
                        busType: "task_matter",
                        materialTaskIds: $scope.material.ids
                    };
                    DeliverService.getAttachFiles(d).then(function (data) {
                        if (data && data.code == '200') {
                            $scope.materialList = data.result;
                        }
                    });
                };
                $scope.getFiles();

                $scope.fetch = function (row) {
                    if (row && row.contentType) {
                        var d = {
                            materialTaskId: $scope.material.ids[0],
                            id: row.id
                        };
                        DeliverService.downloadFile(d)
                            .then(function (data, status, headers, config) {
                                var blob = new Blob([data.data], {type: row.contentType});
                                var fileName = row.materialName ? $scope.selectedMaterialName + "-" + row.materialName : "download";
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
                            });
                    }
                };

                $scope.fetchAll = function () {
                    var d = {
                        busType: 'task_matter',
                        zipName: $scope.selectedMaterialName,
                        materialTaskId: $scope.material.ids[0]
                    };
                    pscope.fetchAll(d);
                };

                /**
                 * 获取操作记录
                 * */
                $scope.getOperateRecord = function () {
                    DeliverService.getOperateRecord($scope.materialTaskId)
                        .then(function (data) {
                                if (data.code != 200) {
                                    toastr.warning(data.msg, "Warning");
                                    return;
                                }
                                openHistoryModal(data.result);
                            }
                        );
                };
                /**验收完成 -操作*/
                $scope.isDisabledCheckBtn = (row.taskName == "" || row.taskName == null || row.taskName == "已完成") ? true : false;
                $scope.checkComplete = function () {
                    DeliverService.checkComplete($scope.materialTaskId)
                        .then(function (data) {
                                if (data.code != 200) {
                                    toastr.warning(data.msg, "Warning");
                                    return;
                                }
                                toastr.success("验收完成！");
                                $uibModalInstance.close();
                                pscope.getMaterialTask(1, 10, null, true);
                                $scope.isDisabledCheckBtn = true;
                            }
                        );
                };
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

    /*打包下载一个素材任务*/
    $scope.fetchAll = function (d) {
        DeliverService.downloadFile(d)
            .then(function (data, status, headers, config) {
                var blob = new Blob([data.data], {type: "application/x-zip-compressed"});
                var fileName = d.zipName + ".zip";
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
            });
    };

// 下载所选择的数据行
    $scope.downloadSelectedRows = function () {
        if ($scope.count > 0) {
            _.forEach($scope.selectData, function (v) {
                var d = {
                    busType: 'task_matter',
                    zipName: v.refferalName,
                    materialTaskId: v.id
                };
                $scope.fetchAll(d);
            });
        }
    };

    /*操作历史*/
    var openHistoryModal = function (data) {
        var modalInstance = $uibModal.open({
            size: 'ml',
            animation: true,
            template: historyTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.OperateRecordList = data;

                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

            }]
        });
        modalInstance.opened.then(function () {
        });

        modalInstance.result.then(function (result) {
            // console.log(result); //result关闭是回传的值
        }, function (reason) {
            // console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
        });
    };
}


angular.module('controller')
    .controller("DeliverPlanMgrController", DeliverPlanMgrController);