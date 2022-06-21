import expandListener from "./modules/expand.js";
import widgets from "./modules/widgets";
import "./sass/main.sass";

class Preview {
  constructor() {
    this.app = document.querySelector("#app");
    this.activeWidgets = [];

    window.addEventListener("DOMContentLoaded", this.init());
  }

  init() {
    try {
      // DEFINE PARAMETER SETUP
      this.parameterSetup();

      // APPEND EXPAND LISTENER USING OVK STANDARDS
      expandListener();

      // DEFINE CSS VARIABLES
      this.defineCSSvars();

      // DISCLAIMER
      this.disclaimer();
    } catch (error) {
      console.log("CATCH BLOG", error);
    }
  }
  async parameterSetup() {
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

    // DEFINE META SETUP - PUBLISHER
    if (this.params.publisher) {
      const publisher = await import(
        /* webpackChunkName: "publisher--[request]" */ `./modules/publishers/${this.params.publisher}`
      );

      this.app.dataset.publisher = this.params.publisher;
      publisher.default();
    }

    // DEFINE WIDGET MAP
    this.widgets = widgets.init(this.params);

    // EMULATE VIEWPORT
    this.emulateViewport();
  }
  emulateViewport() {
    const mobileFormats = ["interscroller"];
    const activeWidgetTypes = this.widgets
      .filter((widget) => widget.source)
      .map((widget) => widget.type);

    const matchingMobileWidget = activeWidgetTypes.filter((widget) =>
      mobileFormats.includes(widget)
    );

    if (matchingMobileWidget.length < 1 || window.innerWidth < 415) return;
    this.app.dataset.device = "phone";
  }
  defineCSSvars() {
    const scrollDiv =
      this.app.dataset.device === "phone"
        ? document.querySelector(".publisher")
        : document.querySelector(".app");
    const scrollbwarWIDTH = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    const root = document.querySelector(":root");

    root.style.setProperty("--scrollbar--width", scrollbwarWIDTH + "px");
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
  toggleInterstitial() {
    const app = document.querySelector(".app");
    const toggledState = app.dataset.interstitial === "true" ? false : true;
    app.dataset.interstitial = toggledState;
  }
}

window.PREVIEW = new Preview();
