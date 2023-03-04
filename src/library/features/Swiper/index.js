import "./sass/swiper.sass";

class Swiper {
  constructor(config = {}) {
    this.IDX = 0;
    this.breakpoints = [];

    this.isDragging = false;
    this.moveXStart = null;
    this.offsetX = null;
    this.itemWidth = config.itemWidth || undefined;
    this.rootContainer =
      config.rootContainer || document.querySelector(".creative");
  }

  init() {
    this.container = document.querySelector("swiper");

    if (!this.container) this.defineContainer();
    this.defineGestureEvents();
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

    this.container.addEventListener(
      this.startEvent,
      (event) => {
        this.container.classList.add("is--dragging");
        this.isDragging = true;

        this.moveXStart = this.isTouchDevice
          ? event.targetTouches[0].clientX
          : event.clientX;
      },
      false
    );

    this.container.addEventListener(
      this.moveEvent,
      (event) => {
        event.preventDefault();

        if (!this.isDragging) return;

        const moveX = this.isTouchDevice
          ? event.targetTouches[0].clientX
          : event.clientX;

        this.dragging(moveX);
      },
      false
    );

    this.container.addEventListener(
      this.endEvent,
      (event) => {
        event.preventDefault();

        if (!this.isDragging) return;
        this.lock();
      },
      false
    );

    this.container.addEventListener(
      "mouseleave",
      (event) => {
        event.preventDefault();

        if (!this.isDragging) return;
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

  switchCheck(X) {
    const root = document.querySelector(":root");
    const startX = this.moveXStart;
    const direction = startX <= X ? 1 : -1;
    const offset = Math.abs(startX - X);
    const cssOffset = offset * direction + this.fixPoints[this.IDX] * -1;

    root.style.setProperty("--swiper-x", cssOffset);

    if (offset < 100) return false;

    this.IDX = this.IDX - direction;
    console.log("SWITCH TO", this.IDX);
    return true;
  }

  dragging(X) {
    this.isDragging = true;
    const isSwitch = this.switchCheck(X);
    console.log("IS SWITCH", isSwitch);
    if (isSwitch) this.lock();
  }

  lock() {
    this.container.classList.remove("is--dragging");
    this.isDragging = false;

    const root = document.querySelector(":root");
    const maxItems = this.fixPoints.length - 1;

    if (this.IDX < 0) this.IDX = 0;
    if (this.IDX > maxItems) this.IDX = maxItems;

    console.log("LOCK", this.IDX);
    console.log("LOCK", this.fixPoints);
    console.log("LOCK", this.fixPoints[this.IDX]);

    root.style.setProperty("--swiper-x", this.fixPoints[this.IDX] * -1);
  }

  defineContainer() {
    const data = window.Creative.data;
    const container = document.createElement("swiper");
    container.classList.add("swiper");

    if (!data) return window.Creative.startAnimation();

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

      contentItem.appendChild(element);
    }

    for (const item of data) {
      const itemElement = document.createElement("swiper-item");
      const contentItem = document.createElement("swiper-content");

      itemElement.classList.add("swiper--item");
      contentItem.classList.add("swiper--content");

      console.log("DATA ITEM", item);

      Object.entries(item).forEach(([itemKey, itemInput]) =>
        createContentElements(itemKey, itemInput, contentItem)
      );

      /*
      for (const [itemKey, itemInput] of Object.entries(item)) {
        if (typeof itemInput === "object") {
          const element = document.createElement("swiper-content-" + itemKey);
          element.appendChild(createDynamicContentElements(itemInput))
          contentItem.appendChild(element);
        } else if (itemKey === "href") {
          const element = document.createElement("a");
          const href = window.Creative.clicktags[0]
            ? window.Creative.clicktags[0]
            : window.Creative.caption[0];
  
          element.setAttribute("href", href + "?redir=" + itemInput);
          element.setAttribute("target", "_blank");
          element.classList.add(
            "swiper--content-item",
            "swiper--content-" + itemKey
          );
  
          contentItem.appendChild(element);
        } else if (itemKey === "image") {
          const element = document.createElement("swiper-content-" + itemKey);
          element.style.backgroundImage = "url(" + itemInput + ")";
        } else {
          const element = document.createElement("swiper-content-" + itemKey);
          element.classList.add(
            "swiper--content-item",
            "swiper--content-" + itemKey
          );
          
          element.innerHTML = itemInput;
          contentItem.appendChild(element);
        }
      }
      */

      itemElement.appendChild(contentItem);
      container.appendChild(itemElement);
    }

    this.container = container;
    this.rootContainer.append(container);

    window.Creative.startAnimation();
  }
}

export default Swiper;
