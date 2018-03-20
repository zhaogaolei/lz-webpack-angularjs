/**
 * Created by leizhao on 17/11/01.
 */
import {BaseApiMethod, BaseService} from '../business.service';
import autoTipMixin from '../../mixin/autotip.mixin';
import autotip from '../../decorator/autotip.decorator';
import autotipClass from '../../decorator/autotipClass.decorator'
import autoloadingMixin from '../../mixin/autoloading.mixin';
import autoloading from '../../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';

class ApiMethod extends BaseApiMethod {

    /*获取渠道*/
    getPeopleRefferalList() {
        return this.get("PEOPLE_GET_REFFERAL_LIST");
    }

    /*获取字典*/
    getPeopleDic() {
        return this.get("PEOPLE_GET_DIC");
    }

    /*数据字典 操作符*/
    getPeopleOperate(data) {
        let params = `/${data.dataType}`;
        return this.get("PEOPLE_GET_OPERATE", params);
    }

    /*抱团类型*/
    getPeopleInvestType() {
        return this.get("GET_INVEST_TYPE");
    }

    /*数据查询*/
    getPeopleAnalyzeData(data) {
        return this.post("PEOPLE_GET_ANALYZE_DATA", data);
    }

}

@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class OtherCompareService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    getPeopleRefferalList() {
        return this.api.getPeopleRefferalList();
    }

    getPeopleDic() {
        return this.api.getPeopleDic();
    }

    getPeopleOperate(data) {
        return this.api.getPeopleOperate(data)
    }

    getPeopleInvestType() {
        return this.api.getPeopleInvestType();
    }

    getPeopleAnalyzeData(data) {
        return this.api.getPeopleAnalyzeData(data);
    }
}

angular.module('biz-services').factory("OtherCompareService", ["UtilsService", "toastr", "LoadingService",
    function (UtilsService, toastr, LoadingService) {
        return new OtherCompareService(UtilsService, toastr, LoadingService);
    }]);
