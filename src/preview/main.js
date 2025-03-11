import Emulator from "./modules/emulator.js";
import expandListener from "./modules/expand.js";
import Widget from "./widgets/widget.js";
import "./sass/main.sass";

class Preview {
  constructor() {
    this.app = document.querySelector("#app");
    this.widgets = [];

    window.addEventListener("DOMContentLoaded", this.init());
  }

  init() {
    try {
      // DEFINE PARAMETER SETUP
      this.parameterSetup();

      // APPEND EXPAND LISTENER USING OVK STANDARDS
      expandListener();

      // DISCLAIMER
      this.disclaimer();

      // RESIZE LISTENER
      window.addEventListener("resize", this.resize.bind(this));
    } catch (error) {
      console.log("PREVIEW INIT CATCH BLOG", error);
    }
  }
  parameterSetup() {
    const query = window.location.search.substring(1);
    const queryParams = query.length === 0 ? [] : query.split("&");
    this.params = {};

    for (const paramString of queryParams) {
      const paramPair = paramString.split("=");
      const key = decodeURIComponent(paramPair[0]);
      const value = decodeURIComponent(paramPair[1]);

      if (this.params[key]) {
        this.params[key].push(value);
        continue;
      }

      this.params[key] = value.split(",");
    }

    // INIT EMULATOR
    this.emulator = new Emulator(this.params);

    // DEFINE WIDGET MAP
    this.defineWidgets();

    // SCROLL LISTENER
    this.scrollListener();
  }

  defineWidgets() {
    let { publisher } = this.params;
    const widgetContainers = document.querySelectorAll(".widget");
    const paramKeys = Object.keys(this.params);
    const year = this.params.year
      ? this.params.year[0]
      : new Date().getFullYear();

    if (!publisher) publisher = [];

    for (const container of widgetContainers) {
      const type = container.dataset.widgetType;
      const isSticky = type === "sitebar" ? true : false;
      const position = container.dataset.widgetPosition;
      const source = paramKeys.includes(type)
        ? this.params[type][position === "left" ? 1 : 0]
        : null;

      const widget = new Widget({
        type,
        position,
        container,
        source,
        isSticky,
        year,
      });

      this.widgets.push(widget);
    }

    this.compositeCheck(this.params);
  }
  async compositeCheck(params) {
    // BIG STAGE COMPOSITION
    if (this.isWidgetActive("bigstage")) {
      const bigstage = await import(
        /* webpackChunkName: "widget--bigstage" */ "./widgets/bigstage.js"
      );

      bigstage.default.init(this.widgets);
      return;
    }

    // VIDEOWALL COMPOSITION
    if (this.isWidgetActive("videowall")) {
      const videowall = await import(
        /* webpackChunkName: "widget--videowall" */ "./widgets/videowall.js"
      );

      videowall.default.init(this.widgets, params);
      return;
    }

    // CHECK BRAND BOOST
    if (this.isWidgetActive("bboost")) {
      const brandboost = await import(
        /* webpackChunkName: "widget--brandboost" */ "./widgets/brandboost.js"
      );

      brandboost.default.init(this.widgets, params);
      return;
    }

    // CHECK FLOW AD
    if (this.isWidgetActive("flowad")) {
      const brandboost = await import(
        /* webpackChunkName: "widget--flowad" */ "./widgets/flowad.js"
      );

      brandboost.default.init(this.widgets, params);
      return;
    }

    this.loadCreatives(this.widgets);
  }

  loadCreatives(widgets) {
    for (const widget of widgets) {
      if (!widget.redirect) continue;

      widget.loadIframe();

      if (["interscroller", "hpa"].includes(widget.type)) widget.scrollTo();
    }
  }

  isWidgetActive(type = "") {
    const isWidgetActive = this.widgets.find(
      (widget) => widget.type === type && widget.source
    );

    return isWidgetActive;
  }

  disclaimer() {
    const state = window.localStorage.getItem("--PREVIEW-DISCLAIMER");

    if (state === "confirmed") return;

    const node = document.querySelector(".disclaimer");
    const button = node.querySelector(".button");
    node.classList.add("is--visible");

    button.addEventListener("click", (event) => {
      event.preventDefault();

      window.localStorage.setItem("--PREVIEW-DISCLAIMER", "confirmed");
      node.classList.remove("is--visible");
    });
  }
  scrollListener() {
    const scrollArea = document.querySelector(".scroll")
      ? document.querySelector(".scroll")
      : this.app;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const iframe = entry.target.querySelector("iframe");
          const message = "isVisible=";
          const isVisible = entry.isIntersecting ? "1" : "0.5955";

          if (!iframe) continue;

          iframe.contentWindow.postMessage(message + isVisible);
        }
      },
      {
        root: scrollArea,
        threshold: 0.5,
      }
    );

    this.widgets.forEach((widget) => observer.observe(widget.container));
  }
  toggleInterstitial() {
    const app = document.querySelector(".app");
    const toggledState = app.dataset.interstitial === "true" ? false : true;
    app.dataset.interstitial = toggledState;
  }
  resize(event) {
    event.preventDefault();
    this.emulator = new Emulator(this.params);
  }
}

window.PREVIEW = new Preview();
