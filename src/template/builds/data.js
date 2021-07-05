const formats = require("../../data/formats.json");
const shortme = require("shortme");

module.exports = (params) => {
  const inputs = params.splice(2);
  let query = {};

  for (const input of inputs) {
    const valuePair = input.split("=");
    const key = valuePair[0];
    let value = valuePair[1];

    // MODIFY BRAND OPTION
    if (key === "brand" || key === "campaign") {
      value = {
        name: decodeURIComponent(value),
        slug: shortme(value),
      };
    }

    // MODIFY FORMAT OPTIONS
    if (key === "formats") {
      const formatsQuery = valuePair[1].split(",");
      value = [];

      formatsQuery.forEach((format) => {
        const formatOptions = formats.find((elem) => elem.slug === format);
        const publisherSpecs = formatOptions.options[query.publisher]
          ? formatOptions.options[query.publisher]
          : formatOptions.options.default;

        value.push({
          name: formatOptions.name,
          slug: formatOptions.slug,
          size: {
            width: publisherSpecs.width,
            height: publisherSpecs.height,
          },
          publisher: query.publisher,
          admark: publisherSpecs.admark,
        });
      });
    }

    Object.assign(query, { [key]: value });
  }

  return query;
};
