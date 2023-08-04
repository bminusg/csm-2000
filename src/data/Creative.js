const crypto = require("node:crypto");
const shortme = require("shortme");

class Creative {
  constructor() {}

  create(project = {}, options) {
    const version = this.defineVersion(project.creatives, options);
    const size =
      options.format.width > 0
        ? `${options.format.width}x${options.format.height}`
        : "";

    const creative = {
      id: crypto.randomUUID(),
      projectID: project.id,
      caption: options.caption || this.defineCaption(project),
      slug:
        options.slug ||
        shortme(
          `${project.brand.slug} ${project.campaign.slug} ${options.format.slug} ${size} ${version}`,
          {
            maxCharLength: 128,
            protect: [project.brand.slug, options.format.slug, version],
          }
        ),
      version: parseInt(version),
      adserver: options.adserver || "",
      state: options.state || "",
      trackings: {},
      format: options.format,
    };

    if (options.components) Object.assign(creative, { components: [] });

    project.creatives.push(creative);
    return creative;
  }

  createComposite(project, compositeOptions) {
    const composite = this.create(project, compositeOptions);
    const components = [];

    for (const component of compositeOptions.format.components) {
      if (component.format.type !== "RichMedia") continue;

      const creative = this.create(project, component);
      components.push(creative);
    }

    delete composite.format.components;
    composite.components = components.map((component) => component.id);

    components.push(composite);
    return components;
  }

  defineVersion(projectCreatives, options) {
    const previousFormats = projectCreatives.filter(
      (creative) =>
        creative.id &&
        creative.format.name === options.format.name &&
        creative.format.width === options.format.width &&
        creative.format.height === options.format.height
    );
    const version = 1 + previousFormats.length;

    return ("0" + version).slice(-2);
  }

  defineCaption(project) {
    const captions = project.creatives.map((creative) => creative.caption);
    return captions[0];
  }
}

module.exports = new Creative();
