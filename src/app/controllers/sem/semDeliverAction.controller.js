/**
 * Created by YundanChai on 2017/12/4.
 */
import semdeliverActionTpl from '../../templates/sem-deliver-action.html';
import channelTpl from '../../templates/sem-modal-channel.html';
import * as constant from '../../constant';
SemDeliverActionController.$inject = ['$rootScope', '$scope', 'SemDeliverActionService', '$uibModal','$state', '$stateParams','$filter', '$q', 'toastr', '$timeout', '$cookieStore', 'UpLoadService', 'ChannelService','DeliverService','SemChannelAccountService'];
function SemDeliverActionController($rootScope, $scope, SemDeliverActionService, $uibModal,$state, $stateParams,$filter, $q, toastr, $timeout, $cookieStore, UpLoadService, ChannelService, DeliverService,SemChannelAccountService) {
    $scope.campaignName = $stateParams.campaignName;
    $scope.showChannel = true;
    let dateFilter = $filter('date');
    $scope.changeTab = function (arg) {
        if (arg === 'channel') {
            $scope.showChannel = true;
            $scope.showMaterial = false;
            // fetch all channel and deliver action
            $scope.$emit('fetchChannelDeliver');
        }

    };

    /**
     * 查询所有的渠道和投放动作
     * */
    let queryInfo = function () {
        $q.all([getAllChannel(),  getSettleModeList()])
            .then(() => {
                /**
                 * 从投放对比进来，默认打开投放动作编辑页面,此时点击保存类似新增
                 * */
                if ($cookieStore.get("daCompare") && $cookieStore.get("daCompare").from == "dc") {
                    openDeliverModal($scope, 'edit', $cookieStore.get("daCompare").daId);
                }
            });
        getActivityUrlList();
        if ($stateParams.id) {
            $scope.getAllDeliverAction($stateParams.id, null, null, true);
        }
    };
    /**
     * 查询所有单渠道, 弹出选择渠道用
     */
    let getAllChannel = function () {
        return SemDeliverActionService.getAllChannel().then(function (data) {
            if (data && data.code == '200') {
                //$scope.channelData = data.result;
                let resultItem=[];
                angular.forEach(data.result, (item)=> {
                    if(item.id!="Null"){
                        resultItem.push(item);
                    }
                });

                $scope.channelData=angular.copy(resultItem);
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
                    let resultItem=[];
                    angular.forEach(data.result, (item)=> {
                        if(item.dataCode=="refferal_payment_100"){
                            resultItem.push(item);
                        }
                    });
                    $scope.settleModeList = angular.copy(resultItem);
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
        console.log(arg);
        SemDeliverActionService.getAllDeliverAction(arg).then(function (data) {
            if (data && data.code == '200') {
                $scope.deliverAction = data.result;

                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
                //get all data for filter
               //$scope.getAllDeliverNoPage(id);
            }
        });
    };

    /*reload pagination data*/
    $scope.$on("dr.semDeliverPagination", function (scope, no, size, state) {
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
     * 判断是否移除：渠道广告位信息、开始时间、结束时间均为空时，则可以移除
     * */
    $scope.isEnableForDel = function (ads, startTime, endTime) {
        if ((!ads || ads.length == 0 ) && !startTime && !endTime) {
            return true;
        }
        return false;
    };

    /**
     * 停止投放动作
     */
    $scope.stopDeliverAction = (id) => {
        let deliverId = $stateParams.id ? $stateParams.id : $scope.formData.id;
        SemDeliverActionService.stopDeliverAction(id).then(function (data) {
            if (data && data.code == '200') {
                toastr.success('停止投放动作成功!');
                $scope.getAllDeliverAction(deliverId, $scope.curPage, null, true);
            }
        });
    };
    /**
     * 移除投放动作
     */
    $scope.removeDeliverAction = (id) => {
        let deliverId = $stateParams.id ? $stateParams.id : $scope.formData.id;
        if (id) {
            var data = {"campaignId": deliverId, "publishId": id};
            SemDeliverActionService.delDeliverAction(data).then(function (data) {
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
    $scope.init = function () {
        queryInfo();
    };
    $scope.init();
    /**================================================================================
     * ↓↓↓↓↓↓↓↓↓↓↓↓以下投放动作模块↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
     * ================================================================================*/
    /**
     * 新增编辑投放动作
     * */
    $scope.openDeliverModal = (opType, id,formStatus) => {
        openDeliverModal($scope, opType, id,formStatus);
    };
    let openDeliverModal = (parent, opType, id,formStatus) => {
            let modalInstance = $uibModal.open({
                    size: 'ml',
                    backdrop: 'static',
                    keyboard: false,
                    animation: true,
                    template: semdeliverActionTpl,
                    controller: ['$scope', '$uibModalInstance', '$interval', function ($scope, $uibModalInstance, $interval) {
                        /*init*/
                        /*新增和即将开始：表单所有项可以编辑；已开始：表单除结算方式外，只读*/
                        $scope.isDisabledForm = formStatus == 'formDisabled';
                        $scope.accountList=[];
                        $scope.selectAccount="";
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
                        $scope.selectMode="refferal_payment_100";
                        /*已选择的渠道 */
                        $scope.selectedChannel = [];
                        /*获取渠道选择数据*/
                        $scope.channelData = parent.channelData;
                        /*获取结算方式*/
                        $scope.settleModeList = parent.settleModeList;
                        $scope.formData={
                            publish:{},
                            clearingForm:{},
                            campaignId:""
                        }
                        /*选择渠道*/
                        $scope.showChannel = () => {
                            openChannelModal(parent, $scope);
                        };
                        $scope.getAccount = function () {

                        }

                        /*上传关键字*/
                        $scope.uploadKeywords = function () {
                            if ($scope.keywordFile) {
                                $rootScope.isShowLoading = true;
                                UpLoadService.UpLoadFile(
                                    constant.SEM_UPLOAD_EXCEL,
                                    {file: $scope.keywordFile}
                                ).then(function (data) {
                                    $rootScope.isShowLoading = false;
                                    //{"code":"200","msg":"success","result":["abc","efdfsa","fasfasf"]}
                                    if (data.code == "200") {
                                        toastr.success("上传成功");
                                        $scope.formData.publish.semPlan = data.result;
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
                        getPublishWay($scope);

                        /*URL可达性校验*/
                        $scope.isShowTipMsg = false;

                        /*保存投放动作按钮*/
                        $scope.ok = function () {
                            let selectedItems = $scope.selectAccount.split(",");
                            //追加投放计划ID
                            $scope.formData.campaignId = $stateParams.id;
                            // 追加publish参数
                            $scope.formData.publish.refferalId = $scope.selectedChannel.id;
                            $scope.formData.publish.refferalName = $scope.selectedChannel.refferalName;
                            $scope.formData.publish.agentId = $scope.selectedChannel.agentId ? $scope.selectedChannel.agentId : '';
                            $scope.formData.publish.agentName = $scope.selectedChannel.agentName ? $scope.selectedChannel.agentName : '';
                            $scope.formData.publish.refferalType = $scope.selectedChannel.refferalType;
                            $scope.formData.publish.publishWay = $scope.publishWay;
                            $scope.formData.publish.accountId = selectedItems[0] ? selectedItems[0] :'';
                            $scope.formData.publish.accountNo = selectedItems[1] ? selectedItems[1] :'';
                            $scope.formData.publish.medium = $scope.formData.publish.medium ? $scope.formData.publish.medium:'';
                            $scope.formData.publish.source = $scope.formData.publish.source ? $scope.formData.publish.source:'';
                            $scope.formData.clearingForm.clearingForm = $scope.selectMode ? $scope.selectMode:'';
                            // $scope.formData.publish.secretKey = $scope.formData.publish.secretKey;

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
                                SemDeliverActionService.updDeliverAction($scope.formData).then(function (data) {
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
                                SemDeliverActionService.addDeliverAction($scope.formData).then(function (data) {
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
    let getDeliverActionInfo = function (scope, opType, id) {
        scope.secret=false;
        if (opType === "add") {
            scope.secret=false;
            return;
        }
        if (opType === "edit") {
            scope.secret=false;
            /*根据ID获取投放动作信息*/
            SemDeliverActionService.getDevilerInfoById(id)
                .then(function (data) {
                    if (data && data.code != 200) {
                        toastr.warning(data.msg, "Warning");
                        return;
                    }
                    //赋值操作
                    let result = data.result;
                    //scope.formData = data.result;
                    //加载信息
                    scope.formData.publish.id=result.id;
                    scope.selectedChannel.refferalName = result.refferalName;
                    scope.selectedChannel.id = result.refferalId;
                    scope.selectMode=result.clearingForm;
                    scope.formData.publish.refferalStartTime = result.refferalStartTime;
                    scope.formData.publish.refferalEndTime = result.refferalEndTime;
                    scope.formData.publish.medium = result.medium ;
                    scope.formData.publish.pcInitUrl = result.pcInitUrl;
                    scope.formData.publish.pcTarget = result.pcTarget
                    scope.formData.publish.h5InitUrl = result.h5InitUrl;
                    scope.formData.publish.h5Target = result.h5Target;
                    scope.formData.publish.pcSource = result.pcSource;
                    scope.formData.publish.h5Source = result.h5Source;
                    loadAccountListfo(result.refferalId,scope,result);
                    //需求要求，从投放对比过来，清空日期
                    let isFromDc = $cookieStore.get("daCompare") && $cookieStore.get("daCompare").from == "dc";
                    if (isFromDc) {
                        scope.formData.publish.refferalStartTime = "";
                        scope.formData.publish.refferalEndTime = "";
                    }
                });
        }
    };
    //投放方式
    let getPublishWay = function (dataScope) {
        DeliverService.getPbulishWay().then(function (data) {
            dataScope.publishList = data.result;
            angular.forEach(dataScope.publishList, (item)=> {
                if(item.dataCode=="publish_way_102"){
                    dataScope.publishWay=item.dataCode;
                }
            });
        });
    };
    //根据渠道获取账户信息
    let  loadAccountListfo =function(refferalId,scope,result){
        let no1=1,size1=10;
        let data = {
            pageNo: no1 ? no1 : 1,
            pageSize: size1 ? size1 : 10,
            refferalId: refferalId
        };
        SemChannelAccountService.getAccountList(data)
            .then(function (data) {
                if (data.code != 200) {
                    toastr.warning(data.msg, "Warning");
                    return;
                }
                //绑定数据
                scope.accountList = data.result.result;
                if(result){
                    scope.selectAccount =result.accountId+','+result.accountNo;
                }else{
                    scope.selectAccount="";
                }
            });
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
                        selectedData = row;
                    };
                    $scope.ok = function () {
                        parent.selectedChannel = selectedData;
                        if (!(typeof (parent.formData) === "undefined")) {
                            parent.formData.publish.selectAccount = "";
                        }
                        loadAccountListfo(selectedData.id,parent,null);
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
                                if (v.refferalName === row.refferalName && v.agentName !== $scope.curAgentName) {
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

    /*进入详情*/
    $scope.detailAction = function (id) {
        $state.go('main.semdeliveractionDetail', {id: id});
    }
}

angular.module('controller')
    .controller("SemDeliverActionController", SemDeliverActionController);