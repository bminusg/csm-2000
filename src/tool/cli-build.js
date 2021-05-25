#! /usr/bin/env node
// will tell shell enviroment which program it needs execute this, in our case it's node
"use strict";

const glob = require("glob");
const { MultiSelect } = require("enquirer");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

// create a new multi select prompt
const year = process.env.YEAR ? process.env.YEAR : new Date().getFullYear();
const pathChunks = [`./src/${year}/`, "/main.js"];
const slugs = glob
  .sync(`./src/${year}/**/main.js`)
  .map((path) => path.replace(pathChunks[0], "").replace(pathChunks[1], ""));

const multiSelectPrompt = new MultiSelect({
  name: "value",
  message:
    "Ready for the customer feedback loop of hell? 🤘 Select your Creatives (Spacebar) and hit Enter for running the build process.",
  choices: slugs,
});

// run the prompt and handle the answer
multiSelectPrompt
  .run()
  .then(async (binaries) => {
    const selectedCreatives = binaries.join();
    const { stdout, stderr } = await exec(
      "webpack build --config webpack.prod.js --env production creatives=" +
        selectedCreatives
    );
    console.log("Standard output:", stdout);
    console.log("Standard error:", stderr);
  })
  .catch(console.error);
