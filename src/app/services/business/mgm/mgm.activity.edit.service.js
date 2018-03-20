import {BaseApiMethod, BaseService} from '.././business.service';
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {

    getDept() {
        return this.get("MGM_DICTIONARY", "dept");
    }

    getDeliverChannel() {
        return this.get("MGM_DICTIONARY", "campaign_refferal");
    }

    getInviteType() {
        return this.get("MGM_DICTIONARY", "invite_type");
    }

    getSettleType() {
        return this.get("MGM_DICTIONARY", "settle_type");
    }

    getBehaviorType() {
        return this.get("MGM_DICTIONARY", "behavior_type");
    }

    getProductList() {
        return this.get("MGM_DICTIONARY", "adaptive_type_001");
    }

    getDataCondition() {
        return this.get("MGM_DICTIONARY", "analyze_operator");
    }

    getSettleObject() {
        return this.get("MGM_DICTIONARY", "settle_object");
    }

    getRewardType() {
        return this.get("MGM_DICTIONARY", "provide_type_001");
    }

    getRewardWay() {
        return this.get("MGM_DICTIONARY", "provide_way");
    }

    queryByMgmId(data) {
        return this.post("QUERY_BY_MGMID", data);
    }

    saveMgmActivity(data) {
        return this.post("ADD_MGM_ACTIVITY", data);
    }

    updateMgmActivity(data) {
        return this.post("UPDATE_MGM_ACTIVITY", data);
    }

}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class MgmActivityEditService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getDept() {
        return this.api.getDept();
    }

    getDeliverChannel() {
        return this.api.getDeliverChannel();
    }

    getInviteType() {
        return this.api.getInviteType();
    }

    getSettleType() {
        return this.api.getSettleType();
    }

    getBehaviorType() {
        return this.api.getBehaviorType();
    }

    getProductList() {
        return this.api.getProductList();
    }

    getDataCondition() {
        return this.api.getDataCondition();
    }

    getSettleObject() {
        return this.api.getSettleObject();
    }

    getRewardType() {
        return this.api.getRewardType();
    }

    getRewardWay() {
        return this.api.getRewardWay();
    }

    queryByMgmId(data) {
        return this.api.queryByMgmId(data);
    }

    @autoloading
    saveMgmActivity(data) {
        return this.api.saveMgmActivity(data);
    }

    @autoloading
    updateMgmActivity(data) {
        return this.api.updateMgmActivity(data);
    }
}

angular.module('biz-services').factory("MgmActivityEditService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService, toastr, LoadingService) {
        return new MgmActivityEditService(UtilsService, toastr, LoadingService);
    }]);
