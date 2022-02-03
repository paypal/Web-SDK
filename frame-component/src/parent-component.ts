import { initialize, FramebusConfig, FramebusOptions, on } from "framebus";
import { uniqueID } from "./utils";

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
      // origin: props.url || this.staticProperties.url,
      channel: props.channel,
    });
    // TODO will need to pass the channel bit as well
    // TODO should remove default iframe styling
    this.iframe = document.createElement("iframe");
    this.iframe.style.border = "0";

    on(this.busConfig, "child-ready", (data, reply) => {
      console.log("got the event that the child is ready");
      reply(props);
    });
  }

  async render(container: HTMLElement): Promise<this> {
    this.iframe.src = this.staticProperties.url + `#${this.busConfig.channel}`;

    container.appendChild(this.iframe);
    return Promise.resolve(this);
  }
}
