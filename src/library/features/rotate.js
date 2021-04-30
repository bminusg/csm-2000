const rotate = {
  init(config = {}) {
    this.IDX = -1;
    this.items = document.querySelectorAll(".rotate--item");
    this.container = document.querySelector(".rotate");

    this.loopTime = 4000;
    this.delay = 1000;

    this.loop = setInterval(() => {
      this.IDX++;
      if (this.IDX === this.items.length) this.IDX = 0;

      this.update();
    }, this.loopTime);

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
        this.loop = setInterval(() => {
          this.IDX++;
          if (this.IDX === this.items.length) this.IDX = 0;

          this.update();
        }, this.loopTime);
      });
    });
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
