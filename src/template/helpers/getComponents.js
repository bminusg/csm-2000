module.exports = function (creativeID, project) {
  const componentIDs = project.creatives
    .filter((creative) => creative.components)
    .map((creative) => creative.components)
    .find((components) => components.includes(creativeID));
  const connectWithIDs = componentIDs.filter((id) => id !== creativeID);
  const connectWithSlugs = project.creatives
    .filter((creative) => connectWithIDs.includes(creative.id))
    .map((creative) => creative.slug);

  return '"' + connectWithSlugs.join('","') + '"';
};
