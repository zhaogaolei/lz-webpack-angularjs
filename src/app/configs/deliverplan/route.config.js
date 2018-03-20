export default function config($stateProvider) {
    /*投放计划*/
    let deliverplanState = {
        name: 'deliverplan',
        url: '/deliverplan',
        template: require('../../views/deliverplan/deliverplanlist.html'),
        controller: 'DeliverPlanListController',
        permission: 'delivery_page'
    };
    let deliverplanmgrState = {
        name: 'deliverplanmgr',
        url: '/deliverplanmgr/:id/:campaignName',
        template: require('../../views/deliverplan/deliverplanmgr.html'),
        controller: 'DeliverPlanMgrController',
        permission: 'deliverplanmgr_page'
    };

    // 投放计划
    $stateProvider.state('main.deliverplan', deliverplanState);
    $stateProvider.state('main.deliverplanmgr', deliverplanmgrState);
}
config.$inject = ['$stateProvider'];

