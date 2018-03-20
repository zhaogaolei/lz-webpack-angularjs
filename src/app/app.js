import angular from 'angular';
import sanitize from 'angular-sanitize';
import ngCookies from 'angular-cookies';
import uiRouter from 'angular-ui-router';
import 'ng-table';
import * as _ from 'lodash';
import 'angular-ui-bootstrap';
import UtilsService from './basic.server';
import uiBootstrap from 'angular-ui-bootstrap';
import toastr from 'angular-toastr';
import fileUpload from 'ng-file-upload';
import 'moment';
import 'bootstrap';
import 'angular-bootstrap-datetimepicker';
import '../../node_modules/isteven-angular-multiselect/isteven-multi-select.css';
import '../lib/isteven-multi-select.js';
import '../../node_modules/metismenu/dist/metisMenu.min';
import '../../node_modules/metismenu/dist/metisMenu.min.css';
import '../../node_modules/angular-tooltips/dist/angular-tooltips.min';
import '../../node_modules/angular-tooltips/dist/angular-tooltips.min.css';
import clipboardModule from 'angular-clipboard';
import 'angularjs-slider';
import '../../node_modules/angularjs-slider/dist/rzslider.css';
import '../styles/loader.css';

import './controllers';
import './services';
import './directives'
import './filter/main.filter';
import './configs';

//angular chart
import angularchart from "angular-chart.js"

//css
import '../styles/main.css';
import '../styles/golbal.css';
import '../styles/timeline.css';
import '../styles/app.css';
import '../styles/font.css';
import '../styles/vendor.css';
import '../styles/login.css';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/ng-table/dist/ng-table.css';
import '../../node_modules/angular-toastr/dist/angular-toastr.css';
import '../../node_modules/angular-bootstrap-datetimepicker/src/css/datetimepicker.css';

let homeModule = angular.module('opchannelapp',
    [uiRouter, uiBootstrap, toastr, 'ngTable', sanitize, 'isteven-multi-select', 'directives', 'routes',
        'controller', 'services', 'main.filter', fileUpload,
        'ui.bootstrap.datetimepicker', angularchart, '720kb.tooltips', clipboardModule.name, "rzModule", ngCookies]);

homeModule.factory('UtilsService', UtilsService);
/*angular-toastr customization*/
homeModule.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 1,  //设置1：多个提示重叠显示
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body',
        closeButton: true,
        timeOut: 3000,
    });
});

/**
 * 程序run时，请求uiauth接口，获取权限数据
 * */
// let permissionList;
homeModule.run(function ($window, $location, permissions) {
    if ($window.localStorage.currentUser) {
        permissions.setPermissions(angular.fromJson($window.localStorage.currentUser));
    }
    else {
        permissions.deletePermissions();
        $location.path("/login").replace();
    }
});

angular.element(document).ready(function () {
    angular.bootstrap(document, ['opchannelapp']);
});
