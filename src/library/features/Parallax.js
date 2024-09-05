/**
 * Parallax feature provides an opportunity to transform HTMLElements parallax using CSS variables like var(--parallax-00-x) on Mousemove Event
 *
 * @param { Object } options - Parallax options object
 * @param { Object } options.viewportModifier - opportunity to modify window default width and height
 * @param { Function } options.viewportModifier.x - get viewport width as arguments and returns a number
 * @param { Function } options.viewportModifier.y - get viewport height as arguments and returns a number
 * @param { Object } options.offsetModifier - opportunity to modify offset default width and height
 * @param { Function } options.offsetModifier.x - get viewport width as arguments and returns a number
 * @param { Function } options.offsetModifier.y - get viewport height as arguments and returns a number
 * @param { number } options.maxOffset - max pixel amount for moving variable
 * @param { number[] } options.parallaxRatios - calculation parallax pixel ratios, [0.2, 0.6, 0.9]
 * @param { Boolean } options.crossSiteCommunication - dispatch custom crossSiteCommunictation event
 *
 */

class Parallax {
  constructor(options = {}) {
    this.viewport = { x: window.innerWidth, y: window.innerHeight };
    this.viewportModifier = options.viewportModifier || {};
    this.offset = { x: 0, y: 0 };
    this.offsetModifier = options.offsetModifier || {};
    this.maxOffset = options.maxOffset || 50;
    this.vanishingPoints = [null, null];
    this.parallaxRatios = options.parallaxRatios || [0.2, 0.6, 0.9];
    this.crossSiteCommunication = options.crossSiteCommunication || false;
    this.root = document.querySelector(":root");

    this.throttlePause;
  }

  init() {
    if (this.crossSiteCommunication) this.assignCrossSiteMethods();
    else this.defineMetrics();

    // EVENT LISTENERS
    this.reset();
    this.onMouseMove = this.onMouseMove.bind(this);
    window.addEventListener("mousemove", this.onMouseMove, true);

    window.addEventListener("resize", () => {
      if (!this.crossSiteCommunication) return;

      this.viewport = { x: window.innerWidth, y: window.innerHeight };
      this.defineMetrics();
    });
  }

  throttle(callback, time) {
    if (this.throttlePause) return;
    this.throttlePause = true;

    setTimeout(() => {
      callback();
      this.throttlePause = false;
    }, time);
  }

  onMouseMove(event) {
    event.preventDefault();

    this.throttle(() => {
      this.calcPosition(event.clientX, event.clientY);
    }, 50);
  }

  assignCrossSiteMethods() {
    const feature = window.Creative.features.find(
      (feat) => feat.name === "CrossSiteConnection"
    );

    if (feature) {
      Object.assign(feature.methods, {
        updateMetrics: this.updateMetrics.bind(this),
      });

      Object.assign(feature.methods, {
        changePosition: this.changePosition.bind(this),
      });
    }

    this.defineMetrics();
  }

  defineViewport(dimension = "x", value) {
    const modifier = this.viewportModifier[dimension];
    let unit = value[dimension] ? value[dimension] : this.viewport[dimension];

    if (modifier) unit = modifier(unit);

    this.viewport[dimension] = unit;

    this.root.style.setProperty(
      "--viewport-" + dimension,
      unit + parseInt(this.maxOffset) + "px"
    );

    return unit;
  }

  defineOffset(viewportValues = { x: undefined, y: undefined }) {
    const offsetDimensions = Object.keys(this.offset);

    for (let offsetDimension of offsetDimensions) {
      const modifier = this.offsetModifier[offsetDimension];
      const viewportValue = viewportValues[offsetDimension]
        ? viewportValues[offsetDimension]
        : this.viewport[offsetDimension];

      if (!modifier) continue;
      if (typeof modifier !== "function")
        throw new Error(
          "[" + this.frameID + "] Offset Modifier " + modifier,
          typeof modifier + " has to be a function"
        );

      this.offset[offsetDimension] = modifier(viewportValue);
    }

    // APPEND HALF OF MAX-OFFSET
    const offsetX = this.offset.x - this.maxOffset / 2;
    const offsetY = this.offset.y - this.maxOffset / 2;

    this.root.style.setProperty("--viewport-offset-x", offsetX + "px");
    this.root.style.setProperty("--viewport-offset-y", offsetY + "px");
  }

  defineMetrics(viewportValues = { x: undefined, y: undefined }) {
    const x = this.defineViewport("x", viewportValues);
    const y = this.defineViewport("y", viewportValues);

    this.defineOffset(viewportValues);

    this.ratioOffsetX = this.maxOffset / x;
    this.ratioOffsetY = this.maxOffset / y;
    this.vanishingPoints = [x / 2, y / 2];

    if (this.crossSiteCommunication) this.sendMetrics(x, y);
  }

  sendMetrics(viewportWidth, viewportHeight) {
    const event = new CustomEvent("crossSiteCommunication", {
      detail: {
        method: "updateMetrics",
        data: { viewportWidth, viewportHeight },
      },
    });

    window.Creative.container.dispatchEvent(event);
  }

  updateMetrics(data) {
    this.defineMetrics({ x: data.viewportWidth, y: data.viewportHeight });
  }

  calcPosition(X = 0, Y = 0) {
    const positionX = X - this.offset.x;
    const positionY = Y - this.offset.y;

    this.changePosition({ X: positionX, Y: positionY });

    if (!this.crossSiteCommunication) return;

    const event = new CustomEvent("crossSiteCommunication", {
      detail: {
        method: "changePosition",
        data: { X: positionX, Y: positionY },
      },
    });

    window.Creative.container.dispatchEvent(event);
  }

  changePosition({ X, Y }) {
    const offsetX = Math.ceil(X - this.vanishingPoints[0]);
    const offsetY = Math.ceil(Y - this.vanishingPoints[1]);

    this.parallaxRatios.forEach((ratio, index) => {
      const moveX = Math.floor(offsetX * this.ratioOffsetX * ratio);
      const moveY = Math.floor(offsetY * this.ratioOffsetY * ratio);

      this.root.style.setProperty("--parallax-0" + index + "-x", moveX);
      this.root.style.setProperty("--parallax-0" + index + "-y", moveY);
    });
  }

  reset() {
    window.removeEventListener("mousemove", this.onMouseMove, true);

    this.parallaxRatios.forEach((ratio, index) => {
      this.root.style.setProperty("--parallax-0" + index + "-x", 0);
      this.root.style.setProperty("--parallax-0" + index + "-y", 0);
    });
  }
}

export default Parallax;
