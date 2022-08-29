import Video from "src/library/features/Video";
import "../sass/widgets/videowall.sass";

export default {
  init(widgets, params) {
    if (!params.bb) throw new Error("Billboard component is missing", "error");

    if (params.bb.length < 2)
      throw new Error("Billboard reminder component is missing", "error");

    this.videowall = widgets.find((widget) => widget.type === "videowall");
    this.billboard = widgets.find((widget) => widget.type === "bb");
    this.billboardReminderSource = params.bb[1];

    this.video = new Video({
      parentContainer: document.querySelector(
        ".widget[data-widget-type='videowall']"
      ),
      isAutoplay: true,
      isLooped: true,
      fileURLs: [this.videowall.redirect],
      classNames: "widget--videowall-video",
    });

    this.videowall.container.style.display = "block";
    this.billboard.loadIframe();
    this.video.init();

    // APPEND EVENT LISTENERS
    window.onload = () => {
      const iframe = document.querySelector(".widget--bb-iframe");
      const iframeAnchor =
        iframe.contentWindow.document.body.querySelector("a");

      [iframeAnchor, this.videowall.container].forEach((frame) => {
        frame.addEventListener("click", this.expandEvent.bind(this));
      });
    };
  },

  expandEvent(event) {
    event.preventDefault();

    if (this.videowall.container.classList.contains("is--expanded")) return;
    this.expandVideowall();
  },

  expandVideowall() {
    const video = this.video.video;

    this.video.isLooped = false;
    video.pause();
    video.muted = false;
    video.currentTime = 0;
    video.load();
    video.addEventListener("click", (event) => {
      event.preventDefault();
      this.videowall.openClicktag();
      this.collapseVideowall();
    });

    video.addEventListener("ended", () => this.collapseVideowall());

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("widget--videowall-close");
    closeBtn.addEventListener("click", this.collapseVideowall.bind(this));

    this.videowall.container.classList.add("is--expanded");
    this.videowall.container.appendChild(closeBtn);
    this.billboard.iframe.remove();
  },
  collapseVideowall() {
    this.video.video.pause();
    this.videowall.container.style.display = "none";

    this.billboard.source = this.billboardReminderSource;
    this.billboard.setRedirect();
    this.billboard.loadIframe();
  },
};
