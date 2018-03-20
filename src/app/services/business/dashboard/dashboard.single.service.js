/**
 * Created by chengshuailiu on 17/4/9.
 */
import {BaseApiMethod, BaseService} from '../business.service';


//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autotipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';


class ApiMethod extends BaseApiMethod {

    //渠道对比数据 查询渠道类型数据
    // getOverViewData(day,bizType,appType) {
    //     return this.get("GET_DASHBOARD_OVERVIEW", "/" + day +"?businessType=" + bizType + "&appType=" + appType, null, {});
    // }
    getOverViewData(day, bizType, appType, channelId) {
        return this.get("GET_DASHBOARD_OVERVIEW", "/" + day + "?businessType=" + bizType + "&appType=" + appType + "&channelId=" + channelId, null, {});
    }

    //漏斗类型查询数据
    getFunnelTypeData(data) {
        return this.get("GET_DATA_DIC", "/funnel_type" + "?bizType=" + data);
    }

    //渠道对比与趋势
    getChatTypeData(data) {
        return this.get("GET_DATA_DIC", "/data_type" + "?bizType=" + data);
    }

    //borrow渠道对比与趋势
    getChatTypeDataBorrow() {
        return this.get("GET_DATA_DIC", "/data_type_borrow");
    }

    //获取渠道类型
    getChannelTypeData() {
        return this.get("GET_CHANNEL_TYPE");
    }

    //根据渠道类型获取渠道
    getChannelByType(typeList) {
        return this.post("GET_CHANNEL_BYTYPE", typeList);
    }

    //获取所有渠道
    getAllChannel() {
        return this.get("GET_ALL_REFFERAL");
    }

    //投放数据对比
    getChat1(data) {
        return this.post("GET_DASHBOARD_CHAT1", data);//("SELECT_COMPARE", data);
    }

    //投放数据趋势
    getChat2(data) {
        return this.post("GET_DASHBOARD_CHAT2", data);  //return this.post("SELECT_PUBLISH_TREND", data);
    }

    //获取渠道漏斗
    getChat3(data) {
        return this.post("GET_DASHBOARD_CHAT3", data);
    }

    //获取排行榜
    getChat4(data) {
        return this.post("GET_DASHBOARD_CHAT4", data);
    }

    //获取当前时间
    getCurrentTime() {
        return this.get("GET_CURRENT_DATA");
    }

    getBussinessData(data) {
        return this.get("GET_DATA_DIC", "/business_type" + "?bizType=" + data);
    }

    /*投放计划下拉框查询*/
    getCampaignPlan(data) {
        return this.post("CAMPAING_PLAN_DASHBOARD", data);
    }

    /*广告位下拉框查询*/
    getBannersPlace(data) {
        return this.post("GET_BANNER_BYCAMPAIGNPLANID", data);
    }

    /*素材关键词下拉框*/
    getMaterialAndKey(data) {
        return this.post("GET_UTM_BYBANNERID", data);
    }

    /*获取留存日报*/
    getOverReport(data) {
        return this.post("GET_OVER_REPORT", data);
    }

    /*导出留存日报*/
    exportOverReport(channelId) {
        return this.downLoad("EXPORT_OVER_REPORT", null, channelId)
    }

}


//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("Dashboard数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class DashboardSingleService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);

    }

    getOverViewData(day, bizType, appType, channelId) {
        let result = [];
        return this.api.getOverViewData(day, bizType, appType, channelId).then(function (api_result) {
            result = api_result.result;
            return result;
        });
    }

    getChatTypeData(data) {
        let result = [];
        return this.api.getChatTypeData(data).then(function (api_result) {
            var hasDefault = false;
            angular.forEach(api_result.result, (item, index) => {
                item.disabled = item.status != "enable";
                if (!hasDefault) {
                    item.selected = true;
                    hasDefault = true;
                }
                // item.selected = !item.disabled;
            });

            return api_result.result;
        });
    }

    getChatTypeDataBorrow() {
        let result = [];
        return this.api.getChatTypeDataBorrow().then(function (api_result) {
            var hasDefault = false;
            angular.forEach(api_result.result, (item, index) => {
                item.disabled = item.status != "enable";
                if (!hasDefault) {
                    item.selected = true;
                    hasDefault = true;
                }
                // item.selected = !item.disabled;
            });
            return api_result.result;
        });
    }


    getFunnelTypeData(data) {
        let result = [];

        return this.api.getFunnelTypeData(data).then(function (api_result) {
            //var hasDefault = false;

            angular.forEach(api_result.result, (item, index) => {
                /*默认禁用用户注册数*/
                if (item.dataCode == 'regist_num') {
                    item.disabled = true;
                }
                //item.disabled = item.status != "enable";
                //if (!hasDefault) {
                item.selected = true;
                //hasDefault = true;
                //}
                // item.selected = !item.disabled;
            });
            return api_result.result;
        });
    }

    getChannelTypeData() {
        let result = [];
        return this.api.getChannelTypeData().then(function (api_result) {
            angular.forEach(api_result.result, (item, index) => {
                item.disabled = item.status != "enable";
                // item.selected = !item.disabled;
            });
            return api_result.result;
        });
    }

    getChannelByType(type) {
        let result = [];

        return this.api.getChannelByType(type).then(function (api_result) {
            return api_result.result;
        }).catch(function () {
            return result;
        });
    }

    getAllChannel() {
        return this.api.getAllChannel().then((d) => {
            return d.result
        });
    }


    //【自动提示,自动Loading】 第五步  对需要的方法加入修饰器
    // @autoloading
    // @autotip("渠道对比数据数据读取失败,${error}")
    getChat1(data) {
        return this.api.getChat1(data).then((d) => {
            return d.result
        });
    }

    getChat2(data) {
        return this.api.getChat2(data).then((d) => {
            return d.result
        });
    }

    getChat3(data) {
        return this.api.getChat3(data).then((d) => {
            return d.result
        });
    }

    getChat4(data) {
        return this.api.getChat4(data).then((d) => {
            return d.result
        });
    }

    getCurrentTime() {
        return this.api.getCurrentTime().then((d) => {
            return d.result;
        });
    }

    getBussinessData(data) {
        return this.api.getBussinessData(data).then((d) => {
            return d.result;
        });
    }

    getCampaignPlan(data) {
        return this.api.getCampaignPlan(data).then((d) => {
            return d.result;
        });
    }

    getBannersPlace(data) {
        return this.api.getBannersPlace(data).then((d) => {
            return d.result;
        });
    }

    getMaterialAndKey(data) {
        return this.api.getMaterialAndKey(data).then((d) => {
            return d.result;
        })
    }

    getOverReport(data) {
        return this.api.getOverReport(data);
    }

    exportOverReport(channelId) {
        return this.api.exportOverReport(channelId);
    }
}


//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("DashboardSingleService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new DashboardSingleService(UtilsService, toastr, LoadingService);
}]);
