const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const shortme = require("shortme");
const projectURI = process.cwd() + "/src/data/projects.json";
const projectData = require(projectURI);

function createCreatives(input) {
  const newCreatives = [];

  for (const creative of input.creatives) {
    newCreatives.push({
      id: uuidv4(),
      slug: shortme(
        `${input.brand.slug} ${input.campaign.slug} ${creative.slug} ${creative.width}x${creative.height} 01`,
        { maxCharLength: 128, protect: [input.brand.slug, creative.slug, "01"] }
      ),
      caption: input.caption,
      version: 1,
      format: { ...creative },
      adserver: "",
      state: "production",
      tracking: {
        clicktags: [],
        impressions: [],
      },
    });
  }

  return newCreatives;
}

module.exports = (input) => {
  const date = new Date();
  const newProject = {
    id: uuidv4(),
    brand: input.brand,
    campaign: {
      name: input.campaign.name,
      slug: input.campaign.slug,
      goal: "",
      type: "",
      industry: "",
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
    creatives: createCreatives(input),
  };

  projectData.push(newProject);

  fs.writeFile(projectURI, JSON.stringify(projectData), (err) => {
    if (err) throw new Error(err);
  });

  return newProject;
};
