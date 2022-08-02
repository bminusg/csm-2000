const glob = require("glob");
const project = require("../../src/data/Project");
const localCreativeSlugs = glob.sync("./projects/**/main.js");

describe("PROJECT MODEL", () => {
  it("Data defined", () => {
    expect(project.data).toBeDefined();
  });

  it("Entrypoints defined", () => {
    const entrypoints = project.defineEntrypoints();

    expect(entrypoints).toBeDefined();
    expect(Object.keys(entrypoints).length).toEqual(localCreativeSlugs.length);
  });

  it("HTML Plugin Options defined", () => {
    const plugins = project.defineHTMLPlugins();

    expect(plugins).toBeDefined();
    expect(plugins.length).toEqual(localCreativeSlugs.length);
  });

  it("FILTERED LOCAL PROJECT DATA", () => {
    const localProjects = project.getLocalProjectData();
    const localCreatives = localProjects
      .map((project) => project.creatives)
      .flat();

    expect(localProjects).toBeDefined();
    expect(localCreatives.length).toEqual(localCreativeSlugs.length);
  });
});
