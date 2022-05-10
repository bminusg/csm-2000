import { Creative } from "./js/components.js";
import Filter from "./js/filter.js";
import projects from "src/data/json/projects.json";
import "./sass/main.sass";

customElements.define("creative-item", Creative);

window.addEventListener("load", () => {
  const root = document.querySelector("#projects--list");

  projects = projects.sort(
    (a, b) => a.campaign.planning.start < b.campaign.planning.start
  );

  for (const project of projects) {
    const creatives = project.creatives;

    for (const creative of creatives) {
      const component = document.createElement("creative-item");

      component.project = project;
      component.creative = creative;

      root.appendChild(component);
    }
  }

  const filter = new Filter({
    itemQuery: ".creative",
    inputID: "searchCreativeField",
    display: "grid",
  });
});
