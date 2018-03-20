import * as constant from '../../constant';
import mainDataTpl from '../../templates/modal-maindata.html';
import channelTpl from '../../templates/modal-channel2.html';


/*
 * agentmgr控制器
 */
AgentMgrController.$inject = ['$rootScope', '$scope', 'AgentService', '$stateParams', '$state', '$timeout',];
function AgentMgrController($rootScope, $scope, AgentService, $stateParams, $state, $timeout) {

    $scope.queryConstant = function () {
        AgentService.getChannelStatus().then(function (data) {
            if (data && data.code == '200') {
                $scope.channelStatusList = data.result;
            }
        });
    }

    $scope.queryConstant();

    /*
     *查询agent by pagination
     * no-currntpage, size-pageSize, state-filterState
     */
    $scope.queryPaginationList = function (no, size, state, reInit, column, sort) {
        let arg = {
            pageNo: no,
            pageSize: size ? size : 20
        }
        if (state) {
            arg.agentState = state;
        }
        if (column && sort) {
            arg.orderName = column;
            arg.orderSort = sort;
        }
        AgentService.queryPaginationList(arg).then(function (data) {
            if (data && data.code == '200') {
                $scope.mainData = data.result;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            }
        });
    }

    let pageSize = 10, pageNo = 1;
    $scope.queryPaginationList(pageNo, pageSize, null, true);

    /*根据状态过滤*/
    $scope.reloadByState = function () {
        if ($scope.taskState) {
            $scope.queryPaginationList(pageNo, pageSize, $scope.taskState, true);
        } else {
            $scope.queryPaginationList(pageNo, pageSize, null, true);
        }
    }

    /*reload pagination data*/
    $scope.$on("dr.agentPagination", function (scope, no, size, state) {
        if ($scope.sort && $scope.taskState) {
            $scope.queryPaginationList(no, size, $scope.taskState, false, $scope.column, $scope.sort);
        }
        else if ($scope.sort && !$scope.taskState) {
            $scope.queryPaginationList(no, size, null, false, $scope.column, $scope.sort);
        }
        else if (!$scope.sort && $scope.taskState) {
            $scope.queryPaginationList(no, size, $scope.taskState, false);
        }
        else {
            $scope.queryPaginationList(no, size);
        }
    });

    $scope.$on('sortEvent', function (scope, column, sort) {
        if (column && sort && $scope.taskState) {
            $scope.column = column;
            $scope.sort = sort;
            $scope.queryPaginationList(pageNo, pageSize, $scope.taskState, true, column, sort);
        }
        else if (sort && !$scope.taskState) {
            $scope.column = column;
            $scope.sort = sort;
            $scope.queryPaginationList(pageNo, pageSize, null, true, column, sort);
        }
        else if (!sort && $scope.taskState) {
            $scope.column = null;
            $scope.sort = null;
            $scope.queryPaginationList(pageNo, pageSize, $scope.taskState, true);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            $scope.queryPaginationList(pageNo, pageSize, $scope.taskState, true);
        }
    })

    $scope.go = function (id, agentId, name) {
        $state.go('main.agentmgredit', {id: id, agentId: agentId, name: name});
    }
}

/*
 * agentmgredit控制器
 */
AgentMgrEditController.$inject = ['$rootScope', '$scope', 'AgentService', '$stateParams', '$state', '$uibModal', 'toastr', '$timeout'];
function AgentMgrEditController($rootScope, $scope, AgentService, $stateParams, $state, $uibModal, toastr, $timeout) {
    $scope.name = $stateParams.name;

    $scope.is = [{dataName: "是", dataCode: 1}, {dataName: "否", dataCode: 0}];

    $scope.showBasicInfo = true;
    $scope.showChannel = false;
    // 默认未创建计划为false
    $scope.planCreated = false;
    $scope.changeTab = function (arg) {
        if (arg === 'basicInfo') {
            $scope.showBasicInfo = true;
            $scope.showChannel = false;
        }
        if (arg === 'channel' && $scope.planCreated) {
            $scope.showBasicInfo = false;
            $scope.showChannel = true;
            // fetch all channel and deliver action
            $scope.$emit('fetchChannel');
        }
    }

    /*get channel status*/
    $scope.queryStatus = function () {
        AgentService.getChannelStatus().then(function (data) {
            if (data && data.code == '200') {
                $scope.channelStatus = data.result;
            }
        });
    }
    /*get open interface*/
    $scope.queryOpenInterface = function () {
        AgentService.queryOpenInterface().then(function (data) {
            if (data && data.code == '200') {
                $scope.openInterfaces = data.result;
                // add formData. prefix
                //_.forEach($scope.openInterfaces, function (v) {
                    //v.dataCode2 = "formData.interface." + v.dataCode;
                //});
            }
        });
    }
    /*get agent by id*/
    $scope.reloadAgent = function (id) {
        AgentService.getAgentById(id).then(function (data) {
            if (data && data.code == '200') {
                $scope.formData = data.result;
                $scope.planCreated = true;
            }
        });
    }

    $scope.queryOpenInterface();
    $scope.queryStatus();
    if ($stateParams.id) {
        $scope.reloadAgent($stateParams.id);
    }

    /*save agent*/
    $scope.saveAgent = function () {
        if ($scope.formData) {
            AgentService.saveAgent($scope.formData).then(function (data) {
                if (data && data.code == '200') {
                    $scope.formData.id = data.result.id;
                    $scope.formData.agentId = data.result.agentId;
                    toastr.success("保存成功!");
                    $scope.planCreated = true;
                    // 保存成功 切换到 渠道
                    $scope.changeTab('channel');
                }
            });
        }
    }


    $scope.goMain = function () {
        $state.go('main.agentmgr');
    }

    ///////////////////////////////////////////////
    /*select all agent channel*/
    /*
     *查询agent by pagination
     * no-currntpage, size-pageSize, state-filterState
     */
    $scope.queryPaginationList = function (no, size, reInit, column, sort, agentId) {
        let arg = {
            pageNo: no,
            pageSize: size ? size : 20,
            agentId: agentId
        }
        if (column && sort) {
            arg.sortName = column;
            arg.sortOrder = sort;
        }
        AgentService.getChannelPaginationByAgentId(arg).then(function (data) {
            if (data && data.code == '200') {
                $scope.agentChannelList = data.result;
                if (reInit) {
                    $timeout(function () {
                        $rootScope.$broadcast('modelInitialized', this);
                    }, 500);
                }
            }
        });
    }

    /*reload pagination data*/
    $scope.$on("dr.agentChannelPagination", function (scope, no, size, state) {
        if ($scope.sort) {
            $scope.queryPaginationList(no, size, false, $scope.column, $scope.sort, $scope.agentId);
        }
        else {
            $scope.queryPaginationList(no, size, false, null, null, $scope.agentId);
        }
    });

    let pageSize = 10, pageNo = 1;
    $scope.$on('sortEvent', function (scope, column, sort) {
        if (column && sort) {
            $scope.column = column;
            $scope.sort = sort;
            $scope.queryPaginationList(pageNo, pageSize, true, column, sort, $scope.agentId);
        }
        else {
            $scope.column = null;
            $scope.sort = null;
            $scope.queryPaginationList(pageNo, pageSize, true, null, null, $scope.agentId);
        }
    })

    /*
     *查询所有渠道
     */
    $scope.getAllChannel = function () {
        AgentService.getAllChannel(2).then(function (data) {
            if (data && data.code == '200') {
                $scope.channelData = data.result;
            }
        });
    }
    /*
     *查询所有单渠道和代理商数据，仅用于数据搜索
     */
    $scope.getAllChannelAgent = function () {
        AgentService.getAllChannelAgent().then(function (data) {
            if (data && data.code == '200') {
                // filter data for dropdown-menu
                $scope.channelAgentDataValid = _.filter(data.result, function (o) {
                    return o.refferalStatus != '结束合作'
                })
            }
        });
    };

    $scope.searchList = function () {
        if ($scope.refferalName) {
            $scope.isShowSearchList = true;
        } else {
            $scope.isShowSearchList = false;
        }
    }
    /*点击下拉搜索菜单*/
    $scope.clickDropMenu = function (row) {
        $scope.clickedRow = row;
        $scope.refferalName = row.refferalNameAndAgentName;
    }
    /*查询所有的渠道*/
    $scope.$on('fetchChannel', function () {
        // get all channel data
        $scope.getAllChannel();
        // get all channel and agent
        $scope.getAllChannelAgent();
        // get all agent data
        $scope.getAllAgent();

        $scope.agentId = $stateParams.agentId ? $stateParams.agentId : $scope.formData.agentId;
        if ($scope.agentId) {
            $scope.queryPaginationList(pageNo, pageSize, true, null, null, $scope.agentId);
        }
    })
    /*添加单个渠道*/
    $scope.addChannel = function () {
        let selected = _.find($scope.channelAgentDataValid, {refferalNameAndAgentName: $scope.refferalName});
        if (selected) {
            var arr = [{
                refferalId: selected.id,
                agentId: $scope.agentId
            }];
            $scope.addAgentChannel(arr);
            $scope.refferalName = null;
        } else {
            toastr.error("该渠道不存在，请重新选择或先添加该渠道!");
        }
    }

    /*add agent channel*/
    $scope.addAgentChannel = function (arg) {
        AgentService.addAgentChannel(arg).then(function (data) {
            if (data && data.code == '200') {
                if (data.result) {
                    toastr.warning(data.result);
                } else {
                    toastr.success('添加成功!');
                }
                $scope.queryPaginationList(pageNo, pageSize, true, null, null, $scope.agentId);
            }
        });

        // 隐藏查询列表
        $scope.isShowSearchList = false;
    }
    /*delete agent channel*/
    $scope.delAgentChannel = function (id) {
        AgentService.delAgentChannel(id).then(function (data) {
            if (data && data.code == '200') {
                toastr.success('移除成功!');
                $scope.queryPaginationList(pageNo, pageSize, true, null, null, $scope.agentId);
            }
        });
    }


    /*
     *查询所有代理商
     */
    $scope.getAllAgent = function () {
        AgentService.getAllAgent().then(function (data) {
            if (data && data.code == '200') {
                $scope.agentData = data.result;
            }
        });
    };

    /*query channel and agent*/
    $scope.openAllChannel = function () {
        openChannelModal($scope);
    };

    /*渠道*/
    var openChannelModal = function (parent, cancel) {
        var modalInstance = $uibModal.open({
            size: 'ml',
            animation: true,
            template: channelTpl,
            controller: ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
                $scope.data = parent.channelData;
                $scope.agentData = parent.agentData;

                $scope.getChannelByAngentID = function (id, name) {
                    $scope.curAgentId = id;
                    $scope.curAgentName = name;
                    AgentService.getChannelByAngentID(id).then(function (data) {
                        if (data && data.data.code == '200') {
                            console.log(data);
                            $scope.channelOfAgent = data.data.result;

                        }
                    });
                }

                // default show first agent
                if ($scope.agentData && $scope.agentData.length > 0) {
                    $scope.getChannelByAngentID($scope.agentData[0].agentId, $scope.agentData[0].agentName);
                }

                $scope.ok = function () {
                    var arr = [];
                    if (!$scope.currentTab || $scope.currentTab === 'channel') {
                        angular.forEach($scope.data, function (item) {
                            if (item.checked) {
                                arr.push({
                                    refferalId: item.id,
                                    refferalName: item.refferalName,
                                    publishStatus: item.refferalStatus,
                                    agentId: parent.agentId,
                                    enableSaveBtn: true
                                });
                                item.checked = false; // 避免打开默认选中
                            }
                        });
                    } else {
                        angular.forEach($scope.channelOfAgent, function (item) {
                            if (item.checked) {
                                arr.push({
                                    refferalId: item.id,
                                    refferalName: item.refferalName,
                                    publishStatus: item.refferalStatus,
                                    agentId: $scope.curAgentId,
                                    agentName: $scope.curAgentName,
                                    enableSaveBtn: true
                                });
                                item.checked = false; // 避免打开默认选中
                            }
                        });
                    }
                    if (arr.length > 0) {
                        parent.addAgentChannel(arr);
                    }
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    if (cancel) {
                        cancel();
                    }
                    $uibModalInstance.dismiss('cancel');
                };

                /*选择渠道时，清空代理商选择，反之*/
                $scope.clearSelect = function (tabname) {
                    $scope.currentTab = tabname;
                    if (tabname === 'channel') {
                        _.forEach($scope.channelOfAgent, function (v) {
                            v.checked = false;
                        })
                    }
                    if (tabname === 'agent') {
                        _.forEach($scope.data, function (v) {
                            v.checked = false;
                        })
                    }
                }

                // 过滤:如已加入 A渠道-A代理商, 则过滤过A渠道-*(除A渠道-A代理商) 同一渠道只能有一种代理商
                $scope.checkboxFilter = function (row) {

                    return false;
                }
            }]
        });
        modalInstance.opened.then(function () {

        });

        modalInstance.result.then(function (result) {
            console.log(result); //result关闭是回传的值
        }, function (reason) {
            console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会暑促cancel
        });
    };


}


angular.module('controller')
    .controller('AgentMgrController', AgentMgrController)
    .controller('AgentMgrEditController', AgentMgrEditController);