/**
 * Created by leiz on 17/4/28
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
    /**
     * 以下素材列表
     * */
    getMaterialStatus() {
        return this.get("GET_MATERIAL_STATUS");
    }

    getMaterialList(urlParas) {
        return this.get("GET_MATERIAL_LIST", urlParas);
    }

    /**
     * 以下素材详情
     * */
    getMaterialTaskById(id) {
        return this.post("GET_MATERIAL_TASK_BY_ID", null, "/" + id);
    }

    getMaterialDetailList(data) {
        return this.post("GET_MATERIAL_MANAGE_LIST", data);
    }

    acceptTask(id) {
        return this.post("ACCEPT_TASK", null, "/" + id);
    }

    getOperateRecord(id) {
        return this.get("GET_OPERATE_HISTORY", "/" + id);
    }

    downLoadAttchFile(data) {
        return this.postBlob("DOWNLOAD", data);
    }

    deleteAttchFile(id) {
        return this.post("DELETE_MATERIAL", null, "/" + id);
    }

    sendEmail(data) {
        return this.post("NOTICE_EMAIL", data)
    }
}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class MaterialService extends BaseService {
    constructor(UtilsService,toastr,LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getMaterialStatus() {
        return this.api.getMaterialStatus();
    }

    getMaterialList(urlParas) {
        return this.api.getMaterialList(urlParas);
    }

    getMaterialTaskById(id) {
        return this.api.getMaterialTaskById(id);
    }

    getMaterialDetailList(data) {
        return this.api.getMaterialDetailList(data);
    }

    acceptTask(id) {
        return this.api.acceptTask(id);
    }

    getOperateRecord(id) {
        return this.api.getOperateRecord(id);
    }

    downLoadAttchFile(data) {
        return this.api.downLoadAttchFile(data);
    }

    deleteAttchFile(id) {
        return this.api.deleteAttchFile(id);
    }

    sendEmail(data) {
        return this.api.sendEmail(data);
    }
}

angular.module('biz-services').factory("MaterialService",["UtilsService","toastr", "LoadingService",  function (UtilsService, toastr, LoadingService) {
    return new MaterialService(UtilsService, toastr, LoadingService);
}]);
