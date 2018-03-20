/**
 * Created by YundanChai on 2017/8/21.
 */
import autotipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

import {BaseApiMethod, BaseService} from '../business.service';
class ApiMethod extends BaseApiMethod {
    //类型数据指标
    /*getDataType(){
        return this.post("GET_TYPE_TITLE");
    }*/
    //所有渠道
    getAllChannels(typeList) {
        return this.post("GET_CHANNEL_BYTYPE", typeList);
    }

    getChannelDetail(data){
        return this.post("GET_STATISTIC_DATA",data);
    }

    downLoadChannelDetail(data){
        return this.postBlob('DOWNLOAD_CHANNEL_DETAIL', data);
    }
    getChatTypeData(data) {
        return this.get("GET_DATA_DIC", "/data_type" + "?bizType=" +  data);
    }
}

@autotipClass("${error}")
@traits(autotipMixin, autoloadingMixin)
class ChannelDetailService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService)
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getDataType() {
        return this.api.getDataType().then((d)=> {
            return d.result
        });
    }


    getAllChannels(data) {
        let result = [];
        return this.api.getAllChannels(data).then(function (api_result) {
            return api_result;
        }).catch(function () {
            return result;
        });
    }

    getChannelDetail(data) {
        return this.api.getChannelDetail(data).then((d)=> {
            return d.result
        });
    }

    downLoadChannelDetail(data){
        return this.api.downLoadChannelDetail(data);
    }
    getChatTypeData(data) {
        let result = [];
        return this.api.getChatTypeData(data).then(function (api_result) {
            return api_result.result;
        });
    }


}


angular.module('biz-services').factory("ChannelDetailService", ["UtilsService", 'toastr', 'LoadingService', function (UtilsService, toastr, LoadingService) {
    return new ChannelDetailService(UtilsService, toastr, LoadingService);
}]);
