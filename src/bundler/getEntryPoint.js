const glob = require("glob");

module.exports = (slug) => {
  const mainJsPath = glob.sync("./projects/**/" + slug + "/main.js")[0];
  if (!mainJsPath)
    throw new Error("No local entry point file for creative slug: " + slug);

  return { [slug]: mainJsPath };
};
