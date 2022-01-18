"use strict";

const inquirer = require("inquirer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// DATA HANDLER
const data = require("../data");

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
        projects = await data.read();

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
        formats = await data.read("formats");

        const project = answers.project;
        const choices = [];
        const definedFormats = [];
        let caption = "";

        if (project.creatives.length > 0) {
          choices.push(new inquirer.Separator());
          choices.push(new inquirer.Separator("Create a new version of"));

          for (const creative of project.creatives) {
            let values = { ...creative };
            values.version = parseInt(values.version) + 1;

            delete values.slug;
            delete values.id;
            delete values.state;
            delete values.tracking;

            caption = values.caption;

            choices.push({
              name: creative.slug,
              value: {
                ...values,
              },
            });

            definedFormats.push(creative.format);
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
    const updatedProject = await data.update("projects", answers.project.id, {
      creatives: answers.creatives,
    });

    return updatedProject;
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
