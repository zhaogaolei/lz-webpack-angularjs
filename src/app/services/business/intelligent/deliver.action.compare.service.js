/**
 * Created by leizhao on 17/8/11.
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

    /*获取投放对比列表*/
    getCompareList(params) {
        return this.get("GET_COMPARE_LIST", params);
    }

    /*获取渠道集合*/
    getRefferalList() {
        return this.get("GET_REFFERAL_LIST");
    }

    /*获取投放计划*/
    getDeliverPlanList() {
        return this.get("GET_DELIVER_PLAN_LIST");
    }

    /*获取投放动作*/
    getDeliverActionList(data) {
        return this.post("GET_DELIVER_ACTION_LIST", data);
    }

    /*投放对比初始化接口*/
    compareInit() {
        return this.post("COMPARE_INIT");
    }

    /*投放对比*/
    AddCompare(data) {
        return this.post("ABT_COMPARE", data);
    }

    /*获取最后选择的评分规则*/
    GetAbtLastOption() {
        return this.get("GET_ABT_LASTOPTION");
    }

}

//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class DaCompareService extends BaseService {
    constructor(UtilsService, toastr, filter, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.toastr = toastr;
        this.dateFilter = filter('date');
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getCompareList(params) {
        return this.api.getCompareList(params);
    }

    getRefferalList() {
        return this.api.getRefferalList();
    }

    getDeliverPlanList() {
        return this.api.getDeliverPlanList();
    }

    getDeliverActionList(data) {
        return this.api.getDeliverActionList(data);
    }
    @autoloading
    compareInit() {
        return this.api.compareInit();
    }

    @autoloading
    AddCompare(data) {
        return this.api.AddCompare(data);
    }

    GetAbtLastOption() {
        return this.api.GetAbtLastOption();
    }

    /**
     * 时间校验：开始时间，结束时间
     * 金额校验：大于等于〇的数字
     * */
    dataValid(formData) {
        /*日期校验*/
        if (formData.starDate && formData.endDate) {
            let start = new Date(this.dateFilter(formData.starDate, 'yyyy-MM-dd'));
            let end = new Date(this.dateFilter(formData.endDate, 'yyyy-MM-dd'));
            if (end < start) {
                this.toastr.error("结束时间必须大于等于开始时间！");
                return false;
            }
        }
        /*金额校验*/
        //正数正则表达式
        let numberRegex = /^\d+(?=\.{0,1}\d+$|$)/;
        if (formData.registerBestValue) {
            if (!numberRegex.test(formData.registerBestValue)) {
                this.toastr.error("请输入正确的理想值！");
                return false;
            }
        }
        if (formData.investBestValue) {
            if (!numberRegex.test(formData.investBestValue)) {
                this.toastr.error("请输入正确的理想值！");
                return false;
            }
        }
        return true;
    };
}

angular.module('biz-services').factory("DaCompareService", ["UtilsService", "toastr", "$filter", "LoadingService", function (UtilsService, toastr, $filter, LoadingService) {
    return new DaCompareService(UtilsService, toastr, $filter, LoadingService);
}]);
