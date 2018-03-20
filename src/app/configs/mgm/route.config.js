export default function config($stateProvider) {
    /*MGM  Start*/
    let mgmActivityState = {
        name: 'mgmactivity',
        url: '/mgm/activity',
        template: require('../../views/mgm/mgm_activity.html'),
        controller: 'MgmActivityController',
        permission: 'mgm_activity_page',
        activityType: 'MGM'
    };
    let mgmActivityEditState = {
        name: 'mgmactivityedit',
        url: '/mgm/activity/edit/:mgmId/:copyedit',
        template: require('../../views/mgm/mgm_activity_edit.html'),
        controller: 'MgmActivityEditController',
        permission: 'mgm_activity_page'
    };
    let mgmReportState = {
        name: 'mgmreport',
        url: '/mgm/report',
        template: require('../../views/mgm/mgm_report.html'),
        controller: 'MgmReportController',
        permission: 'mgm_report_page'
    };
    let mgmReportDetailState = {
        name: 'mgmreportdetail',
        url: '/mgm/report/detail',
        template: require('../../views/mgm/mgm_report_detail.html'),
        controller: 'MgmReportDetailController',
        permission: 'mgm_report_detail_page'
    };
    //奖励统计主表
    let mgmSettlementState = {
        name: 'mgmsettle',
        url: '/mgm/settlement',
        template: require('../../views/mgm/mgm_settlement.html'),
        controller: 'MgmSettleController',
        permission: 'mgm_settle_page'
    };
    //奖励统计明细表
    let mgmSettlementDetailState = {
        name: 'mgmsettledetail',
        url: '/mgm/settlement/detail/:mgmId/:couponName',
        template: require('../../views/mgm/mgm_settlement_detail.html'),
        controller: 'MgmSettleDetailController',
        permission: 'mgm_settle_page'
    };
    //奖励发放
    let mgmRewardGiveState = {
        name: 'rewardgive',
        url: '/mgm/reward/give/:mgmId',
        template: require('../../views/mgm/mgm_reward_give.html'),
        controller: 'MgmRewardGiveController',
        permission: 'mgm_reward_give_page'
    };
    /*MGM  End*/

    /*MGM  Start*/
    $stateProvider.state('main.mgmactivity', mgmActivityState);
    $stateProvider.state('main.mgmactivityedit', mgmActivityEditState);
    $stateProvider.state('main.mgmreport', mgmReportState);
    $stateProvider.state('main.mgmreportdetail', mgmReportDetailState);
    $stateProvider.state('main.mgmsettle', mgmSettlementState);
    $stateProvider.state('main.mgmsettledetail', mgmSettlementDetailState);
    $stateProvider.state('main.rewardgive', mgmRewardGiveState);
    /*MGM  End*/
}
config.$inject = ['$stateProvider'];

