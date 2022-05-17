export default () => {
  const app = document.querySelector(".app");
  const sitebars = document.querySelectorAll(".creative--sitebar");
  let isScrolling;

  sitebars.forEach(
    (sitebar) =>
      (sitebar.style.transition = "transform 1s cubic-bezier(0.25, 1, 0.5, 1)")
  );

  window.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
        const offset = app.scrollTop;

        sitebars.forEach(
          (sitebar) =>
            (sitebar.style.transform = "translateY(" + offset + "px)")
        );
      }, 50);
    },
    true
  );
};
