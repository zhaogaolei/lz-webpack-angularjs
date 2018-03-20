export default function config($stateProvider) {
    /*单渠道*/
    let singlechannelState = {
        name: 'singlechannel',
        url: '/singlechannel',
        cache: false,
        template: require('../../views/channel/singlechannel.html'),
        controller: 'SingleChannelController',
        permission: 'channel_page'
    };
    let adListState = {
        name: 'adlist',
        url: '/adlist/:id/:channelname',
        template: require('../../views/channel/adlist.html'),
        controller: 'AdListController',
        permission: 'channel_add_page'
    };

    /*代理商管理*/
    let agentMgr = {
        name: 'agentmgr',
        url: '/agentmgr',
        template: require('../../views/channel/agentmgr.html'),
        controller: 'AgentMgrController',
        permission: 'agentmgr_page'
    };
    /*代理商管理-编辑*/
    let agentMgrEdit = {
        name: 'agentmgredit',
        url: '/agentmgredit/:id/:agentId/:name',
        template: require('../../views/channel/agentmgredit.html'),
        controller: 'AgentMgrEditController',
        permission: 'agentmgr_edit_page'
    };

    // 渠道管理
    $stateProvider.state('main.singlechannel', singlechannelState);
    $stateProvider.state('main.adlist', adListState);
    //代理商
    $stateProvider.state('main.agentmgr', agentMgr);
    $stateProvider.state('main.agentmgredit', agentMgrEdit);
}
config.$inject = ['$stateProvider'];

