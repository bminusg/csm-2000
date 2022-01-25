// NODE MODULES
const fs = require("fs");
const path = require("path");

// DATA SOURCES
const brands = require("./json/brands.json");
const categories = require("./json/categories.json");
const formats = require("./json/formats.json");
const publishers = require("./json/publishers.json");

// SERVICES
const Service = require("./services");

class Data extends Service {
  constructor() {
    super();

    this.models = {
      brands: brands,
      categories: categories,
      formats: formats,
      projects: this.defineProjects(),
      publishers: publishers,
    };
  }

  defineProjects() {
    let module;

    try {
      module = require("./json/projects.json");
    } catch (e) {
      module = [];
    }

    return module;
  }

  async create(route = "projects", body = {}) {
    try {
      const createdItem = await this.service.create[route](body);

      this.models[route].push(createdItem);
      this.writeFile(route);

      return createdItem;
    } catch (e) {
      console.error(e);
    }
  }

  async read(route = "projects", query = {}) {
    try {
      const data = this.models[route];

      if (Object.keys(query).length === 0) return data;

      const searchKey = Object.keys(query)[0];
      const searchValue = Object.values(query)[0];
      const result = data.find((item) => item[searchKey] === searchValue);

      return result;
    } catch (e) {
      console.log(e);
    }
  }

  async update(route = "projects", targetID, query = {}) {
    console.log(this.models);
    try {
      const item = await this.read(route, { id: targetID });

      console.log("update item", item);
      const updatedItem = await this.service.update[route](item, query);

      this.models[route] = this.models[route].map((model) => {
        if (model.id === updatedItem) return updatedItem;
        return model;
      });

      this.writeFile(route);
      return updatedItem;
    } catch (e) {
      console.error(e);
    }
  }

  async delete() {
    console.log("DELETE");
  }

  async writeFile(route = "projects") {
    const URI = path.join(
      process.cwd(),
      "src",
      "data",
      "json",
      route + ".json"
    );

    fs.writeFile(URI, JSON.stringify(this.models[route], null, 2), (err) => {
      if (err) throw new Error(err);
    });
  }
}

module.exports = new Data();
