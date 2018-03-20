export default function config($stateProvider) {
    /*渠道ROI*/
    let channelRoi = {
        name: 'channelroi',
        url: '/channelroi',
        template: require('../../views/channelroi/channelroi.html'),
        controller: 'RoiController',
        permission: 'roi_page'
    };

    //渠道ROI
    $stateProvider.state('main.channelroi', channelRoi);
}
config.$inject = ['$stateProvider'];

