export default function config($stateProvider) {
    /*代理人活动*/
    let proxyActivityState = {
        name: 'proxyactivity',
        url: '/proxy/activity',
        template: require('../../views/mgm/mgm_activity.html'),
        controller: 'MgmActivityController',
        permission: 'proxy_activity_page',
        activityType:'VIP'
    };
    $stateProvider.state('main.proxyactivity', proxyActivityState);
    //奖励发放
    let proxyRewardState = {
        name: 'proxyreward',
        url: '/proxy/reward',
        template: require('../../views/proxy/proxy.reward.html'),
        controller: 'ProxyRewardController'
    };
    $stateProvider.state('main.proxyreward', proxyRewardState);
    //代理人用户管理
    let proxyUserState = {
        name: 'proxyuser',
        url: '/proxy/user',
        template: require('../../views/proxy/proxy.user.html'),
        controller: 'ProxyUserController'
    };
    $stateProvider.state('main.proxyuser', proxyUserState);
    //代理人等级管理
    let proxyLevelState = {
        name: 'proxylevel',
        url: '/proxy/level',
        template: require('../../views/proxy/proxy.level.html'),
        controller: 'ProxyLevelController'
    };
    $stateProvider.state('main.proxylevel', proxyLevelState);
    //设置邀请权益
    let proxyLevelInviteRightState = {
        name: 'inviteright',
        url: '/proxy/inviteright/:levelId/:levelName',
        template: require('../../views/proxy/proxy.level.invite.right.set.html'),
        controller: 'ProxyLevelInviteRightSetController'
    };
    $stateProvider.state('main.inviteright', proxyLevelInviteRightState);
    //新增邀请权益
    let proxyLevelInviteRightAddState = {
        name: 'inviterightadd',
        url: '/proxy/inviteright/add/:levelId/:levelName',
        template: require('../../views/proxy/proxy.level.invite.right.add.html'),
        controller: 'ProxyLevelInviteRightAddController'
    };
    $stateProvider.state('main.inviterightadd', proxyLevelInviteRightAddState);

}
config.$inject = ['$stateProvider'];

