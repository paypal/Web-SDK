import type { ParentProps } from "./parent-component";
import { emit } from "framebus";
import {
  FrameBaseComponent,
  FrameComponentProps,
} from "./frame-base-component";

type ParentProperties = ParentProps["properties"];
export type ChildProps = Partial<FrameComponentProps> & {
  onCreate?: (props?: { properties: ParentProperties }) => void;
};

export class ChildComponent extends FrameBaseComponent {
  constructor(options: ChildProps) {
    super({
      channel: window.location.hash.slice(1, window.location.hash.length),
      methods: options.methods || [],
      hooks: options.hooks || {},
    });
    const parentProps = JSON.parse(window.name || "{}");

    this.onCreate(options, parentProps);
  }

  private async onCreate(
    options: ChildProps,
    parentProperties: ParentProperties
  ) {
    if (typeof options?.onCreate === "function") {
      await options.onCreate({
        properties: parentProperties,
      });
    }

    emit(this.busConfig, "child-ready");
  }
}
