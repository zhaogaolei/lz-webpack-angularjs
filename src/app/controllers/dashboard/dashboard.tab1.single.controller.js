/**
 * Created by chengshuailiu on 17/4/10.
 */
DashboardController1Single.$inject = ['$scope', 'DashboardSingleService', '$filter', "$q", "toastr", "$state", "$stateParams"];
const yesterday = new Date().setDate(new Date().getDate() - 1);

function DashboardController1Single($scope, DashboardSingleService, $filter, $q, toastr, $state, $stateParams) {
    let dateFilter = $filter('date');
    $scope.config = {
        countup: {duration: 0.2}
    };
    $scope.btnName1 = "<i class='icon-icon-filter-outline'></i> 投放计划 ";
    $scope.btnName2 = "<i class='icon-icon-filter-outline'></i> 广告位 ";
    $scope.btnName3 = "<i class='icon-icon-filter-category'></i> 漏斗类型 ";
    $scope.btnName4 = "<i class='icon-icon-filter-outline'></i> 素材 ";
    $scope.btnName5 = "<i class='icon-icon-filter-outline'></i> 关键词 ";

    $scope.joinChat = "+";
    $scope.btnClass = "btn btnSelect dropdown-toggle";
    $scope.btnClass2 = "btn btnSelect";
    $scope.localLang = {
        selectAll: "全选",
        selectNone: "全不选",
        reset: "重置",
        search: "搜索...",
        nothingSelected: "请选择"
    };
    $scope.tempMaterial = [];
    $scope.viewModel = {
        //概览数据相关Model
        overview: {
            selectDay: 1,
            text: "相比前七天平均",
            loading: false
        },
        //概览数据
        overViewData: JSON.parse(localStorage.getItem("myData")) || [],
        channel: {},
        datatype: {},
        channeltype: [],
        chat1: {
            loading: false,
            datatype: [],
            datatypeSelect: [],
            deliverplan: [],
            deliverplanSelect: [],
            adPlace: [],
            adPlaceSelect: [],
            material: [],
            materialSelect: [],
            keywords: [],
            keywordsSelect: [],
            startDate: new Date().setDate((new Date()).getDate() - 30),
            endDate: yesterday,
            materialDisable: true,
            keyWordDisable: true,
            seachBanners: () => {

                var leg = $scope.viewModel.chat1.deliverplanSelect.length;
                if (leg == 1) {
                    return getBannersByCampaignPlanId($scope.viewModel.chat1.deliverplanSelect, "chat1");
                } else {
                    $scope.viewModel.chat1.adPlaceSelect = [];
                    $scope.viewModel.chat1.materialSelect = [];
                    $scope.viewModel.chat1.keywordsSelect = [];
                    $scope.viewModel.chat1.adPlace = [];
                    $scope.viewModel.chat1.material = [];
                    $scope.viewModel.chat1.keywords = [];
                    $scope.chat1Seach();
                }


            },
            seachMaterail: () => {
                var leg = $scope.viewModel.chat1.adPlaceSelect.length;
                if (leg == 1) {
                    return getMaterialAndKey($scope.viewModel.chat1.adPlaceSelect, "chat1");
                } else {
                    $scope.viewModel.chat1.material = [];
                    $scope.viewModel.chat1.keywords = [];
                    $scope.viewModel.chat1.materialSelect = [];
                    $scope.viewModel.chat1.keywordsSelect = [];
                    $scope.chat1Seach();
                }
            },
            seachKeyWord: () => {
                $scope.tempMaterial = $scope.viewModel.chat1.materialSelect;
                var leg = $scope.viewModel.chat1.materialSelect.length;
                if (leg == 1 || leg == 0) {
                    $scope.viewModel.chat1.keyWordDisable = false;
                } else {
                    $scope.viewModel.chat1.keyWordDisable = true;
                }
                $scope.chat1Seach();
            },
            selectKeyWord: () => {
                var leg = $scope.viewModel.chat1.keywordsSelect.length;
                if (leg > 0) {
                    $scope.viewModel.chat1.materialDisable = true;
                    $scope.viewModel.chat1.materialSelect = [];
                } else {
                    $scope.viewModel.chat1.materialDisable = false;
                    $scope.viewModel.chat1.materialSelect = $scope.tempMaterial;
                }
                $scope.chat1Seach();
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            maxTicksLimit: 0,
                        }
                    }]
                }
            }
        },
        chat2: {
            dataShow:true,
            loading: false,
            datatype: [],
            datatypeSelect: [],
            deliverplan: [],
            deliverplanSelect: [],
            adPlace: [],
            adPlaceSelect: [],
            material: [],
            materialSelect: [],
            keywords: [],
            keywordsSelect: [],
            startDate: new Date().setDate((new Date()).getDate() - 30),
            endDate: yesterday,
            materialDisable: true,
            keyWordDisable: true,
            seachBanners: () => {
                var leg = $scope.viewModel.chat2.deliverplanSelect.length;
                if (leg == 1) {
                    return getBannersByCampaignPlanId($scope.viewModel.chat2.deliverplanSelect, "chat2");
                } else {
                    $scope.viewModel.chat2.adPlaceSelect = [];
                    $scope.viewModel.chat2.materialSelect = [];
                    $scope.viewModel.chat2.keywordsSelect = [];
                    $scope.viewModel.chat2.adPlace = [];
                    $scope.viewModel.chat2.material = [];
                    $scope.viewModel.chat2.keywords = [];
                    $scope.chat2Seach();
                }
            },
            seachMaterail: () => {
                var leg = $scope.viewModel.chat2.adPlaceSelect.length;
                if (leg == 1) {
                    return getMaterialAndKey($scope.viewModel.chat2.adPlaceSelect, "chat2");
                } else {
                    $scope.viewModel.chat2.material = [];
                    $scope.viewModel.chat2.keywords = [];
                    $scope.viewModel.chat2.materialSelect = [];
                    $scope.viewModel.chat2.keywordsSelect = [];
                    $scope.chat2Seach();
                }

            },
            seachKeyWord: () => {
                $scope.tempMaterial = $scope.viewModel.chat2.materialSelect;
                var leg = $scope.viewModel.chat2.materialSelect.length;
                if (leg == 1 || leg == 0) {
                    $scope.viewModel.chat2.keyWordDisable = false;
                } else {
                    $scope.viewModel.chat2.keyWordDisable = true;
                }
                $scope.chat2Seach();
            },
            selectKeyWord: () => {
                var leg = $scope.viewModel.chat2.keywordsSelect.length;
                if (leg > 0) {
                    $scope.viewModel.chat2.materialDisable = true;
                    $scope.viewModel.chat2.materialSelect = [];
                } else {
                    $scope.viewModel.chat2.materialDisable = false;
                    $scope.viewModel.chat2.materialSelect = $scope.tempMaterial;
                }
                $scope.chat2Seach();
            },
        },
        chat3: {
            loading: false,
            deliverplan: [],
            deliverplanSelect: [],
            adPlace: [],
            adPlaceSelect: [],
            material: [],
            materialSelect: [],
            keywords: [],
            keywordsSelect: [],
            funnelTypeInit: [
                {dataCode: "funnel_type_a", dataName: "常用转换漏斗A", selected: true},
                {dataCode: "funnel_type_b", dataName: "常用转换漏斗B", selected: false},
                {dataCode: "funnel_type_c", dataName: "常用转换漏斗C", selected: false},
                {dataCode: "", dataName: "自定义转化漏斗", selected: false}
            ],
            datatype: [],
            datatypeSelect: ["funnel_type_a"],
            channeltype: [],
            channeltypeSelect: [],
            endDate: yesterday,
            startDate: new Date().setDate((new Date()).getDate() - 30),
            materialDisable: true,
            keyWordDisable: true,
            seachBanners: () => {
                var leg = $scope.viewModel.chat3.deliverplanSelect.length;
                if (leg == 1) {
                    return getBannersByCampaignPlanId($scope.viewModel.chat3.deliverplanSelect, "chat3");
                } else {
                    $scope.viewModel.chat3.adPlaceSelect = [];
                    $scope.viewModel.chat3.materialSelect = [];
                    $scope.viewModel.chat3.keywordsSelect = [];
                    $scope.viewModel.chat3.adPlace = [];
                    $scope.viewModel.chat3.material = [];
                    $scope.viewModel.chat3.keywords = [];
                    $scope.chat3Seach();
                }
            },
            seachMaterail: () => {
                var leg = $scope.viewModel.chat3.adPlaceSelect.length;
                if (leg == 1) {
                    return getMaterialAndKey($scope.viewModel.chat3.adPlaceSelect, "chat3");
                } else {
                    $scope.viewModel.chat3.material = [];
                    $scope.viewModel.chat3.keywords = [];
                    $scope.viewModel.chat3.materialSelect = [];
                    $scope.viewModel.chat3.keywordsSelect = [];
                    $scope.chat3Seach();
                }

            },
            seachKeyWord: () => {
                $scope.tempMaterial = $scope.viewModel.chat3.materialSelect;
                var leg = $scope.viewModel.chat3.materialSelect.length;
                if (leg == 1 || leg == 0) {
                    $scope.viewModel.chat3.keyWordDisable = false;
                } else {
                    $scope.viewModel.chat3.keyWordDisable = true;
                }
                $scope.chat3Seach();
            },
            selectKeyWord: () => {
                var leg = $scope.viewModel.chat3.keywordsSelect.length;
                if (leg > 0) {
                    $scope.viewModel.chat3.materialDisable = true;
                    $scope.viewModel.chat3.materialSelect = [];
                } else {
                    $scope.viewModel.chat3.materialDisable = false;
                    $scope.viewModel.chat3.materialSelect = $scope.tempMaterial;
                }
                $scope.chat3Seach();
            },
        }
    };

    $scope.bizType = "";
    $scope.appType = "";
    $scope.borrowFlag = false;

    $scope.getNowViewDataText = function (data) {
        var nowDate = new Date();
        let yesterday = nowDate.setDate(nowDate.getDate() - 1);
        if ($scope.viewModel.overview.selectDay == 1) {
            return dateFilter(yesterday, "yyyy/MM/dd");
        }
        else {
            var lastDate = new Date().setDate(new Date().getDate() - $scope.viewModel.overview.selectDay);
            return dateFilter(lastDate, "yyyy/MM/dd") + "-" + dateFilter(yesterday, "yyyy/MM/dd");
        }
    };


    $scope.changeSelectDay = function (day) {
        $scope.viewModel.overview.selectDay = day;
        if (day == 1) {
            $scope.viewModel.overview.text = "相比前7天平均";
        }
        if (day == 7) {
            $scope.viewModel.overview.text = "相比前7天";
        }
        if (day == 30) {
            $scope.viewModel.overview.text = "相比前30天";
        }
        asyncGetViewData();
    };

    /*
     * 概要数据获取
     * */
    let asyncGetViewData = function () {
        let channelId = $stateParams.channel_id;
        $scope.viewModel.overview.loading = true;
        return DashboardSingleService.getOverViewData($scope.viewModel.overview.selectDay, $scope.bizType, $scope.appType, channelId).then((data) => {
            $scope.viewModel.overViewData = data;
            localStorage.setItem("myData", JSON.stringify(data));
            $scope.viewModel.overview.loading = false;
            $scope.$parent.selectLoading = false;
        });
    };
    //borrow和lender下, 渠道对比/渠道趋势 ChatType默认设置"新注册"
    let initChatType = function (inputArr, data_type) {
        var result = [];
        angular.forEach(inputArr, (item) => {
            item.selected = false;
            if (item.dataCode == data_type) {
                item.selected = true;
                result.push(item);
            }
        });
        return result;
    }
    //获取ChatType
    let getChatType = function () {
        let result = [];
        if ($scope.borrowFlag == true) {
            //渠道对比
            result.push(DashboardSingleService.getChatTypeDataBorrow().then((data) => {
                $scope.viewModel.chat1.datatype = angular.copy(data);
                $scope.viewModel.chat1.datatypeSelect = initChatType($scope.viewModel.chat1.datatype, "data_type_borrow_102");
            }));

            //渠道趋势
            result.push(DashboardSingleService.getChatTypeDataBorrow().then((data) => {
                $scope.viewModel.chat2.datatype = angular.copy(data);
                $scope.viewModel.chat2.datatypeSelect = initChatType($scope.viewModel.chat2.datatype, "data_type_borrow_102");
            }));
        } else {
            //渠道对比
            result.push(DashboardSingleService.getChatTypeData("refferal_compare").then((data) => {
                $scope.viewModel.chat1.datatype = angular.copy( removeActive(data,"data_type_116"));
                $scope.viewModel.chat1.datatypeSelect = initChatType($scope.viewModel.chat1.datatype, "data_type_100");
            }));

            //渠道趋势
            result.push(DashboardSingleService.getChatTypeData("refferal_trend").then((data) => {
                $scope.viewModel.chat2.datatype = angular.copy(removeActive(data,"data_type_116"));
                $scope.viewModel.chat2.datatypeSelect = initChatType($scope.viewModel.chat2.datatype, "data_type_100");
            }));
        }

        //渠道转化率
        result.push(DashboardSingleService.getFunnelTypeData($scope.bizType).then((data) => {
            $scope.viewModel.chat3.datatype = angular.copy(removeActive(data,"activate"));
            if ($scope.borrowFlag == true) {
                $scope.viewModel.chat3.funnelTypeInit = [
                    {dataCode: "", dataName: "自定义转化漏斗", selected: true}
                ];
                let funnelTypes = [];
                angular.forEach($scope.viewModel.chat3.datatype, (data) => {
                    data.selected = true;
                    funnelTypes.push(data.dataCode);

                });
                $scope.viewModel.chat3.datatypeSelect = funnelTypes;
                $scope.chat3Seach();
            } else {
                $scope.viewModel.chat3.funnelTypeInit = [
                    {dataCode: "funnel_type_a", dataName: "常用转换漏斗A", selected: true},
                    {dataCode: "funnel_type_b", dataName: "常用转换漏斗B", selected: false},
                    {dataCode: "funnel_type_c", dataName: "常用转换漏斗C", selected: false},
                    {dataCode: "", dataName: "自定义转化漏斗", selected: false}
                ];
                $scope.showMultipleFunnelType = false;
                $scope.funnelTypeClick($scope.viewModel.chat3.funnelTypeInit[0], 'single');
            }
        }));

        return $q.all(result);
    };

    //过滤掉某一类下拉框
    let removeActive = function (inputArr, data_type) {
        var result = [];
        angular.forEach(inputArr, (item) => {
        if (item.dataCode != data_type) {
            result.push(item);
             }
        });
        return result;
    }

    //投放计划下拉框查询
    let getCampaignPlan = function () {
        let p = {
            "channelId": $scope.channel_id,
            "bizType": $scope.bizType
        };
        return DashboardSingleService.getCampaignPlan(p).then((data) => {
            var result = [];
            angular.forEach(data, (item) => {
                //正在进行中的投放计划
                if (item.defaultFlag == "Y") {
                    item.selected = true;
                    result.push(item);
                }
            });
            $scope.viewModel.chat1.deliverplan = angular.copy(data);
            $scope.viewModel.chat2.deliverplan = angular.copy(data);
            $scope.viewModel.chat3.deliverplan = angular.copy(data);
            $scope.viewModel.chat1.deliverplanSelect = angular.copy(result);
            $scope.viewModel.chat2.deliverplanSelect = angular.copy(result);
            $scope.viewModel.chat3.deliverplanSelect = angular.copy(result);
            if (data.length == 0) {
                toastr.warning("该渠道下面没有投放计划!", "Warning");
                $scope.viewModel.chat2.dataShow=false;
            } else {
                if (result.length == 0) {
                    toastr.warning("该渠道下面没有正在进行中的投放计划!", "Warning");
                    $scope.viewModel.chat2.dataShow=false;
                }
                else if (result.length == 1) {
                    getBannersByCampaignPlanId($scope.viewModel.chat1.deliverplanSelect, "chat1");
                    getBannersByCampaignPlanId($scope.viewModel.chat2.deliverplanSelect, "chat2");
                    getBannersByCampaignPlanId($scope.viewModel.chat3.deliverplanSelect, "chat3");
                } else {
                    $scope.chat1Seach();
                    $scope.chat2Seach();
                    $scope.chat3Seach();
                }
            }

        });
    };
    //通过投放计划id获取广告位
    let getBannersByCampaignPlanId = function (inputScope, outPut) {
        let typeData = {
            "id": getPropList(inputScope, "id")[0], //获取投放计划id
            "channelId": $scope.channel_id
        };
        return DashboardSingleService.getBannersPlace(typeData).then((data) => {
            var result = [];
            angular.forEach(data, (item) => {
                item.selected = true;
                result.push(item);
            });
            $scope.viewModel[outPut].adPlace = angular.copy(data);
            $scope.viewModel[outPut].adPlaceSelect = result;
            if (data.length == 0) {
                $scope[outPut + "Seach"]();
                toastr.warning("该投放计划下面没有广告位!", "Warning");
            }
            else if (data.length == 1) {
                getMaterialAndKey($scope.viewModel[outPut].adPlaceSelect, outPut);
            } else {
                $scope[outPut + "Seach"]();
            }


        });
    };


    //获取素材和关键字
    let getMaterialAndKey = function (inputScope, outPut) {
        let diliverPlanid = $scope.viewModel[outPut].deliverplanSelect;
        let postData = {
            "utmBanner": getPropList(inputScope, "id")[0],
            "channelId": $scope.channel_id,//渠道id
            "campaignPlanId": getPropList(diliverPlanid, "id")[0]
        };
        return DashboardSingleService.getMaterialAndKey(postData).then((data) => {
            var materialResult = [];
            var keyWorkResult = [];
            angular.forEach(data, (item) => {
                if (item.utmKeyword != null && item.utmKeyword != "") {
                    item.utmKeyword = item.utmPublish + "," + item.utmKeyword;
                    keyWorkResult.push(angular.copy(item));
                }
                item.utmContent = item.utmPublish + "," + item.utmContent;
                materialResult.push(angular.copy(item));

            });
            angular.forEach(materialResult, (itema) => {
                itema.selected = true;
            });
            $scope.viewModel[outPut].material = angular.copy(materialResult);
            $scope.viewModel[outPut].materialSelect = materialResult;
            $scope.viewModel[outPut].materialDisable = false;

            if (materialResult.length == 0) {
                $scope.viewModel[outPut].keywordDisable = false
                toastr.warning("该广告位下面没有素材!", "Warning");
            } else if (materialResult.length == 1) {
                $scope.viewModel[outPut].keywordDisable = false;
            } else {
                $scope.viewModel[outPut].keywordDisable = true;
            }
            if (keyWorkResult.length == 0) {
                toastr.warning("该广告位下面没有关键字!", "Warning");
            } else {
                $scope.viewModel[outPut].keywords = angular.copy(keyWorkResult);
                $scope.viewModel[outPut].keywordsSelect = [];
            }
            $scope[outPut + "Seach"]();


        });

    }
    //获取关键词
    /*  let getKeyWord = function (inputScope, outPut) {
          let diliverPlanid=$scope.viewModel[outPut].deliverplanSelect;
          let postData = {
              "utmBanner": getPropList(inputScope, "id")[0],
              "channelId": $scope.channel_id,//渠道id
              "campaignPlanId":getPropList(diliverPlanid,"id")[0]
          };
          return DashboardSingleService.getMaterialAndKey(postData).then((data) => {
              console.log(data);
              var result = [];
              angular.forEach(data, (item) => {
                  if (item.utmKeyword != null && item.utmKeyword != "")
                      result.push(item);
              });
              if (result.length == 0) {
                  toastr.warning("该广告位下面没有关键词!", "Warning");
              }
              $scope.viewModel[outPut].keywords = angular.copy(result);
              $scope[outPut + "Seach"]();
          });
      }
  */
    //私有方法
    let getPropList = function (arr, prop) {
        let result1 = [];
        angular.forEach(arr, (item) => {
            result1.push(item[prop]);
        });
        return result1;
    };

    //$scope.firstInit=false;
    $scope.chat1Seach = function () {
        $scope.viewModel.chat1.loading = true;
        let dataTypes = getPropList($scope.viewModel.chat1.datatypeSelect, "dataCode").length > 0 ? getPropList($scope.viewModel.chat1.datatypeSelect, "dataCode") : ["data_type_100"];
        //let dataTypes = getPropList($scope.viewModel.chat1.datatypeSelect, "dataCode");
        let channelIds = getPropList($scope.$parent.viewModel.channelSelected, "id");
        let campaignPlanIds = getPropList($scope.viewModel.chat1.deliverplanSelect, "id");
        let bannerIds = getPropList($scope.viewModel.chat1.adPlaceSelect, "id");
        let materiaIds = getPropList($scope.viewModel.chat1.materialSelect, "utmContent");//utmPublish
        let keywords = getPropList($scope.viewModel.chat1.keywordsSelect, "utmKeyword");
        let p = {
            "dataType": dataTypes,
            "startDate": dateFilter($scope.viewModel.chat1.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.chat1.endDate, 'yyyy-MM-dd'),
            "appType": $scope.appType,
            "businessType": $scope.bizType,
            "channelIds": channelIds,
            "campaignPlanIds": campaignPlanIds,
            "bannerIds": bannerIds,
            "materialIds": materiaIds,
            "keywords": keywords
        };
        return DashboardSingleService.getChat1(p).then((chatData) => {
            $scope.chat1 = chatData;
            $scope.chat1Options = {
                scales: {
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            //labelString: '人数(天)'
                        },
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
            $scope.viewModel.chat1.loading = false;
        });
    }

    $scope.chat2Seach = function () {
        $scope.viewModel.chat2.loading = true;
        let dataTypes = getPropList($scope.viewModel.chat2.datatypeSelect, "dataCode").length > 0 ? getPropList($scope.viewModel.chat2.datatypeSelect, "dataCode") : ["data_type_100"];
        let channelIds = getPropList($scope.$parent.viewModel.channelSelected, "id");
        //let dataTypes = getPropList($scope.viewModel.chat2.datatypeSelect, "dataCode");
        let campaignPlanIds = getPropList($scope.viewModel.chat2.deliverplanSelect, "id");
        let bannerIds = getPropList($scope.viewModel.chat2.adPlaceSelect, "id");
        let materiaIds = getPropList($scope.viewModel.chat2.materialSelect, "utmContent");
        let keywords = getPropList($scope.viewModel.chat2.keywordsSelect, "utmKeyword");
        let p = {
            "businessType": $scope.bizType,
            "appType": $scope.appType,
            "channelIds": channelIds,
            "dataType": dataTypes,
            "startDate": dateFilter($scope.viewModel.chat2.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.chat2.endDate, 'yyyy-MM-dd'),
            "campaignPlanIds": campaignPlanIds,
            "bannerIds": bannerIds,
            "materialIds": materiaIds,
            "keywords": keywords
        };
        return DashboardSingleService.getChat2(p).then((chatData) => {
            $scope.chat2 = chatData;
            $scope.chat2DatasetOverride = [];
            if(chatData.series.length==0&& chatData.data.length==0){
                $scope.viewModel.chat2.dataShow=false;
            }else{
                $scope.viewModel.chat2.dataShow=true;
            };
            angular.forEach(chatData.series, (item) => {
                $scope.chat2DatasetOverride.push({
                    fill: false,
                    lineTension: 0,
                });
            });
            $scope.chat2Options = {
                legend: {display: true},
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }
            };
            $scope.viewModel.chat2.loading = false
        });
    };

    $scope.showMultipleFunnelType = false;
    $scope.funnelTypeClick = function (selectData, selectType) {
        let funnelTypes = [];
        if (selectType == "single") {
            angular.forEach($scope.viewModel.chat3.funnelTypeInit, (item) => {
                if (item.dataCode == selectData.dataCode) {
                    selectData.selected = true;
                } else {
                    item.selected = false;
                }
            });
            if (selectData.dataCode == "") {
                $scope.showMultipleFunnelType = true;
                angular.forEach($scope.viewModel.chat3.datatype, (data) => {
                    data.selected = true;
                    funnelTypes.push(data.dataCode);
                });
            }
            else {
                $scope.showMultipleFunnelType = false;
                funnelTypes.push(selectData.dataCode);
            }
        }
        if (selectType == "multiple") {
            if (selectData.dataCode == "regist_num") {
                selectData.selected = true;
            } else {
                if (selectData.selected) {
                    selectData.selected = false;
                }
                else {
                    selectData.selected = true;
                }
            }
            angular.forEach($scope.viewModel.chat3.datatype, (data) => {
                if (data.selected) {
                    funnelTypes.push(data.dataCode);
                }
            });
        }

        $scope.viewModel.chat3.datatypeSelect = funnelTypes;
        $scope.chat3Seach();
    };
    $scope.chat3Seach = function () {
        $scope.viewModel.chat3.loading = true;
        let channelIds = getPropList($scope.$parent.viewModel.channelSelected, "id");
        let campaignPlanIds = getPropList($scope.viewModel.chat3.deliverplanSelect, "id");
        let bannerIds = getPropList($scope.viewModel.chat3.adPlaceSelect, "id");
        let materiaIds = getPropList($scope.viewModel.chat3.materialSelect, "utmContent");
        let keywords = getPropList($scope.viewModel.chat3.keywordsSelect, "utmKeyword");
        let p = {
            "funnelTypes": $scope.viewModel.chat3.datatypeSelect,
            "startDate": dateFilter($scope.viewModel.chat3.startDate, 'yyyy-MM-dd'),
            "endDate": dateFilter($scope.viewModel.chat3.endDate, 'yyyy-MM-dd'),
            "refferalTypes": [],
            "refferalIds": [],
            "businessType": $scope.bizType,
            "appType": $scope.appType,
            "channelIds": channelIds,
            "campaignPlanIds": campaignPlanIds,
            "bannerIds": bannerIds,
            "materialIds": materiaIds,
            "keywords": keywords
        };
        return DashboardSingleService.getChat3(p).then((data) => {
            try {
                let funnelData = [];
                let value = 30 * data.refferalConvertRatio.length;
                angular.forEach(data.refferalConvertRatio, (data) => {
                    angular.forEach(data, (obj, title) => {
                        /**
                         * 转化率定义：据视觉稿图为例 顶部那个漏斗是没有转化率值的，
                         * 第二个漏斗的转化率值=注册用户数／访客数；
                         * 第三个漏斗转化率值=绑卡用户／注册用户，以此类推。
                         * 用户注册数(10000人)，转化率100%
                         * */
                        let tpl = '{0}({1})';
                        let tplWithRatio = '\n转化率{2}\n{0}({1})';
                        let name = "";
                        if (typeof(obj.convertRatio) == "undefined") {
                            name = tpl.replace("{0}", title).replace("{1}", obj.count);
                        }
                        else {
                            name = tplWithRatio.replace("{0}", title).replace("{1}", obj.count).replace("{2}", obj.convertRatio);
                        }
                        let arr = {
                            value: value,//obj.count,
                            name: name
                        };
                        funnelData.push(arr);
                        value = value - 30;
                    });
                });
                let option = {
                    series: [
                        {
                            name: '漏斗图',
                            type: 'funnel',
                            x: '10%',
                            width: '65%',
                            minSize: '0%',
                            maxSize: '100%',
                            sort: 'descending',
                            data: funnelData
                        }
                    ]
                };
                $scope.chat3Option = option;
                $scope.viewModel.chat3.loading = false;
            }
            catch (error) {

            }

        });
    };

    /**
     * 获取留存日报
     */
    let getOverReport = () => {
        let postData = {channelId: $scope.channel_id};
        DashboardSingleService.getOverReport(postData)
            .then((data) => {
                if (data && data.code == 200) {
                    $scope.countList = data.result.countList;
                    $scope.sumMoneyList = data.result.sumMoneyList;
                    $scope.holdMoneyList = data.result.holdMoneyList;
                }
            });
    };

    /**
     * 导出留存日报
     */
    $scope.exportOverReport = () => {
        DashboardSingleService.exportOverReport($scope.channel_id)
            .then(function (result) {
                let linkElement = document.createElement('a');
                try {
                    //application/vnd.ms-excel
                    var fileName = "渠道留存日报.xlsx";
                    var blob = new Blob([result.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                    if (window.navigator.msSaveOrOpenBlob) {
                        // for ie only
                        window.navigator.msSaveOrOpenBlob(blob, fileName);
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        linkElement.setAttribute('href', url);
                        linkElement.setAttribute("download", fileName);
                        var clickEvent = new MouseEvent("click", {
                            "view": window,
                            "bubbles": true,
                            "cancelable": false
                        });
                        linkElement.dispatchEvent(clickEvent);
                    }
                } catch (ex) {
                    console.log(ex);
                }
            });
    };

    $scope.initPage = function () {
        $scope.firstInit = true;
        $scope.bizType = $stateParams.bizType;
        $scope.appType = $stateParams.appType;
        $scope.channel_id = $stateParams.channel_id;
        if ($scope.bizType != 'dashboard_lender') {
            $scope.borrowFlag = true;
            $scope.showMultipleFunnelType = true;
        } else {
            $scope.borrowFlag = false;
            $scope.showMultipleFunnelType = false;
        }
        $scope.viewModel.overview.selectDay = 1;
        $scope.viewModel.chat1.startDate = new Date().setDate((new Date()).getDate() - 30);
        $scope.viewModel.chat1.endDate = yesterday;
        $scope.viewModel.chat2.startDate = new Date().setDate((new Date()).getDate() - 30);
        $scope.viewModel.chat2.endDate = yesterday;
        $scope.viewModel.chat3.startDate = new Date().setDate((new Date()).getDate() - 30);
        $scope.viewModel.chat3.endDate = yesterday;
        getOverReport();
        $q.when([
            getChatType(),
        ]).then(function () {
            return $q.all([
                getCampaignPlan(),
                asyncGetViewData()
            ])
        })


    }
}


angular.module('controller').controller("DashboardController1Single", DashboardController1Single);
export default DashboardController1Single;