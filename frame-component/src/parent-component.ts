export class ParentComponent {
  private iframe: HTMLIFrameElement;

  constructor() {
    this.iframe = document.createElement("iframe");
  }

  async render(container: HTMLElement): Promise<this> {
    container.appendChild(this.iframe);
    return Promise.resolve(this);
  }
}
