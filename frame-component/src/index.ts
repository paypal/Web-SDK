import { ChildComponent, ChildProps } from "./child-component";
import { ParentComponent, ParentProps } from "./parent-component";

export function createParent(options: ParentProps): ParentComponent {
  return new ParentComponent(options);
}

export function createChild(options: ChildProps): ChildComponent {
  return new ChildComponent(options);
}
