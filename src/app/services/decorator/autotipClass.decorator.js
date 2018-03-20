/**
 * Created by chengshuailiu on 17/5/5.
 */
import autotip from './autotip.decorator';


function autotipClass(tip) {
    return function (target) {
        var methods = Object.getOwnPropertyNames(target.prototype);
        methods.map((item)=> {
            var foo = target;
            var _temp;
            _temp = autotip(tip)(foo.prototype, item, Object.getOwnPropertyDescriptor(foo.prototype, item)) || _temp;
            if (_temp) Object.defineProperty(foo.prototype, item, _temp);
        });
    }
}

module.exports = autotipClass;
