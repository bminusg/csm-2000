function umlauts(value) {
  let umlaut = value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/(\.|,|\(|\)|\')/g, "");

  return umlaut;
}

function getShort(value = "") {
  if (value.length < 5) return value[0];

  const vowels = ["a", "e", "i", "o", "u"];
  const firstChar = value[0];
  const lastChar = value[value.length - 1];
  let charChunks = value.substring(1, value.length - 2).split("");

  charChunks = charChunks.filter((char) => vowels.indexOf(char) === -1);
  if (charChunks.length > 4)
    charChunks = charChunks.filter((char, idx) => idx % 2 !== 0);

  return firstChar + charChunks.join("") + lastChar;
}

function slugify(input) {
  input = decodeURIComponent(input);
  const maxChars = input.length;
  const fragments = input.split(" ");
  const maxIDX = fragments.length - 1;
  let output = "";

  console.log(fragments);

  fragments.forEach((fragment, idx) => {
    const delimiter = idx === maxIDX ? "" : "_";
    let flag = false;
    fragment = umlauts(fragment);

    // EDGE CASE DEUTSCHLAND
    if (fragment === "deutschland") output += "dtl" + delimiter;
    // SINGLE WORD WITH MAX 10 CHARs
    else if (fragment.length < 10 && fragments.length === 1) output += fragment;
    // ABBREVATION
    else if (fragments.length > 1 && maxChars > 20)
      output += getShort(fragment) + delimiter;
    // DEFAULT CASE FIRST LETTER
    else output += fragment[0];
  });

  return output;
}

module.exports = slugify;
