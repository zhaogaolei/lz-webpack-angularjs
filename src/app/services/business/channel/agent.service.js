/**
 * Created by yunxiaoxie on 17/4/26.
 * 代理商 sevice
 */
import autotipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

import {BaseApiMethod, BaseService} from '../business.service';
class ApiMethod extends BaseApiMethod {

    //查询agent by pagination
    queryPaginationList(paginArg) {
        return this.post("GET_AGENT_PANINATION", paginArg);
    }

    //查询渠道状态
    getChannelStatus() {
        return this.get("GET_CHANNEL_STATUS");
    }

    /*get open interface*/
    queryOpenInterface() {
        return this.get('OPEN_API');
    }

    /*get agent by id*/
    getAgentById(id) {
        return this.get('GET_AGENT', id);
    }

    saveAgent(json) {
        return this.post('SAVE_AGENT', json);
    }

    // get all channels of agent
    getChannelPaginationByAgentId(json) {
        return this.post('GET_AGENT_CHANNEL', json);
    }

    //查询所有渠道
    getAllChannel(data) {
        return this.get('GET_ALL_REFFERAL','?range='+data);
    }

    //查询所有单渠道和代理商数据，仅用于数据搜索
    getAllChannelAgent() {
        return this.get('GET_ALL_REFFERAL_AGENT');
    }

    /*添加单个渠道*/
    addAgentChannel(json) {
        return this.post('ADD_AGENT_CHANNEL', json);
    }

    /*delete agent channel*/
    delAgentChannel(id) {
        return this.get('DEL_AGENT_CHANNEL', id);
    }

    //查询所有代理商
    getAllAgent() {
        return this.get('GET_AGENT_ALL');
    }

    /*渠道*/
    getChannelByAngentID(id) {
        return this.get('GET_CHNNEL_BY_AGENT', id);
    }
}

@autotipClass("${error}")
@traits(autotipMixin, autoloadingMixin)
class AgentService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService)
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    queryPaginationList(arg) {
        return this.api.queryPaginationList(arg);
    }

    getChannelStatus() {
        return this.api.getChannelStatus();
    }

    queryOpenInterface() {
        return this.api.queryOpenInterface();
    }

    getAgentById(id) {
        return this.api.getAgentById(id);
    }

    saveAgent(json) {
        return this.api.saveAgent(json);
    }

    getChannelPaginationByAgentId(json) {
        return this.api.getChannelPaginationByAgentId(json);
    }

    getAllChannel(data) {
        return this.api.getAllChannel(data);
    }

    getAllChannelAgent() {
        return this.api.getAllChannelAgent();
    }

    addAgentChannel(json) {
        return this.api.addAgentChannel(json);
    }

    delAgentChannel(id) {
        return this.api.delAgentChannel(id);
    }

    getAllAgent() {
        return this.api.getAllAgent();
    }

    getChannelByAngentID(id) {
        return this.api.getChannelByAngentID(id);
    }
}

angular.module('biz-services').factory("AgentService", ["UtilsService", 'toastr', 'LoadingService', function (UtilsService, toastr, LoadingService) {
    return new AgentService(UtilsService, toastr, LoadingService);
}]);
