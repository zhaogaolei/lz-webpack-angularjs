HomeController.$inject = ['$scope', '$location', 'permissions', '$rootScope', '$http', '$q'];

class Menu {
    /**
     * @param title 菜单名称
     * @param url   菜单链接
     * @param permission 权限配置
     * @param icon   字体图标
     * @param isNavCollapsed  是否展开菜单
     */
    constructor(title, url, permission, icon, isNavCollapsed = false) {
        this.title = title;
        this.url = url;
        this.icon = icon;
        this.permission = permission;
        this.isNavCollapsed = isNavCollapsed;
        this.childrens = [];
    }

    addChildren(obj) {
        this.childrens.push(obj);
    }
}

function HomeController($scope, $location, permissions, $rootScope, $window, $state) {
    $scope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (toState.name === "login") return;
        if (!IsDebug) {
            if ($window.localStorage.currentUser) {
                let permission = toState.permission;
                if (_.isString(permission) && !permissions.hasPermission($rootScope.currentUser, permission)) {
                    $location.path('/main/unauthorized');
                }
            } else {
                event.preventDefault();// 取消默认跳转行为
                $scope.signOut();
            }
        }
    });

    // $scope.isNavCollapsed = false;

    $scope.initPage = function () {
        let menus = [];
        menus.push(new Menu("Dashboard", "", "dashboard", "icon-icon-dashboard", true));
        menus.push(new Menu("投放计划", "", "delivery_manage", "icon-icon-schedule"));
        menus.push(new Menu("渠道管理", "", "channel_manage", "icon-icon-channel"));
        // menus.push(new Menu("素材管理", "", "material_manage", "icon-icon-picture"));
        //menus.push(new Menu("活动页管理", "main.activity", "activity_page", "fa fa-file"));//mc项目改造
        //menus.push(new Menu("渠道ROI", "main.channelroi", "roi_page", "icon-icon-chart"));
        menus.push(new Menu("设置", "", "", "icon-icon-settings"));
        //menus.push(new Menu("智能运营", "", "", "icon-icon-ai"));
        //menus.push(new Menu("SEM报表", "main.semreport", "sem_report_page", "fa fa-file"));//mc项目改造
        //menus.push(new Menu("活动数据", "main.activitydata", "activity_data_page", "fa fa-file-excel-o"));//mc项目改造，隐藏bi报表展示3月12日
        //enus.push(new Menu("MGM", "", "mgm_manage", "fa fa-users"));//mc项目改造，隐藏bi报表展示3月12日
        //menus.push(new Menu("代理人", "", "proxy_manage", "fa fa-users"));//mc项目改造
        menus[0].addChildren(new Menu("dashboard", "main.dashboard.tab1", "dashboard_preview_page", ""));
        //menus[0].addChildren(new Menu("BI报表", "main.bi.tab1", "dashboard_bi_page", ""));//mc项目改造，隐藏bi报表展示3月12日
        menus[0].addChildren(new Menu("渠道明细报表", "main.channelDetail", "channel_detail_page", ""));
        //menus[0].addChildren(new Menu("其他维度对比", "main.othercompare", "other_compare_page", ""));//mc项目改造，隐藏bi报表展示3月12日
        menus[1].addChildren(new Menu("投放计划", "main.deliverplan", "delivery_page", ""));
        menus[2].addChildren(new Menu("单渠道/BD", "main.singlechannel", "channel_page", ""));
        menus[2].addChildren(new Menu("代理商管理", "main.agentmgr", "agent_page", ""));
        // menus[3].addChildren(new Menu("素材列表", "main.materiallist", "material_page", ""));
        menus[3].addChildren(new Menu("主数据", "main.maindata", "maindata_page", ""));
        menus[3].addChildren(new Menu("权限设置", "main.permission", "permission_page", ""));
        menus[3].addChildren(new Menu("定时任务", "main.joblist", "job_page", ""));
        //menus[5].addChildren(new Menu("投放动作对比", "main.dacompare", "dacompare_page", ""));
        //menus[5].addChildren(new Menu("ROI", "main.roimodel", "abt_roi_page", ""));
        // menus[9].addChildren(new Menu("MGM活动","main.mgmactivity","mgm_activity_page",""));//mc项目改造，隐藏bi报表展示3月12日
        // menus[9].addChildren(new Menu("MGM报表","main.mgmreport","mgm_report_page",""));
        // menus[9].addChildren(new Menu("MGM结算","main.mgmsettle","mgm_settle_page",""));
        // menus[8].addChildren(new Menu("代理人活动","main.proxyactivity","",""));//mc项目改造
        // menus[8].addChildren(new Menu("奖励发放管理","main.proxyreward","",""));
        // menus[8].addChildren(new Menu("代理人用户管理","main.proxyuser","",""));
        // menus[8].addChildren(new Menu("代理人等级管理","main.proxylevel","",""));
        $scope.menus = menus;
    }

    $scope.signOut = () => {
        permissions.deletePermissions();
        $state.go("login");
    };

    $scope.$on("UserDeniedPermission", (event, res) => {
        event.preventDefault();
        $scope.signOut();
    });
}

angular.module('controller').controller("HomeController", HomeController);