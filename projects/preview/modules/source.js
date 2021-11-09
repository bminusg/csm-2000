const getSRC = (slug, optionalDir = "/index.html") => {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const brand =
    slug.indexOf("-") === -1 ? slug.split("_")[0] : slug.split("-")[0];
  const year = new Date().getFullYear();

  let uri =
    host.indexOf("localhost") > -1
      ? protocol + "//localhost:8080/" + slug
      : protocol + "//" + host + "/media/" + year + "/" + brand + "/" + slug;

  return uri + optionalDir;
};
export default getSRC;
