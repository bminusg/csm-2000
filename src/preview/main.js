import Emulator from "./modules/emulator.js";
import expandListener from "./modules/expand.js";
import widgets from "./modules/widgets";
import "./sass/main.sass";

class Preview {
  constructor() {
    this.app = document.querySelector("#app");

    // WIDGETS
    this.activeWidgets = [];

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
    this.widgets = widgets.init(this.params);

    // SCROLL LISTENER
    this.scrollListener();
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
