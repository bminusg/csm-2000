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

    // STATES
    this.isTweening = false;

    // TRACKING
    this.preventDefaultClicktracking =
      options.preventDefaultClicktracking || false;
    this.macros = {};
    this.params = getURIparams();
    this.clicktags = options.clicktags || [];
    this.impressions = options.impressions || {};

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

    // PREVENT DEFAULT LOAD BY FEATURE
    const preventDefaultLoad = this.features.find((feat) => feat.load);
    if (preventDefaultLoad) return preventDefaultLoad.load(this);

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

    // PREVENT DEFAULT CLICKTRACKING
    if (this.preventDefaultClicktracking)
      return anchorTag.removeAttribute("href");

    // INIT CAPTION
    if (this.caption) anchorTag.setAttribute("href", this.caption[0]);

    anchors.forEach((anchor, idx) => {
      // REINIT CAPTION ON MOUSEOVER
      anchor.addEventListener(
        "mouseover",
        (event) => {
          if (!this.caption) return;

          event.preventDefault();

          let caption = anchor.dataset.caption
            ? this.caption[anchor.dataset.caption]
            : this.caption[idx];

          if (!caption) caption = this.caption[0];

          anchorTag.setAttribute("href", caption);
        },
        false
      );

      // SET CLICKTAG ON MOUSEDOWN
      anchor.addEventListener(
        "mouseup",
        (event) => {
          event.preventDefault();

          let clicktag = anchor.dataset.clicktag
            ? this.clicktags[anchor.dataset.clicktag]
            : this.clicktags[idx];

          if (!clicktag) clicktag = this.clicktags[0];

          anchorTag.setAttribute("href", clicktag);
          anchorTag.setAttribute("target", "_blank");
        },
        false
      );
    });

    // APPEND IMPRESSION TRACKING
    window.addEventListener("track", (event) => {
      // TODO
      // DEFINE FILTER METHOD TO PREVENT EXTERNAL ACCESS
      if (this.impressions.firstEngagement) this.trackEvent("firstEngagement");

      this.trackEvent(event.detail);
    });
  }

  trackEvent(event) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "%c TRACK EVENT ",
        "color: #01ffaa; background-color: #2F3338; border-radius: 4px;",
        event
      );
      console.log(
        "%c TRACK PIXELS ",
        "color: #01ffaa; background-color: #2F3338; border-radius: 4px;",
        this.impressions[event]
      );
    } else {
      this.appendImpressionPixel(event);
    }

    this.impressions[event] = undefined;
  }

  appendImpressionPixel(event) {
    if (!this.impressions[event]) return;

    const timestamp = new Date().getTime();
    for (let src of this.impressions[event]) {
      const img = document.createElement("img");

      // REPLACE MACROS
      src = src.replace(/\[timestamp\]/g, timestamp);

      // SET ATTRIBUTES
      img.setAttribute("src", src);
      img.setAttribute("width", "1");
      img.setAttribute("width", "1");
      img.setAttribute("alt", "Impression Pixel Event: " + event);
      img.style.display = "none";

      document.body.appendChild(img);
    }
  }

  // ADDING EVENT LISTENERS
  defineEvents() {
    // START ANIMATION EVENT
    this.container.addEventListener("startAnimation", () => {
      this.isTweening = true;
      this.container.classList.add("is--tweening");

      // INIT FEATURES
      this.features.forEach((feature) => {
        if (typeof feature.init === "function") feature.init();
      });
    });

    // RESET ANIMATION EVENT
    this.container.addEventListener("resetAnimation", () => {
      this.isTweening = false;
      this.container.classList.remove("is--tweening");

      // INIT FEATURES
      this.features.forEach((feature) => {
        if (typeof feature.reset === "function") feature.reset();
      });
    });
  }

  // START ANIMATION
  startAnimation(options) {
    const event = new CustomEvent("startAnimation", { detail: options });
    this.container.dispatchEvent(event);
  }

  // RESET ANIMATION
  resetAnimation() {
    const event = new CustomEvent("resetAnimation");
    this.container.dispatchEvent(event);
  }
}

export default Creative;
