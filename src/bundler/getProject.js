const data = require("../data")

module.exports = async (query) => {
  const projectData = await data.read();
  const queryKeys = Object.keys(query).map((keys) => keys.split("."))[0];
  const queryValue = Object.values(query)[0];
  let project = [];

  if (queryKeys.length === 1) {
    project = projectData.find(
      (project) => project[queryKeys[0]] === queryValue
    );
  } else {
    project = projectData.filter((data) => {
      const results = data[queryKeys[0]]
        .map((item) => item[queryKeys[1]])
        .filter((value) => value === queryValue);

      if (results.length > 0) return data;
    });
  }

  return project[0];
};
