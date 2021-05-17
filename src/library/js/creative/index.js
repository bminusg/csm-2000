import umlauts from "../utils/umlauts";
import getURIparams from "../utils/getURIparams";
import LocalConnection from "lib/js/vendor/LocalConnection";

class Creative {
  constructor(options) {
    // META SETUP
    this.format = options.format || "";
    this.publisher = options.publisher || "default";
    this.size = {
      width: options.size ? options.size.width : 0,
      height: options.size ? options.size.height : 0,
    };
    this.brand = options.brand || "";
    this.campaign = options.campaign || "";
    this.version = options.version || 1;
    this.params = getURIparams();
    this.slug = `${umlauts(this.brand)}_${umlauts(this.campaign)}_${umlauts(
      this.format
    )}_${umlauts(this.publisher)}_${this.version.toString().padStart(2, "0")}`;

    // LOCAL CONNECTION
    this.key = options.key || `${this.brand}_${this.campaign}`;
    this.frames = options.frames || [];
    this.crossSite = options.crossSite || false;
    this.connected = false;

    // FEATURES
    this.features = {};
  }

  // INIT CREATIVE
  init() {
    // TRACKING
    this.track();

    // VALIDATE
    this.validate();

    // CONNECT TO OTHER FRAMES
    if (this.crossSite && !this.connected) return this.initLC();

    // START ANIMATION
    this.startAnimation();
  }

  // INIT LOCAL CONNECTION
  initLC() {
    const self = this;
    this.features.LocalConnection = new LocalConnection({
      key: this.key,
      name: this.slug,
      frames: this.frames,
      onConnect() {
        const d = new Date();
        const h = d.getHours();
        const m = d.getMinutes();
        const s = d.getSeconds();
        const ms = d.getMilliseconds();
        console.warn("CONNECTED ON: " + h + ":" + m + ":" + s + ":" + ms);
        self.startAnimation();
      },
      timeout: 3,
      onTimeout() {
        console.warn("Local Connection TIMEOUT");
        self.startAnimation();
      },
    });
  }

  // VALIDATE CREATIVE
  validate() {
    // VALIDATE TRACKING
    if (!this.params.clicktag) console.warn("No clicktag defined");

    // VALIDATE LOCAL CONNECTION
    // IS FRAMES and KEY GIVEN?
  }

  // TRACKING CONFIGURATION
  track() {
    // DEFINE CLICKOUTS
    // BETTER BE PREPARED FOR MULTIPLE CLICKOUT --> loop through params and connect param:clicktag2 to element:(".creative--clicktag-2")
    const clickoutElem = document.querySelector(".creative--clicktag");
    console.log(document);
    //clickoutElem.setAttribute("href", this.params.clicktag);
  }

  // START ANIMATION
  startAnimation() {
    const adElem = document.querySelector(".creative");
    adElem.classList.add("creative--active");
  }
}

export default Creative;
