/**
 * Created by leizhao on 17/8/11.
 * job sevice
 */
import {BaseApiMethod, BaseService} from './job.business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {

    /*获取job列表*/
    getJobList() {
        return this.get("GET_JOB_LIST");
    }

    getJobByGroupName(jobGroup, jobName) {
        let urlParams = `/${jobGroup}/${jobName}`;
        return this.get("GET_JOB_BY_GROUPNAME", urlParams)
    }

    /*保存 job*/
    jobSave(data) {
        return this.post("JOB_SAVE", data);
    }

    /*编辑 job*/
    jobUpdate(data) {
        return this.post("JOB_UPDATE", data)
    }

    /*立即执行Job*/
    jobExecute(jobGroup, jobName) {
        let urlParams = `/${jobGroup}/${jobName}`;
        return this.get("JOB_EXECUTE", urlParams);
    }

    /*启动Job*/
    jobStart(jobGroup, jobName) {
        let urlParams = `/${jobGroup}/${jobName}`;
        return this.get("JOB_START", urlParams);
    }

    /*暂停Job*/
    jobPause(jobGroup, jobName) {
        let urlParams = `/${jobGroup}/${jobName}`;
        return this.get("JOB_PAUSE", urlParams);
    }

    /*删除Job*/
    jobDelete(jobGroup, jobName) {
        let urlParams = `/${jobGroup}/${jobName}`;
        return this.get("JOB_DELETE", urlParams);
    }

    /*查询job执行历史*/
    getJobHistory(data) {
        return this.post("VIEW_JOB_HISTORY", data);
    }

    /*查询job异常信息*/
    getJobError(data) {
        return this.post("VIEW_JOB_ERROR", data);
    }


}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class JobService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getJobList() {
        return this.api.getJobList();
    }

    getJobByGroupName(jobGroup, jobName) {
        return this.api.getJobByGroupName(jobGroup, jobName);
    }

    @autoloading
    jobSave(optType, data) {
        if (optType === "add") {
            return this.api.jobSave(data);
        } else {
            return this.api.jobUpdate(data);
        }
    }

    @autoloading
    jobExecute(jobGroup, jobName) {
        return this.api.jobExecute(jobGroup, jobName);
    }

    @autoloading
    jobStart(jobGroup, jobName) {
        return this.api.jobStart(jobGroup, jobName);
    }

    @autoloading
    jobPause(jobGroup, jobName) {
        return this.api.jobPause(jobGroup, jobName);
    }

    @autoloading
    jobDelete(jobGroup, jobName) {
        return this.api.jobDelete(jobGroup, jobName);
    }

    @autoloading
    getJobHistory(data) {
        return this.api.getJobHistory(data);
    }

    @autoloading
    getJobError(data) {
        return this.api.getJobError(data);
    }
}

angular.module('biz-services').factory("JobService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new JobService(UtilsService, toastr, LoadingService);
}]);
