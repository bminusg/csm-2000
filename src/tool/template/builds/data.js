module.exports = (params) => {
  const formats = require("../../data/formats.json");
  const inputs = params.splice(2);
  let query = {
    publisher: "default",
  };

  for (const input of inputs) {
    const valuePair = input.split("=");
    const key = valuePair[0];
    let value = valuePair[1];

    // MODIFY BRAND OPTION
    // CREATE HERE INTELLIGENT SLUG BUILDER WHO CAN ALLITARTE LOGIC SHORT FORMS FOR LONG STRING VERSION
    if (key === "brand" || key === "campaign") {
      value = {
        name: decodeURIComponent(value),
        slug: decodeURIComponent(value).toLowerCase().substring(0, 12).trim(),
      };
    }

    // MODIFY PUBLISHER
    if (key === "publisher") {
      query.publisher = value;
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
