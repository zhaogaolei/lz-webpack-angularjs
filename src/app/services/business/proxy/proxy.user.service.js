import {BaseApiMethod, BaseService} from '.././business.service';
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {
    getProxyLevel() {
        return this.get("PROXY_LEVEL_QUERY");
    }

    getProxyType() {
        return this.post("PROXY_USER_TYPE");
    }

    getProxyUserList(data) {
        return this.post("PROXY_USER_LIST", data);
    }

    proxyAdd(data) {
        return this.post("PROXY_USER_ADD", data);
    }

    proxyUpdate(data) {
        return this.post("PROXY_USER_UPDATE", data);
    }

    proxyDelete(data) {
        return this.post("PROXY_USER_DELETE", data);
    }

    proxyFreeze(data) {
        return this.post("PROXY_USER_FREEZE", data);
    }

    proxyUnfreeze(data) {
        return this.post("PROXY_USER_UNFREEZE", data);
    }
}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class ProxyUserService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    //获取代理人等级
    getProxyLevel() {
        return this.api.getProxyLevel();
    }

    //获取代理人类型
    getProxyType() {
        return this.api.getProxyType();
    }

    // 获取代理人列表
    @autoloading
    getProxyUserList(data) {
        return this.api.getProxyUserList(data);
    }

    //添加代理人
    @autoloading
    proxyAdd(data) {
        return this.api.proxyAdd(data);
    }

    //更新代理人
    @autoloading
    proxyUpdate(data) {
        return this.api.proxyUpdate(data);
    }

    //删除代理人
    @autoloading
    proxyDelete(data) {
        return this.api.proxyDelete(data);
    }

    //冻结代理人
    @autoloading
    proxyFreeze(data) {
        return this.api.proxyFreeze(data);
    }

    //取消冻结代理人
    @autoloading
    proxyUnfreeze(data) {
        return this.api.proxyUnfreeze(data);
    }
}

angular.module('biz-services').factory("ProxyUserService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService, toastr, LoadingService) {
        return new ProxyUserService(UtilsService, toastr, LoadingService);
    }]);
