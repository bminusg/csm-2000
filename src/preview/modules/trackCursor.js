export default () => {
  let frames = [];

  window.addEventListener("mousemove", (event) => {
    const X = event.clientX;
    const Y = event.clientY;

    if (frames.length < 1) frames = document.getElementsByTagName("iframe");

    for (const frame of frames) {
      frame.contentWindow.postMessage(
        {
          message: "cursorPosition",
          data: {
            X: X,
            Y: Y,
          },
        },
        "*"
      );
    }
  });
};
