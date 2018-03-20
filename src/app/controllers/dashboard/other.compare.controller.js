/**
 * Created by leizhao on 17/10/31.
 */
import campareConditionTpl from '../../templates/modal-campare-condition-add.html';

OtherCompareController.$inject = ['$scope', '$uibModal', 'OtherCompareService', "$filter", "toastr"];

function OtherCompareController($scope, $uibModal, OtherCompareService, $filter, toastr) {
    let dateFilter = $filter('date');
    $scope.defaultChannelText = "<i class='icon-icon-filter-outline'></i> 选择渠道 ";
    $scope.btnClass = "btn btnSelect dropdown-toggle";
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "请选择"
    };
    $scope.viewModel = {
        channelList: [],
        channelListSelected: [],
        conditionsForShow: '',
        loading: false
    };
    /*获取渠道集合*/
    let getChannelList = () => {
        OtherCompareService.getPeopleRefferalList()
            .then((data) => {
                if (data && data.code == "200") {
                    $scope.viewModel.channelList = data.result;
                }
            });
    };
    /**
     * 打开新增对比条件对话框
     */
    $scope.openModal = () => {
        let parent = $scope;
        let modalInstance = $uibModal.open({
            size: 'ml',
            backdrop: 'static',
            keyboard: false,
            animation: true,
            template: campareConditionTpl,
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                /**本地化多选下拉框*/
                $scope.localLang = {
                    selectAll: "全选",
                    selectNone: "全不选",
                    reset: "重置",
                    search: "搜索...",
                    nothingSelected: "请选择"
                };
                $scope.modalView = {
                    buttonClass: 'dr-other-compare-select',
                    formData: {
                        operate: '',
                        number: {
                            numText: '',
                            numTextStart: '',
                            numTextEnd: ''
                        },
                        date: {
                            dayText: '',
                            dateText: '',
                            dateTextStart: '',
                            dateTextEnd: ''
                        }
                    },
                    dicList: [],
                    dicListSelect: [],
                    modalInvestList: [],
                    modalInvestListSelect: [],
                    modalOperateList: []
                };
                /*日期控件*/
                $scope.popup = {
                    opened: false,
                    opened1: false,
                    opened2: false
                };
                $scope.open = function () {
                    $scope.popup.opened = true;
                };
                $scope.open1 = function () {
                    $scope.popup.opened1 = true;
                };
                $scope.open2 = function () {
                    $scope.popup.opened2 = true;
                };
                /*初始化页面*/
                /*获取筛选条件字典*/
                let getDic = () => {
                    OtherCompareService.getPeopleDic()
                        .then((data) => {
                            if (data && data.code == "200") {
                                $scope.modalView.dicList = data.result;
                            }
                        });
                };
                /*筛选条件change事件*/
                /*number date enum 有判断条件和输入框*/
                $scope.isShowInput = false;
                /*boolean 只有单选 默认 operate：=*/
                $scope.isShowRadio = false;
                $scope.dicChange = () => {
                    if ($scope.modalView.dicListSelect.length < 1) {
                        $scope.isShowInput = false;
                        $scope.isShowRadio = false;
                        return;
                    }
                    let dicSelectedObj = $scope.modalView.dicListSelect[0];
                    let type = dicSelectedObj.dataType;
                    switch (type) {
                        case "number":  //抱团次数、金额
                            $scope.modalView.formData.operate = ">";  //默认值：大于
                            $scope.isShowInput = true;
                            $scope.isShowNumber = true;
                            $scope.isShowDate = false;
                            $scope.isShowInvest = false;
                            $scope.isShowRadio = false;
                            getOperateDic(type);
                            break;
                        case "date":    //时间
                            $scope.modalView.formData.operate = "within";  //默认值：x天以内
                            $scope.isShowInput = true;
                            $scope.isShowNumber = false;
                            $scope.isShowDate = true;
                            $scope.isShowInvest = false;
                            $scope.isShowRadio = false;
                            getOperateDic(type);
                            break;
                        case "enum":    //持有团类型
                            $scope.modalView.formData.operate = "in";  //默认值：包含
                            $scope.isShowInput = true;
                            $scope.isShowNumber = false;
                            $scope.isShowDate = false;
                            $scope.isShowInvest = true;
                            $scope.isShowRadio = false;
                            getOperateDic(type);
                            getInvestType();
                            break;
                        case "boolean": //是否有投资行为  是和否
                            //页面只显示是和否单选按钮
                            $scope.isShowInput = false;
                            $scope.isShowRadio = true;
                            break;
                        default:
                            break;
                    }
                };
                /*获取操作符*/
                let getOperateDic = (type) => {
                    let objData = {
                        dataType: type
                    };
                    OtherCompareService.getPeopleOperate(objData)
                        .then((data) => {
                            if (data && data.code == 200) {
                                $scope.modalView.modalOperateList = data.result;
                            }
                        });
                };
                /*获取持有团类型*/
                let getInvestType = () => {
                    OtherCompareService.getPeopleInvestType()
                        .then((data) => {
                            if (data && data.code == 200) {
                                $scope.modalView.modalInvestList = data.result;
                            }
                        });
                };
                /*是否有投资行为 单选处理*/
                $scope.isTouzi = true;//默认  是
                $scope.singleSelectChange = () => {
                    if ($scope.isTouzi) {
                        $scope.isTouzi = false;
                    } else {
                        $scope.isTouzi = true;
                    }
                };
                /*确定*/
                $scope.ok = () => {
                    //组装参数并回显已选条件
                    let dicSelectedobj = $scope.modalView.dicListSelect[0];
                    let type = dicSelectedobj.dataType;
                    let condition = {};
                    let conditionForShow = {};
                    let vList = [];
                    let conForShow = ``;
                    let selectedOperateObj = $scope.modalView.modalOperateList.filter(f => {
                        return f.dataCode === $scope.modalView.formData.operate;
                    })[0];
                    let operateCode = selectedOperateObj ? selectedOperateObj.dataCode : '';  //例如：< > >=
                    let operateName = selectedOperateObj ? selectedOperateObj.dataName : '';  //例如：小于 大于 大于等于
                    switch (type) {
                        case "number":  //抱团次数、金额
                            if (operateCode == "between") {
                                let numTextStart = $scope.modalView.formData.number.numTextStart;
                                let numTextEnd = $scope.modalView.formData.number.numTextEnd;
                                if (!dataValid(numTextStart) || !dataValid(numTextEnd)) {
                                    toastr.error("请输入正确的数字！");
                                    return;
                                }
                                vList = [numTextStart, numTextEnd];
                                conForShow = `${dicSelectedobj.dataName}${operateName}[${numTextStart},${numTextEnd}]`;
                            } else {
                                let numText = $scope.modalView.formData.number.numText;
                                if (!dataValid(numText)) {
                                    toastr.error("请输入正确的数字！");
                                    return;
                                }
                                vList = [numText];
                                conForShow = `${dicSelectedobj.dataName}${operateName}${numText}`;
                            }
                            condition = {
                                conditionName: dicSelectedobj.dataCode,
                                valueList: vList,
                                operator: operateCode
                            };
                            conditionForShow = {
                                conditionName: dicSelectedobj.dataCode,
                                conditionString: conForShow
                            };
                            break;
                        case "date":    //时间
                            if (operateCode == "between") {
                                let dateTextStart = dateFilter($scope.modalView.formData.date.dateTextStart, 'yyyy-MM-dd');
                                let dateTextEnd = dateFilter($scope.modalView.formData.date.dateTextEnd, 'yyyy-MM-dd');
                                vList = [dateTextStart, dateTextEnd];
                                conForShow = `${dicSelectedobj.dataName}${operateName}[${dateTextStart},${dateTextEnd}]`
                            } else if ($scope.modalView.formData.operate == "<=" || $scope.modalView.formData.operate == ">=") {
                                let dateText = dateFilter($scope.modalView.formData.date.dateText, 'yyyy-MM-dd');
                                vList = [dateText];
                                conForShow = `${dicSelectedobj.dataName}${operateName}${dateText}`;
                            } else {
                                let dayText = $scope.modalView.formData.date.dayText;
                                if (!dataValid(dayText)) {
                                    toastr.error("请输入正确的数字！");
                                    return;
                                }
                                vList = [dayText];
                                //将x未知数替换为实际值  处理：x天以内，未来x天以内等。
                                conForShow = `${dicSelectedobj.dataName}${operateName.replace('x', dayText)}`;
                            }
                            condition = {
                                conditionName: dicSelectedobj.dataCode,
                                valueList: vList,
                                operator: operateCode
                            };
                            conditionForShow = {
                                conditionName: dicSelectedobj.dataCode,
                                conditionString: conForShow
                            };
                            break;
                        case "enum":    //持有团类型
                            let selectedInvestObj = $scope.modalView.modalInvestListSelect;
                            angular.forEach(selectedInvestObj, (data) => {
                                vList.push(data.dataName);
                            });
                            condition = {
                                conditionName: dicSelectedobj.dataCode,
                                valueList: vList,
                                operator: operateCode
                            };
                            conForShow = `${dicSelectedobj.dataName}${operateName}${JSON.stringify(vList)}`;
                            conditionForShow = {
                                conditionName: dicSelectedobj.dataCode,
                                conditionString: conForShow
                            };
                            break;
                        case "boolean": //是否有投资行为  是和否  默认 operate：=
                            vList = [$scope.isTouzi];
                            condition = {
                                conditionName: dicSelectedobj.dataCode,
                                valueList: vList,
                                operator: "="
                            };
                            conForShow = `${dicSelectedobj.dataName} ${JSON.stringify(vList)}`;
                            conditionForShow = {
                                conditionName: dicSelectedobj.dataCode,
                                conditionString: conForShow
                            };
                            break;
                        default:
                            break;
                    }
                    /*将对比条件 和 回显条件追加到local*/
                    let conditions = JSON.parse(localStorage.getItem("conditions")) || [];
                    /*在local不存在的对比条件添加到local
                      只添加筛选条件和操作符不一样的
                     */
                    let existConditions = conditions.filter(f => {
                        return f.conditionName == condition.conditionName;
                    });
                    condition = _.extend(condition, conditionForShow);
                    if (existConditions.length == 0) {
                        conditions.push(condition);
                    } else {
                        let existOperators = existConditions.filter(f => {
                            return f.operator == condition.operator;
                        });
                        if (existOperators.length == 0) {
                            conditions.push(condition);
                        } else {
                            if (existOperators.filter(f => {
                                    return JSON.stringify(f.valueList) == JSON.stringify(condition.valueList)
                                }).length == 0) {
                                conditions.push(condition);
                            }
                        }
                    }
                    localStorage.setItem("conditions", JSON.stringify(conditions));
                    $scope.cancel();
                    createBar();
                };
                $scope.cancel = () => {
                    $uibModalInstance.dismiss('cancel');
                };
                $scope.initModalPage = () => {
                    getDic();
                };
                $scope.initModalPage();
            }]
        });
        modalInstance.opened.then(function () {
        });
        modalInstance.result.then(function (result) {//console.log(result);
            },
            function (reason) { //console.log(reason);
            });
    };

    /**
     * 调用接口，创建柱状图
     */
    let createBar = () => {
        $scope.viewModel.loading = true;
        //回显已选的条件
        $scope.conditionsObjFromLocal = JSON.parse(localStorage.getItem("conditions")) || [];
        let refferalNames = [];
        angular.forEach($scope.viewModel.channelListSelected, (data) => {
            refferalNames.push(data.refferalName);
        });
        let postData = {
            refferalNames: refferalNames,
            conditions: $scope.conditionsObjFromLocal
        };
        OtherCompareService.getPeopleAnalyzeData(postData)
            .then(data => {
                $scope.viewModel.loading = false;
                if (data && data.code == 200) {
                    let option = {
                        color: ['rgb(25, 183, 207)'],
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {left: '3%', right: '4%', bottom: '6%', containLabel: true},
                        xAxis: [
                            {
                                type: 'category',
                                data: data.result.refferals
                            }
                        ],
                        yAxis: [{type: 'value'}],
                        series: [
                            {
                                name: '人数',
                                type: 'bar',
                                data: data.result.data
                            }
                        ]
                    };
                    /*渠道数量多于8个，加入dataZoom组件，支持鼠标拖拽 和 单独的滚动条*/
                    if (data.result.refferals.length > 8) {
                        option.dataZoom = [
                            {
                                type: 'slider',
                                show: true,
                                xAxisIndex: [0],
                                startValue: 0,
                                endValue: 7,
                                zoomLock: true,
                                bottom: '0',
                                showDetail: false
                            },
                            {
                                type: 'inside'
                            }
                        ];
                    }
                    $scope.otherCompareOption = option;
                }
            });
    };

    /**
     * 从本地local中删除对比条件
     * 刷新已选条件显示
     * 刷新柱状图
     * */
    $scope.deleteCondition = (conditionString) => {
        let conditionsObjFromLocal = JSON.parse(localStorage.getItem("conditions")) || [];
        let conditions = conditionsObjFromLocal.filter(con => {
            return con.conditionString != conditionString;
        });
        localStorage.setItem("conditions", JSON.stringify(conditions));
        createBar();
    };
    $scope.channelChange = () => {
        createBar();
    };
    $scope.initPage = () => {
        getChannelList();
        createBar();
    };
    /**
     * 数据验证，验证过返回，不过提示(金额、天数)
     */
    let dataValid = (value) => {
        //正数正则表达式
        let numberRegex = /^\d+(?=\.{0,1}\d+$|$)/;
        return numberRegex.test(value);
    };
}

angular.module('controller').controller("OtherCompareController", OtherCompareController);