import "./sass/main.sass";
import createIframe from "./modules/iframe.js";
import getSRC from "./modules/source.js";
import expandListener from "./modules/expand.js";
import Video from "lib/features/Video";

window.PREVIEW = {
  app: document.querySelector(".app"),
  adCompilationType: undefined,
  publisher: "default",
  device: "desktop",
  formats: {},

  init() {
    // DEFINE APP CONTAINER
    this.app = document.querySelector(".app");
    if (!this.app) return this.log("Can't find APP container", "error");

    // DEFINE PARAMETER SETUP
    this.parameterSetup();

    // BUILD CREATIVE CONTAINERS
    this.initCreativeContainers();

    // APPEND EXPAND LISTENER USING OVK STANDARDS
    expandListener();
  },
  parameterSetup() {
    const query = window.location.search.substring(1);
    const params = query.length === 0 ? [] : query.split("&");

    for (const paramString of params) {
      const paramPair = paramString.split("=");
      const key = paramPair[0];
      const value = paramPair[1];

      if (key === "publisher" || key === "device") {
        this[key] = value;
        continue;
      }

      if (this.formats[key]) {
        this.formats[key].push(value);
        continue;
      }

      Object.assign(this.formats, { [key]: [value] });
    }

    // DEFINE META SETUP - PUBLISHER
    this.app.dataset.publisher = this.publisher;

    // CHECK FOR AD COMPILATION TYPE
    this.checkCompilation();
  },
  checkCompilation() {
    let type = undefined;

    // FIREPLACE
    if (
      this.formats.superbanner &&
      this.formats.sky &&
      this.formats.sky.length === 2
    )
      type = "Fireplace";

    // BRIDGE AD
    if (
      this.formats.superbanner &&
      this.formats.billboard &&
      this.formats.sky &&
      this.formats.sky.length === 2
    )
      type = "Bridge Ad";

    // WALLPAPER
    if (
      this.formats.superbanner &&
      this.formats.sky &&
      this.formats.sky.length === 1
    )
      type = "Wallpaper";

    // Double Dynamic Sitebar
    if (this.formats.sitebar && this.formats.sitebar.length === 2)
      type = "Double Dynamic Sitebar";

    // VIDEOWALL
    if (this.formats.videowall) type = "Video Wall";

    this.adCompilationType = type;
    this.app.dataset.adCompilation = type;
  },
  initCreativeContainers() {
    const paramKeys = Object.keys(this.formats);

    // VALIDATE
    if (paramKeys.length < 1)
      return this.log("Creative search params are missing", "error");

    // VIDEO WALL
    if (this.formats.videowall) return this.videowall();

    // BUILD
    this.buildCreativeContainers(paramKeys);
  },
  buildCreativeContainers(creativeFormats) {
    if (!creativeFormats) creativeFormats = Object.keys(this.formats);

    // LOOP CREATIVE FORMATS
    for (const format of creativeFormats) {
      const containerNodeList = document.querySelectorAll(
        ".creative--" + format
      );
      const containers = Array.prototype.slice
        .call(containerNodeList, 0)
        .sort((a, b) => {
          if (a.className.indexOf("left") > -1) return 1;
          return 0;
        });

      // SKIP PARAM IN CASE THERE IS NO MATCHING CREATIVE DIV CONTAINER
      if (containers.length === 0) continue;

      containers.forEach((container, idx) => {
        // BILLDBOARD BILD EDGE CASE
        if (
          format === "billboard" &&
          this.publisher === "bild" &&
          this.adCompilationType !== "Bridge Ad"
        )
          container = document.querySelector(".creative--superbanner");

        const slug = this.formats[format][idx];
        const src = getSRC(slug);
        const iframe = createIframe("creative--" + format + "-iframe", src);

        container.appendChild(iframe);
      });
    }
  },
  videowall() {
    // VALIDATE
    if (!this.formats.billboard)
      return this.log("Billboard Component is missing", "error");

    if (this.formats.billboard.length < 2)
      return this.log("Billboard Reminder Component is missing", "error");

    // CREATE VIDEO CONTAINER
    this.videoWallSource = getSRC(this.formats.videowall[0], "/spot.mp4");

    new Video({
      parentContainer: document.querySelector(".creative--videowall"),
      isAutoplay: true,
      isLooped: true,
      fileURLs: [this.videoWallSource],
      classNames: "creative--videowall-video",
    }).init();

    // BUILD BILLBOARDS
    this.buildCreativeContainers(["billboard"]);

    // APPEND EVENT LISTENERS
    this.addVideowallEvents();
  },
  addVideowallEvents() {
    const videowallContainer = document.querySelector(".creative--videowall");
    videowallContainer.addEventListener(
      "click",
      this.expandVideowall.bind(this)
    );

    window.onload = () => {
      const iframe = document.querySelector(".creative--billboard-iframe");
      const iframeAnchor =
        iframe.contentWindow.document.body.querySelector("a");

      iframeAnchor.addEventListener("click", (event) => {
        event.preventDefault();

        this.videowallClickoutSrc = iframeAnchor.getAttribute("href");
        this.expandVideowall();
      });
    };

    const closeBtn = document.querySelector(
      ".creative--interstitial-btn__close"
    );
    closeBtn.addEventListener("click", this.collapseVideowall.bind(this));
  },
  expandVideowall() {
    const videoNodeOrigin = document.querySelector(
      ".creative--videowall video"
    );
    const interstitialContainer = document.querySelector(
      ".creative--interstitial"
    );

    // MODIFY EXPANDED VIDEO

    const videoNode = videoNodeOrigin.cloneNode();
    videoNode.src = this.videoWallSource;
    videoNode.controls = true;
    videoNode.loop = false;
    videoNode.classList.add("creative--videowall-video__expanded");
    videoNode.removeAttribute("id");

    // COLLAPSE IF VIDEO ENDED
    videoNode.addEventListener("ended", () => this.collapseVideowall());

    // BRING IT TO THE DOM

    this.app.dataset.interstitial = true;
    interstitialContainer.appendChild(videoNode);
    videoNodeOrigin.parentElement.remove();

    // APPEND CLICKOUT

    if (!this.videowallClickoutSrc) return;

    interstitialContainer.addEventListener("click", (event) => {
      this.collapseVideowall();
      window.open(this.videowallClickoutSrc, "_blank").focus();
    });
  },
  collapseVideowall() {
    const billboardSrc = this.formats.billboard[1]
      ? this.formats.billboard[1]
      : this.formats.billboard[0];
    const videoNode = document.querySelector(".creative--interstitial video");
    const billboardIframe = document.querySelector(
      ".creative--billboard-iframe"
    );

    videoNode.pause();
    this.app.dataset.interstitial = false;

    billboardIframe.src = getSRC(billboardSrc);
  },
  toggleInterstitial() {
    const app = document.querySelector(".app");
    const toggledState = app.dataset.interstitial === "true" ? false : true;

    app.dataset.interstitial = toggledState;
  },
  log(msgString = "", type = "active") {
    if (msgString === "") return;

    const layer = document.querySelector(".app--layer");
    const txtElement = layer.querySelector(".app--layer-msg p");
    const typeClassName = "app--layer-" + type;

    txtElement.innerHTML = msgString;
    layer.classList.add(typeClassName);
  },
};

window.addEventListener("DOMContentLoaded", window.PREVIEW.init());
