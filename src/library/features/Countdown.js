class Countdown {
  constructor(options = {}) {
    // CUSTOM OPTIONS
    this.endDate = new Date(options.endDate);
    this.container = options.container
      ? document.querySelector(options.container)
      : document.querySelector("body");

    // DEFAULT OPTIONS
    this.values = {
      weeks: null,
      days: null,
      hours: null,
      minutes: null,
      seconds: null,
    };
  }
  init() {
    this.createMarkup();
    this.drawCountdown();
    this.loop = setInterval(this.drawCountdown.bind(this), 1000);
  }
  createMarkup() {
    this.markup = {};

    const countdown = document.createElement("div");
    countdown.classList.add("countdown");

    for (const value in this.values) {
      const div = document.createElement("div");
      div.classList.add("countdown--" + value);

      const span = document.createElement("span");
      span.classList.add("countdown--" + value + "-value");
      span.innerHTML = "00";

      div.appendChild(span);

      Object.assign(this.markup, { [value]: span });
      countdown.appendChild(div);
    }

    this.container.appendChild(countdown);
  }
  calcOffsetValues() {
    let offset = this.endDate.getTime() - new Date().getTime();
    const msUnites = {
      weeks: 604800000,
      days: 86400000,
      hours: 3600000,
      minutes: 60000,
      seconds: 1000,
    };

    for (const unit in msUnites) {
      const divider = msUnites[unit];
      const unitValue = Math.floor(offset / divider);

      this.values[unit] = unitValue;
      offset = offset - unitValue * divider;
    }
  }

  drawCountdown() {
    this.calcOffsetValues();

    for (const value in this.values) {
      const stringValue = this.values[value].toString();

      const htmlValue =
        stringValue.length === 1 ? "0" + stringValue : stringValue;

      this.markup[value].innerHTML = htmlValue;
    }
  }
}

export default Countdown;
