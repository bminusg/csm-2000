"use strict";

// TODO
// [   ] CHECK VIDEO TRACKING
// [   ] FEATURE LIB COMPABILITY

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
      this.playBtn.addEventListener("click", this.playClick.bind(this));

    this.closeBtn.addEventListener("click", this.closeClick.bind(this));

    window.addEventListener("message", this.getMessage.bind(this));

    window.addEventListener("load", () => {
      if (!this.container) return;

      // VIDEO LOGIC
      if (this.videoConfig && this.videoElem) {
        const source = document.createElement("source");
        source.src = this.videoConfig.src;
        source.type = "video/mp4";

        this.videoElem.setAttribute("poster", this.videoConfig.poster ?? "");
        this.videoElem.appendChild(source);

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
          this.videoElem.addEventListener(
            "volumechange",
            () => (this.container.dataset.muted = this.videoElem.muted)
          );
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

    if (this.videoElem) {
      this.container.dataset.state = "active video";
      this.isActive = false;
      this.videoElem.currentTime = 0;
      this.videoElem.muted = false;
      this.videoElem.volume = 0.5;
      this.videoElem.play();
    }
  }

  trailerClick(e) {
    e.stopPropagation();

    if (!this.videoElem.paused) this.videoElem.pause();
    else this.playClick(e);
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
    this.activate();
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

    this.isActive = true;
    this.container.dataset.state = this.isSplitterMode
      ? "active splitter"
      : "active";
  }

  deactivate() {
    this.isActive = false;
    this.container.dataset.state = "active";

    if (this.videoElem) {
      this.videoElem.muted = true;
      this.videoElem.pause();
    }
  }

  scrolling() {
    if (this.isActive) this.deactivate();
    this.container.removeAttribute("data-playstate");
    this.container.dataset.state = "scrolling";
  }

  closeClick(e) {
    e.stopPropagation();

    if (this.videoElem && !this.videoElem.paused) return this.deactivate();
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

export const mobile = () => {
  const doc = document;
  const win = window;
  const qs = (s) => doc.querySelector(s);
  const trailer = qs(".trailer");

  const hashParameters = doc.location.hash
    .slice(1)
    .split("##")
    .map(decodeURIComponent);
  const targetUrls = hashParameters.slice(0, 2);
  const trackingZones = hashParameters.slice(-5);
  const videoTrackingAvailable =
    qs(".tracking") &&
    qs(".play") &&
    qs(".close") &&
    hashParameters.length > 5 &&
    trackingZones[0] !== "0";
  const openTargetUrl = (n = 0) => win.open(targetUrls[n]);
  const sendMessage = (target, msg) => target.postMessage(msg, "*");

  let isHeadFrame = false;

  const messageSafety = (msg) => {
    const hasSender = msg.data.sender;
    if (!hasSender) return;

    const safeSender = ~msg.data.sender.indexOf("brand-booster");
    if (!safeSender) return;

    return true;
  };

  const getMessage = (msg) => {
    if (!messageSafety(msg)) return;

    if (msg.data.scrollTop !== undefined) {
      const hasScrolled = msg.data.scrollTop > win.innerHeight * 0.5;
      const method = hasScrolled ? "add" : "remove";
      container.classList[method]("scrolled");

      try {
        handleScrollTop(msg.data.scrollTop);
      } catch (error) {
        // handleScrollTop is not defined
      }
    }

    // if (msg.data.volume !== undefined) {
    //   try {
    //     videoElem.volume = volume;
    //     if (active && volume === 0.0001) deactivate();
    //   } catch (error) {
    //     // video, active, and/or deactivate are not defined
    //   }
    // }

    const cmd = msg.data.command;
    if (cmd) {
      switch (cmd) {
        case "determine":
          isHeadFrame = true;
          container.classList.remove("mobile-splitter-active");
          minimize && minimize.classList.remove("hidden");
          break;

        case "playVideo":
          if (isHeadFrame && !active) activate();
          break;

        case "stopVideo":
          if (active) deactivate();
          break;
      }
    }
  };

  const collapse = () => {
    sendMessage(win.top, {
      sender: "brand-booster-iframe",
      command: "collapse",
    });
  };

  const determine = () => {
    sendMessage(win.top, {
      sender: "brand-booster-slim",
      command: "determine",
    });
  };

  const expand = () => {
    sendMessage(win.top, {
      sender: "brand-booster-slim",
      command: "expand",
    });
  };

  const playVideo = () => {
    const frames = win.parent.frames;

    // a for of loop will create a cross-origin access dom exception here
    for (let i = 0; i < frames.length; i++) {
      sendMessage(frames[i], {
        sender: "brand-booster-slim",
        command: "activate",
      });
    }
  };

  determine();

  win.addEventListener("message", getMessage);

  const loadVideoTracking = () => {
    const random = () => Math.round(Math.random() * 1e10);

    const close = qs(".close");
    const play = qs(".play");
    const trackingVideo = qs(".tracking");
    const trackingPixels = {};

    let active = false;

    // create tracking pixels
    for (let i = 0; i < 5; i++) {
      trackingPixels[i * 25] = {
        src: `https://smbad.de/www/delivery/avw.php?zoneid=${trackingZones[i]}&amp;cb=`,
        done: false,
      };
    }

    const clearTrackingPixels = () => {
      for (const t in trackingPixels) trackingPixels[t].done = false;
    };

    const loadTrackingPixel = (n) => {
      if (!trackingPixels[n] || trackingPixels[n].done || !active) return;

      trackingPixels[n].done = true;
      const px = doc.createElement("img");
      px.border = 0;
      px.dataset.videoProgress = n;
      px.setAttribute("style", "position: absolute; top: -1px; left: -1px");
      px.alt = "";
      px.src = `${trackingPixels[n].src + random()}`;
      doc.body.appendChild(px);
    };

    const playClick = (e) => {
      e.stopPropagation();
      clearTrackingPixels();
      active = true;
    };

    const closeClick = (e) => {
      e.stopPropagation();
      active = false;
    };

    const trackingVideoTimeupdate = () => {
      if (!active) return;

      const quarter = Math.floor(
        (trackingVideo.currentTime / trackingVideo.duration) * 4
      );

      loadTrackingPixel(quarter * 25);
    };

    const trackingVideoEnded = () => {
      if (!active) return;

      loadTrackingPixel(100);
      active = false;
    };

    play.addEventListener("click", playClick);
    close.addEventListener("click", closeClick);
    trackingVideo.addEventListener("ended", trackingVideoEnded);
    trackingVideo.addEventListener("timeupdate", trackingVideoTimeupdate);
  };

  doc.addEventListener("DOMContentLoaded", () => {
    doc.body.classList.remove("preload");

    if (videoTrackingAvailable) loadVideoTracking();
  });

  var close = qs(".close");
  var container = qs(".container");
  var minimize = qs(".minimize");
  var play = qs(".play");
  var video = qs(".video");

  var active = false;
  var interval = void 0;
  var runCount = 0;

  var handleScrollTop = function handleScrollTop(scrollTop) {
    // use scrollTop variable any way you want
  };

  var activate = function activate() {
    active = true;
    container.classList.add("active");
    trailer.play();
    trailer.muted = false;
  };

  var deactivate = function deactivate() {
    active = false;
    container.classList.remove("active");

    //trailer.currentTime = 2.5;
    trailer.muted = true;
    trailer.pause();
  };

  var closeClick = function closeClick(e) {
    e.stopPropagation();
    active ? deactivate() : collapse();
  };

  var containerClick = function containerClick(e) {
    e.stopPropagation();
    openTargetUrl();
  };

  var minimizeClick = function minimizeClick(e) {
    e.stopPropagation();
    deactivate();
    collapse();
  };

  var playClick = function playClick(e) {
    e.stopPropagation();
    activate();
  };

  var videoEnded = function videoEnded() {
    deactivate();
  };

  close.addEventListener("click", closeClick);
  container.addEventListener("click", containerClick);
  minimize.addEventListener("click", minimizeClick);
  play.addEventListener("click", playClick);
  trailer.addEventListener("ended", videoEnded);
  trailer.addEventListener("webkitendfullscreen", videoEnded);
  //window.addEventListener("resize", resizeEvent);
};
