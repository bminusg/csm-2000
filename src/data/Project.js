const glob = require("glob");
const { v4: uuidv4 } = require("uuid");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const Services = require("./helpers/Services");
const creative = require("./Creative");

class Project extends Services {
  constructor() {
    super();
    this.loadData();
  }

  async loadData() {
    try {
      const data = require("./json/projects.json");
      this.localCreativeSlugs = glob
        .sync("./projects/**/main.js")
        .map((path) => path.split("/").splice(-2, 1)[0]);

      if (!data) throw new Error();
      this.data = data;
    } catch (error) {
      this.data = [];
    }
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
    const entrypoints = {};
    const filteredProjects = this.getLocalProjectData();
    const creatives = filteredProjects
      .map((project) => project.creatives)
      .flat();

    for (const creative of creatives) {
      const path = glob.sync("./projects/**/" + creative.slug + "/main.js")[0];
      Object.assign(entrypoints, { [creative.slug]: path });
    }

    return entrypoints;
  }

  hasLocalEntrypoints(creative) {
    if (creative.components) {
      const project = this.read({ id: creative.projectID });

      for (const componentID of creative.components) {
        const componentCreative = project.creatives.find(
          (projectCreative) => projectCreative.id === componentID
        );

        if (componentCreative.format.type !== "RichMedia") continue;

        if (!this.hasLocalEntrypoints(componentCreative)) return false;
      }

      return true;
    } else if (this.localCreativeSlugs.indexOf(creative.slug) > -1) {
      return true;
    }

    return false;
  }

  defineHTMLPlugins() {
    const plugins = [];
    const filteredProjects = this.getLocalProjectData();

    for (const project of filteredProjects) {
      for (const creative of project.creatives) {
        const option = {
          filename: creative.slug + "/index.html",
          hash: true,
          chunks: [creative.slug],
          template: "./src/template/hbs/index.html.hbs",
          templateParameters: {
            environment: "development",
            project: project,
            creative: creative,
            markup: `<h1>CSS is awesome</h1>`,
          },
        };

        plugins.push(new HtmlWebpackPlugin(option));
      }
    }

    return plugins;
  }

  /**
   * Return filtered project data which is locally accessable
   * @return {Array} Array of project data and filtered creatives
   */
  getLocalProjectData() {
    const localProjectData = [];
    const localCreativePaths = glob.sync("./projects/**/main.js");
    const localCreativeSlugs = localCreativePaths.map(
      (path) => path.split("/").splice(-2)[0]
    );

    for (const slug of localCreativeSlugs) {
      const localCreativeData = localProjectData
        .map((project) => project.creatives)
        .flat()
        .map((creative) => creative.slug);

      if (localCreativeData.indexOf(slug) > -1) continue;

      let project = this.read({ "creatives.slug": slug });
      if (!project) continue;

      const filteredCreatives = project.creatives.filter(
        (creative) => localCreativeSlugs.indexOf(creative.slug) > -1
      );

      project.creatives = filteredCreatives;
      localProjectData.push(project);
    }

    return localProjectData;
  }
}

module.exports = new Project();
