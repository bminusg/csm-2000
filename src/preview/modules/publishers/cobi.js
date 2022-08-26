import "../../sass/pages/cobi.sass";

export default () => {
  const superbanner = document.querySelector(
    ".widget[data-widget-type='superbanner']"
  );
  const billboard = document.querySelector(".widget[data-widget-type='bb']");
  superbanner.style.display = "flex";
  superbanner.appendChild(billboard);
};
