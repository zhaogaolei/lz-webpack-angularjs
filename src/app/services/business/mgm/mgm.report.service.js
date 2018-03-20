import {BaseApiMethod, BaseService} from '.././business.service';
//【自动提示,自动Loading】 第一步   添加 mixin和decorator 引入
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {
    /*获取券的发放状态*/
    getCouponStatus() {
        return this.get("MGM_DICTIONARY", "coupon_status");
    }

    /*获取结算方式*/
    getSettleType() {
        return this.get("MGM_DICTIONARY", "settle_type");
    }

    /*获取主报表*/
    getMgmReportMain(data) {
        return this.post("MGM_REPORT_MAIN", data);
    }

    /*获取明细报表*/
    getMgmReportDetail(data) {
        return this.post("MGM_REPORT_DETAIL", data);
    }

    /*报表导出*/
    mgmReportExport(data) {
        return this.postBlob("MGM_REPORT_MAINEXPORT", data);
    }

    /*明细报表导出*/
    mgmDetailReportExport(data) {
        return this.postBlob("MGM_REPORT_DETAILEXPORT", data);
    }

    /*奖励发放报表*/
    getMgmAwardReport(data) {
        return this.post("MGM_AWARD_REPORT", data);
    }

    /*手动发放奖励*/
    mgmManualSend(data) {
        return this.post("MGM_MANUAL_SEND", data);
    }

    /*手动批量发放*/
    mgmManualBatchSend(data) {
        return this.post("MGM_BATCH_SETTLE_SEND", data);
    }

    /*活动奖励主表*/
    getMgmSettleReport(data) {
        return this.post("MGM_SETTLE_REPORT", data);
    }

    /*活动奖励明细表*/
    getMgmSettleReportDetail(data) {
        return this.post("MGM_SETTLE_REPORT_DETAIL", data)
    }

}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class MgmReportService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.toastr = toastr;
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getCouponStatus() {
        return this.api.getCouponStatus();
    }

    getSettleType() {
        return this.api.getSettleType();
    }

    getMgmReportMain(data) {
        return this.api.getMgmReportMain(data);
    }

    getMgmReportDetail(data) {
        return this.api.getMgmReportDetail(data);
    }

    mgmReportExport(data) {
        return this.api.mgmReportExport(data);
    }

    /*明细报表导出*/
    mgmDetailReportExport(data) {
        return this.api.mgmDetailReportExport(data);
    }

    @autoloading
    getMgmAwardReport(data) {
        return this.api.getMgmAwardReport(data);
    }

    @autoloading
    mgmManualSend(data) {
        return this.api.mgmManualSend(data);
    }

    @autoloading
    mgmManualBatchSend(data) {
        return this.api.mgmManualBatchSend(data);
    }

    @autoloading
    getMgmSettleReport(data) {
        return this.api.getMgmSettleReport(data);
    }

    @autoloading
    getMgmSettleReportDetail(data) {
        return this.api.getMgmSettleReportDetail(data);
    }
}

angular.module('biz-services').factory("MgmReportService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService, toastr, LoadingService) {
        return new MgmReportService(UtilsService, toastr, LoadingService);
    }]);
