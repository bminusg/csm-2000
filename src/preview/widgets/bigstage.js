import Video from "src/library/features/Video";
import "../sass/widgets/bigstage.sass";

export default {
  init(widgets) {
    this.bigstage = widgets.find((widget) => widget.type === "bigstage");
    this.billboard = widgets.find((widget) => widget.type === "bb");
    this.sitebars = widgets.filter((widget) => widget.type === "sitebar");

    // VALIDATE
    if (!this.bigstage)
      throw new Error("Big Stage: Video Component is missing");
    if (!this.billboard)
      throw new Error("Big Stage: Billboard component is missing", "error");

    if (!this.sitebars)
      throw new Error("Big Stage: Sitebar components are missing", "error");

    if (this.sitebars.length !== 2)
      throw new Error("Big Stage: 2 Sitebar creatives are required", "error");

    this.defineVideo();
    this.appendBtns();
  },

  defineVideo() {
    const publisher = document.querySelector(".publisher");

    this.video = new Video({
      fileURLs: [this.bigstage.redirect],
      parentContainer: this.bigstage.container,
      classNames: "widget--bigstage-video",
      isAutoplay: true,
    });

    this.video.init();

    // APPEND EVENT LISTENERS
    this.video.video.addEventListener("loadstart", (event) => {
      event.preventDefault();
      const navHeight = document.querySelector(".publisher--nav").clientHeight;

      publisher.style.transition = "transform 2s cubic-bezier(0.25, 1, 0.5, 1)";
      publisher.style.transform =
        "translateY(" + (window.innerHeight - navHeight - 50) + "px)";
    });

    this.video.video.addEventListener("ended", (event) => {
      event.preventDefault();
      this.collapse();
    });

    this.video.video.addEventListener("click", (event) => {
      event.preventDefault();
      this.bigstage.openClicktag();
    });
  },

  appendBtns() {
    const buttonWrapper = document.createElement("div");
    const close = document.createElement("div");
    const mute = document.createElement("div");
    buttonWrapper.classList.add("widget--bigstage-button");
    mute.classList.add("widget--bigstage-button__mute");
    close.classList.add("widget--bigstage-button__close");

    close.addEventListener("click", (event) => {
      event.preventDefault();
      this.collapse();
    });

    mute.addEventListener("click", (event) => {
      event.preventDefault();

      event.currentTarget.classList.toggle("is--active");
      this.video.video.muted = !this.video.video.muted;
    });

    buttonWrapper.appendChild(close);
    buttonWrapper.appendChild(mute);
    this.bigstage.container.appendChild(buttonWrapper);
  },

  collapse() {
    const publisher = document.querySelector(".publisher");
    publisher.style.transform = "translateY(0px)";

    if (this.isCollapsing) return;

    this.isCollapsing = true;
    this.video.video.pause();

    setTimeout(() => {
      const reminderWidgets = this.sitebars.concat([this.billboard]);
      reminderWidgets.forEach((widget) => widget.loadIframe());
      this.bigstage.container.style.display = "none";
    }, 2000);
  },
};
