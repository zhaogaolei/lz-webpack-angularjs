angular.module('services')
    .factory('HttpInterceptor', ["$q", "$rootScope", "$window", "permissions", function ($q, $rootScope, $window, permissions) {
        var httpInterceptor = {
            request: function (config) {
                config.headers = config.headers || {};
                if ($window.localStorage.currentUser) {
                    let currentUser = angular.fromJson($window.localStorage.currentUser);
                    config.headers.userCode = encodeURI(currentUser.userName);
                    config.headers.userName = encodeURI(currentUser.userName);
                    config.headers.email = currentUser.userName;
                    /*追加鉴权参数*/
                    config.headers.token = currentUser.accessToken;
                    // config.headers.randomNum = $rootScope.currentuser_randomNum;
                }
                if(IsDebug){
                    config.headers.userCode = "";
                    config.headers.userName = "";
                    config.headers.email = "";
                    /*追加鉴权参数*/
                    config.headers.token = "";
                }
                return config;
            },
            response: function (response) {
                let data = response.data;
                // 判断错误码，失效(10002)或异常(10001)
                if (data.code == "10002" || data.code == "10001") {
                    // 清空用户本地存储的信息
                    permissions.deletePermissions();
                    // 全局事件，方便其他view获取该事件，并给以相应的提示或处理
                    $rootScope.$emit("UserDeniedPermission", response);
                }
                return response;
            },
            requestError: function (rejection) {
                // $rootScope.isShowLoading = false;
                return rejection;
            },
            responseError: function (rejection) {
                // $rootScope.isShowLoading = false;
                return rejection;
            }
        };
        return httpInterceptor;
    }])

    .factory('UpLoadService', ['$q', 'UtilsService', 'Upload', function ($q, UtilsService, Upload) {
        return {
            UpLoadFile: function (url, postData) {
                let deferred = $q.defer();
                Upload.upload({
                    headers: {
                        'apiKey': "opc"
                    },
                    url: UtilsService.getIp() + url,
                    data: postData
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            }
        };
    }])

    .factory('permissions', ['$rootScope', '$window', function ($rootScope, $window) {
        return {
            setPermissions: function (permissions) {
                if (permissions) {
                    $window.localStorage.currentUser = angular.toJson(permissions);
                    $rootScope.currentUser = permissions;
                    // $rootScope.currentuser_name = permissions.userName;
                    // $rootScope.currentuser_email = permissions.userName;
                    // $rootScope.currentuser_taken = permissions.accessToken;
                    // $rootScope.currentuser_randomNum = permissions.randomNum;
                    $rootScope.$broadcast('permissionsChanged')
                }
            },
            deletePermissions: function () {
                delete $window.localStorage.currentUser;
            },
            hasPermission: function (currentUser, permission) {
                let isShowDom = false;
                permission = permission.trim();
                if (currentUser) {
                    angular.forEach(currentUser.menuList, function (data, index, array) {
                        //angular.forEach(data, function (pri, index, array) {
                        if (data === permission) {
                            isShowDom = true;
                        }
                        //});
                    });
                }
                return isShowDom;
            }
        };
    }])

    .factory('LoadingService', ["$rootScope", function ($rootScope) {
        return {
            showLoading: () => {
                $rootScope.isShowLoading = true;
            },
            hideLoading: () => {
                $rootScope.isShowLoading = false;
            }
        }
    }]);