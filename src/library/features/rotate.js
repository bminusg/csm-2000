const rotate = {
  init(config = {}) {
    this.IDX = -1;
    this.round = 0;
    this.items = document.querySelectorAll(".rotate--item");
    this.container = document.querySelector(".rotate");

    // LOOP CONFIG
    this.loopTime = 2500;
    this.maxRounds = config.maxRounds || 0; // 0 === infinite
    this.delay = 1000;

    this.loop = setInterval(this.interval.bind(this), this.loopTime);

    // EVENT LISTENERS
    this.items.forEach((item, index) => {
      // MOUSEENTER
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
  },
  interval() {
    this.IDX++;

    if (this.IDX === this.items.length) {
      this.round++;
      if (this.maxRounds === 0 || this.round < this.maxRounds) this.IDX = 0;
      else {
        this.reset();
        return clearInterval(this.loop);
      }
    }

    this.update();
  },
  update() {
    this.reset();
    this.items[this.IDX].classList.add("active");
  },
  reset() {
    this.items.forEach((item) => item.classList.remove("active"));
  },
};
export default rotate;
