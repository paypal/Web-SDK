// import type { ParentProps } from "./parent-component";
// import { on as onFramebus, FramebusConfig, initialize } from "framebus";

type ChildProps = {
  // onCreate?: (props?: {
  //   methods: ParentProps["methods"];
  //   properties: ParentProps["properties"];
  // }) => void;
  // origin: string;
};

export class ChildComponent {
  // private properties: ChildProps;
  // private parentProps: ParentProps = {};
  // private busConfig: FramebusConfig;

  constructor(props: ChildProps = {}) {
    // this.properties = props;
    // this.on();
    // this.busConfig = initialize({ origin: this.properties.origin });
  }

  // on() {
  //   onFramebus(this.busConfig, "on-handshake", (props) => {
  //     this.parentProps = props;
  //     this.onCreate();
  //   });
  // }

  // onCreate() {
  //   if (typeof this.properties?.onCreate === "function") {
  //     this.properties.onCreate({
  //       methods: this.parentProps.methods,
  //       properties: this.parentProps.properties,
  //     });
  //   }
  // }
}
