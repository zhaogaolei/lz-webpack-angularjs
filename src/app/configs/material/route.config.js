export default function config($stateProvider) {
    /**
     * 素材管理-详情
     */
    let materialListState = {
        name: 'materiallist',
        url: '/materiallist',
        template: require('../../views/material/materiallist.html'),
        controller: 'MaterialListController',
        permission: 'material_page'
    };
    let materialDetailState = {
        name: 'materialdetail',
        url: '/materialdetail/:materialId',
        template: require('../../views/material/materialdetail.html'),
        controller: 'MaterialDetailController',
        permission: 'material_detail_page'
    };

    //素材管理
    $stateProvider.state('main.materialdetail', materialDetailState);
    $stateProvider.state('main.materiallist', materialListState);
}
config.$inject = ['$stateProvider'];

