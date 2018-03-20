import {BaseApiMethod, BaseService} from '.././business.service';
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {

    getProxyLevelList() {
        return this.get("PROXY_LEVEL_QUERY");
    }

    setCommissionFactor(data) {
        return this.post("PROXY_LEVEL_SET_COMMISSION_FACTOR", data);
    }

    getProxyLevelIrByLevelId(levelId) {
        return this.get("PROXY_LEVEL_IR_QUERY_BY_LEVELID_SELECTED", levelId);
    }

    getProxyLevelIrList(levelId) {
        return this.get("PROXY_LEVEL_IR_QUERY_BY_LEVELID_ALL", levelId);
    }

    updateProxyLevelIrCurrent(data) {
        return this.post("PROXY_LEVEL_IR_CURRENT_EDIT", data);
    }

    addProxyLevelIr(data) {
        return this.post("PROXY_LEVEL_IR_ADD", data);
    }

    deleteProxyLevelIr(id) {
        return this.post("PROXY_LEVEL_IR_DELETE", null, id);
    }

    getCouponPlanCouponName() {
        return this.get("PROXY_LEVEL_IR_COUPON_PLAN");
    }
}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class ProxyLevelService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    //获取代理人等级列表
    @autoloading
    getProxyLevelList() {
        return this.api.getProxyLevelList();
    }

    //设置佣金系数
    @autoloading
    setCommissionFactor(data) {
        return this.api.setCommissionFactor(data);
    }

    //查询当前等级已选择的邀请权益
    getProxyLevelIrByLevelId(levelId) {
        return this.api.getProxyLevelIrByLevelId(levelId);
    }

    //查询邀请权益池
    getProxyLevelIrList(levelId) {
        return this.api.getProxyLevelIrList(levelId);
    }

    //编辑当前等级邀请权益
    @autoloading
    updateProxyLevelIrCurrent(data) {
        return this.api.updateProxyLevelIrCurrent(data);
    }

    //新增邀请权益
    @autoloading
    addProxyLevelIr(data) {
        return this.api.addProxyLevelIr(data);
    }

    /*删除邀请权益*/
    @autoloading
    deleteProxyLevelIr(id) {
        return this.api.deleteProxyLevelIr(id);
    }

    //获取券计划券类型集合
    getCouponPlanCouponName() {
        return this.api.getCouponPlanCouponName();
    }
}

angular.module('biz-services').factory("ProxyLevelService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService, toastr, LoadingService) {
        return new ProxyLevelService(UtilsService, toastr, LoadingService);
    }]);
