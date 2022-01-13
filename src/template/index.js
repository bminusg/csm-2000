// BUILD MODULES
const buildFiles = require("./builds/files");
const projectData = require("../data/projects.json");

function getProject() {
  const projectParamId = process.argv
    .find((param) => param.indexOf("project=") > -1)
    .split("=")[1];
  const findProject = projectData.find(
    (project) => project.id === projectParamId
  );

  if (!findProject) throw new Error("Can't find project ID: " + projectParamId);
  return findProject;
}

const project = getProject();
buildFiles(project);
