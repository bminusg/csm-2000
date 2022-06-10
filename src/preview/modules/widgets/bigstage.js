import Video from "src/library/features/Video";
import "../../sass/widgets/bigstage.sass";

export default {
  init(widgets) {
    const bigstage = widgets.find((widget) => widget.type === "bigstage");
    const billboard = widgets.find((widget) => widget.type === "billboard");
    const sitebars = widgets.filter((widget) => widget.type === "sitebar");

    // VALIDATE
    if (!billboard)
      throw new Error("Big Stage: Billboard component is missing", "error");

    if (!sitebars)
      throw new Error("Big Stage: Sitebar components are missing", "error");

    if (sitebars.length !== 2)
      throw new Error("Big Stage: 2 Sitebar creatives are required", "error");

    // DEFINE VIDEO
    const video = new Video({
      fileURLs: [bigstage.redirect],
      parentContainer: bigstage.container,
      poster:
        "https://mics.bild.de/media/2022/mercedes/mercedes_weltpremieree_bigstage_01/teaser--poster.jpg",
      classNames: "widget--bigstage-video",
      isAutoplay: true,
    });

    video.init();

    // DEFINE HTML ELEMENTS
    const publisher = document.querySelector(".publisher");

    // APPEND EVENT LISTENERS
    video.video.addEventListener("loadstart", (event) => {
      event.preventDefault();
      const navHeight = document.querySelector(".publisher--nav").clientHeight;

      publisher.style.transition = "transform 2s cubic-bezier(0.25, 1, 0.5, 1)";
      publisher.style.transform =
        "translateY(" + (window.innerHeight - navHeight - 50) + "px)";
    });

    video.video.addEventListener("ended", (event) => {
      event.preventDefault();
      publisher.style.transform = "translateY(0px)";

      setTimeout(() => {
        const reminderWidgets = sitebars.concat([billboard]);
        reminderWidgets.forEach((widget) => widget.loadIframe());
        bigstage.container.style.display = "none";
      }, 2000);
    });

    video.video.addEventListener("click", (event) => {
      event.preventDefault();
      bigstage.openClicktag();
    });
  },
};
