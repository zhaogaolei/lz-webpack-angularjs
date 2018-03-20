/**
 * Created by yunxiaoxie on 17/4/25.
 * 主数据 sevice
 */
import autotipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

import {BaseApiMethod, BaseService} from '../business.service';
class ApiMethod extends BaseApiMethod {

    //查询maindata by pagination
    queryPaginationList(paginArg) {
        return this.post("MAIN_DATA_PAGINATION", paginArg);
    }

    //查询子数据
    getSubDataByCode(code) {
        return this.get("GET_DATA_DIC", code);
    }

    //删除子数据
    removeSubData(id) {
        return this.post('DEL_SUB_DATA', null ,id);
    }
    
    //添加子数据
    addSubData(json) {
        return this.post('ADD_SUB_DATA', json);
    }

    //更新子数据
    updSubData(json) {
        return this.post('UPDATE_SUB_DATA', json);
    }

    /*生成主数据code*/
    getSubDataCode(id) {
        return this.get('GET_SUB_DATA_CODE', id);
    }

    //DOWNLOAD
    downloadFile(json) {
        return this.postBlob('DOWNLOAD', json);
    }
}

@autotipClass("${error}")
@traits(autotipMixin, autoloadingMixin)
class MainDataService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService, toastr);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    queryPaginationList(arg) {
        return this.api.queryPaginationList(arg);
    }

    getSubDataByCode(code) {
        return this.api.getSubDataByCode(code);
    }

    removeSubData(id) {
        return this.api.removeSubData(id);
    }

    addSubData(json) {
        return this.api.addSubData(json);
    }

    updSubData(json) {
        return this.api.updSubData(json);
    }

    getSubDataCode(id) {
        return this.api.getSubDataCode(id);
    }

    downloadFile(json) {
        return this.api.downloadFile(json);
    }
}

angular.module('biz-services').factory("MainDataService", ["UtilsService", 'toastr', 'LoadingService', function (UtilsService, toastr, LoadingService) {
    return new MainDataService(UtilsService, toastr, LoadingService);
}]);
