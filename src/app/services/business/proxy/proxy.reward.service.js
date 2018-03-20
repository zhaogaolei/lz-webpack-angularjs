import {BaseApiMethod, BaseService} from '.././business.service';
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {

    getProxyRewardList(data) {
        return this.post("PROXY_AWARD_LIST", data);
    }

    markException(data) {
        return this.post("", data);
    }

    getRewardStatus() {
        return this.get("MGM_DICTIONARY","grant_status");
    }
}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class ProxyRewardService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    //获取奖励发放列表
    @autoloading
    getProxyRewardList(data) {
        return this.api.getProxyRewardList(data);
    }

    //标为异常
    markException(data) {
        return this.api.markException(data);
    }

    //获取奖励状态
    getRewardStatus() {
        return this.api.getRewardStatus();
    }
}

angular.module('biz-services').factory("ProxyRewardService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService, toastr, LoadingService) {
        return new ProxyRewardService(UtilsService, toastr, LoadingService);
    }]);
