import "./sass/swiper.sass";

class Swiper {
  constructor(config = {}) {
    this.IDX = 0;
    this.isDragging = false;
    this.isAutoRotate = true;
    this.breakpoints = [];

    this.itemWidth = config.itemWidth || undefined;
    this.rootContainer = document.querySelector(
      config.rootContainer || ".creative"
    );

    this.start = { x: null, y: null };
    this.end = { x: null, y: null };
    this.offset = { x: null, y: null };

    if (!this.isAutoRotate) return;

    setTimeout(this.autoRotate.bind(this), 3500);
  }

  init() {
    this.container = document.querySelector("swiper");

    if (!this.container) this.defineContainer();
    this.defineGestureEvents();
  }

  autoRotate() {
    if (this.IDX === this.fixPoints.length - 1) return;

    this.IDX++;
    this.lock();

    setTimeout(this.autoRotate.bind(this), 3500);
  }

  defineGestureEvents() {
    this.isTouchDevice =
      "ontouchstart" in window || navigator.msMaxTouchPoints > 0 ? true : false;

    this.startEvent = this.isTouchDevice ? "touchstart" : "mousedown";
    this.moveEvent = this.isTouchDevice ? "touchmove" : "mousemove";
    this.endEvent = this.isTouchDevice ? "touchend" : "mouseup";

    this.initEventListeners();
  }

  initEventListeners() {
    this.calcFixPoints();
    const anchor = document.querySelector("a");

    anchor.addEventListener(
      this.startEvent,
      (event) => {
        event.preventDefault();
        if (this.isDragging) return;

        this.container.classList.add("is--dragging");
        this.isDragging = true;
        this.start.x = event.touches ? event.touches[0].clientX : event.clientX;
        this.end.x = null;
      },
      false
    );

    this.container.addEventListener(
      this.moveEvent,
      (event) => {
        event.preventDefault();
        if (!this.isDragging) return;

        this.dragging(event.touches ? event.touches[0].clientX : event.clientX);
      },
      false
    );

    anchor.addEventListener(
      this.endEvent,
      (event) => {
        event.preventDefault();
        if (!this.isDragging) return;

        this.container.classList.remove("is--dragging");
        this.isDragging = false;

        this.end.x = event.touches
          ? event.changedTouches[0].clientX
          : event.clientX;

        this.lock();

        if (this.start.x === this.end.x) {
          console.log("CLICKOUT");
          anchor.innerText = "CLICKOUT";
        }
      },
      false
    );

    anchor.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
      },
      false
    );

    this.container.addEventListener(
      "mouseleave",
      (event) => {
        event.preventDefault();

        if (!this.isDragging) return;

        this.container.classList.remove("is--dragging");
        this.isDragging = false;
        this.lock();
      },
      false
    );
  }

  calcFixPoints() {
    const itemsCount = this.container.childElementCount;
    const containerWidth = this.itemWidth || this.container.offsetWidth;

    this.fixPoints = [];
    this.horizon = containerWidth / 3;

    for (let i = 0; i < itemsCount; i++)
      this.fixPoints.push(containerWidth * i);
  }

  dragging(X) {
    const root = document.querySelector(":root");
    const startX = this.start.x;
    const direction = startX <= X ? 1 : -1;
    const offset = Math.abs(startX - X);
    const cssOffset = offset * direction + this.fixPoints[this.IDX] * -1;

    root.style.setProperty("--swiper-x", cssOffset);
    this.offset.x = cssOffset * -1;
  }

  lock() {
    const root = document.querySelector(":root");
    console.log("LOCK", this.offset.x);

    if (this.offset.x) {
      const closest = this.fixPoints.reduce((prev, curr) =>
        Math.abs(curr - this.offset.x) < Math.abs(prev - this.offset.x)
          ? curr
          : prev
      );
      this.IDX = this.fixPoints.indexOf(closest);
    }

    root.style.setProperty("--swiper-x", this.fixPoints[this.IDX] * -1);
  }

  defineContainer() {
    const data = window.Creative.data;
    const container = document.createElement("swiper");
    container.classList.add("swiper");

    if (!data.some((item) => item.swiper))
      return window.Creative.startAnimation();

    function createContentElements(itemKey, itemInput, contentItem) {
      let element = document.createElement("swiper-content-" + itemKey);
      element.classList.add(
        "swiper--content-item",
        "swiper--content-" + itemKey
      );

      if (typeof itemInput === "object") {
        Object.entries(itemInput).forEach(([innerKey, innerInput]) =>
          createContentElements(innerKey, innerInput, element)
        );
      } else if (itemKey === "href") {
        const href = window.Creative.clicktags[0]
          ? window.Creative.clicktags[0]
          : window.Creative.caption[0];

        element = document.createElement("a");
        element.setAttribute("href", href + "?redir=" + itemInput);
        element.setAttribute("target", "_blank");
        element.classList.add(
          "swiper--content-item",
          "swiper--content-" + itemKey
        );
      } else if (itemKey === "image") {
        element.style.backgroundImage = "url(" + itemInput + ")";
      } else {
        element.innerHTML = itemInput;
      }

      element.setAttribute("draggable", false);
      contentItem.appendChild(element);
    }

    for (const item of data) {
      const itemElement = document.createElement("swiper-item");
      const contentItem = document.createElement("swiper-content");

      itemElement.classList.add("swiper--item");
      contentItem.classList.add("swiper--content");

      Object.entries(item.swiper).forEach(([itemKey, itemInput]) =>
        createContentElements(itemKey, itemInput, contentItem)
      );

      itemElement.appendChild(contentItem);
      container.appendChild(itemElement);
    }

    this.container = container;
    this.rootContainer.append(container);

    window.Creative.startAnimation();
  }
}

export default Swiper;
