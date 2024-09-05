class Dynamic {
  constructor(config = {}) {
    this.path = config.path;
    this.feedID = config.feedID;

    this.feed = config.feed || [];
    this.data = config.data || [];
    this.delimiterChar = config.delimiterChar || ";";
    this.mapConfig = config.mapConfig || false;
    this.isTimeMapping = config.isTimeMapping || false;
    this.queryOptions = {
      method: "get",
      headers: {
        "content-type": "text/csv;charset=UTF-8",
      },
    };

    this.isShuffleMode = config.isShuffleMode || false;
  }

  load() {
    // TODO FALLBACK CLICKTAG
    this.feedUrl = this.defineFeedURL();

    if (this.isDevMode())
      this.parseJSON({
        data: window.Creative.data,
        columns: window.Creative.dataColumns,
      });
    else this.fetchJSON();
  }

  isDevMode() {
    return process.env.NODE_ENV === "development";
  }

  async fetchJSON() {
    try {
      const response = await fetch(this.feedUrl);
      const json = await response.json();

      this.parseJSON(json);
    } catch (error) {
      console.error("[DYNAMIC ERROR]", error);
    }
  }

  defineFeedURL() {
    const origin = window.location.origin;
    const feedID = window.Creative?.params?.feedid ?? this.feedID;

    return `${origin}/feeds/${feedID}.json`;
  }

  parseJSON(json) {
    let data = [];
    let dataColumns = [];
    const clicktags = [];
    const now = window.Creative?.params?.date
      ? new Date(window.Creative?.params?.date).getTime()
      : new Date().getTime();

    if (!Array.isArray(json)) {
      const { data, columns } = json;

      if (!data || !columns || !Array.isArray(data))
        throw new Error("JSON Data isn't parseable");

      json = data;
      dataColumns.push(...columns);
    }

    for (const row of json) {
      const { start, end, clickout } = row;

      if (start && end) {
        const startDate = new Date(start).getTime();
        const endDate = new Date(end).getTime();

        if (now < startDate) continue;
        if (now > endDate) continue;
      }

      if (clickout) clicktags.push(clickout);

      delete row.start;
      delete row.end;
      delete row.clickout;
      delete row.actions;
      delete row.id;

      data.push(row);
    }

    const isFallback = data.length <= 0;
    if (!isFallback) this.mapClicktags(clicktags);

    if (this.isShuffleMode) data = this.shuffle(data);

    window.Creative.data = data;
    window.Creative.dataColumns = dataColumns;
    window.Creative.startAnimation({ isFallback });
  }

  mapClicktags(clicktags) {
    const clicktag = window.Creative.params.clicktag
      ? window.Creative.params.clicktag
      : "";

    window.Creative.clicktags = clicktags.map((item) =>
      clicktag ? this.replaceClicktagTarget(clicktag, item) : item
    );
  }

  replaceClicktagTarget(clicktag, item) {
    const decoded = clicktag; //decodeURIComponent(clicktag);
    const utms = window.Creative?.getUTMs() ?? {};

    const mappedClicktags =
      decoded.substring(0, decoded.indexOf("clickenc=")) +
      `clickenc=${item}?${Object.keys(utms)
        .map((utmKey) => `${utmKey}=${utms[utmKey]}`)
        .join("&")}`;

    //?clicktag=https%3A%2F%2Fams3-ib.adnxs.com%2Fclick2%3Fe%3DwqT_3QKIAfBViAAAAAMAxBkFAQjRnbipBhDv6cf3y_i9kGcY5bXGy96j98AcIJSEtgUojz0wjz04AEDurenfAVAAWgBoAHAAeACAAQCIAQGQAQGYAQOgAQCpAQAAAAABAwSxAQEGAQEAuRUKAMEVCjzJAQAAAAAAAAAA2AEA4AEB%2Fs%3D5b498c41f194aa8b208404e733b3dc7aac00744f%2Fbcr%3DAAAAAAAAAAA%3D%2Fbn%3D0%2Ftest%3D1%2Fclickenc%3Dhttps%3A%2F%2Fwww.bild.de&target=_blank&frameId=mrec_frame1
    return mappedClicktags;
  }

  CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = strDelimiter || ",";

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      // Delimiters.
      "(\\" +
        strDelimiter +
        "|\\r?\\n|\\r|^)" +
        // Quoted fields.
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        // Standard fields.
        '([^"\\' +
        strDelimiter +
        "\\r\\n]*))",
      "gi"
    );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;

    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while ((arrMatches = objPattern.exec(strData))) {
      // Get the delimiter that was found.
      var strMatchedDelimiter = arrMatches[1];

      // Check to see if the given delimiter has a length
      // (is not the start of string) and if it matches
      // field delimiter. If id does not, then we know
      // that this delimiter is a row delimiter.
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
        // Since we have reached a new row of data,
        // add an empty row to our data array.
        arrData.push([]);
      }

      var strMatchedValue;

      // Now that we have our delimiter out of the way,
      // let's check to see which kind of value we
      // captured (quoted or unquoted).
      if (arrMatches[2]) {
        // We found a quoted value. When we capture
        // this value, unescape any double quotes.
        strMatchedValue = arrMatches[2].replace(new RegExp('""', "g"), '"');
      } else {
        // We found a non-quoted value.
        strMatchedValue = arrMatches[3];
      }

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    this.map(arrData.filter(([item, index]) => index > 0));
  }

  recursiveMapping(key, value, dataMap) {
    const item = {};
    const isValid = this.validate(key, value, dataMap);

    Object.assign(item, {
      [key]: isValid ? dataMap[value] : {},
    });

    for (const [innerKey, innerValue] of Object.entries(value)) {
      Object.assign(
        item[key],
        this.recursiveMapping(innerKey, innerValue, dataMap)
      );
    }

    return item;
  }

  shuffle(unshuffledArray) {
    return unshuffledArray
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  validate(key, value, map = []) {
    try {
      const validatedInput = map[value];

      if (key === "image") {
        const imageTypes = ["jpg", "jpeg", "png", "webp"];
        const fileType = validatedInput.substring(
          validatedInput.lastIndexOf(".") + 1
        );

        return imageTypes.includes(fileType);
      } else if (!validatedInput) return false;

      return true;
    } catch (error) {
      console.warn("[VALIDATOR]", error);
      return false;
    }
  }
}

export default Dynamic;
