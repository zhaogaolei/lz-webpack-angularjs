/**
 * Created by leizhao on 17/12/4.
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

    /*获取SEM渠道和账户*/
    getSemRefferalAccount() {
        return this.post("GET_SEM_REFFERAL_ACCOUNT");
    }

    /*获取主报表*/
    getSemReportMain(data) {
        return this.post("GET_SEM_REPORT_MAIN", data);
    }

    /*获取明细报表*/
    getSemReportDetail(data) {
        return this.post("GET_SEM_REPORT_DETAIL", data);
    }

    /*报表导出*/
    semReportExport(data) {
        return this.postBlob("SEM_REPORT_EXPORT", data);
    }
}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class SemReportService extends BaseService {
    constructor(UtilsService, toastr, filter, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.toastr = toastr;
        this.dateFilter = filter('date');
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getSemRefferalAccount() {
        return this.api.getSemRefferalAccount();
    }

    @autoloading
    getSemReportMain(data) {
        return this.api.getSemReportMain(data);
    }

    @autoloading
    getSemReportDetail(data) {
        return this.api.getSemReportDetail(data);
    }

    @autoloading
    semReportExport(data) {
        return this.api.semReportExport(data);
    }
}

angular.module('biz-services').factory("SemReportService", ["UtilsService", "toastr", "$filter", "LoadingService", function (UtilsService, toastr, $filter, LoadingService) {
    return new SemReportService(UtilsService, toastr, $filter, LoadingService);
}]);
