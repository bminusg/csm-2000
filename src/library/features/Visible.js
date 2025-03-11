import debounce from "../utils/debounce";

class Visible {
  constructor(config = {}) {
    this.horizon = config.horizon || 0.5;
  }

  load(creative) {
    if (window.top === window) return window.Creative?.startAnimation();

    window.addEventListener("message", this.debounceCheck());
  }

  debounceCheck() {
    return debounce(this.check.bind(this), 200);
  }

  check(event) {
    const creative = window.Creative;
    const data = event.data;
    const dataStringValuePair = typeof data === "string" ? data.split("=") : [];

    if (dataStringValuePair[0] === "isVisible") {
      const value = parseFloat(dataStringValuePair[1]);

      if (value >= this.horizon) {
        if (creative.isTweening) return;
        creative.startAnimation();
      } else {
        if (!creative.isTweening) return;
        creative.resetAnimation();
      }
    }
  }
}

export default Visible;
