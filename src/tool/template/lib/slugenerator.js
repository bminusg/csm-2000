const umlauts = require("./umlauts");

module.exports = (options = {}) => {
  if (Object.keys(options).length < 4)
    throw new Error("Slug options are missing");

  const params = {
    brand: umlauts(options.brand),
    campaign: umlauts(options.campaign),
    format: umlauts(options.format),
    publisher: umlauts(options.publisher) || "",
    version: parseInt(options.version) || 1,
  };

  // CONCAT SLUG PARAMS TO ONE STRING
  let slug = "";
  for (const param in params) {
    let paramString = params[param] + "_";

    if (param === "publisher" && params.publisher === "") continue;
    if (param === "version")
      paramString = params.version.toString().padStart(2, "0");

    slug += paramString;
  }

  return slug;
};
