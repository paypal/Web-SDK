export type ParentProps = {};

export abstract class ParentComponent {
  static url: string;
  private iframe: HTMLIFrameElement;
  private staticProperties: typeof ParentComponent;

  constructor(props: ParentProps = {}) {
    this.iframe = document.createElement("iframe");
    this.staticProperties = this.constructor as typeof ParentComponent;
  }

  async render(container: HTMLElement): Promise<this> {
    this.iframe.src = this.staticProperties.url;

    container.appendChild(this.iframe);
    return Promise.resolve(this);
  }
}
