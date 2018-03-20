export default class autotipMixin {


    setAutoTipMinxinInterface(toastr) {
        this.toastr = toastr;
    }

    errorTip(msg) {
        this.toastr.warning(msg);
    }
}