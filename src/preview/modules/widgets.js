import sticky from "./sticky.js";

class WidgetServices {
  loadIframe() {
    this.iframe = document.createElement("iframe");
    const classNames = "widget--" + this.type + "-iframe";

    this.iframe.classList.add(classNames);
    this.iframe.src = this.redirect ? this.redirect : "about:blank";

    this.isActive = true;
    this.container.style.display = "flex";
    this.container.appendChild(this.iframe);
  }

  setRedirect() {
    const host = window.location.host;
    const protocol = window.location.protocol;
    const delimiter =
      this.source.indexOf("-") > this.source.indexOf("_") ||
      this.source.indexOf("-") === -1
        ? "_"
        : "-";
    const subfolder = this.source.split(delimiter)[0];
    const filename = this.filename ? this.filename : "/index.html";

    if (this.type === "videowall" || this.type === "bigstage") {
      this.setVideoRedirect(subfolder);
      return;
    }

    const path =
      host.indexOf("localhost") > -1
        ? protocol + "//localhost:8080/" + this.source
        : protocol +
          "//" +
          host +
          "/media/" +
          this.year +
          "/" +
          subfolder +
          "/" +
          this.source;

    this.redirect = path + filename;
  }

  setVideoRedirect(brand) {
    const protocol = window.location.protocol;
    const uri = `${protocol}//mics.bild.de/media/${this.year}/${brand}/${this.source}/${this.source}.mp4`;

    this.poster = `${protocol}//mics.bild.de/media/${this.year}/${brand}/${this.source}/poster_${this.source}.jpg`;
    this.redirect = uri;

    console.log("VIDEO REDIRECT");
  }

  openClicktag() {
    window.open(this.clicktag, "_blank").focus();
  }
}

class Widget extends WidgetServices {
  constructor(options = {}) {
    super();
    this.container = options.container;
    this.type = options.type;
    this.position = options.position;
    this.source = options.source;
    this.year = options.year;
    this.filename = options.filename || undefined;

    this.isActive = false;
    this.isSticky = options.isSticky || false;

    this.clicktag = "https://www.example.com/#clicktag";

    if (this.source) this.setRedirect();
    if (this.isSticky) sticky(this.container);

    this.container.classList.add("widget--" + this.type);
  }
}

export default {
  init(params = {}) {
    const widgetContainers = document.querySelectorAll(".widget");
    const paramKeys = Object.keys(params);
    const year = params.year ? params.year[0] : new Date().getFullYear();

    this.widgets = [];

    for (const container of widgetContainers) {
      const type = container.dataset.widgetType;
      const isSticky = type === "sitebar" ? true : false;
      const position = container.dataset.widgetPosition;
      const source = paramKeys.includes(type)
        ? params[type][position === "left" ? 1 : 0]
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

    this.compositeCheck(params);
    return this.widgets;
  },
  async compositeCheck(params) {
    const bigstageWidgetActive = this.widgets.find(
      (widget) => widget.type === "bigstage" && widget.source
    );
    const videowallWidgetActive = this.widgets.find(
      (widget) => widget.type === "videowall" && widget.source
    );

    // BIG STAGE COMPOSITION
    if (bigstageWidgetActive) {
      const bigstage = await import(
        /* webpackChunkName: "widget--bigstage" */ "./widgets/bigstage.js"
      );

      bigstage.default.init(this.widgets);
      return;
    }

    // VIDEOWALL COMPOSITION
    if (videowallWidgetActive) {
      const videowall = await import(
        /* webpackChunkName: "widget--videowall" */ "./widgets/videowall.js"
      );

      videowall.default.init(this.widgets, params);
      return;
    }

    /*
    // BRIDGE AD
    if (
      widgetMap.get("sky")[0].redirect &&
      widgetMap.get("superbanner")[0].redirect &&
      widgetMap.get("billboard")[0].redirect
    ) {
      console.log("DYNAMIC BRIDGE AD IMPORT");
      return;
    }
    */

    this.loadCreatives(this.widgets);
  },
  loadCreatives(widgets) {
    for (const widget of widgets) {
      if (!widget.redirect) continue;

      widget.loadIframe();
    }
  },
};
