import getURIparams from "./modules/getURIparams";
import LocalConnection from "lib/vendor/localConnection";

class Creative {
  constructor(options = {}) {
    // META SETUP
    this.format = options.format || "";
    this.publisher = options.publisher || "";
    this.size = {
      width: options.size ? options.size.width : 0,
      height: options.size ? options.size.height : 0,
    };
    this.adServer = options.adServer || "";
    this.brand = options.brand || "";
    this.campaign = options.campaign || "";
    this.version = options.version || 1;
    this.container = options.container || document.querySelector(".creative");
    this.slug = options.slug || "";

    // TRACKING
    this.params = getURIparams();
    this.clicktags = options.clicktags || [];

    // LOCAL CONNECTION
    this.LocalConnect = options.LocalConnect || [];
    this.connected = false;

    // FEATURES
    this.features = options.features || [];

    // DEFINE EVENTS
    this.defineEvents();

    // INIT CREATIVE
    this.init();
  }

  // INIT CREATIVE
  init() {
    // VALIDATE
    this.validate();

    // TRACKING
    this.track();

    // LOCAL CONNECTION
    if (this.LocalConnect.length > 0) return this.initLC();

    // START ANIMATION
    window.addEventListener("load", this.startAnimation());
  }

  // INIT LOCAL CONNECTION
  initLC() {
    const self = this;
    new LocalConnection({
      key: this.campaign,
      name: this.slug,
      frames: this.LocalConnect,
      onConnect() {
        const d = new Date();
        const h = d.getHours();
        const m = d.getMinutes();
        const s = d.getSeconds();
        const ms = d.getMilliseconds();
        console.log(
          "%cCSM-2000" + " CONNECTED ON: " + h + ":" + m + ":" + s + ":" + ms,
          "color: #80ffdbff;"
        );
        self.startAnimation();
      },
      timeout: 3,
      onTimeout() {
        const d = new Date();
        const h = d.getHours();
        const m = d.getMinutes();
        const s = d.getSeconds();
        const ms = d.getMilliseconds();
        console.log(
          "%cCSM-2000%c TIMEOUT ON: " + h + ":" + m + ":" + s + ":" + ms,
          "color: #80ffdbff;"
        );
        self.startAnimation({
          connected: false,
        });
      },
    });
  }

  // VALIDATE CREATIVE
  validate() {
    // VALIDATE META SETUP Format
    if (!this.format) throw new Error("No format defined");

    // VALIDATE CONTAINER
    const defaultContainer = document.querySelector(".creative");
    if (!this.container && defaultContainer) this.container = defaultContainer;
    if (!this.container) throw new Error("No creative <div> container defined");

    // VALIDATE CREATIVE CLASSNAME
    const creativeClassName = "creative--" + this.format;
    if (this.container.className.indexOf(creativeClassName) === -1)
      this.container.classList.add(creativeClassName);

    // VALIDATE TRACKING
    if (!document.querySelector("a"))
      throw new Error("Can't find any anchor tag");
  }

  // TRACKING CONFIGURATION
  track() {
    // GET PARAM CLICKTAGS
    const clicktags = [];
    for (const param in this.params) {
      if (param.indexOf("clicktag") === -1) continue;
      clicktags.push(this.params[param]);
    }

    // PARAM CLICKTAGS OVERWRITE INLINE CLICKTAGS
    if (clicktags.length > 0) this.clicktags = clicktags;

    // PARSE ANCHOR TAGS
    const anchors = document.querySelectorAll("a");
    anchors.forEach((anchor, idx) => {
      anchor.setAttribute("href", this.clicktags[idx]);
      anchor.setAttribute("target", "_blank");
    });
  }

  // EVENT BUILDER
  defineEvents() {
    // START ANIMATION EVENT
    this.container.addEventListener("startAnimation", (event) => {
      this.container.classList.add("creative--active");

      this.features.forEach((feature) => {
        if (typeof feature.init === "function") feature.init();
      });
    });
  }

  // START ANIMATION
  startAnimation(options) {
    const event = new CustomEvent("startAnimation", { detail: options });
    this.container.dispatchEvent(event);
  }
}

export default Creative;
