import { ChildComponent, ChildOptions } from "./child-component";

export function createChild(options: ChildOptions) {
  return new ChildComponent(options);
}
