import type { ParentProperties } from "./parent-component";
import { emit } from "framebus";
import {
  FrameBaseComponent,
  FrameComponentOptions,
} from "./frame-base-component";
import { CHILD_READY_EVENT } from "./internal-event-names";

export type ChildOptions = Partial<FrameComponentOptions>;

export class ChildComponent extends FrameBaseComponent {
  public properties: ParentProperties;

  constructor(options: ChildOptions) {
    super({
      channel: window.location.hash.slice(1, window.location.hash.length),
      methods: options.methods || [],
      methodNamespace: "child",
      hookNamespace: "parent",
    });
    this.properties = JSON.parse(window.name || "{}");
  }

  reportReady() {
    emit(this.busConfig, CHILD_READY_EVENT);
  }
}
