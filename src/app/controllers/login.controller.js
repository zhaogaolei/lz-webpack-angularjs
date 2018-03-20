LoginController.$inject = ['$scope', '$window', '$location', 'toastr', 'LoginService', 'permissions'];

function LoginController($scope, $window, $location, toastr, LoginService, permissions) {
    /*开发时，跳过登录*/
    if (IsDebug) {
        $location.path("/main/dashboard/tab1/all//").replace();
        return;
    }

    /*如果用户已经登录了，则立即跳转到一个默认主页上去，无需再登录*/
    if ($window.localStorage.currentUser) {
        $location.path("/main/dashboard/tab1/all//").replace();
        return;
    }

    $scope.viewModel = {
        userName: "",
        password: ""
    };
    $scope.loginEnter = (e) => {
        let keyCode = window.event ? e.keyCode : e.which;//获取按键编码
        if (keyCode == 13) {
            $scope.login();
        }
    };
    $scope.login = () => {
        if ($scope.viewModel.userName == "") {
            toastr.warning("账户不能为空！");
            return;
        }
        if ($scope.viewModel.password == "") {
            toastr.warning("密码不能为空！");
            return;
        }
        LoginService.login($scope.viewModel)
            .then(data => {
                if (data && data.code == 200) {
                    /*保存用户信息*/
                    permissions.setPermissions(data.result);
                    $location.path("/main/dashboard/tab1/all//").replace();
                }
            });
    };
}

angular.module('controller').controller("LoginController", LoginController);