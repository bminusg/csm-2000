"use strict";

const inquirer = require("inquirer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// DATA HANDLER
const creative = require("../data/Creative");
const format = require("../data/Format");
const project = require("../data/Project");

// HELPERS
const componentBuilder = require("./helpers/componentBuilder");

// SESSION DATA
const projects = project.read();
const formats = format.read();

inquirer
  .prompt([
    {
      type: "list",
      message: "Choose project",
      name: "project",
      choices: async () => {
        const choices = [];

        for (const project of projects) {
          choices.push({
            name: project.campaign.name + " | " + project.brand.name,
            value: project,
          });
        }

        return choices;
      },
    },
    {
      type: "list",
      message: "What is your intention for updateing the project?",
      name: "intention",
      choices: [{ name: "Adding new creative", value: "addCreative" }],
    },
    {
      type: "checkbox",
      message: "Choose your update options",
      name: "creatives",
      when: (answers) => answers.intention === "addCreative",
      choices: async (answers) => {
        const choices = [];
        const caption = answers.project.creatives.find(
          (creative) => creative.caption
        ).caption;
        const projectFormats = answers.project.creatives.map(
          (creative) => creative.format
        );

        for (const format of formats) {
          choices.push(
            new inquirer.Separator("++++++++++++++++ " + format.name)
          );

          for (const option in format.options) {
            let options = format.options[option];
            const formatExcist = projectFormats.find(
              (duplicate) =>
                duplicate.slug === format.slug &&
                duplicate.width === options.width &&
                duplicate.height === options.height
            );

            // SWITCH FOR COMPOSITE TYPE
            if (format.type === "RichMedia Composite") {
              const components = componentBuilder(option, options);

              options = {};
              Object.assign(options, { components });
            }

            choices.push({
              name: formatExcist
                ? "Create a new " + option + " version"
                : option,
              value: {
                caption: caption,
                format: {
                  name: format.name,
                  slug: format.slug,
                  type: format.type,
                  ...options,
                },
              },
            });
          }
        }

        return choices;
      },
    },
  ])
  .then(async (answers) => {
    // ADDING NEW CREATIVES
    if (answers.creatives) {
      for (const creativeItem of answers.creatives) {
        const newCreativeVersion = creativeItem.format.components
          ? creative.createComposite(answers.project, creativeItem)
          : creative.create(answers.project, creativeItem);
      }

      project.save();
      return answers.project;
    }
  })
  .then(async (project) => {
    const creativeIDs = project.creatives
      .filter((creative) => creative.format.type === "RichMedia")
      .map((creative) => creative.id)
      .join(",");

    const process = `node ./src/template project=${project.id} creatives=${creativeIDs}`;
    const { stdout, stderr } = await exec(process);

    if (stderr) throw stderr;
    console.log(stdout);
  })
  .catch((e) => {
    console.error(e);
  });
