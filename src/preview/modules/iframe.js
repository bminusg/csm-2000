/**
 *
 * @param {String} className name of iframe class
 * @param {String} src defines iframe source path
 * @return {Element} iframe
 */
const createIframe = (className = "", src = "about:blank") => {
  const iframe = document.createElement("iframe");
  iframe.classList.add(className);
  iframe.src = src;

  return iframe;
};

export default createIframe;
