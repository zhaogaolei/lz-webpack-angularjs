/**
 * Created by chengshuailiu on 17/4/10.
 */
DashboardController1.$inject = ['$scope', 'DashboardService', "$q", "$state"];
function DashboardController1($scope, DashboardService, $q, $state) {
    $scope.config = {
        countup: {duration: 0.2}
    };
    $scope.btnName1 = "<i class='icon-icon-filter-outline'></i> 选择渠道 ";
    $scope.joinChat = "+";
    $scope.btnClass = "btn btnSelect";
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "选择渠道"
    };

    $scope.viewModel = {
        channel: [],
        channelSelected: [],
        channelShow: true
    };

    $scope.selectedItem = {};
    $scope.borrowSelect = [];
    $scope.bizType = "";
    $scope.appType = "";

    /**
     * 获取选择渠道下拉框数据
     */
    let getAllChannel2 = function () {
        let p = {
            "dataType": [],
            "businessType": $scope.bizType,
            "appType": $scope.appType,
        };
        DashboardService.getChannelByType(p).then((data)=> {
            //$scope.viewModel.channel = angular.copy(data);
            var result = [];
            angular.forEach(data, (item)=> {
                if (item.id != "Null") {
                    result.push(item);
                }
            });
             $scope.viewModel.channel = angular.copy(result);
        });
    };

    $scope.initPage = function () {
        $scope.$watch('viewModel.channelSelected', function(newValue, oldValue) {
            if (newValue.length ==1) {
                $scope.$parent.jumpUrl = 'main.dashboard.tab1.single';
            }else{
                $scope.$parent.jumpUrl = 'main.dashboard.tab1.all';
            }
        });

        initSelect().then(()=> {
            getAllChannel2();
        });
    };
    /**
     * 初始化lender,borrow下拉框
     */
    let initSelect = function () {
        return DashboardService.getBussinessData("dashBoardInlet").then((data)=> {
            $scope.borrowSelect = angular.copy(data);
            $scope.selectedItem = $scope.borrowSelect[0].dataCode + "," + $scope.borrowSelect[0].dataDicSon[0].dataCode;
            $scope.selectChange();
        });
    };

    $scope.selectLoading = false;
    $scope.selectChange = function () {
        $scope.selectLoading = true;
        var selectedItems = $scope.selectedItem.split(",");
        $scope.bizType = selectedItems[0];
        $scope.appType = selectedItems[1];
        if($scope.bizType != 'dashboard_lender'){
            $scope.viewModel.channelShow = false;
        }else{
            $scope.viewModel.channelShow = true;
            getAllChannel2();
        }

        changeRoute();


    };


    $scope.channelChange = function () {
        changeRoute();
    };

    let changeRoute =  function () {
        var leg = $scope.viewModel.channelSelected.length;
        if(leg == 1){
            let id = $scope.viewModel.channelSelected[0].id;
            $state.go('main.dashboard.tab1.single', {bizType:$scope.bizType, appType:$scope.appType, channel_id:id});
        }else if (leg == 0) {
            $state.go('main.dashboard.tab1.all',{bizType:$scope.bizType, appType:$scope.appType});
        }
        else {
            $state.go('main.dashboard.tab1.all',{bizType:$scope.bizType, appType:$scope.appType});
        }
    }

}


angular.module('controller').controller("DashboardController1", DashboardController1);
export default DashboardController1;