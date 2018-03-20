/**
 * Created by leizhao on 17/12/20.
 */
import {BaseApiMethod, BaseService} from '../business.service';
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {
    /*报表导出*/
    activityDataExport() {
        return this.postBlob("ACTIVITY_DATA_EXPORT", null);
    }

    /*根据pageId导出*/
    activityDataExportByPageId(data) {
        return this.postBlob("ACTIVITY_DATA_EXPORT_BY_PAGEID", data)
    }
}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class ActivityDataService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.toastr = toastr;
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    @autoloading
    activityDataExport() {
        return this.api.activityDataExport();
    }

    @autoloading
    activityDataExportByPageId(data) {
        return this.api.activityDataExportByPageId(data);
    }
}

angular.module('biz-services').factory("ActivityDataService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService, toastr, LoadingService) {
        return new ActivityDataService(UtilsService, toastr, LoadingService);
    }]);
