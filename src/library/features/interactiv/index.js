class Interactive {
  constructor(options) {
    // REQUIRED
    this.type = options.type;
    this.triggers = options.triggers;
    this.target = options.target;

    // OPTIONAL
    this.crossFrame = options.crossFrame || false;
    this.autoRotate = options.autoRotate || true;
    this.delay = options.delay || 1000;
    this.loopTime = options.loopTime || 4000;
    this.action = options.action;

    // NODE ELEMENTS
  }

  // INIT FUNCTION
  init() {
    console.log(this);
    if (!this.type || !this.triggers || !this.target)
      throw new Error("Required options are missing");

    if (this.type === "click") this.clickAction();
  }

  // ACTIONS
  clickAction() {
    for (const trigger of this.triggers) {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        console.log(this.action(this.target, trigger.dataset.value));
      });
    }
  }
}

export default Interactive;
