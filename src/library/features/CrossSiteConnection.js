"use strict";

/**
 *
 * If you have multiple frames on one ad impression you can connect them to run your animation synchronously and interact between the frames. You only have to define on every Creative the Creative slugs which you want to connect.
 *
 * @param { String[] } options.connectWith Required. String concatenation from your Creative frame ID's which you want to connect.
 *
 *
 */

class CrossSiteConnection {
  constructor(options = {}) {
    // META
    this.name = "CrossSiteConnection";

    // SETUP
    this.timeout = parseInt(options.timeout) || 3000;
    this.timeoutOn = new Date().getTime() + this.timeout;
    this.connectWith = options.connectWith;

    // CONNECTION
    this.frames = [];
    this.connected = false;
    this.countConnect = 0;
    this.maxCounts = this.connectWith.length * (this.connectWith.length + 1);
    this.isConnectionSuccess = false;

    // CUSTOM METHODS
    this.methods = options.methods || {};

    // CALC VIEWPORTS
    this.viewports = {};
  }

  /**
   *
   * @param {Object} options values depending from Creative initialising
   * @desc If there is no custom configuration use values from main Creative Object
   * @desc Append postMessage Listeners and starts the Watch Job
   *
   */
  load() {
    // APPEND CROSS SITE COMMUNICATION FUNC TO METHODS
    Object.assign(this.methods, { set: this.set.bind(this) });

    // ADD CROSS SITE EVENT LISTENER
    this.appendCustomEvent();

    // DEFINE POST MESSAGE EVENT LISTNERS
    window.addEventListener("message", (event) => {
      try {
        const { data, method, origin, type, viewport } = event.data;

        // DEFINING FRAMES
        if (type === "sayHello") this.defineFrames(origin, event.source);

        // FRAME CALLED LOCATED
        if (type === "located") this.connectFrames(origin);

        // COUNT CONNECTIONS
        if (type === "connected") this.countUpConnection(event);

        // INIT ANIMATION
        if (type === "connectionSuccess") this.initFrames();

        // EXEC CROSS ACTION METHODS
        if (type === "action") this.methods[method](data);

        // SET VIEWPORT SIZES
        if (viewport) this.setViewportVars(origin, viewport);
      } catch (error) {
        console.debug(error);
      }
    });

    window.addEventListener("resize", () => {
      const viewports = this.frames.map((frame) => frame.viewport);
      console.log("RESIZE");
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
    if (this.checkConnection()) this.isConnected();
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
    if (this.connectWith.indexOf(ID) === -1) return;

    // PREVENT DUPLICATE
    if (source === window) return;

    //console.log("DEFINE FRAME: " + ID + " on --> " + this.frameID);

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
    const connectedFrames = this.frames.filter((frame) => frame.connected);

    if (connectedFrames.length === this.connectWith.length) return true;
    return false;
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

  countUpConnection(event) {
    this.countConnect++;

    if (this.countConnect < this.maxCounts) return;
    clearInterval(this.watchJobInterval);

    const viewports = this.frames.map((frame) => frame.viewport);
    viewports.forEach((viewport) =>
      viewport.postMessage(
        {
          type: "connectionSuccess",
          origin: this.frameID,
          viewport: {
            x: window.innerWidth,
            y: window.innerHeight,
          },
        },
        "*"
      )
    );
  }

  /**
   * @desc Connection success Event
   *
   */
  isConnected() {
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
    console.error("[" + this.frameID + "] is timeout");
    clearInterval(this.watchJobInterval);

    // APPEND FALLBACK CLASS
    window.Creative.container.classList.add("is--timeout");

    // FALLBACK INIT START ANIMATION WITH TIMEOUT IDENTIFICATION
    window.Creative.startAnimation({
      connected: false,
    });
  }

  /**
   *
   * @desc Append a custom event listener and send set
   */
  appendCustomEvent() {
    const container = window.Creative.container;
    container.addEventListener("crossSiteCommunication", (e) => {
      // RETURN IF METHOD IS MISSING

      if (!e.detail || !e.detail.method)
        return console.error(
          "Missing detail method params. Please append a detail.method param when you are dispatchig the crossSiteCommuniction event"
        );

      // DEFINE OPTIONS

      const options = {
        targets: e.detail.targets || this.connectWith,
        method: e.detail.method,
        data: e.detail.data || { ...container.dataset } || null,
      };

      // TRIGGER CROSS SITE COMMUNICATION FUNC
      this.set(options);
    });
  }

  /**
   * @desc Every Creative is connected, now we can init every Creative
   *
   */
  initFrames() {
    clearInterval(this.watchJobInterval);
    if (this.isConnectionSuccess) return;
    this.isConnectionSuccess = true;

    window.Creative.startAnimation();

    // START CUSTOM METHOD
    if (!this.methods || !this.methods.start) return;
    this.methods.start();
  }

  setViewportVars(origin, viewport) {
    Object.assign(this.viewports, {
      [this.frameID]: { x: window.innerWidth, y: window.innerHeight },
      [origin]: viewport,
    });

    if (Object.keys(this.viewports).length === this.connectWith.length + 1) {
      this.calcViewport();
    }
  }

  calcViewport() {
    const root = document.querySelector(":root");
    const totalViewport = { x: 0, y: 0 };

    for (const origin of Object.keys(this.viewports)) {
      const { x, y } = this.viewports[origin];

      totalViewport.x += x;
      totalViewport.y = y > totalViewport.y ? y : totalViewport.y;

      root.style.setProperty(`--${origin}-x`, x + "px");
      root.style.setProperty(`--${origin}-y`, y + "px");
    }

    root.style.setProperty(`--viewport-x`, totalViewport.x + "px");
    root.style.setProperty(`--viewport-y`, totalViewport.y + "px");
  }

  /**
   *
   * @param {Object} options
   * @desc funtion provides a shorthand function for interacting between different Creatives
   *
   */
  set(options) {
    // VALIDATE TARGETS AND EXEC ACTION
    const targets = options.targets || this.connectWith;

    targets.forEach((target) => {
      const frame = this.frames.find((frame) => frame.ID === target);
      if (!frame) throw new Error("Can't find frame target: " + target);

      frame.viewport.postMessage(
        {
          type: "action",
          method: options.method,
          data: options.data,
        },
        "*"
      );
    });
  }
}

export default CrossSiteConnection;
