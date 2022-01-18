module.exports = async function (project, query) {
  const queryKeys = Object.keys(query);

  for (const queryKey of queryKeys) {
    const value = query[queryKey];

    if (!project[queryKey])
      throw new Error("Unkown project parameter at query key: " + queryKey);

    if (Array.isArray(value)) {
      for (const arrayItem of value) {
        if (arrayItem.id) {
          console.log("CHANGE EXCISTING ITEM ON ID: " + arrayItem.id);
          continue;
        }

        const newItems = this.service.create[queryKey](project, value);
        project[queryKeys] = project[queryKeys].concat(newItems);
        break;
      }

      continue;
    }

    project[queryKey] = value;
  }

  return project;
};
