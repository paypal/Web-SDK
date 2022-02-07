import { ChildComponent, ChildProps } from "./child-component";
import { ParentComponent, ParentProps } from "./parent-component";
import uuid from "@braintree/uuid";

export function createParent(options: ParentProps): ParentComponent {

  options.channel = options.channel || uuid();

  return new ParentComponent(options);
}

export function createChild(options: ChildProps): ChildComponent {
  return new ChildComponent(options);
}

