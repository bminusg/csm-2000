const { v4: uuidv4 } = require("uuid");
const shortme = require("shortme");

class Creative {
  constructor() {}

  create(project = {}, options) {
    const size =
      options.format.width > 0
        ? `${options.format.width}x${options.format.height}`
        : "";
    const version = options.version ? ("0" + options.version).slice(-2) : "01";

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
      version: options.version || 1,
      adserver: options.adserver || "",
      state: options.state || "",
      trackings: {},
      format: options.format,
    };

    return creative;
  }
}

module.exports = new Creative();
