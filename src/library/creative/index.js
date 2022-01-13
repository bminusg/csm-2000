"use strict";

import getURIparams from "./modules/getURIparams";

class Creative {
  constructor(options = {}) {
    this.format =
      typeof options.format === "object" ? options.format : undefined;
    this.brand = typeof options.brand === "object" ? options.brand : undefined;
    this.campaign =
      typeof options.campaign === "object" ? options.campaign : undefined;
    this.version = typeof options.version === "number" ? options.version : null;
    this.container =
      typeof options.container === "object"
        ? options.container
        : document.querySelector(".creative");
    this.slug = typeof options.slug === "string" ? options.slug : undefined;

    // TRACKING
    this.params = getURIparams();
    this.clicktags = options.clicktags || [];

    // FEATURES
    this.features = options.features || [];

    // DEFINE EVENTS
    this.defineEvents();

    // INIT CREATIVE
    window.addEventListener("DOMContentLoaded", this.init());
  }

  // INIT CREATIVE
  init() {
    // APPEND TO WINDOW OBJECT
    window.Creative = this;

    // VALIDATE
    this.validate();

    // TRACKING
    this.track();

    // BRING FRAMEID TO FEATURES
    this.features.forEach((feat) => (feat.frameID = this.slug));

    // INIT CROSS SITE COMMUNICATION
    const CS = this.features.find((feat) => feat.name === "CrossSite");
    if (CS)
      return CS.load({
        groupID: this.campaign.slug,
        frameID: this.slug,
      });

    // START ANIMATION
    window.addEventListener("load", this.startAnimation());
  }

  // VALIDATE CREATIVE
  validate() {
    // VALIDATE META SETUP Format
    if (!this.format) throw new Error("No format defined");

    // VALIDATE CONTAINER
    const defaultContainer = document.querySelector(".creative");
    if (!this.container && defaultContainer) this.container = defaultContainer;
    if (!this.container) throw new Error("No creative <div> container defined");

    // VALIDATE PRELOADER
    if (!document.querySelector(".creative--preloader")) {
      const div = document.createElement("div");
      div.classList.add("creative--preloader");
      this.container.appendChild(div);
    }

    // VALIDATE CREATIVE CLASSNAME
    const creativeClassName = "creative--" + this.format.slug;
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
      // SETTING GLOBAL ACTIVE VAR
      this.container.classList.add("is--tweening");

      // INIT FEATURES
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
