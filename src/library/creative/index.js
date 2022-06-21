"use strict";

import getURIparams from "./modules/getURIparams";

class Creative {
  constructor(options = {}) {
    // META DATA
    this.id = options.id || undefined;
    this.caption = options.caption || undefined;
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
    this.macros = {};
    this.params = getURIparams();
    this.clicktags = options.clicktags || [];

    // FEATURES
    this.features = options.features || [];

    // DEFINE EVENTS
    this.visibilityListener = options.visibilityListener || false;
    this.defineEvents();

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
    const CSC = this.features.find(
      (feat) => feat.name === "CrossSiteConnection"
    );

    if (CSC) return CSC.load();

    // PREVENT DEFAULT ANIMATION INIT
    if (this.visibilityListener) return;

    // START ANIMATION
    this.startAnimation();
  }

  // VALIDATE CREATIVE
  validate() {
    // VALIDATE META SETUP Format
    if (!this.format) throw new Error("No format defined");

    // DECODE CAPTION
    if (this.caption) {
      this.caption = Array.isArray(this.caption)
        ? this.decodeURIs(this.caption)
        : Array(decodeURIComponent(this.caption));
    }

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
    if (!document.querySelector("a")) throw new Error("Can't find anchor tag");
  }

  decodeURIs(URIs = []) {
    URIs = URIs.map((URI) => decodeURIComponent(URI));
    return URIs;
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
    const anchorTag = document.querySelector("a");
    const anchors = document.querySelectorAll(".creative--clicktag");

    // INIT CAPTION
    if (this.caption) anchorTag.setAttribute("href", this.caption[0]);

    anchors.forEach((anchor, idx) => {
      // REINIT CAPTION ON MOUSEOVER
      anchor.addEventListener(
        "mouseover",
        (event) => {
          event.preventDefault();

          if (!this.caption) return;

          let caption = anchor.dataset.caption
            ? this.caption[anchor.dataset.caption]
            : this.caption[idx];

          if (!caption) caption = this.caption[0];

          anchorTag.setAttribute("href", caption);
        },
        true
      );

      // SET CLICKTAG ON MOUSEDOWN
      anchor.addEventListener(
        "mousedown",
        (event) => {
          event.preventDefault();

          let clicktag = anchor.dataset.clicktag
            ? this.clicktags[anchor.dataset.clicktag]
            : this.clicktags[idx];
          if (!clicktag) clicktag = this.clicktags[0];

          anchorTag.setAttribute("href", clicktag);
          anchorTag.setAttribute("target", "_blank");
        },
        true
      );
    });
  }

  // RUN ANIMATION IF IT'S VISIBLE
  checkVisibility(value) {
    value = parseFloat(value);
    if (this.container.classList.contains("is--tweening") || value !== 1)
      return;

    this.startAnimation();
  }

  // ADDING EVENT LISTENERS
  defineEvents() {
    // MESSAGE LISTENERS
    window.addEventListener("message", (event) => {
      const data = event.data;
      const dataStringValuePair =
        typeof data === "string" ? data.split("=") : [];

      if (dataStringValuePair[0] === "isVisible")
        this.checkVisibility(dataStringValuePair[1]);
    });

    // START ANIMATION EVENT
    this.container.addEventListener("startAnimation", () => {
      // SWITCH isTWEENING
      this.isTweening = true;

      // SETTING CLASS INSTEAD TO RUN CSS ANIMATIONS
      this.container.classList.add("is--tweening");

      // INIT FEATURES
      this.features.forEach((feature) => {
        if (typeof feature.init === "function") feature.init();
      });
    });

    // RESET ANIMATION EVENT
    this.container.addEventListener("resetAnimation", () => {
      this.container.classList.remove("is--tweening");
    });
  }

  // START ANIMATION
  startAnimation(options) {
    const event = new CustomEvent("startAnimation", { detail: options });
    this.container.dispatchEvent(event);
  }
}

export default Creative;
