import { initialize, FramebusConfig, FramebusOptions } from "framebus";

export type ParentProps = FramebusOptions & {
  url?: string;
  properties?: {
    [key: string]: unknown;
  };
};

export abstract class ParentComponent {
  static url: string;
  private iframe: HTMLIFrameElement;
  private staticProperties: typeof ParentComponent;
  private busConfig: FramebusConfig;

  constructor(props: ParentProps = {}) {
    this.staticProperties = this.constructor as typeof ParentComponent;

    // TODO unique identifier for channel property as well
    this.busConfig = initialize({
      origin: props.url || this.staticProperties.url,
    });
    // TODO will need to pass the channel bit as well
    // TODO should remove default iframe styling
    this.iframe = document.createElement("iframe");

    // TODO send properties to iframe
  }

  async render(container: HTMLElement): Promise<this> {
    this.iframe.src = this.staticProperties.url;

    container.appendChild(this.iframe);
    return Promise.resolve(this);
  }
}
