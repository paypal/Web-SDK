import { ParentComponent, ParentOptions } from "./parent-component";

export function createParent(options: ParentOptions): ParentComponent {
  return new ParentComponent(options);
}
