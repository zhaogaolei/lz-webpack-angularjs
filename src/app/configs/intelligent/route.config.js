export default function config($stateProvider) {
    /*智能投放动作对比*/
    let deliverActionCompare = {
        name: 'dacompare',
        url: '/dacompare',
        template: require('../../views/intelligent/deliver_action_compare.html'),
        controller: 'DeliverActionCompareController',
        permission: 'dacompare_page'
    };
    /*abt 模型*/
    let abtRoiModel = {
        name: 'roimodel',
        url: '/roimodel',
        template: require('../../views/intelligent/abt_roi_model.html'),
        controller: 'AbtRoiController',
        permission: 'abt_roi_page'
    };

    /*智能投放对比*/
    $stateProvider.state('main.dacompare', deliverActionCompare);
    /*abt roi 模型*/
    $stateProvider.state('main.roimodel', abtRoiModel);
}
config.$inject = ['$stateProvider'];

