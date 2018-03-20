export default function config($stateProvider) {
    /**
     * dashboard
     */
    let dashboard = {
        name: 'dashboard',
        url: "/dashboard",
        template: require('../../views/dashboard/dashboard.html'),
        controller: 'DashboardController',
        permission: 'dashboard_preview_page'
    };
    /*概览*/
    let dashboardTab1 = {
        name: 'dashboardTab1',
        url: "/tab1",
        parent: dashboard,
        permission: 'dashboard_preview_page',
        template: require('../../views/dashboard/dashboard_tab1.html'),
        controller: 'DashboardController1',
    };
    let dashboardTab1_Single = {
        name: 'dashboardTab1Single',
        url: "/single/:bizType/:appType/:channel_id",
        parent: dashboardTab1,
        permission: 'dashboard_preview_page',
        template: require('../../views/dashboard/dashboard_tab1_single.html'),
        controller: 'DashboardController1Single',
    };
    let dashboardTab1_All = {
        name: 'dashboardTab1All',
        url: "/all/:bizType/:appType",
        parent: dashboardTab1,
        permission: 'dashboard_preview_page',
        template: require('../../views/dashboard/dashboard_tab1_all.html'),
        controller: 'DashboardController1All',
    };
    /*实时*/
    let dashboardTab2 = {
        name: 'dashboardTab2',
        url: "/tab2",
        template: require('../../views/dashboard/dashboard_tab2.html'),
        permission: 'dashboard_preview_page',
        controller: 'DashboardController2'
    };
    /**
     * bi报表
     * @type {{name: string, url: string, permission: string, template: *, controller: string}}
     */
    let bi = {
        name: 'bi',
        url: "/bi",
        template: require('../../views/bi/bi.html'),
        permission: 'dashboard_bi'
    };
    /*BI报表*/
    let biTab1 = {
        name: 'biTab1',
        url: "/tab1",
        permission: 'dashboard_bi_page',
        template: require('../../views/bi/bi_tab1.html'),
        controller: 'DashboardBiController',
    };
    /*用户留存情况*/
    let biTab2 = {
        name: 'biTab2',
        url: "/tab2",
        permission: 'dashboard_bi_page',
        template: require('../../views/bi/bi_tab2.html'),
        controller: 'DashboardBiController',
    };
    /*渠道每日转化率*/
    let biTab3 = {
        name: 'biTab3',
        url: "/tab3",
        permission: 'dashboard_bi_page',
        template: require('../../views/bi/bi_tab3.html'),
        controller: 'DashboardBiController',
    };
    /*运营测试卡券日报*/
    let biTab4 = {
        name: 'biTab4',
        url: "/tab4",
        permission: 'dashboard_bi_page',
        template: require('../../views/bi/bi_tab4.html'),
        controller: 'DashboardBiController',
    };
    /*渠道明细报表*/
    let channelDetail = {
        name: 'channelDetail',
        url: '/channelDetail',
        template: require('../../views/dashboard/channelDetail.html'),
        controller: 'ChannelDetailController',
        permission: 'channel_detail_page'
    };

    /*其他维度对比*/
    let otherCompare = {
        name: 'othercompare',
        url: '/othercompare',
        template: require('../../views/dashboard/other_compare.html'),
        controller: 'OtherCompareController',
        permission: 'other_compare_page'
    };
    //dashboard
    $stateProvider.state('main.dashboard', dashboard);
    $stateProvider.state('main.dashboard.tab1', dashboardTab1);
    $stateProvider.state('main.dashboard.tab1.single', dashboardTab1_Single);
    $stateProvider.state('main.dashboard.tab1.all', dashboardTab1_All);
    $stateProvider.state('main.dashboard.tab2', dashboardTab2);
    /*bi*/
    $stateProvider.state('main.bi', bi);
    $stateProvider.state('main.bi.tab1', biTab1);
    $stateProvider.state('main.bi.tab2', biTab2);
    $stateProvider.state('main.bi.tab3', biTab3);
    $stateProvider.state('main.bi.tab4', biTab4);
    $stateProvider.state('main.channelDetail', channelDetail);
    /*其他维度对比*/
    $stateProvider.state('main.othercompare', otherCompare);
}
config.$inject = ['$stateProvider'];

