import "../sass/pages/giga.sass";

export default () => {
  //console.log("GIGA CHUNK");
  const root = document.querySelector(":root");

  window.addEventListener("scroll", scrollListener);

  function scrollListener(event) {
    event.preventDefault();
    const offset = getOffsetTop();
    const offsetNav = offset[1] >= 120 ? 0 : 120 - offset[1];

    root.style.setProperty(
      "--publisher--widget--bboost-offset-nav",
      offsetNav + "px"
    );
  }

  function getOffsetTop() {
    const offsetLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const offsetTop = window.pageYOffset || document.documentElement.scrollTop;

    return [offsetLeft, offsetTop];
  }
};
