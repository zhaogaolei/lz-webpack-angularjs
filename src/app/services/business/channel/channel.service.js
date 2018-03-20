/**
 * Created by leiz on 17/4/28
 * channel sevice
 */
import {BaseApiMethod, BaseService} from '../business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {
    /*渠道类型*/
    getChannelType(data) {
        return this.get("GET_CHANNEL_TYPE", "?range=" + data);//GET_CHANNEL_TYPE
    }

    /*部门*/
    getDepartment() {
        return this.get("GET_DEPARTMENT");
    }

    /*渠道状态*/
    getChannelStatus() {
        return this.get("GET_CHANNEL_STATUS");
    }

    /*获取渠道列表*/
    getChannelList(data) {
        return this.post("GET_CHANNEL_LIST", data);
    }

    /*下载模板*/
    downTemplate(data) {
        return this.postBlob("DOWNLOAD", data);
    }

    /*开放接口*/
    getOpenApi() {
        return this.get("OPEN_API");
    }

    /*结算方式*/
    getSettleMode() {
        return this.get("SETTLE_MODE");
    }

    /*产品*/
    getProduct() {
        return this.get("PRODUCT_API");
    }

    /*获取渠道信息根据ID*/
    getChannelById(id) {
        return this.get("VIEW_CHANNEL_BY_ID", "/" + id)
    }

    /*保存渠道*/
    saveChannel(data) {
        return this.post("CHANNEL_SAVE", data);
    }

    /*复制渠道*/
    copyChannel(id) {
        return this.get("CHANNEL_COPY_BY_ID", "/" + id);
    }

    /*删除渠道*/
    deleteChannel(id) {
        return this.get("CHANNEL_DELETE_BY_ID", "/" + id);
    }
}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class ChannelService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getChannelType(data) {
        return this.api.getChannelType(data);
    }

    getDepartment() {
        return this.api.getDepartment();
    }

    getChannelStatus() {
        return this.api.getChannelStatus();
    }

    getChannelList(data) {
        return this.api.getChannelList(data);
    }

    downTemplate(data) {
        return this.api.downTemplate(data);
    }

    getOpenApi() {
        return this.api.getOpenApi();
    }

    getSettleMode() {
        return this.api.getSettleMode();
    }

    getProduct() {
        return this.api.getProduct();
    }

    @autoloading
    getChannelById(id) {
        return this.api.getChannelById(id)
    }

    @autoloading
    saveChannel(data) {
        return this.api.saveChannel(data);
    }

    @autoloading
    copyChannel(id) {
        return this.api.copyChannel(id);
    }

    @autoloading
    deleteChannel(id) {
        return this.api.deleteChannel(id);
    }
}

angular.module('biz-services').factory("ChannelService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new ChannelService(UtilsService, toastr, LoadingService);
}]);
