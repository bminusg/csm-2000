const glob = require("glob");
const { v4: uuidv4 } = require("uuid");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const Services = require("./helpers/Services");
const creative = require("./Creative");

class Project extends Services {
  constructor() {
    super();

    this.entrypoints = {};
    this.pluginHTMLOptions = [];

    this.loadData();
  }

  async loadData() {
    try {
      const data = require("../json/projects.json");

      if (!data) throw new Error();
      this.data = data;
    } catch (error) {
      console.log(error);
      this.data = null;
    }

    this.defineEntrypoints();
  }

  create(input) {
    const date = new Date();

    let newProject = {
      id: uuidv4(),
      created_at: date,
      updated_at: date,
      brand: input.brand,
      campaign: {
        name: input.campaign.name,
        slug: input.campaign.slug,
        goal: "",
        type: "",
        category: input.campaign.category || "",
        planning: {
          start: date,
          end: new Date(date.getTime() + 2592000000),
        },
      },
      assignee: {
        mail: "",
        role: "",
        firstName: "",
        familyName: "",
      },
      briefing: {
        assets: [],
        styleguide: "",
        description: "",
      },
      creatives: [],
    };

    for (const creativeItem of input.creatives) {
      const newCreativeItems = creativeItem.format.components
        ? creative.createComposite(newProject, creativeItem)
        : creative.create(newProject, creativeItem);
    }

    this.data.push(newProject);
    this.save();

    return newProject;
  }

  defineEntrypoints() {
    this.entrypoints = {};
    const localCreativeSlugs = glob.sync("./projects/**/main.js");

    for (const path of localCreativeSlugs) {
      const slug = path.split("/").splice(-2)[0];
      const project = this.read({ "creatives.slug": slug });

      if (!project) continue;

      Object.assign(this.entrypoints, { [slug]: path });

      const creative = project.creatives.find(
        (creative) => creative.slug === slug
      );

      this.pluginHTMLOptions.push({
        filename: slug + "/index.html",
        hash: true,
        chunks: [slug],
        template: "./src/template/hbs/index.html.hbs",
        templateParameters: {
          environment: "development",
          project: project,
          creative: creative,
          markup: `<h1>CSS is awesome</h1>`,
        },
      });
    }
  }

  defineHTMLPlugins() {
    const plugins = [];
    this.pluginHTMLOptions.forEach((option) => {
      plugins.push(new HtmlWebpackPlugin(option));
    });

    return plugins;
  }
}

module.exports = new Project();
