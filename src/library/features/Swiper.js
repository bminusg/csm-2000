class Swiper {
  constructor(config = {}) {
    this.IDX = -1;
    this.isDragging = false;
    this.isAutoRotate = true;
    this.breakpoints = [];
    this.delay = config.delay ?? 0;

    this.start = { x: null, y: null };
    this.end = { x: null, y: null };
    this.offset = { x: null, y: null };
    this.direction = { x: null, y: null };

    this.data = [];
    this.root = config.root ?? document.querySelector(".creative");
    this.itemWidth = config?.itemWidth ?? this.root.innerWidth;
  }

  init() {
    this.data = window.Creative?.data ?? [];

    this.data = window.Creative.data;
    this.container = document.querySelector("swiper");

    if (!this.container) this.defineContainer();
    else this.defineGestureEvents();
  }

  reset() {
    if (this.container) this.container.remove();

    clearTimeout(this.timeoutID);
    this.IDX = -1;

    const root = document.querySelector(":root");
    root.style.setProperty("--swiper-x", "0");
  }

  autoRotate() {
    if (!this.isAutoRotate) return;
    this.IDX++;

    this.lock(true);
    this.timeoutID = setTimeout(this.autoRotate.bind(this), 3500);
  }

  defineGestureEvents() {
    this.isTouchDevice =
      "ontouchstart" in window || navigator.msMaxTouchPoints > 0 ? true : false;

    this.calcFixPoints();
    this.initEventListeners();
  }

  initEventListeners() {
    const anchor = document.querySelector("a");

    // MOUSEVENTS
    anchor.addEventListener("mousedown", (event) => {
      anchor.removeAttribute("href");
      this.eventStart(event);
    });

    anchor.addEventListener(
      "mousemove",
      (event) => {
        this.eventMove(event);
      },
      true
    );

    anchor.addEventListener("mouseup", (event) => {
      this.eventEnd(event);

      if (this.isClick) {
        const clicktag = window.Creative.getClicktag(this.IDX);
        anchor.setAttribute("href", clicktag);
      }
    });

    anchor.addEventListener(
      "mouseleave",
      (event) => this.eventEnd(event),
      true
    );

    // TOUCH EVENTS
    anchor.addEventListener(
      "touchstart",
      (event) => this.eventStart(event),
      true
    );

    anchor.addEventListener(
      "touchmove",
      (event) => {
        this.eventMove(event);
      },
      true
    );

    anchor.addEventListener(
      "touchend",
      (event) => {
        this.eventEnd(event);
      },
      true
    );

    setTimeout(() => {
      this.autoRotate();
    }, this.delay);
  }

  eventStart(event) {
    if (this.isDragging) return;

    document.body.classList.add("is--dragging");
    this.isDragging = true;
    this.isClick = false;
    this.isAutoRotate = false;

    this.start.x = event.touches ? event.touches[0].clientX : event.clientX;
    this.start.y = event.touches ? event.touches[0].clientY : event.clientY;
    this.end.x = null;
    this.end.y = null;
    this.offset.x = 0;
    this.offset.y = 0;
  }

  eventMove(event) {
    if (!this.isDragging) return;

    const X = event.touches ? event.touches[0].clientX : event.clientX;
    const Y = event.touches ? event.touches[0].clientY : event.clientY;

    this.dragging(X, Y);
  }

  eventEnd(event) {
    document.body.classList.remove("is--dragging");
    this.isDragging = false;
    this.isClick = false;

    this.start.x = null;
    this.start.y = null;

    this.end.x = event.changedTouches
      ? event.changedTouches[0].clientX
      : event.clientX;

    this.end.y = event.changedTouches
      ? event.changedTouches[0].clientY
      : event.clientY;

    const { x, y } = this.offset;
    if (x <= 20 && y <= 20) this.isClick = true;
  }

  calcFixPoints() {
    const itemsCount = this.container.childElementCount;
    const containerWidth = this.itemWidth || this.root.offsetWidth;

    this.fixPoints = [];

    for (let i = 0; i < itemsCount; i++)
      this.fixPoints.push(containerWidth * i);
  }

  dragging(X, Y) {
    const startX = this.start.x;
    const startY = this.start.y;
    const directionX = startX <= X ? 1 : -1;
    const directionY = startY <= Y ? 1 : -1;
    const offsetX = Math.abs(startX - X);
    const offsetY = Math.abs(startY - Y);

    this.offset.x = offsetX;
    this.offset.y = offsetY;
    this.direction.x = directionX;
    this.direction.y = directionY;
    this.isAutoRotate = false;

    if (offsetX > 20) {
      this.isDragging = false;
      this.lock();
    }
  }

  lock(isAutoRotate = false) {
    const { x, y } = this.offset;

    if (x > 60 && !isAutoRotate) {
      if (this.direction.x < 0) this.IDX = this.IDX + 2;
      else this.IDX = this.IDX - 2;
    } else if (!isAutoRotate) {
      if (this.direction.x < 0) this.IDX++;
      else this.IDX--;
    }

    // LOOPABLE
    if (this.IDX >= this.fixPoints.length) this.IDX = 0;
    if (this.IDX < 0) this.IDX = this.fixPoints.length - 1;

    const root = document.querySelector(":root");
    const items = document.querySelectorAll("swiper-item");

    root.style.setProperty("--swiper-x", this.fixPoints[this.IDX] * -1);
    items?.forEach((item, itemKey) => {
      item.classList.remove("is--active");
      if (itemKey === this.IDX) item.classList.add("is--active");
    });
  }

  defineContainer() {
    const data = this.data;
    const swiper = document.createElement("swiper");
    swiper.classList.add("swiper");

    function createContentElements(itemKey, itemInput, contentItem) {
      const skipTypes = ["clicktag", "id", "actions"];
      let element = document.createElement("swiper-content-" + itemKey);

      element.setAttribute("draggable", false);
      element.classList.add(
        "swiper--content-item",
        "swiper--content-" + itemKey
      );

      if (typeof itemInput === "object") {
        const { type, src } = itemInput;
        if (!type) return;

        if (type.includes("image")) {
          const image = document.createElement("img");
          image.src = src;
          image.setAttribute("draggable", false);
          element.appendChild(image);
        }
      } else if (skipTypes.includes(itemKey)) {
        return;
      } else {
        element.innerHTML = itemInput;
      }

      contentItem.appendChild(element);
    }

    for (const [itemIndex, item] of data.entries()) {
      const itemElement = document.createElement("swiper-item");
      const contentItem = document.createElement("swiper-content");

      itemElement.classList.add("swiper--item", "swiper--item-" + itemIndex);

      contentItem.classList.add(
        "swiper--content",
        "swiper--content-" + itemIndex
      );

      contentItem.setAttribute("draggable", false);
      itemElement.setAttribute("draggable", false);

      Object.entries(item).forEach(([itemKey, itemInput]) =>
        this.createContentElements
          ? this.createContentElements(itemKey, itemInput, contentItem)
          : createContentElements(itemKey, itemInput, contentItem)
      );

      itemElement.appendChild(contentItem);
      swiper.appendChild(itemElement);
    }

    // DEFINE WRAPPER WIDTH
    swiper.style.width = `calc(100% * ${data.length})`;

    this.container = swiper;
    this.root.append(swiper);

    this.defineGestureEvents();
  }
}

export default Swiper;
