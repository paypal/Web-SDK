import { initialize, FramebusConfig, FramebusOptions, on, emit } from "framebus";

export type ParentProps = FramebusOptions & {
  url?: string;
  properties?: {
    [key: string]: unknown;
  };
  methods?: string[],
  hooks?: {
    [key: string]: Function
  },
};

export class ParentComponent {
  url: string;
  private iframe: HTMLIFrameElement;
  private busConfig: FramebusConfig;

  methods: { [key: string]: Function } = {};

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

    on(this.busConfig, "child-ready", (data, reply) => {
      reply({
        properties: options.properties,
      });
    });

    if (Array.isArray(options.methods) && options.methods.length) {
      this.setMethods(options.methods);
    }
    if (options.hooks && Object.keys(options.hooks).length) {
      this.setHooks(options.hooks);
    }
  }

  private setMethods(methods: Array<string>) {
    for (const methodName of methods) {
      this.methods[methodName] = (...args: any) => {
        emit(this.busConfig, `${methodName}-parent-method`, { args });
      }
    }
  }

  private setHooks(hooksMap: { [key: string]: Function }) {
    Object.keys(hooksMap).forEach((methodName) => {
      on(this.busConfig, `${methodName}-parent-method`, (data) => hooksMap[methodName](data));
    })
  }

  async render(container: HTMLElement): Promise<this> {
    this.iframe.src = `${this.url}${this.busConfig.channel ? '#' + this.busConfig.channel : ''}`;

    container.appendChild(this.iframe);
    return Promise.resolve(this);
  }
}
