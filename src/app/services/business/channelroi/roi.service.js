/**
 * Created by LanYang on 2017/7/11.
 */
/**
 * Created by yunxiaoxie on 17/4/25.
 * 投放计划 sevice
 */
import autotipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

import {BaseApiMethod, BaseService} from '../business.service';
class ApiMethod extends BaseApiMethod {
    //查询所有单渠道
    getAllChannel(typeList) {
        return this.post("GET_CHANNEL_BYTYPE_ADMIN", typeList);
    }
    /*获取渠道列表*/
    getRoiList(data) {
        return this.post("GET_ROI_LIST", data);
    }

    exportDetailList(data){
        //return this.downLoad('EXPORT_DETAIL_LIST', null, data);
        return this.postBlob('EXPORT_DETAIL_LIST', data);
    }

}


@autotipClass("${error}")
@traits(autotipMixin, autoloadingMixin)
class RoiService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService)
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getAllChannel(type) {
        let result = [];
        return this.api.getAllChannel(type).then(function (api_result) {
            return api_result;
        }).catch(function () {
            return result;
        });
    }

    getRoiList(data) {
        return this.api.getRoiList(data);
    }

    exportDetailList(data){
        return this.api.exportDetailList(data);
    }
}

angular.module('biz-services').factory("RoiService", ["UtilsService", 'toastr', 'LoadingService', function (UtilsService, toastr, LoadingService) {
    return new RoiService(UtilsService, toastr, LoadingService);
}]);












