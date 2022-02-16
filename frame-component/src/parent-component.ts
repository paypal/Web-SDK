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

    // this is a little odd, but since we want the child component to
    // have access to the properties set in the parent component
    // right away, we embed them as part of the iframe name
    // where the child component can parse them right away
    const parentProperties = JSON.stringify(options.properties || {});

    // TODO should be able to configure title and id in props
    this.iframe = iFramer({
      name: parentProperties,
    });
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
