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

    //查询所有投放计划
    queryPaginationList(paginArg) {
        return this.get("QUERY_CAMPAIGNPLAN", paginArg);
    }

    //投放类型
    getDeliverType() {
        return this.get("DELIVER_TYPE");
    }

    //广告位属性
    getBannerProperty() {
        return this.get("BANNER_PROPERTY");
    }

    //业务产品
    getBusinessProduct(businessType) {
        return this.get("BUSINESS_PRODUCT", businessType);
    }

    //加载投放计划基本信息
    getDeliverInfoById(id) {
        return this.get("SELECT_CAMPAIGNPLAN", id);
    }

    //创建投放计划
    createPlan(data) {
        return this.post("PLAN_CREATE", data);
    }

    //更新投放计划
    updatePlan(data) {
        return this.post("PLAN_UPDATE", data);
    }

    //复制投放计划
    copyPlan(id) {
        return this.post("PLAN_COPY", null, id);
    }

    //删除投放计划
    deletePlan(id) {
        return this.delete("DEL_CAMPAIGNPLAN", null, id);
    }

    //---------------------next Controller
    //查询所有投放动作-分页
    getAllDeliverAction(paginArg) {
        return this.post("GET_PUBLISHBYCAMPAIGNPLAN", paginArg);
    }

    //查询所有投放动作-不分页
    getAllDeliverNoPage(id) {
        return this.post("GET_PUBLISH", null, id);
    }

    //查询所有单渠道, 仅用于弹框单渠道
    getAllChannel(data) {
        return this.get("GET_ALL_REFFERAL",'?range='+data);
    }

    //查询所有单渠道和代理商数据，仅用于数据搜索
    getAllChannelAgent() {
        return this.get("GET_ALL_REFFERAL_AGENT");
    }

    //查询所有代理商
    getAllAgent() {
        return this.get("GET_AGENT_ALL");
    }

    // get target for ad.
    getTargetList() {
        return this.get('TARGET');
    }

    //添加投放动作
    addDeliverAction(json) {
        return this.post('ADD_PUBLISH', json);
    }

    /*编辑投放动作*/
    updDeliverAction(json) {
        return this.post('UPD_PUBLISH', json);
    }

    /*编辑投放动作--渠道开始结束时间*/
    updDeliverActionTime(json) {
        return this.post('UPD_PUBLISH_TIME', json);
    }

    /*删除投放动作*/
    delDeliverAction(json) {
        return this.post('DEL_PUBLISH', json);
    }

    /*停止投放动作*/
    stopDeliverAction(id) {
        return this.post('STOP_PUBLISH', null, id);
    }

    /*查询广告栏位 by refferalId*/
    getBannerOfRefferal(json) {
        return this.post('GET_BANNER_REFFERAL', json);
    }

    /*通过代理商查询渠道*/
    getBannerByAgent(id) {
        return this.get('GET_CHNNEL_BY_AGENT', id);
    }

    //广告位录入链接需做可达性校验
    checkAdUrl(json) {
        return this.post('CHECK_URL', json);
    }

    //查询所有素材任务
    getMaterialTaskList(json) {
        return this.post('GET_MATERIAL_TASKLIST', json);
    }

    ///*素材类型*/
    getMaterialType() {
        return this.get('DATA_DIC');
    }

    //查询素材任务
    getMaterialTaskById(id) {
        return this.get('GET_MATERIAL_TASK', id);
    }

    //查询分配用户
    getUser() {
        return this.get('ALLOCATION_USER');
    }

    //查询上传的附件
    getAttachFiles(json) {
        return this.post('GET_ATTACH_MUL', json);
    }

    // 分配用户
    assignMaterial(json) {
        return this.post('ASSIGN_MATERIAL', json);
    }

    // 删除上传附件
    removeAttach(json) {
        return this.post('DEL_ATTACH', json);
    }

    // DOWNLOAD
    downloadFile(json) {
        return this.postBlob('DOWNLOAD', json);
    }

    //获取操作记录
    getOperateRecord(id) {
        return this.get('GET_OPERATE_HISTORY', id);
    }

    /**验收完成 -操作*/
    checkComplete(id) {
        return this.post('CHECK_COMPLETE', null, id);
    }

    //export url
    exportUrls(id) {
        return this.downLoad('EXPORT_URL', null, id);
    }

    /**
     * add by zhaolei
     * */
    getActivityUrlList() {
        return this.get("GET_ACTIVITY_URL_LIST");
    }

    /**
     * 根据渠道ID获取广告位信息
     * */
    getBannerInfoByRefferalId(id) {
        return this.get('GET_BANNERINFO_BY_REFFERALID', id);
    }

    /**
     * 根据ID获取投放信息
     * */
    getDevilerInfoById (id){
      return this.get("GET_DEVILERINFO_BY_ID",id);
    }

    getPbulishWay(){
        return this.get("GET_PUBLISH_WAY");
    }

}


@autotipClass("${error}")
@traits(autotipMixin, autoloadingMixin)
class DeliverService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService)
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    queryPaginationList(arg) {
        return this.api.queryPaginationList(arg);
    }

    getDeliverType() {
        return this.api.getDeliverType();
    }

    getBannerProperty() {
        return this.api.getBannerProperty();
    }

    getBusinessProduct(businessType) {
        return this.api.getBusinessProduct(businessType);
    }

    getDeliverInfoById(id) {
        return this.api.getDeliverInfoById(id);
    }

    createPlan(data) {
        return this.api.createPlan(data);
    }

    updatePlan(data) {
        return this.api.updatePlan(data);
    }

    copyPlan(id) {
        return this.api.copyPlan(id);
    }

    deletePlan(id) {
        return this.api.deletePlan(id);
    }

    //-----------------------
    getAllDeliverAction(arg) {
        return this.api.getAllDeliverAction(arg);
    }

    getAllDeliverNoPage(id) {
        return this.api.getAllDeliverNoPage(id);
    }

    getAllChannel(data) {
        return this.api.getAllChannel(data);
    }

    getAllChannelAgent() {
        return this.api.getAllChannelAgent();
    }

    getAllAgent() {
        return this.api.getAllAgent();
    }

    getTargetList() {
        return this.api.getTargetList();
    }
    @autoloading
    addDeliverAction(json) {
        return this.api.addDeliverAction(json);
    }
    @autoloading
    updDeliverAction(json) {
        return this.api.updDeliverAction(json);
    }

    updDeliverActionTime(json) {
        return this.api.updDeliverActionTime(json);
    }
    @autoloading
    delDeliverAction(json) {
        return this.api.delDeliverAction(json);
    }
    @autoloading
    stopDeliverAction(id) {
        return this.api.stopDeliverAction(id);
    }

    getBannerOfRefferal(json) {
        return this.api.getBannerOfRefferal(json);
    }

    getBannerByAgent(id) {
        return this.api.getBannerByAgent(id);
    }

    checkAdUrl(json) {
        return this.api.checkAdUrl(json);
    }

    getMaterialTaskList(json) {
        return this.api.getMaterialTaskList(json);
    }

    getMaterialType() {
        return this.api.getMaterialType();
    }

    getMaterialTaskById(id) {
        return this.api.getMaterialTaskById(id);
    }

    getUser() {
        return this.api.getUser();
    }

    getAttachFiles(json) {
        return this.api.getAttachFiles(json);
    }

    assignMaterial(json) {
        return this.api.assignMaterial(json);
    }

    removeAttach(json) {
        return this.api.removeAttach(json);
    }

    downloadFile(json) {
        return this.api.downloadFile(json);
    }

    getOperateRecord(id) {
        return this.api.getOperateRecord(id);
    }

    checkComplete(id) {
        return this.api.checkComplete(id);
    }

    exportUrls(id) {
        return this.api.exportUrls(id);
    }

    /**
     * add by zhaolei
     * */
    getActivityUrlList() {
        return this.api.getActivityUrlList();
    }

    getBannerInfoByRefferalId(id) {
        return this.api.getBannerInfoByRefferalId(id);
    }
    getDevilerInfoById(id){
        return this.api.getDevilerInfoById(id);
    }
    @autoloading
    getPbulishWay(){
        return this.api.getPbulishWay();
    }
}

angular.module('biz-services').factory("DeliverService", ["UtilsService", 'toastr', 'LoadingService', function (UtilsService, toastr, LoadingService) {
    return new DeliverService(UtilsService, toastr, LoadingService);
}]);
