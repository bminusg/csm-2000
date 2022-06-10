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
    const call = msg.data.split(":;:");
    const container = window.PREVIEW.widgets.find(
      (widget) => widget.source === call[1]
    ).container;

    if (call[0] === "expandAd") expandAd(call, container);
    if (call[0] === "contractAd") collapseAd(call, container);
  }
}

function expandAd(call, container) {
  const width = call[2];
  const height = call[3];

  container.style.transition = "all 1.5s cubic-bezier(0.65, 0, 0.35, 1)";
  container.style.height = height;
  container.style.width = width;
}

function collapseAd(call, container) {
  container.style.removeProperty("height");
  container.style.removeProperty("width");
}

export default initOvk;
