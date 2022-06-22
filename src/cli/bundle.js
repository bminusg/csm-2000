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
          // CHECK FOR COMPONENTS
          // MATCH WITH LOCAL VERSIONS

          const creatives = [];
          const globalComponents = [];

          for (const creative of project.creatives) {
            if (creative.components) {
              const components = [];

              creative.components.forEach((componentID) => {
                const componentCreative = project.creatives.find(
                  (creative) =>
                    creative.id === componentID &&
                    creative.format.type === "RichMedia" &&
                    localCreativeSlugs.indexOf(creative.slug)
                );

                if (!componentCreative) return;

                components.push(componentID);
                globalComponents.push(componentID);
              });

              creatives.push({
                name: "[" + creative.version + "] - " + creative.format.name,
                value: components,
              });

              continue;
            }

            if (
              creative.format.type === "Video" ||
              localCreativeSlugs.indexOf(creative.slug) < 0 ||
              globalComponents.indexOf(creative.id) > -1
            )
              continue;

            creatives.push({
              name: "[" + creative.version + "] - " + creative.format.name,
              value: creative.id,
            });
          }

          if (creatives.length < 1) continue;

          creativeOptions.push(
            new inquirer.Separator(
              project.brand.name + " | " + project.campaign.name
            )
          );

          creatives.forEach((creative) => creativeOptions.push(creative));
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
