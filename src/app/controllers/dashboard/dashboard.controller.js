DashboardController.$inject = ['$rootScope', '$scope', 'DashboardService'];

function DashboardController($rootScope, $scope, DashboardService) {
    $scope.jumpUrl = "main.dashboard.tab1.all";
}


angular.module('controller').controller("DashboardController", DashboardController);