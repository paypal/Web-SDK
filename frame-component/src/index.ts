import { ChildComponent, ChildProps } from "./child-component";
import { ParentComponent, ParentProps } from "./parent-component";
import { uniqueID } from "./utils";

export function parent(options: ParentProps): ParentComponent {
  return new ParentComponent(options);
}

export function child(options: ChildProps): ChildComponent {
  return new ChildComponent(options);
}

