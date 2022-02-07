import { initialize, FramebusConfig, FramebusOptions, on } from "framebus";

export type ParentProps = FramebusOptions & {
  url?: string;
  properties?: {
    [key: string]: unknown;
  };
};

export class ParentComponent {
  url: string;
  private iframe: HTMLIFrameElement;
  private busConfig: FramebusConfig;

  constructor(props: ParentProps = {}) {
    this.url = props.url as string;

    // TODO unique identifier for channel property as well
    this.busConfig = initialize({
      origin: this.url,
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
    this.iframe.src = `${this.url}${this.busConfig.channel ? '#' + this.busConfig.channel : ''}`;

    container.appendChild(this.iframe);
    return Promise.resolve(this);
  }
}
