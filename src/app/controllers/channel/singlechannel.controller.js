import * as constant from '../../constant';
import channelTpl from "../../templates/modal-channel-add.html";
SingleChannelController.$inject = ['$scope', 'toastr', 'UpLoadService', '$timeout', '$rootScope', '$uibModal', '$state', 'ChannelService'];

function SingleChannelController($scope, toastr, UpLoadService, $timeout, $rootScope, $uibModal, $state, ChannelService) {
    $scope.viewModel = {
        ShowInfoText: "全部",
        channelList: {},
        channelTypeList: {},
        departmentList: {},
        query: {
            channelType: "",
            department: "",
            creater: "",
            channelName: "",
            channelStatus: ""
        }
    };

    /**
     * 页面初始化
     * */
    $scope.init = function () {
        /**
         * 获取渠道类型
         * */
        ChannelService.getChannelType(1)
            .then(function (data) {
                if (data && data.code == 200) {
                    $scope.viewModel.channelTypeList = data.result;
                }
            });
        /**
         * 获取部门
         * */
        ChannelService.getDepartment()
            .then(function (data) {
                if (data && data.code == 200) {
                    $scope.viewModel.departmentList = data.result;
                }

            });
        let pageSize = 10, pageNo = 1;
        getChannelList(pageNo, pageSize, true);
        getChannelStatus();
    };

    /**
     * 获取渠道列表
     * */
    let getChannelList = function (pageNo, pageSize, reInit) {
        let formData = {
            "pageSize": pageSize,
            "pageNo": pageNo,
            "refferalType": $scope.viewModel.query.channelType,
            "department": $scope.viewModel.query.department,
            "createUser": $scope.viewModel.query.creater,
            "refferalName": $scope.viewModel.query.channelName,
            "refferalStatus": $scope.viewModel.query.channelStatus
        };
        queryChannelList(formData, reInit);
    };

    /*reload pagination data*/
    $scope.$on("dr.reloadPagination", function (scope, no, size) {
        getChannelList(no, size);
    });
    /**
     * 获取渠道状态
     * */
    let getChannelStatus = function () {
        ChannelService.getChannelStatus()
            .then(function (data) {
                if (data && data.code == 200) {
                    $scope.viewModel.channelStatusList = data.result;
                }
            });
    };

    /**
     * 根据渠道状态筛选数据
     * */
    $scope.showInfoByChannelStatus = function (obj) {
        if (!angular.isObject(obj)) {
            $scope.viewModel.ShowInfoText = "全部";
            $scope.viewModel.query.channelStatus = "";
        }
        else {
            $scope.viewModel.ShowInfoText = obj.dataName;
            $scope.viewModel.query.channelStatus = obj.dataCode;
        }
        $scope.viewModel.query.channelType = "";
        $scope.viewModel.query.department = "";
        $scope.viewModel.query.creater = "";
        $scope.viewModel.query.channelName = "";
        $scope.queryChannel();
    };

    /**
     * 查询
     * */
    $scope.queryChannel = function () {
        let formData =
        {
            "pageSize": 10,
            "pageNo": 1,
            "refferalType": $scope.viewModel.query.channelType,
            "department": $scope.viewModel.query.department,
            "createUser": $scope.viewModel.query.creater,
            "refferalName": $scope.viewModel.query.channelName,
            "refferalStatus": $scope.viewModel.query.channelStatus
        };
        queryChannelList(formData, true);
    };

    let queryChannelList = function (formData, reInit) {
        ChannelService.getChannelList(formData)
            .then(function (data) {
                if (data && data.code == 200) {
                    //绑定数据
                    $scope.tableData = data.result;
                    if (reInit) {
                        $timeout(function () {
                            $rootScope.$broadcast('modelInitialized', this);
                        }, 500);
                    }
                    // $scope.viewModel.channelList = data.result;
                }
            })
    };

    /**
     * 下载模板
     * */
    $scope.downTemplate = function () {
        $scope.showProgress = true;
        ChannelService.downTemplate({busType: "sys_template_refferal"})
            .then(function (result) {
                // if (result.data.code != 200) {
                //     toastr.warning(result.data.msg, "Warning");
                //     return;
                // }
                $scope.showProgress = false;
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, "refferal-template.xlsx");
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", "refferal-template.xlsx");
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
     * 导入渠道
     * */
    $scope.uploadFiles = function (file) {
        var postData = {file: file};
        $scope.showProgress = true;
        UpLoadService.UpLoadFile(constant.EXCEL_IMPORT_URL, postData)
            .then(function (data) {
                $scope.showProgress = false;
                if (data && data.code == 200) {
                    toastr.success("渠道导入成功！", "Success");
                    document.querySelector("#btnCloseChannelModal").click()
                    $scope.queryChannel();
                } else {
                    toastr.warning(data.msg);
                }
            }, function (data) {
                console.log('Error status' + data.status);
            });
    };

    /**
     * 新增/编辑渠道-modal
     * */
    $scope.openChannelModal = function (pageType, id) {
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: channelTpl,
            controller: ['$scope', '$uibModalInstance', function ($scope, $uibModalInstance) {
                $scope.viewModel = {
                    pageTitle: "",
                    dropDown: {
                        channelTypeList: {},
                        // settleModeList: {},
                        channelStatusList: {},
                        kaiFangApiList: {},
                        departmentList: {}
                    },
                    // settleModeCPS: {
                    //     productList: {},
                    //     selectedProduct: {},
                    //     money: "",
                    //     moneySatisfy: "",
                    //     productCode: "",
                    //     radioVal: ""
                    // },
                    postData: {
                        id: "",
                        channelName: "",
                        channelType: "",
                        department: "",
                        agents: "",
                        isOpenApi: "",
                        apiKey: "",
                        openApiType: "",
                        settleMode: "",
                        channelStatus: "",
                        note: "",
                        money: "",  //金额
                        regRealName: "",//是否实名制
                        invest: "",//是否首次投资
                        productCode: "",//产品代码
                        moneySatisfy: "", //投资额满X元
                        //agentList: {},
                        agentAllList: {}
                    },
                    // settleModeType: {
                    //     isShowInputMoney: false,
                    //     isShowRegRealName: false,
                    //     isShowInvest: false
                    // },
                };
                /**本地化多选下拉框*/
                $scope.localLang = {
                    selectAll: "全选",
                    selectNone: "全不选",
                    reset: "重置",
                    search: "搜索...",
                    nothingSelected: "请选择"         //default-label is deprecated and replaced with this.
                };
                $scope.isOpenApiList = [{value: "", text: "请选择"}, {value: "1", text: "是"}, {value: "0", text: "否"}];
                getChannelTypeList($scope);
                getKaiFangApiList($scope);
                // getSettleModeList($scope);
                // $scope.settleModeChange = settleModeChange($scope);
                getChannelStatusList($scope, pageType);
                getDepartmentList($scope);
                getChannelInfo($scope, pageType, id);
                //点击事件
                $scope.checkBoxResult = [];
                $scope.checkSelect = function (code, event) {
                    if (event.target.checked) {//选中，就添加
                        if ($scope.checkBoxResult.indexOf(code) == -1) {//不存在就添加
                            $scope.checkBoxResult.push(code);
                        }
                    } else {//去除就删除result
                        var idx = $scope.checkBoxResult.indexOf(code);
                        if (idx != -1) {//不存在就添加
                            $scope.checkBoxResult.splice(idx, 1);
                        }
                    }
                };
                //被选中条件：ng-checked的结果为true
                $scope.isCheckBoxSelected = function (code) {
                    //只要返回的结果为true，则对应的checkbox就会被选中，
                    return $scope.viewModel.postData.openApiType.indexOf(code) != -1;
                };
                $scope.ok = function () {
                    saveChannel($scope, function () {
                        $uibModalInstance.dismiss('cancel');
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
     * 渠道类型
     * */
    let getChannelTypeList = function (scope) {
        ChannelService.getChannelType(1)
            .then(function (data) {
                if (data && data.code == 200) {
                    scope.viewModel.dropDown.channelTypeList = data.result;
                }
            });
    };
    /**
     * 获取部门
     * */
    let getDepartmentList = function (scope) {
        ChannelService.getDepartment()
            .then(function (data) {
                if (data && data.code == 200) {
                    scope.viewModel.dropDown.departmentList = data.result;
                }
            });
    };
    /**
     * 开放接口
     * */
    let getKaiFangApiList = function (scope) {
        ChannelService.getOpenApi()
            .then(function (data) {
                if (data && data.code == 200) {
                    scope.viewModel.dropDown.kaiFangApiList = data.result;
                }
            });
    };
    /**
     * 2.3.1需求改造，此方法暂时注释掉
     * 结算方式
     * */
    // let getSettleModeList = function (scope) {
    //     ChannelService.getSettleMode()
    //         .then(function (data) {
    //             if (data && data.code == 200) {
    //                 scope.viewModel.dropDown.settleModeList = data.result;
    //             }
    //         });
    // };
    /**
     * 2.3.1需求改造，此方法暂时注释掉
     * 结算方式change
     * */
    // let settleModeChange = function (scope) {
    //     return function () {
    //         scope.viewModel.postData.money = "";
    //         scope.viewModel.postData.regRealName = "";
    //         scope.viewModel.settleModeCPS.productCode = "";
    //         scope.viewModel.settleModeCPS.money = "";
    //         scope.viewModel.settleModeCPS.moneySatisfy = "";
    //         switch (scope.viewModel.postData.settleMode) {
    //             case "refferal_payment_100":
    //             case "refferal_payment_101":
    //                 scope.viewModel.settleModeType.isShowInputMoney = true;
    //                 scope.viewModel.settleModeType.isShowRegRealName = false;
    //                 scope.viewModel.settleModeType.isShowInvest = false;
    //                 break;
    //             case "refferal_payment_102":
    //                 scope.viewModel.settleModeType.isShowInputMoney = false;
    //                 scope.viewModel.settleModeType.isShowRegRealName = true;
    //                 scope.viewModel.settleModeType.isShowInvest = false;
    //                 break;
    //             case "refferal_payment_103":
    //                 scope.viewModel.settleModeType.isShowInputMoney = false;
    //                 scope.viewModel.settleModeType.isShowRegRealName = false;
    //                 scope.viewModel.settleModeType.isShowInvest = true;
    //                 ChannelService.getProduct()
    //                     .then(function (data) {
    //                         if (data && data.code == 200) {
    //                             angular.forEach(data.result, function (data, index, array) {
    //                                 data.selected = false;
    //                             });
    //                             scope.viewModel.settleModeCPS.productList = data.result;
    //                         }
    //                     });
    //                 break;
    //             default:
    //                 scope.viewModel.settleModeType.isShowInputMoney = false;
    //                 scope.viewModel.settleModeType.isShowRegRealName = false;
    //                 scope.viewModel.settleModeType.isShowInvest = false;
    //                 break
    //         }
    //     }
    // };
    /**
     * 渠道状态
     * */
    let getChannelStatusList = function (scope, pageType) {
        ChannelService.getChannelStatus()
            .then(function (data) {
                if (data && data.code == 200) {
                    if (pageType == "add") {
                        scope.viewModel.postData.channelStatus = data.result[0].dataCode;  //默认选中 即将合作
                    }
                    scope.viewModel.dropDown.channelStatusList = data.result;
                }
            });
    };
    /**
     * 编辑状态下，获取数据的接口没有
     * */
    let getChannelInfo = function (scope, pageType, id) {
        if (pageType == "add") {
            scope.viewModel.postData.apiKey = "";
            return;
        }
        if (pageType == "edit") {
            ChannelService.getChannelById(id)
                .then(function (data) {
                    if (data.code != 200) {
                        toastr.warning(data.msg, "Warning");
                        return;
                    }
                    //赋值操作
                    let result = data.result;
                    scope.viewModel.postData.id = result.id;
                    scope.viewModel.postData.channelName = result.refferalName;
                    scope.viewModel.postData.channelType = result.refferalType;
                    scope.viewModel.postData.department = result.department;
                    scope.viewModel.postData.agents = result.agent;
                    scope.viewModel.postData.isOpenApi = result.isOpenInterface == null ? "" : String(result.isOpenInterface);
                    scope.viewModel.postData.apiKey = result.interfaceSecret;
                    if (result.openInterface != null) {
                        scope.viewModel.postData.openApiType = result.openInterface;
                        if (result.openInterface != "") {
                            let openInterface = result.openInterface.split('#');
                            angular.forEach(openInterface, function (data, index) {
                                scope.checkBoxResult.push(data);
                            });
                        }
                    }
                    scope.viewModel.postData.settleMode = result.clearingForm;
                    scope.viewModel.postData.channelStatus = result.refferalStatus;
                    scope.viewModel.postData.note = result.note;

                    //$scope.viewModel.postData.agentList=result.agentList;
                    scope.viewModel.postData.agentAllList = result.agentAllList;

                    // switch (scope.viewModel.postData.settleMode) {
                    //     case "refferal_payment_100":
                    //     case "refferal_payment_101":
                    //         scope.viewModel.settleModeType.isShowInputMoney = true;
                    //         scope.viewModel.settleModeType.isShowRegRealName = false;
                    //         scope.viewModel.settleModeType.isShowInvest = false;
                    //         //赋值
                    //         scope.viewModel.postData.money = result.money;
                    //         break;
                    //     case "refferal_payment_102":
                    //         scope.viewModel.settleModeType.isShowInputMoney = false;
                    //         scope.viewModel.settleModeType.isShowRegRealName = true;
                    //         scope.viewModel.settleModeType.isShowInvest = false;
                    //         //赋值
                    //         scope.viewModel.postData.regRealName = result.regRealName;
                    //         scope.viewModel.postData.money = result.money;
                    //         break;
                    //     case "refferal_payment_103":
                    //         scope.viewModel.settleModeType.isShowInputMoney = false;
                    //         scope.viewModel.settleModeType.isShowRegRealName = false;
                    //         scope.viewModel.settleModeType.isShowInvest = true;
                    //         //赋值
                    //         scope.viewModel.postData.invest = result.invest;
                    //         ChannelService.getProduct()
                    //             .then(function (data) {
                    //                 if (data && data.code == 200) {
                    //                     angular.forEach(data.result, function (data, index, array) {
                    //                         data.selected = result.productCode.indexOf(data.loanId) >= 0;
                    //                     });
                    //                     scope.viewModel.settleModeCPS.productList = data.result;
                    //                 }
                    //             });
                    //         scope.viewModel.settleModeCPS.moneySatisfy = result.moneySatisfy;
                    //         scope.viewModel.settleModeCPS.money = result.money;
                    //         scope.viewModel.settleModeCPS.radioVal = result.invest;
                    //         break;
                    //     default:
                    //         break
                    // }
                });
        }
    };
    /**
     * 保存渠道
     * */
    let saveChannel = function (scope, callback) {
        let numberRegex = /^\d+(?=\.{0,1}\d+$|$)/;
        // let productCode = "";
        // if (scope.viewModel.postData.settleMode == "refferal_payment_103") {
        //     let productCodeList = scope.viewModel.settleModeCPS.selectedProduct;
        //     angular.forEach(productCodeList, function (data, index, array) {
        //         productCode += data.loanId + ",";
        //     });
        //     scope.viewModel.postData.money = scope.viewModel.settleModeCPS.money;
        //     scope.viewModel.postData.productCode = productCode;
        //     scope.viewModel.postData.moneySatisfy = scope.viewModel.settleModeCPS.moneySatisfy;
        // }
        if (!numberRegex.test(scope.viewModel.postData.money) && scope.viewModel.postData.money != "") {
            toastr.error("请输入正确的金额！");
            return false;
        }
        if (!numberRegex.test(scope.viewModel.postData.moneySatisfy) && scope.viewModel.postData.moneySatisfy != "") {
            toastr.error("请输入正确的金额！");
            return false;
        }
        if (scope.viewModel.postData.money != "") {
            let money = Math.round(scope.viewModel.postData.money * 100) / 100;
            if (money >= 100000 || money <= 0) {
                toastr.error("单价必须在 0.00-99999.99！");
                return false;
            }
        }
        //处理复选框
        scope.viewModel.postData.openApiType = scope.checkBoxResult.join("#");
        let formData = {
            "id": scope.viewModel.postData.id,
            "refferalName": scope.viewModel.postData.channelName,
            "refferalType": scope.viewModel.postData.channelType,
            "agent": scope.viewModel.postData.agents,
            "isOpenInterface": scope.viewModel.postData.isOpenApi,
            "interfaceSecret": scope.viewModel.postData.apiKey,//"KASJUYIWI87892TER383EW",
            "openInterface": scope.viewModel.postData.openApiType,
            "clearingForm": scope.viewModel.postData.settleMode,
            "refferalStatus": scope.viewModel.postData.channelStatus,
            "note": scope.viewModel.postData.note,
            "department": scope.viewModel.postData.department,
            // "money": Math.round(scope.viewModel.postData.money * 100) / 100,  //金额
            // "regRealName": scope.viewModel.postData.regRealName,//是否实名制
            // "invest": scope.viewModel.postData.invest,//是否首次投资
            // "productCode": scope.viewModel.postData.productCode, //产品代码
            // "moneySatisfy": Math.round(scope.viewModel.postData.moneySatisfy * 100) / 100,
        };
        ChannelService.saveChannel(formData)
            .then(function (data) {
                if (data && data.code == 200) {
                    toastr.success("保存成功！", "Success");
                    callback();
                    /*跳转到添加广告位页面 */
                    if(formData.refferalType=='refferal_type_103'){
                        $state.go('main.singlechannelSem', {id: data.result.id,channelname: scope.viewModel.postData.channelName});
                    }else{
                        $state.go('main.adlist', {id: data.result.id,channelname: scope.viewModel.postData.channelName});
                    }
                }
            });
    };
    /**
     * 复制渠道
     * */
    $scope.copyChannel = function (id) {
        ChannelService.copyChannel(id)
            .then(function (data) {
                if (data && data.code == 200) {
                    toastr.success("渠道复制成功！", "Success");
                    $scope.queryChannel();
                }
            });
    };
    /**
     * 删除渠道
     * */
    $scope.deleteChannel = function (id) {
        ChannelService.deleteChannel(id)
            .then(function (data) {
                if (data && data.code == 200) {
                    toastr.success("渠道删除成功！", "Success");
                    $scope.queryChannel();
                }
            });
    };

    $scope.gotoPage = function (item) {
        //如果是SEM类型的渠道进入账户界面
        if(item.refferalType=='refferal_type_103'){
            $state.go('main.singlechannelSem', {id:item.id,channelname:item.refferalName});
        }else{
            $state.go('main.adlist', {id:item.id,channelname:item.refferalName});
        }

    };
};

angular.module('controller').controller("SingleChannelController", SingleChannelController);


