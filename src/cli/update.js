"use strict";

const inquirer = require("inquirer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// DATA HANDLER
const creative = require("../data/models/Creative");
const format = require("../data/models/Format");
const project = require("../data/models/Project");

// SESSION DATA
let projects = [];
let formats = [];

inquirer
  .prompt([
    {
      type: "list",
      message: "Choose project",
      name: "project",
      choices: async () => {
        const choices = [];
        projects = project.read();

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
      choices: async (answers) => {
        formats = format.read();

        const project = answers.project;
        const choices = [];
        const definedFormats = [];
        let caption = "";

        if (project.creatives.length > 0) {
          choices.push(new inquirer.Separator());
          choices.push(new inquirer.Separator("Create a new version from"));

          for (const creative of project.creatives) {
            const format = JSON.stringify(creative.format);
            const choice = {
              name: creative.slug,
              value: creative,
            };

            const choiceFormatExcist = choices.findIndex(
              (choice) =>
                choice.value && JSON.stringify(choice.value.format) === format
            );

            // SHOW ONLY LAST VERSION ITEMS
            if (choiceFormatExcist > -1) {
              choices[choiceFormatExcist] = choice;
            } else {
              choices.push(choice);
              definedFormats.push(creative.format);
              caption = creative.caption;
            }
          }
        }

        choices.push(new inquirer.Separator());
        choices.push(new inquirer.Separator("Create a new format"));

        for (const format of formats) {
          choices.push(new inquirer.Separator(format.name));

          for (const option in format.options) {
            const options = format.options[option];
            const formatExcist = definedFormats.find(
              (duplicate) =>
                duplicate.slug === format.slug &&
                duplicate.width === options.width &&
                duplicate.height === options.height
            );

            choices.push({
              name: option,
              disabled: formatExcist ? true : false,
              value: {
                caption: caption,
                format: {
                  name: format.name,
                  slug: format.slug,
                  ...options,
                },
              },
            });
          }
        }

        return choices;
      },
      when: (answers) => answers.intention === "addCreative",
    },
  ])
  .then(async (answers) => {

    // CREATE NEW CREATIVES
    if (answers.creatives) {
      const newVersions = [];

      for (const creativeItem of answers.creatives) {
        let options = { ...creativeItem };
        options.version = parseInt(options.version) + 1;

        delete options.id;
        delete options.slug;
        delete options.tracking;

        const newCreative = creative.create(answers.project, options);
        newVersions.push(newCreative);
      }

      const updatedProject = project.update(answers.project.id, {
        creatives: newVersions,
      });

      return updatedProject;
    }
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
  .catch((e) => {
    console.error(e);
  });
