const getSRC = (slug, options = {}) => {
  const host = window.location.host;
  const protocol = window.location.protocol;
  const delimiter =
    slug.indexOf("-") > slug.indexOf("_") || slug.indexOf("-") === -1
      ? "_"
      : "-";
  const brand = slug.split(delimiter)[0];
  const optionalDir = options.dir ? options.dir : "/index.html";
  const year = options.year ? options.year : new Date().getFullYear();

  let uri =
    host.indexOf("localhost") > -1
      ? protocol + "//localhost:8080/" + slug
      : protocol + "//" + host + "/media/" + year + "/" + brand + "/" + slug;

  return uri + optionalDir;
};

export default getSRC;
