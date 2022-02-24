import type { ParentProperties } from "./parent-component";
import { emit } from "framebus";
import { useEffect } from "preact/hooks";
import type { VNode } from "preact";
import {
  FrameBaseComponent,
  FrameComponentOptions,
} from "./frame-base-component";
import { CHILD_READY_EVENT } from "./internal-event-names";

export type ChildOptions = Partial<FrameComponentOptions> & {
  render: (options: { properties: ParentProperties }) => VNode;
};

export class ChildComponent extends FrameBaseComponent {
  private parentProps: ParentProperties;
  private configuredRender: ChildOptions["render"];

  constructor(options: ChildOptions) {
    super({
      channel: window.location.hash.slice(1, window.location.hash.length),
      methods: options.methods || [],
      methodNamespace: "child",
      hookNamespace: "parent",
    });
    this.parentProps = JSON.parse(window.name || "{}");
    this.configuredRender = options.render;
  }

  render() {
    return () => {
      useEffect(() => {
        emit(this.busConfig, CHILD_READY_EVENT);
      }, []);
      return this.configuredRender({
        properties: this.parentProps,
      });
    };
  }
}
