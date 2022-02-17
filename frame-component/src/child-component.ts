import type { ParentProperties } from "./parent-component";
import { emit } from "framebus";
import {
  FrameBaseComponent,
  FrameComponentOptions,
} from "./frame-base-component";
import { CHILD_READY_EVENT } from "./internal-event-names";

export type ChildOptions = Partial<FrameComponentOptions> & {
  onCreate?: (options: { properties: ParentProperties }) => void;
};

export class ChildComponent extends FrameBaseComponent {
  constructor(options: ChildOptions) {
    super({
      channel: window.location.hash.slice(1, window.location.hash.length),
      methods: options.methods || [],
      hooks: options.hooks || {},
    });
    const parentProps = JSON.parse(window.name || "{}");

    this.onCreate(options, parentProps);
  }

  private async onCreate(
    options: ChildOptions,
    parentProperties: ParentProperties
  ) {
    if (typeof options?.onCreate === "function") {
      await options.onCreate({
        properties: parentProperties || {},
      });
    }

    emit(this.busConfig, CHILD_READY_EVENT);
  }
}
