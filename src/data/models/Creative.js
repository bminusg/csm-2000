const { v4: uuidv4 } = require("uuid");
const shortme = require("shortme");

class Creative {
  constructor() {}

  create(project = {}, options) {
    const size =
      options.format.width > 0
        ? `${options.format.width}x${options.format.height}`
        : "";
    const version = this.defineVersion(project.creatives, options);

    const creative = {
      id: uuidv4(),
      projectID: project.id,
      caption: options.caption,
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

    return creative;
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
}

module.exports = new Creative();
