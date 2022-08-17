import Slider from "./Slider";

class Swipe extends Slider {
  constructor(config = {}) {
    super();
  }

  init() {
    console.log("INIT SWIPER");

    const h1 = document.querySelector("h1");
    const slides = document.querySelectorAll(".creative--slider-item");
    const isTouchDevice =
      "ontouchstart" in window || navigator.msMaxTouchPoints > 0 ? true : false;

    console.log("istouchDEVICE", "ontouchstart" in window);
    console.log("istouchDEVICE", navigator.maxTouchPoints > 0);
    console.log("istouchDEVICE", navigator.msMaxTouchPoints > 0);

    const startEvent = isTouchDevice ? "touchstart" : "mousedown";
    const moveEvent = isTouchDevice ? "touchmove" : "mousemove";
    const endEvent = isTouchDevice ? "touchend" : "mouseup";

    let isDragging = false;
    let moveXStart = null;
    let offsetX = null;

    this.swipeShow.addEventListener(
      startEvent,
      (event) => {
        event.preventDefault();

        console.log("START");

        isDragging = true;

        if (isTouchDevice) {
          moveXStart = event.targetTouches[0].clientX;
        }

        return;
      },
      false
    );

    this.swipeShow.addEventListener(
      moveEvent,
      (event) => {
        event.preventDefault();
        if (!isDragging) return;

        console.log("MOVE");
        const moveX = isTouchDevice
          ? event.targetTouches[0].clientX
          : event.clientX;

        offsetX = Math.abs(moveX, moveXStart);
        h1.innerHTML = offsetX;
      },
      false
    );

    this.swipeShow.addEventListener(
      endEvent,
      (event) => {
        event.preventDefault();
        isDragging = false;

        console.log("END");
      },
      true
    );
  }
}

export default Swipe;
