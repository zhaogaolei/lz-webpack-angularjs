function autotip(tip) {

    return function autotip(target, name, descriptor) {
        let oldValue = descriptor.value;
        descriptor.value = function () {
            var _this = this;
            var oldValueResult = oldValue.apply(_this, arguments);
            if (oldValueResult && typeof(oldValueResult.catch) == "function") {
                return oldValueResult.catch(function (error) {
                    let errorTip = "", _tip = null;
                    let getError = ()=> {
                        //console.log(JSON.stringify(error));
                        if (error.data && error.data.message) {
                            return error.data.message;
                        } else if (error.status) {
                            return error.message;
                        } else if (error.msg) {
                            return error.msg;
                        }
                        else {
                            return JSON.stringify(error);
                        }

                    }
                    if (tip) {
                        //占位符替换
                        if (tip.indexOf("${error}") != -1) {
                            let tipReplace = getError();
                            _tip = tip.replace("${error}", tipReplace);
                        }
                    }

                    if (_this.errorTip) {
                        _this.errorTip(_tip || getError());
                    }
                    return null;
                });
            }
            else {
                return oldValueResult;
            }
        };

        return descriptor;
    }
}


module.exports = autotip;