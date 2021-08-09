class Video {
  constructor(options = {}) {
    this.fileURL = options.fileURL || ["media/spot.mp4"];
    this.type = options.type || "static";
    this.parent = options.parent || document.querySelector(".creative");
  }

  init() {
    const player = this.buildPlayer();
    this.parent.appendChild(player);
  }

  buildPlayer() {
    const video = document.createElement("video");

    // ASSET

    // SRC TYPE
    const source = document.createElement("source");
    //source.type = options.mimeType;
    source.type = "video/mp4";
    source.src = this.fileURL;

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
