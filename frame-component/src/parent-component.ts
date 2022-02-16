import { on } from "framebus";
import uuid from "@braintree/uuid";
import iFramer from "@braintree/iframer";
import {
  FrameBaseComponent,
  FrameComponentProps,
} from "./frame-base-component";

export type ParentProps = Partial<FrameComponentProps> & {
  url: string;
  properties?: {
    [key: string]: unknown;
  };
};

export class ParentComponent extends FrameBaseComponent {
  url: string;
  private iframe: HTMLIFrameElement;

  constructor(options: ParentProps) {
    super({
      channel: uuid(),
      methods: options.methods || [],
      hooks: options.hooks || {},
    });
    this.url = options.url as string;

    // TODO iframe creation should be moved to helper private method
    // TODO iframe should have title
    // TODO should remove default iframe styling
    const iframeName = JSON.stringify(options.properties || {});

    this.iframe = iFramer({
      name: iframeName,
      style: {}
    }) 
  }

  async render(container: HTMLElement): Promise<this> {
    return new Promise((resolve) => {
      // TODO move event-name to constant
      // TODO change to once method when available
      on(this.busConfig, "child-ready", () => {
        resolve(this);
      });

      this.iframe.src = `${this.url}#${this.channel}`;

      container.appendChild(this.iframe);
    });
  }
}
