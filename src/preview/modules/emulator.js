import formats from "src/data/json/formats.json";

class Emulator {
  constructor(params) {
    // META
    this.params = params;
    this.formats = formats;

    // ELEMENTS
    this.app = document.querySelector("#app");
    this.root = document.querySelector(":root");
    this.publisher = document.querySelector(".publisher");

    // EMULATE
    this.sizes = ["S", "M", "XL"];
    this.devices = ["phone", "tablet", "desktop", "tv", "foldable"];

    this.init();
  }

  init() {
    if (this.params.publisher) this.definePublisher();
    this.defineViewport();
  }

  defineViewport() {
    if (this.checkFormatDevices("phone")) {
      this.publisher.classList.add("scroll");
      this.app.dataset.device = "phone";

      this.root.style.setProperty(
        "--scrollbar--width",
        this.publisher.offsetWidth - this.publisher.clientWidth + "px"
      );

      return;
    }
  }

  async definePublisher() {
    const publisher = await import(
      /* webpackChunkName: "publisher--[request]" */ `../publishers/${this.params.publisher}`
    );

    this.app.dataset.publisher = this.params.publisher;
    publisher.default();
  }

  checkFormatDevices(deviceType = "") {
    const paramKeys = Object.keys(this.params);
    const deviceFilteredFormats = this.formats.filter(
      (format) =>
        format.devices &&
        format.devices.includes(deviceType) &&
        paramKeys.includes(format.slug)
    );

    if (deviceFilteredFormats.length > 0) return true;
    return false;
  }
}

export default Emulator;
