export default function config($stateProvider) {
    /*sem报表*/
    let semReport = {
        name: 'semreport',
        url: '/semreport',
        template: require('../../views/sem/sem_report.html'),
        controller: 'SemReportController',
        permission: 'sem_report_page'
    };
    let semReportDetail = {
        name: 'semreportdetail',
        url: '/semreportdetail/:id',
        template: require('../../views/sem/sem_report_detail.html'),
        controller: 'SemReportDetailController',
        permission: 'sem_report_detail_page'
    };
    /*SEM投放动作*/
    let semDeliverState = {
        name: 'semDeliveAction',
        url: '/semDeliveAction/:id/:campaignName',
        template: require('../../views/sem/semDeliverList.html'),
        controller: 'SemDeliverActionController',
    };
    /*SEM投放keywords列表*/
    let semDeliverDetailState = {
        name: 'semDeliveDetailAction',
        url: '/semDeliveDetailAction/:id',
        template: require('../../views/sem/semActionDetail.html'),
        controller: 'SemDeliverActionDetailController',
    };
    /*sem单渠道*/
    let singlechannelSemState = {
        name: 'singlechannelSem',
        url: '/singlechannelSem/:id/:channelname',
        cache: false,
        template: require('../../views/sem/semChannelAccount.html'),
        controller: 'SemChannelAccountController',
        permission: 'channel_page'
    };


    $stateProvider.state('main.singlechannelSem', singlechannelSemState);
    /*sem报表*/
    $stateProvider.state('main.semreport', semReport);
    $stateProvider.state('main.semreportdetail', semReportDetail);
    /*SEM投放动作*/
    $stateProvider.state('main.semdeliveraction', semDeliverState);
    $stateProvider.state('main.semdeliveractionDetail', semDeliverDetailState);
}
config.$inject = ['$stateProvider'];

