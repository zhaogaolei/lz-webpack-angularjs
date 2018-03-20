import sortTpl from '../templates/tablesort.html';
import paginationTpl from '../templates/pagination-control.html';
import dateRangePicker from "../templates/date-range-picker.html"
import echarts from '../../lib/echarts.min.js';
/**
 * Created by yunxiaoxie.
 */
angular.module('directives')
/**
 * 列表排序.
 */
    .directive('tbSort', [function () {
        return {
            restrict: 'EA',
            template: sortTpl,
            scope: true,
            transclude: true,
            controller: ['$scope', function ($scope) {
                //current sort and column
                $scope.$parent.curSort = '', $scope.$parent.curCol = '';
                var curSort = '';
                $scope.theadSort = function () {
                    $scope.$parent.curSort = getCurSort();
                    $scope.$parent.curCol = $scope.getColName();
                    $scope.$emit("sortEvent", $scope.$parent.curCol, $scope.$parent.curSort);
                }

                var getCurSort = function () {
                    if (!curSort) {
                        curSort = 'asc';
                    }
                    else if (curSort === 'asc') {
                        curSort = 'desc';
                    }
                    else if (curSort === 'desc') {
                        curSort = '';
                    }
                    return curSort;
                }
            }],
            link: function ($scope, $element, $attrs, ctrl) {

                $scope.getColName = function () {
                    return $attrs.tbSort;
                }
            }
        }
    }])

    .directive('hasPermission', ['$rootScope', 'permissions', function ($rootScope, permissions) {
        return {
            link: function (scope, element, attrs) {
                if (!_.isString(attrs.hasPermission))
                    throw "hasPermission value must be a string";

                var value = attrs.hasPermission.trim();
                var notPermissionFlag = value === "";

                function toggleVisibilityBasedOnPermission() {
                    if (!IsDebug) {
                        var hasPermission = permissions.hasPermission($rootScope.currentUser, value || '');
                        if (hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
                            // element[0].style.display = '';
                        } else {
                            element[0].remove();
                        }
                    }
                }

                toggleVisibilityBasedOnPermission();
                scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
            }
        };
    }])
    /**
     * 页面分页控制.
     */
    .directive('pageControl', [function () {

        return {
            restrict: 'EA',
            template: paginationTpl,
            scope: {
                record: '=',
                evname: '@'
            },
            controller: ['$scope', function ($scope) {
                $scope.$on('modelInitialized', function (event, param) {
                    setPages($scope.record);
                })
                var setPages = function (data) {
                    if (data) {
                        $scope.pgs = {};
                        $scope.pgs.currentPg = data.pageNo;
                        $scope.pgs.lastPg = data.pageTotal;
                        $scope.pgs.pageSize = data.pageSize;
                    }
                }
                $scope.first = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === 1) return;
                    $scope.pgs.currentPg = 1;
                }
                $scope.prev = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === 1) return;
                    $scope.pgs.currentPg -= 1;
                }
                $scope.next = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg >= $scope.pgs.lastPg) return;
                    $scope.pgs.currentPg += 1;
                }
                $scope.last = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === $scope.pgs.lastPg) return;
                    $scope.pgs.currentPg = $scope.pgs.lastPg;
                }
                $scope.$watch('pgs.currentPg', function (newValue, oldValue) {
                    if (newValue) {
                        //$scope.$parent.getMaterialTask($scope.pgs.currentPg, $scope.pgs.pageSize, $scope.$parent.taskState);
                        if ($scope.$parent.taskState) {
                            $scope.$emit($scope.evname, newValue, $scope.pgs.pageSize, $scope.$parent.taskState);
                        }
                        else {
                            $scope.$emit($scope.evname, newValue, $scope.pgs.pageSize);
                        }
                    }
                });
            }],
            link: function ($scope, $element, $attrs, ctrl) {

            }
        }
    }])


    /*
    *1初始化的时候不进行查询，解决分页页面进行两次查询的bug
    *
    * */
    .directive('pageControl1', [function () {

        return {
            restrict: 'EA',
            template: paginationTpl,
            scope: {
                record: '=',
                evname: '@'
            },
            controller: ['$scope', function ($scope) {
                $scope.$on('modelInitialized', function (event, param) {
                        setPages(param);
                })
                $scope.$on('modelClear', function (event, param) {
                    resetPage();
                })

                var setPages = function (data) {
                    if (data) {
                        $scope.pgs = {};
                        $scope.pgs.currentPg = data.pageNo;
                        $scope.pgs.lastPg = data.pageTotal;
                        $scope.pgs.pageSize = data.pageSize;
                    }
                }
                var resetPage = function () {
                        $scope.pgs = {};
                        $scope.pgs.currentPg = null;
                        $scope.pgs.lastPg = null;
                        $scope.pgs.pageSize = null;

                }
                $scope.first = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === 1) return;
                    $scope.pgs.currentPg = 1;
                }
                $scope.prev = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === 1) return;
                    $scope.pgs.currentPg -= 1;
                }
                $scope.next = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg >= $scope.pgs.lastPg) return;
                    $scope.pgs.currentPg += 1;
                }
                $scope.last = function ($event) {
                    if ($event) $event.preventDefault();
                    if ($scope.pgs.currentPg === $scope.pgs.lastPg) return;
                    $scope.pgs.currentPg = $scope.pgs.lastPg;
                }
                $scope.$watch('pgs.currentPg', function (newValue, oldValue) {
                    if (angular.isDefined(oldValue)&&angular.isDefined(newValue)) {

                        //$scope.$parent.getMaterialTask($scope.pgs.currentPg, $scope.pgs.pageSize, $scope.$parent.taskState);
                        if ($scope.$parent.taskState) {
                            $scope.$emit($scope.evname, newValue, $scope.pgs.pageSize, $scope.$parent.taskState);
                        }
                        else {
                            $scope.$emit($scope.evname, newValue, $scope.pgs.pageSize);
                        }
                    }
                });
            }],
            link: function ($scope, $element, $attrs, ctrl) {

            }
        }
    }])
    /**素材列表-截止时间*/
    .directive('stopTimeDirective', ['$compile', function ($compile) {
        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {
                scope.html = "";
                let stopTime = new Date(attrs.stoptime);
                let nowTime = new Date();
                let diff = stopTime.getTime() - nowTime.getTime();//时间差的毫秒数
                let days = Math.floor(diff / (24 * 3600 * 1000));
                // //计算出小时数
                // let leave1 = diff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
                // let hours = Math.floor(leave1 / (3600 * 1000));
                /*24小时后即将过期或过期的素材栏高亮显示*/
                if (days <= 0) {
                    scope.html = "<span style='color:orange'>" + attrs.stoptime + "</span>"
                }
                else {
                    scope.html = "<span>" + attrs.stoptime + "</span>"
                }
                let el = $compile(scope.html)(scope);
                element.append(el);
            }
        };
    }])

    .directive('dateRangePicker', [function () {
        return {
            restrict: 'AE',
            scope: {
                // models
                minDate: '=',
                maxDate: '=',
                onOk: "&",
            },
            template: dateRangePicker,
            link: function ($scope, element, attrs) {
                $scope.options1 = {
                    maxDate: new Date(),

                };
                $scope.options2 = {

                    maxDate: new Date(),
                };

                $scope.isOpen = false;
                $scope.closemodal = function () {
                    $scope.isOpen = false;
                    if (angular.isFunction($scope.onOk)) {
                        $scope.onOk();
                    }
                }
            }
        };
    }])
    .directive('eChart', function ($http, $window) {
        function link($scope, element, attrs) {
            var myChart = echarts.init(element[0]);
            $scope.$watch(attrs['eData'], function () {
                var option = $scope.$eval(attrs.eData);
                if (angular.isObject(option)) {
                    myChart.setOption(option);
                }
            }, true);
            $scope.getDom = function () {
                return {
                    'height': element[0].offsetHeight,
                    'width': element[0].offsetWidth
                };
            };
            $scope.$watch($scope.getDom, function () {
                // resize echarts图表
                myChart.resize();
            }, true);
        }

        return {
            restrict: 'A',
            link: link
        };
    })
    .directive('eChartBar', function () {
        return {
            restrict: 'A',
            link:  function ($scope, element, attrs) {
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs['eData'], function () {
                    var option = $scope.$eval(attrs.eData);
                    if (angular.isObject(option)) {
                        myChart.setOption(option);
                    }
                }, true);
                $scope.getDom = function () {
                    return {
                        'height': element[0].offsetHeight,
                        'width': element[0].offsetWidth
                    };
                };
                $scope.$watch($scope.getDom, function () {
                    // resize echarts图表
                    myChart.resize();
                }, true);
            }
        };
    })
    /*ROI分布图*/
    .directive('eChartScatterD', function () {
        return {
            restrict: 'A',
            link:  function ($scope, element, attrs) {
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs['eData'], function () {
                    var option = $scope.$eval(attrs.eData);
                    if (angular.isObject(option)) {
                        myChart.setOption(option);
                    }
                }, true);
                $scope.getDom = function () {
                    return {
                        'height': element[0].offsetHeight,
                        'width': element[0].offsetWidth
                    };
                };
                $scope.$watch($scope.getDom, function () {
                    // resize echarts图表
                    myChart.resize();
                }, true);
            }
        };
    })
    /*ROI象限图*/
    .directive('eChartScatterQ', function () {
        return {
            restrict: 'A',
            link:  function ($scope, element, attrs) {
                var myChart = echarts.init(element[0]);
                $scope.$watch(attrs['eData'], function () {
                    var option = $scope.$eval(attrs.eData);
                    if (angular.isObject(option)) {
                        myChart.setOption(option);
                    }
                }, true);
                $scope.getDom = function () {
                    return {
                        'height': element[0].offsetHeight,
                        'width': element[0].offsetWidth
                    };
                };
                $scope.$watch($scope.getDom, function () {
                    // resize echarts图表
                    myChart.resize();
                }, true);
            }
        };
    })
    /**
     * 活动列表按钮
     * */
    .directive("activityListButton", ["$state", "$compile", "ActivityService", function ($state, $compile, ActivityService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                activeStatusName:"@",
                activeStatus:"@",
                activeName:"@",
                initialUrl:"@",
                id:"@",
            },
            template: "<div></div>",
            link: function (scope, element, attrs) {
                scope.html = "";
                let preViewHtml = "";
                let spanHtml = "";
                if (scope.activeStatusName == '已下线') {
                    preViewHtml = "<button has-permission='activity_preview' type='button' class='btn btn-secondary' disabled='disabled'><i class='fa fa-search' aria-hidden='true'></i>预览</button>";
                    spanHtml = "<a has-permission='activity_online_offline' href ng-click=\"updateActivityStatus('" + scope.id + "','" + scope.activeStatus + "')\">发布</a>";
                }
                else {
                    preViewHtml = "<a has-permission='activity_preview' class='btn btn-secondary' href='" + scope.initialUrl + "' target='_blank'><i class='fa fa-search' aria-hidden='true'></i>预览</a>";
                    spanHtml = "<a has-permission='activity_online_offline' href ng-confirm=\"updateActivityStatus('" + scope.id + "','" + scope.activeStatus + "')\" ng-confirm-message='取消发布后，该活动页将被下线无法访问。'>取消发布</a>";
                }
                let editHtml = "<button has-permission='activity_edit' type='button' class='btn btn-secondary' ng-click=\"editActivity('" + scope.id + "','" + scope.activeName + "')\"><i class='fa fa-edit' aria-hidden='true'></i>编辑</button>";

                /**
                 * 编辑
                 * */
                scope.editActivity = function (id, name) {
                    $state.go("main.activityEdit", {activityId: id, activityName: name});
                };

                let moreHtml = "<div class='btn-group' has-permission='activity_more'>"
                    + "<button type='button' class='btn btn-secondary dropdown-toggle' data-toggle='dropdown'>"
                    + "<i class='icon-icon-more' aria-hidden='true'></i>更多</button>"
                    + "<ul class='dropdown-menu' role='menu'>"
                    + "<li>" + spanHtml + "</li>"
                    + "<li><a has-permission='activity_delete' href ng-confirm=\"deleteActivity('" + scope.id + "')\" ng-confirm-message='删除操作不可恢复，确认要删除该活动项吗？'>删除</a></li>"
                    + "</ul></div>";

                /**
                 * 发布 / 取消发布
                 * */
                scope.updateActivityStatus = function (id, activeStatus, activeStatusName) {
                    let postData = {
                        "id": id,
                        "activeStatus": activeStatus
                    };
                    ActivityService.onOrOffLine(postData)
                        .then((data)=> {
                            scope.$parent.$parent.getActivityList(null, null, true);
                        });
                };

                /**
                 * 删除
                 * */
                scope.deleteActivity = function (id) {
                    ActivityService.deleteActivity(id)
                        .then((data)=> {
                            scope.$parent.$parent.getActivityList(null, null, true);
                        });
                };
                scope.html = preViewHtml + editHtml + moreHtml;
                element.append($compile(scope.html)(scope));
            }
        }
    }])

    .directive('setFocus', function(){
        return function(scope, element){
            element[0].focus();
        };
    });