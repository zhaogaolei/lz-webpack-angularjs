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
    getOverViewData(day,bizType,appType) {
        return this.get("GET_DASHBOARD_OVERVIEW", "/" + day +"?businessType=" + bizType + "&appType=" + appType, null, {});
    }

    //漏斗类型查询数据
    getFunnelTypeData(data) {
        return this.get("GET_DATA_DIC", "/funnel_type" + "?bizType=" + data);
    }

    //渠道对比与趋势
    getChatTypeData(data) {
        return this.get("GET_DATA_DIC", "/data_type" + "?bizType=" +  data);
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

    //获取渠道对比

    getChat1(data) {
        return this.post("GET_DASHBOARD_CHAT1", data);
    }

    //获取渠道趋势
    getChat2(data) {
        return this.post("GET_DASHBOARD_CHAT2", data);
    }

    //获取渠道漏斗
    getChat3(data) {
        return this.post("GET_DASHBOARD_CHAT3", data);
    }

    //获取排行榜
    getChat4(data) {
        return this.post("GET_DASHBOARD_CHAT4", data);
    }

    //获取实时数据1
    getNowChat1(id,isAddFlag) {
        return this.get("GET_DASHBOARD_NOWCHAT3", "/" + id + "/" + isAddFlag);
    }

    //获取当前时间
    getCurrentTime() {
        return this.get("GET_CURRENT_DATA");
    }

     //获取UV数据
    getUvNowChat1(id,isAddFlag) {
        return this.get("GET_DASHBOARD_UVCHAT3", "/" + id + "/" + isAddFlag);
    }

    //获取PV数据
    getPvNowChat1(id,isAddFlag) {
        return this.get("GET_DASHBOARD_PVCHAT3", "/" + id + "/" + isAddFlag);
    }

    /*新注册首投人数实时*/
    getFirstInvestPerson(id,isAddFlag){
        return this.get("GET_FIRSTINVEST_PERSON", "/" + id + "/" + isAddFlag);
    }

    /*新注册首投金额实时*/
    getFirstInvestAmount(id,isAddFlag){
        return this.get("GET_FIRSTINVEST_AMOUNT", "/" + id + "/" + isAddFlag);
    }

    /*新注册人均首投金额实时*/
    getAvgFirstInvestAmount(id,isAddFlag){
        return this.get("GET_AVGFIRSTINVEST_AMOUNT", "/" + id + "/" + isAddFlag);
    }

    /*新注册累计投资人数实时*/
    getTotalInvestPerson(id,isAddFlag){
        return this.get("GET_TOTALINVEST_PERSON", "/" + id + "/" + isAddFlag);
    }

    /*新注册累计投资金额实时*/
    getTotalInvestAmount(id,isAddFlag){
        return this.get("GET_TOTALINVEST_AMOUNT", "/" + id + "/" + isAddFlag);
    }

    /*新注册人均累计金额实时*/
    getAvgTotalInvestAmount(id,isAddFlag){
        return this.get("GET_AVGTOTALFIRSTINVEST_AMOUNT", "/" + id + "/" + isAddFlag);
    }

    getBussinessData(data) {
        return this.get("GET_DATA_DIC", "/business_type" + "?bizType=" +  data);
    }

}


//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("Dashboard数据读取出错,${error}")
@traits(autotipMixin, autoloadingMixin)
class DashboardService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);

    }

    getOverViewData(day,bizType,appType) {
        let result =[];
        return this.api.getOverViewData(day,bizType,appType).then(function (api_result) {
            result = api_result.result;
            return result;
        });
    }


    getChatTypeData(data) {
        let result = [];

        return this.api.getChatTypeData(data).then(function (api_result) {
            var hasDefault = false;
            angular.forEach(api_result.result, (item, index)=> {
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
            angular.forEach(api_result.result, (item, index)=> {
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

            angular.forEach(api_result.result, (item, index)=> {
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
            angular.forEach(api_result.result, (item, index)=> {
                item.disabled = item.status != "enable";
                // item.selected = !item.disabled;
            });
            return api_result.result;
        });
    }

    getChannelByType(type) {
        let result = [];

        return this.api.getChannelByType(type).then(function (api_result) {
            // angular.forEach(api_result, (item, index)=> {
            //     item.disabled = item.status != "enable";
            //     // item.selected = !item.disabled;
            // });
            // if (api_result.length > 0) {
            //     api_result[0].selected = true;
            // }
            return api_result.result;
        }).catch(function () {
            return result;
        });
    }

    getAllChannel() {
        return this.api.getAllChannel().then((d)=> {
            return d.result
        });
    }


    //【自动提示,自动Loading】 第五步  对需要的方法加入修饰器
    // @autoloading
    // @autotip("渠道对比数据数据读取失败,${error}")
    getChat1(data) {
        return this.api.getChat1(data).then((d)=> {
            return d.result
        });
    }

    getChat2(data) {
        return this.api.getChat2(data).then((d)=> {
            return d.result
        });
    }

    getChat3(data) {
        return this.api.getChat3(data).then((d)=> {
            return d.result
        });
    }

    getChat4(data) {
        return this.api.getChat4(data).then((d)=> {
            return d.result
        });
    }

    getNowChat1(id,isAddFlag) {
        return this.api.getNowChat1(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }

    getCurrentTime() {
        return this.api.getCurrentTime().then((d)=> {
            return d.result;
        });
    }

     getUvNowChat1(id,isAddFlag){
        return this.api.getUvNowChat1(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }

    getPvNowChat1(id,isAddFlag){
        return this.api.getPvNowChat1(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }
    getFirstInvestPerson(id,isAddFlag){
        return this.api.getFirstInvestPerson(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }
    getFirstInvestAmount(id,isAddFlag){
        return this.api.getFirstInvestAmount(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }
    getAvgFirstInvestAmount(id,isAddFlag){
        return this.api.getAvgFirstInvestAmount(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }
    getTotalInvestPerson(id,isAddFlag){
        return this.api.getTotalInvestPerson(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }
    getTotalInvestAmount(id,isAddFlag){
        return this.api.getTotalInvestAmount(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }
    getAvgTotalInvestAmount(id,isAddFlag){
        return this.api.getAvgTotalInvestAmount(id,isAddFlag).then((d)=> {
            return d.result;
        });
    }
    getBussinessData(data) {
        return this.api.getBussinessData(data).then((d)=> {
            return d.result;
        });
    }
}


//【自动提示,自动Loading】 第二步   添加 toastr LoadingService 依赖注入
angular.module('biz-services').factory("DashboardService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new DashboardService(UtilsService, toastr, LoadingService);
}]);
