export default function config($stateProvider) {

    /*主数据*/
    let mainData = {
        name: 'maindata',
        url: '/maindata',
        template: require('../../views/setting/maindata.html'),
        controller: 'MainDataController',
        permission: 'maindata_page'
    };
    let mainDataEdit = {
        name: 'maindataedit',
        url: '/maindataedit/:id/:code/:name',
        template: require('../../views/setting/maindataedit.html'),
        controller: 'MainDataEditController',
        permission: 'maindata_edit_page'
    };
    /*权限设置*/
    let permissionMgr = {
        name: 'permissionmgr',
        url: '/permissionmgr',
        template: require('../../views/setting/permissionmgr.html'),
        controller: 'PermissionController',
        permission: 'permission_page'
    };
    /*joblist*/
    let jobList = {
        name: 'joblist',
        url: '/joblist',
        template: require('../../views/setting/joblist.html'),
        controller: 'JobController',
        permission: 'job_page'
    };

    //主数据
    $stateProvider.state('main.maindata', mainData);
    $stateProvider.state('main.maindataedit', mainDataEdit);
    /*权限*/
    $stateProvider.state("main.permission", permissionMgr);
    /*job */
    $stateProvider.state("main.joblist", jobList);
}
config.$inject = ['$stateProvider'];

