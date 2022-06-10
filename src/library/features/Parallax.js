/**
 * Parallax feature provides an opportunity to transform HTMLElements parallax using CSS variables like var(--parallax-00-x) on Mousemove Event
 * @param { Object } options - Parallax options object
 * @param { number[] } options.offset - adding/substract from mouse position [X,Y]
 * @param { number } options.maxOffset - max pixel amount for moving variable
 * @param { Object } options.crossSiteCommunication - dispatch custom crossSiteCommunictation event
 * @param { number[] } options.viewport - amount of viewport, [amount X, amount Y]
 * @param { number[] } options.parallaxRatios - calculation parallax pixel ratios, [0.2, 0.6, 0.9]
 *
 */

class Parallax {
  constructor(options = {}) {
    this.offset = options.offset || [0, 0];
    this.maxOffset = options.maxOffset || 50;
    this.crossSiteCommunication = options.crossSiteCommunication || undefined;
    this.viewport = options.viewport || [window.innerWidth, window.innerHeight];
    this.vanishingPoints = [null, null];
    this.root = document.querySelector(":root");
    this.parallaxRatios = options.parallaxRatios || [0.2, 0.6, 0.9];
  }

  init() {
    this.defineVanishingPoints();

    window.addEventListener(
      "mousemove",
      (event) => {
        event.preventDefault();
        //console.log("CLIENTX", event.clientX);
        this.throttle(this.calcPosition(event.clientX, event.clientY));
      },
      true
    );
  }

  // COPIED FROM: https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
  throttle(func, limit = 1500) {
    this.lastFunc;
    this.lastRan;

    return function () {
      const context = this;
      const args = arguments;

      if (!lastRan) {
        func.apply(context, args);
        this.lastRan = Date.now();
      } else {
        clearTimeout(this.lastFunc);
        this.lastFunc = setTimeout(function () {
          if (Date.now() - this.lastRan >= limit) {
            func.apply(context, args);
            this.lastRan = Date.now();
          }
        }, limit - (Date.now() - this.lastRan));
      }
    };
  }

  defineVanishingPoints() {
    const x = parseInt(this.viewport[0]) / 2;
    const y = parseInt(this.viewport[1]) / 2;

    this.ratioOffsetX = this.maxOffset / x;
    this.ratioOffsetY = this.maxOffset / y;

    this.vanishingPoints = [x, y];
  }

  calcPosition(X = 0, Y = 0) {
    const positionX = X - this.offset[0];
    const positionY = Y - this.offset[1];

    this.changePosition(positionX, positionY);

    if (!this.crossSiteCommunication) return;

    const event = new CustomEvent("crossSiteCommunication", {
      detail: {
        targets: this.crossSiteCommunication.targets,
        method: this.crossSiteCommunication.method,
        data: [positionX, positionY],
      },
    });

    window.Creative.container.dispatchEvent(event);
  }

  changePosition(X, Y) {
    const offsetX = Math.ceil(X - this.vanishingPoints[0]);
    const offsetY = Math.ceil(Y - this.vanishingPoints[1]);

    this.parallaxRatios.forEach((ratio, index) => {
      const moveX = offsetX * this.ratioOffsetX * ratio;
      const moveY = offsetY * this.ratioOffsetY * ratio;

      this.root.style.setProperty("--parallax-0" + index + "-x", moveX);
      this.root.style.setProperty("--parallax-0" + index + "-y", moveY);
    });
  }

  updateOffset(offset = []) {
    offset.forEach((value, index) => {
      this.offset[index] = value;
    });

    this.defineVanishingPoints();
  }
}

export default Parallax;
