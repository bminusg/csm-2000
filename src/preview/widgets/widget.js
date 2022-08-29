import sticky from "../modules/sticky.js";

class Widget {
  constructor(options = {}) {
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

  loadIframe() {
    this.iframe = document.createElement("iframe");
    const classNames = "widget--" + this.type + "-iframe";

    this.iframe.classList.add(classNames);
    this.iframe.src = this.redirect ? this.redirect : "about:blank";

    this.isActive = true;
    this.container.style.display = "flex";
    this.container.appendChild(this.iframe);
  }

  scrollTo() {
    let offsetTop = 0;
    let container = this.container;
    const scrollContainer = document.querySelector(".scroll")
      ? document.querySelector(".scroll")
      : document.querySelector("#app");

    while (container !== scrollContainer) {
      offsetTop += container.offsetTop;
      container = container.offsetParent;
    }

    scrollContainer.scrollTo(0, offsetTop);
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
  }

  openClicktag() {
    window.open(this.clicktag, "_blank").focus();
  }
}

export default Widget;
