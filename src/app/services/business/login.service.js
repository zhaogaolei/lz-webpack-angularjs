/**
 * Created by leiz on 2018/3/16 14:41.
 */
import {BaseApiMethod, BaseService} from './business.service';
import autotipMixin from '../mixin/autotip.mixin';
import autotip from '../decorator/autotip.decorator';
import autotipClass from '../decorator/autotipClass.decorator'
import autoloadingMixin from '../mixin/autoloading.mixin';
import autoloading from '../decorator/autoloading.decorator';
import {traits} from 'traits-decorator';


class ApiMethod extends BaseApiMethod {
    //login
    login(data) {
        return this.post("LOGIN_AUTH", data);
    }
}

@autotipClass("${error}")
@traits(autotipMixin, autoloadingMixin)
class LoginService extends BaseService {
    constructor(UtilsService, toastr, LoadingService) {
        super(UtilsService);
        this.api = new ApiMethod(UtilsService);
        this.setAutoTipMinxinInterface(toastr);
        this.setLoadingMinxinInterface(LoadingService);

    }

    @autoloading
    login(data) {
        return this.api.login(data);
    }
}

angular.module('biz-services').factory("LoginService", ["UtilsService", "toastr", "LoadingService", function (UtilsService, toastr, LoadingService) {
    return new LoginService(UtilsService, toastr, LoadingService);
}]);
