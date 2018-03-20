DashboardBiController.$inject = ['$scope', 'DashboardService','$sce','$rootScope'];

function DashboardBiController($scope, DashboardService,$sce,$rootScope) {
        var username=$rootScope.currentuser_name;
		$scope.myURL = $sce.trustAsResourceUrl(BIPOINTURL+username+"/view#49");
    	$scope.myURL4= $sce.trustAsResourceUrl(POINTURL+username+"/view#53");
    	$scope.myURL5=$sce.trustAsResourceUrl(POINTURL2+username+"/view#54");
    	$scope.myURL6=$sce.trustAsResourceUrl(POINTURL3+username+"/view");

}


angular.module('controller').controller("DashboardBiController", DashboardBiController);