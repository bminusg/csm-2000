class Filter {
  constructor(option = {}) {
    this.itemQuery = option.itemQuery || "li";
    this.inputID = option.inputID || null;
    this.display = option.display || "block";

    this.items = new Map();

    this.init();
  }

  init() {
    this.mapItems(this.itemQuery);

    if (this.inputID) this.appendInputWatcher();
  }

  mapItems(query) {
    if (!query) throw new Error("Missing item query");

    const items = document.querySelectorAll(query);

    for (const item of items) {
      const data = { ...item.dataset };
      const searchKeyString = Object.values(data).join(" ").toLowerCase();

      Object.assign(data, { searchKeys: searchKeyString });

      this.items.set(item, data);
    }
  }

  sort(searchValue = "") {
    this.removeAll();

    searchValue = searchValue.toLowerCase();

    for (const [item, data] of this.items.entries()) {
      const values = Object.values(data).join(" ");
      const match = values.match(searchValue);

      if (!match) continue;

      item.style.display = this.display;
    }
  }

  removeAll() {
    for (const DOMElement of this.items.keys()) {
      DOMElement.style.display = "none";
    }
  }

  appendInputWatcher() {
    const input = document.querySelector("#" + this.inputID);

    input.addEventListener("input", (event) => {
      setTimeout(() => {
        this.sort(event.target.value);
      }, 500);
    });
  }
}

export default Filter;
