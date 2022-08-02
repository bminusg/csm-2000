"use strict";

// NODE MODULES
const inquirer = require("inquirer");
const glob = require("glob");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// DATA MODULES
const projectModel = require("../data/Project");

// RUN THE CLI
inquirer
  .prompt([
    {
      type: "checkbox",
      message: "Select your creative slugs in order to run the build process.",
      name: "creatives",
      choices: async () => {
        const projectData = projectModel.read();
        const creativeOptions = [];

        for (const project of projectData) {
          let creativeIDX = -1;

          for (const creative of project.creatives) {
            if (creative.format.isComponent) continue;

            if (!projectModel.hasLocalEntrypoints(creative)) continue;

            creativeIDX++;

            if (creativeIDX === 0) {
              creativeOptions.push(new inquirer.Separator());
              creativeOptions.push(
                new inquirer.Separator(
                  project.campaign.name + " | " + project.brand.name
                )
              );
            }

            creativeOptions.push({
              name:
                "[" +
                creative.version +
                "] - " +
                creative.format.name +
                " (" +
                creative.slug +
                ")",
              value: creative.components ? creative.components : creative.id,
            });
          }
        }

        creativeOptions.push(new inquirer.Separator());
        creativeOptions.push(new inquirer.Separator("Projects"));

        creativeOptions.push({
          name: "Preview",
          value: "preview",
        });

        return creativeOptions;
      },
    },
  ])
  .then(async (answers) => {
    const creativeIDs = answers.creatives.join(",");
    const command =
      answers.creatives.indexOf("preview") > -1
        ? "webpack build --config webpack.prod.js --env production preview"
        : "webpack build --config webpack.prod.js --env production creatives=" +
          creativeIDs;

    const { stdout, stderr } = await exec(command);

    if (stderr) throw stderr;
    console.log(stdout);
  })
  .catch((e) => console.error(e));
