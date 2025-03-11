import "../sass/widgets/flowad.sass";

export default {
  scrollStart: 0,

  init(widgets) {
    this.flowAdWidget = widgets.find((widget) => widget.type === "flowad");
    this.flowAdWidget.loadIframe();

    this.appendScrollListener();
  },

  appendScrollListener() {
    const scrollElement = document.querySelector(".scroll") ?? document.body;

    scrollElement.addEventListener("scroll", this.scrollEvent.bind(this));
    window.addEventListener("resize", () => {
      this.calcScrollVars(scrollElement).bind(this);
      this.calcDimensions(scrollElement).bind(this);
    });

    this.calcScrollVars(scrollElement);
    this.calcDimensions(scrollElement);
  },
  calcDimensions(viewport) {
    const { container, iframe } = this.flowAdWidget;
    const viewportHeight = viewport.clientHeight - 64;

    container.style.height = viewportHeight * 5 + "px";
    iframe.style.height = viewportHeight + "px";
  },
  calcScrollVars() {
    const { container, iframe } = this.flowAdWidget;

    this.scrollTopMax = container.scrollHeight - iframe.scrollHeight;
    this.scrollHeight = container.scrollHeight;
    this.scrollStart = container.offsetTop;
  },
  scrollEvent(event) {
    const iframeWindow = this.flowAdWidget?.iframe.contentWindow;
    let { scrollTop } = event.target;

    if (!iframeWindow || !this.scrollStart) return;

    scrollTop = scrollTop - this.scrollStart;
    if (scrollTop <= 0) return;

    iframeWindow.postMessage({
      sender: "flowad",
      scrollTop,
      scrollHeight: this.scrollHeight,
      scrollTopMax: this.scrollTopMax,
    });
  },
};
