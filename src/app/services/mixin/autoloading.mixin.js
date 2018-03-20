export default class showloadingMixin {


    setLoadingMinxinInterface(showLoadingInterface) {
        this.showLoadingInterface = showLoadingInterface;
    }

    showLoading() {
        this.showLoadingInterface.showLoading();
    }

    hideLoading() {
        this.showLoadingInterface.hideLoading();
    }
}