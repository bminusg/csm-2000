export default (msgString = "", type = "active") => {
  if (msgString === "") return;

  const layer = document.querySelector(".app--layer");
  const txtElement = layer.querySelector(".app--layer-msg p");
  const typeClassName = "app--layer-" + type;

  txtElement.innerHTML = msgString;
  layer.classList.add(typeClassName);
};
