import * as constant from '../../constant';

class BaseApiMethod {
    constructor(utilsService) {
        this.utilsService = utilsService;
    }

    get(name, urlPara = "", data = null, def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.get(url, data).then(
            function (data) {
                var result = data.data;
                if (result && result.code == '200') {
                    return result;
                }
                else {
                    throw result;
                }
            }
        );
    }

    post(name, data = {}, urlPara = "", def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.post(url, data).then(
            (data)=> {
                var result = data.data;
                if (result && result.code == '200') {
                    return result;
                }
                else {
                    throw result;
                }
            }
        );
    }

    delete(name, data = {}, urlPara = "", def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.delete(url, data).then(
            (data)=> {
                var result = data.data;
                if (result && result.code == '200') {
                    return result;
                }
                else if (result && result.code == '400') {// for error info
                    return result;
                }
                else {
                    throw result;
                }
            }
        );
    }

    postBlob(name, data = {}, urlPara = "", def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.postBlob(url, data).then(
            (data)=> {
                return data;

            }
        );
    }

    downLoad(name, data = {}, urlPara = "", def = []) {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.downLoad(url, data).then(
            (data)=> {
                return data;

            }
        );
    }

    query(name, data, urlPara = "", def = [], method = "post") {
        let util = this.utilsService;
        var url = util.getIp() + constant[name] + urlPara;
        return util.query(url, data, method).then(
            (data)=> {
                var result = data.data;
                if (result && result.code == '200') {
                    return result.result;
                }
                else {
                    throw result;
                }
            }
        );
    }

}

class BaseService {
    constructor(utilsService, uploadService) {
        this.utilsService = utilsService;
        this.uploadService = uploadService;
    }


    /**
     * 文件上传
     * */
    upload(name, data = {}, urlPara = "", def = []) {
        // let util = this.utilsService;
        let uploadService = this.uploadService;
        return uploadService.UpLoadFile(constant[name], data).then(
            (data)=> {
                if (data && data.code == '200') {
                    return data;
                }
                else {
                    throw data;
                }
            }
        );
    }
}

export {BaseApiMethod, BaseService};