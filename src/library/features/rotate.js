class Rotate {
  constructor(config = {}) {
    // REQUIRED CONFIG
    this.triggers = config.triggers;
    this.action = config.action;
    this.target = config.target || document.querySelector(".creative");

    // OPTIONAL CONFIG
    this.maxRounds = config.maxRounds || 0; // 0 === infinite
    this.loopTime = config.loopTime || 2500;
    this.autoRotate = config.autoRotate || false;

    // LOOP CONFIG
    this.IDX = -1;
    this.round = 0;

    // INIT ROTATE
    this.init();
  }

  init() {
    // INIT LOOP
    this.loop = setInterval(this.interval.bind(this), this.loopTime);

    // EVENT LISTENERS
    // BETTER DETECT IF TOUCH DEVICE
    this.triggers.forEach((item, index) => {
      // MOUSEOVER
      item.addEventListener("mouseover", () => {
        clearInterval(this.loop);
        this.IDX = index;
        this.update();
      });

      // MOUSEOUT
      item.addEventListener("mouseout", () => {
        this.loop = setInterval(this.interval.bind(this), this.loopTime);
      });
    });
  }

  interval() {
    this.IDX++;

    if (this.IDX === this.triggers.length) {
      this.round++;
      if (this.maxRounds === 0 || this.round < this.maxRounds) this.IDX = 0;
      else {
        this.reset();
        return clearInterval(this.loop);
      }
    }

    this.update();
  }

  update() {
    this.reset();
    this.triggers[this.IDX].classList.add("active");
    this.action(this.triggers[this.IDX], this.target);
  }

  reset() {
    this.triggers.forEach((item) => item.classList.remove("active"));
  }
}

export default Rotate;
