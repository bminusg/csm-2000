const getSRC = (slug) => {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const brand = (slug.indexOf("-") === -1) ? slug.split("_")[0] : slug.split("-")[0];
  const year = new Date().getFullYear();

  const uri =
    host.indexOf("localhost") > -1
      ? protocol + "//localhost:8080/" + slug + ".html"
      : protocol +
        "//" +
        host +
        "/media/" +
        year +
        "/" +
        brand +
        "/" +
        slug +
        "/index.html";

  return uri;
};
export default getSRC;
