export default function config($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(false).hashPrefix('');
    //$httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // $urlRouterProvider.otherwise("/");
    /**注册拦截*/
    $httpProvider.interceptors.push('HttpInterceptor');

    let loginState = {
        name: 'login',
        url: '/login',
        template: require("../../login.html"),
        controller: 'LoginController'
    };

    let mainState = {
        name: 'main',
        url: '/main',
        template: require("../../main.html"),
        controller: 'HomeController'
    };

    let unauthorizedState = {
        name: 'unauthorized',
        url: '/unauthorized',
        template: require("../views/unauthorized.html")
    };
    //登录
    $stateProvider.state("login", loginState);
    $stateProvider.state("main", mainState);
    //无权限
    $stateProvider.state("main.unauthorized", unauthorizedState);

    //默认登录页
    $urlRouterProvider.otherwise("/login");


}
config.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider'];

