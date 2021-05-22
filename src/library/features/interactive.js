class Interactive {
  constructor(options) {
    // REQUIRED
    this.triggers = options.triggers;
    this.action = options.action;

    // OPTIONAL
    this.target = options.target || document.querySelector(".creative");
    this.type = options.type || "click";
    this.autoRotate = options.autoRotate || false;
    this.delay = options.delay || 1000;
    this.loopTime = options.loopTime || 4000;

    // INIT INTERACTIVITY
    this.init();
  }

  // INIT FUNCTION
  init() {
    if (!this.type || !this.triggers || !this.target)
      throw new Error("Required options are missing");

    if (this.type === "click") this.clickEvent();
  }

  // ADD EVENT LISTENERS
  clickEvent() {
    for (const trigger of this.triggers) {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        this.action(trigger, this.target);
      });
    }
  }
}

export { Interactive };
