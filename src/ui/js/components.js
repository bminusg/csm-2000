export class Creative extends HTMLElement {
  constructor() {
    super();
    this.data = {};
  }

  set project(project) {
    this.data.project = project;
  }

  set creative(creative) {
    this.data.creative = creative;

    const href = this.defineHref();

    this.innerHTML = `
      <div class="creative creative--grid" data-brand="${this.data.project.brand.name}" data-campaign="${this.data.project.campaign.name}" data-format="${creative.format.name}">
        <div class="creative--version">
          <p>${creative.version}</p>
        </div>
        <div class="creative--campaign">
          <h2>${this.data.project.campaign.name}</h2>
          <p class="creative--campaign-subline">${this.data.project.brand.name}</p>
        </div>
        <div class="creative--format">
          <h2 class="creative--format-name">${creative.format.name}</h2>
          <p class="creative--format-subline">${creative.format.width}x${creative.format.height}</p>
        </div>
        <div class="creative--actions flex">
          <a class="creative--actions-link creative--actions-link" href="${href}" target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="creative--actions-icon"><path d="M14 20H3c-1.65 0-3-1.35-3-3V6c0-1.65 1.35-3 3-3h6c.55 0 1 .45 1 1s-.45 1-1 1H3c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h11c.55 0 1-.45 1-1v-6c0-.55.45-1 1-1s1 .45 1 1v6c0 1.65-1.35 3-3 3Z"/><path d="M19.92.62A1.019 1.019 0 0 0 19 0h-6c-.55 0-1 .45-1 1s.45 1 1 1h3.59l-9.3 9.29a.996.996 0 0 0 .71 1.7c.26 0 .51-.1.71-.29L18 3.41V7c0 .55.45 1 1 1s1-.45 1-1V1c0-.13-.03-.26-.08-.38Z"/></svg>
          </a>
        </div>
      </div>
    `;
  }

  defineHref() {
    const previewPath = "/preview/index.html";
    const project = this.data.project;
    const creative = this.data.creative;
    let previewQuery = `${creative.format.slug}=${creative.slug}`;

    if (creative.components) {
      const components = project.creatives
        .filter(
          (projectCreative) =>
            creative.components.indexOf(projectCreative.id) > -1
        )
        .filter(
          (projectCreative) => projectCreative.format.type === "RichMedia"
        );

      components.forEach((component) => {
        previewQuery += `&${component.format.slug}=${component.slug}`;
      });
    }

    return `${previewPath}?${previewQuery}`;
  }
}
