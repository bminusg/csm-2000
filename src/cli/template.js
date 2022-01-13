"use strict";

// INIT CHILD PROCESS RUNNER
const util = require("util");
const inquirer = require("inquirer");
const shortme = require("shortme");
const exec = util.promisify(require("child_process").exec);
const createProject = require("./modules/createProject");

// GET DATA
const brandData = require(process.cwd() + "/src/data/brands.json");
const formatData = require(process.cwd() + "/src/data/formats.json");

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
      source: (answersSoFar, input) => {
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
      choices: () => {
        const creatives = [];

        for (const creative of formatData) {
          creatives.push(new inquirer.Separator(creative.name));

          for (const option in creative.options) {
            creatives.push({
              name: option,
              value: {
                name: creative.name,
                slug: creative.slug,
                ...creative.options[option],
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
    // UPDATE CAMPAIGN DATA
    const createdProject = await createProject(answers);
    return createdProject;
  })
  .then(async (project) => {
    const creativeIDs = project.creatives
      .map((creative) => creative.id)
      .join(",");

    const process = `node ./src/template project=${project.id} creatives=${creativeIDs}`;
    const { stdout, stderr } = await exec(process);

    if (stderr) throw stderr;
    console.log(stdout);
  })
  .catch((error) => {
    if (error.isTtyError) {
      throw new Error("Prompt couldn't be rendered in the current environment");
    } else {
      console.error("Something else went wrong");
      console.log(error);
    }
  });
