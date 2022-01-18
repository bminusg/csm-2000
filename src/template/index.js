"use strict";

// NODE MODULES
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

// DATA MODULE
const data = require("../data");

// REGISTER HELPERS
Handlebars.registerHelper("equal", require("./helpers/equal"));

/**
 *
 * @description INIT TEMPLATE BUILDER
 */
async function buildTemplate() {
  const projectParamId = process.argv
    .find((param) => param.indexOf("project=") > -1)
    .split("=")[1];
  let creativeParamIDs = process.argv
    .find((param) => param.indexOf("creatives=") > -1)
    .split("=")[1]
    .split(",");

  const findProject = await data.read("projects", { id: projectParamId });

  if (!findProject) throw new Error("Can't find project ID: " + projectParamId);
  if (creativeParamIDs[0] === "") creativeParamIDs = [];

  buildFiles(findProject, creativeParamIDs);
}

/**
 *
 * @description BUILD TEMPLATE FILES
 * @param {Object} project data
 * @param {Array} creativeIDs array of creative IDs that only should be rendered
 */
async function buildFiles(project, creativeIDs) {
  const templateFiles = ["markup.html.hbs", "main.js.hbs", "main.sass.hbs"];

  const year = project.campaign.planning.start
    ? new Date(project.campaign.planning.start).getFullYear().toString()
    : new Date().getFullYear().toString();

  const targetFolder = path.join(
    "projects",
    year,
    project.brand.slug,
    project.campaign.slug
  );

  // DATA-LOOP
  for (const creative of project.creatives) {
    if (creativeIDs && creativeIDs.indexOf(creative.id) < 0) continue;

    Object.assign(creative, {
      campaign: project.campaign,
      brand: project.brand,
    });

    // CREATE FOLDERS
    const filepath = path.join(targetFolder, creative.slug);
    if (fs.existsSync(filepath)) continue;

    fs.mkdir(filepath, { recursive: true }, (err) => {
      if (err) throw err;

      // CREATE FILES FROM TEMPLATES
      templateFiles.forEach((tempFile) => {
        const filename = tempFile.replace(".hbs", "");

        // BRING DATA TO TEMPLATES
        fs.readFile("./src/template/hbs/" + tempFile, "utf-8", (err, file) => {
          if (err) throw new Error(err);

          const templateData = {
            project: project,
            creative: creative,
          };

          const template = Handlebars.compile(file);
          const filled = template(templateData);
          const assignedPath =
            filename === "main.sass" ? path.join(filepath, "sass") : filepath;

          // SUBDIRECTORY FOR STYLE TEMPLATE FILES
          if (!fs.existsSync(assignedPath)) fs.mkdirSync(assignedPath);

          // WRITE TEMPLATES
          fs.writeFile(
            path.join(assignedPath, filename),
            filled,
            {
              encoding: "utf8",
              flag: "w",
              mode: 0o666,
            },
            (err) => {
              if (err) throw new Error(err);

              console.log(
                "\x1b[32m",
                "[" + creative.slug + "] : ",
                "\x1b[0m" + filename + " : TEMPLATE FILE BUILD SUCCESFULLY"
              );
            }
          );
        });
      });
    });
  }
}

buildTemplate();
