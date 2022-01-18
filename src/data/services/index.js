const createCreatives = require("./create/creative");
const createProject = require("./create/project");
const updateProject = require("./update/project");

class Service {
  constructor() {
    this.service = {
      create: {
        creatives: createCreatives.bind(this),
        projects: createProject.bind(this),
      },
      update: {
        projects: updateProject.bind(this),
      },
    };
  }
}

module.exports = Service;
