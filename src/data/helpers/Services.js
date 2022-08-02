// NODE MODULES
const fs = require("fs");
const path = require("path");

/**
 * Services
 * @namespace Services
 *
 */
class Services {
  /**
   * @function read
   * @memberof Services
   * @param {Object||String<ID>} query for deep search use Object key with separated by "." defines scope where to search
   * @returns {Object}
   */

  read(query = false) {
    let items = [];

    if (!query) return this.data;

    const queryKeys = Object.keys(query).map((keys) => keys.split("."))[0];
    const queryValue = Object.values(query)[0];

    if (queryKeys.length === 1) {
      items = this.data.find((project) => project[queryKeys[0]] === queryValue);
      return items;
    } else {
      items = this.data.filter((data) => {
        const results = data[queryKeys[0]]
          .map((item) => item[queryKeys[1]])
          .filter((value) => value === queryValue);

        if (results.length > 0) return data;
      });

      return items[0];
    }
  }

  /**
   * UPDATE SERVICE
   * @param {String} id
   * @param {Object} query
   */

  update(id, query) {
    const item = this.read({ id: id });
    if (!item) throw new Error("Can't find Item with ID: " + id);

    const keys = Object.keys(query);

    for (const key of keys) {
      const queryValue = query[key];

      if (Array.isArray(queryValue)) {
        const subitemIDs = item[key].map((subitem) => subitem.id);

        for (const value of queryValue) {
          if (subitemIDs.indexOf(value.id) > -1)
            throw new Error(
              "UPDATE EXCISTING ITEM LOGIC DO NOT EXCIST AT THE MOMENT"
            );

          item[key].push(value);
        }
      } else {
        item[key] = queryValue;
      }
    }

    // UPDATE LOCAL JSON FILE
    const dataIDX = this.data.findIndex((dataItem) => dataItem.id === id);
    this.data[dataIDX] = item;
    this.save();

    return item;
  }

  /**
   * DELETE SERVICE
   * @param {*} id
   */

  delete(id) {}

  /**
   *
   * WRITE LOCAL JSON FILE
   */

  save(route = "projects") {
    if (typeof route !== "string")
      throw new Error("ROUTE PARAMETER (" + route + ") HAS TO BE A STRING");

    const URI = path.join(
      process.cwd(),
      "src",
      "data",
      "json",
      route + ".json"
    );

    fs.writeFile(URI, JSON.stringify(this.data, null, 2), (err) => {
      if (err) throw new Error(err);
    });
  }
}

module.exports = Services;
