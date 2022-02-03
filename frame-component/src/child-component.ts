import type { ParentProps } from "./parent-component";
import { emit, FramebusConfig, initialize } from "framebus";

type ChildProps = {
  onCreate?: (props?: {
    // methods: ParentProps["methods"];
    properties: ParentProps["properties"];
  }) => void;
};

export class ChildComponent {
  private properties: ChildProps;
  private parentProps: ParentProps = {};
  private busConfig: FramebusConfig;

  constructor(props: ChildProps = {}) {
    this.properties = props;
    this.on();
    this.busConfig = initialize({
      channel: window.location.hash.slice(1, location.hash.length),
    });
  }

  on() {
    emit(this.busConfig, "child-ready", {}, (props) => {
      this.parentProps = props as ParentProps;
      this.onCreate();
    });
  }

  onCreate() {
    console.log("I got called");
    if (typeof this.properties?.onCreate === "function") {
      this.properties.onCreate({
        // methods: this.parentProps.methods,
        properties: this.parentProps.properties,
      });
    }
  }
}
