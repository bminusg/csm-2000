class Expand {
  constructor(options = {}) {
    this.frameID = options.frameID;
    this.listenerElement =
      options.listenerElement || document.querySelector("body");

    // COLLAPSE OPTIONS
    this.collapseWidth =
      options.collapseWidth || this.listenerElement.clientWidth + "px";
    this.collapseHeight =
      options.collapseHeight || this.listenerElement.offsetHeight + "px";
    this.collapseTrigger = options.collapseTrigger || "mouseout";

    // EXPAND OPTIONS
    this.expandedWidth = options.expandedWidth || this.collapseWidth;
    this.expandedHeight = options.expandedHeight || "85%";
    this.expandTrigger = options.expandTrigger || "mouseover";
  }

  init() {
    this.listenerElement.addEventListener(this.expandTrigger, (event) => {
      event.preventDefault();
      this.expandAd();
    });

    this.listenerElement.addEventListener(this.collapseTrigger, (event) => {
      event.preventDefault();
      this.collapseAd();
    });
  }

  expandAd() {
    window.top.postMessage(
      "expandAd:;:" +
        this.frameID +
        ":;:" +
        this.expandedWidth +
        ":;:" +
        this.expandedHeight,
      "*"
    );
  }

  collapseAd() {
    const expandedDirection = null;
    const clipValue = null;

    window.top.postMessage(
      "contractAd:;:" +
        this.frameID +
        ":;:" +
        this.expandedWidth +
        ":;:" +
        this.expandedHeight +
        ":;:" +
        expandedDirection +
        ":;:" +
        clipValue,
      "*"
    );
  }
}

export default Expand;
