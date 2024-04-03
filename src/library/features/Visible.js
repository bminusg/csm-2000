import debounce from "../utils/debounce";

class Visible {
  constructor(config = {}) {
    this.horizon = config.horizon || 0.5;
  }

  load(creative) {
    // CHECK IF FRAME IS TOPFRAME
    if (window.top === window) return window.Creative?.startAnimation();

    // MESSAGE LISTENERS
    window.addEventListener("message", this.debounceCheck());
  }

  debounceCheck() {
    return debounce(this.check.bind(this), 300); // Adjust the delay as needed (200ms in this example)
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
