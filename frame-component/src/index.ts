import { ChildComponent, ChildOptions } from "./child-component";
import { ParentComponent, ParentOptions } from "./parent-component";

export function createParent(options: ParentOptions): ParentComponent {
  return new ParentComponent(options);
}

export function createChild(options: ChildOptions): ChildComponent {
  return new ChildComponent(options);
}
