import type { ParentProps } from "./parent-component";
import { emit, FramebusConfig, initialize, on } from "framebus";
import {
  FrameBaseComponent,
  FrameComponentProps,
} from "./frame-base-component";

type ParentProperties = ParentProps["properties"];
export type ChildProps = Partial<FrameComponentProps> & {
  onCreate?: (props?: { properties: ParentProperties }) => void;
};

export class ChildComponent extends FrameBaseComponent {
  private properties: ChildProps;
  private parentProps: ParentProperties = {};

  constructor(options: ChildProps) {
    super({
      channel: window.location.hash.slice(1, window.location.hash.length),
      methods: options.methods || [],
      hooks: options.hooks || {},
    });

    this.properties = options;

    this.handShake();
  }

  private handShake() {
    emit(this.busConfig, "child-ready", {}, (payload) => {
      this.parentProps = (payload as ParentProps)
        .properties as ParentProperties;
      this.onCreate();
    });
  }

  private onCreate() {
    if (typeof this.properties?.onCreate === "function") {
      this.properties.onCreate({
        properties: this.parentProps,
      });
    }
  }
}
