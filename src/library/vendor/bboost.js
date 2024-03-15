"use strict";

class BrandBooster {
  constructor(config = {}) {
    this.hashParameters = document.location.hash
      .slice(1)
      .split("##")
      .map(decodeURIComponent);

    this.targetUrls = this.hashParameters.slice(0, 2);
    this.trackingZones = this.hashParameters.slice(-5);
    this.videoTrackingAvailable =
      this.hashParameters.length > 5 && "0" !== this.trackingZones[0];

    // DEFAULT BUTTONS

    this.closeBtn = document.querySelector(".bboost--btn-close");

    // VIDEO CONFIG

    this.videoConfig = config.video ?? {};
    this.playBtn = document.querySelector(".bboost--btn-play");
    this.btnMuted = document.querySelector(".bboost--btn-muted");
    this.videoElem = document.querySelector("video");
    this.container = document.querySelector(".container");

    // CUSTOM EVENTS

    this.onScroll = config.onScroll ?? undefined;

    // MISC

    this.isMobile = config.isMobile || false;
  }

  init() {
    this.initEventListeners();

    if (this.isMobile) this.determine();
  }

  initEventListeners() {
    document.addEventListener("keyup", this.documentKeyup.bind(this));

    this.container.addEventListener("click", this.containerClick.bind(this));
    this.playBtn &&
      this.playBtn.addEventListener("click", this.trailerClick.bind(this));

    this.closeBtn.addEventListener("click", this.closeClick.bind(this));

    window.addEventListener("message", this.getMessage.bind(this));

    window.addEventListener("load", () => {
      if (!this.container) return;

      // VIDEO LOGIC
      if (this.videoConfig && this.videoConfig.src && this.videoElem) {
        this.videoElem.setAttribute("poster", this.videoConfig.poster ?? "");
        this.videoElem.src = this.videoConfig.srcUnmuted
          ? this.videoConfig.srcUnmuted
          : this.videoConfig.src;

        // VIDEO EVENTS
        if (this.videoElem) {
          this.videoElem.addEventListener(
            "click",
            this.trailerClick.bind(this)
          );
          this.videoElem.addEventListener(
            "ended",
            this.trailerEnded.bind(this)
          );
          this.videoElem.addEventListener(
            "pause",
            () => (this.container.dataset.playstate = "paused")
          );
          this.videoElem.addEventListener(
            "play",
            () => (this.container.dataset.playstate = "playing")
          );

          this.videoElem.addEventListener("volumechange", () => {
            this.container.dataset.muted = this.videoElem.muted;
          });
        }

        // VIDEO BTN EVENTS

        const btnMuted = document.querySelector(".bboost--btn-muted");
        if (btnMuted)
          btnMuted.addEventListener("click", this.trailerSound.bind(this));

        // TRACKING
        if (this.videoTrackingAvailable) this.loadVideoTracking();

        if (this.videoConfig.delay)
          setTimeout(() => this.videoElem.play(), this.videoConfig.delay);
      }

      // INIT TWEENING
      this.activate();
    });
  }

  throttle(fn) {
    let requestId;
    return function (...args) {
      if (requestId) return;

      requestId = requestAnimationFrame(() => {
        fn(...args);
        requestId = null;
      });
    };
  }

  openTargetUrl(e = 0) {
    window.open(this.targetUrls[e]);
  }

  sendMessage(e, a) {
    e.postMessage(a, "*");
  }

  messageSafety(e) {
    if (e.data.sender)
      return !!~e.data.sender.indexOf("brand-booster") || void 0;
  }

  getMessage(e) {
    if (!this.messageSafety(e)) return;

    const cmd = e.data.command;

    if (!this.container.dataset.publisher)
      this.container.dataset.origin = e.origin;

    if (Object.hasOwn(e.data, "visible"))
      return (this.isSplitterMode = e.data.visible);

    if (e.data.volume && this.isActive) return this.deactivate();

    if (e.data.pageHeight) return (this.pageHeight = e.data.pageHeight);

    if (cmd && cmd === "determine") {
      this.closeBtn.style.display = "flex";
      this.container.classList.remove("mobile-splitter-active");
    }

    if (e.data.scrollTop)
      return this.throttle(this.handleScrollTop(e.data.scrollTop));
  }

  handleScrollTop(scrollTop) {
    const initBreakpoint = window.innerHeight / 2;
    const isActiveMode = !this.isActive && scrollTop < initBreakpoint;

    if (this.onScroll) this.onScroll(scrollTop); // TRIGGER CUSTOM EVENTS

    if (isActiveMode || this.isSplitterMode) {
      this.activate();
    } else if (scrollTop >= initBreakpoint) {
      this.scrolling();
    }
  }

  collapse() {
    this.sendMessage(window.top, {
      sender: "brand-booster-iframe",
      command: "collapse",
    });
  }

  expand() {
    this.sendMessage(window.top, {
      sender: "brand-booster-slim",
      command: "expand",
    });
  }

  determine() {
    this.closeBtn.style.display = "none";

    this.sendMessage(window.top, {
      sender: "brand-booster-slim",
      command: "determine",
    });
  }

  playVideo() {
    const e = window.parent.frames;
    for (let a = 0; a < e.length; a++)
      this.sendMessage(e[a], {
        sender: "brand-booster-slim",
        command: "activate",
      });
  }

  playClick(e) {
    e.stopPropagation();

    this.videoElem.loop = false;

    if (this.videoElem.muted && this.videoConfig?.srcUnmuted) {
      const source = document.createElement("source");
      source.src = this.videoConfig.srcUnmuted;
      source.type = "video/mp4";

      if (this.videoElem.src !== this.videoConfig.src)
        this.videoElem.src = this.videoConfig.src;
      this.videoElem.load();
    }

    if (this.videoElem) {
      this.container.dataset.state = "active video";
      this.isActive = true;
      this.videoElem.currentTime = 0;
      this.videoElem.muted = false;
      this.videoElem.volume = 0.5;

      if (!this.videoElem.autoplay) this.videoElem.play();
    }

    this.isActive = true;
  }

  trailerClick(e) {
    e.stopPropagation();
    const isFullscreen = this.videoElem.autoplay && this.videoElem.muted;
    const isPlaying = !this.videoElem.paused;

    if (!isFullscreen && isPlaying) {
      this.videoElem.pause();
      this.videoElem.currentTime = 0;
      this.trailerEnded();
    } else this.playClick(e);
  }

  trailerSound(e) {
    e.stopPropagation();

    const isMutedToggle = !this.videoElem.muted;
    const srcUnmuted = this.videoConfig.srcUnmuted;
    const changeVideoSrc =
      srcUnmuted && !isMutedToggle && this.videoElem.src !== srcUnmuted;

    if (changeVideoSrc) {
      const currentTime = this.videoElem.currentTime;
      this.videoElem.src = srcUnmuted;
      this.videoElem.volume = 0.5;
      this.videoElem.currentTime = currentTime;
      this.videoElem.play();
    }

    this.videoElem.muted = isMutedToggle;
  }

  trailerEnded() {
    const states = this.container.dataset.state.split(" ");
    const state = states.filter((state) => state !== "video" || state === "");

    this.videoElem.muted = true;

    if (this.videoConfig.srcUnmuted) {
      this.videoElem.src = this.videoConfig.srcUnmuted;
      this.videoElem.loop = true;
    }

    this.container.dataset.state = state.join(" ");
    this.container.dataset.playstate = "ended";
    this.container.dataset.muted = "true";
  }

  loadVideoTracking() {
    const e = document.querySelector(".bboost--btn-close");
    const a = document.querySelector(".bboost--btn-play");
    let o = {};

    let s = !1;

    for (let e = 0; e < 5; e++)
      o[25 * e] = {
        src: `https://smbad.de/www/delivery/avw.php?zoneid=${this.trackingZones[e]}&amp;cb=`,
        done: !1,
      };

    const d = (e) => {
      if (!o[e] || o[e].done || !s) return;
      o[e].done = !0;

      const a = document.createElement("img");
      (a.border = 0),
        (a.dataset.videoProgress = e),
        a.setAttribute("style", "position: absolute; top: -1px; left: -1px"),
        (a.alt = ""),
        (a.src = `${o[e].src + (() => Math.round(1e10 * Math.random()))()}`),
        document.body.appendChild(a);
    };

    a.addEventListener("click", (e) => {
      e.stopPropagation(),
        (() => {
          for (const e in o) o[e].done = !1;
        })(),
        (s = !0);
    });

    e.addEventListener("click", (e) => {
      e.stopPropagation(), (s = !1);
    });

    this.videoElem.addEventListener("ended", () => {
      s && (d(100), (s = !1));
    });

    this.videoElem.addEventListener("timeupdate", () => {
      if (!s) return;

      const e = Math.floor(
        (this.videoElem.currentTime / this.videoElem.duration) * 4
      );

      d(25 * e);
    });
  }

  activate() {
    if (this.isActive) return;

    if (this.isActive === undefined)
      this.container.classList.add("is--tweening");

    if (this.videoElem && this.videoElem.autoplay) {
      this.videoElem.muted = true;
      this.videoElem.play();
    }

    this.isActive = true;
    this.container.dataset.state = this.isSplitterMode
      ? "active splitter"
      : "active";
  }

  deactivate() {
    this.isActive = false;
    this.container.dataset.state = "active";

    if (this.videoElem) this.trailerEnded();
  }

  scrolling() {
    if (this.isActive) this.deactivate();

    this.container.removeAttribute("data-playstate");
    this.container.dataset.state = "scrolling";

    if (this.videoElem) this.videoElem.pause();
  }

  closeClick(e) {
    e.stopPropagation();

    if (this.isActive) return this.deactivate();
    this.collapse();
  }

  containerClick(e) {
    e.stopPropagation();

    if (this.videoElem && !this.videoElem.paused) this.videoElem.pause();
    this.openTargetUrl();
  }

  documentKeyup(e) {
    if (e.key === "Escape") this.deactivate();
  }
}

export default BrandBooster;
