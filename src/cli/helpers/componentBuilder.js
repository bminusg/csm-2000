const format = require("../../data/models/Format");

/**
 * @param {String} optionType - Type of option
 * @param {Object} options - format options
 * @return {Array}
 */
module.exports = (optionType = "Default", options) => {
  const components = [];

  for (let componentInput of options) {
    const componentName = componentInput.split(".")[0];
    const component = format.read({ name: componentName });

    if (!component)
      throw new Error(
        "Can't find component of RichMedia Composite: " + componentName
      );

    const formatOptionFallback = componentInput.split(".")[1]
      ? componentInput.split(".")[1]
      : "Default";

    const componentOptions = component.options[optionType]
      ? component.options[optionType]
      : component.options[formatOptionFallback];

    if (!componentOptions)
      throw new Error(
        "Can't define component options for " +
          component.options[optionType] +
          " (Fallback: " +
          formatOptionFallback
      );

    components.push({
      format: {
        name: component.name,
        slug: component.slug,
        type: component.type,
        isComponent: true,
        ...componentOptions,
      },
    });
  }

  return components;
};
