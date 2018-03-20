/**
 * Created by leizhao on 17/9/27.
 */
import {BaseApiMethod, BaseService} from '../business.service';
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {

    /*获取ROI字典*/
    getRefferalRoiDic() {
        return this.get("GET_REFFERAL_ROI_DIC");
    }

    /*获取K线图*/
    getRefferalRoiK(data) {
        return this.post("GET_REFFERAL_ROI_K", data);
    }

    /*获取象限图*/
    getRefferalRoiQ(data) {
        return this.post("GET_REFFERAL_ROI_Q", data);
    }

    /*获取数据列表*/
    getRefferalRoiList(params) {
        return this.get("GET_REFFERAL_ROI_LIST", params);
    }

}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class AbtRoiService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getRefferalRoiDic() {
        return this.api.getRefferalRoiDic();
    }

    getRefferalRoiK(data) {
        return this.api.getRefferalRoiK(data);
    }

    getRefferalRoiQ(data) {
        return this.api.getRefferalRoiQ(data);
    }

    getRefferalRoiList(params) {
        return this.api.getRefferalRoiList(params);
    }
}

angular.module('biz-services').factory("AbtRoiService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService,toastr, LoadingService) {
        return new AbtRoiService(UtilsService, toastr, LoadingService);
    }]);
