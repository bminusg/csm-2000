const inquirer = require("inquirer");
const glob = require("glob");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// META SETUP
const year = new Date().getFullYear();
const creativePaths = glob
  .sync(`./src/${year}/**/main.js`)
  .map((path) => path.replace("/main.js", ""));
const slugs = creativePaths.map((path) =>
  path.substring(path.lastIndexOf("/") + 1)
);

// RUN THE CLI
inquirer
  .prompt([
    {
      type: "checkbox",
      message:
        "Ready for the customer feedback loop of hell? 🤘 Select your creative slugs in order to run the build proces.",
      name: "buildSlugs",
      choices: slugs,
    },
  ])
  .then(async (answers) => {
    const slugsString = answers.buildSlugs.join();
    const { stdout, stderr } = await exec(
      "webpack build --config webpack.prod.js --env production creatives=" +
        slugsString
    );

    if (stderr) throw stderr;
    console.log(stdout);
  });
