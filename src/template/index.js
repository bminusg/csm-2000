// BUILD MODULES
const files = require("./builds/files");
const data = require("./builds/data");

// META SETUP
const query = data(process.argv);

// RUN TEMPLATE BUILD
files(query);
