"use strict";

// INIT CHILD PROCESS RUNNER
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// INIT INQUIRER
const inquirer = require("inquirer");
inquirer.registerPrompt(
  "autocomplete",
  require("inquirer-autocomplete-prompt")
);

// GET DATA
const brands = require(process.cwd() + "/src/tool/data/brands.json");
const formats = require(process.cwd() + "/src/tool/data/formats.json");
const publishers = require(process.cwd() + "/src/tool/data/publishers.json");

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
          const results = brands.filter(
            (brand) =>
              brand.name.indexOf(input) > -1 || brand.slug.indexOf(input) > -1
          );

          resolve(results);
        });
      },
    },
    // CAMPAIGN NAME
    // Best practise blog article: https://blog.funnel.io/how-to-name-your-digital-advertising-campaign-like-a-pro
    {
      type: "input",
      message: "What is the Campaign name/product?",
      name: "campaign",
      validate: (input) => {
        if (input === "") return "Please enter campaign name/product";

        return true;
      },
    },
    // SELECT PUBLISHER
    {
      type: "checkbox",
      message: "Do you you need a specific publisher setup?",
      name: "publishers",
      choices: publishers,
      filter: (input) => {
        const publisherSlugs = input.map(
          (publisher) => publishers.find((p) => p.name === publisher).slug
        );
        return publisherSlugs.join(",");
      },
    },
    // SELECT FORMATS
    {
      type: "checkbox",
      message: "Select your campaign formats",
      name: "formats",
      choices: formats,
      filter: (input) => {
        const formatSlugs = input.map(
          (format) => formats.find((f) => f.name === format).slug
        );
        return formatSlugs.join(",");
      },
    },
  ])
  .then(async (answers) => {
    const process = `node ./src/tool/template brand=${answers.brand} campaign=${answers.campaign} publisher=${answers.publishers} formats=${answers.formats}`;
    const { stdout, stderr } = await exec(process);

    if (stderr) throw stderr;
    console.log(stdout);
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.error("Prompt couldn't be rendered in the current environment");
    } else {
      console.error("Something else went wrong");
    }
  });
