/**
 * Created by leiz on 17/4/28
 * channel sevice
 */
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';
import {BaseApiMethod, BaseService} from '../business.service';
class ApiMethod extends BaseApiMethod {
    /*获取广告位列表*/
    getBannerList(data) {
        return this.post("GET_BANNER_BY_REFFERALID", data);
    }

    /*广告位类型*/
    getBannerType() {
        return this.get("GET_BANNNER_TYPE");
    }

    /*广告位置*/
    getBannerPosition() {
        return this.get("GET_BANNNER_POSITION");
    }

    /*根据ID获取广告信息*/
    getBannerInfoById(id) {
        return this.get("GET_BANNERINFO_BY_ID", "/" + id);
    }

    /*保存广告位信息*/
    saveBanner(data) {
        return this.post("BANNER_SAVE", data);
    }
    downAdTemplate(data){
        return this.postBlob("DOWNLOAD",data);
    }
}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class AdService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getBannerList(data) {
        return this.api.getBannerList(data);
    }

    getBannerType() {
        return this.api.getBannerType();
    }

    getBannerPosition() {
        return this.api.getBannerPosition();
    }

    getBannerInfoById(id) {
        return this.api.getBannerInfoById(id);
    }
    @autoloading
    saveBanner(data) {
        return this.api.saveBanner(data);
    }
    downAdTemplate(data){
        return this.api.downAdTemplate(data);
    }
}

angular.module('biz-services').factory("AdService", ["UtilsService","toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new AdService(UtilsService, toastr, LoadingService);
}]);
