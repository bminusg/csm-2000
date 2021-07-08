"use strict";

class CrossSiteConnection {
  constructor(options = {}) {
    // META
    this.name = "CrossSite";
    this.timestamp = new Date().getTime();

    // SETUP
    this.timeout = parseInt(options.timeout) || 3000;
    this.timeoutOn = new Date().getTime() + this.timeout;
    this.connect = options.connect;

    // CONNECTION
    this.frames = [];
    this.connected = false;
    this.countConnect = 0;
  }

  /**
   *
   * @param {Object} options Values from Creative
   * @desc If there is no custom configuration use values from main Creative Object
   *
   */
  load(options) {
    this.groupID = options.groupID;
    this.frameID = options.frameID;

    this.events();
  }

  /**
   * @desc Append postMessage Listeners and start Watch Job
   *
   */
  events() {
    // DEFINE POST MESSAGE EVENT LISTNERS
    window.addEventListener("message", (event) => {
      const type = event.data.type;
      const origin = event.data.origin;

      // DEFINING FRAMES
      if (type === "sayHello") this.defineFrames(origin, event.source);

      // FRAME CALLED LOCATED
      if (type === "located") this.connectFrames(origin);

      // INIT ANIMATION
      if (type === "connected") this.initFrames();
    });

    // START WATCH JOB
    this.watchJobInterval = setInterval(this.watchJob.bind(this), 100);
  }

  /**
   * @desc watch intervall to find out if all creatives are connected
   */
  watchJob() {
    // TIMEOUT CHECK
    this.checkTimeout();

    // LOOP AND FILTER TROUGH ALL WINDOW FRAMES
    if (!this.connected) return this.frameLoop();

    // CHECK IF EVERY FRAME IS CONNECTED
    if (this.checkConnection()) this.onSucces();
  }

  /**
   *
   * @param {Array} frames Array of window elements
   * @desc Loop through all window frames starting on top-window and send to all frames a "hello" message with sender string for identyfing
   *
   */
  frameLoop(frames = window.top.frames) {
    if (frames.length === 0) return;

    for (let i = 0; i < frames.length; i++) {
      if (frames[i].frames.length > 0) this.frameLoop(frames[i].frames);

      frames[i].postMessage(
        {
          origin: this.frameID,
          type: "sayHello",
        },
        "*"
      );
    }
  }

  /**
   *
   * @param {String} ID incomming frame ID
   * @param {Window Element} source Window Element from frame ID
   * @desc check if incomming frame ID matches
   */
  defineFrames(ID, source) {
    // RETURN IF FRAME IS LOCATED
    if (this.checkFrame(ID)) return this.onLocate();

    // FILTER IF ID DOESN'T MATCH
    if (this.connect.indexOf(ID) === -1) return;

    // PREVENT DUPLICATE
    if (source === window) return;

    console.log("DEFINE FRAME: " + ID + " on --> " + this.frameID);

    // PUSH FRAME TO ELEMENTS
    this.frames.push({
      ID: ID,
      viewport: source,
      connected: false,
    });
  }

  /**
   *
   * @param {String} frameID
   * @returns {Boolean}
   * @desc Confirm if frameID can be located
   *
   */
  checkFrame(frameID) {
    let check = false;

    this.frames.forEach((frame) => {
      if (frame.ID === frameID) return (check = true);
    });

    return check;
  }

  /**
   *
   * @returns {Boolean}
   * @desc Confirm that all frames are connected
   */
  checkConnection() {
    let check = false;

    this.frames.forEach((frame) => {
      if (!frame.connected) return;
      check = true;
    });

    return check;
  }

  /**
   * @desc Check if Timeout
   */
  checkTimeout() {
    const timestamp = new Date().getTime();
    if (timestamp >= this.timeoutOn) this.onTimeout();
    if (window === window.top) this.onTimeout();
  }
  connectFrames(frameID) {
    this.frames.forEach((frame) => {
      if (frame.ID === frameID) frame.connected = true;
    });
  }

  /**
   * @desc Connection success Event
   *
   */
  onSucces() {
    // STOP WATCH-JOB
    clearInterval(this.watchJobInterval);

    // COLLECTING ALL CONNECTED VIEWPORTS
    let viewports = this.frames.map((frame) => frame.viewport);
    viewports.push(window);

    // SAY TO ALL THAT EVERYTHING IS CONNECTED
    viewports.forEach((frame) => {
      frame.postMessage(
        {
          type: "connected",
          origin: this.frameID,
        },
        "*"
      );
    });
  }

  /**
   * @desc Located Succes Event
   *
   */
  onLocate() {
    // SET FLAG
    this.connected = this.checkConnection();

    // SAY TO ALL FRAMES THAT I AM CONNECTED
    for (const frame of this.frames) {
      frame.viewport.postMessage(
        {
          type: "located",
          origin: this.frameID,
        },
        "*"
      );
    }
  }

  /**
   *
   * @desc Timeout Event
   */
  onTimeout() {
    //    console.error("[" + this.frameID + "] is timeout");
    clearInterval(this.watchJobInterval);

    // FALLBACK INIT START ANIMATION WITH TIMEOUT IDENTIFICATION
    window.Creative.startAnimation({
      connected: false,
    });
  }

  /**
   * @desc Every Creative is connected, now we can init every Creative
   *
   */
  initFrames() {
    clearInterval(this.watchJobInterval);
    window.Creative.startAnimation();
  }
}

export default CrossSiteConnection;
