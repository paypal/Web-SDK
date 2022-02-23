import { ChildComponent, ChildOptions } from "./child-component";

export function createChild(options: ChildOptions) {
  const component = new ChildComponent(options);

  return component;
}
