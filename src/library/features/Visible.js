class Visible {
  constructor(config = {}) {
    this.horizon = config.horizon || 0.5;
  }

  load(creative) {
    // CHECK IF FRAME IS TOPFRAME
    if (window.top === window) return window.Creative?.startAnimation();

    // MESSAGE LISTENERS
    window.addEventListener("message", (event) => {
      const data = event.data;
      const dataStringValuePair =
        typeof data === "string" ? data.split("=") : [];

      if (dataStringValuePair[0] === "isVisible") {
        const value = parseFloat(dataStringValuePair[1]);

        if (value >= this.horizon) {
          if (creative.isTweening) return;
          creative.startAnimation();
        } else {
          creative.resetAnimation();
        }
      }
    });
  }
}

export default Visible;
