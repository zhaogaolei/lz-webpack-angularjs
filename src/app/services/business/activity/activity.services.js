/**
 * Created by leiz on 2017/4/21.
 */
import autotipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';
import {BaseApiMethod, BaseService} from '../business.service';
class ApiMethod extends BaseApiMethod {
    /*获取活动类型*/
    getActivityType() {
        return this.get("GET_ACTIVITY_TYPE");
    }

    /*获取活动状态*/
    getActivityStatus() {
        return this.get("GET_ACTIVITY_STATUS");
    }

    /*获取活动列表*/
    getActivityList(data) {
        return this.post("GET_ACTIVITY_LIST", data);
    }

    /*获取单条活动信息*/
    getActivityInfoById(id) {
        return this.post("GET_ACTIVITY_BY_ID", null, id)
    }

    /*发布 / 取消发布 */
    onOrOffLine(data) {
        return this.post("UPDATE_ACTIVITY_STATUS", data);
    };

    /*删除活动*/
    deleteActivity(id) {
        return this.post("DELETE_ACTIVITY_BY_ID", null, id);
    };

    /*保存活动*/
    saveActivity(data) {
        return this.post("SAVE_ACTIVITY", data);
    }

    /*获取操作记录*/
    getActivityHistory(data) {
        return this.post("GET_ACTIVITY_HISTORY_BY_ID",data);
    }

    hdDownLoad(json){
        return this.postBlob("DOWNLOAD", json);
    }
}

@autotipClass("${error}")
@traits(autotipMixin, autoloadingMixin)
class ActivityService extends BaseService {
    constructor(UtilsService, toastr, filter, UpLoadService,LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.service = new BaseService(UtilsService, UpLoadService);
        this.toastr = toastr;
        this.dateFilter = filter('date');
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getActivityType() {
        return this.api.getActivityType();
    }

    getActivityStatus() {
        return this.api.getActivityStatus();
    }

    getActivityList(data) {
        return this.api.getActivityList(data);
    }

    onOrOffLine(data) {
        return this.api.onOrOffLine(data);
    }

    deleteActivity(id) {
        return this.api.deleteActivity(id);
    };

    //DOWNLOAD
    hdDownloadFile(id) {
        return this.api.hdDownLoad(id);
    }

    getActivityInfoById(id) {
        return this.api.getActivityInfoById(id)
            .then(function (data) {
                return data;
            })
            .catch(function () {
            });
    }
    @autoloading
    saveActivity(data) {
        return this.service.upload("SAVE_ACTIVITY", data);//this.service.saveActivityWithFile(data);
        //return this.api.saveActivity(data);
    }

    /*时间校验：上线时间，下线时间*/
    dateTimeValid(startTime, endTime) {
        //上线时间只能是当前时间或大于当前时间，结束时间只能大于等于开始时间
        let curDate = new Date();
        curDate.setHours(0);
        curDate.setMinutes(0);
        curDate.setSeconds(0);
        // if (startTime) {
        //     var start = new Date(this.dateFilter(startTime, 'yyyy-MM-dd'));
        //     if (start < curDate) {
        //         this.toastr.error("上线时间必须大于等于当前时间！")
        //         return false;
        //     }
        // }
        let start = new Date(this.dateFilter(startTime, 'yyyy-MM-dd'));
        if (endTime) {
            var end = new Date(this.dateFilter(endTime, 'yyyy-MM-dd'));
            if (end <= start) {
                this.toastr.error("下线时间必须大于上线时间！");
                return false;
            }
        }
        return true;
    };

    getActivityHistory(data) {
        return this.api.getActivityHistory(data);
    }
}

angular.module('biz-services')
    .factory("ActivityService", ["UtilsService", "toastr", "$filter", "UpLoadService","LoadingService", function (UtilsService, toastr, $filter, UpLoadService,LoadingService) {
        return new ActivityService(UtilsService, toastr, $filter, UpLoadService,LoadingService);
    }]);
