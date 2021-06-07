const path = require("path");
const fs = require("fs");
const Handlebars = require("handlebars");
const slugenerator = require("../lib/slugenerator");

/**
 *
 * @param {Object} data - handlebars data input
 */
module.exports = (data) => {
  const templateFiles = ["index.html.hbs", "main.js.hbs"];
  const year = new Date().getFullYear().toString();
  const targetFolder = path.join(
    process.cwd(),
    "src",
    year,
    data.brand.slug,
    data.campaign.slug
  );

  // DATA-LOOP
  const files = [];
  const formats = [];
  for (let format of data.formats) {
    // MODIFY FORMAT META DATA
    Object.assign(format, {
      campaign: data.campaign,
      brand: data.brand,
      path: slugenerator({
        brand: data.brand.slug,
        campaign: data.campaign.slug,
        format: format.slug,
        publisher: format.publisher,
      }),
    });

    console.log(format);

    // CREATE FOLDERS
    const filepath = path.join(targetFolder, format.path);
    if (fs.existsSync(filepath))
      throw new Error("Creative folder excist allready");

    fs.mkdir(filepath, { recursive: true }, (err) => {
      if (err) throw err;

      // CREATE FILES FROM TEMPLATES
      templateFiles.forEach((tempFile) => {
        const filename = tempFile.substr(0, tempFile.indexOf(".hbs"));

        // BRING DATA TO TEMPLATES
        fs.readFile(
          "./src/tool/template/hbs/" + tempFile,
          "utf-8",
          (err, file) => {
            if (err) throw new Error(err);

            const template = Handlebars.compile(file);
            const filled = template(format);

            // WRITE TEMPLATES
            fs.writeFile(
              path.join(filepath, filename),
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
                  "[" + format.path + "] : ",
                  "\x1b[0m" + filename + " : TEMPLATE FILE BUILD SUCCESFULLY"
                );
              }
            );
          }
        );
      });
    });
  }
};
