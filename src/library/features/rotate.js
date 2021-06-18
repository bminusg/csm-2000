class Rotate {
  constructor(config = {}) {
    // REQUIRED CONFIG
    this.triggers = config.triggers;
    this.action = config.action;
    this.target = config.target || document.querySelector(".creative");

    // OPTIONAL CONFIG
    this.maxRounds = config.maxRounds || 0; // 0 === infinite
    this.autoRotate = config.autoRotate || false;
    this.loopTime = config.loopTime || [2500];
    this.delay = config.delay || 600;

    // LOOP CONFIG
    this.IDX = -1;
    this.round = 0;
  }

  init() {
    // DEFINE AUTOROTATE IF MAXROUNDS DEFINED
    if (this.maxRounds > 0) this.autoRotate = true;

    // INIT EVENT LISTENERS
    // BETTER DETECT IF TOUCH DEVICE
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
          // PREVENT BUBBLING
          const e = event.toElement || event.relatedTarget;
          if (e.parentNode == item || e == item) return;

          this.autoRotate = true;
          this.update();
        },
        false
      );
    });

    // INIT LOOP
    setTimeout(() => this.interval(), this.delay);
  }

  // MODIFY IDX VALUE
  interval() {
    this.IDX++;

    if (this.IDX === this.triggers.length) {
      this.round++;
      if (this.maxRounds === 0 || this.round < this.maxRounds) this.IDX = 0;
      else return this.reset();
    }

    this.update();
  }

  update() {
    this.reset();
    this.triggers[this.IDX].classList.add("active");
    this.action(this.triggers[this.IDX], this.target);

    // INIT NEXT INTERVAL
    if (!this.autoRotate) return;
    const loopTime = this.loopTime[this.IDX]
      ? this.loopTime[this.IDX]
      : this.loopTime[0];

    this.loop = setTimeout(() => this.interval(), loopTime);
  }

  reset() {
    this.triggers.forEach((item) => item.classList.remove("active"));
  }
}

export default Rotate;
