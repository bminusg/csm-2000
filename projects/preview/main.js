import "./less/main.less";
import createIframe from "./modules/iframe.js";
import getSRC from "./modules/source.js";

window.PREVIEW = {
  params: {
    publisher: [],
    device: [],
  },
  init() {
    // DEFINE APP CONTAINER
    this.app = document.querySelector(".app");
    if (!this.app) return this.log("Can't find APP container", "error");

    // DEFINE META SETUP - CREATIVES
    const query = window.location.search.substring(1);
    const params = query.length === 0 ? [] : query.split("&");

    params.forEach((paramString) => {
      const param = paramString.split("=");

      if (!this.params[param[0]]) {
        Object.assign(this.params, {
          [param[0]]: [param[1]],
        });
      } else {
        this.params[param[0]].push(param[1]);
      }
    });

    if (Object.keys(this.params).length < 3)
      return this.log("Creative search params are missing", "error");

    // DEFINE META SETUP - PUBLISHER
    this.app.dataset.publisher = this.params.publisher[0];

    // BUILD CREATIVE CONTAINERS
    this.buildCreativeContainers();
  },
  buildCreativeContainers() {
    // TIP: Validate Containers dynamicly from Markup. This is a guarentee for excisting containers
    const paramKeys = Object.keys(this.params);

    // LOOP PARAMS
    for (const param of paramKeys) {
      const containers = document.querySelectorAll(".creative--" + param);

      // SKIP IF PARAM IF THERE IS NO CREATIVE DIV CONTAINER
      if (containers.length === 0) continue;

      // LOOP BANNER CONTAINER. THIS IS NECESSARY BECAUSE SOMETIMES THERE ARE MULIPLE BANNER CONTAINERS
      for (let container of containers) {
        let iframe = null;

        // CASE IF THERE ARE MULTIPLE CONTAINERS
        if (containers.length > 1 && container.className.indexOf("left") > -1) {
          // CASE DOUBLE DYNAMIC SITEBAR
          // IF THERE ARE 2 CONTAINERS COMBINE THE SECOND SLUG TO THE FIRST CONTAINER
          if (this.params[param].length > 1) {
            iframe = createIframe(
              "creative--" + param + "-iframe",
              getSRC(this.params[param][1])
            );
          }
        } else {
          iframe = createIframe(
            "creative--" + param + "-iframe",
            getSRC(this.params[param][0])
          );
        }

        // EDGE CASE: BILDde HOME Billboard container has to be the superbanner
        if (this.params.publisher[0] === "bild" && param === "billboard")
          container = document.querySelector(".creative--superbanner");

        // APPEND IFRAME
        if (iframe) container.appendChild(iframe);
      }
    }
  },
  log(msgString = "", type = "active") {
    if (msgString === "") return;

    const layer = document.querySelector(".app--layer");
    const txtElement = layer.querySelector(".app--layer-msg p");
    const typeClassName = "app--layer-" + type;

    txtElement.innerHTML = msgString;
    layer.classList.add(typeClassName);
  },
};

window.addEventListener("DOMContentLoaded", window.PREVIEW.init());
