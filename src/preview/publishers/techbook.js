import "../sass/pages/techbook.sass";

export default () => {
  const root = document.querySelector(":root");
  const billboard = document.querySelector(".widget[data-widget-type='bb']");
  const sitebars = document.querySelectorAll(
    ".widget[data-widget-type='sitebar']"
  );
  const superbanner = document.querySelector(
    ".widget[data-widget-type='superbanner']"
  );

  if (sitebars.length > 0 && billboard) {
    superbanner.style.display = "flex";
    superbanner.appendChild(billboard);

    root.style.setProperty("--widget--billboard-width", "1040px");
    root.style.setProperty("--widget--billboard-height", "250px");
  }
};
