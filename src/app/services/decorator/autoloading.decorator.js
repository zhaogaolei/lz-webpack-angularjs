function autoloading(target, name, descriptor) {
    let oldValue = descriptor.value;
    descriptor.value = function () {
        let _this = this;

        let oldValueResult = oldValue.apply(_this, arguments);
        if (oldValueResult && typeof(oldValueResult.then) == "function" && typeof(oldValueResult.catch) == "function") {
            if (_this.showLoading) {
                _this.showLoading();
            }
            return oldValueResult.then(function (data) {
                if (_this.hideLoading) {
                    _this.hideLoading();
                }
                return data;
            }).catch(function (error) {
                if (_this.hideLoading) {
                    _this.hideLoading();
                }
                throw error;
            });
        }
        else {
            return oldValueResult;
        }

    };
    return descriptor;
}


module.exports = autoloading;