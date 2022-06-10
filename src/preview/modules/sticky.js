export default (element) => {
  const app = document.querySelector(".app");
  let isScrolling;

  element.style.transition = "transform 1s cubic-bezier(0.25, 1, 0.5, 1)";

  window.addEventListener(
    "scroll",
    () => {
      window.clearTimeout(isScrolling);

      isScrolling = setTimeout(() => {
        const offset = app.scrollTop;
        element.style.transform = "translateY(" + offset + "px)";
      }, 50);
    },
    true
  );
};
