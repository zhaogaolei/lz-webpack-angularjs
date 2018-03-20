/**
 * Created by YundanChai on 2017/12/5.
 */
import {BaseApiMethod, BaseService} from '../business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';
class ApiMethod extends BaseApiMethod {
    /*获取sem投放动作列表--分页*/
    getAllDeliverAction(params) {
        return this.post("SEM_SELECT_PUBLISH", params);
    }

    //查询所有SEM单渠道, 仅用于弹框单渠道
    getAllChannel() {
        return this.get("GET_CHANNEL_BYTYPE_SEM");
    }

    //添加投放动作
    addDeliverAction(json) {
        return this.post('SEM_INSERT_PUBLISH', json);
    }

    /*编辑投放动作*/
    updDeliverAction(json) {
        return this.post('SEM_UPDATE_PUBLISH', json);
    }

    /*编辑投放动作--渠道开始结束时间*/
    updDeliverActionTime(json) {
        return this.post('UPD_PUBLISH_TIME', json);
    }

    /*删除投放动作*/
    delDeliverAction(json) {
        return this.post('SEM_DELETE_PUBLISH', json);
    }

    /*停止投放动作*/
    stopDeliverAction(id) {
        return this.post('SEM_STOP_PUBLISH', null, id);
    }

    /**
     * 根据ID获取投放信息
     * */
    getDevilerInfoById (id){
        return this.get("GET_SET_PUBLISH",id);
    }

    //根据投放动作id获取对应详情
    getActionDeatil(data){
        return this.post("GET_ACTION_DETAIL",data);
    }

    exportDetaiAction(data){
        return this.postBlob('SEM_DOWNLOAD_DETAIL', data);
    }

}
//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class SemDeliverActionService extends BaseService {
    constructor(UtilsService, toastr, filter, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.toastr = toastr;
        this.dateFilter = filter('date');
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    //获取所有投放动作
    @autoloading
    getAllDeliverAction(params) {
        return this.api.getAllDeliverAction(params);
    }


    //查询所有单渠道, 仅用于弹框单渠道
    getAllChannel() {
        return this.api.getAllChannel();
    }
    //添加投放动作
    addDeliverAction(json) {
        return this.api.addDeliverAction(json);
    }

    /*编辑投放动作*/
    updDeliverAction(json) {
        return this.api.updDeliverAction(json);
    }

    /*编辑投放动作--渠道开始结束时间*/
    updDeliverActionTime(json) {
        return this.api.updDeliverActionTime(json);
    }

    /*删除投放动作*/
    delDeliverAction(json) {
        return this.api.delDeliverAction(json);
    }
    @autoloading
    stopDeliverAction(id) {
        return this.api.stopDeliverAction(id);
    }

    getDevilerInfoById(id){
        return this.api.getDevilerInfoById(id);
    }
    getActionDeatil(data){
        return this.api.getActionDeatil(data);
    }

    exportDetaiAction(data){
        return this.api.exportDetaiAction(data);
    }
}

angular.module('biz-services').factory("SemDeliverActionService", ["UtilsService", "toastr", "$filter", "LoadingService", function (UtilsService, toastr, $filter, LoadingService) {
    return new SemDeliverActionService(UtilsService, toastr, $filter, LoadingService);
}]);
