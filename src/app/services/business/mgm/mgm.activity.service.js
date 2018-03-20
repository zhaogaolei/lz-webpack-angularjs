import {BaseApiMethod, BaseService} from '.././business.service';
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {

    getActivityList(data){
        return this.post("MGM_ACTIVITY_LIST",data);
    }

    stopMgmActivity(data){
        return this.post("MGM_ACTIVITY_STOP",data);
    }

    deleteMgmActivity(data){
        return this.post("MGM_ACTIVITY_DELETE",data);
    }

    getDept() {
        return this.get("MGM_DICTIONARY", "dept");
    }
}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class MgmActivityService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }
    //获取所有MGM活动列表
    getActivityList(data) {
        return this.api.getActivityList(data);
    }
    //停止MGM活动
    stopMgmActivity(data){
        return this.api.stopMgmActivity(data);
    }
    // 删除MGM活动
    deleteMgmActivity(data){
        return this.api.deleteMgmActivity(data);
    }
    //获取所有部门
    getDept() {
        return this.api.getDept();
    }
}

angular.module('biz-services').factory("MgmActivityService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService,toastr, LoadingService) {
        return new MgmActivityService(UtilsService, toastr, LoadingService);
    }]);
