import { initialize, FramebusConfig, FramebusOptions, on } from "framebus";

export type ParentProps = FramebusOptions & {
  url?: string;
  properties?: {
    [key: string]: unknown;
  };
  methods?: [string],
  hooks?: {
    [key: string]: Function
  }
};

export class ParentComponent {
  url: string;
  private iframe: HTMLIFrameElement;
  private busConfig: FramebusConfig;

  constructor(options: ParentProps = {}) {
    this.url = options.url as string;

    // TODO unique identifier for channel property as well
    this.busConfig = initialize({
      channel: options.channel,
    });
    // TODO will need to pass the channel bit as well
    // TODO should remove default iframe styling
    this.iframe = document.createElement("iframe");
    this.iframe.style.border = "0";

    console.log('setting up teh chld ready listgener')
    console.log(this.busConfig);
    on(this.busConfig, "child-ready", (data, reply) => {
      console.log("got the event that the child is ready");
      reply({
        properties: options.properties
      });
    });
    // TODO define the methods property as a record with string keys and function values
    // this.methods = {};
    // loop through the method names array
    // this.methods[methodName] = (...args) => {
    //   emit(config, methodName-with-namespace, {
    //     args
    //   })
    // }
  }

  async render(container: HTMLElement): Promise<this> {
    this.iframe.src = `${this.url}${this.busConfig.channel ? '#' + this.busConfig.channel : ''}`;

    container.appendChild(this.iframe);
    return Promise.resolve(this);
  }
}
