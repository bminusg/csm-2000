"use strict";

// INIT CHILD PROCESS RUNNER
const util = require("util");
const inquirer = require("inquirer");
const shortme = require("shortme");
const exec = util.promisify(require("child_process").exec);

// GET DATA MODELS
const project = require("../data/models/Project");
const brand = require("../data/models/Brand");
const format = require("../data/models/Format");

// HELPERS
const componentBuilder = require("./helpers/componentBuilder");

// READ DATA
let brandData = brand.read();
let formatData = format.read();

// REGISTER INQUIRER PLUGIN
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

// RUN THE CLI
inquirer
  .prompt([
    // BRAND NAME
    {
      type: "autocomplete",
      message: "Which Brand need awesome Creatives?",
      name: "brand",
      suggestOnly: true,
      source: async (answersSoFar, input) => {
        //brandData = await data.read("brands");
        input = input || "";

        return new Promise((resolve) => {
          const results = brandData.filter(
            (brand) =>
              brand.name.indexOf(input) > -1 || brand.slug.indexOf(input) > -1
          );

          resolve(results);
        });
      },
      filter: (input) => {
        const brand = brandData.find((brand) => brand.name === input);

        return {
          name: brand ? brand.name : input,
          slug: brand ? brand.slug : shortme(input),
        };
      },
      validate: (input) => {
        if (input === "") return "Please enter brand name";
        return true;
      },
    },
    // CAMPAIGN NAME
    // Best practise blog article: https://blog.funnel.io/how-to-name-your-digital-advertising-campaign-like-a-pro
    {
      type: "input",
      message: "What is the Campaign name/product?",
      name: "campaign",
      filter: (input) => {
        return {
          name: input,
          slug: shortme(input),
        };
      },
      validate: (input) => {
        if (input === "") return "Please enter campaign name/product";
        return true;
      },
    },
    // CAPTION
    // IDEA: LOAD META TITLE FROM URL AND USE IT AS DEFAULT VALUE FOR CAMPAIGN NAME
    {
      type: "input",
      message: "Paste the URI of the landingpage",
      name: "caption",
      validate: (input) => {
        if (input.indexOf("http") > -1) return true;
        return "Please enter a valid URL starting with http";
      },
    },
    {
      type: "checkbox",
      message: "Select your campaign formats",
      name: "creatives",
      choices: async (answers) => {
        const creatives = [];

        for (const creative of formatData) {
          creatives.push(new inquirer.Separator(creative.name));

          for (const option in creative.options) {
            const caption = encodeURIComponent(answers.caption);
            const formatOptions = creative.options[option];
            let components = [];

            if (creative.type === "RichMedia Composite") {
              components = componentBuilder(option, formatOptions);

              creatives.push({
                name: option,
                value: {
                  caption: caption,
                  format: {
                    name: creative.name,
                    slug: creative.slug,
                    type: creative.type,
                    components: components,
                  },
                  components: [],
                },
              });

              continue;
            }

            creatives.push({
              name: option,
              value: {
                caption: caption,
                format: {
                  name: creative.name,
                  slug: creative.slug,
                  type: creative.type,
                  ...formatOptions,
                },
              },
            });
          }
        }

        return creatives;
      },

      validate: (input) => {
        if (input === "") return "Please select at least one creative";
        return true;
      },
    },
  ])
  .then(async (answers) => {
    const createdProject = await project.create(answers);
    return createdProject;
  })
  .then(async (project) => {
    const creativeIDs = project.creatives
      .filter((creative) => creative.format.type !== "RichMedia Composite")
      .map((creative) => creative.id)
      .join(",");

    const process = `node ./src/template project=${project.id} creatives=${creativeIDs}`;
    const { stdout, stderr } = await exec(process);

    if (stderr) throw stderr;
    console.log(stdout);
  })
  .catch((error) => {
    console.log(error);
  });
