import { on } from "framebus";
import uuid from "@braintree/uuid";
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

    // TODO should remove default iframe styling
    this.iframe = document.createElement("iframe");
    this.iframe.style.border = "0";

    // TODO move event-name to constant
    // TODO should this live in render instead?
    on(this.busConfig, "child-ready", (data, reply) => {
      reply({
        properties: options.properties,
      });
      // TODO since this is a one time event, we should call `off` to remove it
    });
  }

  async render(container: HTMLElement): Promise<this> {
    this.iframe.src = `${this.url}#${this.channel}`;

    container.appendChild(this.iframe);

    // TODO should probably wait until the child frame
    // reports it is ready before resolving
    return Promise.resolve(this);
  }
}
