// import { initialize, FramebusConfig, FramebusOptions } from "framebus";

export type ParentProps = {};
// export type ParentProps = FramebusOptions & {
//   url?: string;
//   properties?: {
//     [key: string]: string | number;
//   };
//   methods?: {
//     [key: string]: Function;
//   };
// };

export abstract class ParentComponent {
  static url: string;
  private iframe: HTMLIFrameElement;
  private staticProperties: typeof ParentComponent;
  // private busConfig: FramebusConfig;

  constructor(props: ParentProps = {}) {
    // this.busConfig = initialize({ origin: props.url });
    this.iframe = document.createElement("iframe");
    this.staticProperties = this.constructor as typeof ParentComponent;
  }

  async render(container: HTMLElement): Promise<this> {
    this.iframe.src = this.staticProperties.url;

    container.appendChild(this.iframe);
    return Promise.resolve(this);
  }
}
