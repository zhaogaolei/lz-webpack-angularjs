export default function config($stateProvider) {
    let activity = {
        name: 'activity',
        url: "/activity",
        permission: 'activity_page',
        template: require('../../views/activity/activity.html'),
        controller: 'ActivityController'
    };
    let activityEdit = {
        name: 'activityEdit',
        url: "/activity/edit/:activityId/:activityName",
        permission: 'activity_edit_page',
        template: require('../../views/activity/activity.edit.html'),
        controller: 'ActivityEditController'
    };
    /*活动数据*/
    let activityDataState = {
        name: 'activitydata',
        url: '/activitydata',
        template: require('../../views/activity/activity.data.html'),
        controller: 'ActivityDataController',
        permission: 'activity_data_page'
    };

    /*活动*/
    $stateProvider.state("main.activity", activity);
    $stateProvider.state("main.activityEdit", activityEdit);
    /*活动数据*/
    $stateProvider.state('main.activitydata', activityDataState);
}
config.$inject = ['$stateProvider'];

