import { once } from "framebus";
import uuid from "@braintree/uuid";
import iFramer from "@braintree/iframer";
import {
  FrameBaseComponent,
  FrameComponentOptions,
} from "./frame-base-component";
import { CHILD_READY_EVENT } from "./internal-event-names";

export type ParentProperties = {
  [key: string]: unknown;
};
export type ParentOptions = Partial<FrameComponentOptions> & {
  url: string;
  properties?: ParentProperties;
  title: string;
  id?: string;
};

export class ParentComponent extends FrameBaseComponent {
  url: string;
  private iframe: HTMLIFrameElement;

  constructor(options: ParentOptions) {
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

    this.iframe = iFramer({
      name: parentProperties,
      title: options.title,
      id: options.id,
    });
  }

  async render(container: HTMLElement): Promise<this> {
    return new Promise((resolve) => {
      once(this.busConfig, CHILD_READY_EVENT, () => {
        resolve(this);
      });

      this.iframe.src = `${this.url}#${this.channel}`;

      container.appendChild(this.iframe);
    });
  }
}
