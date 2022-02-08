import type { ParentProps } from "./parent-component";
import { emit, FramebusConfig, initialize, on } from "framebus";

export type ChildProps = {
  onCreate?: (props?: {
    properties: ParentProps["properties"];
  }) => void;
  methods?: ParentProps["methods"];
  hooks?: ParentProps["hooks"];
};

export class ChildComponent {
  private properties: ChildProps;
  private parentProps: ParentProps = {};
  private busConfig: FramebusConfig;

  methods: { [key: string]: Function } = {};

  constructor(options: ChildProps) {
    this.properties = options;
    this.busConfig = initialize({
      channel: window.location.hash.slice(1, window.location.hash.length),
    });
    this.handShake();
  }

  private handShake() {
    emit(this.busConfig, "child-ready", {}, (props) => {
      this.parentProps = props as ParentProps;
      if (Array.isArray(this.properties.methods) && this.properties.methods.length) {
        this.setMethods(this.properties.methods);
      }
      if (this.properties.hooks && Object.keys(this.properties.hooks).length) {
        this.setHooks(this.properties.hooks);
      }
      this.onCreate();
    });
  }

  private setMethods(methods: Array<string>) {
    for (const methodName of methods) {
      this.methods[methodName] = (...args: any) => {
        emit(this.busConfig, `${methodName}-parent-method`, { args });
      }
    }
  }

  private setHooks(hooksMap: { [key: string]: Function }) {
    Object.keys(hooksMap).forEach((methodName) => {
      on(this.busConfig, `${methodName}-parent-method`, (data) => {
        const args = data.args as unknown[];
        hooksMap[methodName](...args)
      });
    })
  }

  private onCreate() {
    if (typeof this.properties?.onCreate === "function") {
      this.properties.onCreate({
        // methods: this.parentProps.methods,
        properties: this.parentProps.properties,
      });
    }
  }
}
