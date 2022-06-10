/**
 * @description Generates a plain video player
 * @param { String } classNames
 * @param { String[]} fileURLs
 * @param {Boolean} isAutoplay
 * @param {Boolean} isLooped
 */
class Video {
  constructor(options = {}) {
    this.video = options.video || undefined;
    this.classNames = options.classNames || "creative--video";
    this.parentContainer =
      options.parentContainer || document.querySelector("body");

    // MEDIA
    this.fileURLs = options.fileURLs || [];
    this.poster =
      options.poster ||
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    // VIDEO CONFIG
    this.isAutoplay = options.isAutoplay || false;
    this.isLooped = options.isLooped || false;

    // TRACKING
    // DEFINITIONS ON PAGE 33 - https://www.iab.com/wp-content/uploads/2015/06/VASTv3_0.pdf
    this.track = {
      mute: options.mute ? options.mute : [],
      unmute: options.unmute ? options.unmute : [],
      pause: options.pause ? options.pause : [],
      resume: options.resume ? options.resume : [],
      rewind: options.rewind ? options.rewind : [],
      skip: options.skip ? options.skip : [],
      playerExpand: options.playerExpand ? options.playerExpand : [],
      playerCollapse: options.playerCollapse ? options.playerCollapse : [],
      loaded: options.loaded ? options.loaded : [],
      start: options.start ? options.start : [],
      firstQuartile: options.firstQuartile ? options.firstQuartile : [],
      midpoint: options.midpoint ? options.midpoint : [],
      thirdQuartile: options.thirdQuartile ? options.thirdQuartile : [],
      complete: options.complete ? options.complete : [],
    };

    // BUTTONS
    this.btns = {
      play: options.btnPlay || undefined,
      pause: options.btnPause || undefined,
      soundon: options.btnSoundOn || undefined,
      soundoff: options.btnSoundOff || undefined,
      fullscreen: options.btnFullscreen || undefined,
    };
  }

  init() {
    if (!this.video) return this.buildPlayer();
    this.addListeners();
  }

  addListeners() {
    const container = window.Creative
      ? window.Creative.container
      : this.parentContainer;

    // FULLSCREEN
    if (this.btns.fullscreen) this.fullscreen();

    // CALC DURATION
    let firstQuartile,
      midpoint,
      thirdQuartile = null;

    // PAUSE
    this.video.addEventListener("pause", (e) => {
      container.dataset.playing = "0";
      this.trackEvent("pause");
    });

    // CAN PLAY
    this.video.addEventListener("canplay", (e) => {
      const duration = this.video.duration;

      firstQuartile = duration / 4;
      midpoint = duration / 2;
      thirdQuartile = (duration / 4) * 3;

      if (this.isAutoplay) this.video.play();
    });

    // CAN PLAY THROUGH
    this.video.addEventListener("canplaythrough", (e) => {
      this.trackEvent("loaded");
    });

    // PLAY
    this.video.addEventListener("play", (e) => {
      this.trackEvent("start");
      container.dataset.playing = "1";
    });

    // ENDED
    this.video.addEventListener("ended", (e) => {
      this.trackEvent("complete");
      if (this.isLooped) this.video.play();
    });

    // VOLUME CHANGE
    this.video.addEventListener("volumechange", (e) => {
      const isMute = this.video.muted;
      container.dataset.muted = isMute ? 0 : 1;

      if (isMute) this.trackEvent("mute");

      if (!isMute) this.trackEvent("unmute");
    });

    // TIME UPDATE
    this.video.addEventListener("timeupdate", (e) => {
      const time = this.video.currentTime;

      if (typeof firstQuartile === "number" && time >= firstQuartile) {
        firstQuartile = false;
        this.trackEvent("firstQuartile");
      }

      if (typeof midpoint === "number" && time >= midpoint) {
        midpoint = false;
        this.trackEvent("midpoint");
      }

      if (typeof thirdQuartile === "number" && time >= thirdQuartile) {
        thirdQuartile = false;
        this.trackEvent("thirdQuartile");
      }
    });

    // BUTTONS
    for (const btn in this.btns) {
      if (!this.btns[btn]) continue;

      this.btns[btn].addEventListener(
        "click",
        (e) => {
          e.preventDefault();

          if (btn === "play") {
            this.video.muted = false;
            this.video.play();
          }

          if (btn === "pause") this.video.pause();
          if (btn === "soundoff") this.video.muted = true;
          if (btn === "soundon") this.video.muted = false;
        },
        true
      );
    }
  }

  trackEvent(event) {
    console.log(
      "%c TRACK EVENT ",
      "color: #01ffaa; background-color: #2F3338; border-radius: 4px;",
      event
    );
    console.log(
      "%c TRACK PIXELS ",
      "color: #01ffaa; background-color: #2F3338; border-radius: 4px;",
      this.track[event]
    );

    const timestamp = new Date().getTime();
    for (let src of this.track[event]) {
      const img = document.createElement("img");

      // REPLACE MACROS
      src = src.replace(/\[timestamp\]/g, timestamp);

      // SET ATTRIBUTES
      img.setAttribute("src", src);
      img.setAttribute("width", "1");
      img.setAttribute("width", "1");
      img.setAttribute("alt", "Impression Pixel Event: " + event);
      img.style.display = "none";

      console.log("IMPRESSION PIXEL", img);
      document.body.appendChild(img);
    }

    this.track[event] = [];
  }

  buildPlayer() {
    const video = document.createElement("video");

    // DEFINE SOURCES

    this.fileURLs.forEach((fileURL) => {
      const source = document.createElement("source");
      const type = fileURL.slice(fileURL.lastIndexOf(".") + 1);
      //source.type = options.mimeType;
      source.type = "video/" + type;
      source.src = fileURL;

      video.appendChild(source);
    });

    video.muted = true;
    video.playsInline = true;
    video.autoplay = this.isAutoplay;
    video.controls = false;
    video.disablePictureInPicture = false;
    //video.bitrate = options.bitrate;
    video.className = this.classNames;

    // DEFINE VIDEO ATTRIBUTES
    video.setAttribute("playsinline", true);
    video.setAttribute("preload", "metadata");
    video.setAttribute("poster", this.poster);

    if (this.isAutoplay) video.setAttribute("muted", true);
    if (this.isAutoplay) video.setAttribute("autoplay", true);

    // DEFINE VIDEO
    this.video = video;

    // ADD EVENT LISTENERS
    this.addListeners();

    // APPEND VIDEO CONTAINER
    this.parentContainer.appendChild(video);
  }

  fullscreen() {
    // ENSURE THAT PUBLISHER HAS allow="fullscreen" as iframe attribute
    const engine = [
      "requestFullscreen",
      "webkitRequestFullscreen",
      "mozRequestFullScreen",
      "msRequestFullscreen",
    ].find((engine) => this.video[engine]);

    if (!engine) return;

    this.btns.fullscreen.addEventListener("click", (e) => {
      e.preventDefault();

      this.video[engine]();
    });
  }
}

export default Video;
