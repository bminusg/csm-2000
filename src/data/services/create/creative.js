const { v4: uuidv4 } = require("uuid");
const shortme = require("shortme");

module.exports = (input, customCreatives = false) => {
  const newCreatives = [];
  const creatives = customCreatives ? customCreatives : input.creatives;

  for (const creative of creatives) {
    const size =
      creative.format.width > 0
        ? `${creative.format.width}x${creative.format.height}`
        : "";
    const version = creative.version
      ? ("0" + creative.version).slice(-2)
      : "01";

    newCreatives.push({
      id: uuidv4(),
      slug: shortme(
        `${input.brand.slug} ${input.campaign.slug} ${creative.format.slug} ${size} ${version}`,
        {
          maxCharLength: 128,
          protect: [input.brand.slug, creative.format.slug, version],
        }
      ),
      caption: creative.caption,
      version: parseInt(version),
      format: creative.format,
      adserver: "",
      state: "production",
      tracking: {
        clicktags: [],
        impressions: [],
      },
    });
  }

  return newCreatives;
};
