class Rotate {
  constructor(config = {}) {
    // REQUIRED CONFIG
    this.triggerClassName = config.triggers;
    this.triggers = document.querySelectorAll(this.triggerClassName);
    this.slideCount = config.slideCount || null;

    // OPTIONAL CONFIG
    this.target = config.target || "body";
    this.action = config.action || this.defaultAction;
    this.maxRounds = config.maxRounds || 0; // 0 === infinite
    this.autoRotate = config.autoRotate || false;
    this.loopTime = config.loopTime || [2500];
    this.delay = config.delay || 600;
    this.datasets = config.datasets || [];
    this.mouseoverEvent =
      config.mouseoverEvent === undefined ? true : config.mouseoverEvent;

    // CLICK CONTROLLER
    this.clickControllers = config.clickControllers || "";

    // LOOP CONFIG
    this.IDX = -1;
    this.round = 0;
  }

  init() {
    // RETURN IF NO MARKUP TRIGGERS DEFINED
    if (!this.slideCount && this.triggers.length === 0) {
      console.error(
        "Required fields are missing. Please provide at leat one of this options: slideCount or triggers"
      );
      return;
    }

    // SETTING THE SLIDE COUNT IN CASE WE ARE USING HTML ELEMENTS AS A TRIGGER
    if (this.triggers.length > 0) this.slideCount = this.triggers.length;

    // DEFINE TARGET
    this.target = document.querySelector(this.target);

    // DEFINE AUTOROTATE IF MAXROUNDS DEFINED
    if (this.maxRounds > 0) this.autoRotate = true;

    // INIT CLICK CONTROL
    if (!this.clickControllers == "") this.appendControllerEvents();

    // INIT EVENT LISTENERS
    if (this.mouseoverEvent) this.appendMouseoverEvent();

    // INIT LOOP
    setTimeout(() => this.interval(), this.delay);
  }

  // MODIFY IDX VALUE
  interval(direction = "next") {
    if (direction === "next") this.IDX++;
    else this.IDX--;

    if (this.IDX === this.slideCount) {
      this.round++;
      if (this.maxRounds === 0 || this.round < this.maxRounds) this.IDX = 0;
      else return this.reset();
    }

    if (this.IDX < 0) this.IDX = this.slideCount - 1;

    if (this.IDX > this.slideCount) this.IDX = 0;

    this.update();
  }

  defaultAction(trigger, target) {
    const dataset = { ...trigger.dataset };

    for (const data in dataset) {
      const value = dataset[data];
      target.dataset.stage = value;
      return;
    }
  }

  update() {
    this.reset();

    if (this.triggers.length > 0) {
      this.triggers[this.IDX].classList.add("is--active");
      this.action(this.triggers[this.IDX], this.target);
    } else {
      this.target.dataset.stage = this.IDX;
    }

    if (!this.autoRotate) return;

    // INIT NEXT INTERVAL
    const loopTime = this.loopTime[this.IDX]
      ? this.loopTime[this.IDX]
      : this.loopTime[0];

    this.loop = setTimeout(() => this.interval(), loopTime);
  }

  reset() {
    this.triggers.forEach((item) => item.classList.remove("is--active"));

    // RESET DATASETS
    this.datasets.forEach((data) => {
      if (!data) return;

      this.target.dataset[data] = "";
    });
  }

  appendMouseoverEvent() {
    this.triggers.forEach((item, index) => {
      // MOUSEOVER
      item.addEventListener(
        "mouseenter",
        (event) => {
          clearTimeout(this.loop);

          this.IDX = index;
          this.autoRotate = false;
          this.update();
        },
        false
      );

      // MOUSEOUT
      item.addEventListener(
        "mouseout",
        (event) => {
          const e = event.toElement || event.relatedTarget;
          if (!e || e.parentNode == item || e == item) return;

          this.autoRotate = true;
          this.update();
        },
        false
      );
    });
  }

  appendControllerEvents() {
    const controllerElems = document.querySelectorAll(this.clickControllers);

    controllerElems.forEach((controller, idx) => {
      controller.addEventListener("click", (event) => {
        event.preventDefault();

        // DEFINE DIRECTION
        let direction = idx === 0 ? "previous" : "next";
        if (controller.dataset.direction)
          direction = controller.dataset.direction;

        // RESET AUTOROTATE
        this.autoRotate = false;

        // CLEAR LOOP
        clearTimeout(this.loop);

        // CALCULATE IDX
        this.interval(direction);
      });
    });
  }
}

export default Rotate;
