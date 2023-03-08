class Dynamic {
  constructor(config = {}) {
    this.feed = config.feed;
    this.data = config.data || [];
    this.delimiterChar = config.delimiterChar || ";";
    this.mapConfig = config.mapConfig || false;
    this.isTimeMapping = config.isTimeMapping || false;
  }

  async load() {
    try {
      if (this.data.length < 1) {
        const dataType = this.feed.substring(this.feed.lastIndexOf(".") + 1);
        const uri =
          process.env.NODE_ENV === "development"
            ? "/" + this.feed
            : this.buildLocalFeedUri(this.feed);

        console.log("URI", uri);

        const query = await fetch(uri, {
          method: "get",
          headers: {
            "content-type": "text/csv;charset=UTF-8",
          },
        });
        const text = await query.text();

        console.log("query", query);

        if (!text) throw new Error("Can't fetch data");
        // this.data = this.parse(text);
        this.CSVToArray(text);
      } else {
        window.Creative.startAnimation();
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  buildLocalFeedUri(subpath) {
    const path = location.protocol + "//" + location.host + location.pathname;
    return path.replace("index.html", "") + subpath;
  }

  parse(input) {
    const csvData = [];
    const lines = input
      .split("\n")
      .map((line) => line.replace(/[\n\r\;\"]/g, ""))
      .filter(
        (line) =>
          line !== "" &&
          line.length > 1 &&
          new Set(line.split(this.delimiterChar)).size > 1
      );

    for (const [lineIDX, line] of lines.entries()) {
      if (lineIDX === 0) continue;
      csvData.push(line.split(this.delimiterChar));
    }

    console.table(csvData);
    this.map(csvData);
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

      console.log("STRMATCHED", strMatchedValue);

      // Now that we have our value string, let's add
      // it to the data array.
      arrData[arrData.length - 1].push(strMatchedValue);
    }

    this.map(arrData.filter(([item, index]) => index > 0));
  }

  map(data) {
    const emulateDate = window.Creative.params.dynamicDate;
    const now = emulateDate ? new Date(emulateDate) : new Date();

    if (!this.mapConfig) return console.error("NO DATA MAPPING DEFINED");

    for (const feedRow of data) {
      const item = {};

      const startDate =
        this.isTimeMapping && this.mapConfig.startDate
          ? new Date(feedRow[this.mapConfig.startDate]).getTime()
          : new Date().setHours(0, 0, 0);

      const endDate =
        this.isTimeMapping && this.mapConfig.startDate
          ? new Date(feedRow[this.mapConfig.startDate]).getTime()
          : new Date().setHours(23, 59, 59);

      if (now.getTime() < startDate) continue;
      if (now.getTime() > endDate) continue;

      for (const [mapKey, mapIndex] of Object.entries(this.mapConfig)) {
        Object.assign(item, this.recursiveMapping(mapKey, mapIndex, feedRow));
      }

      this.data.push(item);
    }

    window.Creative.data = this.data;
    window.Creative.startAnimation();
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
