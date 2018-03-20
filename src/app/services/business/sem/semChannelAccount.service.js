/**
 * Created by YundanChai on 2017/12/6.
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
    getAccountList(data){
        return this.post('SELECT_ACCOUNT_SEM',data)
    }

    saveAccount(data){
        return this.post('CREATE_ACCOUNT_SEM',data)
    }
}
//【自动提示,自动Loading】 第三步   添加混合类装饰器  根据需要调整
@autotipClass("${error}")
@traits(autoTipMixin, autoloadingMixin)
class SemChannelAccountService extends BaseService {
    constructor(UtilsService, toastr, filter, LoadingService) {
        super();
        this.api = new ApiMethod(UtilsService);
        this.toastr = toastr;
        this.dateFilter = filter('date');
        //【自动提示,自动Loading】 第四步   注入Interface
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);
    }

    //获取所有账户
    @autoloading
    getAccountList(data){
        return this.api.getAccountList(data)
    }
    //保存账户
    @autoloading
    saveAccount(data){
        return this.api.saveAccount(data)
    }

}

angular.module('biz-services').factory("SemChannelAccountService", ["UtilsService", "toastr", "$filter", "LoadingService", function (UtilsService, toastr, $filter, LoadingService) {
    return new SemChannelAccountService(UtilsService, toastr, $filter, LoadingService);
}]);