class Video {
  constructor(options = {}) {
    this.video = options.video || undefined;
    this.fileURLs = options.fileURLs || [];
    this.parentContainer =
      options.parentContainer || document.querySelector("body");

    // VIDEO CONFIG
    this.isAutoplay = options.isAutoplay || false;
    this.isLooped = options.isLooped || false;

    this.classNames = options.classNames || "creative--video";

    // BUTTONS
    this.btns = {
      play: options.btnPlay || undefined,
      pause: options.btnPause || undefined,
      soundon: options.btnSoundOn || undefined,
      soundoff: options.btnSoundOff || undefined,
    };
  }

  init() {
    if (!this.video) this.buildPlayer();

    // APPEND EVENT LISTENERS
    this.addListeners();

    // AUTOPLAY
    if (this.isAutoplay) this.video.play();
  }

  addListeners() {
    const container = window.Creative
      ? window.Creative.container
      : this.parentContainer;

    // PAUSE
    this.video.addEventListener("pause", (e) => {
      container.dataset.playing = "0";
    });

    // CAN PLAY
    this.video.addEventListener("canplay", (e) => {
      //if (this.isAutoplay) this.video.play();
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

        if (btn === "play") {
          this.video.muted = false;
          this.video.play();
        }

        if (btn === "pause") {
          this.video.pause();
        }

        if (btn === "soundoff") this.video.muted = true;

        if (btn === "soundon") this.video.muted = false;
      });
    }
  }

  buildPlayer() {
    const video = document.createElement("video");

    // SRC TYPE

    this.fileURLs.forEach((fileURL) => {
      const source = document.createElement("source");
      //source.type = options.mimeType;
      //source.type = "video/mp4";
      source.src = fileURL;

      video.appendChild(source);
    });

    video.muted = true;
    video.playsInline = true;
    video.autoplay = this.isAutoplay;
    video.loop = this.isLooped;
    video.controls = false;
    video.disablePictureInPicture = false;
    //video.bitrate = options.bitrate;

    // DEFINE VIDEO ATTRIBUTES
    video.setAttribute("class", this.classNames);
    video.setAttribute("playsinline", true);
    video.setAttribute("preload", "metadata");

    if (this.isAutoplay) video.setAttribute("muted", true);
    if (this.isAutoplay) video.setAttribute("autoplay", true);

    // APPEND VIDEO CONTAINER

    this.video = video;
    this.parentContainer.appendChild(video);
  }
}

export default Video;
