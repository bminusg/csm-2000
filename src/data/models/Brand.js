const Services = require("./helpers/Services");

class Brand extends Services {
  constructor() {
    super();

    this.load();
  }

  async load() {
    try {
      const data = require("../json/brands.json");

      if (!data) throw new Error("Can't load data");
      this.data = data;
    } catch (error) {
      console.log(error);
      this.data = null;
    }
  }
}

module.exports = new Brand();
