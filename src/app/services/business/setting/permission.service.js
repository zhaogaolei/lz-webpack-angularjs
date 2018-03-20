/**
 * Created by yunxiaoxie on 17/4/25.
 * 主数据 sevice
 */
import {BaseApiMethod, BaseService} from '../business.service';
class ApiMethod extends BaseApiMethod {

    //查询maindata by pagination
    queryPaginationList(paginArg) {
        return this.post("POST_PERMISSION_LIST", paginArg);
    }

    //查询角色
    getRoles() {
        return this.get("GET_ROLE_LIST");
    }

    //授权
    setPermission(json) {
        return this.post("POST_PERMISSION", json);
    }
}


class PermissionService extends BaseService {
    constructor(UtilsService, toastr) {
        super();
        this.api = new ApiMethod(UtilsService, toastr);
    }

    queryPaginationList(arg) {
        return this.api.queryPaginationList(arg);
    }

    getRoles() {
        return this.api.getRoles();
    }

    setPermission(json) {
        return this.api.setPermission(json);
    }
}

angular.module('biz-services').factory("PermissionService", ["UtilsService", 'toastr', function (UtilsService, toastr) {
    return new PermissionService(UtilsService, toastr);
}]);
