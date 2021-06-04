module.exports = (value) => {
  let umlaut = value.toLowerCase();

  return umlaut
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/ /g, "-")
    .replace(/(\.|,|\(|\)|\')/g, "");
};
