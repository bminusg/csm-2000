const { v4: uuidv4 } = require("uuid");
const createCreatives = require("./creative");

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
    creatives: createCreatives(input),
  };

  return newProject;
};
