class Video {
  constructor(options = {}) {
    this.video = options.video || document.querySelector("video") || null;
    this.isAutoplay = options.isAutoplay || false;

    // BUTTONS
    this.btns = {
      play: options.btnPlay || null,
      pause: options.btnPause || null,
      soundon: options.btnSoundOn || null,
      soundoff: options.btnSoundOff || null,
    };
  }

  init() {
    if (!this.video) throw new Error("MISSING VIDEO ELEMENT");

    // PARSE

    // APPEND EVENT LISTENERS
    this.addListeners();
  }

  addListeners() {
    const container =
      window.Creative.container || document.querySelector("body");
    // PAUSE
    this.video.addEventListener("pause", (e) => {
      container.dataset.playing = "0";
    });

    // CAN PLAY
    this.video.addEventListener("canplay", (e) => {
      if (this.isAutoplay) this.video.play();
    });

    // PLAY
    this.video.addEventListener("play", (e) => {
      container.dataset.playing = "1";
    });

    // VOLUME CHANGE
    this.video.addEventListener("volumechange", (event) => {
      const value = this.video.muted ? 0 : 1;
      container.dataset.muted = value;
    });

    // BUTTONS
    for (const btn in this.btns) {
      if (!this.btns[btn]) continue;

      this.btns[btn].addEventListener("click", (e) => {
        e.preventDefault();

        if (btn === "play" || btn === "pause") this.video[btn]();

        if (btn === "soundoff") this.video.muted = true;

        if (btn === "soundon") this.video.muted = false;
      });
    }
  }

  buildPlayer() {
    const video = document.createElement("video");

    // ASSET

    // SRC TYPE
    const source = document.createElement("source");
    //source.type = options.mimeType;
    source.type = "video/mp4";
    source.src = this.fileURLs;

    video.appendChild(source);

    // DEFINE VIDEO ATTRIBUTES
    //video.style.width = "100%";
    //video.style.height = widget.HEIGHT + "px";
    video.id = "creative--video";
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.controls = false;
    //video.bitrate = options.bitrate;

    video.setAttribute("muted", true);
    video.setAttribute("autoplay", true);
    video.setAttribute("playsInline", true);
    video.setAttribute("disablePictureInPicture", false);

    return video;
  }
}

export default Video;
