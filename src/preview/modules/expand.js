const ads2Handle = {};
const expHandle = {};

function initOvk() {
  const eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  const messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

  window.addEventListener(
    messageEvent,
    (event) => {
      event.preventDefault();
      listenMessage(event);
    },
    false
  );
}

function listenMessage(msg) {
  if (!msg.data) return;

  if (typeof msg.data !== "string") return;

  if (msg.data && msg.data.match(":;:")) {
    var call = msg.data.split(":;:");

    //console.log(call);
    //console.log(ads2Handle);
    //console.log(!ads2Handle[call[1]]);

    if (!ads2Handle[call[1]]) {
      walkFrames(call[1], window.top, msg);
    }

    if (call[0] === "expandAd") expandAd(msg);
    if (call[0] === "contractAd") collapseAd(msg);
  }
}

function walkFrames(adName, w, event) {
  const frames = document.getElementsByTagName("iframe");

  for (const frame of frames) {
    if (frame.contentWindow === event.source) {
      ads2Handle[adName] = frame;

      Object.assign(expHandle, {
        [adName]: {
          width: frame.clientWidth,
          height: frame.clientHeight,
        },
      });
    }
  }
}

function expandAd(msg) {
  const call = msg.data.split(":;:");
  const frame = ads2Handle[call[1]];
  const width = call[2];
  const height = call[3];

  console.log(width);

  frame.style.transition = "all 2s cubic-bezier(0.65, 0, 0.35, 1)";
  frame.style.height = height;
  frame.style.width = width;
}

function collapseAd(msg) {
  const call = msg.data.split(":;:");
  const frame = ads2Handle[call[1]];
  const adName = call[1];
  const width = expHandle[adName].width;
  const height = expHandle[adName].height;

  frame.style.height = height + "px";
  frame.style.width = width + "px";
}

export default initOvk;
