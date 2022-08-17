import "../sass/slider.sass";

class Slider {
  constructor(config = {}) {
    // NODE ELEMENTS
    this.container =
      document.querySelector(config.container) ||
      document.querySelector(".slider") ||
      document.querySelector("body");
    this.stage =
      document.querySelector(config.stage) || document.querySelector("body");

    // SLIDES
    this.slides = document.querySelectorAll(config.slides) || undefined;
    this.maxSlides = config.maxSlides || this.slides.length;

    // BULLETS
    this.bullets = [];
    this.showBullets = config.showBullets || false;
    this.bulletsClassName = config.bulletsClassName || "slider--bullets";
    this.bulletsContainer =
      document.querySelector(config.bulletsContainer) || undefined;

    // CONTROLLER
    this.navItems = document.querySelectorAll(config.navItems) || [];

    if (this.showBullets) this.initBullets();
    if (this.navItems.length > 0) this.initNavigation();

    // TOUCHDEVICE
    this.isTouchDevice =
      "ontouchstart" in window || navigator.msMaxTouchPoints > 0 ? true : false;

    // EVENTS
    this.startEvent = this.isTouchDevice ? "touchstart" : "mousedown";
    this.moveEvent = this.isTouchDevice ? "touchmove" : "mousemove";
    this.endEvent = this.isTouchDevice ? "touchend" : "mouseup";

    // OPTIONAL CONFIG
    this.maxRounds = config.maxRounds || 0; // 0 === infinite
    this.autoRotate = config.autoRotate || true;
    this.loopTimes = config.loopTimes || [2500];
    this.delay = config.delay || 600;

    // CUSTOM ACTION
    this.customAction = config.customAction || undefined;

    // LOOP CONFIG
    this.IDX = -1;
    this.IDXbefore = null;
    this.round = 0;

    // UPDATE CSS VARS
    this.root = document.querySelector(":root");
    this.root.style.setProperty("--slider-length", this.maxSlides);
  }

  init() {
    if (this.slides.length < 1 && !this.maxSlides)
      throw new Error(
        "Required input is missing. Please provide at least one config option: slides (class name for NodeList query) or maxSlides<Number>"
      );

    setTimeout(() => this.rotateIDX(), this.delay);
  }

  // MARKUP MANIPULATION

  initBullets() {
    const maxBullets = this.maxSlides - 1;
    const triggerEvent = this.isTouchDevice ? this.startEvent : "mouseenter";

    for (let index = 0; index <= maxBullets; index++) {
      const bullet = document.createElement("div");
      const bulletClassName = this.bulletsClassName + "-item";

      bullet.classList.add(
        bulletClassName,
        bulletClassName + "__" + ("0" + index).slice(-2)
      );

      bullet.addEventListener(
        triggerEvent,
        (event) => {
          event.preventDefault();
          clearTimeout(this.loop);

          this.autoRotate = false;
          this.IDX = index;
          this.goToSlide(index);
        },
        false
      );

      bullet.addEventListener(
        "mouseout",
        (event) => {
          const e = event.toElement || event.relatedTarget;
          if (!e || e.parentNode == bullet || e == bullet) return;

          this.autoRotate = true;
          this.goToSlide();
        },
        false
      );

      this.bullets.push(bullet);
    }

    if (this.bulletsContainer)
      return this.bullets.forEach((bullet) =>
        this.bulletsContainer.appendChild(bullet)
      );

    const bullets = document.createElement("div");
    bullets.classList.add(this.bulletsClassName);

    this.bullets.forEach((bullet) => bullets.appendChild(bullet));
    this.container.appendChild(bullets);
  }

  initNavigation() {
    console.log("INIT NAV");
    this.navItems.forEach((controller, idx) => {
      controller.addEventListener(
        "click",
        (event) => {
          event.preventDefault();
          clearTimeout(this.loop);
          this.autoRotate = false;

          const isNext = controller.dataset.dir === "previous" ? false : true;
          this.rotateIDX(isNext, true);
        },
        false
      );
    });
  }

  // ------------------- ROTATE LOGIC

  rotateIDX(isNext = true, preventMaxRounds = false) {
    const maxSlides = this.maxSlides - 1;
    this.IDXbefore = this.IDX;

    if (isNext) this.IDX++;
    else this.IDX--;

    if (this.IDX < 0) this.IDX = maxSlides;

    if (this.IDX > maxSlides) {
      this.round++;

      if (
        this.maxRounds === 0 ||
        this.round < this.maxRounds ||
        preventMaxRounds
      )
        this.IDX = 0;
      else return this.resetSlides();
    }

    this.goToSlide(this.IDX);
  }

  goToSlide(slideIDX) {
    this.resetSlides();

    if (!slideIDX) slideIDX = this.IDX;

    this.stage.setAttribute("slider-stage", slideIDX);

    const bullet = this.bullets[slideIDX];
    if (bullet) bullet.classList.add("is--active");

    const slide = this.slides[slideIDX];
    if (slide) slide.classList.add("is--active");

    if (!this.autoRotate) return;

    const loopTime = this.loopTimes[this.IDX]
      ? this.loopTimes[this.IDX]
      : this.loopTimes[0];

    this.loop = setTimeout(() => this.rotateIDX(), loopTime);
    this.root.style.setProperty("--slider-loop-time", loopTime / 1000 + "s");

    if (typeof this.customAction === "function")
      this.customAction(this.IDX, this.IDXbefore);
  }

  resetSlides() {
    this.bullets.forEach((bullet) => bullet.classList.remove("is--active"));
    this.stage.removeAttribute("slide-stage");

    this.slides.forEach((slide) => {
      slide.classList.remove("is--active");
      slide.offsetHeight;
    });
  }
}

export default Slider;
