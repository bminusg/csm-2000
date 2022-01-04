const inquirer = require("inquirer");
const glob = require("glob");
const config = require(process.cwd() + "/config.js");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// META SETUP
const year = new Date().getFullYear();
const creativePaths = glob
  .sync(`${config.paths.campaigns}/${year}/**/main.js`)
  .map((path) => path.replace("/main.js", ""));
const projectPaths = glob
  .sync(`${config.paths.projects}/**/main.js`)
  .map((path) => path.replace("/main.js", ""));

const slugs = {
  Creatives: creativePaths.map((path) =>
    path.substring(path.lastIndexOf("/") + 1)
  ),
  Projects: projectPaths.map((path) =>
    path.substring(path.lastIndexOf("/") + 1)
  ),
};

// RUN THE CLI
inquirer
  .prompt([
    {
      type: "list",
      name: "type",
      message: "Which type do you wanna build?",
      choices: ["Creatives", "Projects"],
    },
    {
      type: "checkbox",
      message:
        "Ready for the customer feedback loop of hell? 🤘 \n Select your creative slugs in order to run the build proces.",
      name: "slugs",
      choices: slugs.Creatives,
      when: (answersSoFar) => {
        if (answersSoFar.type === "Creatives") return true;
        return false;
      },
    },
    {
      type: "checkbox",
      message: "Select your project slugs in order to run the build process",
      name: "slugs",
      choices: slugs.Projects,
      when: (answersSoFar) => {
        if (answersSoFar.type === "Projects") return true;
        return false;
      },
    },
  ])
  .then(async (answers) => {
    const slugsString = answers.slugs.join();
    const type = answers.type.toLowerCase();

    const { stdout, stderr } = await exec(
      "webpack build --config webpack.prod.js --env production " +
        type +
        "=" +
        slugsString
    );

    if (stderr) throw stderr;
    console.log(stdout);
  });
