"use strict";

// NODE MODULES
const inquirer = require("inquirer");
const glob = require("glob");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// DATA MODULES
const project = require("../data/models/Project");

// RUN THE CLI
inquirer
  .prompt([
    {
      type: "checkbox",
      message: "Select your creative slugs in order to run the build process.",
      name: "creatives",
      choices: async () => {
        const projectData = project.read();
        const creativeOptions = [];
        const localCreativeSlugs = glob
          .sync("./projects/**/main.js")
          .map((path) => path.split("/").splice(-2, 1)[0]);

        for (const project of projectData) {
          // DEFINE CLI OPTIONS

          for (const [index, creative] of project.creatives.entries()) {
            if (index === 0) {
              creativeOptions.push(
                new inquirer.Separator(
                  project.brand.name + " | " + project.campaign.name
                )
              );
            }

            if (
              creative.format.isComponent ||
              (localCreativeSlugs.indexOf(creative.slug) < 0 &&
                !creative.components)
            )
              continue;

            creativeOptions.push({
              name: "[" + creative.version + "] - " + creative.format.name,
              value: creative.components ? creative.components : creative.id,
            });
          }
        }

        creativeOptions.push(new inquirer.Separator());

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
