const getURIparams = () => {
  const query = window.location.search.substring(1); // FALLBACK FOR HASH?
  const params = query === "" ? [] : query.split("&");
  let paramObject = {};

  if (params.length < 1) return paramObject;

  params.forEach((paramString) => {
    const param = paramString.split("=");
    paramObject[param[0]] = decodeURIComponent(param[1]);
  });

  return paramObject;
};

export default getURIparams;
