"use strict";

import "../sass/widgets/brandboost.sass";

export default {
  init(widgets, params) {
    this.brandBoosWidget = widgets.find((widget) => widget.type === "bboost");
    this.publisherArticle = document.querySelector(".publisher--article");
    this.brandBoosWidget.loadIframe();

    this.expand();

    const bboostWindow = this.brandBoosWidget.iframe.contentWindow;
    const triggerSplitter =
      document.documentElement.scrollHeight - window.innerHeight * 2;

    console.log("TRIGGER SPLITTER", triggerSplitter);

    bboostWindow.postMessage({
      sender: "brand-booster-head",
      pageHeight: document.documentElement.scrollHeight,
    });

    window.addEventListener("scroll", (e) => {
      const offset = this.getOffset();
      const scrollTop = window.scrollY;

      bboostWindow.postMessage({
        sender: "brand-booster-head",
        scrollTop,
      });

      if (scrollTop >= triggerSplitter) {
        bboostWindow.postMessage({
          sender: "brand-booster-head",
          visible: true,
        });
      } else {
        bboostWindow.postMessage({
          sender: "brand-booster-head",
          visible: false,
        });
      }

      this.scrollListener(offset);
    });

    window.addEventListener("message", (e) => {
      if (!e.data.sender || e.data.sender !== "brand-booster-iframe") return;

      if (e.data.command === "collapse") this.collapse();
    });
  },

  expand() {
    this.publisherArticle.classList.add("is--expand");
  },

  collapse() {
    this.publisherArticle.classList.remove("is--expand");
  },

  scrollListener(offset) {
    const root = document.querySelector(":root");
    const offsetNav = offset[1] >= 120 ? 0 : 120 - offset[1];

    root.style.setProperty(
      "--publisher--widget--bboost-offset-nav",
      offsetNav + "px"
    );
  },

  getOffset() {
    const offsetLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const offsetTop = window.pageYOffset || document.documentElement.scrollTop;

    return [offsetLeft, offsetTop];
  },
};
